import type { IStartupItem, IStartupSortOption, IStartupMemberResolved } from 'src/types/startup';

// ----------------------------------------------------------------------

export function applySort(items: IStartupItem[], sortOption: IStartupSortOption): IStartupItem[] {
  const sorted = [...items];
  sorted.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOption === 'latest' ? dateB - dateA : dateA - dateB;
  });
  return sorted;
}

export function getCardImageSlots(
  photos: { photoUrl: string }[],
  logoUrl: string | null
): { url: string; isPlaceholder: boolean }[] {
  const slots: { url: string; isPlaceholder: boolean }[] = [];
  const available = photos.map((p) => p.photoUrl);

  if (available.length === 0 && logoUrl) {
    available.push(logoUrl);
  }

  for (let i = 0; i < 3; i++) {
    if (i < available.length) {
      slots.push({ url: available[i], isPlaceholder: false });
    } else {
      slots.push({ url: '/assets/placeholder.svg', isPlaceholder: true });
    }
  }

  return slots;
}

export function truncateText(text: string, maxLength: number): string {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}...`;
}

export function getGallerySlots(photos: { photoUrl: string }[]): {
  cover: string | null;
  thumbnails: string[];
  moreCount: number;
} {
  if (photos.length === 0) {
    return { cover: null, thumbnails: [], moreCount: 0 };
  }

  const cover = photos[0].photoUrl;
  const thumbnails = photos.slice(1, 5).map((p) => p.photoUrl);
  const moreCount = Math.max(0, photos.length - 5);

  return { cover, thumbnails, moreCount };
}

export function shouldShowSection(value: string | null | undefined): boolean {
  if (!value) return false;
  return value.trim().length > 0;
}

export function validateReportReason(text: string): { valid: boolean; error?: string } {
  const trimmed = text.trim();
  if (trimmed.length < 10) {
    return { valid: false, error: 'Reason must be at least 10 characters' };
  }
  if (trimmed.length > 500) {
    return { valid: false, error: 'Reason must not exceed 500 characters' };
  }
  return { valid: true };
}

export function getInitials(firstName: string, lastName: string): string {
  const first = firstName?.charAt(0)?.toUpperCase() || '';
  const last = lastName?.charAt(0)?.toUpperCase() || '';
  return `${first}${last}`;
}

export function getRoleLabel(role: 'FOUNDER' | 'CO_FOUNDER'): string {
  if (role === 'FOUNDER') return 'Founder';
  if (role === 'CO_FOUNDER') return 'Co-Founder';
  return role;
}

export function sortMembers(members: IStartupMemberResolved[]): IStartupMemberResolved[] {
  return [...members].sort((a, b) => {
    // FOUNDER first
    if (a.startupRole === 'FOUNDER' && b.startupRole !== 'FOUNDER') return -1;
    if (a.startupRole !== 'FOUNDER' && b.startupRole === 'FOUNDER') return 1;

    // Same role: alphabetical by full name (case-insensitive)
    const nameA = `${a.firstName} ${a.lastName}`.toLowerCase();
    const nameB = `${b.firstName} ${b.lastName}`.toLowerCase();
    return nameA.localeCompare(nameB);
  });
}
