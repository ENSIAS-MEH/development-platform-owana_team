package com.foundersync.startup_service.dto.response;

import com.foundersync.startup_service.model.StartupRole;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartupMemberResponse {

    private UUID id;
    private UUID startupId;
    private UUID userId;
    private StartupRole startupRole;
    private LocalDateTime joinedAt;
}