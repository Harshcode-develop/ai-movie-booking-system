import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Sun,
  Moon,
  User as UserIcon,
  LogOut,
  Ticket,
  Film,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { allMovies } from "../../services/movieService";

interface NavbarProps {
  onOpenAuth: () => void;
}

export default function Navbar({ onOpenAuth }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setShowSearchDropdown(false);
    }
  };

  const searchResults = searchQuery.trim()
    ? allMovies
        .filter(
          (m) =>
            m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            m.genres.some((g) =>
              g.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        )
        .slice(0, 5)
    : [];

  return (
    <nav className="fixed top-0 left-0 right-0 h-[60px] z-100 border-b border-border glass">
      <div className="container mx-auto px-6 lg:px-8 max-w-[1200px] flex items-center justify-between h-full gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-primary shrink-0">
          <Film size={28} />
          <span className="font-display text-2xl font-bold bg-linear-to-r from-primary to-secondary bg-clip-text text-transparent">
            CineMax
          </span>
        </Link>

        {/* Search */}
        <div className="hidden md:block flex-1 max-w-[500px] relative">
          <form onSubmit={handleSearch}>
            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
            />
            <input
              type="text"
              placeholder="Search movies, theaters..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              className="w-full py-2 px-4 pl-10 bg-bg-secondary border border-border rounded text-text-primary text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted"
            />
          </form>

          {/* Instant Search Dropdown */}
          <AnimatePresence>
            {showSearchDropdown && searchQuery.trim() && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="absolute top-[calc(100%+0.5rem)] left-0 w-full bg-bg-card border border-border shadow-xl rounded-xl overflow-hidden z-110"
              >
                {searchResults.length > 0 ? (
                  <div className="py-2">
                    {searchResults.map((movie) => (
                      <Link
                        key={movie.id}
                        to={`/movie/${movie.id}`}
                        onClick={() => {
                          setShowSearchDropdown(false);
                          setSearchQuery("");
                        }}
                        className="flex items-center gap-3 px-4 py-2 hover:bg-bg-tertiary transition-colors"
                      >
                        <img
                          src={movie.posterUrl}
                          alt={movie.title}
                          className="w-10 h-14 object-cover rounded shadow-sm"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-text-primary truncate">
                            {movie.title}
                          </h4>
                          <p className="text-xs text-text-secondary truncate">
                            {movie.genres.join(", ")} • {movie.languages[0]}
                          </p>
                        </div>
                      </Link>
                    ))}
                    <div className="border-t border-border mt-2 pt-2 px-4">
                      <button
                        onClick={handleSearch}
                        className="text-xs font-bold text-primary hover:underline hover:text-primary-hover w-full text-center pb-1 cursor-pointer"
                      >
                        View All Results
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 text-center text-sm text-text-muted">
                    No movies found for "{searchQuery}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme Toggle */}
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors cursor-pointer"
            onClick={toggleTheme}
            whileTap={{ scale: 0.9 }}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            <AnimatePresence mode="wait">
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {isAuthenticated ? (
            <>
              <Link
                to="/my-tickets"
                className="hidden md:flex items-center gap-1.5 px-3 py-2 text-text-secondary hover:text-text-primary hover:bg-bg-tertiary rounded-lg transition-colors text-sm font-medium"
              >
                <Ticket size={18} />
                <span>My Tickets</span>
              </Link>

              <div className="relative">
                <button
                  className="w-9 h-9 rounded-full bg-linear-to-r from-primary to-secondary flex items-center justify-center text-white font-semibold text-sm cursor-pointer shadow-md"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  {user?.fullName?.charAt(0) || user?.email?.charAt(0) || "U"}
                </button>

                <AnimatePresence>
                  {showUserMenu && (
                    <>
                      {/* Backdrop to close menu */}
                      <div
                        className="fixed inset-0 z-99"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <motion.div
                        className="absolute top-[calc(100%+0.5rem)] right-0 min-w-[220px] p-2 rounded-xl bg-bg-card border border-border shadow-xl z-100"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                      >
                        <div className="p-3 border-b border-border mb-2">
                          <p className="font-semibold text-text-primary">
                            {user?.fullName || "User"}
                          </p>
                          <p className="text-xs text-text-muted truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/myspace"
                          className="flex items-center gap-2 p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <UserIcon size={16} />
                          <span>MySpace</span>
                        </Link>
                        <Link
                          to="/my-tickets"
                          className="flex items-center gap-2 p-2 rounded-lg text-text-secondary hover:bg-bg-tertiary hover:text-text-primary transition-colors text-sm"
                          onClick={() => setShowUserMenu(false)}
                        >
                          <Ticket size={16} />
                          <span>My Tickets</span>
                        </Link>
                        <button
                          className="w-full flex items-center gap-2 p-2 rounded-lg text-text-secondary hover:bg-red-500/10 hover:text-accent-red transition-colors text-sm text-left cursor-pointer"
                          onClick={() => {
                            logout();
                            setShowUserMenu(false);
                          }}
                        >
                          <LogOut size={16} />
                          <span>Logout</span>
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <button
              className="px-4 py-1.5 text-sm bg-linear-to-r from-primary to-secondary text-white font-medium rounded shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
              onClick={onOpenAuth}
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
