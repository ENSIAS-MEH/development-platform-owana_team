package com.foundersync.post_service.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class PostResponse {
    private UUID id;
    private String content;
    private String imageURL;
    private Integer likesCount;
    private Integer commentsCount;
    private Integer saveCount;
    private UUID userId;

    // ADD THESE 3 FIELDS
    private String firstName;
    private String lastName;
    private String profilePictureURL;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean likedByCurrentUser;
    private boolean savedByCurrentUser;
}