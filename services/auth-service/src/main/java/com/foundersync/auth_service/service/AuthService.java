package com.foundersync.auth_service.service;

import com.foundersync.auth_service.dto.*;
import java.util.Map;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);

    AuthResponse refreshToken(RefreshTokenRequest request);

    void logout(RefreshTokenRequest request);

    Map<String, String> forgotPassword(ForgotPasswordRequest request);

    void resetPassword(ResetPasswordRequest request);
}