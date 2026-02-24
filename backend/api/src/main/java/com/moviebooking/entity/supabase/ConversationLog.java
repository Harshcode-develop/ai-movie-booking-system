package com.moviebooking.entity.supabase;

import lombok.*;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Entity
@Table(name = "conversation_logs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ConversationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(name = "session_id")
    private String sessionId;

    @Column(name = "user_id")
    private Long userId;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    @Builder.Default
    private List<Message> messages = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "last_updated_at")
    private LocalDateTime lastUpdatedAt;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Message {
        private MessageRole role;
        private String content;
        private LocalDateTime timestamp;
        private List<FunctionCall> functionCalls;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class FunctionCall {
        private String name;
        private Map<String, Object> args;
        private Object result;
    }

    public enum MessageRole {
        USER, ASSISTANT, SYSTEM
    }
}
