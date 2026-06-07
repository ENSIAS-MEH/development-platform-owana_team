'use client';

import { useState } from 'react';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

import { useFeedStore } from 'src/shared/api/stores/feedStore';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type LikeButtonProps = {
  postId: string;
  likeCount: number;
  likedByCurrentUser: boolean;
  currentUserId: string;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function LikeButton({
                             postId,
                             likeCount,
                             likedByCurrentUser,
                             currentUserId,
                           }: LikeButtonProps) {
  const [loading, setLoading] = useState(false);
  const toggleLike = useFeedStore((state) => state.toggleLike);

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await toggleLike(postId, currentUserId);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <IconButton
        size="small"
        onClick={handleClick}
        disabled={loading}
        aria-label={likedByCurrentUser ? 'Unlike' : 'Like'}
        aria-pressed={likedByCurrentUser}
        color={likedByCurrentUser ? 'error' : 'default'}
      >
        <FontAwesomeIcon
          icon={likedByCurrentUser ? faHeart : faHeartRegular}
          size="sm"
        />
      </IconButton>

      <Typography variant="body2" color="text.secondary">
        {likeCount || 0}
      </Typography>
    </Stack>
  );
}
