package com.foundersync.post_service.dto;

import lombok.Data;

import java.util.UUID;

@Data
public class PostRequest {
    private String content;
    private String imageURL;
    private UUID userId;
}