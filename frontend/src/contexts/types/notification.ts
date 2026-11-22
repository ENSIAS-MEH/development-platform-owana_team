import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';

import type { IAbonnementSubscribers } from './common';

export type INotificationFilters = {
  title: string;
  type: string;
  startDate?: any;
  endDate?: any;
  status: string;
  channel: string;
};


export interface INotificationType {
  id: string;
  title: string;
  type: string; // Information, Promotionnel, Rappel, Alerte
  status: string; // Envoyée, En attente, Échouée
  recipients: IAbonnementSubscribers[] | { name: string; count: number };
  content: string;
  sentDate: string;
  channel: string[]; // Email, SMS, Push
  createdAt: string;
  updatedAt: string;
  link?: string; // lien optionnel
  viewed: boolean; // Read or Not
  favorite?: boolean;
  archived? : boolean;
  icon?: IconDefinition;
  referenceId?: string | null; // postId for LIKE/COMMENT notifications


  scheduledDate?: Date | null;
  scheduledTime?: Date | null;
  frequency?: string; // immediate, daily, weekly
  retrySettings?: {
    retryCount: number;
    alertRecipients: {
      administrators: boolean;
      supportTeam: boolean;
      affectedUser: boolean;
    };
  };
  attachments?: File[];
}
