package com.moviebooking.ai.tools;

import com.moviebooking.entity.supabase.Movie;
import com.moviebooking.entity.supabase.Show;
import com.moviebooking.entity.supabase.ShowSeat;
import com.moviebooking.repository.supabase.MovieRepository;
import com.moviebooking.repository.supabase.ShowRepository;
import com.moviebooking.repository.supabase.TheaterRepository;
import com.moviebooking.repository.supabase.ShowSeatRepository;
import com.moviebooking.service.PricingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Description;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * AI Tools for Gemini Function Calling
 * These methods are exposed to the AI for querying the database
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class MovieConciergeTools {

    private final MovieRepository movieRepository;
    private final TheaterRepository theaterRepository;
    private final ShowRepository showRepository;
    private final ShowSeatRepository showSeatRepository;
    private final PricingService pricingService;

    /**
     * Search movies by genre, language, or format
     */
    @Bean
    @Description("Search for movies based on genre, language, or format")
    public Function<SearchRequest, List<MovieSummary>> searchMovies() {
        return request -> {
            log.info("AI Tool: searchMovies called with {}", request);
            List<Movie> movies;
            
            if (request.genre() != null && !request.genre().isEmpty()) {
                movies = movieRepository.findByGenresIn(request.genre());
            } else if (request.format() != null) {
                movies = movieRepository.findByFormatsIn(List.of(request.format().name()));
            } else if (request.language() != null && !request.language().isEmpty()) {
                movies = movieRepository.findByLanguagesIn(List.of(request.language()));
            } else {
                movies = movieRepository.findAll();
            }
            
            return movies.stream()
                    .map(m -> new MovieSummary(
                            m.getId(), 
                            m.getTitle(), 
                            m.getGenres(), 
                            m.getRating() != null ? m.getRating().getAverage() : 0.0,
                            m.getFormats().stream().map(Enum::name).toList()
                    ))
                    .limit(10)
                    .toList();
        };
    }

    /**
     * Get detailed movie information
     */
    @Bean
    @Description("Get detailed information about a specific movie including cast and reviews")
    public Function<MovieIdRequest, MovieDetails> getMovieDetails() {
        return request -> {
            log.info("AI Tool: getMovieDetails called for {}", request.movieId());
            Movie movie = movieRepository.findById(request.movieId())
                    .orElseThrow(() -> new RuntimeException("Movie not found"));
            
            return new MovieDetails(
                    movie.getId(),
                    movie.getTitle(),
                    movie.getDescription(),
                    movie.getGenres(),
                    movie.getDuration(),
                    movie.getCertificate(),
                    movie.getRating() != null ? movie.getRating().getAverage() : 0.0,
                    movie.getCast() != null ? movie.getCast().stream()
                            .map(c -> c.getName() + " as " + c.getCharacterName())
                            .limit(5)
                            .toList() : List.of(),
                    movie.getFormats().stream().map(Enum::name).toList()
            );
        };
    }

    /**
     * Get theaters showing a specific movie
     */
    @Bean
    @Description("Get list of theaters where a movie is currently showing")
    public Function<MovieIdRequest, List<TheaterInfo>> getTheatersForMovie() {
        return request -> {
            log.info("AI Tool: getTheatersForMovie called for {}", request.movieId());
            List<Show> shows = showRepository.findByMovieId(request.movieId());
            
            Set<String> theaterIds = shows.stream()
                    .map(Show::getTheaterId)
                    .collect(Collectors.toSet());
            
            return theaterIds.stream()
                    .map(id -> theaterRepository.findById(id).orElse(null))
                    .filter(Objects::nonNull)
                    .map(t -> new TheaterInfo(t.getId(), t.getName(), t.getCity(), t.getFacilities()))
                    .toList();
        };
    }

    /**
     * Get showtimes for a movie at a specific theater
     */
    @Bean
    @Description("Get available showtimes for a movie at a theater on a specific date")
    public Function<ShowtimeRequest, List<ShowtimeInfo>> getShowtimes() {
        return request -> {
            log.info("AI Tool: getShowtimes called for movie {} at theater {} on {}", 
                    request.movieId(), request.theaterId(), request.date());
            
            LocalDate date = request.date() != null ? LocalDate.parse(request.date()) : LocalDate.now();
            List<Show> shows = showRepository.findByMovieIdAndTheaterIdAndDate(
                    request.movieId(), request.theaterId(), date);
            
            return shows.stream()
                    .map(s -> new ShowtimeInfo(
                            s.getId(),
                            s.getShowTime(),
                            s.getFormat().name(),
                            s.getLanguage()
                    ))
                    .toList();
        };
    }

    /**
     * Check seat availability for a show
     */
    @Bean
    @Description("Check real-time seat availability for a specific show")
    public Function<ShowIdRequest, SeatAvailability> checkSeatAvailability() {
        return request -> {
            log.info("AI Tool: checkSeatAvailability called for show {}", request.showId());
            List<ShowSeat> seats = showSeatRepository.findByShowId(request.showId());
            
            Map<String, Long> availableByTier = seats.stream()
                    .filter(ShowSeat::isAvailable)
                    .collect(Collectors.groupingBy(
                            s -> s.getTier().name(),
                            Collectors.counting()
                    ));
            
            long totalAvailable = seats.stream().filter(ShowSeat::isAvailable).count();
            long totalSeats = seats.size();
            
            return new SeatAvailability(
                    request.showId(),
                    totalAvailable,
                    totalSeats,
                    availableByTier
            );
        };
    }

    /**
     * Get pricing information for different tiers
     */
    @Bean
    @Description("Get pricing information for seats in different tiers for a show")
    public Function<ShowIdRequest, PricingInfo> getSeatPricing() {
        return request -> {
            log.info("AI Tool: getSeatPricing called for show {}", request.showId());
            Show show = showRepository.findById(request.showId())
                    .orElseThrow(() -> new RuntimeException("Show not found"));
            
            Movie movie = movieRepository.findById(show.getMovieId())
                    .orElseThrow(() -> new RuntimeException("Movie not found"));
            
            Map<String, BigDecimal> tierPrices = new HashMap<>();
            for (ShowSeat.SeatTier tier : ShowSeat.SeatTier.values()) {
                BigDecimal price = pricingService.calculateSeatPrice(show, tier, movie);
                tierPrices.put(tier.name(), price);
            }
            
            return new PricingInfo(
                    request.showId(),
                    show.getFormat().name(),
                    tierPrices,
                    "Prices include format premium for " + show.getFormat().name()
            );
        };
    }

    /**
     * Explain seat tier differences
     */
    @Bean
    @Description("Explain the differences between seat tiers (Classic, Prime, Premium, VIP)")
    public Function<EmptyRequest, String> explainSeatTiers() {
        return request -> {
            log.info("AI Tool: explainSeatTiers called");
            return pricingService.explainTierDifferences();
        };
    }

    /**
     * Recommend best experience for a genre
     */
    @Bean
    @Description("Recommend the best format experience for a specific movie genre")
    public Function<GenreRequest, RecommendationResult> recommendExperience() {
        return request -> {
            log.info("AI Tool: recommendExperience called for genre {}", request.genre());
            
            String recommendation;
            String reason;
            
            switch (request.genre().toLowerCase()) {
                case "action", "adventure", "sci-fi" -> {
                    recommendation = "IMAX_3D";
                    reason = "Action movies are best experienced in IMAX 3D for immersive visuals and thundering sound. The larger screen and crystal-clear projection make every explosion and chase scene feel like you're right in the middle of it!";
                }
                case "horror", "thriller" -> {
                    recommendation = "FOUR_DX";
                    reason = "Horror and thriller movies become truly terrifying in 4DX! The motion seats, wind effects, and synchronized lighting create an incredibly immersive experience that will have you gripping your seat.";
                }
                case "animation", "comedy", "family" -> {
                    recommendation = "STANDARD_3D";
                    reason = "Animation looks stunning in Standard 3D - the vibrant colors and depth really pop. It's also more comfortable for family viewing, especially with kids.";
                }
                case "drama", "romance" -> {
                    recommendation = "DOLBY_ATMOS";
                    reason = "Drama and romance films shine with Dolby Atmos sound. The nuanced audio helps you feel every emotion in the dialogue and soundtrack without needing the visual spectacle of IMAX.";
                }
                default -> {
                    recommendation = "IMAX_2D";
                    reason = "IMAX 2D offers the best of both worlds - stunning visuals on the largest screen without the glasses. Perfect for any genre!";
                }
            }
            
            return new RecommendationResult(request.genre(), recommendation, reason);
        };
    }

    // Record classes for function parameters and returns
    public record EmptyRequest() {}
    public record SearchRequest(String genre, Movie.MovieFormat format, String language) {}
    public record MovieIdRequest(String movieId) {}
    public record ShowIdRequest(String showId) {}
    public record ShowtimeRequest(String movieId, String theaterId, String date) {}
    public record GenreRequest(String genre) {}

    public record MovieSummary(String id, String title, List<String> genres, Double rating, List<String> formats) {}
    public record MovieDetails(String id, String title, String description, List<String> genres, 
                              Integer duration, String certificate, Double rating, 
                              List<String> cast, List<String> formats) {}
    public record TheaterInfo(String id, String name, String city, List<String> facilities) {}
    public record ShowtimeInfo(String id, String time, String format, String language) {}
    public record SeatAvailability(String showId, Long available, Long total, Map<String, Long> byTier) {}
    public record PricingInfo(String showId, String format, Map<String, BigDecimal> tierPrices, String note) {}
    public record RecommendationResult(String genre, String recommendedFormat, String reason) {}
}
