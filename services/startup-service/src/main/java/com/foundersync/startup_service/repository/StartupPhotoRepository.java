package com.foundersync.startup_service.repository;

import com.foundersync.startup_service.model.StartupPhoto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StartupPhotoRepository extends JpaRepository<StartupPhoto, UUID> {
    List<StartupPhoto> findByStartupId(UUID startupId);
    void deleteByStartupId(UUID startupId);
}