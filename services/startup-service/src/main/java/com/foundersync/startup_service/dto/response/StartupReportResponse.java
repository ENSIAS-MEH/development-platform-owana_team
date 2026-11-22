package com.foundersync.startup_service.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartupReportResponse {

    private UUID id;
    private UUID startupId;
    private UUID reporterId;
    private String reason;
    private LocalDateTime createdAt;
}