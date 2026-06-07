package com.foundersync.notification_service.service;

import com.foundersync.notification_service.client.UserServiceClient;
import com.foundersync.notification_service.dto.NotificationEvent;
import com.foundersync.notification_service.entity.Notification;
import com.foundersync.notification_service.enums.NotificationType;
import com.foundersync.notification_service.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserServiceClient userServiceClient;

    private String resolveUserName(UUID userId) {
        try {
            var user = userServiceClient.getUserById(userId);
            String name = (user.getFirstName() != null ? user.getFirstName() : "") +
                    " " +
                    (user.getLastName() != null ? user.getLastName() : "");
            return name.trim().isEmpty() ? "Someone" : name.trim();
        } catch (Exception e) {
            return "Someone";
        }
    }

    public void saveFromEvent(NotificationEvent event) {
        NotificationType type = NotificationType.valueOf(event.getType());

        // Resolve referenceId: postId takes priority over startupId
        UUID referenceId = event.getPostId() != null ? event.getPostId() : event.getStartupId();

        // Resolve sender name if message contains a UUID
        String message = event.getMessage();
        if (event.getSenderId() != null && message != null
                && message.contains(event.getSenderId().toString())) {
            String senderName = resolveUserName(event.getSenderId());
            message = message.replace(event.getSenderId().toString(), senderName);
        }

        // Destinataire unique
        if (event.getRecipientId() != null) {
            Notification notification = Notification.builder()
                    .recipientId(event.getRecipientId())
                    .senderId(event.getSenderId())
                    .type(type)
                    .message(message)
                    .referenceId(referenceId)
                    .build();
            notificationRepository.save(notification);
        }

        // Plusieurs destinataires — exclude sender from recipients
        if (event.getRecipientIds() != null && !event.getRecipientIds().isEmpty()) {
            String finalMessage = message;
            List<Notification> notifications = event.getRecipientIds().stream()
                    .filter(recipientId -> !recipientId.equals(event.getSenderId()))
                    .map(recipientId -> Notification.builder()
                            .recipientId(recipientId)
                            .senderId(event.getSenderId())
                            .type(type)
                            .message(finalMessage)
                            .referenceId(referenceId)
                            .build())
                    .toList();
            notificationRepository.saveAll(notifications);
        }
    }

    public List<Notification> getAll(UUID userId) {
        return notificationRepository.findByRecipientIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnread(UUID userId) {
        return notificationRepository.findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    public long countUnread(UUID userId) {
        return notificationRepository.countByRecipientIdAndIsReadFalse(userId);
    }

    public void markAsRead(UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(UUID userId) {
        List<Notification> unread = notificationRepository
                .findByRecipientIdAndIsReadFalseOrderByCreatedAtDesc(userId);
        unread.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(unread);
    }

    public void delete(UUID notificationId) {
        notificationRepository.deleteById(notificationId);
    }
}
