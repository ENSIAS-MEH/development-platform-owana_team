package com.foundersync.startup_service.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UpdateStartupRequest {

    private String name;
    private String description;
    private String logoUrl;
    private String sector;
    private String location;
    private String highlights;
    private String programmes;
}