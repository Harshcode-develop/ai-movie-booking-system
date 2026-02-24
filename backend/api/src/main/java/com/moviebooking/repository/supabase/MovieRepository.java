package com.moviebooking.repository.supabase;

import com.moviebooking.entity.supabase.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, String> {

    List<Movie> findByTitleContainingIgnoreCase(String title);

    @Query(value = "SELECT * FROM movies WHERE genres @> to_jsonb(:genre)::jsonb", nativeQuery = true)
    List<Movie> findByGenresIn(@Param("genre") String genre);

    // Overloaded method for list-based genre search
    @Query(value = "SELECT * FROM movies m WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(m.genres) AS g WHERE g IN (:genres))", nativeQuery = true)
    List<Movie> findByGenresInList(@Param("genres") List<String> genres);

    @Query(value = "SELECT * FROM movies m WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(m.formats) AS f WHERE f IN (:formats))", nativeQuery = true)
    List<Movie> findByFormatsIn(@Param("formats") List<String> formats);

    @Query(value = "SELECT * FROM movies m WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(m.languages) AS l WHERE l IN (:languages))", nativeQuery = true)
    List<Movie> findByLanguagesIn(@Param("languages") List<String> languages);

    @Query("SELECT m FROM Movie m WHERE m.releaseDate >= :date")
    List<Movie> findByReleaseDateAfter(@Param("date") LocalDate date);

    @Query("SELECT m FROM Movie m WHERE m.releaseDate <= :date")
    List<Movie> findNowShowing(@Param("date") LocalDate date);

    @Query(value = "SELECT * FROM movies WHERE (rating->>'average')::double precision >= :minRating", nativeQuery = true)
    List<Movie> findByRatingGreaterThan(@Param("minRating") Double minRating);

    @Query(value = "SELECT * FROM movies m WHERE EXISTS (SELECT 1 FROM jsonb_array_elements_text(m.genres) AS g WHERE g IN (:genres)) AND (m.rating->>'average')::double precision >= :minRating", nativeQuery = true)
    List<Movie> findByGenresAndMinRating(@Param("genres") List<String> genres, @Param("minRating") Double minRating);

    @Query("SELECT m FROM Movie m WHERE m.releaseDate > :date")
    List<Movie> findComingSoon(@Param("date") LocalDate date);
}
