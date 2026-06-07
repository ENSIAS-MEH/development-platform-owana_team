'use client';

import { useState } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DoneIcon from '@mui/icons-material/Done';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

import type { IMessage } from 'src/types/chat';

import { formatMessageTime } from './utils/chat-utils';

// ----------------------------------------------------------------------

type MessageBubbleProps = {
  message: IMessage;
  isOwn: boolean;
  isGroup: boolean;
  senderName?: string;
  senderAvatar?: string;
};

// ----------------------------------------------------------------------

export function MessageBubble({ message, isOwn, isGroup, senderName, senderAvatar }: MessageBubbleProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: isOwn ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 1,
        mb: 1.5,
      }}
    >
      {/* Avatar for received messages in group conversations */}
      {!isOwn && isGroup && (
        <Avatar
          src={senderAvatar}
          alt={senderName}
          sx={{ width: 32, height: 32 }}
        />
      )}

      <Box sx={{ maxWidth: '70%' }}>
        {/* Sender name in group conversations */}
        {!isOwn && isGroup && senderName && (
          <Typography variant="caption" sx={{ ml: 1, mb: 0.25, display: 'block', color: 'text.secondary' }}>
            {senderName}
          </Typography>
        )}

        {/* Bubble container */}
        <Box
          sx={{
            px: 2,
            py: 1,
            borderRadius: 2,
            bgcolor: isOwn ? 'primary.main' : 'grey.200',
            color: isOwn ? 'primary.contrastText' : 'text.primary',
            position: 'relative',
          }}
        >
          {/* File content rendering */}
          {message.fileUrl && message.fileType && (
            <FileContent message={message} isOwn={isOwn} />
          )}

          {/* Text content */}
          {message.content && (
            <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
              {message.content}
            </Typography>
          )}

          {/* Timestamp and read receipt row */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 0.5,
              mt: 0.5,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: '0.65rem',
                opacity: 0.7,
                color: isOwn ? 'primary.contrastText' : 'text.secondary',
              }}
            >
              {formatMessageTime(message.createdAt)}
            </Typography>

            {/* Read receipts: only for own messages in direct conversations */}
            {isOwn && !isGroup && (
              <ReadReceiptIcon readBy={message.readBy} senderId={message.senderId} isOwn={isOwn} />
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

// ----------------------------------------------------------------------

type FileContentProps = {
  message: IMessage;
  isOwn: boolean;
};

function FileContent({ message, isOwn }: FileContentProps) {
  const { fileUrl, fileType, fileName } = message;

  if (!fileUrl || !fileType) return null;

  switch (fileType) {
    case 'image':
      return <ImageThumbnail fileUrl={fileUrl} fileName={fileName} />;
    case 'audio':
      return <AudioPlayer fileUrl={fileUrl} />;
    case 'video':
      return <VideoPlayer fileUrl={fileUrl} />;
    case 'pdf':
    case 'file':
      return <FileDownloadLink fileUrl={fileUrl} fileName={fileName} isOwn={isOwn} />;
    default:
      return null;
  }
}

// ----------------------------------------------------------------------

type ImageThumbnailProps = {
  fileUrl: string;
  fileName: string | null;
};

function ImageThumbnail({ fileUrl, fileName }: ImageThumbnailProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Box
        component="img"
        src={fileUrl}
        alt={fileName || 'Image'}
        onClick={() => setOpen(true)}
        sx={{
          maxWidth: 240,
          width: '100%',
          height: 'auto',
          borderRadius: 1,
          cursor: 'pointer',
          display: 'block',
          mb: 0.5,
        }}
      />

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="lg">
        <Box
          component="img"
          src={fileUrl}
          alt={fileName || 'Image'}
          sx={{ maxWidth: '90vw', maxHeight: '90vh', display: 'block' }}
        />
      </Dialog>
    </>
  );
}

// ----------------------------------------------------------------------

type AudioPlayerProps = {
  fileUrl: string;
};

function AudioPlayer({ fileUrl }: AudioPlayerProps) {
  return (
    <Box sx={{ mb: 0.5, minWidth: 200 }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio controls preload="metadata" style={{ width: '100%', maxWidth: 280 }}>
        <source src={fileUrl} />
        Your browser does not support the audio element.
      </audio>
    </Box>
  );
}

// ----------------------------------------------------------------------

type VideoPlayerProps = {
  fileUrl: string;
};

function VideoPlayer({ fileUrl }: VideoPlayerProps) {
  return (
    <Box sx={{ mb: 0.5, maxWidth: 320 }}>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video controls preload="metadata" style={{ width: '100%', borderRadius: 4 }}>
        <source src={fileUrl} />
        Your browser does not support the video element.
      </video>
    </Box>
  );
}

// ----------------------------------------------------------------------

type FileDownloadLinkProps = {
  fileUrl: string;
  fileName: string | null;
  isOwn: boolean;
};

function FileDownloadLink({ fileUrl, fileName, isOwn }: FileDownloadLinkProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        p: 1,
        mb: 0.5,
        borderRadius: 1,
        bgcolor: isOwn ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.04)',
      }}
    >
      <InsertDriveFileIcon sx={{ fontSize: 28, opacity: 0.7 }} />

      <Typography variant="body2" sx={{ flex: 1, wordBreak: 'break-word' }}>
        {fileName || 'File'}
      </Typography>

      <IconButton
        component="a"
        href={fileUrl}
        download={fileName || true}
        target="_blank"
        rel="noopener noreferrer"
        size="small"
        sx={{ color: isOwn ? 'primary.contrastText' : 'text.secondary' }}
        aria-label={`Download ${fileName || 'file'}`}
      >
        <DownloadIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}

// ----------------------------------------------------------------------

type ReadReceiptIconProps = {
  readBy: string[];
  senderId: string;
  isOwn: boolean;
};

function ReadReceiptIcon({ readBy, senderId, isOwn }: ReadReceiptIconProps) {
  // If readBy contains someone other than the sender, the message has been read
  const isRead = readBy.some((userId) => userId !== senderId);

  if (isRead) {
    return (
      <DoneAllIcon
        sx={{ fontSize: 14, color: isOwn ? 'primary.contrastText' : 'info.main' }}
        aria-label="Read"
      />
    );
  }

  return (
    <DoneIcon
      sx={{ fontSize: 14, opacity: 0.7, color: isOwn ? 'primary.contrastText' : 'text.secondary' }}
      aria-label="Sent"
    />
  );
}
