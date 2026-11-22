package com.foundersync.startup_service.service;

import com.foundersync.startup_service.dto.request.StartupRequest;
import com.foundersync.startup_service.dto.request.UpdateStartupRequest;
import com.foundersync.startup_service.dto.response.PageResponse;
import com.foundersync.startup_service.dto.response.StartupResponse;
import com.foundersync.startup_service.event.StartupEventPublisher;
import com.foundersync.startup_service.exception.ResourceNotFoundException;
import com.foundersync.startup_service.exception.UnauthorizedException;
import com.foundersync.startup_service.model.Startup;
import com.foundersync.startup_service.model.StartupMember;
import com.foundersync.startup_service.model.StartupRole;
import com.foundersync.startup_service.repository.StartupMemberRepository;
import com.foundersync.startup_service.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StartupService {

    private final StartupRepository startupRepository;
    private final StartupMemberRepository startupMemberRepository;
    private final StartupEventPublisher eventPublisher;

    // ══════════════════════════════
    // CREATE STARTUP
    // ══════════════════════════════
    public StartupResponse createStartup(StartupRequest request, UUID founderId) {

        Startup startup = Startup.builder()
                .name(request.getName())
                .description(request.getDescription())
                .logoUrl(request.getLogoUrl())
                .sector(request.getSector())
                .location(request.getLocation())
                .highlights(request.getHighlights())
                .programmes(request.getProgrammes())
                .founderId(founderId)
                .isActive(true)
                .build();

        Startup saved = startupRepository.save(startup);

        StartupMember founderMember = StartupMember.builder()
                .startupId(saved.getId())
                .userId(founderId)
                .startupRole(StartupRole.FOUNDER)
                .build();

        startupMemberRepository.save(founderMember);

        eventPublisher.publishStartupCreated(
                saved.getId(),
                founderId,
                saved.getName()
        );

        return mapToResponse(saved);
    }

    // ══════════════════════════════
    // GET ALL STARTUPS
    // ══════════════════════════════
    public PageResponse<StartupResponse> getAllStartups(int page, int size) {

        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

        Page<Startup> startupPage = startupRepository.findByIsActiveTrue(pageable);

        List<StartupResponse> content = startupPage.getContent()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());

        return PageResponse.<StartupResponse>builder()
                .content(content)
                .currentPage(startupPage.getNumber())
                .totalPages(startupPage.getTotalPages())
                .totalElements(startupPage.getTotalElements())
                .pageSize(startupPage.getSize())
                .isLast(startupPage.isLast())
                .build();
    }

    // ══════════════════════════════
    // GET STARTUP BY ID
    // ══════════════════════════════
    public StartupResponse getStartupById(UUID id) {
        Startup startup = startupRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));
        return mapToResponse(startup);
    }

    // ══════════════════════════════
    // SEARCH STARTUPS BY NAME
    // ══════════════════════════════
    public List<StartupResponse> searchStartups(String name) {
        return startupRepository.findByNameContainingIgnoreCase(name)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // ══════════════════════════════
    // GET MY STARTUPS
    // ══════════════════════════════
    public List<StartupResponse> getMyStartups(UUID userId) {
        return startupMemberRepository.findByUserId(userId)
                .stream()
                .map(member -> startupRepository.findById(member.getStartupId())
                        .map(this::mapToResponse)
                        .orElse(null))
                .filter(response -> response != null)
                .collect(Collectors.toList());
    }

    // ══════════════════════════════
    // UPDATE STARTUP
    // ══════════════════════════════
    public StartupResponse updateStartup(UUID startupId, UpdateStartupRequest request, UUID userId) {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can update this startup");
        }

        if (request.getName() != null) startup.setName(request.getName());
        if (request.getDescription() != null) startup.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) startup.setLogoUrl(request.getLogoUrl());
        if (request.getSector() != null) startup.setSector(request.getSector());
        if (request.getLocation() != null) startup.setLocation(request.getLocation());
        if (request.getHighlights() != null) startup.setHighlights(request.getHighlights());
        if (request.getProgrammes() != null) startup.setProgrammes(request.getProgrammes());

        return mapToResponse(startupRepository.save(startup));
    }

    // ══════════════════════════════
    // DELETE STARTUP
    // ══════════════════════════════
    public void deleteStartup(UUID startupId, UUID userId) {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.getFounderId().equals(userId)) {
            throw new UnauthorizedException("Only the founder can delete this startup");
        }

        startup.setActive(false);
        startupRepository.save(startup);
    }

    // ══════════════════════════════
    // MAPPER
    // ══════════════════════════════
    private StartupResponse mapToResponse(Startup startup) {
        return StartupResponse.builder()
                .id(startup.getId())
                .name(startup.getName())
                .description(startup.getDescription())
                .logoUrl(startup.getLogoUrl())
                .sector(startup.getSector())
                .location(startup.getLocation())
                .highlights(startup.getHighlights())
                .programmes(startup.getProgrammes())   // <-- add this line
                .founderId(startup.getFounderId())
                .isActive(startup.isActive())
                .isBanned(startup.isBanned())
                .banReason(startup.getBanReason())
                .bannedUntil(startup.getBannedUntil())
                .numReports(startup.getNumReports())
                .createdAt(startup.getCreatedAt())
                .build();
    }

}