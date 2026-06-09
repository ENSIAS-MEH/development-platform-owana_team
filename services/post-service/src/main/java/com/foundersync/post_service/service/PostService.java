package com.foundersync.post_service.service;

import com.foundersync.post_service.client.UserServiceClient;
import com.foundersync.post_service.dto.PostRequest;
import com.foundersync.post_service.dto.PostResponse;
import com.foundersync.post_service.dto.UserResponse;
import com.foundersync.post_service.entity.Post;
import com.foundersync.post_service.repository.LikeRepository;
import com.foundersync.post_service.repository.PostRepository;
import com.foundersync.post_service.repository.SavedPostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final LikeRepository likeRepository;
    private final SavedPostRepository savedPostRepository;
    private final UserServiceClient userServiceClient;

    public PostResponse createPost(PostRequest request) {
        Post post = new Post();
        post.setContent(request.getContent());
        post.setImageURL(request.getImageURL());
        post.setUserId(request.getUserId());
        return mapToResponse(postRepository.save(post), request.getUserId());
    }

    public PostResponse updatePost(UUID id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setContent(request.getContent());
        post.setImageURL(request.getImageURL());
        return mapToResponse(postRepository.save(post), request.getUserId());
    }

    public void deletePost(UUID id) {
        postRepository.deleteById(id);
    }

    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(post -> mapToResponse(post, null))
                .collect(Collectors.toList());
    }

    public List<PostResponse> getAllPosts(UUID currentUserId) {
        return postRepository.findAll()
                .stream()
                .map(post -> mapToResponse(post, currentUserId))
                .collect(Collectors.toList());
    }

    public PostResponse getPostById(UUID id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToResponse(post, null);
    }

    public List<PostResponse> getPostsByUserId(UUID userId) {
        return postRepository.findByUserId(userId)
                .stream()
                .map(post -> mapToResponse(post, userId))
                .collect(Collectors.toList());
    }
    public PostResponse mapToResponsePublic(Post post, UUID currentUserId) {
        return mapToResponse(post, currentUserId);
    }


    private PostResponse mapToResponse(Post post, UUID currentUserId) {
        PostResponse response = new PostResponse();
        response.setId(post.getId());
        response.setContent(post.getContent());
        response.setImageURL(post.getImageURL());
        response.setLikesCount(post.getLikesCount());
        response.setCommentsCount(post.getCommentsCount());
        response.setSaveCount(post.getSaveCount());
        response.setUserId(post.getUserId());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());

        // Fetch user info from user-service
        try {
            UserResponse user = userServiceClient.getUserById(post.getUserId());
            response.setFirstName(user.getFirstName());
            response.setLastName(user.getLastName());
            response.setProfilePictureURL(user.getProfilePictureURL());
        } catch (Exception e) {
            log.warn("Could not fetch user info for userId: {}", post.getUserId());
            response.setFirstName("Unknown");
            response.setLastName("User");
            response.setProfilePictureURL(null);
        }

        if (currentUserId != null) {
            response.setLikedByCurrentUser(
                    likeRepository.findByPostIdAndUserId(post.getId(), currentUserId).isPresent()
            );
            response.setSavedByCurrentUser(
                    savedPostRepository.findByPostIdAndUserId(post.getId(), currentUserId).isPresent()
            );
        }

        return response;
    }
}