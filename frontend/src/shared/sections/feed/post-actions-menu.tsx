'use client';

import { useState } from 'react';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Menu from '@mui/material/Menu';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';

import { ConfirmDialog } from 'src/shared/components/custom-dialog/confirm-dialog';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PostActionsMenuProps = {
  postId: string;
  onEdit: () => void;
  onDelete: () => void;
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function PostActionsMenu({ postId, onEdit, onDelete }: PostActionsMenuProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const menuOpen = Boolean(anchorEl);

  const handleOpenMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleCloseMenu();
    onEdit();
  };

  const handleDeleteClick = () => {
    handleCloseMenu();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete();
  };

  const handleCancelDelete = () => {
    setConfirmOpen(false);
  };

  return (
    <>
      <IconButton
        size="small"
        onClick={handleOpenMenu}
        aria-label="Options du post"
        aria-controls={menuOpen ? `post-actions-menu-${postId}` : undefined}
        aria-haspopup="true"
        aria-expanded={menuOpen ? 'true' : undefined}
      >
        <FontAwesomeIcon icon={faEllipsisV} size="sm" />
      </IconButton>

      <Menu
        id={`post-actions-menu-${postId}`}
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuItem onClick={handleEditClick}>Edit</MenuItem>
        <MenuItem onClick={handleDeleteClick} sx={{ color: 'error.main' }}>
          Delete
        </MenuItem>
      </Menu>

      <ConfirmDialog
        open={confirmOpen}
        onClose={handleCancelDelete}
        title="Delete this post"
        content="Cette action est irréversible."
        action={
          <Button variant="contained" color="error" onClick={handleConfirmDelete}>
            Supprimer
          </Button>
        }
      />
    </>
  );
}
