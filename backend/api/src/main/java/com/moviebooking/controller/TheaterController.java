package com.moviebooking.controller;

import com.moviebooking.entity.supabase.Show;
import com.moviebooking.entity.supabase.Theater;
import com.moviebooking.repository.supabase.ShowRepository;
import com.moviebooking.repository.supabase.TheaterRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/theaters")
@RequiredArgsConstructor
public class TheaterController {

    private final TheaterRepository theaterRepository;
    private final ShowRepository showRepository;

    @GetMapping
    public ResponseEntity<List<Theater>> getAllTheaters() {
        return ResponseEntity.ok(theaterRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Theater> getTheaterById(@PathVariable String id) {
        return theaterRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/city/{city}")
    public ResponseEntity<List<Theater>> getTheatersByCity(@PathVariable String city) {
        return ResponseEntity.ok(theaterRepository.findByCityIgnoreCase(city));
    }

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Theater>> getTheatersForMovie(
            @PathVariable String movieId,
            @RequestParam(required = false) String date,
            @RequestParam(required = false) String city) {

        List<Show> shows;
        if (date != null && !date.isEmpty()) {
            LocalDate showDate = LocalDate.parse(date);
            shows = showRepository.findByMovieIdAndDate(movieId, showDate);
        } else {
            shows = showRepository.findByMovieId(movieId);
        }

        // Get unique theater IDs from shows
        List<String> theaterIds = shows.stream()
                .map(Show::getTheaterId)
                .distinct()
                .collect(Collectors.toList());

        // Fetch theaters
        List<Theater> theaters = theaterRepository.findAllById(theaterIds);

        // Filter by city if provided
        if (city != null && !city.isEmpty()) {
            theaters = theaters.stream()
                    .filter(t -> t.getCity().equalsIgnoreCase(city))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(theaters);
    }
}
