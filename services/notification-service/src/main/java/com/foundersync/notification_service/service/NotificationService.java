package com.foundersync.notification_service.service;

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

    public void saveFromEvent(NotificationEvent event) {
        NotificationType type = NotificationType.valueOf(event.getType());

        // Destinataire unique
        if (event.getRecipientId() != null) {
            Notification notification = Notification.builder()
                    .recipientId(event.getRecipientId())
                    .senderId(event.getSenderId())
                    .type(type)
                    .message(event.getMessage())
                    .referenceId(event.getStartupId())
                    .build();
            notificationRepository.save(notification);
        }

        // Plusieurs destinataires
        if (event.getRecipientIds() != null && !event.getRecipientIds().isEmpty()) {
            List<Notification> notifications = event.getRecipientIds().stream()
                    .map(recipientId -> Notification.builder()
                            .recipientId(recipientId)
                            .senderId(event.getSenderId())
                            .type(type)
                            .message(event.getMessage())
                            .referenceId(event.getStartupId())
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