package com.foundersync.auth_service.messaging;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuthEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public static final String EXCHANGE = "founderssync.exchange";
    public static final String USER_REGISTERED_KEY = "user.registered";
    public static final String USER_BANNED_KEY = "user.banned";

    public void publishUserRegistered(UUID userId, String email) {
        Map<String, Object> event = Map.of(
                "userId", userId.toString(),
                "email", email
        );
        rabbitTemplate.convertAndSend(EXCHANGE, USER_REGISTERED_KEY, event);
        log.info("Published UserRegisteredEvent for userId: {}", userId);
    }
    public void publishUserBanned(UUID userId) {
        Map<String, Object> event = Map.of("userId", userId.toString(), "banned", true);
        rabbitTemplate.convertAndSend(EXCHANGE, USER_BANNED_KEY, event);
        log.info("Published UserBannedEvent for userId: {}", userId);
    }

    public void publishUserUnbanned(UUID userId) {
        Map<String, Object> event = Map.of("userId", userId.toString(), "banned", false);
        rabbitTemplate.convertAndSend(EXCHANGE, USER_BANNED_KEY, event);
        log.info("Published UserUnbannedEvent for userId: {}", userId);
    }
}