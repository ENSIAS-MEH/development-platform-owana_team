package com.foundersync.startup_service.service;

import com.foundersync.startup_service.dto.response.StartupMemberResponse;
import com.foundersync.startup_service.model.StartupMember;
import com.foundersync.startup_service.repository.StartupMemberRepository;
import com.foundersync.startup_service.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StartupMemberService {

    private final StartupMemberRepository startupMemberRepository;
    private final StartupRepository startupRepository;

    // ══════════════════════════════
    // GET ALL MEMBERS OF A STARTUP
    // ══════════════════════════════
    public List<StartupMemberResponse> getMembers(UUID startupId) {
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
    public void removeMember(UUID startupId, UUID userId, UUID founderId) {

        var startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new RuntimeException("Startup not found"));

        if (!startup.getFounderId().equals(founderId)) {
            throw new RuntimeException("Only the founder can remove members");
        }

        if (userId.equals(founderId)) {
            throw new RuntimeException("Founder cannot remove himself");
        }

        startupMemberRepository.deleteByStartupIdAndUserId(startupId, userId);
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