// Types for notification system

export type NotificationType = 'alert' | 'info' | 'warning' | 'success';

export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  isRead: boolean;
  isArchived: boolean;
  isFavorite: boolean;
  type: NotificationType;
}

export type TabType = 'system' | 'profile' | 'activity' | 'frequency' | 'channels';

export interface NotificationOption {
  id: string;
  title: string;
  description: string;
  enabled: boolean;
  category: TabType;
}

export interface SettingsState {
  system: {
    systemUpdates: boolean;
    roleChanges: boolean;
    securityAlerts: boolean;
  };
  profile: {
    profileChanges: boolean;
    newDeviceLogin: boolean;
  };
  activity: {
    pendingRequests: boolean;
  };
  frequency: {
    type: 'realtime' | 'daily' | 'weekly';
    dailyTime: Date | null;
    weeklyDay: number;
    weeklyTime: Date | null;
  };
  channels: {
    email: boolean;
    sms: boolean;
    internal: boolean;
  };
}

export interface NotificationFilterState {
  activeTab: 'all' | 'unread' | 'read' | 'favorites' | 'archived';
  search: string;
}
