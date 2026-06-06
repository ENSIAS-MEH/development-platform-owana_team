// Import des fonctions nécessaires de date-fns
import { sub, formatDistanceToNow } from 'date-fns';

// Définition du type pour les notifications
export interface Notification {
  id: string;
  title: string;
  description: string;
  createdAt: Date;
  isRead: boolean;
  isArchived: boolean;
  isFavorite: boolean; // Ajout de la propriété isFavorite
  type: 'alert' | 'info' | 'warning' | 'success';
}

// Fonction pour formater les dates
export const fToNow = (date: Date) =>
  formatDistanceToNow(date, {
    addSuffix: true,
  });

// Données d'exemple des notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Alerte de sécurité',
    description: 'Une connexion a été détectée depuis un nouvel appareil (Windows, Chrome) à Paris, France.',
    createdAt: sub(new Date(), { minutes: 35 }),
    isRead: false,
    isArchived: false,
    isFavorite: false, // Ajout de la propriété isFavorite
    type: 'alert'
  },
  {
    id: '2',
    title: 'Mise à jour du système',
    description: 'Le système a été mis à jour vers la version 2.3.0. Consultez les nouvelles fonctionnalités.',
    createdAt: sub(new Date(), { hours: 2 }),
    isRead: true,
    isArchived: false,
    isFavorite: true,
    type: 'info'
  },
  {
    id: '3',
    title: 'Nouvel utilisateur',
    description: 'Un nouvel utilisateur a rejoint votre équipe. Bienvenue à Sarah Martin!',
    createdAt: sub(new Date(), { days: 1 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'success'
  },
  {
    id: '4',
    title: 'Maintenance prévue',
    description: 'Une maintenance est prévue le 15/03 à 22h00. Le système sera indisponible pendant 2 heures.',
    createdAt: sub(new Date(), { days: 2 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'warning'
  },
  {
    id: '5',
    title: 'Rapport mensuel',
    description: 'Votre rapport d\'activité du mois de février est disponible. Cliquez pour le consulter.',
    createdAt: sub(new Date(), { days: 5 }),
    isRead: true,
    isArchived: true,
    isFavorite: false,
    type: 'info'
  },
  {
    id: '6',
    title: 'Nouveau message',
    description: 'Vous avez reçu un nouveau message de l\'administrateur concernant votre dernier projet.',
    createdAt: sub(new Date(), { days: 3 }),
    isRead: false,
    isArchived: false,
    isFavorite: true,
    type: 'info'
  },
  {
    id: '7',
    title: 'Échéance imminente',
    description: 'Le projet "Implémentation du module de paiement" atteindra son échéance dans 3 jours.',
    createdAt: sub(new Date(), { days: 4 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'warning'
  },
  {
    id: '8',
    title: 'Compte bloqué',
    description: 'Le compte de l\'utilisateur Thomas Durand a été temporairement bloqué après plusieurs tentatives infructueuses.',
    createdAt: sub(new Date(), { weeks: 1 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'alert'
  },
  {
    id: '9',
    title: 'Objectif atteint',
    description: 'Félicitations ! Votre équipe a atteint l\'objectif mensuel de 200 nouveaux utilisateurs.',
    createdAt: sub(new Date(), { weeks: 1, days: 2 }),
    isRead: true,
    isArchived: true,
    isFavorite: true,
    type: 'success'
  },
  {
    id: '10',
    title: 'Mise à jour de sécurité',
    description: 'Une mise à jour critique de sécurité a été déployée. Veuillez redémarrer votre application.',
    createdAt: sub(new Date(), { weeks: 2 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert'
  }
];

// Pour une utilisation avec la pagination
export const MOCK_NOTIFICATIONS_TOTAL_COUNT = MOCK_NOTIFICATIONS.length;