import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  X,
  Send,
  ThumbsUp,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import type { Review } from "../../types";
import { useAuth } from "../../context/AuthContext";
import { movieService } from "../../services/movieService";
import ReviewCard from "./ReviewCard";

interface ReviewSectionProps {
  movieId: string;
  reviews: Review[];
  onReviewAdded: () => void;
}

const HASHTAG_OPTIONS = [
  "#Masterpiece",
  "#GreatActing",
  "#AwesomeStory",
  "#VisualTreat",
  "#MusicalDelight",
  "#Blockbuster",
  "#MustWatch",
  "#MindBlowing",
  "#Emotional",
  "#Thriller",
  "#Fun",
  "#Overrated",
];

export default function ReviewSection({
  movieId,
  reviews,
  onReviewAdded,
}: ReviewSectionProps) {
  const { isAuthenticated, openAuthModal, user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [likingIds, setLikingIds] = useState<Set<string>>(new Set());

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    setShowModal(true);
    setRating(0);
    setReviewText("");
    setSelectedHashtags([]);
    setError("");
    setSuccess(false);
  };

  const toggleHashtag = (tag: string) => {
    setSelectedHashtags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    if (reviewText.trim().length < 10) {
      setError("Review must be at least 10 characters");
      return;
    }

    setSubmitting(true);
    setError("");
    try {
      await movieService.postReview(movieId, {
        rating,
        review: reviewText.trim(),
        hashtags: selectedHashtags,
      });
      setSuccess(true);
      setTimeout(() => {
        setShowModal(false);
        setSuccess(false);
        onReviewAdded();
      }, 1500);
    } catch (err: unknown) {
      const errorMsg =
        err instanceof Error ? err.message : "Failed to submit review";
      setError(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (!isAuthenticated) {
      openAuthModal();
      return;
    }
    if (likingIds.has(reviewId)) return;
    setLikingIds((prev) => new Set(prev).add(reviewId));
    try {
      await movieService.likeReview(reviewId);
      onReviewAdded();
    } catch {
      /* silently fail */
    } finally {
      setLikingIds((prev) => {
        const next = new Set(prev);
        next.delete(reviewId);
        return next;
      });
    }
  };

  return (
    <>
      {/* Reviews Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Reviews</h2>
        <button
          onClick={handleWriteReview}
          className="px-4 py-2 rounded-lg bg-primary/10 text-primary text-sm font-semibold hover:bg-primary/20 transition-colors cursor-pointer border border-primary/20"
        >
          Write a Review
        </button>
      </div>

      {/* Review Stats Summary */}
      {reviews.length > 0 && (
        <div className="flex items-center gap-6 mb-8 p-4 rounded-xl bg-bg-card border border-border">
          <div className="flex items-center gap-2">
            <Star className="text-accent-gold fill-accent-gold" size={28} />
            <span className="text-3xl font-bold text-text-primary">
              {(
                reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
              ).toFixed(1)}
            </span>
            <span className="text-text-muted text-sm">/10</span>
          </div>
          <div className="h-10 w-px bg-border" />
          <div>
            <span className="text-lg font-semibold text-text-primary">
              {reviews.length}
            </span>
            <span className="text-text-muted text-sm ml-1">
              {reviews.length === 1 ? "Review" : "Reviews"}
            </span>
          </div>
        </div>
      )}

      {/* Reviews Grid */}
      {reviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review, index) => (
            <div key={review.id} className="relative">
              <ReviewCard review={review} index={index} />
              <button
                onClick={() => handleLike(review.id)}
                disabled={likingIds.has(review.id)}
                className="absolute bottom-4 right-4 flex items-center gap-1.5 text-xs text-text-muted hover:text-primary transition-colors cursor-pointer disabled:opacity-50"
              >
                <ThumbsUp size={14} />
                <span>{review.likes || 0}</span>
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 rounded-xl bg-bg-card border border-border">
          <Star size={40} className="mx-auto mb-3 text-text-muted" />
          <p className="text-text-secondary font-medium">No reviews yet</p>
          <p className="text-text-muted text-sm mt-1">
            Be the first to share your thoughts!
          </p>
          <button
            onClick={handleWriteReview}
            className="mt-4 px-6 py-2 bg-primary text-white text-sm font-semibold rounded-lg hover:bg-primary-hover transition-colors cursor-pointer"
          >
            Write the first review
          </button>
        </div>
      )}

      {/* Write Review Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => !submitting && setShowModal(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-lg bg-bg-card border border-border rounded-2xl shadow-2xl overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 pb-4 border-b border-border">
                <div>
                  <h3 className="text-xl font-bold text-text-primary">
                    Write a Review
                  </h3>
                  <p className="text-sm text-text-muted mt-0.5">
                    Share your movie experience,{" "}
                    {user?.fullName?.split(" ")[0] || ""}
                  </p>
                </div>
                <button
                  onClick={() => !submitting && setShowModal(false)}
                  className="p-2 rounded-full hover:bg-bg-secondary transition-colors cursor-pointer"
                  disabled={submitting}
                >
                  <X size={20} className="text-text-muted" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 space-y-5">
                {/* Star Rating */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-3 block">
                    Your Rating
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        type="button"
                        className="p-0.5 transition-transform hover:scale-110 cursor-pointer"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          size={28}
                          className={`transition-colors ${
                            star <= (hoverRating || rating)
                              ? "text-accent-gold fill-accent-gold"
                              : "text-border"
                          }`}
                        />
                      </button>
                    ))}
                    {(hoverRating || rating) > 0 && (
                      <span className="ml-3 text-lg font-bold text-text-primary">
                        {hoverRating || rating}/10
                      </span>
                    )}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Your Review
                  </label>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="What did you think about the movie?"
                    rows={4}
                    maxLength={500}
                    className="w-full px-4 py-3 bg-bg-secondary border border-border rounded-xl text-text-primary text-sm transition-all focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-text-muted resize-none"
                  />
                  <div className="text-right text-xs text-text-muted mt-1">
                    {reviewText.length}/500
                  </div>
                </div>

                {/* Hashtags */}
                <div>
                  <label className="text-sm font-medium text-text-primary mb-2 block">
                    Add Hashtags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {HASHTAG_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleHashtag(tag)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer border ${
                          selectedHashtags.includes(tag)
                            ? "bg-primary text-white border-primary shadow-sm"
                            : "bg-bg-secondary text-text-secondary border-border hover:border-primary/50"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error/Success Messages */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-accent-red/10 text-accent-red text-sm border border-accent-red/20"
                    >
                      <AlertCircle size={16} />
                      {error}
                    </motion.div>
                  )}
                  {success && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="flex items-center gap-2 p-3 rounded-lg bg-accent-green/10 text-accent-green text-sm border border-accent-green/20"
                    >
                      <CheckCircle2 size={16} />
                      Review submitted successfully!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div className="p-6 pt-2 border-t border-border">
                <button
                  onClick={handleSubmit}
                  disabled={submitting || success}
                  className="w-full py-3 rounded-xl bg-primary hover:bg-primary-hover text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
                >
                  {submitting ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : success ? (
                    <>
                      <CheckCircle2 size={18} />
                      Submitted!
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Submit Review
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export { type ReviewSectionProps };
