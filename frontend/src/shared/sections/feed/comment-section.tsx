'use client';

import { useRef, useEffect } from 'react';

import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useFeedStore } from 'src/shared/api/stores/feedStore';

import { CommentItem } from './comment-item';
import { CommentForm } from './comment-form';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CommentSectionProps = {
  postId: string;
  currentUserId: string;
  open: boolean;
  onToggle: () => void;
  commentCount?: number;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommentSection({ postId, currentUserId, open, onToggle, commentCount = 0 }: CommentSectionProps) {
  const fetchComments = useFeedStore((s) => s.fetchComments);
  const commentsByPost = useFeedStore((s) => s.commentsByPost);
  const loadingComments = useFeedStore((s) => s.loadingComments);

  const comments = commentsByPost[postId] ?? [];
  const topLevelComments = comments.filter((c: any) => !c.parentId);
  const isLoading = loadingComments[postId] ?? false;

  // Show actual count from loaded comments, or fallback to backend commentCount
  const displayCount = comments.length > 0 ? comments.length : commentCount;

  // Track whether we have already fetched comments for this postId
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (open && !fetchedRef.current) {
      fetchedRef.current = true;
      fetchComments(postId);
    }
  }, [open, postId, fetchComments]);

  return (
    <Box>
      {/* Toggle button */}
      <Box
        component="button"
        onClick={onToggle}
        sx={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          p: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: 'text.secondary',
          '&:hover': { color: 'text.primary' },
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {displayCount} comment{displayCount !== 1 ? 's' : ''}
        </Typography>
      </Box>

      {/* Collapsible content */}
      <Collapse in={open} unmountOnExit>
        <Box sx={{ mt: 1 }}>
          <Divider sx={{ mb: 1.5 }} />

          {/* Loading indicator */}
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {/* Comment list */}
          {!isLoading && topLevelComments.length > 0 && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
              {topLevelComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  currentUserId={currentUserId}
                  postId={postId}
                />
              ))}
            </Box>
          )}

          {/* Empty state */}
          {!isLoading && topLevelComments.length === 0 && (
            <Typography variant="body2" color="text.disabled" sx={{ mb: 2, textAlign: 'center' }}>
              No comments yet.
            </Typography>
          )}

          {/* Comment form */}
          <CommentForm postId={postId} currentUserId={currentUserId} />
        </Box>
      </Collapse>
    </Box>
  );
}
