import { _mock } from './_mock';

// ----------------------------------------------------------------------

// Type définissant les modèles d'assistants disponibles
export type AIModel = 'chatgpt3' | 'chatgpt4' | 'chatgpt5' | 'claude3' | 'claude3_5' | 'claude4';
export type TTSModel = 'tts_standard' | 'tts_premium' | 'tts_neural' | 'tts_premium_plus';

// Type définissant les assistants disponibles avec leurs modèles sélectionnés
export type AssistantConfiguration = {
  devoir: {
    access: boolean;
    textModel: AIModel;
    ttsModel: TTSModel;
  };
  recherche: {
    access: boolean;
    textModel: AIModel;
    ttsModel: TTSModel;
  };
  japprends: {
    access: boolean;
    textModel: AIModel;
    ttsModel: TTSModel;
  };
};

// Coûts unitaires des assistants par question par modèle
export const AI_MODEL_COSTS = {
  chatgpt3: { cost: 0.5, name: 'ChatGPT 3.5' },
  chatgpt4: { cost: 0.9, name: 'ChatGPT 4' },
  chatgpt5: { cost: 1.2, name: 'ChatGPT 5' },
  claude3: { cost: 0.8, name: 'Claude 3' },
  claude3_5: { cost: 1.0, name: 'Claude 3.5' },
  claude4: { cost: 1.5, name: 'Claude 4' },
};

// Modèles disponibles par assistant
export const AVAILABLE_MODELS = {
  devoir: ['chatgpt3', 'chatgpt4', 'chatgpt5', 'claude3'],
  recherche: ['chatgpt4', 'chatgpt5', 'claude3', 'claude3_5'],
  japprends: ['chatgpt4', 'chatgpt5', 'claude3', 'claude3_5', 'claude4'],
};

export const ABONNEMENT_DETAILS_TABS = [
  { label: "Contenu d'abonnement", value: 'content' },
  { label: 'Abonnés', value: 'subscribers' },
];

export const ABONNEMENT_PUBLISH_OPTIONS = [
  { value: 'draft', label: 'Brouillon' },
  { value: 'published', label: 'Publié' },
  { value: 'archived', label: 'Archivé' },
];

export const ABONNEMENT_INTERVALS_OPTIONS = [
  { value: 'monthly', label: 'Mensuel' },
  { value: 'semiannual', label: 'Semestriel' },
  { value: 'annual', label: 'Annuel' },
];

export const ABONNEMENT_SORT_OPTIONS = [
  { label: 'Plus récent', value: 'latest' },
  { label: 'Plus populaire', value: 'popular' },
  { label: 'Plus ancien', value: 'oldest' },
];

export const getPublishLabel = (value: string) => {
  const option = ABONNEMENT_PUBLISH_OPTIONS.find((publish) => publish.value === value);
  return option ? option.label : 'Non défini';
};
export const getIntervalLabel = (value: string | undefined) => {
  if (!value) return 'Non défini';
  const option = ABONNEMENT_INTERVALS_OPTIONS.find((interval) => interval.value === value);
  return option ? option.label : 'Mensuel';
};

// Fonction pour formater l'intervalle en texte
export const formatInterval = (interval: string) => {
  switch (interval) {
    case 'monthly':
      return 'mois';
    case 'semiannual':
      return '6 mois';
    case 'annual':
      return 'an';
    default:
      return 'mois';
  }
};
const SUBSCRIBERS = [...Array(12)].map((_, index) => ({
  id: _mock.id(index),
  role: _mock.role(index),
  name: _mock.fullName(index),
  avatarUrl: _mock.image.avatar(index),
}));

const _promoDetails = {
  discountPercentage: 10,
  validUntil: '2025-12-31',
};

const _abonnementItems = [...Array(5)].map((_, index) => {
  const planPublish = ABONNEMENT_PUBLISH_OPTIONS[index % ABONNEMENT_PUBLISH_OPTIONS.length].value;
  const price = {
    monthly: 29.99,
    semiannual: 149.99,
    annual: 269.99,
    defaultInterval: 'monthly',
  };
  const hasExpiration = index % 2 === 0; // Un abonnement sur deux a une date d'expiration

  return {
    id: _mock.id(index + 1),
    title: `Abonnement ${index + 1}`,
    shortDescription: `Courte description du plan ${index + 1}.`,
    fullDescription: `Description complète du plan ${index + 1}, incluant toutes les fonctionnalités et avantages.`,
    publish: planPublish,
    totalSubscribers: _mock.number.nativeL(index),
    subscribers: SUBSCRIBERS,
    nbr_children_access: _mock.number.nativeS(index),
    daily_question_limit: _mock.number.nativeS(index),
    assistants: {
      devoir: {
        access: true,
        textModel: 'chatgpt4',
        ttsModel: 'tts_premium',
      },
      recherche: {
        access: true,
        textModel: 'claude3',
        ttsModel: 'tts_premium',
      },
      japprends: {
        access: true,
        textModel: 'chatgpt4',
        ttsModel: 'tts_neural',
      },
    },
    nbr_subjects: _mock.number.nativeS(index),
    price,
    promoDetails: _promoDetails,
    createdAt: _mock.time(index),
    updatedAt: _mock.time(index + 1),
    lastPublishedDate: _mock.time(index + 2),
    lastarchivedDate: planPublish === 'Archivé' ? _mock.time(index + 2) : undefined,
    expiredAt: hasExpiration ? _mock.time(index + 5) : undefined,
  };
});

export const abonnementItems = _abonnementItems;

export const _purchasedSubscriptions = [...Array(5)].map((_, index) => {
  const planPublish = ABONNEMENT_PUBLISH_OPTIONS[index % ABONNEMENT_PUBLISH_OPTIONS.length].value;
  const price = {
    monthly: 29.99,
    semiannual: 149.99,
    annual: 269.99,
    defaultInterval: 'monthly',
  };
  const hasExpiration = index % 2 === 0; // Un abonnement sur deux a une date d'expiration

  return {
    id: _mock.id(index + 1),
    title: `Abonnement ${index + 1}`,
    shortDescription: `Courte description du plan ${index + 1}.`,
    fullDescription: `Description complète du plan ${index + 1}, incluant toutes les fonctionnalités et avantages.`,
    publish: planPublish,
    totalSubscribers: _mock.number.nativeL(index),
    subscribers: SUBSCRIBERS,
    nbr_children_access: _mock.number.nativeS(index),
    daily_question_limit: _mock.number.nativeS(index),
    assistants: {
      devoir: {
        access: true,
        textModel: 'chatgpt4',
        ttsModel: 'tts_premium',
      },
      recherche: {
        access: true,
        textModel: 'claude3',
        ttsModel: 'tts_premium',
      },
      japprends: {
        access: true,
        textModel: 'chatgpt4',
        ttsModel: 'tts_neural',
      },
    },
    nbr_subjects: _mock.number.nativeS(index),
    price,
    interval: 'monthly',
    promoDetails: _promoDetails,
    createdAt: _mock.time(index),
    updatedAt: _mock.time(index + 1),
    lastPublishedDate: _mock.time(index + 2),
    lastarchivedDate: planPublish === 'Archivé' ? _mock.time(index + 2) : undefined,
    expiredAt: hasExpiration ? _mock.time(index + 5) : undefined,
  };
});
