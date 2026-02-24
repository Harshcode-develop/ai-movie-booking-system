package com.moviebooking.entity.supabase;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "show_seats", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"show_id", "seat_number"})
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ShowSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "show_id", nullable = false)
    private String showId;

    @Column(name = "seat_number", nullable = false)
    private String seatNumber;  // e.g., "A1", "B5"

    @Column(name = "row_label")
    private String rowLabel;  // e.g., "A", "B"

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SeatTier tier;

    @Column(name = "base_price", nullable = false)
    private BigDecimal basePrice;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private SeatStatus status = SeatStatus.AVAILABLE;

    @Column(name = "locked_by")
    private Long lockedBy;

    @Column(name = "locked_until")
    private LocalDateTime lockedUntil;

    public enum SeatTier {
        CLASSIC, PRIME, PREMIUM, VIP
    }

    public enum SeatStatus {
        AVAILABLE, LOCKED, BOOKED
    }

    public boolean isAvailable() {
        if (status == SeatStatus.AVAILABLE) {
            return true;
        }
        if (status == SeatStatus.LOCKED && lockedUntil != null && lockedUntil.isBefore(LocalDateTime.now())) {
            return true;  // Lock expired
        }
        return false;
    }
}
