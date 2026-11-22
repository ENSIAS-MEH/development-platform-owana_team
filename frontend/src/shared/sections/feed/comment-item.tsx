'use client';

import { enUS } from 'date-fns/locale';
import { useState, useEffect } from 'react';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faPen, faTrash, faReply } from '@fortawesome/free-solid-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Skeleton from '@mui/material/Skeleton';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import type { Comment, AuthorProfile } from 'src/contexts/types/feed';

import axiosInstance from 'src/utils/axios';
import { useFeedStore } from 'src/shared/api/stores/feedStore';
import { feedEndpoints } from 'src/shared/api/endpoints/feed';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CommentItemProps = {
  comment: Comment;
  currentUserId: string;
  postId: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommentItem({ comment, currentUserId, postId }: CommentItemProps) {
  const [authorProfile, setAuthorProfile] = useState<AuthorProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [savingEdit, setSavingEdit] = useState(false);

  // Like state
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likesCount ?? 0);
  const [likingInProgress, setLikingInProgress] = useState(false);

  // Reply state
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);
  const [showReplies, setShowReplies] = useState(false);

  // Get all comments for this post from store to calculate descendants
  const allComments = useFeedStore((s) => s.commentsByPost[postId] ?? []);

  // Recursively count all descendants
  const countDescendants = (parentId: string, comments: Comment[]): number => {
    const directChildren = comments.filter((c) => c.parentId === parentId);
    let total = directChildren.length;
    directChildren.forEach((child) => {
      total += countDescendants(child.id, comments);
    });
    return total;
  };

  const totalReplies = countDescendants(comment.id, allComments);
  const directReplies = allComments.filter((c) => c.parentId === comment.id);

  const getUserProfile = useFeedStore((state) => state.getUserProfile);
  const updateComment = useFeedStore((state) => state.updateComment);
  const deleteComment = useFeedStore((state) => state.deleteComment);

  const isOwner = comment.authorId === currentUserId;

  // -------------------------------------------------------------------------
  // Fetch author profile on mount
  // -------------------------------------------------------------------------
  useEffect(() => {
    let cancelled = false;
    setLoadingProfile(true);
    getUserProfile(comment.authorId).then((profile) => {
      if (!cancelled) {
        setAuthorProfile(profile);
        setLoadingProfile(false);
      }
    });
    return () => { cancelled = true; };
  }, [comment.authorId, getUserProfile]);

  // -------------------------------------------------------------------------
  // Derived display values
  // -------------------------------------------------------------------------
  const authorName = authorProfile
    ? `${authorProfile.firstName} ${authorProfile.lastName}`
    : null;

  const avatarSrc = authorProfile?.profilePictureURL ?? undefined;
  const avatarInitials = authorProfile
    ? `${(authorProfile.firstName || 'U').charAt(0)}${(authorProfile.lastName || '').charAt(0)}`
    : '';

  const formattedDate = formatDistanceToNow(
    new Date(comment.createdAt.endsWith('Z') ? comment.createdAt : comment.createdAt + 'Z'),
    { addSuffix: true, locale: enUS }
  );

  const isModified = comment.updatedAt &&
    Math.abs(new Date(comment.updatedAt).getTime() - new Date(comment.createdAt).getTime()) > 2000;

  // -------------------------------------------------------------------------
  // Like handler
  // -------------------------------------------------------------------------
  const handleLike = async () => {
    if (likingInProgress) return;
    setLikingInProgress(true);
    try {
      if (liked) {
        await axiosInstance.delete(
          `${feedEndpoints.posts.list}/comments/${comment.id}/like/${currentUserId}`
        );
        setLiked(false);
        setLikeCount((c: number) => Math.max(0, c - 1));
      } else {
        const response = await axiosInstance.post(
          `${feedEndpoints.posts.list}/comments/${comment.id}/like/${currentUserId}`
        );
        if (response.data === 'Comment already liked') {
          // Already liked, so unlike
          await axiosInstance.delete(
            `${feedEndpoints.posts.list}/comments/${comment.id}/like/${currentUserId}`
          );
          setLiked(false);
          setLikeCount((c: number) => Math.max(0, c - 1));
        } else {
          setLiked(true);
          setLikeCount((c: number) => c + 1);
        }
      }
    } catch {
      // silent fail
    } finally {
      setLikingInProgress(false);
    }
  };

  // -------------------------------------------------------------------------
  // Reply handlers
  // -------------------------------------------------------------------------
  const handleSubmitReply = async () => {
    const trimmed = replyContent.trim();
    if (!trimmed) return;
    setSubmittingReply(true);
    try {
      const response = await axiosInstance.post(
        `${feedEndpoints.posts.list}/${postId}/comments/${comment.id}/reply/${currentUserId}`,
        trimmed,
        { headers: { 'Content-Type': 'text/plain' } }
      );
      const raw = response.data;
      const newReply: Comment = {
        id: raw.id,
        postId: raw.postId || postId,
        authorId: raw.authorId || raw.userId,
        content: typeof raw.content === 'string' ? raw.content : JSON.stringify(raw.content),
        parentId: raw.parentId || comment.id,
        likesCount: raw.likesCount ?? 0,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      };
      // Add reply to the store's commentsByPost
      useFeedStore.setState((state) => ({
        commentsByPost: {
          ...state.commentsByPost,
          [postId]: [...(state.commentsByPost[postId] ?? []), newReply],
        },
      }));
      setReplyContent('');
      setShowReplyForm(false);
      setShowReplies(true);
    } catch {
      // silent fail
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleToggleReplies = () => {
    setShowReplies((v) => !v);
  };

  // -------------------------------------------------------------------------
  // Edit/Delete handlers
  // -------------------------------------------------------------------------
  const handleEditToggle = () => {
    setEditContent(comment.content);
    setIsEditing((prev) => !prev);
  };

  const handleEditSave = async () => {
    const trimmed = editContent.trim();
    if (!trimmed || trimmed === comment.content) {
      setIsEditing(false);
      return;
    }
    setSavingEdit(true);
    try {
      await updateComment(comment.id, trimmed);
      setIsEditing(false);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Delete this comment?')) {
      deleteComment(postId, comment.id);
    }
  };

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------
  return (
    <Stack direction="row" spacing={1.5} sx={{ py: 1 }}>
      {/* Avatar */}
      {loadingProfile ? (
        <Skeleton variant="circular" width={36} height={36} sx={{ flexShrink: 0 }} />
      ) : (
        <Avatar
          src={avatarSrc}
          alt={authorName ?? 'Author'}
          sx={{ width: 36, height: 36, flexShrink: 0, fontSize: 14 }}
        >
          {!avatarSrc && avatarInitials}
        </Avatar>
      )}

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {/* Header row */}
        <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
          {loadingProfile ? (
            <Skeleton variant="text" width={100} />
          ) : (
            <Typography variant="subtitle2" noWrap>
              {authorName}
            </Typography>
          )}

          <Typography variant="caption" color="text.disabled" sx={{ flexShrink: 0 }}>
            {formattedDate}{isModified ? ' (modified)' : ''}
          </Typography>

          {/* Owner actions */}
          {isOwner && !isEditing && (
            <Stack direction="row" spacing={0.5} sx={{ ml: 'auto' }}>
              <Tooltip title="Edit">
                <IconButton size="small" onClick={handleEditToggle} aria-label="Edit comment">
                  <FontAwesomeIcon icon={faPen} size="xs" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton size="small" onClick={handleDelete} aria-label="Delete comment" color="error">
                  <FontAwesomeIcon icon={faTrash} size="xs" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>

        {/* Content or edit field */}
        {isEditing ? (
          <Box sx={{ mt: 0.5 }}>
            <TextField
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              size="small"
              fullWidth
              multiline
              minRows={1}
              maxRows={4}
              disabled={savingEdit}
              autoFocus
            />
            <Stack direction="row" spacing={1} sx={{ mt: 0.75 }}>
              <Button size="small" variant="contained" onClick={handleEditSave} disabled={savingEdit || !editContent.trim()}>
                Save
              </Button>
              <Button size="small" variant="text" onClick={handleEditCancel} disabled={savingEdit}>
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <Typography variant="body2" sx={{ mt: 0.25, wordBreak: 'break-word' }}>
            {comment.content}
          </Typography>
        )}

        {/* Like + Reply actions */}
        {!isEditing && (
          <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mt: 0.5 }}>
            {/* Like button */}
            <Stack direction="row" alignItems="center" spacing={0.3}>
              <IconButton
                size="small"
                onClick={handleLike}
                disabled={likingInProgress}
                color={liked ? 'error' : 'default'}
                aria-label={liked ? 'Unlike comment' : 'Like comment'}
              >
                <FontAwesomeIcon icon={liked ? faHeart : faHeartRegular} size="xs" />
              </IconButton>
              {likeCount > 0 && (
                <Typography variant="caption" color="text.secondary">
                  {likeCount}
                </Typography>
              )}
            </Stack>

            {/* Reply button */}
            <IconButton
              size="small"
              onClick={() => setShowReplyForm((v) => !v)}
              aria-label="Reply to comment"
            >
              <FontAwesomeIcon icon={faReply} size="xs" />
            </IconButton>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
              onClick={handleToggleReplies}
            >
              {totalReplies > 0 ? `${totalReplies} ${totalReplies === 1 ? 'reply' : 'replies'}` : 'Replies'}
            </Typography>
          </Stack>
        )}

        {/* Reply form */}
        {showReplyForm && (
          <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
            <TextField
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              placeholder="Write a reply..."
              size="small"
              fullWidth
              disabled={submittingReply}
            />
            <IconButton
              onClick={handleSubmitReply}
              disabled={submittingReply || !replyContent.trim()}
              color="primary"
              size="small"
            >
              <FontAwesomeIcon icon={faReply} size="sm" />
            </IconButton>
          </Stack>
        )}

        {/* Replies list */}
        {showReplies && directReplies.length > 0 && (
          <Box sx={{ ml: 2, mt: 1, borderLeft: '2px solid', borderColor: 'divider', pl: 1.5 }}>
            {directReplies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                currentUserId={currentUserId}
                postId={postId}
              />
            ))}
          </Box>
        )}
      </Box>
    </Stack>
  );
}
