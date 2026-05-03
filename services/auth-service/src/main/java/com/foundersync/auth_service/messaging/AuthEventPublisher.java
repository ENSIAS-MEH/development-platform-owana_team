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

    public void publishUserRegistered(UUID userId, String email) {
        Map<String, Object> event = Map.of(
                "userId", userId.toString(),
                "email", email
        );
        rabbitTemplate.convertAndSend(EXCHANGE, USER_REGISTERED_KEY, event);
        log.info("Published UserRegisteredEvent for userId: {}", userId);
    }
}