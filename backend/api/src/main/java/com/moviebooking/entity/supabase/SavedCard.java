package com.moviebooking.entity.supabase;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "saved_cards")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SavedCard {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "card_type")
    private String cardType;  // VISA, MASTERCARD, AMEX

    @Column(name = "last_four")
    private String lastFour;

    @Column(name = "expiry_month")
    private Integer expiryMonth;

    @Column(name = "expiry_year")
    private Integer expiryYear;

    @Column(name = "card_holder_name")
    private String cardHolderName;
}
