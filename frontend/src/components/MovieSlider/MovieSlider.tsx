import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Movie } from "../../types";
import MovieCard from "../MovieCard/MovieCard";

interface MovieSliderProps {
  movies: Movie[];
}

export default function MovieSlider({ movies }: MovieSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showArrows, setShowArrows] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to update arrow visibility
  const checkScroll = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [movies]);

  const scroll = (direction: "left" | "right") => {
    if (containerRef.current) {
      const { clientWidth } = containerRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      containerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      setTimeout(checkScroll, 500); // Check after animation
    }
  };

  if (movies.length === 0) return null;

  const hasMoreThanFive = movies.length > 5;

  if (!hasMoreThanFive) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 py-4">
        {movies.map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className="relative group/slider"
      onMouseEnter={() => setShowArrows(true)}
      onMouseLeave={() => setShowArrows(false)}
    >
      {/* Scroll Container */}
      <div
        ref={containerRef}
        onScroll={checkScroll}
        className="flex gap-6 overflow-x-auto no-scrollbar scroll-smooth py-4 snap-x snap-proximity"
      >
        {movies.map((movie, index) => (
          <div
            key={movie.id}
            className="w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(20%-19.2px)] shrink-0 grow-0 h-full snap-start"
          >
            <MovieCard movie={movie} index={index} />
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <AnimatePresence>
        {showArrows && (
          <>
            {/* Left Arrow */}
            {canScrollLeft && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scroll("left")}
                className="absolute left-[-24px] top-[calc(50%-2rem)] -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md shadow-2xl flex items-center justify-center text-white hover:bg-primary border border-white/20 transition-all duration-300 group/arrow"
                aria-label="Previous movies"
              >
                <ChevronLeft
                  size={28}
                  strokeWidth={2.5}
                  className="transition-transform group-hover/arrow:-translate-x-0.5"
                />
              </motion.button>
            )}

            {/* Right Arrow */}
            {canScrollRight && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => scroll("right")}
                className="absolute right-[-24px] top-[calc(50%-2rem)] -translate-y-1/2 z-40 w-12 h-12 rounded-full bg-black/60 backdrop-blur-md shadow-2xl flex items-center justify-center text-white hover:bg-primary border border-white/20 transition-all duration-300 group/arrow"
                aria-label="Next movies"
              >
                <ChevronRight
                  size={28}
                  strokeWidth={2.5}
                  className="transition-transform group-hover/arrow:translate-x-0.5"
                />
              </motion.button>
            )}
          </>
        )}
      </AnimatePresence>

      {/* Side Vignettes */}
      <div className="absolute left-0 top-0 bottom-0 w-8 bg-linear-to-r from-bg-primary/50 to-transparent opacity-0 group-hover/slider:opacity-100 pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-linear-to-l from-bg-primary/50 to-transparent opacity-0 group-hover/slider:opacity-100 pointer-events-none z-10" />
    </div>
  );
}
