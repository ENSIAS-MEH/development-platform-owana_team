package com.foundersync.startup_service.dto.response;

import com.foundersync.startup_service.model.JoinRequestStatus;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinRequestResponse {

    private UUID id;
    private UUID startupId;
    private UUID userId;
    private JoinRequestStatus status;
    private LocalDateTime createdAt;
}