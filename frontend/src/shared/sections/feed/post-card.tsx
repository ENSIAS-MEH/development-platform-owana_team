'use client';

import { enUS } from 'date-fns/locale';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { formatDistanceToNow } from 'date-fns';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';

import { useFeedStore } from 'src/shared/api/stores/feedStore';

import type { Post, AuthorProfile } from 'src/contexts/types/feed';

import { LikeButton } from './like-button';
import { SaveButton } from './save-button';
import { PostForm } from './post-form';
import { PostActionsMenu } from './post-actions-menu';
import { CommentSection } from './comment-section';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PostCardProps = {
  post: Post;
  currentUserId: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PostCard({ post, currentUserId }: PostCardProps) {
  const [author, setAuthor] = useState<AuthorProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [commentsOpen, setCommentsOpen] = useState(false);

  const getUserProfile = useFeedStore((s) => s.getUserProfile);
  const deletePost = useFeedStore((s) => s.deletePost);
  const commentsByPost = useFeedStore((s) => s.commentsByPost);

  // Resolve author profile on mount
  useEffect(() => {
    let cancelled = false;
    getUserProfile(post.authorId).then((profile) => {
      if (!cancelled) setAuthor(profile);
    });
    return () => {
      cancelled = true;
    };
  }, [post.authorId, getUserProfile]);

  const isOwner = post.authorId === currentUserId;

  const formattedDate = formatDistanceToNow(
    new Date(post.createdAt.endsWith('Z') ? post.createdAt : post.createdAt + 'Z'),
    { addSuffix: true, locale: enUS }
  );

  const authorDisplayName = author
    ? `${author.firstName} ${author.lastName}`
    : '…';

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDelete = () => {
    deletePost(post.id);
  };

  const handleToggleComments = () => {
    setCommentsOpen((prev) => !prev);
  };

  // -------------------------------------------------------------------------
  // Edit mode — replace card content with PostForm
  // -------------------------------------------------------------------------

  if (isEditing) {
    return (
      <Card
        component="article"
        aria-label={`Post by ${authorDisplayName}`}
        sx={{ mb: 2 }}
      >
        <CardContent>
          <PostForm
            editPost={post}
            currentUserId={currentUserId}
            onSuccess={() => setIsEditing(false)}
          />
        </CardContent>
      </Card>
    );
  }

  // -------------------------------------------------------------------------
  // Normal display
  // -------------------------------------------------------------------------

  return (
    <div id={`post-${post.id}`}>
      <Card
        component="article"
        aria-label={`Post de ${authorDisplayName}`}
        sx={{ mb: 2 }}
      >
        <CardContent>
          {/* Header: avatar, author name, date, optional actions menu */}
          <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 1.5 }}>
            <Avatar
              src={author?.profilePictureURL}
              alt={authorDisplayName}
              aria-label={`Avatar de ${authorDisplayName}`}
              sx={{ width: 40, height: 40, flexShrink: 0 }}
            >
              {!author?.profilePictureURL && author
                ? `${(author.firstName || 'U').charAt(0)}${(author.lastName || '').charAt(0)}`
                : undefined}
            </Avatar>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 600, lineHeight: 1.3 }}
                aria-label={`Auteur : ${authorDisplayName}`}
              >
                {authorDisplayName}
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
                component="time"
                dateTime={post.createdAt}
                aria-label={`Publié ${formattedDate}`}
              >
                {formattedDate}
              </Typography>
            </Box>

            {/* Owner-only actions menu */}
            {isOwner && (
              <PostActionsMenu
                postId={post.id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}
          </Stack>

          {/* Post content text */}
          <Typography
            variant="body1"
            sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', mb: post.imageURL ? 1.5 : 0 }}
            aria-label="Contenu du post"
          >
            {post.content}
          </Typography>

          {/* Post image — use plain <img> for unknown external URLs (S3) */}
          {post.imageURL && (
            <Box
              component="img"
              src={post.imageURL}
              alt="Image du post"
              loading="lazy"
              style={{ width: '100%', maxHeight: 500, objectFit: 'contain', backgroundColor: '#f5f5f5' }}
              sx={{ display: 'block', borderRadius: 1, mt: 0.5 }}
            />
          )}

        </CardContent>

        <Divider />

        {/* Actions row */}
        <Box
          sx={{
            px: 2,
            py: 1,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
          role="toolbar"
          aria-label="Actions du post"
        >
          <LikeButton
            postId={post.id}
            likeCount={post.likeCount}
            likedByCurrentUser={post.likedByCurrentUser}
            currentUserId={currentUserId}
          />

          <SaveButton
            postId={post.id}
            savedByCurrentUser={post.savedByCurrentUser}
            currentUserId={currentUserId}
          />

          {/* Comments toggle */}
          <IconButton
            size="small"
            onClick={handleToggleComments}
            aria-label={commentsOpen ? 'Hide comments' : 'Show comments'}
            aria-expanded={commentsOpen}
            aria-controls={`comments-${post.id}`}
            color={commentsOpen ? 'primary' : 'default'}
          >
            <FontAwesomeIcon icon={faComment} size="sm" />
          </IconButton>

          <Typography variant="body2" color="text.secondary">
            {(commentsByPost[post.id] ?? []).length || post.commentCount || 0}
          </Typography>
        </Box>

        {/* Comment section */}
        <Box id={`comments-${post.id}`} sx={{ px: 2, pb: commentsOpen ? 2 : 0 }}>
          <CommentSection
            postId={post.id}
            currentUserId={currentUserId}
            open={commentsOpen}
            onToggle={handleToggleComments}
            commentCount={post.commentCount}
          />
        </Box>
      </Card>
    </div>
  );
}
