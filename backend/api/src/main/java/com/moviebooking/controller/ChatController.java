package com.moviebooking.controller;

import com.moviebooking.ai.GeminiChatService;
import com.moviebooking.entity.supabase.User;
import com.moviebooking.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiChatService chatService;
    private final UserDetailsServiceImpl userDetailsService;

    /**
     * Public chat endpoint (anonymous users)
     */
    @PostMapping("/public")
    public ResponseEntity<Map<String, String>> publicChat(
            @RequestParam String sessionId,
            @RequestBody Map<String, String> request) {
        String userMessage = request.get("message");
        String response = chatService.chat(sessionId, null, userMessage);
        return ResponseEntity.ok(Map.of(
                "response", response,
                "sessionId", sessionId
        ));
    }

    /**
     * Authenticated chat endpoint
     */
    @PostMapping("/authenticated")
    public ResponseEntity<Map<String, String>> authenticatedChat(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam String sessionId,
            @RequestBody Map<String, String> request) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        String userMessage = request.get("message");
        String response = chatService.chat(sessionId, user.getId(), userMessage);
        return ResponseEntity.ok(Map.of(
                "response", response,
                "sessionId", sessionId,
                "userId", user.getId().toString()
        ));
    }

    /**
     * Create new chat session
     */
    @GetMapping("/session")
    public ResponseEntity<Map<String, String>> createSession() {
        String sessionId = chatService.createNewSession();
        return ResponseEntity.ok(Map.of("sessionId", sessionId));
    }
}
