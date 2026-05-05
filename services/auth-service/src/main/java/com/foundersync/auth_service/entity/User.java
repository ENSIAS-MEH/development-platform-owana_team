package com.foundersync.auth_service.entity;

import com.foundersync.auth_service.enums.AppRole;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AppRole role;

    @Builder.Default
    private boolean isBanned = false;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(unique = true)
    private String resetPasswordToken;

    private LocalDateTime resetPasswordTokenExpiresAt;
}