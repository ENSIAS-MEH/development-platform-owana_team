package com.foundersync.post_service.service;

import com.foundersync.post_service.entity.Like;
import com.foundersync.post_service.event.PostEventPublisher;
import com.foundersync.post_service.repository.LikeRepository;
import com.foundersync.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class LikeService {

    private final LikeRepository likeRepository;
    private final PostRepository postRepository;
    private final PostEventPublisher postEventPublisher;

    public String likePost(UUID postId, UUID userId) {
        if (likeRepository.findByPostIdAndUserId(postId, userId).isPresent()) {
            return "Post already liked";
        }

        Like like = new Like();
        like.setPostId(postId);
        like.setUserId(userId);
        likeRepository.save(like);

        postRepository.findById(postId).ifPresent(post -> {
            post.setLikesCount(post.getLikesCount() + 1);
            postRepository.save(post);

            // Publier l'événement seulement si ce n'est pas le propriétaire qui like son propre post
            if (!post.getUserId().equals(userId)) {
                postEventPublisher.publishPostLiked(post.getUserId(), userId, postId);
            }
        });

        return "Post liked successfully";
    }

    public String unlikePost(UUID postId, UUID userId) {
        Like like = likeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        likeRepository.delete(like);

        postRepository.findById(postId).ifPresent(post -> {
            post.setLikesCount(post.getLikesCount() - 1);
            postRepository.save(post);
        });

        return "Post unliked successfully";
    }
}