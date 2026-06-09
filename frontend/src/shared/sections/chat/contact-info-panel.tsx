'use client';

import { useMemo } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';

import useSWR from 'swr';

import axios from 'src/utils/axios';

import { useAuth } from 'src/auth/context/jwt/use-auth';
import { useChatStore } from 'src/shared/api/stores/chatStore';
import { Iconify } from 'src/shared/components/iconify';

// Silent fetcher that doesn't log 404 errors to console
const silentFetcher = async (url: string) => {
  const res = await axios.get(url);
  return res.data;
};

// ----------------------------------------------------------------------

type UserProfile = {
  id: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePictureURL?: string | null;
  job?: string;
  location?: string;
  email?: string;
};

type StartupInfo = {
  id: string;
  name: string;
  logoUrl?: string | null;
};

type ContactInfoPanelProps = {
  conversationId: string | null;
  conversationType: 'direct' | 'group';
};

// ----------------------------------------------------------------------

const USER_ENDPOINT = '/api/users';
const STARTUP_ENDPOINT = '/api/startups';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: false,
};

// ----------------------------------------------------------------------

export function ContactInfoPanel({ conversationId, conversationType }: ContactInfoPanelProps) {
  const { user: currentUser } = useAuth();
  const conversations = useChatStore((state) => state.conversations);

  const conversation = useMemo(
    () => conversations.find((c) => c._id === conversationId) || null,
    [conversations, conversationId]
  );

  // For direct conversations, find the other participant's ID
  const otherParticipantId = useMemo(() => {
    if (!conversation || conversationType !== 'direct') return '';
    const currentIds = [currentUser?.userId, currentUser?.id].filter(Boolean);
    return conversation.participants.find((id) => !currentIds.includes(id)) || '';
  }, [conversation, conversationType, currentUser]);

  // Fetch user profile for direct conversations
  const {
    data: userProfile,
    isLoading: userLoading,
  } = useSWR<UserProfile>(
    conversationType === 'direct' && otherParticipantId
      ? `${USER_ENDPOINT}/${otherParticipantId}`
      : null,
    silentFetcher,
    swrOptions
  );

  // Fetch startup info for group conversations
  const startupId = conversation?.startupId || '';
  const {
    data: startupInfo,
    isLoading: startupLoading,
  } = useSWR<StartupInfo>(
    conversationType === 'group' && startupId ? `${STARTUP_ENDPOINT}/${startupId}` : null,
    silentFetcher,
    swrOptions
  );

  // Don't render if no conversation selected
  if (!conversationId) return null;

  // Direct conversation header
  if (conversationType === 'direct') {
    if (userLoading) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="text" width={120} height={24} />
        </Box>
      );
    }

    const fullName = userProfile
      ? [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ') || userProfile.username || 'Unknown'
      : 'Unknown';

    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Avatar
          src={userProfile?.profilePictureURL || undefined}
          alt={fullName}
          sx={{ width: 40, height: 40 }}
        >
          {fullName.charAt(0).toUpperCase()}
        </Avatar>
        <Box>
          <Typography variant="subtitle2" fontWeight={600}>
            {fullName}
          </Typography>
          {userProfile?.job && (
            <Typography variant="caption" color="text.secondary">
              {userProfile.job}
            </Typography>
          )}
        </Box>
      </Box>
    );
  }

  // Group conversation header
  if (startupLoading) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={140} height={24} />
      </Box>
    );
  }

  const groupName = startupInfo?.name || 'Group Chat';
  const memberCount = conversation?.participants.length || 0;

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
      <Avatar
        src={startupInfo?.logoUrl || undefined}
        alt={groupName}
        sx={{ width: 40, height: 40, bgcolor: 'secondary.main' }}
      >
        <Iconify icon="eva:people-fill" width={22} />
      </Avatar>
      <Box>
        <Typography variant="subtitle2" fontWeight={600}>
          {groupName}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {memberCount} {memberCount === 1 ? 'member' : 'members'}
        </Typography>
      </Box>
    </Box>
  );
}
