'use client';

import { useState, useCallback, useMemo } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';

import type { AdminStartupResponse } from './types';

// ----------------------------------------------------------------------

type BanStartupDialogProps = {
  open: boolean;
  startup: AdminStartupResponse | null;
  onClose: () => void;
  onConfirm: (reason: string, bannedUntil: string | null) => Promise<void>;
};

// ----------------------------------------------------------------------

export function BanStartupDialog({ open, startup, onClose, onConfirm }: BanStartupDialogProps) {
  const [reason, setReason] = useState('');
  const [bannedUntil, setBannedUntil] = useState('');
  const [reasonError, setReasonError] = useState('');
  const [dateError, setDateError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const validateReason = useCallback((value: string): string => {
    if (value.trim().length === 0) {
      return 'Ban reason is required';
    }
    if (value.length > 500) {
      return 'Ban reason must not exceed 500 characters';
    }
    return '';
  }, []);

  const validateDate = useCallback((value: string): string => {
    if (!value) return '';
    const selectedDate = new Date(value);
    if (Number.isNaN(selectedDate.getTime())) {
      return 'Invalid date';
    }
    if (selectedDate <= new Date()) {
      return 'Ban expiry must be in the future';
    }
    return '';
  }, []);

  const isValid = useMemo(() => {
    const reasonValid = reason.trim().length >= 1 && reason.length <= 500;
    const dateValid = !bannedUntil || new Date(bannedUntil) > new Date();
    return reasonValid && dateValid;
  }, [reason, bannedUntil]);

  const handleReasonChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setReason(value);
      setReasonError(validateReason(value));
    },
    [validateReason]
  );

  const handleDateChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setBannedUntil(value);
      setDateError(validateDate(value));
    },
    [validateDate]
  );

  const handleSubmit = useCallback(async () => {
    const reasonErr = validateReason(reason);
    const dateErr = validateDate(bannedUntil);

    if (reasonErr || dateErr) {
      setReasonError(reasonErr);
      setDateError(dateErr);
      return;
    }

    setSubmitting(true);
    try {
      await onConfirm(reason.trim(), bannedUntil || null);
      setReason('');
      setBannedUntil('');
      setReasonError('');
      setDateError('');
    } finally {
      setSubmitting(false);
    }
  }, [reason, bannedUntil, validateReason, validateDate, onConfirm]);

  const handleClose = useCallback(() => {
    if (submitting) return;
    setReason('');
    setBannedUntil('');
    setReasonError('');
    setDateError('');
    onClose();
  }, [submitting, onClose]);

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Ban Startup{startup ? `: ${startup.name}` : ''}</DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 1 }}>
          <Typography variant="body2" color="text.secondary">
            Provide a reason for banning this startup. Optionally set an expiry date for the ban.
          </Typography>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Ban Reason *"
            placeholder="Describe the reason for banning..."
            value={reason}
            onChange={handleReasonChange}
            error={!!reasonError}
            helperText={reasonError || `${reason.length}/500`}
            inputProps={{ maxLength: 500 }}
            disabled={submitting}
          />

          <TextField
            fullWidth
            label="Ban Expiry (optional)"
            type="datetime-local"
            value={bannedUntil}
            onChange={handleDateChange}
            error={!!dateError}
            helperText={dateError || 'Leave empty for permanent ban'}
            disabled={submitting}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="inherit" disabled={submitting}>
          Cancel
        </Button>
        <LoadingButton
          onClick={handleSubmit}
          variant="contained"
          color="error"
          loading={submitting}
          disabled={!isValid}
        >
          Ban Startup
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
