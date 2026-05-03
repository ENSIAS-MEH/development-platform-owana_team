package com.foundersync.user_service.messaging;

import com.foundersync.user_service.entity.UserProfile;
import com.foundersync.user_service.repository.UserProfileRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class UserEventListener {

    private final UserProfileRepository userProfileRepository;

    @RabbitListener(queues = "user.registered.queue")
    public void handleUserRegistered(Map<String, Object> event) {
        try {
            UUID userId = UUID.fromString((String) event.get("userId"));
            String email = (String) event.get("email");

            if (userProfileRepository.existsByUserId(userId)) {
                log.warn("Profile already exists for userId: {}", userId);
                return;
            }

            UserProfile profile = UserProfile.builder()
                    .userId(userId)
                    .email(email)
                    .build();

            userProfileRepository.save(profile);
            log.info("Profile created for userId: {}", userId);

        } catch (Exception e) {
            log.error("Failed to handle UserRegisteredEvent: {}", e.getMessage());
        }
    }
}
