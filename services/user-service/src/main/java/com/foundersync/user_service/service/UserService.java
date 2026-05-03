package com.foundersync.user_service.service;

import com.foundersync.user_service.dto.UpdateProfileRequest;
import com.foundersync.user_service.dto.UserProfileResponse;

import java.util.List;
import java.util.UUID;

public interface UserService {

    UserProfileResponse getProfileByUserId(UUID userId);

    UserProfileResponse getProfileByUsername(String username);

    UserProfileResponse updateProfile(UUID userId, UpdateProfileRequest request);

    List<UserProfileResponse> searchUsers(String keyword);

    void deleteProfile(UUID userId);
}
