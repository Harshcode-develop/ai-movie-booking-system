package com.moviebooking.repository.supabase;

import com.moviebooking.entity.supabase.ShowSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ShowSeatRepository extends JpaRepository<ShowSeat, Long> {

    List<ShowSeat> findByShowId(String showId);

    @Query("SELECT s FROM ShowSeat s WHERE s.showId = :showId AND s.tier = :tier")
    List<ShowSeat> findByShowIdAndTier(@Param("showId") String showId, @Param("tier") ShowSeat.SeatTier tier);

    @Query("SELECT s FROM ShowSeat s WHERE s.showId = :showId AND s.status = 'AVAILABLE'")
    List<ShowSeat> findAvailableSeatsByShowId(@Param("showId") String showId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ShowSeat s WHERE s.id = :id")
    Optional<ShowSeat> findByIdWithLock(@Param("id") Long id);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT s FROM ShowSeat s WHERE s.id IN :ids")
    List<ShowSeat> findByIdsWithLock(@Param("ids") List<Long> ids);

    @Modifying
    @Query("UPDATE ShowSeat s SET s.status = 'AVAILABLE', s.lockedBy = null, s.lockedUntil = null " +
           "WHERE s.lockedUntil < :now AND s.status = 'LOCKED'")
    int releaseExpiredLocks(@Param("now") LocalDateTime now);

    @Query("SELECT COUNT(s) FROM ShowSeat s WHERE s.showId = :showId AND s.status = 'AVAILABLE'")
    Long countAvailableSeats(@Param("showId") String showId);

    @Query("SELECT COUNT(s) FROM ShowSeat s WHERE s.showId = :showId AND s.tier = :tier AND s.status = 'AVAILABLE'")
    Long countAvailableSeatsByTier(@Param("showId") String showId, @Param("tier") ShowSeat.SeatTier tier);
}
