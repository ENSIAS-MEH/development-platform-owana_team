package com.foundersync.startup_service.service;

import com.foundersync.startup_service.dto.request.ReportStartupRequest;
import com.foundersync.startup_service.dto.response.StartupReportResponse;
import com.foundersync.startup_service.exception.BadRequestException;
import com.foundersync.startup_service.exception.ResourceNotFoundException;
import com.foundersync.startup_service.model.Startup;
import com.foundersync.startup_service.model.StartupReport;
import com.foundersync.startup_service.repository.StartupRepository;
import com.foundersync.startup_service.repository.StartupReportRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StartupReportService {

    private final StartupReportRepository startupReportRepository;
    private final StartupRepository startupRepository;

    // ══════════════════════════════
    // REPORT A STARTUP
    // ══════════════════════════════
    public void reportStartup(UUID startupId, UUID reporterId, ReportStartupRequest request) {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.isActive()) {
            throw new BadRequestException("Cannot report an inactive startup");
        }

        if (startup.getFounderId().equals(reporterId)) {
            throw new BadRequestException("You cannot report your own startup");
        }

        if (startupReportRepository.existsByStartupIdAndReporterId(startupId, reporterId)) {
            throw new BadRequestException("You have already reported this startup");
        }

        StartupReport report = StartupReport.builder()
                .startupId(startupId)
                .reporterId(reporterId)
                .reason(request.getReason())
                .build();

        startupReportRepository.save(report);

        startup.setNumReports(startup.getNumReports() + 1);
        startupRepository.save(startup);
    }

    // ══════════════════════════════
    // GET REPORTS FOR A STARTUP (admin)
    // ══════════════════════════════
    public List<StartupReportResponse> getReports(UUID startupId) {
        startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        return startupReportRepository.findByStartupId(startupId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ══════════════════════════════
    // MAPPER
    // ══════════════════════════════
    private StartupReportResponse mapToResponse(StartupReport report) {
        return StartupReportResponse.builder()
                .id(report.getId())
                .startupId(report.getStartupId())
                .reporterId(report.getReporterId())
                .reason(report.getReason())
                .createdAt(report.getCreatedAt())
                .build();
    }
}