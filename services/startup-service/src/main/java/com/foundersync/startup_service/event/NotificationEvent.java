package com.foundersync.startup_service.event;

import lombok.*;

import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationEvent {

    private String type;
    private UUID recipientId;
    private List<UUID> recipientIds;
    private UUID senderId;
    private UUID startupId;
    private String startupName;
    private String message;

    // ← champs pour le Chat Service
    private UUID founderId;
    private UUID requesterId;
    private String autoMessage;
}