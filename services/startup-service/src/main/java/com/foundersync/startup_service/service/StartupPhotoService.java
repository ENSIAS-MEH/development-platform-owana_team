package com.foundersync.startup_service.service;

import com.foundersync.startup_service.dto.response.StartupPhotoResponse;
import com.foundersync.startup_service.exception.ResourceNotFoundException;
import com.foundersync.startup_service.exception.UnauthorizedException;
import com.foundersync.startup_service.model.Startup;
import com.foundersync.startup_service.model.StartupPhoto;
import com.foundersync.startup_service.repository.StartupPhotoRepository;
import com.foundersync.startup_service.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StartupPhotoService {

    private final StartupPhotoRepository startupPhotoRepository;
    private final StartupRepository startupRepository;
    private final S3Client s3Client;

    @Value("${app.aws.bucket-name}")
    private String bucketName;

    @Value("${app.aws.region}")
    private String region;

    // ══════════════════════════════
    // UPLOAD PHOTO
    // ══════════════════════════════
    public String uploadPhoto(UUID startupId, UUID userId, MultipartFile file) throws IOException {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new RuntimeException("Startup not found"));

        if (!startup.getFounderId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can upload photos");
        }

        // Generate unique file key
        String fileKey = "startups/" + startupId + "/" + UUID.randomUUID() + "_" + file.getOriginalFilename();

        // Upload to S3
        PutObjectRequest putRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putRequest, RequestBody.fromBytes(file.getBytes()));

        // Build public URL
        String photoUrl = "https://" + bucketName + ".s3." + region + ".amazonaws.com/" + fileKey;

        // Save to DB
        StartupPhoto photo = StartupPhoto.builder()
                .startupId(startupId)
                .photoUrl(photoUrl)
                .build();

        startupPhotoRepository.save(photo);

        return photoUrl;
    }

    // ══════════════════════════════
    // GET ALL PHOTOS OF A STARTUP
    // ══════════════════════════════
    public List<StartupPhotoResponse> getPhotos(UUID startupId) {
        return startupPhotoRepository.findByStartupId(startupId)
                .stream()
                .map(photo -> StartupPhotoResponse.builder()
                        .id(photo.getId())
                        .photoUrl(photo.getPhotoUrl())
                        .build())
                .collect(Collectors.toList());
    }

    // ══════════════════════════════
    // DELETE PHOTO
    // ══════════════════════════════
    public void deletePhoto(UUID photoId, UUID userId) {

        StartupPhoto photo = startupPhotoRepository.findById(photoId)
                .orElseThrow(() -> new ResourceNotFoundException("Photo not found"));

        Startup startup = startupRepository.findById(photo.getStartupId())
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can delete photos");
        }

        String fileKey = photo.getPhotoUrl().substring(photo.getPhotoUrl().indexOf("startups/"));

        s3Client.deleteObject(DeleteObjectRequest.builder()
                .bucket(bucketName)
                .key(fileKey)
                .build());

        startupPhotoRepository.delete(photo);
    }
}