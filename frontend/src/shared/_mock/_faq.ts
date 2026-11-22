
import { _mock } from "./_mock";

export const _STATUS_FAQs = [
  { value: 'Publié', label: 'Publié' },
  { value: 'Brouillion', label: 'Brouillion' },
  { value: 'Archivé', label: 'Archivé' },
];

export const __Categories = [
  { value: 'Compte', label: 'Compte' },
  { value: 'Facturation', label: 'Facturation' },
  { value: 'Sécurité', label: 'Sécurité' },
];

const TITLES = [
  "Comment réinitialiser mon mot de passe ?",
  "Comment modifier mes informations de paiement ?",
  "Comment activer l'authentification à deux facteurs ?",
  "Quand vais-je recevoir ma facture mensuelle ?",
  "Comment contacter le service client ?",
  "Comment mettre à jour mes coordonnées ?",
  "Comment annuler mon abonnement ?",
  "Comment télécharger ma facture ?",
  "Comment réactiver mon compte ?",
  "Comment bénéficier d'une réduction spéciale ?",
  "Comment signaler un problème technique ?",
  "Comment modifier mon adresse e-mail ?",
  "Comment sécuriser mon compte ?",
  "Comment configurer les notifications ?",
  "Comment supprimer mon compte ?",
  "Comment changer mes préférences de communication ?",
  "Comment consulter l'historique de mes transactions ?",
  "Comment activer les mises à jour automatiques ?",
  "Comment utiliser la fonctionnalité de chat en ligne ?",
  "Comment obtenir de l'aide pour une commande ?"
];


const REPONSES = [
  "Pour réinitialiser votre mot de passe, cliquez sur 'Mot de passe oublié' et suivez les instructions.",
  "Pour modifier vos informations de paiement, rendez-vous dans la section 'Paiement' de votre compte.",
  "Pour activer l'authentification à deux facteurs, allez dans les paramètres de sécurité et suivez les étapes proposées.",
  "Votre facture mensuelle sera envoyée par email à la date de facturation habituelle.",
  "Pour contacter le service client, veuillez remplir le formulaire de contact sur notre site.",
  "Pour mettre à jour vos coordonnées, accédez à la section 'Mon compte' et modifiez vos informations personnelles.",
  "Pour annuler votre abonnement, allez dans 'Mes abonnements' et cliquez sur 'Annuler'.",
  "Pour télécharger votre facture, connectez-vous à votre espace client et cliquez sur 'Factures'.",
  "Pour réactiver votre compte, suivez le lien de réactivation envoyé à votre adresse email.",
  "Pour bénéficier d'une réduction spéciale, inscrivez-vous à notre newsletter pour recevoir nos offres exclusives.",
  "Pour signaler un problème technique, utilisez notre chat en ligne ou le formulaire de support.",
  "Pour modifier votre adresse e-mail, rendez-vous dans 'Paramètres' et mettez à jour votre contact email.",
  "Pour sécuriser votre compte, nous recommandons d'activer l'authentification à deux facteurs et d'utiliser un mot de passe fort.",
  "Pour configurer vos notifications, accédez aux paramètres de votre compte et sélectionnez vos préférences.",
  "Pour supprimer votre compte, contactez notre support client pour obtenir l'assistance nécessaire.",
  "Pour changer vos préférences de communication, allez dans 'Paramètres' et ajustez vos options de contact.",
  "Pour consulter l'historique de vos transactions, connectez-vous et consultez la rubrique 'Historique' de votre compte.",
  "Pour activer les mises à jour automatiques, rendez-vous dans les paramètres de l'application.",
  "Pour utiliser la fonctionnalité de chat en ligne, cliquez sur l'icône de chat en bas à droite de l'écran.",
  "Pour obtenir de l'aide concernant une commande, consultez la section 'Support' ou contactez directement notre service client."
];

export const _faqList = [...Array(20)].map((_, index) => ({
    id: _mock.id(index),
    title: TITLES[index],
    reponse: REPONSES[index],
    categorie: __Categories[Math.floor(Math.random() * __Categories.length)].value,
    statut: _STATUS_FAQs[Math.floor(Math.random() * _STATUS_FAQs.length)].value,
    datePublication: _mock.time(index),
}));