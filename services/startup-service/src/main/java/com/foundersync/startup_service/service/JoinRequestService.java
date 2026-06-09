package com.foundersync.startup_service.service;

import com.foundersync.startup_service.dto.request.JoinRequestDTO;
import com.foundersync.startup_service.dto.response.JoinRequestResponse;
import com.foundersync.startup_service.event.StartupEventPublisher;
import com.foundersync.startup_service.exception.BadRequestException;
import com.foundersync.startup_service.exception.ResourceNotFoundException;
import com.foundersync.startup_service.exception.UnauthorizedException;
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
    private final StartupEventPublisher eventPublisher;

    // ══════════════════════════════
    // SEND JOIN REQUEST
    // ══════════════════════════════
    public JoinRequestResponse sendJoinRequest(JoinRequestDTO request, UUID userId) {

        Startup startup = startupRepository.findById(request.getStartupId())
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.isActive()) {
            throw new BadRequestException("This startup is no longer active");
        }

        if (startupMemberRepository.existsByStartupIdAndUserId(request.getStartupId(), userId)) {
            throw new BadRequestException("You are already a member of this startup");
        }

        if (joinRequestRepository.existsByStartupIdAndUserIdAndStatus(
                request.getStartupId(), userId, JoinRequestStatus.PENDING)) {
            throw new BadRequestException("You already have a pending request for this startup");
        }

        JoinRequest joinRequest = JoinRequest.builder()
                .startupId(request.getStartupId())
                .userId(userId)
                .status(JoinRequestStatus.PENDING)
                .build();

        JoinRequest saved = joinRequestRepository.save(joinRequest);

        eventPublisher.publishJoinRequestReceived(
                startup.getFounderId(),
                userId,
                startup.getName(),
                startup.getId()
        );

        return mapToResponse(saved);
    }

    // ══════════════════════════════
    // GET PENDING REQUESTS (founder only)
    // ══════════════════════════════
    public List<JoinRequestResponse> getPendingRequests(UUID startupId, UUID founderId) {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderId().equals(founderId)) {
            throw new UnauthorizedException("Only the founder can see join requests");
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
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));

        if (joinRequest.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException("This request has already been processed");
        }

        Startup startup = startupRepository.findById(joinRequest.getStartupId())
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderId().equals(founderId)) {
            throw new UnauthorizedException("Only the founder can accept join requests");
        }

        StartupMember newMember = StartupMember.builder()
                .startupId(joinRequest.getStartupId())
                .userId(joinRequest.getUserId())
                .startupRole(StartupRole.CO_FOUNDER)
                .build();

        startupMemberRepository.save(newMember);

        joinRequest.setStatus(JoinRequestStatus.ACCEPTED);
        joinRequestRepository.save(joinRequest);

        List<UUID> memberIds = startupMemberRepository
                .findByStartupId(joinRequest.getStartupId())
                .stream()
                .map(StartupMember::getUserId)
                .collect(Collectors.toList());

        eventPublisher.publishJoinRequestAccepted(
                joinRequest.getUserId(),
                founderId,
                startup.getName(),
                startup.getId(),
                memberIds
        );
    }

    // ══════════════════════════════
    // IGNORE JOIN REQUEST
    // ══════════════════════════════
    public void ignoreJoinRequest(UUID requestId, UUID founderId) {

        JoinRequest joinRequest = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Join request not found"));

        if (joinRequest.getStatus() != JoinRequestStatus.PENDING) {
            throw new BadRequestException("Cannot ignore a request that has already been accepted");
        }

        Startup startup = startupRepository.findById(joinRequest.getStartupId())
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderId().equals(founderId)) {
            throw new UnauthorizedException("Only the founder can ignore join requests");
        }

        eventPublisher.publishJoinRequestIgnored(
                joinRequest.getUserId(),
                founderId,
                startup.getName(),
                startup.getId()
        );

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