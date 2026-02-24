import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sparkles,
  Clock,
  Flame,
  Film,
  Search,
  Zap,
  Mic,
  MessageSquare,
  Bot,
} from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../../types";
import { movieService } from "../../services/movieService";
import MovieSlider from "../../components/MovieSlider/MovieSlider";

import { mockMovies } from "../../data/mockData";
import { trendingMovies } from "../../data/trendingData";
import { FEATURED_MOVIE_ID } from "../../data/featuredMovieData";

const sectionHeaderVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  const [nowShowing, setNowShowing] = useState<Movie[]>(mockMovies);
  const [topRated, setTopRated] = useState<Movie[]>(trendingMovies);
  const [comingSoon, setComingSoon] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [nowShowingData, topRatedData, comingSoonData] =
          await Promise.all([
            movieService.getNowShowing(),
            movieService.getTopRated(),
            movieService.getComingSoon(),
          ]);
        if (nowShowingData.length > 0) setNowShowing(nowShowingData);
        if (topRatedData.length > 0) {
          // Keep only Avatar: Fire and Ash (3), Zootopia 2 (4), and F1: The Movie (6)
          const trendingIds = ["3", "4", "6"];
          const filteredTrending = topRatedData.filter((m) =>
            trendingIds.includes(m.id),
          );
          setTopRated(filteredTrending);
        }
        if (comingSoonData.length > 0) setComingSoon(comingSoonData);
      } catch {
        console.log("Using mock data");
      }
    };
    fetchMovies();
  }, []);

  const handleOpenAI = () => {
    window.dispatchEvent(new CustomEvent("open-cine-ai"));
  };

  const featuredMovie =
    [...nowShowing, ...topRated, ...comingSoon].find(
      (m) => m.id === FEATURED_MOVIE_ID,
    ) || mockMovies.find((m) => m.id === FEATURED_MOVIE_ID);

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1920&h=1080&fit=crop"
            alt="Cinema"
            className="w-full h-full object-cover opacity-40"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to bottom, var(--hero-overlay-from) 0%, var(--hero-overlay-to) 40%, var(--hero-overlay-from) 100%)`,
            }}
          />
        </div>

        <div className="container mx-auto max-w-[1200px] px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-[6px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-linear-to-r from-primary to-secondary text-white text-[10px] font-bold uppercase tracking-widest rounded shadow-md">
              <Sparkles size={14} />
              AI-Powered Experience
            </span>
            <h1 className="text-5xl md:text-6xl font-display font-bold leading-[1.1] mb-6 text-text-primary">
              Your Premium
              <span className="block bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
                {" "}
                Cinema Concierge
              </span>
            </h1>
            <p className="text-lg text-text-secondary max-w-lg mb-8 leading-relaxed mx-auto lg:mx-0">
              Discover movies, find the perfect seats, and book tickets with our
              AI assistant. Experience cinema like never before.
            </p>
            <div className="flex gap-4 justify-center lg:justify-start">
              <Link
                to="/movies"
                className="btn btn-primary btn-lg rounded shadow-lg"
              >
                Explore Movies
              </Link>
              <button
                onClick={handleOpenAI}
                className="btn btn-secondary btn-lg rounded"
              >
                Talk to CineAI
              </button>
            </div>
          </motion.div>

          {/* Featured Movie */}
          <motion.div
            className="hidden lg:flex justify-end pl-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Link
              to={`/movie/${featuredMovie?.id}`}
              className="flex gap-6 p-5 rounded-lg max-w-[400px] bg-bg-card border border-border card-hover shadow-lg transition-all hover:border-primary/50 group"
            >
              <img
                src={featuredMovie?.posterUrl}
                alt={featuredMovie?.title}
                className="w-[140px] h-[210px] object-cover rounded shadow-md transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />
              <div className="flex flex-col justify-center gap-3">
                <span className="self-start px-3 py-1 text-[10px] font-bold rounded bg-linear-to-r from-accent-gold to-amber-500 text-white shadow-sm uppercase tracking-wider">
                  Featured
                </span>
                <h3 className="text-xl font-semibold leading-tight text-text-primary group-hover:text-primary transition-colors">
                  {featuredMovie?.title}
                </h3>
                <p className="text-sm text-text-secondary">
                  {featuredMovie?.genres?.slice(0, 2).join(" • ")}
                </p>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Now Showing */}
      <section className="mt-24 container mx-auto max-w-[1200px] px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between mb-6"
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <Film size={24} className="text-primary" />
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              Now Showing
            </h2>
          </div>
          <Link
            to="/movies?filter=now-showing"
            className="flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
          >
            See All <ChevronRight size={18} />
          </Link>
        </motion.div>

        <MovieSlider movies={nowShowing} />
      </section>

      {/* Trending (formerly Top Rated) */}
      <section className="mt-24 container mx-auto max-w-[1200px] px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between mb-6"
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <Flame size={24} className="text-primary" />
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              Trending
            </h2>
          </div>
          <Link
            to="/movies?filter=top-rated"
            className="flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
          >
            See All <ChevronRight size={18} />
          </Link>
        </motion.div>

        <MovieSlider movies={topRated} />
      </section>

      {/* Coming Soon */}
      <section className="mt-24 container mx-auto max-w-[1200px] px-6 lg:px-8">
        <motion.div
          className="flex items-center justify-between mb-6"
          variants={sectionHeaderVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-2">
            <Clock size={24} className="text-primary" />
            <h2 className="text-2xl font-display font-semibold text-text-primary">
              Coming Soon
            </h2>
          </div>
          <Link
            to="/movies?filter=coming-soon"
            className="flex items-center gap-1 text-primary font-medium text-sm hover:gap-2 transition-all"
          >
            See All <ChevronRight size={18} />
          </Link>
        </motion.div>

        <MovieSlider movies={comingSoon} />
      </section>

      {/* AI Feature Promo */}
      <section className="mt-24 mb-20 container mx-auto max-w-[1200px] px-6 lg:px-8">
        <motion.div
          className="group relative p-12 rounded-4xl overflow-hidden border border-white/10 dark:border-white/5 bg-bg-card/50 backdrop-blur-xl shadow-2xl"
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Animated Background Gradients */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] opacity-50 group-hover:opacity-70 transition-opacity duration-1000 pointer-events-none" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[400px] h-[400px] bg-secondary/20 rounded-full blur-[100px] opacity-40 group-hover:opacity-60 transition-opacity duration-1000 pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16">
            <div className="flex-1 space-y-8 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-2">
                <Bot size={16} className="animate-pulse" />
                Next-Gen Assistant
              </div>

              <div className="space-y-4">
                <h2 className="text-4xl md:text-5xl font-display font-bold text-text-primary leading-tight">
                  Meet{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-secondary to-primary bg-size-[200%_auto] animate-gradient text-glow-sm">
                    CineAI
                  </span>{" "}
                  Your
                  <br /> Movie Companion
                </h2>
                <p className="text-text-secondary text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
                  Ask about movies, get personalized recommendations, check seat
                  availability, and complete your booking - all through natural
                  conversation.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                {[
                  {
                    icon: Search,
                    title: "Smart Discovery",
                    desc: "Search by genre, mood or cast",
                  },
                  {
                    icon: Zap,
                    title: "Real-time Checks",
                    desc: "Instant seat availability",
                  },
                  {
                    icon: Sparkles,
                    title: "Personalized",
                    desc: "Tailored format suggestions",
                  },
                  {
                    icon: Mic,
                    title: "Voice Control",
                    desc: "Hands-free experience",
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={feature.title}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * i }}
                  >
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 text-primary">
                      <feature.icon size={20} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary text-sm">
                        {feature.title}
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">
                        {feature.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="shrink-0 flex flex-col items-center gap-6">
              <div className="relative p-1">
                <div className="absolute inset-0 bg-linear-to-r from-primary to-secondary rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                <button
                  onClick={handleOpenAI}
                  className="relative group/btn flex flex-col items-center justify-center w-48 h-48 rounded-full bg-bg-card border-4 border-white/10 hover:border-primary/30 transition-all duration-500 shadow-2xl overflow-hidden cursor-pointer"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-primary/5 to-secondary/5 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  <MessageSquare
                    size={40}
                    className="text-primary mb-3 transition-transform duration-500 group-hover/btn:scale-110 group-hover/btn:-rotate-12"
                  />
                  <span className="text-sm font-bold text-text-primary tracking-wider uppercase">
                    Start Chatting
                  </span>
                  <div className="mt-2 flex gap-1">
                    {[1, 2, 3].map((i) => (
                      <span
                        key={i}
                        className="w-1 h-1 rounded-full bg-primary/40 animate-bounce"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                  </div>
                </button>
              </div>
              <p className="text-[10px] text-text-muted font-medium uppercase tracking-[0.2em]">
                Available 24/7
              </p>
            </div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
