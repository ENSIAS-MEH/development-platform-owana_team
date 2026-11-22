package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.request.ReportStartupRequest;
import com.foundersync.startup_service.security.AuthenticatedUser;
import com.foundersync.startup_service.service.StartupReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class StartupReportController {

    private final StartupReportService startupReportService;

    @PostMapping("/{startupId}/report")
    public ResponseEntity<Void> reportStartup(
            @PathVariable UUID startupId,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user,
            @Valid @RequestBody ReportStartupRequest request) {
        startupReportService.reportStartup(startupId, user.getUserId(), request);
        return ResponseEntity.ok().build();
    }
}