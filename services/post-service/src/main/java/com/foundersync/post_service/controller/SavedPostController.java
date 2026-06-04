package com.foundersync.post_service.controller;

import com.foundersync.post_service.entity.SavedPost;
import com.foundersync.post_service.service.SavedPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class SavedPostController {

    private final SavedPostService savedPostService;

    // Sauvegarder un post
    @PostMapping("/{postId}/save/{userId}")
    public ResponseEntity<String> savePost(
            @PathVariable UUID postId,
            @PathVariable UUID userId) {
        return ResponseEntity.ok(savedPostService.savePost(postId, userId));
    }

    // Unsave un post
    @DeleteMapping("/{postId}/save/{userId}")
    public ResponseEntity<String> unsavePost(
            @PathVariable UUID postId,
            @PathVariable UUID userId) {
        return ResponseEntity.ok(savedPostService.unsavePost(postId, userId));
    }

    // Consulter les posts sauvegardés
    @GetMapping("/saved/{userId}")
    public ResponseEntity<List<SavedPost>> getSavedPosts(@PathVariable UUID userId) {
        return ResponseEntity.ok(savedPostService.getSavedPostsByUserId(userId));
    }
}