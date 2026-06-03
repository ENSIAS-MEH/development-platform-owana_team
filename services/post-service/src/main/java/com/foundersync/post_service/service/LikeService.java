package com.foundersync.post_service.service;

import com.foundersync.post_service.entity.Like;
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

    // Liker un post
    public String likePost(UUID postId, UUID userId) {
        // Vérifier si l'utilisateur a déjà liké ce post
        if (likeRepository.findByPostIdAndUserId(postId, userId).isPresent()) {
            return "Post already liked";
        }

        // Créer le like
        Like like = new Like();
        like.setPostId(postId);
        like.setUserId(userId);
        likeRepository.save(like);

        // Mettre à jour le compteur de likes du post
        postRepository.findById(postId).ifPresent(post -> {
            post.setLikesCount(post.getLikesCount() + 1);
            postRepository.save(post);
        });

        return "Post liked successfully";
    }

    // Unliker un post
    public String unlikePost(UUID postId, UUID userId) {
        Like like = likeRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new RuntimeException("Like not found"));

        likeRepository.delete(like);

        // Mettre à jour le compteur de likes du post
        postRepository.findById(postId).ifPresent(post -> {
            post.setLikesCount(post.getLikesCount() - 1);
            postRepository.save(post);
        });

        return "Post unliked successfully";
    }
}