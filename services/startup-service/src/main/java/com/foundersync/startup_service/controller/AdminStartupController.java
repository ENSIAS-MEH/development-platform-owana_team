package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.request.BanStartupRequest;
import com.foundersync.startup_service.dto.response.PageResponse;
import com.foundersync.startup_service.dto.response.StartupReportResponse;
import com.foundersync.startup_service.dto.response.StartupResponse;
import com.foundersync.startup_service.service.AdminStartupService;
import com.foundersync.startup_service.service.StartupReportService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/startups")
@RequiredArgsConstructor
public class AdminStartupController {

    private final AdminStartupService adminStartupService;
    private final StartupReportService startupReportService;

    // GET ALL STARTUPS
    @GetMapping
    public ResponseEntity<PageResponse<StartupResponse>> getAllStartups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(adminStartupService.getAllStartups(page, size));
    }

    // GET REPORTED STARTUPS
    @GetMapping("/reported")
    public ResponseEntity<PageResponse<StartupResponse>> getReportedStartups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "1") int minReports) {
        return ResponseEntity.ok(adminStartupService.getReportedStartups(page, size, minReports));
    }

    // GET REPORTS OF A STARTUP
    @GetMapping("/{startupId}/reports")
    public ResponseEntity<List<StartupReportResponse>> getReports(
            @PathVariable UUID startupId) {
        return ResponseEntity.ok(startupReportService.getReports(startupId));
    }

    // BAN STARTUP
    @PutMapping("/{startupId}/ban")
    public ResponseEntity<Void> banStartup(
            @PathVariable UUID startupId,
            @Valid @RequestBody BanStartupRequest request) {
        adminStartupService.banStartup(startupId, request);
        return ResponseEntity.ok().build();
    }

    // UNBAN STARTUP
    @PutMapping("/{startupId}/unban")
    public ResponseEntity<Void> unbanStartup(@PathVariable UUID startupId) {
        adminStartupService.unbanStartup(startupId);
        return ResponseEntity.ok().build();
    }

    // DELETE STARTUP PERMANENTLY
    @DeleteMapping("/{startupId}")
    public ResponseEntity<Void> deleteStartup(@PathVariable UUID startupId) {
        adminStartupService.deleteStartup(startupId);
        return ResponseEntity.noContent().build();
    }
}