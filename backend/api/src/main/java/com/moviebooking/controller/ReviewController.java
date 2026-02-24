package com.moviebooking.controller;

import com.moviebooking.entity.supabase.Review;
import com.moviebooking.entity.supabase.User;
import com.moviebooking.repository.supabase.ReviewRepository;
import com.moviebooking.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final UserDetailsServiceImpl userDetailsService;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<Page<Review>> getMovieReviews(
            @PathVariable String movieId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return ResponseEntity.ok(reviewRepository.findByMovieIdOrderByCreatedAtDesc(movieId, pageRequest));
    }

    @GetMapping("/movie/{movieId}/stats")
    public ResponseEntity<Map<String, Object>> getReviewStats(@PathVariable String movieId) {
        Long count = reviewRepository.countByMovieId(movieId);
        List<Review> reviews = reviewRepository.findByMovieId(movieId);
        
        double averageRating = reviews.stream()
                .mapToInt(Review::getRating)
                .average()
                .orElse(0.0);
        
        return ResponseEntity.ok(Map.of(
                "count", count,
                "averageRating", Math.round(averageRating * 10.0) / 10.0
        ));
    }

    @GetMapping("/my-review/{movieId}")
    public ResponseEntity<Review> getMyReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String movieId) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        return reviewRepository.findByMovieIdAndUserId(movieId, user.getId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/movie/{movieId}")
    public ResponseEntity<Review> postReview(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String movieId,
            @RequestBody Review reviewRequest) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        
        Review review = Review.builder()
                .movieId(movieId)
                .userId(user.getId())
                .userName(user.getFullName())
                .rating(reviewRequest.getRating())
                .review(reviewRequest.getReview())
                .hashtags(reviewRequest.getHashtags())
                .likes(0L)
                .createdAt(LocalDateTime.now())
                .isVerifiedBooking(false)
                .build();
        
        return ResponseEntity.ok(reviewRepository.save(review));
    }

    @PutMapping("/{reviewId}/like")
    public ResponseEntity<Review> likeReview(@PathVariable String reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));
        review.setLikes(review.getLikes() + 1);
        return ResponseEntity.ok(reviewRepository.save(review));
    }
}
