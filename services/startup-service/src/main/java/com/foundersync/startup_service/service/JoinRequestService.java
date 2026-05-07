package com.foundersync.startup_service.service;

import com.foundersync.startup_service.dto.request.JoinRequestDTO;
import com.foundersync.startup_service.dto.response.JoinRequestResponse;
import com.foundersync.startup_service.model.*;
import com.foundersync.startup_service.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class JoinRequestService {

    private final JoinRequestRepository joinRequestRepository;
    private final StartupRepository startupRepository;
    private final StartupMemberRepository startupMemberRepository;

    // ══════════════════════════════
    // SEND JOIN REQUEST
    // ══════════════════════════════
    public JoinRequestResponse sendJoinRequest(JoinRequestDTO request, UUID userId) {

        Startup startup = startupRepository.findById(request.getStartupId())
                .orElseThrow(() -> new RuntimeException("Startup not found"));

        // Check if user is already a member
        if (startupMemberRepository.existsByStartupIdAndUserId(request.getStartupId(), userId)) {
            throw new RuntimeException("You are already a member of this startup");
        }

        // Check if user already has a pending request
        if (joinRequestRepository.existsByStartupIdAndUserIdAndStatus(
                request.getStartupId(), userId, JoinRequestStatus.PENDING)) {
            throw new RuntimeException("You already have a pending request for this startup");
        }

        JoinRequest joinRequest = JoinRequest.builder()
                .startupId(request.getStartupId())
                .userId(userId)
                .status(JoinRequestStatus.PENDING)
                .build();

        JoinRequest saved = joinRequestRepository.save(joinRequest);

        // TODO: call Chat Service → send automatic message to founder
        // TODO: call Notification Service → notify founder

        return mapToResponse(saved);
    }

    // ══════════════════════════════
    // GET PENDING REQUESTS FOR A STARTUP (founder only)
    // ══════════════════════════════
    public List<JoinRequestResponse> getPendingRequests(UUID startupId, UUID founderId) {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new RuntimeException("Startup not found"));

        if (!startup.getFounderId().equals(founderId)) {
            throw new RuntimeException("Only the founder can see join requests");
        }

        return joinRequestRepository.findByStartupIdAndStatus(startupId, JoinRequestStatus.PENDING)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ══════════════════════════════
    // ACCEPT JOIN REQUEST
    // ══════════════════════════════
    public void acceptJoinRequest(UUID requestId, UUID founderId) {

        JoinRequest joinRequest = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        Startup startup = startupRepository.findById(joinRequest.getStartupId())
                .orElseThrow(() -> new RuntimeException("Startup not found"));

        if (!startup.getFounderId().equals(founderId)) {
            throw new RuntimeException("Only the founder can accept join requests");
        }

        // Create new member as CO_FOUNDER
        StartupMember newMember = StartupMember.builder()
                .startupId(joinRequest.getStartupId())
                .userId(joinRequest.getUserId())
                .startupRole(StartupRole.CO_FOUNDER)
                .build();

        startupMemberRepository.save(newMember);

        // Update request status
        joinRequest.setStatus(JoinRequestStatus.ACCEPTED);
        joinRequestRepository.save(joinRequest);

        // TODO: call Notification Service → notify user that he was accepted
    }

    // ══════════════════════════════
    // IGNORE (DELETE) JOIN REQUEST
    // ══════════════════════════════
    public void ignoreJoinRequest(UUID requestId, UUID founderId) {

        JoinRequest joinRequest = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Join request not found"));

        Startup startup = startupRepository.findById(joinRequest.getStartupId())
                .orElseThrow(() -> new RuntimeException("Startup not found"));

        if (!startup.getFounderId().equals(founderId)) {
            throw new RuntimeException("Only the founder can ignore join requests");
        }

        // Ignored = deleted permanently
        joinRequestRepository.delete(joinRequest);
    }

    // ══════════════════════════════
    // MAPPER
    // ══════════════════════════════
    private JoinRequestResponse mapToResponse(JoinRequest joinRequest) {
        return JoinRequestResponse.builder()
                .id(joinRequest.getId())
                .startupId(joinRequest.getStartupId())
                .userId(joinRequest.getUserId())
                .status(joinRequest.getStatus())
                .createdAt(joinRequest.getCreatedAt())
                .build();
    }
}