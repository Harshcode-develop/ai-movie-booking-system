package com.moviebooking.entity.supabase;

import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "movies")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> genres;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> languages;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<MovieFormat> formats;

    private Integer duration;  // in minutes

    private LocalDate releaseDate;

    private String certificate;  // e.g., "UA", "A", "U"

    private String posterUrl;

    private String bannerUrl;

    private String trailerUrl;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "movie_cast", columnDefinition = "jsonb")
    private List<CastMember> cast;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<CrewMember> crew;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Rating rating;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private Map<String, BigDecimal> formatPremiums;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CastMember {
        private String name;
        private String role;
        private String characterName;
        private String imageUrl;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CrewMember {
        private String name;
        private String role;  // e.g., "Director", "Producer"
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Rating {
        private Double average;
        private Long count;
    }

    public enum MovieFormat {
        IMAX_2D, IMAX_3D, FOUR_DX, STANDARD_2D, STANDARD_3D, DOLBY_ATMOS
    }
}
