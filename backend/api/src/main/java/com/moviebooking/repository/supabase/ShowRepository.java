package com.moviebooking.repository.supabase;

import com.moviebooking.entity.supabase.Movie;
import com.moviebooking.entity.supabase.Show;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ShowRepository extends JpaRepository<Show, String> {

    List<Show> findByMovieId(String movieId);

    List<Show> findByTheaterId(String theaterId);

    List<Show> findByMovieIdAndTheaterId(String movieId, String theaterId);

    @Query("SELECT s FROM Show s WHERE s.movieId = :movieId AND s.showDate = :date AND s.isActive = true")
    List<Show> findByMovieIdAndDate(@Param("movieId") String movieId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Show s WHERE s.movieId = :movieId AND s.theaterId = :theaterId AND s.showDate = :date AND s.isActive = true")
    List<Show> findByMovieIdAndTheaterIdAndDate(@Param("movieId") String movieId, @Param("theaterId") String theaterId, @Param("date") LocalDate date);

    @Query("SELECT s FROM Show s WHERE s.movieId = :movieId AND s.format = :format AND s.isActive = true")
    List<Show> findByMovieIdAndFormat(@Param("movieId") String movieId, @Param("format") Movie.MovieFormat format);

    @Query("SELECT s FROM Show s WHERE s.showDate >= :startDate AND s.showDate <= :endDate AND s.isActive = true")
    List<Show> findByDateRange(@Param("startDate") LocalDate startDate, @Param("endDate") LocalDate endDate);

    @Query("SELECT s FROM Show s WHERE s.theaterCity = :city AND s.showDate = :date AND s.isActive = true")
    List<Show> findByCityAndDate(@Param("city") String city, @Param("date") LocalDate date);
}
