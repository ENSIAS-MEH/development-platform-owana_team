package com.foundersync.auth_service.service;

import com.foundersync.auth_service.dto.*;
import java.util.Map;
import java.util.UUID;

public interface AuthService {

    AuthResponse register(RegisterRequest request);
    AuthResponse login(LoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void logout(RefreshTokenRequest request);
    Map<String, String> forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void changePassword(String authHeader, ChangePasswordRequest request);
    void banUser(UUID userId);
    void unbanUser(UUID userId);
}