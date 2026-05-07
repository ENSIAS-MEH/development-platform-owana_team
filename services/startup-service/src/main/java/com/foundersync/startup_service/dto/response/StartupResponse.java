package com.foundersync.startup_service.dto.response;

import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartupResponse {

    private UUID id;
    private String name;
    private String description;
    private String logoUrl;
    private String sector;
    private String location;
    private String highlights;
    private String programmes;
    private Double rating;
    private UUID founderId;
    private boolean isActive;
    private int numReports;
    private LocalDateTime createdAt;
}