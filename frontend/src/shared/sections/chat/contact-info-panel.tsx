'use client';

import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import Collapse from '@mui/material/Collapse';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

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
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up(900));
  const [expanded, setExpanded] = useState(true);

  const { user: currentUser } = useAuth();
  const conversations = useChatStore((state) => state.conversations);

  const conversation = useMemo(
    () => conversations.find((c) => c._id === conversationId) || null,
    [conversations, conversationId]
  );

  // For direct conversations, find the other participant's ID
  const otherParticipantId = useMemo(() => {
    if (!conversation || conversationType !== 'direct') return '';
    const currentUserId = currentUser?.userId || currentUser?.id || '';
    return conversation.participants.find((id) => id !== currentUserId) || '';
  }, [conversation, conversationType, currentUser]);

  // Fetch user profile for direct conversations
  const {
    data: userProfile,
    error: userError,
    isLoading: userLoading,
    mutate: retryUser,
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
    error: startupError,
    isLoading: startupLoading,
  } = useSWR<StartupInfo>(
    conversationType === 'group' && startupId ? `${STARTUP_ENDPOINT}/${startupId}` : null,
    silentFetcher,
    swrOptions
  );

  // Fetch member profiles for group conversations (up to 50)
  const participantIds = useMemo(() => {
    if (!conversation || conversationType !== 'group') return [];
    return conversation.participants.slice(0, 50);
  }, [conversation, conversationType]);

  // Fetch each member's profile
  const memberQueries = participantIds.map((id) => `${USER_ENDPOINT}/${id}`);
  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
    mutate: retryMembers,
  } = useSWR<UserProfile[]>(
    conversationType === 'group' && memberQueries.length > 0
      ? ['group-members', ...memberQueries]
      : null,
    async () => {
      const results = await Promise.all(
        memberQueries.map((url) => silentFetcher(url).catch(() => null))
      );
      return results.filter(Boolean) as UserProfile[];
    },
    swrOptions
  );

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  // Don't render if no conversation selected
  if (!conversationId) {
    return null;
  }

  const renderToggleButton = () => (
    <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
      <IconButton onClick={handleToggle} size="small">
        <Iconify
          icon={expanded ? 'eva:arrow-ios-forward-fill' : 'eva:arrow-ios-back-fill'}
          width={20}
        />
      </IconButton>
    </Box>
  );

  const renderLoadingSkeleton = () => (
    <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1.5 }}>
      <Skeleton variant="circular" width={96} height={96} />
      <Skeleton variant="text" width={140} height={28} />
      <Skeleton variant="text" width={100} height={20} />
      <Skeleton variant="text" width={120} height={20} />
    </Box>
  );

  const renderError = (message: string, onRetry: () => void) => (
    <Box sx={{ p: 3, textAlign: 'center' }}>
      <Typography variant="body2" color="error" sx={{ mb: 2 }}>
        {message}
      </Typography>
      <Button variant="outlined" size="small" onClick={onRetry}>
        Retry
      </Button>
    </Box>
  );

  const renderDirectProfile = () => {
    if (userLoading) return renderLoadingSkeleton();
    if (userError) {
      return renderError('Could not load contact information.', () => retryUser());
    }
    if (!userProfile) return null;

    const fullName = [userProfile.firstName, userProfile.lastName].filter(Boolean).join(' ');

    return (
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <Avatar
          src={userProfile.profilePictureURL || undefined}
          alt={fullName}
          sx={{ width: 96, height: 96, mb: 1 }}
        />

        {fullName && (
          <Typography variant="subtitle1" fontWeight={600}>
            {fullName}
          </Typography>
        )}

        {userProfile.username && (
          <Typography variant="body2" color="text.secondary">
            @{userProfile.username}
          </Typography>
        )}

        {userProfile.job && (
          <Typography variant="body2" color="text.secondary">
            {userProfile.job}
          </Typography>
        )}

        {userProfile.location && (
          <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Iconify icon="eva:pin-outline" width={16} />
            {userProfile.location}
          </Typography>
        )}
      </Box>
    );
  };

  const renderGroupInfo = () => {
    if (startupLoading || membersLoading) return renderLoadingSkeleton();
    if (startupError || membersError) {
      return renderError('Could not load group information.', () => retryMembers());
    }

    return (
      <Box sx={{ p: 2 }}>
        {/* Startup header */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2 }}>
          <Avatar
            src={startupInfo?.logoUrl || undefined}
            alt={startupInfo?.name || 'Group'}
            sx={{ width: 72, height: 72, mb: 1 }}
          />
          <Typography variant="subtitle1" fontWeight={600}>
            {startupInfo?.name || 'Group Chat'}
          </Typography>
          {membersData && (
            <Typography variant="caption" color="text.secondary">
              {membersData.length} {membersData.length === 1 ? 'member' : 'members'}
            </Typography>
          )}
        </Box>

        {/* Member list */}
        {membersData && membersData.length > 0 && (
          <List dense disablePadding>
            {membersData.map((member) => {
              const memberName = [member.firstName, member.lastName].filter(Boolean).join(' ') || 'Unknown';
              return (
                <ListItem key={member.id} disableGutters sx={{ px: 1 }}>
                  <ListItemAvatar sx={{ minWidth: 40 }}>
                    <Avatar
                      src={member.profilePictureURL || undefined}
                      alt={memberName}
                      sx={{ width: 32, height: 32 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={memberName}
                    primaryTypographyProps={{ variant: 'body2', noWrap: true }}
                  />
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    );
  };

  // On mobile, only show the toggle button (panel hidden)
  if (!isDesktop && !expanded) {
    return renderToggleButton();
  }

  return (
    <Box
      sx={{
        width: expanded ? 280 : 'auto',
        borderLeft: `1px solid ${theme.palette.divider}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        transition: theme.transitions.create('width'),
      }}
    >
      {isDesktop && renderToggleButton()}

      <Collapse in={expanded} orientation="horizontal" sx={{ flex: 1, overflow: 'auto' }}>
        <Box sx={{ width: 280 }}>
          {conversationType === 'direct' && renderDirectProfile()}
          {conversationType === 'group' && renderGroupInfo()}
        </Box>
      </Collapse>
    </Box>
  );
}
