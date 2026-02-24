package com.moviebooking.repository.supabase;

import com.moviebooking.entity.supabase.ConversationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConversationLogRepository extends JpaRepository<ConversationLog, String> {

    Optional<ConversationLog> findBySessionId(String sessionId);

    List<ConversationLog> findByUserId(Long userId);

    List<ConversationLog> findByUserIdOrderByLastUpdatedAtDesc(Long userId);
}
