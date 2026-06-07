package com.foundersync.post_service.service;

import com.foundersync.post_service.entity.Comment;
import com.foundersync.post_service.entity.CommentLike;
import com.foundersync.post_service.event.PostEventPublisher;
import com.foundersync.post_service.repository.CommentLikeRepository;
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
    private final CommentLikeRepository commentLikeRepository;
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
                postEventPublisher.publishPostCommented(post.getUserId(), userId, postId, content);
            }
        });

        return saved;
    }

    public Comment addReply(UUID postId, UUID parentId, UUID userId, String content) {
        Comment reply = new Comment();
        reply.setPostId(postId);
        reply.setParentId(parentId);
        reply.setUserId(userId);
        reply.setContent(content);
        Comment saved = commentRepository.save(reply);

        // Notify post owner
        postRepository.findById(postId).ifPresent(post -> {
            post.setCommentsCount(post.getCommentsCount() + 1);
            postRepository.save(post);
            if (!post.getUserId().equals(userId)) {
                postEventPublisher.publishPostCommented(post.getUserId(), userId, postId, content);
            }
        });

        // Notify parent comment owner
        commentRepository.findById(parentId).ifPresent(parentComment -> {
            UUID parentAuthorId = parentComment.getUserId();
            // Don't notify if replying to own comment
            if (!parentAuthorId.equals(userId)) {
                // Don't send duplicate if parent author is also the post owner
                boolean isAlsoPostOwner = postRepository.findById(postId)
                        .map(post -> post.getUserId().equals(parentAuthorId))
                        .orElse(false);
                if (!isAlsoPostOwner) {
                    postEventPublisher.publishCommentReplied(parentAuthorId, userId, postId, content);
                }
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
        commentRepository.deleteById(commentId);
    }

    public List<Comment> getCommentsByPostId(UUID postId) {
        return commentRepository.findByPostId(postId);
    }

    public List<Comment> getReplies(UUID parentId) {
        return commentRepository.findByParentId(parentId);
    }

    public String likeComment(UUID commentId, UUID userId) {
        if (commentLikeRepository.findByCommentIdAndUserId(commentId, userId).isPresent()) {
            return "Comment already liked";
        }
        CommentLike like = new CommentLike();
        like.setCommentId(commentId);
        like.setUserId(userId);
        commentLikeRepository.save(like);

        commentRepository.findById(commentId).ifPresent(comment -> {
            comment.setLikesCount(comment.getLikesCount() + 1);
            commentRepository.save(comment);
        });

        return "Comment liked";
    }

    public String unlikeComment(UUID commentId, UUID userId) {
        CommentLike like = commentLikeRepository.findByCommentIdAndUserId(commentId, userId)
                .orElseThrow(() -> new RuntimeException("Like not found"));
        commentLikeRepository.delete(like);

        commentRepository.findById(commentId).ifPresent(comment -> {
            comment.setLikesCount(comment.getLikesCount() - 1);
            commentRepository.save(comment);
        });

        return "Comment unliked";
    }
}
