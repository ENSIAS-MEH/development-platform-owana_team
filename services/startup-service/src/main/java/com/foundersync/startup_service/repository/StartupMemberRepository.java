package com.foundersync.startup_service.repository;

import com.foundersync.startup_service.model.StartupMember;
import com.foundersync.startup_service.model.StartupRole;
import com.foundersync.startup_service.model.StartupRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface StartupMemberRepository extends JpaRepository<StartupMember, UUID> {

    List<StartupMember> findByStartupId(UUID startupId);

    List<StartupMember> findByUserId(UUID userId);

    Optional<StartupMember> findByStartupIdAndUserId(UUID startupId, UUID userId);

    boolean existsByStartupIdAndUserId(UUID startupId, UUID userId);

    List<StartupMember> findByStartupIdAndStartupRole(UUID startupId, StartupRole startupRole);

    void deleteByStartupIdAndUserId(UUID startupId, UUID userId);
}