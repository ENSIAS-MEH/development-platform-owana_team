package com.foundersync.startup_service.repository;

import com.foundersync.startup_service.model.JoinRequest;
import com.foundersync.startup_service.model.JoinRequestStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, UUID> {

    List<JoinRequest> findByStartupId(UUID startupId);

    List<JoinRequest> findByUserId(UUID userId);

    List<JoinRequest> findByStartupIdAndStatus(UUID startupId, JoinRequestStatus status);

    List<JoinRequest> findByUserIdAndStatus(UUID userId, JoinRequestStatus status);

    Optional<JoinRequest> findByStartupIdAndUserId(UUID startupId, UUID userId);

    boolean existsByStartupIdAndUserIdAndStatus(UUID startupId, UUID userId, JoinRequestStatus status);
}