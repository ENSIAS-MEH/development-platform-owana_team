import { 
  faBell, 
  faInfoCircle, 
  faCheckCircle,
  faExclamationTriangle
} from '@fortawesome/free-solid-svg-icons';

import { _mock } from './_mock';

const getIconForNotificationType = (type: string) => {
  switch(type) {
    case 'information':
      return faInfoCircle;
    case 'promotional':
      return faBell;
    case 'reminder':
      return faCheckCircle;
    case 'alert':
      return faExclamationTriangle;
    default:
      return faBell;
  }
};

const getColorForNotificationType = (type: string) => {
  switch(type) {
    case 'information':
      return 'info.main';
    case 'promotional':
      return 'primary.main';
    case 'reminder':
      return 'success.main';
    case 'alert':
      return 'error.main';
    default:
      return 'primary.main';
  }
};

export const NOTIFICATION_TYPE_OPTIONS = [
  { label: 'Information', value: 'information' },
  { label: 'Promotionnel', value: 'promotional' },
  { label: 'Rappel', value: 'reminder' },
  { label: 'Alerte', value: 'alert' },
];

export const NOTIFICATION_STATUS_OPTIONS = [
  { label: 'Envoyée', value: 'sent' },
  { label: 'En attente', value: 'pending' },
  { label: 'Échouée', value: 'failed' },
];

export const NOTIFICATION_CHANNEL_OPTIONS = [
  { label: 'Email', value: 'email' },
  { label: 'SMS', value: 'sms' },
  { label: 'Push', value: 'push' },
];

const SUBSCRIBER_GROUPS = [
  { id: _mock.id(1), name: 'Tous les utilisateurs', count: 1250 },
  { id: _mock.id(2), name: 'Utilisateurs Premium', count: 478 },
  { id: _mock.id(3), name: 'Abonnés Newsletter', count: 892 },
  { id: _mock.id(4), name: 'Jean Dupont', count: 1 },
];

// Lien par default
const DEFAULT_LINK = '/dashboard/profile/notifications/';

export const _notifications = [...Array(15)].map((_, index) => {
  const type = NOTIFICATION_TYPE_OPTIONS[index % NOTIFICATION_TYPE_OPTIONS.length].value;
  const status = NOTIFICATION_STATUS_OPTIONS[index % NOTIFICATION_STATUS_OPTIONS.length].value;
  
  let icon;
  switch(type) {
    case 'information':
      icon = faInfoCircle;
      break;
    case 'promotional':
      icon = faBell;
      break;
    case 'reminder':
      icon = faCheckCircle;
      break;
    case 'alert':
      icon = faExclamationTriangle;
      break;
    default:
      icon = faBell;
      break;
  }

  let title = '';
  switch(type) {
    case 'information':
      title = index % 2 === 0 ? 'Mise à jour de l\'application' : 'Nouveaux articles disponibles';
      break;
    case 'promotional':
      title = 'Promotion exclusive';
      break;
    case 'reminder':
      title = 'Rappel de rendez-vous';
      break;
    case 'alert':
      title = 'Alerte de sécurité';
      break;
    default:
      title = 'Notification';
      break;
  }
  
  let channel = [];
  if (index % 3 === 0) {
    channel = ['email', 'push'];
  } else if (index % 3 === 1) {
    channel = ['email', 'sms'];
  } else {
    channel = ['sms'];
  }

  const content = `Ceci est le contenu détaillé de la notification "${title}". Cette notification a été envoyée via ${channel.join(' et ')}.`;
  
  const hasLink = index % 3 === 0;
  const link = hasLink ? DEFAULT_LINK : undefined;

  return {
    id: _mock.id(index),
    title,
    type,
    status,
    recipients: SUBSCRIBER_GROUPS[index % SUBSCRIBER_GROUPS.length],
    content,
    sentDate: _mock.time(index),
    channel,
    createdAt: _mock.time(index - 2),
    updatedAt: _mock.time(index),
    link,
    viewed: index % 4 !== 0, 
    favorite: index % 5 === 0,
    icon,
  };
});