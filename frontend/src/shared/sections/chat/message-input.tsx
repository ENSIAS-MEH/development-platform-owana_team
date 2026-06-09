'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import axiosInstance from 'src/utils/axios';

import { useSocketStore } from 'src/shared/api/stores/socketStore';
import { Iconify } from 'src/shared/components/iconify';
import { toast } from 'src/shared/components/snackbar';

import type { IUploadResponse } from 'src/types/chat';

import { validateFileMimeType, validateMessageContent } from './utils/chat-utils';

// ----------------------------------------------------------------------

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'application/pdf',
  'video/mp4',
];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
const MAX_MESSAGE_LENGTH = 5000;
const TYPING_THROTTLE_MS = 2000;
const SEND_TIMEOUT_MS = 10000;

// ----------------------------------------------------------------------

type Props = {
  conversationId: string;
  disabled: boolean;
};

export function MessageInput({ conversationId, disabled }: Props) {
  const [message, setMessage] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [sendError, setSendError] = useState(false);
  const [failedPayload, setFailedPayload] = useState<Record<string, unknown> | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTypingEmitRef = useRef<number>(0);

  const emit = useSocketStore((state) => state.emit);

  // Clean up typing timer on unmount or conversation change
  useEffect(
    () => () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    },
    [conversationId]
  );

  // --- Typing indicator logic ---

  const emitTypingStop = useCallback(() => {
    emit('typing_stop', { conversationId });
    lastTypingEmitRef.current = 0;
  }, [conversationId, emit]);

  const handleTyping = useCallback(() => {
    const now = Date.now();

    // Throttle: emit typing_start at most once per 2s
    if (now - lastTypingEmitRef.current >= TYPING_THROTTLE_MS) {
      emit('typing_start', { conversationId });
      lastTypingEmitRef.current = now;
    }

    // Reset the idle timer — emit typing_stop after 2s idle
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }
    typingTimerRef.current = setTimeout(() => {
      emitTypingStop();
    }, TYPING_THROTTLE_MS);
  }, [conversationId, emit, emitTypingStop]);

  // --- Message change handler ---

  const handleMessageChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setMessage(event.target.value);
      setSendError(false);
      handleTyping();
    },
    [handleTyping]
  );

  // --- Send message ---

  const sendMessagePayload = useCallback(
    (payload: Record<string, unknown>) => {
      setSendError(false);
      setFailedPayload(null);
      emit('send_message', payload);
    },
    [emit]
  );

  const handleSendText = useCallback(() => {
    const trimmed = message.trim();
    if (!validateMessageContent(trimmed)) return;

    // Stop typing indicator on submit
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    emitTypingStop();

    const payload = { conversationId, content: trimmed };
    sendMessagePayload(payload);
    setMessage('');
  }, [message, conversationId, sendMessagePayload, emitTypingStop]);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        handleSendText();
      }
    },
    [handleSendText]
  );

  // --- Retry logic ---

  const handleRetry = useCallback(() => {
    if (failedPayload) {
      sendMessagePayload(failedPayload);
    }
  }, [failedPayload, sendMessagePayload]);

  // --- File upload ---

  const handleAttachmentClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileSelect = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Reset input for re-selection
      event.target.value = '';

      // Validate MIME type
      if (!validateFileMimeType(file.type)) {
        toast.error('File type not supported');
        return;
      }

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        toast.error('File too large (max 20MB)');
        return;
      }

      // Upload the file
      setUploading(true);
      setUploadProgress(0);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await axiosInstance.post<IUploadResponse>('/api/chat/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          onUploadProgress: (progressEvent) => {
            if (progressEvent.total) {
              const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
              setUploadProgress(percent);
            }
          },
        });

        const { fileUrl, fileType, fileName } = response.data;

        // Send message with file
        const payload = { conversationId, fileUrl, fileType, fileName };
        sendMessagePayload(payload);
      } catch (error) {
        toast.error('File upload failed. Please try again.');
      } finally {
        setUploading(false);
        setUploadProgress(0);
      }
    },
    [conversationId, sendMessagePayload]
  );

  // --- Derived state ---

  const trimmedLength = message.trim().length;
  const isOverLimit = trimmedLength > MAX_MESSAGE_LENGTH;
  const isValidMessage = trimmedLength >= 1 && trimmedLength <= MAX_MESSAGE_LENGTH;
  const isSendDisabled = disabled || !isValidMessage || uploading;

  return (
    <Stack sx={{ px: 2, pb: 2 }}>
      {/* Upload progress */}
      {uploading && (
        <Box sx={{ width: '100%', mb: 1 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5 }}>
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      )}

      {/* Send error with retry */}
      {sendError && (
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
          <Typography variant="caption" color="error.main">
            Message failed to send.
          </Typography>
          <Button size="small" color="error" onClick={handleRetry}>
            Retry
          </Button>
        </Stack>
      )}

      {/* Input area */}
      <Stack direction="row" alignItems="flex-end" spacing={1}>
        {/* Attachment button */}
        <IconButton
          size="small"
          onClick={handleAttachmentClick}
          disabled={disabled || uploading}
          aria-label="Attach file"
        >
          <Iconify icon="eva:attach-2-fill" />
        </IconButton>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_MIME_TYPES.join(',')}
          hidden
          onChange={handleFileSelect}
        />

        {/* Text input */}
        <TextField
          fullWidth
          multiline
          maxRows={4}
          size="small"
          placeholder="Type a message..."
          value={message}
          onChange={handleMessageChange}
          onKeyDown={handleKeyDown}
          disabled={disabled || uploading}
          InputProps={{
            sx: { py: 1 },
          }}
        />

        {/* Send button */}
        <IconButton
          size="small"
          color="primary"
          onClick={handleSendText}
          disabled={isSendDisabled}
          aria-label="Send message"
        >
          <Iconify icon="eva:paper-plane-fill" />
        </IconButton>
      </Stack>

    </Stack>
  );
}
