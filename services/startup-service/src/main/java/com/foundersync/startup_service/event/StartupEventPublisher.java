package com.foundersync.startup_service.event;

import com.foundersync.startup_service.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class StartupEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    // ══════════════════════════════
    // JOIN REQUEST RECEIVED
    // Notification Service → notify founder
    // Chat Service → create conversation + send auto message
    // ══════════════════════════════
    public void publishJoinRequestReceived(UUID founderId, UUID requesterId,
                                           String startupName, UUID startupId) {

        NotificationEvent event = NotificationEvent.builder()
                .type("JOIN_REQUEST_RECEIVED")
                .recipientId(founderId)
                .senderId(requesterId)
                .startupId(startupId)
                .startupName(startupName)
                .message(requesterId + " wants to join your startup " + startupName)
                .founderId(founderId)
                .requesterId(requesterId)
                .autoMessage("Hello! I am interested in your startup "
                        + startupName + " and would love to discuss it with you.")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.JOIN_REQUEST_RECEIVED_KEY,
                event
        );
    }

    // ══════════════════════════════
    // JOIN REQUEST ACCEPTED
    // Notification Service → notify accepted user + all members
    // ══════════════════════════════
    public void publishJoinRequestAccepted(UUID userId, UUID founderId,
                                           String startupName, UUID startupId, List<UUID> memberIds) {

        // Notify the accepted user
        NotificationEvent eventUser = NotificationEvent.builder()
                .type("JOIN_REQUEST_ACCEPTED")
                .recipientId(userId)
                .senderId(founderId)
                .startupId(startupId)
                .startupName(startupName)
                .message("Your request to join " + startupName + " has been accepted")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.JOIN_REQUEST_ACCEPTED_KEY,
                eventUser
        );

        // Notify all members
        NotificationEvent eventMembers = NotificationEvent.builder()
                .type("MEMBER_JOINED")
                .recipientIds(memberIds)
                .senderId(userId)
                .startupId(startupId)
                .startupName(startupName)
                .message("A new member has joined " + startupName)
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.MEMBER_JOINED_KEY,
                eventMembers
        );
    }

    // ══════════════════════════════
    // JOIN REQUEST IGNORED
    // Notification Service → notify ignored user
    // ══════════════════════════════
    public void publishJoinRequestIgnored(UUID userId, UUID founderId,
                                          String startupName, UUID startupId) {

        NotificationEvent event = NotificationEvent.builder()
                .type("JOIN_REQUEST_IGNORED")
                .recipientId(userId)
                .senderId(founderId)
                .startupId(startupId)
                .startupName(startupName)
                .message("Your request to join " + startupName + " has been declined")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.JOIN_REQUEST_IGNORED_KEY,
                event
        );
    }

    // ══════════════════════════════
    // MEMBER REMOVED
    // Notification Service → notify removed member
    // ══════════════════════════════
    public void publishMemberRemoved(UUID removedUserId, UUID founderId,
                                     String startupName, UUID startupId) {

        NotificationEvent event = NotificationEvent.builder()
                .type("MEMBER_REMOVED")
                .recipientId(removedUserId)
                .senderId(founderId)
                .startupId(startupId)
                .startupName(startupName)
                .message("You have been removed from the startup " + startupName)
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.MEMBER_REMOVED_KEY,
                event
        );
    }

    // ══════════════════════════════
    // STARTUP BANNED
    // Notification Service → notify all members
    // ══════════════════════════════
    public void publishStartupBanned(List<UUID> memberIds, String startupName,
                                     UUID startupId, String banReason) {

        NotificationEvent event = NotificationEvent.builder()
                .type("STARTUP_BANNED")
                .recipientIds(memberIds)
                .startupId(startupId)
                .startupName(startupName)
                .message("Your startup " + startupName + " has been banned for: " + banReason)
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.STARTUP_BANNED_KEY,
                event
        );
    }

    // ══════════════════════════════
    // STARTUP UNBANNED
    // Notification Service → notify all members
    // ══════════════════════════════
    public void publishStartupUnbanned(List<UUID> memberIds, String startupName,
                                       UUID startupId) {

        NotificationEvent event = NotificationEvent.builder()
                .type("STARTUP_UNBANNED")
                .recipientIds(memberIds)
                .startupId(startupId)
                .startupName(startupName)
                .message("Your startup " + startupName + " has been reactivated")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.STARTUP_UNBANNED_KEY,
                event
        );
    }

    // ══════════════════════════════
    // STARTUP REPORTED
    // Notification Service → notify founder
    // ══════════════════════════════
    public void publishStartupReported(UUID founderId, UUID reporterId,
                                       String startupName, UUID startupId, String reason) {

        NotificationEvent event = NotificationEvent.builder()
                .type("STARTUP_REPORTED")
                .recipientId(founderId)
                .senderId(reporterId)
                .startupId(startupId)
                .startupName(startupName)
                .message("Your startup " + startupName + " has been reported for: " + reason)
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.STARTUP_REPORTED_KEY,
                event
        );
    }

    // ══════════════════════════════
    // STARTUP DELETED
    // Notification Service → notify all members
    // ══════════════════════════════
    public void publishStartupDeleted(List<UUID> memberIds, String startupName,
                                      UUID startupId) {

        NotificationEvent event = NotificationEvent.builder()
                .type("STARTUP_DELETED")
                .recipientIds(memberIds)
                .startupId(startupId)
                .startupName(startupName)
                .message("The startup " + startupName + " has been permanently deleted")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.STARTUP_DELETED_KEY,
                event
        );
    }


    // ══════════════════════════════
    // STARTUP CREATED
    // Chat Service → crée le groupchat de la startup
    // ══════════════════════════════
    public void publishStartupCreated(UUID startupId, UUID founderId, String startupName) {

        NotificationEvent event = NotificationEvent.builder()
                .type("STARTUP_CREATED")
                .startupId(startupId)
                .senderId(founderId)
                .startupName(startupName)
                .founderId(founderId)
                .message("Startup " + startupName + " has been created")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.STARTUP_EXCHANGE,
                RabbitMQConfig.STARTUP_CREATED_KEY,
                event
        );
    }

}