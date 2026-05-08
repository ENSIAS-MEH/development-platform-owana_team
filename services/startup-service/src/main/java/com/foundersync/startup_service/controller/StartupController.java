package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.request.StartupRequest;
import com.foundersync.startup_service.dto.request.UpdateStartupRequest;
import com.foundersync.startup_service.dto.response.PageResponse;
import com.foundersync.startup_service.dto.response.StartupResponse;
import com.foundersync.startup_service.service.StartupService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class StartupController {

    private final StartupService startupService;

    // CREATE STARTUP
    @PostMapping
    public ResponseEntity<StartupResponse> createStartup(
            @Valid @RequestBody StartupRequest request,
            @RequestHeader("X-User-Id") UUID founderId) {
        return ResponseEntity.ok(startupService.createStartup(request, founderId));
    }

    // GET ALL STARTUPS
    // GET ALL STARTUPS (PAGINATED)
    @GetMapping
    public ResponseEntity<PageResponse<StartupResponse>> getAllStartups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(startupService.getAllStartups(page, size));
    }

    // GET STARTUP BY ID
    @GetMapping("/{id}")
    public ResponseEntity<StartupResponse> getStartupById(@PathVariable UUID id) {
        return ResponseEntity.ok(startupService.getStartupById(id));
    }

    // SEARCH STARTUPS
    @GetMapping("/search")
    public ResponseEntity<List<StartupResponse>> searchStartups(
            @RequestParam String name) {
        return ResponseEntity.ok(startupService.searchStartups(name));
    }

    // GET MY STARTUPS
    @GetMapping("/my")
    public ResponseEntity<List<StartupResponse>> getMyStartups(
            @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(startupService.getMyStartups(userId));
    }

    // UPDATE STARTUP
    @PutMapping("/{id}")
    public ResponseEntity<StartupResponse> updateStartup(
            @PathVariable UUID id,
            @RequestBody UpdateStartupRequest request,
            @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(startupService.updateStartup(id, request, userId));
    }

    // DELETE STARTUP
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStartup(
            @PathVariable UUID id,
            @RequestHeader("X-User-Id") UUID userId) {
        startupService.deleteStartup(id, userId);
        return ResponseEntity.noContent().build();
    }
}