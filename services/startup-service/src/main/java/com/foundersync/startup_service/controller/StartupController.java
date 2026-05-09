package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.request.StartupRequest;
import com.foundersync.startup_service.dto.request.UpdateStartupRequest;
import com.foundersync.startup_service.dto.response.PageResponse;
import com.foundersync.startup_service.dto.response.StartupResponse;
import com.foundersync.startup_service.security.AuthenticatedUser;
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

    @PostMapping
    public ResponseEntity<StartupResponse> createStartup(
            @Valid @RequestBody StartupRequest request,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        return ResponseEntity.ok(startupService.createStartup(request, user.getUserId()));
    }

    @GetMapping
    public ResponseEntity<PageResponse<StartupResponse>> getAllStartups(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(startupService.getAllStartups(page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StartupResponse> getStartupById(@PathVariable UUID id) {
        return ResponseEntity.ok(startupService.getStartupById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<StartupResponse>> searchStartups(
            @RequestParam String name) {
        return ResponseEntity.ok(startupService.searchStartups(name));
    }

    @GetMapping("/my")
    public ResponseEntity<List<StartupResponse>> getMyStartups(
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        return ResponseEntity.ok(startupService.getMyStartups(user.getUserId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StartupResponse> updateStartup(
            @PathVariable UUID id,
            @RequestBody UpdateStartupRequest request,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        return ResponseEntity.ok(startupService.updateStartup(id, request, user.getUserId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStartup(
            @PathVariable UUID id,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        startupService.deleteStartup(id, user.getUserId());
        return ResponseEntity.noContent().build();
    }
}