package com.moviebooking.controller;

import com.moviebooking.entity.supabase.Address;
import com.moviebooking.entity.supabase.SavedCard;
import com.moviebooking.entity.supabase.User;
import com.moviebooking.repository.supabase.AddressRepository;
import com.moviebooking.repository.supabase.SavedCardRepository;
import com.moviebooking.repository.supabase.UserRepository;
import com.moviebooking.security.UserDetailsServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final AddressRepository addressRepository;
    private final SavedCardRepository savedCardRepository;
    private final UserDetailsServiceImpl userDetailsService;

    @GetMapping("/profile")
    public ResponseEntity<Map<String, Object>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "email", user.getEmail(),
                "fullName", user.getFullName() != null ? user.getFullName() : "",
                "phone", user.getPhone() != null ? user.getPhone() : "",
                "age", user.getAge() != null ? user.getAge() : 0
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<User> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, Object> profileData) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        
        if (profileData.containsKey("fullName")) {
            user.setFullName((String) profileData.get("fullName"));
        }
        if (profileData.containsKey("phone")) {
            user.setPhone((String) profileData.get("phone"));
        }
        if (profileData.containsKey("age")) {
            user.setAge((Integer) profileData.get("age"));
        }
        
        return ResponseEntity.ok(userRepository.save(user));
    }

    // Addresses
    @GetMapping("/addresses")
    public ResponseEntity<List<Address>> getAddresses(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(addressRepository.findByUserId(user.getId()));
    }

    @PostMapping("/addresses")
    public ResponseEntity<Address> addAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Address address) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        address.setUser(user);
        return ResponseEntity.ok(addressRepository.save(address));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<Void> deleteAddress(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        addressRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    // Saved Cards
    @GetMapping("/cards")
    public ResponseEntity<List<SavedCard>> getSavedCards(
            @AuthenticationPrincipal UserDetails userDetails) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        return ResponseEntity.ok(savedCardRepository.findByUserId(user.getId()));
    }

    @PostMapping("/cards")
    public ResponseEntity<SavedCard> saveCard(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody SavedCard card) {
        User user = userDetailsService.getUserByEmail(userDetails.getUsername());
        card.setUser(user);
        return ResponseEntity.ok(savedCardRepository.save(card));
    }

    @DeleteMapping("/cards/{id}")
    public ResponseEntity<Void> deleteCard(@PathVariable Long id) {
        savedCardRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
