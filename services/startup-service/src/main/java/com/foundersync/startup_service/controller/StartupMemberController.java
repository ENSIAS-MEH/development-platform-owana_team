package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.response.StartupMemberResponse;
import com.foundersync.startup_service.security.AuthenticatedUser;
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

    @GetMapping("/{startupId}/members")
    public ResponseEntity<List<StartupMemberResponse>> getMembers(
            @PathVariable UUID startupId) {
        return ResponseEntity.ok(startupMemberService.getMembers(startupId));
    }

    @GetMapping("/{startupId}/members/check")
    public ResponseEntity<Boolean> isMember(
            @PathVariable UUID startupId,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        return ResponseEntity.ok(startupMemberService.isMember(startupId, user.getUserId()));
    }

    @DeleteMapping("/{startupId}/members/{userId}")
    public ResponseEntity<Void> removeMember(
            @PathVariable UUID startupId,
            @PathVariable UUID userId,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        startupMemberService.removeMember(startupId, userId, user.getUserId());
        return ResponseEntity.noContent().build();
    }
}