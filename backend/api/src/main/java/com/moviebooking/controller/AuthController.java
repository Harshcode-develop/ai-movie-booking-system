package com.moviebooking.controller;

import com.moviebooking.dto.request.LoginRequest;
import com.moviebooking.dto.request.SignupRequest;
import com.moviebooking.dto.response.AuthResponse;
import com.moviebooking.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.ok(authService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleSignIn(
            @RequestParam String googleId,
            @RequestParam String email,
            @RequestParam String name) {
        return ResponseEntity.ok(authService.googleSignIn(googleId, email, name));
    }
}
