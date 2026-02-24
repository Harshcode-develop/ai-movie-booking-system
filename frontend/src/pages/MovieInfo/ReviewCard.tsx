import { motion } from "framer-motion";
import { Star } from "lucide-react";
import type { Review } from "../../types";

interface ReviewCardProps {
  review: Review;
  index?: number;
}

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
  return (
    <motion.div
      className="p-5 rounded-lg bg-bg-card border border-border card-hover"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm shadow-sm">
            {review.userName.charAt(0)}
          </div>
          <div>
            <h4 className="font-medium text-text-primary text-sm">
              {review.userName}
            </h4>
            <div className="flex items-center gap-1">
              <Star size={12} className="text-accent-gold fill-accent-gold" />
              <span className="text-xs font-bold text-text-primary">
                {review.rating}/10
              </span>
            </div>
          </div>
        </div>
        <span className="text-xs text-text-muted">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <p className="text-sm text-text-secondary leading-relaxed mb-3">
        {review.review}
      </p>

      {review.hashtags && review.hashtags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.hashtags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] text-primary bg-primary/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
