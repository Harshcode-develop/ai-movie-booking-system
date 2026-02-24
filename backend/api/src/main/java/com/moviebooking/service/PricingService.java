package com.moviebooking.service;

import com.moviebooking.entity.supabase.Movie;
import com.moviebooking.entity.supabase.Show;
import com.moviebooking.entity.supabase.ShowSeat;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Map;

/**
 * Pricing Service
 * Formula: Final Price = Base Price × Tier Multiplier + Format Premium
 */
@Service
@RequiredArgsConstructor
public class PricingService {

    // Tier multipliers
    private static final Map<ShowSeat.SeatTier, BigDecimal> TIER_MULTIPLIERS = Map.of(
            ShowSeat.SeatTier.CLASSIC, new BigDecimal("1.0"),
            ShowSeat.SeatTier.PRIME, new BigDecimal("1.2"),
            ShowSeat.SeatTier.PREMIUM, new BigDecimal("1.5"),
            ShowSeat.SeatTier.VIP, new BigDecimal("2.0")
    );

    // Default format premiums (can be overridden per movie)
    private static final Map<Movie.MovieFormat, BigDecimal> DEFAULT_FORMAT_PREMIUMS = Map.of(
            Movie.MovieFormat.IMAX_2D, new BigDecimal("150"),
            Movie.MovieFormat.IMAX_3D, new BigDecimal("200"),
            Movie.MovieFormat.FOUR_DX, new BigDecimal("250"),
            Movie.MovieFormat.STANDARD_2D, BigDecimal.ZERO,
            Movie.MovieFormat.STANDARD_3D, new BigDecimal("50"),
            Movie.MovieFormat.DOLBY_ATMOS, new BigDecimal("100")
    );

    /**
     * Calculate the final price for a seat
     */
    public BigDecimal calculateSeatPrice(Show show, ShowSeat.SeatTier tier, Movie movie) {
        BigDecimal basePrice = getBasePrice(show, tier);
        BigDecimal tierMultiplier = TIER_MULTIPLIERS.getOrDefault(tier, BigDecimal.ONE);
        BigDecimal formatPremium = getFormatPremium(show.getFormat(), movie);

        return basePrice.multiply(tierMultiplier).add(formatPremium);
    }

    /**
     * Calculate total price for multiple seats
     */
    public BigDecimal calculateTotalPrice(Show show, Map<ShowSeat.SeatTier, Integer> seatsByTier, Movie movie) {
        BigDecimal total = BigDecimal.ZERO;
        
        for (Map.Entry<ShowSeat.SeatTier, Integer> entry : seatsByTier.entrySet()) {
            BigDecimal seatPrice = calculateSeatPrice(show, entry.getKey(), movie);
            total = total.add(seatPrice.multiply(new BigDecimal(entry.getValue())));
        }
        
        return total;
    }

    /**
     * Get base price for a tier from show configuration
     */
    private BigDecimal getBasePrice(Show show, ShowSeat.SeatTier tier) {
        if (show.getBasePrices() != null && show.getBasePrices().containsKey(tier.name())) {
            return show.getBasePrices().get(tier.name());
        }
        // Default base prices
        return switch (tier) {
            case CLASSIC -> new BigDecimal("150");
            case PRIME -> new BigDecimal("250");
            case PREMIUM -> new BigDecimal("350");
            case VIP -> new BigDecimal("500");
        };
    }

    /**
     * Get format premium from movie configuration or defaults
     */
    private BigDecimal getFormatPremium(Movie.MovieFormat format, Movie movie) {
        if (movie != null && movie.getFormatPremiums() != null) {
            String formatKey = format.name();
            if (movie.getFormatPremiums().containsKey(formatKey)) {
                return movie.getFormatPremiums().get(formatKey);
            }
        }
        return DEFAULT_FORMAT_PREMIUMS.getOrDefault(format, BigDecimal.ZERO);
    }

    /**
     * Get tier multiplier for display purposes
     */
    public BigDecimal getTierMultiplier(ShowSeat.SeatTier tier) {
        return TIER_MULTIPLIERS.getOrDefault(tier, BigDecimal.ONE);
    }

    /**
     * Get format premium for display purposes
     */
    public BigDecimal getDefaultFormatPremium(Movie.MovieFormat format) {
        return DEFAULT_FORMAT_PREMIUMS.getOrDefault(format, BigDecimal.ZERO);
    }

    /**
     * Explain tier differences to user (for AI)
     */
    public String explainTierDifferences() {
        return """
            Seat Tier Differences:
            
            🎬 CLASSIC (1.0x) - Basic comfortable seating, great value for money
            ⭐ PRIME (1.2x) - Better viewing angle, middle section of the theater
            💎 PREMIUM (1.5x) - Wider seats, optimal sound and visual experience
            👑 VIP (2.0x) - Luxury recliners, best seats in the house, premium amenities
            
            Format Premiums:
            - IMAX 2D: +₹150
            - IMAX 3D: +₹200
            - 4DX: +₹250
            - Standard 3D: +₹50
            - Dolby Atmos: +₹100
            """;
    }
}
