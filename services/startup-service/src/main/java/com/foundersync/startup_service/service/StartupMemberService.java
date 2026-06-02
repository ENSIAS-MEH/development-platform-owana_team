package com.foundersync.startup_service.service;

import com.foundersync.startup_service.dto.response.StartupMemberResponse;
import com.foundersync.startup_service.event.StartupEventPublisher;
import com.foundersync.startup_service.exception.BadRequestException;
import com.foundersync.startup_service.exception.ResourceNotFoundException;
import com.foundersync.startup_service.exception.UnauthorizedException;
import com.foundersync.startup_service.model.StartupMember;
import com.foundersync.startup_service.repository.StartupMemberRepository;
import com.foundersync.startup_service.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StartupMemberService {

    private final StartupMemberRepository startupMemberRepository;
    private final StartupRepository startupRepository;
    private final StartupEventPublisher eventPublisher;

    // ══════════════════════════════
    // GET ALL MEMBERS
    // ══════════════════════════════
    public List<StartupMemberResponse> getMembers(UUID startupId) {
        startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        return startupMemberRepository.findByStartupId(startupId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ══════════════════════════════
    // CHECK IF USER IS MEMBER
    // ══════════════════════════════
    public boolean isMember(UUID startupId, UUID userId) {
        return startupMemberRepository.existsByStartupIdAndUserId(startupId, userId);
    }

    // ══════════════════════════════
    // REMOVE MEMBER
    // ══════════════════════════════
    @Transactional
    public void removeMember(UUID startupId, UUID userId, UUID founderId) {

        var startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderId().equals(founderId)) {
            throw new UnauthorizedException("Only the founder can remove members");
        }

        if (userId.equals(founderId)) {
            throw new BadRequestException("Founder cannot remove himself");
        }

        if (!startupMemberRepository.existsByStartupIdAndUserId(startupId, userId)) {
            throw new ResourceNotFoundException("Member not found in this startup");
        }

        startupMemberRepository.deleteByStartupIdAndUserId(startupId, userId);

        eventPublisher.publishMemberRemoved(
                userId,
                founderId,
                startup.getName(),
                startup.getId()
        );
    }

    // ══════════════════════════════
    // MAPPER
    // ══════════════════════════════
    private StartupMemberResponse mapToResponse(StartupMember member) {
        return StartupMemberResponse.builder()
                .id(member.getId())
                .startupId(member.getStartupId())
                .userId(member.getUserId())
                .startupRole(member.getStartupRole())
                .joinedAt(member.getJoinedAt())
                .build();
    }
}