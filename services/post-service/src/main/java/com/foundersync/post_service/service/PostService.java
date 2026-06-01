package com.foundersync.post_service.service;

import com.foundersync.post_service.dto.PostRequest;
import com.foundersync.post_service.dto.PostResponse;
import com.foundersync.post_service.entity.Post;
import com.foundersync.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostService {

    private final PostRepository postRepository;

    // Créer un post
    public PostResponse createPost(PostRequest request) {
        Post post = new Post();
        post.setContent(request.getContent());
        post.setImageURL(request.getImageURL());
        post.setUserId(request.getUserId());
        return mapToResponse(postRepository.save(post));
    }

    // Modifier un post
    public PostResponse updatePost(UUID id, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        post.setContent(request.getContent());
        post.setImageURL(request.getImageURL());
        return mapToResponse(postRepository.save(post));
    }

    // Supprimer un post
    public void deletePost(UUID id) {
        postRepository.deleteById(id);
    }

    // Consulter tous les posts
    public List<PostResponse> getAllPosts() {
        return postRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Consulter un post
    public PostResponse getPostById(UUID id) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return mapToResponse(post);
    }

    // Consulter les posts d'un utilisateur
    public List<PostResponse> getPostsByUserId(UUID userId) {
        return postRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // Mapper Post -> PostResponse
    private PostResponse mapToResponse(Post post) {
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
        return response;
    }
}