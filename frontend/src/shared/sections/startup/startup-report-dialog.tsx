'use client';

import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { toast } from 'src/shared/components/snackbar';

import { reportStartup } from 'src/shared/actions/startup';
import { validateReportReason } from './utils';

// ----------------------------------------------------------------------

type Props = {
  open: boolean;
  startupId: string;
  onClose: () => void;
};

export function StartupReportDialog({ open, startupId, onClose }: Props) {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    const validation = validateReportReason(reason);
    if (!validation.valid) {
      setError(validation.error || 'Invalid reason');
      return;
    }

    setSubmitting(true);
    try {
      await reportStartup(startupId, reason.trim());
      toast.success('Report submitted successfully');
      setReason('');
      setError('');
      onClose();
    } catch (err: any) {
      const message = err?.message || 'Failed to submit report';
      toast.error(message);
      // Close dialog if it's a permission error (member/founder trying to report)
      if (message.includes('cannot report') || message.includes('already reported')) {
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  }, [reason, startupId, onClose]);

  const handleClose = useCallback(() => {
    setReason('');
    setError('');
    onClose();
  }, [onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Report Startup</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Please provide a reason for reporting this startup (10–500 characters).
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          placeholder="Describe the issue..."
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error || `${reason.length}/500`}
          inputProps={{ maxLength: 500 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
