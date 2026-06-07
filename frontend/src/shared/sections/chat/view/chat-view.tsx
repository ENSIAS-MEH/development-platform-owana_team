'use client';

import { useRef, useState, useEffect, useCallback } from 'react';

import { mutate } from 'swr';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import LinearProgress from '@mui/material/LinearProgress';

import { useSearchParams } from 'src/routes/hooks';

import { useAuthContext } from 'src/auth/hooks';
import { useChatStore } from 'src/shared/api/stores/chatStore';
import { useSocketStore } from 'src/shared/api/stores/socketStore';
import { Iconify } from 'src/shared/components/iconify';
import { toast } from 'src/shared/components/snackbar';

import axios from 'src/utils/axios';

import type { IMessage, ITypingEvent, IMessagesReadEvent } from 'src/types/chat';

import { ConversationListPanel } from '../conversation-list-panel';
import { MessageArea } from '../message-area';
import { ContactInfoPanel } from '../contact-info-panel';

// ----------------------------------------------------------------------

type MobilePanel = 'list' | 'messages' | 'contact';

// ----------------------------------------------------------------------

export function ChatView() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(900));

  const searchParams = useSearchParams();
  const startupId = searchParams.get('startupId');
  const targetUserId = searchParams.get('userId');

  const { user } = useAuthContext();
  const token = user?.accessToken || '';
  const _currentUserId = user?.userId || user?.id || '';

  // Socket store
  const connected = useSocketStore((s) => s.connected);
  const reconnecting = useSocketStore((s) => s.reconnecting);
  const socketError = useSocketStore((s) => s.error);
  const socketConnect = useSocketStore((s) => s.connect);
  const socketDisconnect = useSocketStore((s) => s.disconnect);
  const socketEmit = useSocketStore((s) => s.emit);
  const socketOnEvent = useSocketStore((s) => s.onEvent);
  const socketOffEvent = useSocketStore((s) => s.offEvent);

  // Chat store
  const selectedConversationId = useChatStore((s) => s.selectedConversationId);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const addMessage = useChatStore((s) => s.addMessage);
  const incrementUnread = useChatStore((s) => s.incrementUnread);
  const resetUnread = useChatStore((s) => s.resetUnread);
  const updateLastMessage = useChatStore((s) => s.updateLastMessage);
  const markMessagesRead = useChatStore((s) => s.markMessagesRead);
  const setTypingUser = useChatStore((s) => s.setTypingUser);
  const removeTypingUser = useChatStore((s) => s.removeTypingUser);
  const conversations = useChatStore((s) => s.conversations);

  // Mobile panel navigation
  const [mobilePanel, setMobilePanel] = useState<MobilePanel>('list');

  // Track previous conversation for leave/join logic
  const previousConversationRef = useRef<string | null>(null);

  // Track if startupId deep-link has been handled
  const startupHandledRef = useRef(false);

  // Track if userId deep-link has been handled
  const userIdHandledRef = useRef(false);

  // ------------------------------------------------------------------
  // Socket connection on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    if (token) {
      socketConnect(token);
    }

    return () => {
      socketDisconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ------------------------------------------------------------------
  // Socket event listeners
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!connected) return undefined;

    const handleNewMessage = (message: IMessage) => {
      const { conversationId, content } = message;

      // Add message to store
      addMessage(conversationId, message);

      // Update last message preview
      updateLastMessage(conversationId, content || '[File]');

      // Increment unread if not the currently selected conversation
      if (conversationId !== selectedConversationId) {
        incrementUnread(conversationId);
      }
    };

    const handleMessagesRead = (data: IMessagesReadEvent) => {
      markMessagesRead(data.conversationId, data.readBy);
    };

    const handleUserTyping = (data: ITypingEvent) => {
      setTypingUser(data.conversationId, data.userId);
    };

    const handleUserStopTyping = (data: ITypingEvent) => {
      removeTypingUser(data.conversationId, data.userId);
    };

    const handleError = (data: { message?: string }) => {
      useSocketStore.setState({ error: data?.message || 'An error occurred' });
    };

    socketOnEvent('new_message', handleNewMessage);
    socketOnEvent('messages_read', handleMessagesRead);
    socketOnEvent('user_typing', handleUserTyping);
    socketOnEvent('user_stop_typing', handleUserStopTyping);
    socketOnEvent('error', handleError);

    return () => {
      socketOffEvent('new_message', handleNewMessage);
      socketOffEvent('messages_read', handleMessagesRead);
      socketOffEvent('user_typing', handleUserTyping);
      socketOffEvent('user_stop_typing', handleUserStopTyping);
      socketOffEvent('error', handleError);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connected, selectedConversationId]);

  // ------------------------------------------------------------------
  // Join/Leave conversation on selection change
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!connected) return;

    const prevId = previousConversationRef.current;

    // Leave previous conversation
    if (prevId && prevId !== selectedConversationId) {
      socketEmit('leave_conversation', { conversationId: prevId });
    }

    // Join new conversation
    if (selectedConversationId && selectedConversationId !== prevId) {
      socketEmit('join_conversation', { conversationId: selectedConversationId });
    }

    previousConversationRef.current = selectedConversationId;
  }, [connected, selectedConversationId, socketEmit]);

  // ------------------------------------------------------------------
  // Handle ?startupId= deep-link for group chat
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!startupId || startupHandledRef.current || !token) return;

    startupHandledRef.current = true;

    const createOrGetGroupConversation = async () => {
      try {
        // First, check if a group conversation for this startup already exists
        const existingConv = conversations.find(
          (c) => c.type === 'group' && c.startupId === startupId
        );

        if (existingConv) {
          selectConversation(existingConv._id);
          if (isMobile) {
            setMobilePanel('messages');
          }
          return;
        }

        // Fetch startup members to provide participantIds
        const membersResponse = await axios.get(`/api/startups/${startupId}/members`);
        const members = membersResponse.data || [];
        const participantIds = members.map((m: any) => m.userId).filter(Boolean);

        // Include current user if not already in the list
        if (_currentUserId && !participantIds.includes(_currentUserId)) {
          participantIds.push(_currentUserId);
        }

        const response = await axios.post('/api/chat/conversations/group', {
          startupId,
          participantIds,
        });
        const conversation = response.data;

        if (conversation?._id) {
          // Revalidate the conversation list so the new group appears
          mutate('/api/chat/conversations');

          selectConversation(conversation._id);
          if (isMobile) {
            setMobilePanel('messages');
          }
        }
      } catch (error) {
        console.error('Failed to create/get group conversation:', error);
        toast.error('Failed to open group conversation. Please try again.');
      }
    };

    createOrGetGroupConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startupId, token]);

  // ------------------------------------------------------------------
  // Handle ?userId= deep-link for direct chat
  // ------------------------------------------------------------------
  useEffect(() => {
    if (!targetUserId || userIdHandledRef.current || !token) return;
    // Don't open a conversation with yourself
    if (targetUserId === _currentUserId) return;

    userIdHandledRef.current = true;

    const createOrGetDirectConversation = async () => {
      try {
        const response = await axios.post('/api/chat/conversations/direct', {
          targetUserId,
        });
        const conversation = response.data;

        if (conversation?._id) {
          // Revalidate the conversation list so it appears
          mutate('/api/chat/conversations');

          selectConversation(conversation._id);
          if (isMobile) {
            setMobilePanel('messages');
          }
        }
      } catch (error) {
        console.error('Failed to create/get direct conversation:', error);
        toast.error('Failed to open conversation. Please try again.');
      }
    };

    createOrGetDirectConversation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetUserId, token]);

  // ------------------------------------------------------------------
  // Conversation selection handler
  // ------------------------------------------------------------------
  const handleSelectConversation = useCallback(
    (id: string) => {
      selectConversation(id);
      resetUnread(id);
      if (isMobile) {
        setMobilePanel('messages');
      }
    },
    [selectConversation, resetUnread, isMobile]
  );

  // ------------------------------------------------------------------
  // Mobile navigation helpers
  // ------------------------------------------------------------------
  const handleBackToList = useCallback(() => {
    setMobilePanel('list');
  }, []);

  const handleShowContact = useCallback(() => {
    setMobilePanel('contact');
  }, []);

  const handleBackToMessages = useCallback(() => {
    setMobilePanel('messages');
  }, []);

  // ------------------------------------------------------------------
  // Manual reconnect handler
  // ------------------------------------------------------------------
  const handleReconnect = useCallback(() => {
    if (token) {
      socketConnect(token);
    }
  }, [token, socketConnect]);

  // ------------------------------------------------------------------
  // Get selected conversation type for ContactInfoPanel
  // ------------------------------------------------------------------
  const selectedConversationType =
    conversations.find((c) => c._id === selectedConversationId)?.type || 'direct';

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  // Connection status banners
  const renderStatusBanner = () => {
    if (reconnecting) {
      return (
        <Alert severity="warning" sx={{ borderRadius: 0 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            Reconnecting to chat...
            <LinearProgress sx={{ flex: 1, maxWidth: 120 }} />
          </Box>
        </Alert>
      );
    }

    if (socketError) {
      return (
        <Alert
          severity="error"
          sx={{ borderRadius: 0 }}
          action={
            <Button color="inherit" size="small" onClick={handleReconnect}>
              Reconnect
            </Button>
          }
        >
          {socketError}
        </Alert>
      );
    }

    if (!connected && token) {
      return (
        <Alert severity="info" sx={{ borderRadius: 0 }}>
          Connecting to chat...
        </Alert>
      );
    }

    return null;
  };

  // --- Mobile Layout ---
  if (isMobile) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        {renderStatusBanner()}

        {mobilePanel === 'list' && (
          <Box sx={{ flex: 1, overflow: 'hidden' }}>
            <ConversationListPanel
              onSelectConversation={handleSelectConversation}
              selectedId={selectedConversationId}
            />
          </Box>
        )}

        {mobilePanel === 'messages' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Mobile message header with back and info buttons */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: 1,
                py: 0.5,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <IconButton onClick={handleBackToList} aria-label="Back to conversations">
                <Iconify icon="eva:arrow-back-fill" />
              </IconButton>
              <IconButton onClick={handleShowContact} aria-label="View contact info">
                <Iconify icon="eva:info-outline" />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <MessageArea conversationId={selectedConversationId} />
            </Box>
          </Box>
        )}

        {mobilePanel === 'contact' && (
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
            {/* Mobile contact header with back button */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1,
                py: 0.5,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <IconButton onClick={handleBackToMessages} aria-label="Back to messages">
                <Iconify icon="eva:arrow-back-fill" />
              </IconButton>
            </Box>

            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <ContactInfoPanel
                conversationId={selectedConversationId}
                conversationType={selectedConversationType}
              />
            </Box>
          </Box>
        )}
      </Box>
    );
  }

  // --- Desktop Layout (three-panel) ---
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {renderStatusBanner()}

      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Panel — Conversation List */}
        <Box
          sx={{
            width: 320,
            flexShrink: 0,
            borderRight: 1,
            borderColor: 'divider',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ConversationListPanel
            onSelectConversation={handleSelectConversation}
            selectedId={selectedConversationId}
          />
        </Box>

        {/* Center Panel — Message Area */}
        <Box
          sx={{
            flex: 1,
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <MessageArea conversationId={selectedConversationId} />
        </Box>

        {/* Right Panel — Contact Info */}
        <Box
          sx={{
            width: 280,
            flexShrink: 0,
            borderLeft: 1,
            borderColor: 'divider',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ContactInfoPanel
            conversationId={selectedConversationId}
            conversationType={selectedConversationType}
          />
        </Box>
      </Box>
    </Box>
  );
}
