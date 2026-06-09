package com.foundersync.post_service.controller;

import com.foundersync.post_service.service.S3Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/posts")
@RequiredArgsConstructor
public class UploadController {

    private final S3Service s3Service;

    @PostMapping("/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file) throws IOException {

        // Valider le type de fichier
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg")
                && !contentType.equals("image/png")
                && !contentType.equals("image/webp"))) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid file type. Only JPEG, PNG and WebP are allowed."));
        }

        // Valider la taille (5 Mo max)
        if (file.getSize() > 5 * 1024 * 1024) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "File size exceeds 5MB limit."));
        }

        String imageUrl = s3Service.uploadFile(file);
        return ResponseEntity.ok(Map.of("imageUrl", imageUrl));
    }
}