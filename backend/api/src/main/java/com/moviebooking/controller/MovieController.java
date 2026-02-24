package com.moviebooking.controller;

import com.moviebooking.entity.supabase.Movie;
import com.moviebooking.repository.supabase.MovieRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
public class MovieController {

    private final MovieRepository movieRepository;

    @GetMapping
    public ResponseEntity<List<Movie>> getAllMovies() {
        return ResponseEntity.ok(movieRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Movie> getMovieById(@PathVariable String id) {
        return movieRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/search")
    public ResponseEntity<List<Movie>> searchMovies(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String genre,
            @RequestParam(required = false) String language) {
        
        if (title != null && !title.isEmpty()) {
            return ResponseEntity.ok(movieRepository.findByTitleContainingIgnoreCase(title));
        }
        if (genre != null && !genre.isEmpty()) {
            return ResponseEntity.ok(movieRepository.findByGenresIn(genre));
        }
        if (language != null && !language.isEmpty()) {
            return ResponseEntity.ok(movieRepository.findByLanguagesIn(List.of(language)));
        }
        return ResponseEntity.ok(movieRepository.findAll());
    }

    @GetMapping("/now-showing")
    public ResponseEntity<List<Movie>> getNowShowing() {
        return ResponseEntity.ok(movieRepository.findNowShowing(LocalDate.now()));
    }

    @GetMapping("/top-rated")
    public ResponseEntity<List<Movie>> getTopRated(@RequestParam(defaultValue = "8.0") Double minRating) {
        return ResponseEntity.ok(movieRepository.findByRatingGreaterThan(minRating));
    }

    @GetMapping("/coming-soon")
    public ResponseEntity<List<Movie>> getComingSoon() {
        return ResponseEntity.ok(movieRepository.findComingSoon(LocalDate.now()));
    }
}
