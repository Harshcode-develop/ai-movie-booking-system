package com.moviebooking.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class BookingRequest {

    @NotBlank(message = "Show ID is required")
    private String showId;

    @NotEmpty(message = "At least one seat must be selected")
    @Size(max = 10, message = "Cannot book more than 10 tickets at a time")
private List<Long> seatIds;

    // Payment details (dummy)
    @NotBlank(message = "Card last four digits required")
    private String cardLastFour;

    @NotBlank(message = "Card type required")
    private String cardType;
}
