package com.foundersync.post_service.event;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PostNotificationEvent {
    private String type;
    private UUID recipientId;
    private UUID senderId;
    private UUID postId;
    private String message;
}