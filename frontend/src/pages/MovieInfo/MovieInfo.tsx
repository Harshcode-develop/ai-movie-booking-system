import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, ChevronLeft, Film, Play, Share2 } from "lucide-react";
import type { Movie, Review } from "../../types";
import { movieService, allMovies } from "../../services/movieService";
import ReviewSection from "./ReviewSection";
import { useAuth } from "../../context/AuthContext";
import { format } from "date-fns";

// Staggered animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function MovieInfo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, openAuthModal } = useAuth();
  const [movie, setMovie] = useState<Movie | null>(
    () => allMovies.find((m) => m.id === id) || null,
  );
  const [loading, setLoading] = useState(!movie);
  const [error, setError] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [reviews, setReviews] = useState<Review[]>([]);

  const fetchMovie = useCallback(async () => {
    try {
      if (!id) return;
      if (!movie) setLoading(true);
      const data = await movieService.getById(id);
      setMovie(data);
    } catch (err) {
      console.error("Failed to fetch movie", err);
      setError("Movie not found");
    } finally {
      setLoading(false);
    }
  }, [id, movie]);

  const fetchReviews = useCallback(async () => {
    if (!id) return;
    try {
      const result = await movieService.getReviews(id, 0, 20);
      setReviews(result.content || []);
    } catch {
      // Reviews may fail if backend is down, that's OK
      setReviews([]);
    }
  }, [id]);

  useEffect(() => {
    fetchMovie();
  }, [fetchMovie]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleRateNow = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    // Scroll to reviews section and open modal
    const reviewsEl = document.getElementById("reviews-section");
    if (reviewsEl) {
      reviewsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-text-muted text-sm animate-pulse">
            Loading movie details...
          </p>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 bg-bg-primary p-6 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative bg-bg-card border border-border p-12 rounded-3xl shadow-2xl max-w-md card-hover">
            <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary">
              <Film size={40} />
            </div>
            <h2 className="text-3xl font-display font-bold mb-3 text-text-primary">
              Movie Not Found
            </h2>
            <p className="text-text-secondary mb-8 leading-relaxed">
              We couldn't find the movie you're looking for. It might have been
              removed or the link might be broken.
            </p>
            <div className="flex flex-col gap-3">
              <Link
                to="/"
                className="btn btn-primary btn-lg w-full rounded-full shadow-lg shadow-primary/20"
              >
                Return to Home
              </Link>
              <button
                onClick={() => navigate(-1)}
                className="btn btn-secondary w-full rounded-full"
              >
                Go Back
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Banner - BookMyShow-inspired layout */}
      <div className="relative w-full">
        {/* Background Banner Image - more compact BMS style */}
        <div className="absolute inset-0 h-[400px] md:h-[440px] bg-[#1a1a1a]">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt=""
            className={`w-full h-full object-cover object-[center_25%] transition-opacity duration-700 ${imgLoaded ? "opacity-40" : "opacity-0"}`}
            loading="eager"
            onLoad={() => setImgLoaded(true)}
          />
          {!imgLoaded && <div className="absolute inset-0 skeleton" />}
          {/* Gradients to ensure text readability - matching BMS exact style */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to right, #1a1a1a 10%, #1a1a1a 25%, rgba(26, 26, 26, 0.7) 50%, rgba(26, 26, 26, 0) 100%)`,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, #1a1a1a 0%, rgba(26, 26, 26, 0.2) 50%, transparent 100%)`,
            }}
          />
        </div>

        {/* Navigation & Spacing */}
        <div className="relative z-10 max-w-[1200px] mx-auto px-6 lg:px-8 h-2" />

        {/* Movie Info Content - BMS-style: poster left, info right */}
        <div className="relative z-10 px-6 lg:px-8 pt-0 pb-0 max-w-[1200px] mx-auto min-h-[400px] md:min-h-[430px] flex items-center">
          <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center relative w-full">
            {/* Back Button positioned relative to card/poster - subtle and integrated */}
            <button
              onClick={() => navigate(-1)}
              className="absolute -left-10 md:-left-14 top-0 z-20 flex items-center justify-center w-10 h-10 rounded-full bg-black/20 backdrop-blur-sm text-white/50 hover:text-white transition-all duration-200 cursor-pointer"
              aria-label="Go back"
            >
              <ChevronLeft size={24} />
            </button>

            {/* Poster - compact BMS style */}
            <motion.div
              className="w-full max-w-[200px] md:max-w-[220px] lg:max-w-[240px] aspect-2/3 rounded-lg overflow-hidden shadow-2xl border border-white/10 shrink-0 relative mt-4 md:mt-0"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="relative group h-full">
                <div className="aspect-2/3 rounded-lg overflow-hidden shadow-2xl border border-white/20 h-full">
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                </div>
                {/* "In cinemas" / "Coming soon" tag */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-r from-primary to-secondary text-white text-center py-2 text-[10px] font-bold tracking-wider uppercase rounded-b-lg">
                  {movie.isComingSoon ? "Coming Soon" : "In Cinemas"}
                </div>
              </div>
            </motion.div>

            {/* Movie Details - Right Column */}
            <motion.div
              className="flex-1 space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {/* Top Actions: Title & Share */}
              <div className="flex justify-between items-start w-full">
                <motion.h1
                  className="text-2xl lg:text-3xl font-display font-bold text-white leading-tight text-left"
                  variants={itemVariants}
                >
                  {movie.title}
                </motion.h1>
                <button
                  className="flex items-center gap-2 px-4 py-2 rounded bg-black/30 hover:bg-black/50 backdrop-blur-md border border-white/10 text-white text-sm font-medium transition-all group cursor-pointer"
                  title="Share"
                >
                  <Share2
                    size={18}
                    className="transition-transform group-hover:scale-110"
                  />
                  <span>Share</span>
                </button>
              </div>

              {/* Rating Box - compact - BMS style */}
              <motion.div
                className="flex items-center gap-4 py-2 px-3 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 w-fit"
                variants={itemVariants}
              >
                {!movie.isComingSoon ? (
                  <>
                    <div className="flex items-center gap-2 text-white">
                      <Star className="text-primary fill-primary" size={24} />
                      <span className="font-bold text-xl">
                        {movie.rating.average}/10
                      </span>
                      <span className="text-xs text-white/50">
                        ({(movie.rating.count / 1000).toFixed(1)}K Votes)
                      </span>
                    </div>
                    <button
                      onClick={handleRateNow}
                      className="px-3 py-1 rounded bg-white text-black text-xs font-bold hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      Rate now
                    </button>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-2 text-white">
                      <Star
                        className="text-accent-gold fill-accent-gold"
                        size={24}
                      />
                      <span className="font-bold text-xl">
                        {((movie.rating?.count || 12000) / 1000).toFixed(1)}K
                      </span>
                      <span className="text-xs text-white/50">
                        are interested
                      </span>
                    </div>
                    <button className="px-3 py-1 rounded bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-colors cursor-pointer">
                      I'm interested
                    </button>
                  </>
                )}
              </motion.div>

              {/* Metadata: Duration, Genre, Release */}
              <motion.div
                className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/90 font-medium pt-2"
                variants={itemVariants}
              >
                {!movie.isComingSoon && (
                  <>
                    <span>
                      {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                    </span>
                    <span className="text-white/40">•</span>
                  </>
                )}
                <span>{movie.genres.join(", ")}</span>
                <span className="text-white/40">•</span>
                <span>{movie.certificate}</span>
                <span className="text-white/40">•</span>
                <span>
                  {format(new Date(movie.releaseDate), "d MMM, yyyy")}
                </span>
              </motion.div>

              {/* Format & Language Tags */}
              <motion.div
                className="flex flex-wrap gap-3 pt-1"
                variants={itemVariants}
              >
                <div className="flex gap-2">
                  <span className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
                    2D
                  </span>
                  <span className="bg-white/10 px-2.5 py-1 rounded text-[10px] font-bold text-white border border-white/10 uppercase tracking-widest">
                    3D
                  </span>
                </div>
                <div className="flex gap-2">
                  {movie.languages.slice(0, 3).map((lang) => (
                    <span
                      key={lang}
                      className="bg-primary/20 px-2.5 py-1 rounded text-[10px] font-bold text-white border border-primary/30 uppercase tracking-widest"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="flex flex-wrap items-center gap-4 pt-6"
                variants={itemVariants}
              >
                {!movie.isComingSoon && (
                  <Link
                    to={`/booking/${movie.id}`}
                    className="bg-primary hover:bg-primary/90 text-white font-bold text-xs px-8 py-2.5 rounded shadow-lg shadow-primary/20 transition-all active:scale-95"
                  >
                    Book Tickets
                  </Link>
                )}

                {movie.trailerUrl && (
                  <a
                    href={movie.trailerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2 rounded border border-white/20 hover:bg-white/10 text-white text-xs font-medium transition-colors cursor-pointer"
                  >
                    <Play size={14} fill="currentColor" />
                    Trailer
                  </a>
                )}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 lg:px-8 max-w-[1200px] ">
        {/* About the Movie Section - Exactly like BMS */}
        <motion.section
          className="mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-2xl font-bold mb-4 text-text-primary">
            About the movie
          </h2>
          <p className="text-text-secondary leading-relaxed max-w-4xl">
            {movie.description}
          </p>
        </motion.section>

        {/* Cast Section */}
        <motion.section
          className="mt-12 section-animate"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <h2 className="text-2xl font-bold mb-2 text-text-primary">
            Top Cast
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6">
            {movie.cast && movie.cast.length > 0
              ? movie.cast.map((actor, idx) => (
                  <motion.div
                    key={idx}
                    className="flex flex-col items-center text-center gap-2 group"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08 }}
                  >
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-border shadow-md group-hover:border-primary transition-colors duration-300">
                      <img
                        src={
                          actor.imageUrl ||
                          `https://ui-avatars.com/api/?name=${actor.name}&background=6366f1&color=fff`
                        }
                        alt={actor.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                      />
                    </div>
                    <div>
                      <h5 className="font-semibold text-sm text-text-primary">
                        {actor.name}
                      </h5>
                      <p className="text-xs text-text-muted">{actor.role}</p>
                    </div>
                  </motion.div>
                ))
              : [1, 2, 3, 4, 5, 6].map((_, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center text-center gap-2"
                  >
                    <div className="w-24 h-24 rounded-full skeleton" />
                    <div className="w-20 h-4 rounded skeleton" />
                  </div>
                ))}
          </div>
        </motion.section>

        {/* Reviews Section */}
        <motion.section
          id="reviews-section"
          className="mt-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
        >
          <ReviewSection
            movieId={movie.id}
            reviews={reviews}
            onReviewAdded={fetchReviews}
          />
        </motion.section>
      </div>
    </div>
  );
}
