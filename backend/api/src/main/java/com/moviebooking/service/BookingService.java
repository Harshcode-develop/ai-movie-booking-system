package com.moviebooking.service;

import com.moviebooking.dto.request.BookingRequest;
import com.moviebooking.dto.response.BookingResponse;
import com.moviebooking.entity.supabase.Movie;
import com.moviebooking.entity.supabase.Show;
import com.moviebooking.entity.supabase.*;
import com.moviebooking.repository.supabase.MovieRepository;
import com.moviebooking.repository.supabase.ShowRepository;
import com.moviebooking.repository.supabase.BookingRepository;
import com.moviebooking.repository.supabase.ShowSeatRepository;
import com.moviebooking.repository.supabase.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class BookingService {

    private static final int MAX_TICKETS_PER_BOOKING = 10;
    private static final int SEAT_LOCK_MINUTES = 10;

    private final BookingRepository bookingRepository;
    private final ShowSeatRepository showSeatRepository;
    private final UserRepository userRepository;
    private final ShowRepository showRepository;
    private final MovieRepository movieRepository;
    private final PricingService pricingService;

    /**
     * Lock seats temporarily for a user
     */
    @Transactional
    public List<ShowSeat> lockSeats(Long userId, List<Long> seatIds) {
        if (seatIds.size() > MAX_TICKETS_PER_BOOKING) {
            throw new RuntimeException("Cannot book more than " + MAX_TICKETS_PER_BOOKING + " tickets at a time");
        }

        // Get seats with pessimistic lock
        List<ShowSeat> seats = showSeatRepository.findByIdsWithLock(seatIds);

        // Check all seats are available
        for (ShowSeat seat : seats) {
            if (!seat.isAvailable()) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " is not available");
            }
        }

        // Lock all seats
        LocalDateTime lockUntil = LocalDateTime.now().plusMinutes(SEAT_LOCK_MINUTES);
        for (ShowSeat seat : seats) {
            seat.setStatus(ShowSeat.SeatStatus.LOCKED);
            seat.setLockedBy(userId);
            seat.setLockedUntil(lockUntil);
        }

        return showSeatRepository.saveAll(seats);
    }

    /**
     * Complete booking after successful payment
     */
    @Transactional
    public BookingResponse completeBooking(Long userId, BookingRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Show show = showRepository.findById(request.getShowId())
                .orElseThrow(() -> new RuntimeException("Show not found"));

        Movie movie = movieRepository.findById(show.getMovieId())
                .orElseThrow(() -> new RuntimeException("Movie not found"));

        // Get locked seats
        List<ShowSeat> seats = showSeatRepository.findByIdsWithLock(request.getSeatIds());

        // Validate seats are locked by this user
        for (ShowSeat seat : seats) {
            if (seat.getStatus() != ShowSeat.SeatStatus.LOCKED || 
                !userId.equals(seat.getLockedBy())) {
                throw new RuntimeException("Seat " + seat.getSeatNumber() + " is not locked by you");
            }
        }

        // Calculate total price
        BigDecimal totalAmount = BigDecimal.ZERO;
        for (ShowSeat seat : seats) {
            BigDecimal seatPrice = pricingService.calculateSeatPrice(show, seat.getTier(), movie);
            totalAmount = totalAmount.add(seatPrice);
        }

        // Create booking
        Booking booking = Booking.builder()
                .bookingRef(generateBookingRef())
                .user(user)
                .showId(show.getId())
                .movieId(movie.getId())
                .theaterId(show.getTheaterId())
                .totalAmount(totalAmount)
                .paymentStatus(Booking.PaymentStatus.COMPLETED)
                .cardLastFour(request.getCardLastFour())
                .cardType(request.getCardType())
                .build();

        // Mark seats as booked and create booking seats
        List<BookingSeat> bookingSeats = new ArrayList<>();
        for (ShowSeat seat : seats) {
            seat.setStatus(ShowSeat.SeatStatus.BOOKED);
            seat.setLockedBy(null);
            seat.setLockedUntil(null);

            BigDecimal seatPrice = pricingService.calculateSeatPrice(show, seat.getTier(), movie);
            BookingSeat bookingSeat = BookingSeat.builder()
                    .booking(booking)
                    .seat(seat)
                    .pricePaid(seatPrice)
                    .build();
            bookingSeats.add(bookingSeat);
        }

        booking.setBookingSeats(bookingSeats);
        showSeatRepository.saveAll(seats);
        Booking savedBooking = bookingRepository.save(booking);

        return mapToBookingResponse(savedBooking, show, movie, seats);
    }

    /**
     * Get user's booking history
     */
    public List<BookingResponse> getUserBookings(Long userId) {
        List<Booking> bookings = bookingRepository.findCompletedBookingsByUserId(userId);
        return bookings.stream().map(this::mapToBasicBookingResponse).toList();
    }

    /**
     * Get upcoming bookings (tickets)
     */
    public List<BookingResponse> getUpcomingTickets(Long userId) {
        List<Booking> bookings = bookingRepository.findCompletedBookingsByUserId(userId);
        return bookings.stream()
                .filter(b -> {
                    Show show = showRepository.findById(b.getShowId()).orElse(null);
                    if (show == null) return false;
                    return show.getShowDate().isAfter(java.time.LocalDate.now().minusDays(1));
                })
                .map(this::mapToBasicBookingResponse)
                .toList();
    }

    /**
     * Release expired seat locks (scheduled task)
     */
    @Transactional
    public int releaseExpiredLocks() {
        return showSeatRepository.releaseExpiredLocks(LocalDateTime.now());
    }

    private String generateBookingRef() {
        return "BK" + System.currentTimeMillis() + new Random().nextInt(1000);
    }

    private BookingResponse mapToBookingResponse(Booking booking, Show show, Movie movie, List<ShowSeat> seats) {
        return BookingResponse.builder()
                .id(booking.getId())
                .bookingRef(booking.getBookingRef())
                .movieTitle(movie.getTitle())
                .moviePosterUrl(movie.getPosterUrl())
                .theaterName(show.getTheaterName())
                .theaterCity(show.getTheaterCity())
                .showDate(show.getShowDate().toString())
                .showTime(show.getShowTime())
                .format(show.getFormat().name())
                .language(show.getLanguage())
                .seats(seats.stream().map(s -> s.getSeatNumber()).toList())
                .totalAmount(booking.getTotalAmount())
                .paymentStatus(booking.getPaymentStatus().name())
                .bookedAt(booking.getBookedAt().toString())
                .build();
    }

    private BookingResponse mapToBasicBookingResponse(Booking booking) {
        Show show = showRepository.findById(booking.getShowId()).orElse(null);
        Movie movie = movieRepository.findById(booking.getMovieId()).orElse(null);

        return BookingResponse.builder()
                .id(booking.getId())
                .bookingRef(booking.getBookingRef())
                .movieTitle(movie != null ? movie.getTitle() : "Unknown")
                .moviePosterUrl(movie != null ? movie.getPosterUrl() : null)
                .theaterName(show != null ? show.getTheaterName() : "Unknown")
                .showDate(show != null ? show.getShowDate().toString() : null)
                .showTime(show != null ? show.getShowTime() : null)
                .totalAmount(booking.getTotalAmount())
                .paymentStatus(booking.getPaymentStatus().name())
                .bookedAt(booking.getBookedAt().toString())
                .build();
    }
}
