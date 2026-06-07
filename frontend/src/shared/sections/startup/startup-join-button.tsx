'use client';

import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import LoadingButton from '@mui/lab/LoadingButton';

import { toast } from 'src/shared/components/snackbar';

import { sendJoinRequest } from 'src/shared/actions/startup';

// ----------------------------------------------------------------------

type Props = {
  startupId: string;
  memberStatus: 'none' | 'pending' | 'member';
};

export function StartupJoinButton({ startupId, memberStatus }: Props) {
  const [status, setStatus] = useState(memberStatus);
  const [loading, setLoading] = useState(false);

  const handleJoin = useCallback(async () => {
    setLoading(true);
    try {
      await sendJoinRequest(startupId);
      toast.success('Join request sent successfully!');
      setStatus('pending');
    } catch {
      toast.error('Failed to send join request');
    } finally {
      setLoading(false);
    }
  }, [startupId]);

  if (status === 'member') {
    return (
      <Button fullWidth variant="contained" disabled size="large" sx={{ mt: 3 }}>
        Already a Member
      </Button>
    );
  }

  if (status === 'pending') {
    return (
      <Button fullWidth variant="contained" disabled size="large" sx={{ mt: 3 }}>
        Request Pending
      </Button>
    );
  }

  return (
    <LoadingButton
      fullWidth
      variant="contained"
      size="large"
      loading={loading}
      onClick={handleJoin}
      sx={{ mt: 3 }}
    >
      Request Join
    </LoadingButton>
  );
}
