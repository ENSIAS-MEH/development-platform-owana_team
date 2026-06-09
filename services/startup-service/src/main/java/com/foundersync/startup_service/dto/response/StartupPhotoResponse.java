package com.foundersync.startup_service.dto.response;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StartupPhotoResponse {
    private UUID id;
    private String photoUrl;
}