'use client';

import { useState } from 'react';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';

import { useFeedStore } from 'src/shared/api/stores/feedStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CommentFormProps = {
  postId: string;
  currentUserId: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function CommentForm({ postId, currentUserId }: CommentFormProps) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const addComment = useFeedStore((state) => state.addComment);

  const handleSubmit = async () => {
    if (loading || content.trim() === '') return;

    setLoading(true);
    try {
      await addComment(postId, currentUserId, content.trim());
      setContent('');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <TextField
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a comment..."
        size="small"
        disabled={loading}
        sx={{ flex: 1 }}
        inputProps={{ 'aria-label': 'Comment' }}
      />

      <IconButton
        onClick={handleSubmit}
        disabled={loading || content.trim() === ''}
        aria-label="Submit comment"
        size="small"
        color="primary"
      >
        {loading ? (
          <CircularProgress size={18} color="inherit" />
        ) : (
          <FontAwesomeIcon icon={faPaperPlane} fontSize={18} />
        )}
      </IconButton>
    </Stack>
  );
}
