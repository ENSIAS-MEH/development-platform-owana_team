package com.foundersync.auth_service.service.impl;

import com.foundersync.auth_service.dto.*;
import com.foundersync.auth_service.entity.RefreshToken;
import com.foundersync.auth_service.entity.User;
import com.foundersync.auth_service.enums.AppRole;
import com.foundersync.auth_service.exception.EmailAlreadyExistsException;
import com.foundersync.auth_service.exception.InvalidTokenException;
import com.foundersync.auth_service.repository.RefreshTokenRepository;
import com.foundersync.auth_service.repository.UserRepository;
import com.foundersync.auth_service.security.JwtService;
import com.foundersync.auth_service.service.AuthService;
import com.foundersync.auth_service.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;
    private final EmailService emailService;

    @Value("${app.jwt.refresh-expiration:604800000}")
    private long refreshExpiration;

    // ─── Register ────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException(request.getEmail());
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(AppRole.USER)
                .build();
        userRepository.save(user);

        return buildAuthResponse(user);
    }

    // ─── Login ───────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail()).orElseThrow();

        // Supprimer les anciens refresh tokens
        refreshTokenRepository.deleteAllByUser(user);

        return buildAuthResponse(user);
    }

    // ─── Refresh Token ───────────────────────────────────────────────────────

    @Override
    @Transactional
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken refreshToken = refreshTokenRepository
                .findByToken(request.getRefreshToken())
                .orElseThrow(() -> new InvalidTokenException("Refresh token not found"));

        if (refreshToken.isRevoked()) {
            throw new InvalidTokenException("Refresh token has been revoked");
        }
        if (refreshToken.isExpired()) {
            refreshTokenRepository.delete(refreshToken);
            throw new InvalidTokenException("Refresh token expired, please login again");
        }

        User user = refreshToken.getUser();
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        String newAccessToken = jwtService.generateToken(userDetails, Map.of(
                "userId", user.getId().toString(),
                "role", user.getRole().name()
        ));

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(refreshToken.getToken())
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }

    // ─── Logout ──────────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenRepository.findByToken(request.getRefreshToken())
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });
    }

    // ─── Forgot Password ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public Map<String, String> forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            user.setResetPasswordToken(resetToken);
            user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(15));
            userRepository.save(user);
            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        });

        return Map.of("message", "If this email exists, a reset link has been sent");
    }

    // ─── Reset Password ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new InvalidTokenException("Invalid or expired reset token"));

        if (user.getResetPasswordTokenExpiresAt() == null ||
                LocalDateTime.now().isAfter(user.getResetPasswordTokenExpiresAt())) {
            throw new InvalidTokenException("Reset token has expired");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);
        userRepository.save(user);
    }

    // ─── Helper privé ────────────────────────────────────────────────────────

    private AuthResponse buildAuthResponse(User user) {
        UserDetails userDetails = userDetailsService.loadUserByUsername(user.getEmail());

        String accessToken = jwtService.generateToken(userDetails, Map.of(
                "userId", user.getId().toString(),
                "role", user.getRole().name()
        ));

        String refreshTokenValue = UUID.randomUUID().toString();
        RefreshToken refreshToken = RefreshToken.builder()
                .token(refreshTokenValue)
                .user(user)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpiration / 1000))
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshTokenValue)
                .tokenType("Bearer")
                .userId(user.getId())
                .email(user.getEmail())
                .role(user.getRole().name())
                .build();
    }
}
