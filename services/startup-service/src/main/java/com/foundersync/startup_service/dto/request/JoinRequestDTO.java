package com.foundersync.startup_service.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JoinRequestDTO {

    @NotNull(message = "Startup ID is required")
    private UUID startupId;
}