package com.moviebooking.controller;

import com.moviebooking.entity.supabase.Show;
import com.moviebooking.repository.supabase.ShowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/shows")
@RequiredArgsConstructor
public class ShowController {

    private final ShowRepository showRepository;

    @GetMapping("/movie/{movieId}")
    public ResponseEntity<List<Show>> getShowsForMovie(
            @PathVariable String movieId,
            @RequestParam(required = false) String date) {
        if (date != null && !date.isEmpty()) {
            LocalDate showDate = LocalDate.parse(date);
            return ResponseEntity.ok(showRepository.findByMovieIdAndDate(movieId, showDate));
        }
        return ResponseEntity.ok(showRepository.findByMovieId(movieId));
    }

    @GetMapping("/{showId}")
    public ResponseEntity<Show> getShowById(@PathVariable String showId) {
        return showRepository.findById(showId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/theater/{theaterId}")
    public ResponseEntity<List<Show>> getShowsForTheater(@PathVariable String theaterId) {
        return ResponseEntity.ok(showRepository.findByTheaterId(theaterId));
    }
}
