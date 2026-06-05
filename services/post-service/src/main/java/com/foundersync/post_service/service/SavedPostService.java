package com.foundersync.post_service.service;

import com.foundersync.post_service.dto.PostResponse;
import com.foundersync.post_service.entity.SavedPost;
import com.foundersync.post_service.repository.PostRepository;
import com.foundersync.post_service.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SavedPostService {

    private final SavedPostRepository savedPostRepository;
    private final PostRepository postRepository;
    private final PostService postService;

    public String savePost(UUID postId, UUID userId) {
        if (savedPostRepository.findByPostIdAndUserId(postId, userId).isPresent()) {
            return "Post already saved";
        }

        SavedPost savedPost = new SavedPost();
        savedPost.setPostId(postId);
        savedPost.setUserId(userId);
        savedPostRepository.save(savedPost);

        postRepository.findById(postId).ifPresent(post -> {
            post.setSaveCount(post.getSaveCount() + 1);
            postRepository.save(post);
        });

        return "Post saved successfully";
    }

    public String unsavePost(UUID postId, UUID userId) {
        SavedPost savedPost = savedPostRepository.findByPostIdAndUserId(postId, userId)
                .orElseThrow(() -> new RuntimeException("Saved post not found"));

        savedPostRepository.delete(savedPost);

        postRepository.findById(postId).ifPresent(post -> {
            post.setSaveCount(post.getSaveCount() - 1);
            postRepository.save(post);
        });

        return "Post unsaved successfully";
    }

    public List<SavedPost> getSavedPostsByUserId(UUID userId) {
        return savedPostRepository.findByUserId(userId);
    }

    public List<PostResponse> getFullSavedPosts(UUID userId) {
        List<SavedPost> savedPosts = savedPostRepository.findByUserId(userId);
        return savedPosts.stream()
                .map(sp -> postRepository.findById(sp.getPostId()).orElse(null))
                .filter(Objects::nonNull)
                .map(post -> postService.mapToResponsePublic(post, userId))
                .collect(Collectors.toList());
    }
}
