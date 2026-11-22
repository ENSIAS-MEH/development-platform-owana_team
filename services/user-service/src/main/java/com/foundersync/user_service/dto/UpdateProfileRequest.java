package com.foundersync.user_service.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateProfileRequest {

    @Size(max = 50, message = "First name must not exceed 50 characters")
    private String firstName;

    @Size(max = 50, message = "Last name must not exceed 50 characters")
    private String lastName;

    @Size(max = 30, message = "Username must not exceed 30 characters")
    private String username;

    @Size(max = 300, message = "Bio must not exceed 300 characters")
    private String bio;

    private String profilePictureURL;
    private String job;
    private String phoneNumber;
    private String location;
}
