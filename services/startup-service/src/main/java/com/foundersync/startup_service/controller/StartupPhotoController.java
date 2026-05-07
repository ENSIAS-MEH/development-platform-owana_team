package com.foundersync.startup_service.controller;

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

    // UPLOAD PHOTO
    @PostMapping("/{startupId}/photos")
    public ResponseEntity<String> uploadPhoto(
            @PathVariable UUID startupId,
            @RequestHeader("X-User-Id") UUID userId,
            @RequestParam("file") MultipartFile file) throws IOException {
        String photoUrl = startupPhotoService.uploadPhoto(startupId, userId, file);
        return ResponseEntity.ok(photoUrl);
    }

    // GET ALL PHOTOS
    @GetMapping("/{startupId}/photos")
    public ResponseEntity<List<String>> getPhotos(
            @PathVariable UUID startupId) {
        return ResponseEntity.ok(startupPhotoService.getPhotos(startupId));
    }

    // DELETE PHOTO
    @DeleteMapping("/photos/{photoId}")
    public ResponseEntity<Void> deletePhoto(
            @PathVariable UUID photoId,
            @RequestHeader("X-User-Id") UUID userId) {
        startupPhotoService.deletePhoto(photoId, userId);
        return ResponseEntity.noContent().build();
    }
}