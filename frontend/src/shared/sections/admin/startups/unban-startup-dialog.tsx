'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import CircularProgress from '@mui/material/CircularProgress';
import DialogContentText from '@mui/material/DialogContentText';

import type { AdminStartupResponse } from './types';

// ─── Props ────────────────────────────────────────────────────────────────────

type UnbanStartupDialogProps = {
  open: boolean;
  startup: AdminStartupResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function UnbanStartupDialog({ open, startup, onClose, onConfirm }: UnbanStartupDialogProps) {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
    } catch {
      // Re-enable controls on failure
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Unban Startup</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to <strong>unban</strong>{' '}
          <strong>{startup?.name}</strong>? This will restore their access to the
          platform.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button
          onClick={handleClose}
          disabled={loading}
          color="inherit"
          variant="outlined"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={loading}
          color="success"
          variant="contained"
          startIcon={
            loading ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <FontAwesomeIcon icon={faUnlock} />
            )
          }
        >
          {loading ? 'Unbanning…' : 'Unban Startup'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
