package com.foundersync.user_service.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(unique = true, nullable = false)
    private UUID userId;

    private String firstName;
    private String lastName;

    @Column(unique = true)
    private String username;

    private String bio;
    private String profilePictureURL;
    private String email;
    private String job;
    private String phoneNumber;
    private String location;

    @Builder.Default
    private boolean isBanned = false;

    @CreationTimestamp
    private LocalDateTime createdAt;
}
