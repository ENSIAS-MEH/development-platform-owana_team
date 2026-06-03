package com.foundersync.user_service.controller;

import com.foundersync.user_service.dto.UpdateProfileRequest;
import com.foundersync.user_service.dto.UserProfileResponse;
import com.foundersync.user_service.security.JwtUtil;
import com.foundersync.user_service.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "User profile management")
public class UserController {

    private final UserService userService;
    private final JwtUtil jwtUtil;

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

    @GetMapping("/me")
    @Operation(summary = "Get my own profile from JWT token")
    public ResponseEntity<UserProfileResponse> getMyProfile(
            @RequestHeader("Authorization") String authHeader) {
        return ResponseEntity.ok(userService.getMyProfile(authHeader));
    }

    @PutMapping("/me")
    @Operation(summary = "Update my own profile")
    public ResponseEntity<UserProfileResponse> updateMyProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(userService.updateMyProfile(authHeader, request));
    }

    @GetMapping
    @Operation(summary = "Get all users — admin only")
    public ResponseEntity<List<UserProfileResponse>> getAllUsers(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        String role = jwtUtil.extractRole(authHeader);
        if (!"ADMIN".equals(role)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(userService.getAllUsers(page, size));
    }

    @PostMapping("/me/picture")
    @Operation(summary = "Upload profile picture to S3")
    public ResponseEntity<UserProfileResponse> uploadProfilePicture(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(userService.uploadProfilePicture(authHeader, file));
    }
}
