package com.foundersync.startup_service.service;

import com.foundersync.startup_service.dto.request.BanStartupRequest;
import com.foundersync.startup_service.dto.response.PageResponse;
import com.foundersync.startup_service.dto.response.StartupResponse;
import com.foundersync.startup_service.event.StartupEventPublisher;
import com.foundersync.startup_service.exception.BadRequestException;
import com.foundersync.startup_service.exception.ResourceNotFoundException;
import com.foundersync.startup_service.model.Startup;
import com.foundersync.startup_service.model.StartupMember;
import com.foundersync.startup_service.repository.StartupMemberRepository;
import com.foundersync.startup_service.repository.StartupReportRepository;
import com.foundersync.startup_service.repository.StartupRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminStartupService {

    private final StartupRepository startupRepository;
    private final StartupReportRepository startupReportRepository;
    private final StartupMemberRepository startupMemberRepository;
    private final StartupEventPublisher eventPublisher;

    // ══════════════════════════════
    // GET ALL STARTUPS
    // ══════════════════════════════
    public PageResponse<StartupResponse> getAllStartups(int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        return mapToPageResponse(startupRepository.findAll(pageable));
    }

    // ══════════════════════════════
    // GET REPORTED STARTUPS
    // ══════════════════════════════
    public PageResponse<StartupResponse> getReportedStartups(int page, int size, int minReports) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("numReports").descending());
        return mapToPageResponse(
                startupRepository.findByNumReportsGreaterThan(minReports - 1, pageable)
        );
    }

    // ══════════════════════════════
    // BAN STARTUP
    // ══════════════════════════════
    public void banStartup(UUID startupId, BanStartupRequest request) {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (startup.isBanned()) {
            throw new BadRequestException("Startup is already banned");
        }

        startup.setBanned(true);
        startup.setActive(false);
        startup.setBanReason(request.getBanReason());
        startup.setBannedUntil(request.getBannedUntil());
        startup.setBannedAt(LocalDateTime.now());
        startupRepository.save(startup);

        List<UUID> memberIds = startupMemberRepository
                .findByStartupId(startupId)
                .stream()
                .map(StartupMember::getUserId)
                .collect(Collectors.toList());

        eventPublisher.publishStartupBanned(
                memberIds,
                startup.getName(),
                startupId,
                request.getBanReason()
        );
    }

    // ══════════════════════════════
    // UNBAN STARTUP
    // ══════════════════════════════
    public void unbanStartup(UUID startupId) {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        if (!startup.isBanned()) {
            throw new BadRequestException("Startup is not banned");
        }

        startup.setBanned(false);
        startup.setActive(true);
        startup.setBanReason(null);
        startup.setBannedUntil(null);
        startup.setBannedAt(null);
        startupRepository.save(startup);

        List<UUID> memberIds = startupMemberRepository
                .findByStartupId(startupId)
                .stream()
                .map(StartupMember::getUserId)
                .collect(Collectors.toList());

        eventPublisher.publishStartupUnbanned(
                memberIds,
                startup.getName(),
                startupId
        );
    }

    // ══════════════════════════════
    // DELETE STARTUP PERMANENTLY
    // ══════════════════════════════
    public void deleteStartup(UUID startupId) {

        Startup startup = startupRepository.findById(startupId)
                .orElseThrow(() -> new ResourceNotFoundException("Startup not found"));

        List<UUID> memberIds = startupMemberRepository
                .findByStartupId(startupId)
                .stream()
                .map(StartupMember::getUserId)
                .collect(Collectors.toList());

        eventPublisher.publishStartupDeleted(
                memberIds,
                startup.getName(),
                startupId
        );

        startupReportRepository.deleteByStartupId(startupId);
        startupRepository.delete(startup);
    }

    // ══════════════════════════════
    // MAPPER
    // ══════════════════════════════
    private PageResponse<StartupResponse> mapToPageResponse(Page<Startup> startupPage) {
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

    private StartupResponse mapToResponse(Startup startup) {
        return StartupResponse.builder()
                .id(startup.getId())
                .name(startup.getName())
                .description(startup.getDescription())
                .logoUrl(startup.getLogoUrl())
                .sector(startup.getSector())
                .location(startup.getLocation())
                .highlights(startup.getHighlights())
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