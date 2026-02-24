package com.moviebooking.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {
    private Long id;
    private String bookingRef;
    private String movieTitle;
    private String moviePosterUrl;
    private String theaterName;
    private String theaterCity;
    private String showDate;
    private String showTime;
    private String format;
    private String language;
private List<String> seats;
    private BigDecimal totalAmount;
    private String paymentStatus;
    private String bookedAt;
}
