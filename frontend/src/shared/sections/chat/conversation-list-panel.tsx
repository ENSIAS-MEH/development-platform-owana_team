'use client';

import { useMemo, useState, useEffect, useCallback } from 'react';

import useSWR from 'swr';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Skeleton from '@mui/material/Skeleton';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import InputAdornment from '@mui/material/InputAdornment';

import axios, { fetcher } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
import { useChatStore } from 'src/shared/api/stores/chatStore';
import { Iconify } from 'src/shared/components/iconify';

import type { IConversation } from 'src/types/chat';

import {
  truncatePreview,
  formatMessageTime,
  formatUnreadBadge,
  filterConversations,
} from './utils/chat-utils';
import { RecipientSelector } from './recipient-selector';

// ----------------------------------------------------------------------

const CONVERSATIONS_ENDPOINT = '/api/chat/conversations';

const swrOptions = {
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  onErrorRetry: (error: any, _key: string, _config: any, revalidate: any, { retryCount }: any) => {
    if (error?.status === 404) return;
    if (retryCount >= 3) return;
    setTimeout(() => revalidate({ retryCount }), 2 ** retryCount * 1000);
  },
};

// ----------------------------------------------------------------------

type ConversationListPanelProps = {
  onSelectConversation: (id: string) => void;
  selectedId: string | null;
};

export function ConversationListPanel({ onSelectConversation, selectedId }: ConversationListPanelProps) {
  const { user } = useAuthContext();
  const { unreadCounts, setConversations, updateUnreadCount, conversations: storeConversations } = useChatStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [recipientSelectorOpen, setRecipientSelectorOpen] = useState(false);

  // Cache of resolved user names: userId → display name
  const [userNameCache, setUserNameCache] = useState<Record<string, string>>({});

  // Cache of resolved user profile pictures: userId → URL
  const [userPictureCache, setUserPictureCache] = useState<Record<string, string>>({});

  // Fetch conversations via SWR
  const {
    data: conversations,
    error,
    isLoading,
    mutate,
  } = useSWR<IConversation[]>(CONVERSATIONS_ENDPOINT, fetcher, swrOptions);

  // Sync conversations to Zustand store when data arrives
  useMemo(() => {
    if (conversations) {
      setConversations(conversations);
    }
  }, [conversations, setConversations]);

  // Fetch initial unread counts from backend
  useEffect(() => {
    if (!conversations || conversations.length === 0) return;

    const fetchUnreadCounts = async () => {
      try {
        const response = await axios.get('/api/chat/conversations/unread');
        const counts: Record<string, number> = response.data;
        Object.entries(counts).forEach(([convId, count]) => {
          updateUnreadCount(convId, count);
        });
      } catch {
        // Silently ignore — unread counts are not critical
      }
    };

    fetchUnreadCounts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  // Resolve participant names from user-service
  useEffect(() => {
    const allConversations = storeConversations.length > 0 ? storeConversations : conversations;
    if (!allConversations || !user) return;

    const currentIds = [user?.id, user?.userId].filter(Boolean);

    // Collect all participant IDs we haven't resolved yet
    const idsToResolve = new Set<string>();
    allConversations.forEach((conv) => {
      conv.participants.forEach((pid) => {
        if (!currentIds.includes(pid) && !userNameCache[pid]) {
          idsToResolve.add(pid);
        }
      });
    });

    if (idsToResolve.size === 0) return;

    // Fetch user profiles for unknown participants
    const resolveNames = async () => {
      const newCache: Record<string, string> = {};
      const newPicCache: Record<string, string> = {};

      await Promise.allSettled(
        Array.from(idsToResolve).map(async (pid) => {
          try {
            const response = await axios.get(`/api/users/${pid}`);
            const profile = response.data;
            const name = [profile.firstName, profile.lastName].filter(Boolean).join(' ')
              || profile.username
              || 'Someone';
            newCache[pid] = name;
            if (profile.profilePictureURL) {
              newPicCache[pid] = profile.profilePictureURL;
            }
          } catch {
            // Don't cache failures — will retry on next render
          }
        })
      );

      if (Object.keys(newCache).length > 0) {
        setUserNameCache((prev) => ({ ...prev, ...newCache }));
      }
      if (Object.keys(newPicCache).length > 0) {
        setUserPictureCache((prev) => ({ ...prev, ...newPicCache }));
      }
    };

    resolveNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations, storeConversations, user]);

  // Also resolve startup names for group conversations
  const [startupNameCache, setStartupNameCache] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!conversations) return;

    const startupIdsToResolve = new Set<string>();
    conversations.forEach((conv) => {
      if (conv.type === 'group' && conv.startupId && !startupNameCache[conv.startupId]) {
        startupIdsToResolve.add(conv.startupId);
      }
    });

    if (startupIdsToResolve.size === 0) return;

    const resolveStartupNames = async () => {
      const newCache: Record<string, string> = {};

      await Promise.allSettled(
        Array.from(startupIdsToResolve).map(async (sid) => {
          try {
            const response = await axios.get(`/api/startups/${sid}`);
            const startup = response.data;
            newCache[sid] = startup.name || startup.startupName || `Group: ${sid}`;
          } catch {
            newCache[sid] = `Group: ${sid}`;
          }
        })
      );

      setStartupNameCache((prev) => ({ ...prev, ...newCache }));
    };

    resolveStartupNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations]);

  // Sort conversations by updatedAt descending
  const sortedConversations = useMemo(() => {
    if (!conversations) return [];
    return [...conversations].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [conversations]);

  // Resolve participant name from cache
  const getUserName = useCallback(
    (id: string): string => userNameCache[id] || id,
    [userNameCache]
  );

  // Filter conversations based on search query
  const filteredConversations = useMemo(() => {
    if (!searchQuery.trim()) return sortedConversations;
    return filterConversations(sortedConversations, searchQuery, getUserName);
  }, [sortedConversations, searchQuery, getUserName]);

  // Get display name for a conversation
  const getConversationDisplayName = useCallback(
    (conversation: IConversation): string => {
      if (conversation.type === 'group' && conversation.startupId) {
        return startupNameCache[conversation.startupId] || `Group: ${conversation.startupId}`;
      }
      // For direct conversations, find the other participant
      // Check both user.id (profile ID) and user.userId (auth UUID) since
      // participants are stored as auth UUIDs
      const currentIds = [user?.id, user?.userId].filter(Boolean);
      const otherParticipant = conversation.participants.find((p) => !currentIds.includes(p));
      if (!otherParticipant) return 'Someone';
      // Show resolved name, "..." while loading, or "Someone" if fetch failed
      if (userNameCache[otherParticipant]) {
        return userNameCache[otherParticipant];
      }
      // If cache has the key but value is 'Someone', the fetch failed
      if (otherParticipant in userNameCache) {
        return 'Someone';
      }
      // Still loading — show temporary placeholder
      return '...';
    },
    [user, userNameCache, startupNameCache]
  );

  // Handle search input change
  const handleSearchChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  }, []);

  // Handle retry
  const handleRetry = useCallback(() => {
    mutate();
  }, [mutate]);

  // Handle new message button
  const handleNewMessage = useCallback(() => {
    setRecipientSelectorOpen(true);
  }, []);

  const handleCloseRecipientSelector = useCallback(() => {
    setRecipientSelectorOpen(false);
  }, []);

  // Handle conversation selected from RecipientSelector
  const handleRecipientSelect = useCallback(
    (conversationId: string) => {
      setRecipientSelectorOpen(false);
      onSelectConversation(conversationId);
    },
    [onSelectConversation]
  );

  // --- Loading State ---
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', p: 2 }}>
        <Skeleton variant="rounded" height={40} sx={{ mb: 2 }} />
        {[...Array(6)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
            <Skeleton variant="circular" width={48} height={48} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="80%" height={16} />
            </Box>
            <Skeleton variant="text" width={30} height={16} />
          </Box>
        ))}
      </Box>
    );
  }

  // --- Error State ---
  if (error) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 3,
          textAlign: 'center',
        }}
      >
        <Iconify icon="eva:alert-triangle-fill" width={48} sx={{ color: 'error.main', mb: 2 }} />
        <Typography variant="h6" sx={{ mb: 1 }}>
          Failed to load conversations
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Something went wrong. Please try again.
        </Typography>
        <Button variant="contained" onClick={handleRetry} startIcon={<Iconify icon="eva:refresh-fill" />}>
          Retry
        </Button>
      </Box>
    );
  }

  // --- Empty State ---
  if (!filteredConversations.length && !searchQuery) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Search input */}
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Search conversations..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Empty state content */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Iconify icon="eva:message-circle-outline" width={64} sx={{ color: 'text.disabled', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            No conversations yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start a new conversation from a member&apos;s profile.
          </Typography>
        </Box>

        {recipientSelectorOpen && (
          <RecipientSelector
            open={recipientSelectorOpen}
            onClose={handleCloseRecipientSelector}
            onSelect={handleRecipientSelect}
          />
        )}
      </Box>
    );
  }

  // --- Main Render ---
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Search input */}
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search conversations..."
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            ...(searchQuery && {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchQuery('')} aria-label="Clear search">
                    <Iconify icon="eva:close-fill" width={18} />
                  </IconButton>
                </InputAdornment>
              ),
            }),
          }}
        />
      </Box>

      {/* No search results */}
      {filteredConversations.length === 0 && searchQuery && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            p: 3,
            textAlign: 'center',
          }}
        >
          <Iconify icon="eva:search-fill" width={48} sx={{ color: 'text.disabled', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            No conversations match &ldquo;{searchQuery}&rdquo;
          </Typography>
        </Box>
      )}

      {/* Conversation List */}
      {filteredConversations.length > 0 && (
        <List sx={{ flex: 1, overflow: 'auto', px: 1 }}>
          {filteredConversations.map((conversation) => {
            const unreadCount = unreadCounts[conversation._id] || 0;
            const badgeContent = formatUnreadBadge(unreadCount);
            const isSelected = selectedId === conversation._id;
            const displayName = getConversationDisplayName(conversation);
            const isGroup = conversation.type === 'group';

            // Get profile picture for direct conversations
            const currentIds = [user?.id, user?.userId].filter(Boolean);
            const otherParticipantId = !isGroup
              ? conversation.participants.find((p) => !currentIds.includes(p))
              : null;
            const profilePic = otherParticipantId ? userPictureCache[otherParticipantId] : undefined;

            return (
              <ListItem key={conversation._id} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() => onSelectConversation(conversation._id)}
                  sx={{
                    borderRadius: 1,
                    py: 1.5,
                    px: 2,
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      src={isGroup ? undefined : profilePic}
                      alt={displayName}
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: isGroup ? 'secondary.main' : 'primary.main',
                      }}
                    >
                      {isGroup ? (
                        <Iconify icon="eva:people-fill" width={24} />
                      ) : (
                        displayName.charAt(0).toUpperCase()
                      )}
                    </Avatar>
                  </ListItemAvatar>

                  <ListItemText
                    primary={displayName}
                    secondary={truncatePreview(conversation.lastMessage || '')}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      noWrap: true,
                      fontWeight: unreadCount > 0 ? 700 : 400,
                    }}
                    secondaryTypographyProps={{
                      variant: 'body2',
                      noWrap: true,
                      color: unreadCount > 0 ? 'text.primary' : 'text.secondary',
                    }}
                  />

                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      ml: 1,
                      flexShrink: 0,
                      gap: 0.5,
                    }}
                  >
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      noWrap
                    >
                      {formatMessageTime(conversation.updatedAt)}
                    </Typography>

                    {badgeContent && (
                      <Box
                        sx={{
                          minWidth: 20,
                          height: 20,
                          borderRadius: '10px',
                          bgcolor: 'warning.main',
                          color: '#fff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          px: 0.5,
                          fontSize: 11,
                          fontWeight: 700,
                        }}
                      >
                        {badgeContent}
                      </Box>
                    )}
                  </Box>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      )}

      {recipientSelectorOpen && (
        <RecipientSelector
          open={recipientSelectorOpen}
          onClose={handleCloseRecipientSelector}
          onSelect={handleRecipientSelect}
        />
      )}
    </Box>
  );
}
