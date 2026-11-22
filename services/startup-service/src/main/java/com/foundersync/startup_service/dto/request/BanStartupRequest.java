package com.foundersync.startup_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BanStartupRequest {

    @NotBlank(message = "Ban reason is required")
    private String banReason;

    private LocalDateTime bannedUntil;
}