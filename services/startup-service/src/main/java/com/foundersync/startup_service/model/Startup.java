package com.foundersync.startup_service.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "startups")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Startup {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "logo_url")
    private String logoUrl;

    @Column(nullable = false)
    private String sector;

    private String location;

    @Column(columnDefinition = "TEXT")
    private String highlights;

    @Column(columnDefinition = "TEXT")
    private String programmes;

    @Column(name = "founder_id", nullable = false)
    private UUID founderId;

    @Column(name = "is_active", nullable = false)
    private boolean isActive = true;

    @Column(name = "num_reports", nullable = false)
    private int numReports = 0;

    @Column(name = "is_reported", nullable = false)
    private boolean isReported = false;


    @Column(name = "is_banned", nullable = false)
    @Builder.Default
    private boolean isBanned = false;

    @Column(name = "ban_reason", columnDefinition = "TEXT")
    private String banReason;

    @Column(name = "banned_until")
    private LocalDateTime bannedUntil;

    @Column(name = "banned_at")
    private LocalDateTime bannedAt;
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}