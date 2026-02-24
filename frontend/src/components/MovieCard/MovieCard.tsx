import { motion } from "framer-motion";
import { Star, Play } from "lucide-react";
import { Link } from "react-router-dom";
import type { Movie } from "../../types";

interface MovieCardProps {
  movie: Movie;
  index?: number;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const rating = movie.rating?.average || 0;

  return (
    <div className="group/card cursor-pointer h-full">
      <Link to={`/movie/${movie.id}`} className="block h-full">
        {/* Poster Container */}
        <div className="relative aspect-2/3 rounded-lg overflow-hidden bg-bg-secondary mb-3 shadow-md group-hover/card:shadow-xl transition-all duration-300 border border-border/50">
          <img
            src={movie.posterUrl || "/placeholder-movie.jpg"}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
            loading="eager"
          />

          {/* Play Button Overlay on Hover */}
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white scale-90 group-hover/card:scale-100 transition-transform duration-300">
              <Play size={20} fill="currentColor" className="ml-1" />
            </div>
          </div>

          {/* Bottom Data Bar (BMS Style) */}
          <div className="absolute bottom-0 left-0 right-0 h-10 bg-black/80 backdrop-blur-sm flex items-center px-3 gap-2">
            {!movie.isComingSoon ? (
              <>
                <Star size={14} fill="currentColor" className="text-primary" />
                <span className="text-xs font-bold text-white uppercase tracking-tight">
                  {rating.toFixed(1)}/10{" "}
                  <span className="text-[10px] text-white/60 font-medium ml-1">
                    {(movie.rating?.count / 1000).toFixed(1)}K Votes
                  </span>
                </span>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                >
                  <Star
                    size={14}
                    fill="currentColor"
                    className="text-accent-gold"
                  />
                </motion.div>
                <span className="text-xs font-bold text-white uppercase tracking-tight">
                  {((movie.rating?.count || 12000) / 1000).toFixed(1)}K
                  Interested
                </span>
              </>
            )}
          </div>
        </div>

        {/* Content Below Poster - BMS Style */}
        <div className="space-y-1 min-w-0">
          <h3 className="text-base font-bold text-text-primary truncate group-hover/card:text-primary transition-colors">
            {movie.title}
          </h3>
          <p className="text-xs text-text-secondary truncate">
            {movie.genres?.slice(0, 2).join(", ")}
          </p>
          <div className="flex flex-wrap gap-1.5 pt-1 overflow-hidden h-6">
            {movie.formats?.slice(0, 2).map((format) => (
              <span
                key={format}
                className="text-[10px] px-1.5 py-0.5 bg-bg-tertiary text-text-secondary border border-border rounded uppercase tracking-wider font-medium whitespace-nowrap"
              >
                {format.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
