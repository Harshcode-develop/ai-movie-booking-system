package com.moviebooking.repository.supabase;

import com.moviebooking.entity.supabase.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, String> {

    List<Review> findByMovieId(String movieId);

    Page<Review> findByMovieIdOrderByCreatedAtDesc(String movieId, Pageable pageable);

    List<Review> findByUserId(Long userId);

    Optional<Review> findByMovieIdAndUserId(String movieId, Long userId);

    @Query("SELECT r FROM Review r WHERE r.movieId = :movieId ORDER BY r.createdAt DESC")
    List<Review> findTopReviewsByMovieId(@Param("movieId") String movieId, Pageable pageable);

    @Query("SELECT COUNT(r) FROM Review r WHERE r.movieId = :movieId")
    Long countByMovieId(@Param("movieId") String movieId);

    @Query(value = "SELECT * FROM reviews r WHERE r.movie_id = :movieId AND EXISTS (SELECT 1 FROM jsonb_array_elements_text(r.hashtags) AS h WHERE h IN (:hashtags))", nativeQuery = true)
    List<Review> findByMovieIdAndHashtags(@Param("movieId") String movieId, @Param("hashtags") List<String> hashtags);
}
