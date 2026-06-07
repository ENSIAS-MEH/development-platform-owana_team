'use client';

import { useMemo, useState, useCallback } from 'react';
import { mutate } from 'swr';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';

import { useGetJoinRequests, useGetUser, acceptJoinRequest, ignoreJoinRequest } from 'src/shared/actions/startup';
import { toast } from 'src/shared/components/snackbar';
import { Iconify } from 'src/shared/components/iconify';

import { getInitials } from './utils';

import type { IStartupJoinRequest } from 'src/types/startup';

// ----------------------------------------------------------------------

type Props = {
  startupId: string;
};

export function StartupJoinRequests({ startupId }: Props) {
  const { joinRequests } = useGetJoinRequests(startupId);

  const pendingRequests = useMemo(
    () => joinRequests.filter((r) => r.status === 'PENDING').slice(0, 50),
    [joinRequests]
  );

  if (pendingRequests.length === 0) return null;

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Join Requests ({pendingRequests.length})
      </Typography>

      <Stack spacing={2}>
        {pendingRequests.map((request) => (
          <JoinRequestCard key={request.id} request={request} startupId={startupId} />
        ))}
      </Stack>

      <Divider sx={{ mt: 4 }} />
    </Box>
  );
}

// ----------------------------------------------------------------------

function JoinRequestCard({ request, startupId }: { request: IStartupJoinRequest; startupId: string }) {
  const router = useRouter();
  const { user, userLoading } = useGetUser(request.userId);
  const [loading, setLoading] = useState(false);
  const [hidden, setHidden] = useState(false);

  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Unknown User';
  const initials = user ? getInitials(user.firstName, user.lastName) : '?';

  const handleAccept = useCallback(async () => {
    setLoading(true);
    try {
      await acceptJoinRequest(request.id);
      toast.success(`${fullName} has been added to the team`);
      setHidden(true);
      // Revalidate members and join requests
      mutate(`/api/startups/${startupId}/members`);
      mutate(`/api/startups/${startupId}/join-requests`);
    } catch {
      toast.error('Failed to accept join request');
    } finally {
      setLoading(false);
    }
  }, [request.id, fullName, startupId]);

  const handleIgnore = useCallback(async () => {
    setLoading(true);
    try {
      await ignoreJoinRequest(request.id);
      toast.success('Request ignored');
      setHidden(true);
      // Revalidate join requests
      mutate(`/api/startups/${startupId}/join-requests`);
    } catch {
      toast.error('Failed to ignore join request');
    } finally {
      setLoading(false);
    }
  }, [request.id, startupId]);

  if (hidden || userLoading) return null;

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Avatar
          src={user?.profilePictureURL || undefined}
          alt={fullName}
          sx={{ width: 44, height: 44, bgcolor: 'primary.lighter', color: 'primary.main' }}
        >
          {initials}
        </Avatar>

        <Stack sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle2" noWrap>
            {fullName}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Requested {fDate(request.requestDate)}
          </Typography>
        </Stack>

        {/* Chat icon */}
        <IconButton
          size="small"
          color="primary"
          onClick={() => router.push(`/dashboard/chat?userId=${request.userId}`)}
        >
          <Iconify icon="eva:message-circle-fill" width={20} />
        </IconButton>

        <Stack direction="row" spacing={1}>
          <Button
            size="small"
            variant="contained"
            color="primary"
            onClick={handleAccept}
            disabled={loading}
          >
            Accept
          </Button>
          <Button
            size="small"
            variant="outlined"
            color="inherit"
            onClick={handleIgnore}
            disabled={loading}
          >
            Ignore
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
