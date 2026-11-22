package com.foundersync.auth_service.config;

import com.foundersync.auth_service.entity.User;
import com.foundersync.auth_service.enums.AppRole;
import com.foundersync.auth_service.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email}")
    private String adminEmail;

    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        createAdminIfNotExists();
    }

    private void createAdminIfNotExists() {

        if (userRepository.existsByEmail(adminEmail)) {
            log.info("Admin account already exists — skipping creation");
            return;
        }

        User admin = User.builder()
                .email(adminEmail)
                .password(passwordEncoder.encode(adminPassword))
                .role(AppRole.ADMIN)
                .isBanned(false)
                .build();

        userRepository.save(admin);
        log.info("Admin account created — email: {}", adminEmail);
    }
}
