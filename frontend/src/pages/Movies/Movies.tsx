import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { movieService, allMovies } from "../../services/movieService";
import type { Movie } from "../../types";
import MovieCard from "../../components/MovieCard/MovieCard";

const LANGUAGES = ["All", "English", "Hindi"];
const GENRES = [
  "All",
  "Action",
  "Adventure",
  "Sci-Fi",
  "Drama",
  "Crime",
  "Animation",
  "Romance",
];

export default function Movies() {
  const navigate = useNavigate();
  const [movies, setMovies] = useState<Movie[]>(() => [...allMovies]);
  const [filteredMovies, setFilteredMovies] = useState<Movie[]>(() => [
    ...allMovies,
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("All");
  const [selectedGenre, setSelectedGenre] = useState("All");

  useEffect(() => {
    const fetchMovies = async () => {
      // Background fetch to ensure latest data without blocking UI
      if (movies.length === 0) setIsLoading(true);
      try {
        const data = await movieService.getAll();
        if (JSON.stringify(data) !== JSON.stringify(allMovies)) {
          setMovies(data);
        }
      } catch (error) {
        console.error("Failed to fetch movies:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMovies();
  }, []);

  useEffect(() => {
    let result = [...movies];

    if (searchQuery) {
      result = result.filter((m) =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedGenre !== "All") {
      result = result.filter((m) => m.genres.includes(selectedGenre));
    }

    if (selectedLanguage !== "All") {
      result = result.filter((m) => m.languages?.includes(selectedLanguage));
    }

    setFilteredMovies(result);
  }, [searchQuery, selectedLanguage, selectedGenre, movies]);

  return (
    <div className="min-h-screen pb-20 pt-10">
      <div className="container mx-auto max-w-[1200px] px-6 lg:px-8">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
          <div className="flex items-start gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-bg-secondary transition-colors shrink-0 mt-1"
              aria-label="Go back"
            >
              <ChevronLeft size={22} />
            </button>
            <div>
              <h1 className="text-4xl font-display font-bold mb-2">
                Explore Movies
              </h1>
              <p className="text-text-secondary">
                Discover the latest blockbusters and all-time favorites
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-4 py-2 bg-bg-secondary border border-border rounded text-sm focus:outline-none focus:border-primary w-full sm:w-[320px] transition-all"
              />
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-col gap-6 mb-10">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-text-muted font-medium w-20">Genres:</span>
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                    selectedGenre === genre
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm">
            <span className="text-text-muted font-medium w-20">Languages:</span>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  onClick={() => setSelectedLanguage(lang)}
                  className={`px-4 py-1.5 rounded text-xs font-medium transition-all cursor-pointer ${
                    selectedLanguage === lang
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "bg-bg-secondary text-text-secondary hover:bg-bg-tertiary border border-border"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Movie Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="aspect-2/3 bg-bg-secondary rounded-lg animate-pulse"
              />
            ))}
          </div>
        ) : filteredMovies.length > 0 ? (
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            {filteredMovies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </motion.div>
        ) : (
          <div className="py-20 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-bg-secondary text-text-muted mb-6">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold mb-2">No movies found</h3>
            <p className="text-text-secondary">
              Try adjusting your filters or search query to find what you're
              looking for.
            </p>
            <button
              onClick={() => {
                setSelectedLanguage("All");
                setSelectedGenre("All");
                setSearchQuery("");
              }}
              className="mt-6 text-primary font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
