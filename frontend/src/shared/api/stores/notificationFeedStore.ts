import type { FeedNotification } from 'src/contexts/types/feed';

import { toast } from 'sonner';
import { create } from 'zustand';

import axiosInstance from 'src/utils/axios';

import { notificationFeedEndpoints } from '../endpoints/notifications-feed';

// ----------------------------------------------------------------------

type NotificationFeedState = {
  notifications: FeedNotification[];
  unreadCount: number;
  loading: boolean;
  pollingInterval: ReturnType<typeof setInterval> | null;

  // Actions
  fetchNotifications: (userId: string) => Promise<void>;
  fetchUnreadCount: (userId: string) => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  startPolling: (userId: string) => void;
  stopPolling: () => void;
};

// ----------------------------------------------------------------------

export const useNotificationFeedStore = create<NotificationFeedState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,
  pollingInterval: null,

  // ------------------------------------------------------------------ //
  // Fetch all notifications for a user
  // ------------------------------------------------------------------ //
  fetchNotifications: async (userId: string) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.get(notificationFeedEndpoints.list(userId));
      const rawNotifications = Array.isArray(response.data) ? response.data : [];
      // Map backend fields to frontend FeedNotification type
      const notifications: FeedNotification[] = rawNotifications.map((n: any) => ({
        id: n.id,
        userId: n.recipientId || userId,
        title: n.message || '',
        content: n.message || '',
        type: n.type || 'SYSTEM',
        read: n.isRead ?? n.read ?? false,
        createdAt: n.createdAt,
        referenceId: n.referenceId || null,
      }));
      set({ notifications, loading: false });
    } catch (error: any) {
      set({ loading: false });
    }
  },

  // ------------------------------------------------------------------ //
  // Fetch unread notification count
  // ------------------------------------------------------------------ //
  fetchUnreadCount: async (userId: string) => {
    try {
      const response = await axiosInstance.get(notificationFeedEndpoints.unreadCount(userId));
      // The response may be a plain number or an object { count: number }
      const count =
        typeof response.data === 'number' ? response.data : (response.data?.count ?? 0);
      set({ unreadCount: count });
    } catch (error: any) {
      // Maintain previous unreadCount — no toast needed for background polling
    }
  },

  // ------------------------------------------------------------------ //
  // Mark a single notification as read
  // ------------------------------------------------------------------ //
  markAsRead: async (notificationId: string) => {
    try {
      await axiosInstance.put(notificationFeedEndpoints.markRead(notificationId));
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error: any) {
      // Maintain previous state on error
      toast.error(error?.message || 'Erreur lors du marquage de la notification');
    }
  },

  // ------------------------------------------------------------------ //
  // Mark all notifications as read
  // ------------------------------------------------------------------ //
  markAllAsRead: async (userId: string) => {
    try {
      await axiosInstance.put(notificationFeedEndpoints.markAllRead(userId));
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      }));
    } catch (error: any) {
      // Maintain previous state on error
      toast.error(error?.message || 'Erreur lors du marquage de toutes les notifications');
    }
  },

  // ------------------------------------------------------------------ //
  // Delete a notification
  // ------------------------------------------------------------------ //
  deleteNotification: async (notificationId: string) => {
    try {
      await axiosInstance.delete(notificationFeedEndpoints.delete(notificationId));
      set((state) => {
        const removed = state.notifications.find((n) => n.id === notificationId);
        return {
          notifications: state.notifications.filter((n) => n.id !== notificationId),
          unreadCount:
            removed && !removed.read ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
        };
      });
    } catch (error: any) {
      // Maintain previous state on error
      toast.error(error?.message || 'Erreur lors de la suppression de la notification');
    }
  },

  // ------------------------------------------------------------------ //
  // Start polling unread count every 30 seconds
  // ------------------------------------------------------------------ //
  startPolling: (userId: string) => {
    // Guard: do not start a new interval if one is already running
    if (get().pollingInterval !== null) return;

    const interval = setInterval(() => {
      get().fetchUnreadCount(userId);
    }, 30_000);

    set({ pollingInterval: interval });
  },

  // ------------------------------------------------------------------ //
  // Stop polling
  // ------------------------------------------------------------------ //
  stopPolling: () => {
    const { pollingInterval } = get();
    if (pollingInterval !== null) {
      clearInterval(pollingInterval);
      set({ pollingInterval: null });
    }
  },
}));
