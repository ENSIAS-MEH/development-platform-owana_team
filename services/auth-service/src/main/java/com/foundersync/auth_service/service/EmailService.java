package com.foundersync.auth_service.service;

public interface EmailService {

    void sendPasswordResetEmail(String toEmail, String resetToken);
}