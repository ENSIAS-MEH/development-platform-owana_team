package com.foundersync.startup_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartupRequest {

    @NotBlank(message = "Name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    private String logoUrl;

    @NotBlank(message = "Sector is required")
    private String sector;

    private String location;

    private String highlights;

    private String programmes;
}