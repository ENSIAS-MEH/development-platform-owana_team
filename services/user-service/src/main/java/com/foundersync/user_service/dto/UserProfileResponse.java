package com.foundersync.user_service.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class UserProfileResponse {

    private UUID id;
    private UUID userId;
    private String firstName;
    private String lastName;
    private String username;
    private String bio;
    private String profilePictureURL;
    private String email;
    private String job;
    private String phoneNumber;
    private String location;
    private LocalDateTime createdAt;
    private boolean isBanned;
}