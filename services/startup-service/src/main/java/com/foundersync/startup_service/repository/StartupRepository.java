package com.foundersync.startup_service.repository;

import com.foundersync.startup_service.model.Startup;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface StartupRepository extends JpaRepository<Startup, UUID> {

    Page<Startup> findByIsActiveTrue(Pageable pageable);

    List<Startup> findByIsActiveTrue();

    List<Startup> findBySector(String sector);

    List<Startup> findByFounderId(UUID founderId);

    List<Startup> findByNameContainingIgnoreCase(String name);

    boolean existsByNameAndFounderId(String name, UUID founderId);

    Page<Startup> findByNumReportsGreaterThan(int numReports, Pageable pageable);

    List<Startup> findByIsBannedTrueAndBannedUntilBefore(LocalDateTime now);

}