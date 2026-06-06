package com.foundersync.post_service.event;

import com.foundersync.post_service.client.UserServiceClient;
import com.foundersync.post_service.config.RabbitMQConfig;
import com.foundersync.post_service.dto.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class PostEventPublisher {

    private final RabbitTemplate rabbitTemplate;
    private final UserServiceClient userServiceClient;

    private String resolveUserName(UUID userId) {
        try {
            UserResponse user = userServiceClient.getUserById(userId);
            String name = (user.getFirstName() != null ? user.getFirstName() : "") +
                    " " +
                    (user.getLastName() != null ? user.getLastName() : "");
            return name.trim().isEmpty() ? "Someone" : name.trim();
        } catch (Exception e) {
            return "Someone";
        }
    }

    public void publishPostLiked(UUID postOwnerId, UUID likerId, UUID postId) {
        String likerName = resolveUserName(likerId);
        PostNotificationEvent event = PostNotificationEvent.builder()
                .type("LIKE")
                .recipientId(postOwnerId)
                .senderId(likerId)
                .postId(postId)
                .message(likerName + " liked your post")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.POST_EXCHANGE,
                RabbitMQConfig.POST_LIKED_KEY,
                event
        );
    }

    public void publishPostCommented(UUID postOwnerId, UUID commenterId, UUID postId, String commentContent) {
        String commenterName = resolveUserName(commenterId);
        String preview = commentContent.length() > 50
                ? commentContent.substring(0, 50) + "..."
                : commentContent;

        PostNotificationEvent event = PostNotificationEvent.builder()
                .type("COMMENT")
                .recipientId(postOwnerId)
                .senderId(commenterId)
                .postId(postId)
                .message(commenterName + " commented: \"" + preview + "\"")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.POST_EXCHANGE,
                RabbitMQConfig.POST_COMMENTED_KEY,
                event
        );
    }

    public void publishCommentReplied(UUID commentOwnerId, UUID replierId, UUID postId, String replyContent) {
        String replierName = resolveUserName(replierId);
        String preview = replyContent.length() > 50
                ? replyContent.substring(0, 50) + "..."
                : replyContent;

        PostNotificationEvent event = PostNotificationEvent.builder()
                .type("COMMENT")
                .recipientId(commentOwnerId)
                .senderId(replierId)
                .postId(postId)
                .message(replierName + " replied to your comment: \"" + preview + "\"")
                .build();

        rabbitTemplate.convertAndSend(
                RabbitMQConfig.POST_EXCHANGE,
                RabbitMQConfig.POST_COMMENTED_KEY,
                event
        );
    }
}

