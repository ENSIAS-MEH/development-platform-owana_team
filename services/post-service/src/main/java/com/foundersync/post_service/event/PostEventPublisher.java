package com.foundersync.post_service.event;

import com.foundersync.post_service.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PostEventPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishPostLiked(UUID postOwnerId, UUID likerId, UUID postId) {
        PostNotificationEvent event = PostNotificationEvent.builder()
                .type("LIKE")
                .recipientId(postOwnerId)
                .senderId(likerId)
                .postId(postId)
                .message(likerId + " liked your post")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.POST_EXCHANGE,
                RabbitMQConfig.POST_LIKED_KEY,
                event
        );
    }

    public void publishPostCommented(UUID postOwnerId, UUID commenterId, UUID postId) {
        PostNotificationEvent event = PostNotificationEvent.builder()
                .type("COMMENT")
                .recipientId(postOwnerId)
                .senderId(commenterId)
                .postId(postId)
                .message(commenterId + " commented on your post")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.POST_EXCHANGE,
                RabbitMQConfig.POST_COMMENTED_KEY,
                event
        );
    }
}