'use client';

import { useState } from 'react';

import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { faBookmark as faBookmarkSolid } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark as faBookmarkRegular } from '@fortawesome/free-regular-svg-icons';

import { useFeedStore } from 'src/shared/api/stores/feedStore';

// ----------------------------------------------------------------------

type SaveButtonProps = {
  postId: string;
  savedByCurrentUser: boolean;
  currentUserId: string;
};

// ----------------------------------------------------------------------

export function SaveButton({ postId, savedByCurrentUser, currentUserId }: SaveButtonProps) {
  const [loading, setLoading] = useState(false);
  const { toggleSave } = useFeedStore();

  const handleClick = async () => {
    if (loading) return;
    setLoading(true);
    try {
      await toggleSave(postId, currentUserId);
    } finally {
      setLoading(false);
    }
  };

  const ariaLabel = savedByCurrentUser ? 'Retirer des sauvegardes' : 'Sauvegarder';

  return (
    <Tooltip title={ariaLabel}>
      <span>
        <IconButton
          onClick={handleClick}
          disabled={loading}
          aria-label={ariaLabel}
          aria-pressed={savedByCurrentUser}
          size="small"
          sx={{
            color: savedByCurrentUser ? 'warning.main' : 'text.secondary',
            transition: 'color 0.2s',
            '&:hover': {
              color: savedByCurrentUser ? 'warning.dark' : 'warning.main',
            },
          }}
        >
          <FontAwesomeIcon
            icon={savedByCurrentUser ? faBookmarkSolid : faBookmarkRegular}
            fontSize={18}
          />
        </IconButton>
      </span>
    </Tooltip>
  );
}
