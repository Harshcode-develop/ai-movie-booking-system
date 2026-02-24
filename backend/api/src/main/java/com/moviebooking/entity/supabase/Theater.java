package com.moviebooking.entity.supabase;

import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.util.List;

@Entity
@Table(name = "theaters")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Theater {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    private String name;

    private String city;

    private String address;

    private String pincode;

    private Double latitude;

    private Double longitude;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> facilities;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<Screen> screens;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Screen {
        private String screenId;
        private String name;
        private List<Movie.MovieFormat> formats;
        private SeatLayout seatLayout;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SeatLayout {
        private Integer rows;
        private List<Integer> seatsPerRow;
        private TierMapping tierMapping;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class TierMapping {
        private List<Integer> classicRows;
        private List<Integer> primeRows;
        private List<Integer> premiumRows;
        private List<Integer> vipRows;
    }
}
