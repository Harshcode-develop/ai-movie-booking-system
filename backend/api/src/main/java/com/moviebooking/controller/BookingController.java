package com.moviebooking.controller;

import com.moviebooking.dto.request.BookingRequest;
import com.moviebooking.dto.response.BookingResponse;
import com.moviebooking.entity.supabase.ShowSeat;
import com.moviebooking.entity.supabase.User;
import com.moviebooking.repository.supabase.ShowSeatRepository;
import com.moviebooking.security.UserDetailsServiceImpl;
import com.moviebooking.service.BookingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {

    private final BookingService bookingService;
    private final ShowSeatRepository showSeatRepository;
    private final UserDetailsServiceImpl userDetailsService;

    @GetMapping("/seats/{showId}")
    public ResponseEntity<List<ShowSeat>> getSeatsForShow(@PathVariable String showId) {
        return ResponseEntity.ok(showSeatRepository.findByShowId(showId));
    }

    @GetMapping("/seats/{showId}/available")
    public ResponseEntity<List<ShowSeat>> getAvailableSeats(@PathVariable String showId) {
        return ResponseEntity.ok(showSeatRepository.findAvailableSeatsByShowId(showId));
    }

    @GetMapping("/seats/{showId}/count")
    public ResponseEntity<Map<String, Long>> getAvailableSeatCount(@PathVariable String showId) {
        Long classic = showSeatRepository.countAvailableSeatsByTier(showId, ShowSeat.SeatTier.CLASSIC);
        Long prime = showSeatRepository.countAvailableSeatsByTier(showId, ShowSeat.SeatTier.PRIME);
        Long premium = showSeatRepository.countAvailableSeatsByTier(showId, ShowSeat.SeatTier.PREMIUM);
        Long vip = showSeatRepository.countAvailableSeatsByTier(showId, ShowSeat.SeatTier.VIP);
        
        return ResponseEntity.ok(Map.of(
                "CLASSIC", classic,
                "PRIME", prime,
                "PREMIUM", premium,
                "VIP", vip,
                "TOTAL", classic + prime + premium + vip
        ));
    }

    @PostMapping("/lock")
    public ResponseEntity<List<ShowSeat>> lockSeats(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody List<Long> seatIds) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        List<ShowSeat> lockedSeats = bookingService.lockSeats(user.getId(), seatIds);
        return ResponseEntity.ok(lockedSeats);
    }

    @PostMapping("/complete")
    public ResponseEntity<BookingResponse> completeBooking(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BookingRequest request) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        BookingResponse response = bookingService.completeBooking(user.getId(), request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-bookings")
    public ResponseEntity<List<BookingResponse>> getMyBookings(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @GetMapping("/my-tickets")
    public ResponseEntity<List<BookingResponse>> getMyTickets(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(bookingService.getUpcomingTickets(user.getId()));
    }
}
