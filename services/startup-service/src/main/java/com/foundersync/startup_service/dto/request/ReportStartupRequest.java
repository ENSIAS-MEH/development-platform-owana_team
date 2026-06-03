package com.foundersync.startup_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportStartupRequest {

    @NotBlank(message = "Reason is required")
    private String reason;
}