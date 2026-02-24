import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Info,
  Search,
  Heart,
  ChevronLeft,
  ChevronDown,
  Check,
} from "lucide-react";
import type { Movie, Show } from "../types";
import { movieService, allMovies } from "../services/movieService";
import { format, addDays } from "date-fns";

export default function SelectShowtime() {
  const { movieId } = useParams<{ movieId: string }>();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(
    () => allMovies.find((m) => m.id === movieId) || null,
  );
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(!movie);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Filter States
  const [selectedPrice, setSelectedPrice] = useState("Price Range");
  const [selectedFormat, setSelectedFormat] = useState("Special Formats");
  const [selectedTime, setSelectedTime] = useState("Preferred Time");

  // Dropdown States
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter Options
  const priceOptions = ["0-200", "201-400", "400+"];
  const formatOptions = ["IMAX 3D", "FOUR DX", "STANDARD 3D", "STANDARD 2D"];
  const timeOptions = [
    { label: "Morning", sub: "12:00-11:59 AM" },
    { label: "Afternoon", sub: "12:00-03:59 PM" },
    { label: "Evening", sub: "04:00-06:59 PM" },
    { label: "Night", sub: "07:00-11:59 PM" },
  ];

  // Generate next 7 days
  const dates = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => addDays(new Date(), i));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!movieId) return;
        if (!movie) setLoading(true);
        const movieData = await movieService.getById(movieId);
        setMovie(movieData);

        // Try fetching from backend API first
        try {
          const { theaterService } = await import("../services/theaterService");
          const dateStr = format(selectedDate, "yyyy-MM-dd");
          const backendShows = await theaterService.getShows(movieId, dateStr);
          if (backendShows && backendShows.length > 0) {
            setShows(backendShows);
            return;
          }
        } catch {
          // API not available, fall through to mock data
        }

        // FALLBACK: Mock data when backend has no shows
        const mockShows: Show[] = [
          {
            id: "s1-imax",
            movieId: movieId,
            theaterId: "t1",
            screenId: "scr1",
            showDate: format(selectedDate, "yyyy-MM-dd"),
            showTime: "10:00 AM",
            format: "IMAX_3D",
            language: "Hindi",
            basePrices: { CLASSIC: 250, PRIME: 350, PREMIUM: 450, VIP: 600 },
            isActive: true,
            movieTitle: movieData.title,
            moviePosterUrl: movieData.posterUrl,
            theaterName: "PVR: ICON Pavillion, Pune",
            theaterCity: "Pune",
          },
          {
            id: "s2-4dx",
            movieId: movieId,
            theaterId: "t2",
            screenId: "scr2",
            showDate: format(selectedDate, "yyyy-MM-dd"),
            showTime: "01:30 PM",
            format: "FOUR_DX",
            language: "Hindi",
            basePrices: { CLASSIC: 300, PRIME: 400, PREMIUM: 500, VIP: 700 },
            isActive: true,
            movieTitle: movieData.title,
            moviePosterUrl: movieData.posterUrl,
            theaterName: "Cinepolis: Westend Mall, Aundh",
            theaterCity: "Pune",
          },
          {
            id: "s3-standard",
            movieId: movieId,
            theaterId: "t3",
            screenId: "scr3",
            showDate: format(selectedDate, "yyyy-MM-dd"),
            showTime: "04:15 PM",
            format: "STANDARD_3D",
            language: "Hindi",
            basePrices: { CLASSIC: 180, PRIME: 280, PREMIUM: 380, VIP: 550 },
            isActive: true,
            movieTitle: movieData.title,
            moviePosterUrl: movieData.posterUrl,
            theaterName: "INOX: Bund Garden",
            theaterCity: "Pune",
          },
          {
            id: "s4-standard",
            movieId: movieId,
            theaterId: "t4",
            screenId: "scr4",
            showDate: format(selectedDate, "yyyy-MM-dd"),
            showTime: "07:45 PM",
            format: "STANDARD_2D",
            language: "Hindi",
            basePrices: { CLASSIC: 150, PRIME: 250, PREMIUM: 350, VIP: 500 },
            isActive: true,
            movieTitle: movieData.title,
            moviePosterUrl: movieData.posterUrl,
            theaterName: "City Pride: Kothrud",
            theaterCity: "Pune",
          },
        ];
        setShows(mockShows);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [movieId, selectedDate]);

  // Group shows by theater with filtering
  const theatersWithShows = useMemo(() => {
    const filteredShows = shows.filter((show) => {
      // Filter by Format
      if (selectedFormat !== "Special Formats") {
        const fmt = selectedFormat.replace(" ", "_");
        if (show.format !== fmt) return false;
      }

      // Filter by Time
      if (selectedTime !== "Preferred Time") {
        const timeStr = show.showTime.toLowerCase();
        const hour = parseInt(timeStr.split(":")[0]);
        const isPM = timeStr.includes("pm");
        const normalizedHour =
          isPM && hour !== 12 ? hour + 12 : !isPM && hour === 12 ? 0 : hour;

        if (
          selectedTime === "Morning" &&
          !(normalizedHour >= 0 && normalizedHour < 12)
        )
          return false;
        if (
          selectedTime === "Afternoon" &&
          !(normalizedHour >= 12 && normalizedHour < 16)
        )
          return false;
        if (
          selectedTime === "Evening" &&
          !(normalizedHour >= 16 && normalizedHour < 19)
        )
          return false;
        if (
          selectedTime === "Night" &&
          !(normalizedHour >= 19 && normalizedHour < 24)
        )
          return false;
      }

      // Filter by Price (based on CLASSIC price)
      if (selectedPrice !== "Price Range") {
        const classicPrice = show.basePrices.CLASSIC || 0;
        if (selectedPrice === "0-200" && classicPrice > 200) return false;
        if (
          selectedPrice === "201-400" &&
          (classicPrice <= 200 || classicPrice > 400)
        )
          return false;
        if (selectedPrice === "400+" && classicPrice <= 400) return false;
      }

      return true;
    });

    const grouped: Record<string, Show[]> = {};
    filteredShows.forEach((show) => {
      if (!grouped[show.theaterName]) {
        grouped[show.theaterName] = [];
      }
      grouped[show.theaterName].push(show);
    });
    return Object.entries(grouped).map(([name, shows]) => ({ name, shows }));
  }, [shows, selectedFormat, selectedTime, selectedPrice]);

  if (loading && !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="min-h-screen bg-bg-primary pb-20">
      {/* Title Header */}
      <div className="bg-bg-card border-b border-border pt-6 pb-6">
        <div className="container mx-auto px-4 max-w-[1200px] flex items-start gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-bg-secondary transition-colors mt-1 cursor-pointer"
            aria-label="Go back"
          >
            <ChevronLeft size={22} />
          </button>
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-text-primary">
              {movie.title} - ({movie.languages[0]})
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] sm:text-xs border border-border px-2 py-0.5 rounded-full text-text-muted uppercase font-bold">
                Movie runtime: {Math.floor(movie.duration / 60)}h{" "}
                {movie.duration % 60}m
              </span>
              <span className="text-[10px] sm:text-xs border border-border px-2 py-0.5 rounded-full text-text-muted uppercase font-bold">
                {movie.certificate}
              </span>
              {movie.genres.map((genre) => (
                <span
                  key={genre}
                  className="text-[10px] sm:text-xs border border-border px-2 py-0.5 rounded-full text-text-muted uppercase font-bold"
                >
                  {genre}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar (Date & Filters) */}
      <div className="sticky top-0 z-40 bg-bg-card border-b border-border shadow-sm">
        <div className="container mx-auto px-4 max-w-[1200px] flex items-center justify-between h-16">
          {/* Date Selector */}
          <div className="flex items-stretch h-full overflow-x-auto no-scrollbar">
            {dates.map((date) => {
              const dateStr = format(date, "yyyy-MM-dd");
              const isSelected = dateStr === format(selectedDate, "yyyy-MM-dd");
              return (
                <button
                  key={date.toString()}
                  onClick={() => setSelectedDate(date)}
                  className={`flex flex-col items-center justify-center px-4 min-w-[70px] transition-all relative cursor-pointer ${
                    isSelected
                      ? "text-white"
                      : "text-text-secondary hover:text-primary"
                  }`}
                >
                  {isSelected && (
                    <motion.div
                      layoutId="dateBg"
                      className="absolute inset-0 bg-primary"
                    />
                  )}
                  <span className="text-[10px] font-bold uppercase relative z-10 tracking-tighter">
                    {format(date, "EEE")}
                  </span>
                  <span className="text-lg font-bold relative z-10 leading-none my-1">
                    {format(date, "d")}
                  </span>
                  <span className="text-[10px] font-bold uppercase relative z-10 tracking-tighter">
                    {format(date, "MMM")}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Filters Bar */}
          <div
            className="hidden lg:flex items-center gap-2 text-sm border-l border-border h-full pl-4 ml-4"
            ref={dropdownRef}
          >
            <div className="px-3 py-2 border border-border rounded hover:bg-bg-secondary flex items-center gap-2 text-text-secondary cursor-default">
              <span className="font-bold">{movie.languages[0]} • 2D</span>
            </div>

            {/* Price Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(activeDropdown === "price" ? null : "price")
                }
                className={`px-3 py-2 border rounded flex items-center gap-2 text-text-secondary cursor-pointer transition-colors ${activeDropdown === "price" ? "border-primary bg-primary/5" : "border-border hover:bg-bg-secondary"}`}
              >
                <span
                  className={
                    selectedPrice !== "Price Range"
                      ? "text-primary font-bold"
                      : ""
                  }
                >
                  {selectedPrice}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${activeDropdown === "price" ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "price" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 py-2"
                  >
                    <button
                      onClick={() => {
                        setSelectedPrice("Price Range");
                        setActiveDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-bg-secondary flex items-center justify-between"
                    >
                      All Prices
                      {selectedPrice === "Price Range" && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>
                    <div className="h-px bg-border my-1" />
                    {priceOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedPrice(opt);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-bg-secondary flex items-center justify-between"
                      >
                        ₹{opt}
                        {selectedPrice === opt && (
                          <Check size={14} className="text-primary" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Formats Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "format" ? null : "format",
                  )
                }
                className={`px-3 py-2 border rounded flex items-center gap-2 text-text-secondary cursor-pointer transition-colors ${activeDropdown === "format" ? "border-primary bg-primary/5" : "border-border hover:bg-bg-secondary"}`}
              >
                <span
                  className={
                    selectedFormat !== "Special Formats"
                      ? "text-primary font-bold"
                      : ""
                  }
                >
                  {selectedFormat}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${activeDropdown === "format" ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "format" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-1 w-48 bg-bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 py-2"
                  >
                    <button
                      onClick={() => {
                        setSelectedFormat("Special Formats");
                        setActiveDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-bg-secondary flex items-center justify-between"
                    >
                      All Formats
                      {selectedFormat === "Special Formats" && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>
                    <div className="h-px bg-border my-1" />
                    {formatOptions.map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setSelectedFormat(opt);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-bg-secondary flex items-center justify-between"
                      >
                        {opt}
                        {selectedFormat === opt && (
                          <Check size={14} className="text-primary" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Time Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() =>
                  setActiveDropdown(activeDropdown === "time" ? null : "time")
                }
                className={`px-3 py-2 border rounded flex items-center gap-2 text-text-secondary cursor-pointer transition-colors ${activeDropdown === "time" ? "border-primary bg-primary/5" : "border-border hover:bg-bg-secondary"}`}
              >
                <span
                  className={
                    selectedTime !== "Preferred Time"
                      ? "text-primary font-bold"
                      : ""
                  }
                >
                  {selectedTime}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${activeDropdown === "time" ? "rotate-180" : ""}`}
                />
              </button>

              <AnimatePresence>
                {activeDropdown === "time" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full right-0 mt-1 w-56 bg-bg-card border border-border rounded-lg shadow-xl overflow-hidden z-50 py-2"
                  >
                    <button
                      onClick={() => {
                        setSelectedTime("Preferred Time");
                        setActiveDropdown(null);
                      }}
                      className="w-full px-4 py-2 text-left text-xs hover:bg-bg-secondary flex items-center justify-between"
                    >
                      All Times
                      {selectedTime === "Preferred Time" && (
                        <Check size={14} className="text-primary" />
                      )}
                    </button>
                    <div className="h-px bg-border my-1" />
                    {timeOptions.map((opt) => (
                      <button
                        key={opt.label}
                        onClick={() => {
                          setSelectedTime(opt.label);
                          setActiveDropdown(null);
                        }}
                        className="w-full px-4 py-2 text-left flex flex-col hover:bg-bg-secondary"
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-xs font-bold">{opt.label}</span>
                          {selectedTime === opt.label && (
                            <Check size={14} className="text-primary" />
                          )}
                        </div>
                        <span className="text-[10px] text-text-muted">
                          {opt.sub}
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="p-2 text-text-muted hover:text-primary transition-colors cursor-pointer ml-2">
              <Search size={20} />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-[1200px] mt-4">
        {/* Availability Legend */}
        <div className="flex justify-end gap-4 mb-4 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span>Fast Filling</span>
          </div>
        </div>

        {/* Theaters List */}
        <div className="space-y-4">
          {theatersWithShows.map(({ name, shows }) => (
            <div
              key={name}
              className="bg-bg-card border border-border rounded-lg overflow-hidden flex flex-col sm:flex-row card-hover shadow-sm"
            >
              {/* Theater Info */}
              <div className="p-5 sm:w-[350px] border-b sm:border-b-0 sm:border-r border-border flex gap-4">
                <Heart
                  size={18}
                  className="text-text-muted mt-1 cursor-pointer hover:text-accent-red transition-colors"
                />
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-sm uppercase text-text-primary leading-tight">
                      {name}
                    </h3>
                    <Info
                      size={14}
                      className="text-text-muted cursor-pointer hover:text-primary"
                    />
                  </div>
                  <div className="flex gap-4 mt-3">
                    <div className="flex flex-col items-center gap-1 text-[8px] text-orange-400 font-bold uppercase">
                      <span className="p-1 px-2 border border-orange-200/50 rounded bg-orange-50/50">
                        🍱 F&B
                      </span>
                    </div>
                    <div className="flex flex-col items-center gap-1 text-[8px] text-teal-400 font-bold uppercase">
                      <span className="p-1 px-2 border border-teal-200/50 rounded bg-teal-50/50">
                        🎟️ M-Ticket
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Showtimes Grid */}
              <div className="p-5 flex-1 relative min-h-[140px]">
                <div className="flex flex-wrap gap-4">
                  {shows.map((show) => (
                    <div key={show.id} className="flex flex-col items-center">
                      <Link
                        to={`/seats/${show.id}`}
                        state={{ show }}
                        className="group flex flex-col items-center justify-center min-w-[100px] h-[52px] border border-green-500 rounded text-green-600 font-bold text-xs hover:bg-green-500 hover:text-white transition-all duration-200"
                      >
                        <span>{show.showTime}</span>
                        <span className="text-[9px] opacity-70 group-hover:opacity-100">
                          {show.format.replace("_", " ")}
                        </span>
                      </Link>
                      <span className="text-[9px] text-text-muted mt-1 uppercase font-bold tracking-tighter opacity-70">
                        Cancellation available
                      </span>
                    </div>
                  ))}
                </div>
                <div className="absolute bottom-4 left-5 flex gap-4 text-[9px] font-bold text-text-muted uppercase tracking-tighter">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span>Non-cancellable</span>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {theatersWithShows.length === 0 && (
            <div className="text-center py-20 bg-bg-card rounded-xl border border-border shadow-inner">
              <div className="w-20 h-20 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="text-text-muted" size={40} />
              </div>
              <h3 className="text-xl font-bold text-text-primary mb-2">
                No shows found
              </h3>
              <p className="text-text-secondary max-w-xs mx-auto">
                No shows match your criteria for the selected filters. Try
                adjusting them.
              </p>
              <button
                onClick={() => {
                  setSelectedPrice("Price Range");
                  setSelectedFormat("Special Formats");
                  setSelectedTime("Preferred Time");
                }}
                className="mt-6 text-primary font-bold hover:underline cursor-pointer"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
