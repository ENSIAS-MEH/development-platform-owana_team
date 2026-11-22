package com.foundersync.startup_service.repository;

import com.foundersync.startup_service.model.StartupReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface StartupReportRepository extends JpaRepository<StartupReport, UUID> {

    List<StartupReport> findByStartupId(UUID startupId);

    boolean existsByStartupIdAndReporterId(UUID startupId, UUID reporterId);

    void deleteByStartupId(UUID startupId);
}