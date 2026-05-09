package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.request.JoinRequestDTO;
import com.foundersync.startup_service.dto.response.JoinRequestResponse;
import com.foundersync.startup_service.security.AuthenticatedUser;
import com.foundersync.startup_service.service.JoinRequestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/startups")
@RequiredArgsConstructor
public class JoinRequestController {

    private final JoinRequestService joinRequestService;

    @PostMapping("/join")
    public ResponseEntity<JoinRequestResponse> sendJoinRequest(
            @Valid @RequestBody JoinRequestDTO request,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        return ResponseEntity.ok(joinRequestService.sendJoinRequest(request, user.getUserId()));
    }

    @GetMapping("/{startupId}/join-requests")
    public ResponseEntity<List<JoinRequestResponse>> getPendingRequests(
            @PathVariable UUID startupId,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        return ResponseEntity.ok(joinRequestService.getPendingRequests(startupId, user.getUserId()));
    }

    @PutMapping("/join-requests/{requestId}/accept")
    public ResponseEntity<Void> acceptJoinRequest(
            @PathVariable UUID requestId,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        joinRequestService.acceptJoinRequest(requestId, user.getUserId());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/join-requests/{requestId}/ignore")
    public ResponseEntity<Void> ignoreJoinRequest(
            @PathVariable UUID requestId,
            @RequestAttribute("authenticatedUser") AuthenticatedUser user) {
        joinRequestService.ignoreJoinRequest(requestId, user.getUserId());
        return ResponseEntity.noContent().build();
    }
}