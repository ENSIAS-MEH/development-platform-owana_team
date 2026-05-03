package com.foundersync.user_service.service.impl;

import com.foundersync.user_service.dto.UpdateProfileRequest;
import com.foundersync.user_service.dto.UserProfileResponse;
import com.foundersync.user_service.entity.UserProfile;
import com.foundersync.user_service.exception.ProfileNotFoundException;
import com.foundersync.user_service.repository.UserProfileRepository;
import com.foundersync.user_service.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserServiceImpl implements UserService {

    private final UserProfileRepository userProfileRepository;

    @Override
    public UserProfileResponse getProfileByUserId(UUID userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException(
                        "Profile not found for userId: " + userId));
        return toResponse(profile);
    }

    @Override
    public UserProfileResponse getProfileByUsername(String username) {
        UserProfile profile = userProfileRepository.findByUsername(username)
                .orElseThrow(() -> new ProfileNotFoundException(
                        "Profile not found for username: " + username));
        return toResponse(profile);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException(
                        "Profile not found for userId: " + userId));

        if (request.getUsername() != null &&
                !request.getUsername().equals(profile.getUsername()) &&
                userProfileRepository.existsByUsername(request.getUsername())) {
            throw new IllegalArgumentException(
                    "Username already taken: " + request.getUsername());
        }

        if (request.getFirstName() != null) profile.setFirstName(request.getFirstName());
        if (request.getLastName() != null) profile.setLastName(request.getLastName());
        if (request.getUsername() != null) profile.setUsername(request.getUsername());
        if (request.getBio() != null) profile.setBio(request.getBio());
        if (request.getProfilePictureURL() != null) profile.setProfilePictureURL(request.getProfilePictureURL());
        if (request.getJob() != null) profile.setJob(request.getJob());
        if (request.getPhoneNumber() != null) profile.setPhoneNumber(request.getPhoneNumber());
        if (request.getLocation() != null) profile.setLocation(request.getLocation());

        userProfileRepository.save(profile);
        log.info("Profile updated for userId: {}", userId);
        return toResponse(profile);
    }

    @Override
    public List<UserProfileResponse> searchUsers(String keyword) {
        return userProfileRepository.searchByKeyword(keyword)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteProfile(UUID userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseThrow(() -> new ProfileNotFoundException(
                        "Profile not found for userId: " + userId));
        userProfileRepository.delete(profile);
    }

    // ─── Mapper ──────────────────────────────────────────────────────────────

    private UserProfileResponse toResponse(UserProfile profile) {
        return UserProfileResponse.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .firstName(profile.getFirstName())
                .lastName(profile.getLastName())
                .username(profile.getUsername())
                .bio(profile.getBio())
                .profilePictureURL(profile.getProfilePictureURL())
                .email(profile.getEmail())
                .job(profile.getJob())
                .phoneNumber(profile.getPhoneNumber())
                .location(profile.getLocation())
                .createdAt(profile.getCreatedAt())
                .build();
    }
}
