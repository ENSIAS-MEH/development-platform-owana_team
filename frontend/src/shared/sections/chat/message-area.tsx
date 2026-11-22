'use client';

import type { IMessage } from 'src/types/chat';

import { useRef, useMemo, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import axios from 'src/utils/axios';

import { useAuthContext } from 'src/auth/hooks';
import { useChatStore } from 'src/shared/api/stores/chatStore';
import { useSocketStore } from 'src/shared/api/stores/socketStore';

import { formatMessageTime, formatTypingIndicator } from './utils/chat-utils';
import { MessageInput } from './message-input';

// ----------------------------------------------------------------------

const MESSAGES_PER_PAGE = 20;

// ----------------------------------------------------------------------

type Props = {
  conversationId: string | null;
};

export function MessageArea({ conversationId }: Props) {
  const { user } = useAuthContext();
  const currentUserId = user?.userId || user?.id || '';

  // Store state
  const messages = useChatStore((s) => s.messages);
  const typingUsers = useChatStore((s) => s.typingUsers);
  const hasMoreMessages = useChatStore((s) => s.hasMoreMessages);
  const setMessages = useChatStore((s) => s.setMessages);
  const appendOlderMessages = useChatStore((s) => s.appendOlderMessages);
  const conversations = useChatStore((s) => s.conversations);

  // Socket store
  const emit = useSocketStore((s) => s.emit);
  const connected = useSocketStore((s) => s.connected);

  // Local state
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [senderNameCache, setSenderNameCache] = useState<Record<string, string>>({});

  // Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isAtBottomRef = useRef(true);
  const prevScrollHeightRef = useRef(0);

  // Determine if current conversation is a group
  const isGroup = useMemo(() => {
    if (!conversationId) return false;
    const conv = conversations.find((c) => c._id === conversationId);
    return conv?.type === 'group';
  }, [conversationId, conversations]);

  // Derived values
  const conversationMessages = useMemo(
    () => (conversationId ? messages[conversationId] || [] : []),
    [messages, conversationId]
  );

  const typingUserNames = useMemo(
    () => (conversationId ? typingUsers[conversationId] || [] : []),
    [typingUsers, conversationId]
  );

  const hasMore = conversationId ? hasMoreMessages[conversationId] ?? true : false;

  // ------------------------------------------------------------------
  // Resolve sender names for group conversations
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!isGroup || !conversationMessages.length) return;

    // Collect sender IDs we haven't resolved yet
    const idsToResolve = new Set<string>();
    conversationMessages.forEach((msg) => {
      if (msg.senderId !== currentUserId && !senderNameCache[msg.senderId]) {
        idsToResolve.add(msg.senderId);
      }
    });

    if (idsToResolve.size === 0) return;

    const resolveNames = async () => {
      const newCache: Record<string, string> = {};

      await Promise.allSettled(
        Array.from(idsToResolve).map(async (senderId) => {
          try {
            const response = await axios.get(`/api/users/${senderId}`);
            const profile = response.data;
            newCache[senderId] =
              [profile.firstName, profile.lastName].filter(Boolean).join(' ') ||
              profile.username ||
              'Someone';
          } catch {
            // Don't cache failures — will retry on next render
          }
        })
      );

      setSenderNameCache((prev) => ({ ...prev, ...newCache }));
    };

    resolveNames();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isGroup, conversationMessages.length]);

  // Helper to get sender display name
  const getSenderName = useCallback(
    (senderId: string): string => senderNameCache[senderId] || 'Someone',
    [senderNameCache]
  );

  // ------------------------------------------------------------------
  // Fetch initial messages
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!conversationId) return undefined;

    // Skip if messages already loaded for this conversation
    if (messages[conversationId]?.length) {
      scrollToBottom();
      return undefined;
    }

    let cancelled = false;

    const fetchMessages = async () => {
      try {
        const response = await axios.get(
          `/api/chat/conversations/${conversationId}/messages?page=1`
        );
        if (cancelled) return;

        const fetchedMessages: IMessage[] = response.data.messages || response.data;
        const hasMoreData = fetchedMessages.length >= MESSAGES_PER_PAGE;

        // Messages from API come newest-first; reverse to chronological (oldest top)
        const sorted = [...fetchedMessages].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );

        setMessages(conversationId, sorted, hasMoreData);
        setTimeout(scrollToBottom, 50);
      } catch (error) {
        console.error('Failed to fetch messages:', error);
      }
    };

    fetchMessages();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // ------------------------------------------------------------------
  // Emit mark_read when conversation is viewed
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!conversationId) return;
    emit('mark_read', { conversationId });
  }, [conversationId, emit]);

  // ------------------------------------------------------------------
  // Emit mark_read when new message arrives while viewing
  // ------------------------------------------------------------------

  useEffect(() => {
    if (!conversationId) return;
    if (!conversationMessages.length) return;

    const lastMessage = conversationMessages[conversationMessages.length - 1];
    if (lastMessage && lastMessage.senderId !== currentUserId) {
      emit('mark_read', { conversationId });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationMessages.length]);

  // ------------------------------------------------------------------
  // Auto-scroll to bottom on new messages (when already at bottom)
  // ------------------------------------------------------------------

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationMessages.length]);

  // ------------------------------------------------------------------
  // Scroll helpers
  // ------------------------------------------------------------------

  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTop = container.scrollHeight;
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Track if user is at the bottom
    const { scrollTop, scrollHeight, clientHeight } = container;
    isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 50;

    // Infinite scroll upward: trigger when scrolled near top
    if (scrollTop < 80 && hasMore && !loadingOlder && conversationId) {
      loadOlderMessages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, loadingOlder, conversationId]);

  // ------------------------------------------------------------------
  // Load older messages
  // ------------------------------------------------------------------

  const loadOlderMessages = useCallback(async () => {
    if (!conversationId || loadingOlder || !hasMore) return;

    setLoadingOlder(true);
    const container = scrollContainerRef.current;
    prevScrollHeightRef.current = container?.scrollHeight || 0;

    try {
      const currentPage = useChatStore.getState().messagePage[conversationId] || 1;
      const nextPage = currentPage + 1;

      const response = await axios.get(
        `/api/chat/conversations/${conversationId}/messages?page=${nextPage}`
      );

      const fetchedMessages: IMessage[] = response.data.messages || response.data;
      const hasMoreData = fetchedMessages.length >= MESSAGES_PER_PAGE;

      // Sort chronologically (oldest first)
      const sorted = [...fetchedMessages].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      appendOlderMessages(conversationId, sorted, hasMoreData);

      // Preserve scroll position after prepending older messages
      requestAnimationFrame(() => {
        if (container) {
          const newScrollHeight = container.scrollHeight;
          container.scrollTop = newScrollHeight - prevScrollHeightRef.current;
        }
      });
    } catch (error) {
      console.error('Failed to load older messages:', error);
    } finally {
      setLoadingOlder(false);
    }
  }, [conversationId, loadingOlder, hasMore, appendOlderMessages]);

  // ------------------------------------------------------------------
  // Empty state: no conversation selected
  // ------------------------------------------------------------------

  if (!conversationId) {
    return (
      <Stack
        sx={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          p: 3,
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Select a conversation to start messaging
        </Typography>
      </Stack>
    );
  }

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <Stack sx={{ flex: 1, height: '100%', overflow: 'hidden' }}>
      {/* Messages scroll area */}
      <Box
        ref={scrollContainerRef}
        onScroll={handleScroll}
        sx={{
          flex: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Loading older messages indicator */}
        {loadingOlder && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Messages */}
        {conversationMessages.map((message) => (
          <MessageBubble
            key={message._id}
            message={message}
            isSent={message.senderId === currentUserId}
            isGroup={isGroup}
            senderName={getSenderName(message.senderId)}
          />
        ))}

        {/* Typing indicator */}
        {typingUserNames.length > 0 && (
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
              {formatTypingIndicator(typingUserNames.map((id) => getSenderName(id)))} typing...
            </Typography>
          </Box>
        )}
      </Box>

      {/* Message Input */}
      <MessageInput conversationId={conversationId} disabled={!connected} />
    </Stack>
  );
}

// ----------------------------------------------------------------------
// MessageBubble sub-component
// ----------------------------------------------------------------------

type MessageBubbleProps = {
  message: IMessage;
  isSent: boolean;
  isGroup: boolean;
  senderName: string;
};

function MessageBubble({ message, isSent, isGroup, senderName }: MessageBubbleProps) {
  const [imageOpen, setImageOpen] = useState(false);

  return (
    <Stack
      direction="row"
      justifyContent={isSent ? 'flex-end' : 'flex-start'}
      sx={{ mb: 1.5, px: 1 }}
    >
      {/* Avatar for received messages in group conversations */}
      {!isSent && isGroup && (
        <Avatar
          sx={{ width: 32, height: 32, mr: 1, mt: 0.5 }}
          alt={senderName}
        >
          {senderName.charAt(0).toUpperCase()}
        </Avatar>
      )}

      <Stack
        sx={{
          maxWidth: '70%',
          alignItems: isSent ? 'flex-end' : 'flex-start',
        }}
      >
        {/* Sender name for group received messages */}
        {!isSent && isGroup && (
          <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, px: 1, fontWeight: 600 }}>
            {senderName}
          </Typography>
        )}

        {/* Message content bubble */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 1.5,
            bgcolor: isSent ? 'primary.main' : 'grey.200',
            color: isSent ? 'primary.contrastText' : 'text.primary',
            wordBreak: 'break-word',
          }}
        >
          {/* File attachment rendering */}
          {message.fileUrl && message.fileType === 'image' && (
            <>
              <Box
                component="img"
                src={message.fileUrl}
                alt={message.fileName || 'Image'}
                onClick={() => setImageOpen(true)}
                sx={{
                  maxWidth: 240,
                  borderRadius: 1,
                  mb: message.content ? 1 : 0,
                  cursor: 'pointer',
                  '&:hover': { opacity: 0.85 },
                }}
              />
              {/* Fullscreen image dialog */}
              {imageOpen && (
                <Box
                  onClick={() => setImageOpen(false)}
                  sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    bgcolor: 'rgba(0, 0, 0, 0.85)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 9999,
                    cursor: 'pointer',
                  }}
                >
                  <Box
                    component="img"
                    src={message.fileUrl}
                    alt={message.fileName || 'Image'}
                    sx={{
                      maxWidth: '90vw',
                      maxHeight: '90vh',
                      borderRadius: 1,
                      objectFit: 'contain',
                    }}
                  />
                </Box>
              )}
            </>
          )}

          {message.fileUrl && message.fileType === 'audio' && (
            <Box
              component="audio"
              controls
              src={message.fileUrl}
              sx={{ maxWidth: '100%', mb: message.content ? 1 : 0 }}
            />
          )}

          {message.fileUrl && message.fileType === 'video' && (
            <Box
              component="video"
              controls
              src={message.fileUrl}
              sx={{ maxWidth: 240, borderRadius: 1, mb: message.content ? 1 : 0 }}
            />
          )}

          {message.fileUrl && (message.fileType === 'pdf' || message.fileType === 'file') && (
            <Box
              component="a"
              href={message.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              download={message.fileName}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                color: isSent ? 'primary.contrastText' : 'primary.main',
                textDecoration: 'underline',
                mb: message.content ? 1 : 0,
              }}
            >
              📎 {message.fileName || 'Download file'}
            </Box>
          )}

          {message.content && (
            <Typography variant="body2">{message.content}</Typography>
          )}
        </Box>

        {/* Timestamp */}
        <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, px: 1 }}>
          {formatMessageTime(message.createdAt)}
        </Typography>
      </Stack>
    </Stack>
  );
}
