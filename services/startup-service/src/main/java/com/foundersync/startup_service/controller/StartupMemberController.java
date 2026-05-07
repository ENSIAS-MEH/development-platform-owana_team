package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.response.StartupMemberResponse;
import com.foundersync.startup_service.service.StartupMemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class StartupMemberController {

    private final StartupMemberService startupMemberService;

    // GET ALL MEMBERS OF A STARTUP
    @GetMapping("/{startupId}/members")
    public ResponseEntity<List<StartupMemberResponse>> getMembers(
            @PathVariable UUID startupId) {
        return ResponseEntity.ok(startupMemberService.getMembers(startupId));
    }

    // CHECK IF USER IS MEMBER
    @GetMapping("/{startupId}/members/check")
    public ResponseEntity<Boolean> isMember(
            @PathVariable UUID startupId,
            @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(startupMemberService.isMember(startupId, userId));
    }

    // REMOVE MEMBER
    @DeleteMapping("/{startupId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID startupId,
            @PathVariable UUID userId,
            @RequestHeader("X-User-Id") UUID founderId) {
        startupMemberService.removeMember(startupId, userId, founderId);
        return ResponseEntity.noContent().build();
    }
}