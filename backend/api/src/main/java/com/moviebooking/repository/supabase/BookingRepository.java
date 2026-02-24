package com.moviebooking.repository.supabase;

import com.moviebooking.entity.supabase.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByBookingRef(String bookingRef);

    List<Booking> findByUserIdOrderByBookedAtDesc(Long userId);

    @Query("SELECT b FROM Booking b WHERE b.user.id = :userId AND b.paymentStatus = 'COMPLETED' ORDER BY b.bookedAt DESC")
    List<Booking> findCompletedBookingsByUserId(@Param("userId") Long userId);

    @Query("SELECT b FROM Booking b JOIN FETCH b.bookingSeats WHERE b.id = :id")
    Optional<Booking> findByIdWithSeats(@Param("id") Long id);

    @Query("SELECT COUNT(bs) FROM BookingSeat bs WHERE bs.booking.user.id = :userId AND bs.booking.paymentStatus = 'PENDING'")
    Long countPendingSeatsForUser(@Param("userId") Long userId);
}
