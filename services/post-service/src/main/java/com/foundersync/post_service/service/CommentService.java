package com.foundersync.post_service.service;

import com.foundersync.post_service.entity.Comment;
import com.foundersync.post_service.repository.CommentRepository;
import com.foundersync.post_service.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;

    // Ajouter un commentaire
    public Comment addComment(UUID postId, UUID userId, String content) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setContent(content);
        Comment saved = commentRepository.save(comment);

        // Mettre à jour le compteur de commentaires
        postRepository.findById(postId).ifPresent(post -> {
            post.setCommentsCount(post.getCommentsCount() + 1);
            postRepository.save(post);
        });

        return saved;
    }

    // Modifier un commentaire
    public Comment updateComment(UUID commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    // Supprimer un commentaire
    public void deleteComment(UUID commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        commentRepository.delete(comment);

        // Mettre à jour le compteur de commentaires
        postRepository.findById(comment.getPostId()).ifPresent(post -> {
            post.setCommentsCount(post.getCommentsCount() - 1);
            postRepository.save(post);
        });
    }

    // Consulter les commentaires d'un post
    public List<Comment> getCommentsByPostId(UUID postId) {
        return commentRepository.findByPostId(postId);
    }
}