package com.foundersync.startup_service.controller;

import com.foundersync.startup_service.dto.request.JoinRequestDTO;
import com.foundersync.startup_service.dto.response.JoinRequestResponse;
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

    // SEND JOIN REQUEST
    @PostMapping("/join")
    public ResponseEntity<JoinRequestResponse> sendJoinRequest(
            @Valid @RequestBody JoinRequestDTO request,
            @RequestHeader("X-User-Id") UUID userId) {
        return ResponseEntity.ok(joinRequestService.sendJoinRequest(request, userId));
    }

    // GET PENDING REQUESTS (founder only)
    @GetMapping("/{startupId}/join-requests")
    public ResponseEntity<List<JoinRequestResponse>> getPendingRequests(
            @PathVariable UUID startupId,
            @RequestHeader("X-User-Id") UUID founderId) {
        return ResponseEntity.ok(joinRequestService.getPendingRequests(startupId, founderId));
    }

    // ACCEPT JOIN REQUEST
    @PutMapping("/join-requests/{requestId}/accept")
    public ResponseEntity<Void> acceptJoinRequest(
            @PathVariable UUID requestId,
            @RequestHeader("X-User-Id") UUID founderId) {
        joinRequestService.acceptJoinRequest(requestId, founderId);
        return ResponseEntity.ok().build();
    }

    // IGNORE (DELETE) JOIN REQUEST
    @DeleteMapping("/join-requests/{requestId}/ignore")
    public ResponseEntity<Void> ignoreJoinRequest(
            @PathVariable UUID requestId,
            @RequestHeader("X-User-Id") UUID founderId) {
        joinRequestService.ignoreJoinRequest(requestId, founderId);
        return ResponseEntity.noContent().build();
    }
}