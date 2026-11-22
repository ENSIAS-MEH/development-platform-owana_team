import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

import type { IConversation } from 'src/types/chat';

// ----------------------------------------------------------------------

dayjs.extend(relativeTime);

// ----------------------------------------------------------------------

const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/gif',
  'image/webp',
  'audio/mpeg',
  'audio/wav',
  'audio/ogg',
  'application/pdf',
  'video/mp4',
]);

// ----------------------------------------------------------------------

/**
 * Truncates a text string to 50 characters with ellipsis ("...") if it exceeds 50 chars.
 * Returns the original string unchanged if it is 50 characters or fewer.
 */
export function truncatePreview(text: string): string {
  if (text.length <= 50) return text;
  return `${text.slice(0, 50)}...`;
}

// ----------------------------------------------------------------------

/**
 * Formats a message timestamp as relative (e.g., "2m", "1h", "3d") for dates less than 7 days old,
 * or as absolute short date (e.g., "12 Jan") for dates 7 or more days old.
 */
export function formatMessageTime(date: string | Date): string {
  const now = dayjs();
  const target = dayjs(date);
  const diffInDays = now.diff(target, 'day');

  if (diffInDays < 7) {
    const diffInMinutes = now.diff(target, 'minute');
    const diffInHours = now.diff(target, 'hour');

    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${diffInDays}d`;
  }

  return target.format('DD MMM');
}

// ----------------------------------------------------------------------

/**
 * Formats an unread message count for display as a badge.
 * Returns "99+" for counts > 99, the string count for 1-99, and null for 0.
 */
export function formatUnreadBadge(count: number): string | null {
  if (count <= 0) return null;
  if (count > 99) return '99+';
  return String(count);
}

// ----------------------------------------------------------------------

/**
 * Filters conversations by a case-insensitive substring match on participant name or startup name.
 * Uses the provided `getUserName` function to resolve participant IDs to display names.
 */
export function filterConversations(
  conversations: IConversation[],
  query: string,
  getUserName: (id: string) => string
): IConversation[] {
  const lowerQuery = query.toLowerCase();

  return conversations.filter((conversation) => {
    // Check participant names
    const participantMatch = conversation.participants.some((participantId) => {
      const name = getUserName(participantId);
      return name.toLowerCase().includes(lowerQuery);
    });

    if (participantMatch) return true;

    // Check startup name for group conversations
    if (conversation.startupId) {
      const startupName = getUserName(conversation.startupId);
      return startupName.toLowerCase().includes(lowerQuery);
    }

    return false;
  });
}

// ----------------------------------------------------------------------

/**
 * Validates that message content is between 1 and 5000 characters after trimming whitespace.
 */
export function validateMessageContent(content: string): boolean {
  const trimmed = content.trim();
  return trimmed.length >= 1 && trimmed.length <= 5000;
}

// ----------------------------------------------------------------------

/**
 * Validates that a file MIME type is in the allowed set for chat attachments.
 */
export function validateFileMimeType(mimeType: string): boolean {
  return ALLOWED_MIME_TYPES.has(mimeType);
}

// ----------------------------------------------------------------------

/**
 * Formats a typing indicator string showing up to 3 names.
 * If more than 3 users are typing, shows the first 3 names and a "+N" suffix for the remainder.
 */
export function formatTypingIndicator(names: string[]): string {
  if (names.length === 0) return '';
  if (names.length <= 3) return names.join(', ');
  const displayed = names.slice(0, 3).join(', ');
  return `${displayed} +${names.length - 3}`;
}
