package com.moviebooking.entity.supabase;

import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reviews")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "movie_id")
    private String movieId;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "user_name")
    private String userName;

    private Integer rating;  // 1-10

    @Column(columnDefinition = "TEXT")
    private String review;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> hashtags;

    private Long likes;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "is_verified_booking")
    private Boolean isVerifiedBooking;
}
