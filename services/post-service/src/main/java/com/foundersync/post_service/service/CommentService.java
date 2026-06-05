package com.foundersync.post_service.service;

import com.foundersync.post_service.entity.Comment;
import com.foundersync.post_service.event.PostEventPublisher;
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
    private final PostEventPublisher postEventPublisher;

    public Comment addComment(UUID postId, UUID userId, String content) {
        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setUserId(userId);
        comment.setContent(content);
        Comment saved = commentRepository.save(comment);

        postRepository.findById(postId).ifPresent(post -> {
            post.setCommentsCount(post.getCommentsCount() + 1);
            postRepository.save(post);
            if (!post.getUserId().equals(userId)) {
                postEventPublisher.publishPostCommented(post.getUserId(), userId, postId);
            }
        });

        return saved;
    }

    public Comment updateComment(UUID commentId, String content) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));
        comment.setContent(content);
        return commentRepository.save(comment);
    }

    public void deleteComment(UUID commentId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        commentRepository.delete(comment);

        postRepository.findById(comment.getPostId()).ifPresent(post -> {
            post.setCommentsCount(post.getCommentsCount() - 1);
            postRepository.save(post);
        });
    }

    public List<Comment> getCommentsByPostId(UUID postId) {
        return commentRepository.findByPostId(postId);
    }
}