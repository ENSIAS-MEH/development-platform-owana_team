'use client';

import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';

import type { AdminStartupResponse } from './types';

// ─── Types ────────────────────────────────────────────────────────────────────

type DeleteStartupDialogProps = {
  open: boolean;
  startup: AdminStartupResponse | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

// ─── Component ────────────────────────────────────────────────────────────────

export function DeleteStartupDialog({ open, startup, onClose, onConfirm }: DeleteStartupDialogProps) {
  const [confirmName, setConfirmName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const nameMatches = startup ? confirmName === startup.name : false;
  const canConfirm = nameMatches && !loading;

  const handleConfirm = useCallback(async () => {
    if (!canConfirm) return;

    setLoading(true);
    setError('');
    try {
      await onConfirm();
      setConfirmName('');
      setError('');
    } catch (err: any) {
      setError(err?.message || 'Failed to delete startup. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [canConfirm, onConfirm]);

  const handleClose = useCallback(() => {
    if (loading) return;
    setConfirmName('');
    setError('');
    onClose();
  }, [loading, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontWeight: 700 }}>Delete Startup Permanently</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This action is <strong>permanent and irreversible</strong>. The startup{' '}
          <strong>{startup?.name}</strong> and all associated data will be permanently deleted.
        </Typography>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          To confirm, type the startup name exactly: <strong>{startup?.name}</strong>
        </Typography>

        <TextField
          fullWidth
          placeholder="Type startup name to confirm"
          value={confirmName}
          onChange={(e) => setConfirmName(e.target.value)}
          disabled={loading}
          autoComplete="off"
        />

        {loading && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <CircularProgress size={16} /> Deleting startup…
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={handleClose} disabled={loading} color="inherit" variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!canConfirm}
          color="error"
          variant="contained"
        >
          {loading ? 'Deleting…' : 'Delete Permanently'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
