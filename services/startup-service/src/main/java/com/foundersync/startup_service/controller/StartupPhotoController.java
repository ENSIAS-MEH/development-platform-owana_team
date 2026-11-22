package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.response.StartupPhotoResponse;
import com.foundersync.startup_service.security.AuthenticatedUser;
import com.foundersync.startup_service.service.StartupPhotoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class StartupPhotoController {

    private final StartupPhotoService startupPhotoService;

    @PostMapping("/{startupId}/photos")
    public ResponseEntity<String> uploadPhoto(
            @PathVariable UUID startupId,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user,
            @RequestParam("file") MultipartFile file) throws IOException {
        return ResponseEntity.ok(startupPhotoService.uploadPhoto(startupId, user.getUserId(), file));
    }

    @GetMapping("/{startupId}/photos")
    public ResponseEntity<List<StartupPhotoResponse>> getPhotos(
            @PathVariable UUID startupId) {
        return ResponseEntity.ok(startupPhotoService.getPhotos(startupId));
    }

    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable UUID photoId,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        startupPhotoService.deletePhoto(photoId, user.getUserId());
        return ResponseEntity.noContent().build();
    }
}