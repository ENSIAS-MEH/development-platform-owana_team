package com.foundersync.startup_service.security;

import lombok.*;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthenticatedUser {

    private UUID userId;
    private String role;

    public boolean isAdmin() {
        return "ADMIN".equals(role);
    }

    public boolean isUser() {
        return "USER".equals(role);
    }
}