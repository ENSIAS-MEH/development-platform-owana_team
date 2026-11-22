'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Alert from '@mui/material/Alert';
import Dialog from '@mui/material/Dialog';
import Avatar from '@mui/material/Avatar';
import ListItem from '@mui/material/ListItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import DialogContent from '@mui/material/DialogContent';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';

import { Iconify } from 'src/shared/components/iconify';

// ----------------------------------------------------------------------

type UserSearchResult = {
  id?: string;
  userId?: string;
  firstName?: string;
  lastName?: string;
  username?: string;
  profilePictureURL?: string;
  email?: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (conversationId: string) => void;
};

// ----------------------------------------------------------------------

export function RecipientSelector({ open, onClose, onSelect }: Props) {
  const { user: currentUser } = useAuthContext();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selecting, setSelecting] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  // Get the current user's ID (could be userId or id depending on context)
  const currentUserId = currentUser?.userId || currentUser?.id || '';

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setError(null);
      return undefined;
    }

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get('/api/users/search', {
          params: { query: query.trim() },
        });

        const users: UserSearchResult[] = Array.isArray(response.data)
          ? response.data
          : response.data?.users || [];

        // Exclude authenticated user from results and limit to 20
        const filtered = users
          .filter((u) => {
            const uid = u.userId || u.id || '';
            return uid !== currentUserId;
          })
          .slice(0, 20);

        setResults(filtered);
      } catch (err: any) {
        setError(err?.message || 'Failed to search users');
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [query, currentUserId]);

  // Reset state when dialog closes
  useEffect(() => {
    if (!open) {
      setQuery('');
      setResults([]);
      setError(null);
      setSelecting(false);
    }
  }, [open]);

  const handleSelect = useCallback(
    async (user: UserSearchResult) => {
      const targetUserId = user.userId || user.id || '';
      if (!targetUserId) return;

      setSelecting(true);
      setError(null);

      try {
        const response = await axios.post('/api/chat/conversations/direct', {
          targetUserId,
        });

        const conversation = response.data;
        onSelect(conversation._id || conversation.id);
        onClose();
      } catch (err: any) {
        setError(err?.message || 'Failed to create conversation');
      } finally {
        setSelecting(false);
      }
    },
    [onSelect, onClose]
  );

  const getUserDisplayName = (user: UserSearchResult): string => {
    if (user.firstName || user.lastName) {
      return `${user.firstName || ''} ${user.lastName || ''}`.trim();
    }
    return user.username || user.email || 'Unknown user';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>New Message</DialogTitle>

      <DialogContent sx={{ pb: 2 }}>
        <TextField
          fullWidth
          autoFocus
          placeholder="Search users..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2, mt: 1 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Iconify icon="eva:search-fill" width={20} sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
            endAdornment: loading ? (
              <InputAdornment position="end">
                <CircularProgress size={20} />
              </InputAdornment>
            ) : null,
          }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Empty state when query has results but none match */}
        {!loading && !error && query.trim() && results.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              No users found matching &quot;{query}&quot;
            </Typography>
          </Box>
        )}

        {/* Results list */}
        {results.length > 0 && (
          <List disablePadding sx={{ maxHeight: 360, overflow: 'auto' }}>
            {results.map((user) => {
              const uid = user.userId || user.id || '';
              const displayName = getUserDisplayName(user);

              return (
                <ListItem key={uid} disablePadding>
                  <ListItemButton
                    onClick={() => handleSelect(user)}
                    disabled={selecting}
                    sx={{ borderRadius: 1 }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={user.profilePictureURL || ''}
                        alt={displayName}
                        sx={{ width: 40, height: 40 }}
                      >
                        {displayName.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={displayName}
                      secondary={user.username ? `@${user.username}` : user.email}
                    />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        )}

        {/* Initial state - no query typed yet */}
        {!query.trim() && !error && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Search for a user to start a conversation
            </Typography>
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
