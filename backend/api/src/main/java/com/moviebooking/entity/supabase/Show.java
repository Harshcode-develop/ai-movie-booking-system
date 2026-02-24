package com.moviebooking.entity.supabase;

import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@Entity
@Table(name = "shows")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Show {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "movie_id")
    private String movieId;

    @Column(name = "theater_id")
    private String theaterId;

    @Column(name = "screen_id")
    private String screenId;

    @Column(name = "show_date")
    private LocalDate showDate;

    @Column(name = "show_time")
    private String showTime;  // e.g., "14:30", "18:00"

    @Enumerated(EnumType.STRING)
    private Movie.MovieFormat format;

    private String language;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, BigDecimal> basePrices;  // e.g., {"CLASSIC": 150, "PRIME": 250}

    @Column(name = "is_active")
    private Boolean isActive;

    // Cached movie info for quick display
    @Column(name = "movie_title")
    private String movieTitle;

    @Column(name = "movie_poster_url")
    private String moviePosterUrl;

    // Cached theater info for quick display
    @Column(name = "theater_name")
    private String theaterName;

    @Column(name = "theater_city")
    private String theaterCity;
}
