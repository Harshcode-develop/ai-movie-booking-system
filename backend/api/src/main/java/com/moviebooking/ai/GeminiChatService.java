package com.moviebooking.ai;

import com.moviebooking.ai.tools.MovieConciergeTools;
import com.moviebooking.entity.supabase.ConversationLog;
import com.moviebooking.repository.supabase.ConversationLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.messages.AssistantMessage;
import org.springframework.ai.chat.messages.Message;
import org.springframework.ai.chat.messages.SystemMessage;
import org.springframework.ai.chat.messages.UserMessage;
import org.springframework.ai.chat.model.ChatResponse;
import org.springframework.ai.chat.prompt.Prompt;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class GeminiChatService {

    private final ChatClient.Builder chatClientBuilder;
    private final ConversationLogRepository conversationLogRepository;
    private final MovieConciergeTools conciergeTools;

    private static final String SYSTEM_PROMPT = """
        You are a premium AI movie concierge for an exclusive cinema booking platform. 
        Your name is "CineAI" and you're sophisticated, helpful, and knowledgeable about films.
        
        Your capabilities:
        1. Search for movies by genre, language, or format
        2. Provide detailed movie information including cast and ratings
        3. Find theaters and showtimes
        4. Check real-time seat availability
        5. Explain pricing and seat tier differences (Classic, Prime, Premium, VIP)
        6. Recommend the best viewing experience based on movie genre
        
        Guidelines:
        - Be conversational and friendly, but professional
        - When recommending formats, explain WHY (e.g., "IMAX is perfect for this action movie because...")
        - Always offer alternatives if the user's first choice isn't available
        - If the user wants to book, remind them to log in if they haven't
        - Maximum 10 tickets can be booked at once
        - Use emojis sparingly for a premium feel (🎬, ⭐, 🎟️)
        
        Format your responses in a clean, readable way. Use bullet points for lists.
        """;

    public String chat(String sessionId, Long userId, String userMessage) {
        log.info("Processing chat for session: {}, user: {}", sessionId, userId);

        // Get or create conversation log
        ConversationLog conversation = conversationLogRepository.findBySessionId(sessionId)
                .orElseGet(() -> ConversationLog.builder()
                        .sessionId(sessionId)
                        .userId(userId)
                        .createdAt(LocalDateTime.now())
                        .messages(new ArrayList<>())
                        .build());

        // Build message history
        List<Message> messages = new ArrayList<>();
        messages.add(new SystemMessage(SYSTEM_PROMPT));
        
        // Add previous messages from conversation
        for (ConversationLog.Message msg : conversation.getMessages()) {
            if (msg.getRole() == ConversationLog.MessageRole.USER) {
                messages.add(new UserMessage(msg.getContent()));
            } else if (msg.getRole() == ConversationLog.MessageRole.ASSISTANT) {
                messages.add(new AssistantMessage(msg.getContent()));
            }
        }
        
        // Add current user message
        messages.add(new UserMessage(userMessage));

        // Create chat client with tools
        ChatClient chatClient = chatClientBuilder
                .defaultFunctions(
                        "searchMovies",
                        "getMovieDetails",
                        "getTheatersForMovie",
                        "getShowtimes",
                        "checkSeatAvailability",
                        "getSeatPricing",
                        "explainSeatTiers",
                        "recommendExperience"
                )
                .build();

        try {
            // Get AI response
            Prompt prompt = new Prompt(messages);
            ChatResponse response = chatClient.prompt(prompt).call().chatResponse();
            String assistantMessage = response.getResult().getOutput().getText();

            // Log messages
            conversation.getMessages().add(ConversationLog.Message.builder()
                    .role(ConversationLog.MessageRole.USER)
                    .content(userMessage)
                    .timestamp(LocalDateTime.now())
                    .build());
            
            conversation.getMessages().add(ConversationLog.Message.builder()
                    .role(ConversationLog.MessageRole.ASSISTANT)
                    .content(assistantMessage)
                    .timestamp(LocalDateTime.now())
                    .build());
            
            conversation.setLastUpdatedAt(LocalDateTime.now());
            conversationLogRepository.save(conversation);

            return assistantMessage;
        } catch (Exception e) {
            log.error("AI chat error for session {}: {}", sessionId, e.getMessage());
            
            // Save user message even if AI fails
            conversation.getMessages().add(ConversationLog.Message.builder()
                    .role(ConversationLog.MessageRole.USER)
                    .content(userMessage)
                    .timestamp(LocalDateTime.now())
                    .build());
            conversation.setLastUpdatedAt(LocalDateTime.now());
            conversationLogRepository.save(conversation);
            
            // Return a friendly message based on the error type
            if (e.getMessage() != null && e.getMessage().contains("429")) {
                return "🎬 I'm experiencing high demand right now. Please try again in a few seconds!";
            }
            return "🎬 I'm having a temporary issue connecting to my brain. Please try again in a moment!";
        }
    }

    public String createNewSession() {
        return UUID.randomUUID().toString();
    }
}
