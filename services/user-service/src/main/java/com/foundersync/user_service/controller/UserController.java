package com.foundersync.user_service.controller;

import com.foundersync.user_service.dto.UpdateProfileRequest;
import com.foundersync.user_service.dto.UserProfileResponse;
import com.foundersync.user_service.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;

    @GetMapping("/{userId}")
    @Operation(summary = "Get profile by userId")
    public ResponseEntity<UserProfileResponse> getByUserId(@PathVariable UUID userId) {
        return ResponseEntity.ok(userService.getProfileByUserId(userId));
    }

    @GetMapping("/username/{username}")
    @Operation(summary = "Get profile by username")
    public ResponseEntity<UserProfileResponse> getByUsername(@PathVariable String username) {
        return ResponseEntity.ok(userService.getProfileByUsername(username));
    }

    @PutMapping("/{userId}")
    @Operation(summary = "Update own profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @PathVariable UUID userId,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateProfile(userId, request));
    }

    @GetMapping("/search")
    @Operation(summary = "Search users by keyword (name, username, job)")
    public ResponseEntity<List<UserProfileResponse>> search(
            @RequestParam String keyword) {
        return ResponseEntity.ok(userService.searchUsers(keyword));
    }

    @DeleteMapping("/{userId}")
    @Operation(summary = "Delete profile")
    public ResponseEntity<Void> deleteProfile(@PathVariable UUID userId) {
        userService.deleteProfile(userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("User service is running");
    }
}
