package com.foundersync.post_service.service;

import com.foundersync.post_service.entity.SavedPost;
import com.foundersync.post_service.repository.PostRepository;
import com.foundersync.post_service.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final PostRepository postRepository;

    // Sauvegarder un post
    public String savePost(UUID postId, UUID userId) {
        if (savedPostRepository.findByPostIdAndUserId(postId, userId).isPresent()) {
            return "Post already saved";
        }

        SavedPost savedPost = new SavedPost();
        savedPost.setPostId(postId);
        savedPost.setUserId(userId);
        savedPostRepository.save(savedPost);

        // Mettre à jour le compteur de saves
        postRepository.findById(postId).ifPresent(post -> {
            post.setSaveCount(post.getSaveCount() + 1);
            postRepository.save(post);
        });

        return "Post saved successfully";
    }

    // Unsave un post
    public String unsavePost(UUID postId, UUID userId) {
        SavedPost savedPost = savedPostRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new RuntimeException("Saved post not found"));

        savedPostRepository.delete(savedPost);

        // Mettre à jour le compteur de saves
        postRepository.findById(postId).ifPresent(post -> {
            post.setSaveCount(post.getSaveCount() - 1);
            postRepository.save(post);
        });

        return "Post unsaved successfully";
    }

    // Consulter les posts sauvegardés d'un utilisateur
    public List<SavedPost> getSavedPostsByUserId(UUID userId) {
        return savedPostRepository.findByUserId(userId);
    }
}