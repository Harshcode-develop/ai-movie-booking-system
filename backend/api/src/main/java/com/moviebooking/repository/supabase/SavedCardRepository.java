package com.moviebooking.repository.supabase;

import com.moviebooking.entity.supabase.SavedCard;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SavedCardRepository extends JpaRepository<SavedCard, Long> {

    List<SavedCard> findByUserId(Long userId);
}
