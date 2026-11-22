import { GATEWAY_API_URL } from 'src/config-global';

const BASE = `${GATEWAY_API_URL}/api/notifications`;

export const notificationFeedEndpoints = {
  list:        (userId: string) => `${BASE}/${userId}`,
  unreadCount: (userId: string) => `${BASE}/${userId}/unread/count`,
  markRead:    (id: string)     => `${BASE}/${id}/read`,
  markAllRead: (userId: string) => `${BASE}/${userId}/read-all`,
  delete:      (id: string)     => `${BASE}/${id}`,
};
