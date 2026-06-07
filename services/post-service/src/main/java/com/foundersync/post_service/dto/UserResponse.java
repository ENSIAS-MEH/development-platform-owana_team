package com.foundersync.post_service.dto;

import lombok.Data;
import java.util.UUID;

@Data
public class UserResponse {
    private UUID userId;
    private String firstName;
    private String lastName;
    private String profilePictureURL;
    private String username;
}