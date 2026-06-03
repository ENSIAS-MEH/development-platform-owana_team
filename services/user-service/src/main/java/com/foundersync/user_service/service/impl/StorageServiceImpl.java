package com.foundersync.user_service.service.impl;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import com.foundersync.user_service.service.StorageService;

import java.io.IOException;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class StorageServiceImpl implements StorageService {

    private final S3Client s3Client;

    @Value("${app.aws.bucket-name}")
    private String bucketName;

    @Value("${app.aws.region}")
    private String region;

    @Override
    public String uploadProfilePicture(MultipartFile file, String userId) {
        // Validate file
        validateImageFile(file);

        // Generate unique key — profile-pictures/userId/uuid.extension
        String extension = getExtension(file.getOriginalFilename());
        String key = "profile-pictures/" + userId + "/" +
                UUID.randomUUID() + "." + extension;

        try {
            PutObjectRequest putRequest = PutObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .contentType(file.getContentType())
                    .contentLength(file.getSize())
                    .build();

            s3Client.putObject(putRequest,
                    RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

            // Build the public URL
            String url = "https://" + bucketName + ".s3." + region +
                    ".amazonaws.com/" + key;

            log.info("Uploaded profile picture for userId: {} → {}", userId, url);
            return url;

        } catch (IOException e) {
            log.error("Failed to upload file for userId {}: {}", userId, e.getMessage());
            throw new RuntimeException("Failed to upload profile picture");
        }
    }

    @Override
    public void deleteFile(String fileUrl) {
        if (fileUrl == null || fileUrl.isBlank()) return;

        try {
            // Extract the key from the URL
            // URL format: https://bucket.s3.region.amazonaws.com/key
            String key = fileUrl.substring(fileUrl.indexOf(".amazonaws.com/") + 15);

            DeleteObjectRequest deleteRequest = DeleteObjectRequest.builder()
                    .bucket(bucketName)
                    .key(key)
                    .build();

            s3Client.deleteObject(deleteRequest);
            log.info("Deleted file from S3: {}", key);

        } catch (Exception e) {
            log.error("Failed to delete file from S3: {}", e.getMessage());
        }
    }

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private void validateImageFile(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("File must be an image");
        }

        // Max 5MB
        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new IllegalArgumentException("File size must not exceed 5MB");
        }
    }

    private String getExtension(String filename) {
        if (filename == null || !filename.contains(".")) return "jpg";
        return filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
    }
}
