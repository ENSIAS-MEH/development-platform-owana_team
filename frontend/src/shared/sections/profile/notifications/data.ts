import { sub, formatDistanceToNow } from 'date-fns';

import type { Notification, NotificationOption } from './type';

// Fonction pour formater les dates
export const fToNow = (date: Date) =>
  formatDistanceToNow(date, {
    addSuffix: true,
  });

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: '1',
    title: 'Alerte de sécurité',
    description:
      'Une connexion a été détectée depuis un nouvel appareil (Windows, Chrome) à Paris, France.',
    createdAt: sub(new Date(), { minutes: 35 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
  {
    id: '2',
    title: 'Mise à jour du système',
    description:
      'Le système a été mis à jour vers la version 2.3.0. Consultez les nouvelles fonctionnalités.',
    createdAt: sub(new Date(), { hours: 2 }),
    isRead: true,
    isArchived: false,
    isFavorite: true,
    type: 'info',
  },
  {
    id: '3',
    title: 'Nouvel utilisateur',
    description: 'Un nouvel utilisateur a rejoint votre équipe. Bienvenue à Sarah Martin!',
    createdAt: sub(new Date(), { days: 1 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'success',
  },
  {
    id: '4',
    title: 'Maintenance prévue',
    description:
      'Une maintenance est prévue le 15/03 à 22h00. Le système sera indisponible pendant 2 heures.',
    createdAt: sub(new Date(), { days: 2 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'warning',
  },
  {
    id: '5',
    title: 'Rapport mensuel',
    description:
      "Votre rapport d'activité du mois de février est disponible. Cliquez pour le consulter.",
    createdAt: sub(new Date(), { days: 5 }),
    isRead: true,
    isArchived: true,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '6',
    title: 'Nouveau message',
    description:
      "Vous avez reçu un nouveau message de l'administrateur concernant votre dernier projet.",
    createdAt: sub(new Date(), { days: 3 }),
    isRead: false,
    isArchived: false,
    isFavorite: true,
    type: 'info',
  },
  {
    id: '7',
    title: 'Échéance imminente',
    description:
      'Le projet "Implémentation du module de paiement" atteindra son échéance dans 3 jours.',
    createdAt: sub(new Date(), { days: 4 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'warning',
  },
  {
    id: '8',
    title: 'Compte bloqué',
    description:
      "Le compte de l'utilisateur Thomas Durand a été temporairement bloqué après plusieurs tentatives infructueuses.",
    createdAt: sub(new Date(), { weeks: 1 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
  {
    id: '9',
    title: 'Objectif atteint',
    description:
      "Félicitations ! Votre équipe a atteint l'objectif mensuel de 200 nouveaux utilisateurs.",
    createdAt: sub(new Date(), { weeks: 1, days: 2 }),
    isRead: true,
    isArchived: true,
    isFavorite: true,
    type: 'success',
  },
  {
    id: '10',
    title: 'Mise à jour de sécurité',
    description:
      'Une mise à jour critique de sécurité a été déployée. Veuillez redémarrer votre application.',
    createdAt: sub(new Date(), { weeks: 2 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },

  // Additional notifications (11-30)
  {
    id: '11',
    title: 'Nouveau commentaire',
    description:
      'Jean Dupont a commenté votre dernier document partagé "Proposition commerciale Q2".',
    createdAt: sub(new Date(), { hours: 5 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '12',
    title: 'Demande de congés approuvée',
    description: 'Votre demande de congés du 15/05 au 22/05 a été approuvée par le service RH.',
    createdAt: sub(new Date(), { days: 1, hours: 3 }),
    isRead: true,
    isArchived: false,
    isFavorite: true,
    type: 'success',
  },
  {
    id: '13',
    title: 'Problème de serveur détecté',
    description:
      "Une latence anormale a été détectée sur le serveur principal. L'équipe technique a été notifiée.",
    createdAt: sub(new Date(), { hours: 12 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
  {
    id: '14',
    title: 'Réunion reportée',
    description: "La réunion d'équipe prévue demain à 10h00 a été reportée à 14h00.",
    createdAt: sub(new Date(), { days: 1, hours: 6 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '15',
    title: 'Nouveau projet créé',
    description:
      'Le projet "Refonte de l\'interface utilisateur" a été créé et vous avez été ajouté comme contributeur.',
    createdAt: sub(new Date(), { days: 2, hours: 5 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'success',
  },
  {
    id: '16',
    title: 'Limite de stockage atteinte',
    description:
      'Votre espace de stockage est presque plein (95%). Pensez à supprimer des fichiers ou à passer à un forfait supérieur.',
    createdAt: sub(new Date(), { days: 3 }),
    isRead: true,
    isArchived: false,
    isFavorite: true,
    type: 'warning',
  },
  {
    id: '17',
    title: 'Mise à jour de modules',
    description:
      '3 nouveaux modules sont disponibles pour votre dashboard. Consultez les détails pour les installer.',
    createdAt: sub(new Date(), { days: 3, hours: 7 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '18',
    title: 'Tâche assignée',
    description:
      'Marie Leclerc vous a assigné la tâche "Préparer la présentation client" avec échéance le 12/04.',
    createdAt: sub(new Date(), { days: 4, hours: 2 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '19',
    title: 'Performance du système',
    description:
      'Les performances du système ont été améliorées de 30% suite à la dernière optimisation.',
    createdAt: sub(new Date(), { days: 5 }),
    isRead: true,
    isArchived: true,
    isFavorite: false,
    type: 'success',
  },
  {
    id: '20',
    title: 'Expiration de mot de passe',
    description:
      "Votre mot de passe expirera dans 5 jours. Veuillez le changer pour éviter tout problème d'accès.",
    createdAt: sub(new Date(), { days: 5, hours: 9 }),
    isRead: false,
    isArchived: false,
    isFavorite: true,
    type: 'warning',
  },
  {
    id: '21',
    title: 'Invitation à collaborer',
    description:
      'Pierre Martin vous invite à collaborer sur le document "Stratégie marketing 2025".',
    createdAt: sub(new Date(), { weeks: 1, days: 3 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '22',
    title: 'Nouvelle version disponible',
    description:
      "Une nouvelle version de l'application (v3.2.1) est disponible avec des correctifs de sécurité importants.",
    createdAt: sub(new Date(), { weeks: 1, days: 4 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
  {
    id: '23',
    title: 'Rappel: Évaluation trimestrielle',
    description:
      "N'oubliez pas de compléter votre évaluation trimestrielle avant la fin de la semaine.",
    createdAt: sub(new Date(), { weeks: 1, days: 5 }),
    isRead: true,
    isArchived: false,
    isFavorite: true,
    type: 'warning',
  },
  {
    id: '24',
    title: 'Changement de politique',
    description:
      "La politique de sécurité de l'entreprise a été mise à jour. Veuillez consulter les nouvelles directives.",
    createdAt: sub(new Date(), { weeks: 2, days: 1 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '25',
    title: 'Accès révoqué',
    description: 'Votre accès au projet "Analytics Dashboard" a été révoqué par l\'administrateur.',
    createdAt: sub(new Date(), { weeks: 2, days: 3 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
  {
    id: '26',
    title: 'Documentation mise à jour',
    description:
      'La documentation technique a été mise à jour avec de nouveaux exemples et tutoriels.',
    createdAt: sub(new Date(), { weeks: 2, days: 4 }),
    isRead: true,
    isArchived: true,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '27',
    title: 'Félicitations!',
    description:
      "Vous avez atteint 100% de vos objectifs trimestriels! L'équipe de direction vous félicite.",
    createdAt: sub(new Date(), { weeks: 3 }),
    isRead: true,
    isArchived: false,
    isFavorite: true,
    type: 'success',
  },
  {
    id: '28',
    title: 'Problème de facturation',
    description:
      'Un problème avec votre dernière facture a été identifié. Le service comptable vous contactera prochainement.',
    createdAt: sub(new Date(), { weeks: 3, days: 2 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'warning',
  },
  {
    id: '29',
    title: 'Nouveau certificat SSL',
    description:
      "Le certificat SSL de votre domaine a été renouvelé automatiquement pour l'année à venir.",
    createdAt: sub(new Date(), { weeks: 3, days: 5 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'success',
  },
  {
    id: '30',
    title: 'Audit de sécurité planifié',
    description:
      "Un audit de sécurité est planifié pour le 20/04. Aucune action n'est requise de votre part.",
    createdAt: sub(new Date(), { weeks: 4 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'info',
  },

  // Even more notifications (31-40)
  {
    id: '31',
    title: 'Nouveau partenariat',
    description:
      'Notre entreprise a établi un nouveau partenariat stratégique avec TechVision Inc.',
    createdAt: sub(new Date(), { weeks: 4, days: 2 }),
    isRead: false,
    isArchived: false,
    isFavorite: true,
    type: 'success',
  },
  {
    id: '32',
    title: 'Mise à jour de votre profil',
    description:
      'Votre profil utilisateur a été mis à jour automatiquement suite à la synchronisation avec le service RH.',
    createdAt: sub(new Date(), { weeks: 4, days: 3 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '33',
    title: "Tentative d'accès non autorisée",
    description:
      "Plusieurs tentatives d'accès à votre compte depuis une adresse IP inconnue ont été bloquées.",
    createdAt: sub(new Date(), { weeks: 4, days: 5 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
  {
    id: '34',
    title: "Résultats de l'enquête",
    description:
      "Les résultats de l'enquête de satisfaction client sont maintenant disponibles dans votre tableau de bord.",
    createdAt: sub(new Date(), { weeks: 5 }),
    isRead: true,
    isArchived: true,
    isFavorite: false,
    type: 'info',
  },
  {
    id: '35',
    title: 'Nouveau ticket de support',
    description:
      'Le client Acme Corp a ouvert un nouveau ticket de support prioritaire concernant le module de paiement.',
    createdAt: sub(new Date(), { weeks: 5, days: 1 }),
    isRead: false,
    isArchived: false,
    isFavorite: true,
    type: 'warning',
  },
  {
    id: '36',
    title: 'Rappel: Formation obligatoire',
    description:
      'La formation obligatoire sur la sécurité informatique doit être complétée avant le 30/04.',
    createdAt: sub(new Date(), { weeks: 5, days: 3 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'warning',
  },
  {
    id: '37',
    title: 'Intégration terminée',
    description:
      "L'intégration avec le système CRM a été complétée avec succès. Vous pouvez maintenant utiliser toutes les fonctionnalités.",
    createdAt: sub(new Date(), { weeks: 5, days: 6 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'success',
  },
  {
    id: '38',
    title: 'Problème résolu',
    description:
      'Le problème signalé concernant la génération de rapports a été résolu dans la dernière mise à jour.',
    createdAt: sub(new Date(), { weeks: 6 }),
    isRead: true,
    isArchived: false,
    isFavorite: false,
    type: 'success',
  },
  {
    id: '39',
    title: 'Nouvelle fonctionnalité expérimentale',
    description:
      'Une nouvelle fonctionnalité expérimentale "Analyse prédictive" est disponible en version bêta.',
    createdAt: sub(new Date(), { weeks: 6, days: 2 }),
    isRead: false,
    isArchived: false,
    isFavorite: true,
    type: 'info',
  },
  {
    id: '40',
    title: "Maintenance d'urgence",
    description:
      "Une maintenance d'urgence est prévue ce soir à 23h00 pour résoudre un problème critique. Durée estimée: 30 minutes.",
    createdAt: sub(new Date(), { weeks: 6, days: 3 }),
    isRead: false,
    isArchived: false,
    isFavorite: false,
    type: 'alert',
  },
];

// Options de notification par catégorie
export const DEFAULT_NOTIFICATION_OPTIONS: NotificationOption[] = [
  // Système
  {
    id: 'system-updates',
    title: 'Mises à jour système',
    description:
      'Recevoir des notifications lorsque des mises à jour importantes du système sont disponibles ou installées.',
    enabled: true,
    category: 'system',
  },
  {
    id: 'role-changes',
    title: 'Changements de rôle',
    description:
      'Être informé lorsque vos rôles, permissions ou accès sont modifiés dans le système.',
    enabled: true,
    category: 'system',
  },
  {
    id: 'security-alerts',
    title: 'Alertes de sécurité',
    description:
      'Recevoir des alertes en cas de problèmes de sécurité ou de tentatives de connexion suspectes.',
    enabled: true,
    category: 'system',
  },

  // Profil
  {
    id: 'profile-changes',
    title: 'Modifications du profil',
    description:
      "Recevoir une alerte lors de modifications de la photo, de l'email ou du mot de passe de votre compte.",
    enabled: true,
    category: 'profile',
  },
  {
    id: 'new-device-login',
    title: 'Connexions depuis un nouvel appareil',
    description: "Être informé lorsqu'une connexion est détectée depuis un appareil non reconnu.",
    enabled: true,
    category: 'profile',
  },

  // Activité
  {
    id: 'pending-requests',
    title: 'Demandes en attente',
    description:
      'Recevoir des notifications sur les actions administrateur ou modérateur nécessitant une validation.',
    enabled: true,
    category: 'activity',
  },
];

export const WEEK_DAYS = [
  { value: 1, label: 'Lundi' },
  { value: 2, label: 'Mardi' },
  { value: 3, label: 'Mercredi' },
  { value: 4, label: 'Jeudi' },
  { value: 5, label: 'Vendredi' },
  { value: 6, label: 'Samedi' },
  { value: 0, label: 'Dimanche' },
];

export const DEFAULT_SETTINGS = {
  system: {
    systemUpdates: true,
    roleChanges: true,
    securityAlerts: true,
  },
  profile: {
    profileChanges: true,
    newDeviceLogin: true,
  },
  activity: {
    pendingRequests: true,
  },
  frequency: {
    type: 'realtime' as const,
    dailyTime: new Date(new Date().setHours(9, 0, 0, 0)),
    weeklyDay: 5, // Vendredi
    weeklyTime: new Date(new Date().setHours(9, 0, 0, 0)),
  },
  channels: {
    email: true,
    sms: false,
    internal: true,
  },
};
