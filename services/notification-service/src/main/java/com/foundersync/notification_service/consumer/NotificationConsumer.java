package com.foundersync.notification_service.consumer;

import com.foundersync.notification_service.dto.NotificationEvent;
import com.foundersync.notification_service.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationConsumer {

    private final NotificationService notificationService;

    @RabbitListener(queues = "foundersync.notification.queue")
    public void consume(NotificationEvent event) {
        log.info("Received notification event: type={}, recipient={}",
                event.getType(), event.getRecipientId());
        try {
            notificationService.saveFromEvent(event);
        } catch (Exception e) {
            log.error("Error processing notification event: {}", e.getMessage());
        }
    }
}