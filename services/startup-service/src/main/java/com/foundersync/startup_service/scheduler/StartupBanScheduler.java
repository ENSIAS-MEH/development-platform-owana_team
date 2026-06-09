package com.foundersync.startup_service.scheduler;

import com.foundersync.startup_service.model.Startup;
import com.foundersync.startup_service.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class StartupBanScheduler {

    private final StartupRepository startupRepository;

    @Scheduled(fixedRate = 3600000) // runs every hour
    public void autoUnbanExpiredStartups() {

        List<Startup> expiredBans = startupRepository
                .findByIsBannedTrueAndBannedUntilBefore(LocalDateTime.now());

        if (expiredBans.isEmpty()) {
            return;
        }

        log.info("Auto-unbanning {} startup(s)", expiredBans.size());

        expiredBans.forEach(startup -> {
            startup.setBanned(false);
            startup.setActive(true);
            startup.setBanReason(null);
            startup.setBannedUntil(null);
            startup.setBannedAt(null);
        });

        startupRepository.saveAll(expiredBans);

        log.info("Auto-unban completed successfully");
    }
}