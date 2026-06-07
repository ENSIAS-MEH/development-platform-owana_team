// D:\bureau\PFA\dev\back_office\brainboost-front\brainboost-front\src\shared\_mock\_correction_ai.ts

import { SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS } from './_subject_relationships';
import {
  AI_ASSISTANT_SUBJECTS,
  AI_ASSISTANT_CHAPTERS,
  AI_ASSISTANT_EXERCISES,
  AI_ASSISTANT_TYPE_OPTIONS,
  AI_ASSISTANT_EDUCATION_LEVELS,
} from './_ai-assistant';

// ===============================================================
// INTERFACES
// ===============================================================

// Interface pour les options de filtrage d'évolution de performance
export interface PerformanceEvolutionFilterOptions {
  period: 'day' | 'week' | 'month';
  assistantTypes: string[];
  educationLevels: string[];
  startDate: Date | null;
  endDate: Date | null;
  onlySignificantImprovements: boolean;
  compareWithPreviousPeriod: boolean;
}

// Interface pour les données d'évolution de performance
export interface PerformanceEvolutionData {
  labels: string[];
  beforeCorrection: number[];
  afterCorrection: number[];
  previousPeriodAfterCorrection?: (number | null)[];
}

// Interface pour les options de filtrage général
export interface FilterOptions {
  period: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom';
  type: string | string[];
  level: string | string[];
  searchTerm: string;
  startDate?: Date | null;
  endDate?: Date | null;
  assistants?: string[];
  correctionTypes?: string[];
  subjects?: string[];
  chapters?: string[];
  exercises?: string[];
}

// Interface pour la plage de dates personnalisée
export interface CustomDateRange {
  startDate: Date | null;
  endDate: Date | null;
}

// Structure pour associer des matières et chapitres à chaque correction
export interface CorrectionMeta {
  subject?: string;
  chapter?: string;
  exercise?: string;
  level?: string;
}

// Interface pour les items de correction dans l'historique
export interface CorrectionItem {
  date: string;
  assistant: string;
  type: string;
  impact: number;
  meta: CorrectionMeta;
}

// ===============================================================
// CONSTANTES ET VALEURS PAR DÉFAUT
// ===============================================================

// Valeurs par défaut pour les filtres
export const defaultFilterOptions: FilterOptions = {
  period: 'last30days',
  type: 'all',
  level: 'all',
  searchTerm: ''
};

// Types de correction possibles
export const correctionTypes = [
  'Amélioration des exemples',
  'Optimisation des requêtes',
  'Clarification des réponses',
  'Adaptation au niveau',
  'Ajout d\'illustrations',
  'Simplification du vocabulaire',
  'Restructuration des explications',
  'Correction d\'erreurs factuelles',
  'Personnalisation des réponses',
  'Optimisation du temps de réponse'
];

// Données des assistants disponibles pour la correction
export const mockAssistants = [
  'Assistant Mathématiques',
  'Assistant Recherche',
  'Assistant Principal',
  'Assistant Français',
  'Assistant Sciences',
  'Assistant Histoire-Géographie',
  'Assistant Anglais',
  'Assistant SVT',
  'Assistant Arts Plastiques',
  'Assistant Musique'
];

// Couleurs pour les graphiques
export const chartColors = [
  '#FF6384', // Rose
  '#36A2EB', // Bleu
  '#FFCE56', // Jaune
  '#4BC0C0', // Turquoise
  '#9966FF', // Violet
  '#FF9F40', // Orange
  '#4D5360', // Gris foncé
  '#7ED321', // Vert
  '#FF5A5E', // Rouge clair
  '#C9CBCF'  // Gris clair
];

// Mapping de noms d'assistants aux types
export const assistantTypeMapping: Record<string, string> = {
  'Assistant Mathématiques': 'Apprentissge',
  'Assistant Français': 'Apprentissge',
  'Assistant Sciences': 'Apprentissge',
  'Assistant Histoire-Géographie': 'Apprentissge',
  'Assistant Anglais': 'Apprentissge',
  'Assistant SVT': 'Apprentissge',
  'Assistant Arts Plastiques': 'Apprentissge',
  'Assistant Musique': 'Apprentissge',
  'Assistant Recherche': 'recherche',
  'Assistant Principal': 'accueil'
};

// Mapping de noms d'assistants aux matières
export const assistantSubjectMapping: Record<string, string> = {
  'Assistant Mathématiques': 'Mathématiques',
  'Assistant Français': 'Français',
  'Assistant Histoire-Géographie': 'Histoire',
  'Assistant Anglais': 'Anglais',
  'Assistant Sciences': 'Sciences',
  'Assistant SVT': 'SVT',
  'Assistant Arts Plastiques': 'Arts Plastiques',
  'Assistant Musique': 'Musique'
};

// Statistiques globales des corrections
export const correctionStats = {
  totalCorrectionsMade: 187,
  totalPendingCorrections: 24,
  averageImprovementPercentage: 14.2,
  averageCorrectionTime: 2.5, // en jours
  topPerformingAssistant: 'Assistant Français',
  mostCommonCorrectionType: 'Amélioration des exemples',
  highestSingleImprovement: 22.1 // en pourcentage
};

// Données pour les filtres d'assistants
export const assistantFilters = {
  types: AI_ASSISTANT_TYPE_OPTIONS.map(option => option.value),
  levels: AI_ASSISTANT_EDUCATION_LEVELS.map(option => option.value),
  subjects: AI_ASSISTANT_SUBJECTS.map(option => option.value),
  chapters: AI_ASSISTANT_CHAPTERS.map(option => option.value),
  exercises: AI_ASSISTANT_EXERCISES.map(option => option.value)
};

// ===============================================================
// HELPERS ET FONCTIONS UTILITAIRES
// ===============================================================

/**
 * Génère des métadonnées pour les corrections basées sur les données réelles
 * @param assistant Nom de l'assistant
 * @param index Index pour la génération cyclique de données
 */
const generateCorrectionMeta = (assistant: string, index: number): CorrectionMeta => {
  const subject = assistantSubjectMapping[assistant];
  if (!subject || !['Apprentissge'].includes(assistantTypeMapping[assistant])) {
    return {};
  }

  // Déterminer le niveau en fonction de l'index
  const levels = ['CP', 'CE1', 'CE2', 'CM1', 'CM2'];
  const level = levels[index % levels.length];
  
  // Pour les assistants qui ne couvrent pas tous les niveaux
  if (assistant === 'Assistant Sciences' || assistant === 'Assistant Histoire-Géographie') {
    const restrictedLevels = ['CE2', 'CM1', 'CM2'];
    return { level: restrictedLevels[index % restrictedLevels.length], subject };
  }
  
  if (assistant === 'Assistant SVT') {
    const restrictedLevels = ['CM1', 'CM2'];
    return { level: restrictedLevels[index % restrictedLevels.length], subject };
  }

  // Pour les matières standard dans SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS
  if (['Mathématiques', 'Français', 'Histoire', 'Géographie', 'Anglais'].includes(subject)) {
    // Ajustement pour Histoire-Géographie
    const adjustedSubject = subject === 'Histoire-Géographie' 
      ? (index % 2 === 0 ? 'Histoire' : 'Géographie')
      : subject;
    
    if (SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[adjustedSubject as keyof typeof SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS]) {
      const chapters = Object.keys(SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[adjustedSubject as keyof typeof SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS]);
      const chapter = chapters[index % chapters.length];
      
      const exercises = SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[adjustedSubject as keyof typeof SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS][chapter];
      const exercise = exercises[index % exercises.length];
      
      return { subject: adjustedSubject, chapter, exercise, level };
    }
  }
  
  return { level, subject };
};

/**
 * Parse une date à partir d'une chaîne au format dd/mm/yyyy
 * @param dateString Chaîne de date au format dd/mm/yyyy
 * @returns Date parsée ou null en cas d'erreur
 */
const parseDate = (dateString: string): Date | null => {
  try {
    const [day, month, year] = dateString.split('/').map(Number);
    if (Number.isNaN(day) || Number.isNaN(month) || Number.isNaN(year)) {
      return null;
    }
    return new Date(year, month - 1, day);
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
};

/**
 * Vérifie si une date est dans une période spécifiée
 * @param date Date à vérifier
 * @param period Période à utiliser pour la vérification
 * @param startDate Date de début pour période personnalisée
 * @param endDate Date de fin pour période personnalisée
 * @returns true si la date est dans la période, false sinon
 */
const isInPeriod = (
  date: Date, 
  period: 'today' | 'yesterday' | 'last7days' | 'last30days' | 'custom',
  startDate?: Date | null,
  endDate?: Date | null
): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  yesterday.setHours(0, 0, 0, 0);
  
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);
  last7Days.setHours(0, 0, 0, 0);
  
  const last30Days = new Date();
  last30Days.setDate(last30Days.getDate() - 30);
  last30Days.setHours(0, 0, 0, 0);
  
  switch (period) {
    case 'today':
      return date.getFullYear() === today.getFullYear() &&
             date.getMonth() === today.getMonth() &&
             date.getDate() === today.getDate();
    case 'yesterday':
      return date.getFullYear() === yesterday.getFullYear() &&
             date.getMonth() === yesterday.getMonth() &&
             date.getDate() === yesterday.getDate();
    case 'last7days':
      return date >= last7Days;
    case 'last30days':
      return date >= last30Days;
    case 'custom':
      if (startDate && date < startDate) {
        return false;
      }
      if (endDate) {
        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59, 999);
        if (date > endOfDay) {
          return false;
        }
      }
      return true;
    default:
      return true;
  }
};

// ===============================================================
// DONNÉES MOCKÉES
// ===============================================================

// Données pour l'historique des corrections avec métadonnées
export const correctionData: CorrectionItem[] = [
  { date: '22/03/2025', assistant: 'Assistant Mathématiques', type: 'Amélioration des exemples', impact: 18.5, meta: generateCorrectionMeta('Assistant Mathématiques', 0) },
  { date: '21/03/2025', assistant: 'Assistant Recherche', type: 'Optimisation des requêtes', impact: 12.3, meta: generateCorrectionMeta('Assistant Recherche', 1) },
  { date: '20/03/2025', assistant: 'Assistant Principal', type: 'Clarification des réponses', impact: 9.8, meta: generateCorrectionMeta('Assistant Principal', 2) },
  { date: '19/03/2025', assistant: 'Assistant Français', type: 'Adaptation au niveau CP', impact: 22.1, meta: { ...generateCorrectionMeta('Assistant Français', 3), level: 'CP' } },
  { date: '18/03/2025', assistant: 'Assistant Sciences', type: 'Ajout d\'illustrations', impact: 15.7, meta: generateCorrectionMeta('Assistant Sciences', 4) },
  { date: '17/03/2025', assistant: 'Assistant Histoire-Géographie', type: 'Simplification du vocabulaire', impact: 16.2, meta: generateCorrectionMeta('Assistant Histoire-Géographie', 5) },
  { date: '16/03/2025', assistant: 'Assistant Anglais', type: 'Personnalisation des réponses', impact: 13.9, meta: generateCorrectionMeta('Assistant Anglais', 6) },
  { date: '15/03/2025', assistant: 'Assistant SVT', type: 'Correction d\'erreurs factuelles', impact: 19.4, meta: generateCorrectionMeta('Assistant SVT', 7) },
  { date: '14/03/2025', assistant: 'Assistant Mathématiques', type: 'Restructuration des explications', impact: 14.5, meta: generateCorrectionMeta('Assistant Mathématiques', 8) },
  { date: '13/03/2025', assistant: 'Assistant Principal', type: 'Optimisation du temps de réponse', impact: 8.2, meta: generateCorrectionMeta('Assistant Principal', 9) },
  { date: '12/03/2025', assistant: 'Assistant Arts Plastiques', type: 'Ajout d\'illustrations', impact: 17.8, meta: generateCorrectionMeta('Assistant Arts Plastiques', 10) },
  { date: '11/03/2025', assistant: 'Assistant Français', type: 'Adaptation au niveau CE1', impact: 20.3, meta: { ...generateCorrectionMeta('Assistant Français', 11), level: 'CE1' } },
  { date: '10/03/2025', assistant: 'Assistant Musique', type: 'Amélioration des exemples', impact: 11.7, meta: generateCorrectionMeta('Assistant Musique', 12) },
  { date: '09/03/2025', assistant: 'Assistant Recherche', type: 'Clarification des réponses', impact: 10.9, meta: generateCorrectionMeta('Assistant Recherche', 13) },
  { date: '08/03/2025', assistant: 'Assistant Sciences', type: 'Optimisation des requêtes', impact: 13.6, meta: generateCorrectionMeta('Assistant Sciences', 14) }
];

// Données pour l'évolution des performances avant/après correction par jour
export const performanceEvolutionByDay: PerformanceEvolutionData = {
  labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
  beforeCorrection: [68, 65, 70, 72, 67, 69, 71],
  afterCorrection: [68, 78, 82, 85, 88, 86, 89]
};

// Données pour l'évolution des performances avant/après correction par semaine
export const performanceEvolutionByWeek: PerformanceEvolutionData = {
  labels: ['Sem 1 Fév', 'Sem 2 Fév', 'Sem 3 Fév', 'Sem 4 Fév', 'Sem 1 Mar', 'Sem 2 Mar'],
  beforeCorrection: [64, 67, 68, 70, 71, 73],
  afterCorrection: [64, 74, 79, 84, 86, 88]
};

// Données pour l'évolution des performances avant/après correction par mois
export const performanceEvolutionByMonth: PerformanceEvolutionData = {
  labels: ['Septembre', 'Octobre', 'Novembre', 'Décembre', 'Janvier', 'Février'],
  beforeCorrection: [62, 65, 68, 70, 73, 71],
  afterCorrection: [62, 70, 75, 82, 86, 88]
};

// Données pour l'évolution des performances par niveau d'éducation
export const performanceEvolutionByLevel: Record<string, PerformanceEvolutionData> = {
  CP: {
    labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
    beforeCorrection: [62, 63, 65, 64, 66, 67, 68],
    afterCorrection: [62, 72, 77, 81, 84, 85, 87]
  },
  CE1: {
    labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
    beforeCorrection: [65, 66, 68, 69, 67, 70, 71],
    afterCorrection: [65, 75, 79, 83, 86, 87, 89]
  },
  CE2: {
    labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
    beforeCorrection: [67, 68, 70, 72, 69, 71, 74],
    afterCorrection: [67, 76, 81, 85, 86, 87, 90]
  },
  CM1: {
    labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
    beforeCorrection: [70, 71, 73, 74, 72, 73, 75],
    afterCorrection: [70, 78, 83, 87, 89, 90, 92]
  },
  CM2: {
    labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
    beforeCorrection: [72, 73, 75, 76, 74, 76, 77],
    afterCorrection: [72, 80, 85, 88, 90, 91, 93]
  }
};

// Données pour l'évolution des performances par type d'assistant
export const performanceEvolutionByType: Record<string, PerformanceEvolutionData> = {
  Apprentissge: {
    labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
    beforeCorrection: [69, 67, 71, 73, 68, 70, 72],
    afterCorrection: [69, 80, 84, 87, 89, 88, 90]
  },
  accueil: {
    labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
    beforeCorrection: [72, 70, 74, 76, 73, 75, 77],
    afterCorrection: [72, 78, 82, 85, 87, 86, 88]
  },
  recherche: {
    labels: ['18 Fév', '19 Fév', '20 Fév', '21 Fév', '22 Fév', '23 Fév', '24 Fév'],
    beforeCorrection: [65, 63, 67, 69, 64, 66, 68],
    afterCorrection: [65, 76, 80, 83, 86, 84, 87]
  }
};

// Données pour la répartition des types de corrections
export const correctionTypeDistribution = [
  { type: 'Amélioration des exemples', percentage: 35 },
  { type: 'Optimisation des requêtes', percentage: 25 },
  { type: 'Clarification des réponses', percentage: 20 },
  { type: 'Adaptation au niveau', percentage: 15 },
  { type: 'Ajout d\'illustrations', percentage: 5 }
];

// Données pour la comparaison des performances avant/après réentraînement
export const performanceComparisonData = {
  metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
  beforeRetraining: [65, 59, 72, 84, 68],
  afterRetraining: [85, 79, 90, 89, 88]
};

// ===============================================================
// FONCTIONS DE FILTRAGE
// ===============================================================

/**
 * Filtre les données d'évolution des performances selon les critères spécifiés
 * @param filters Options de filtrage pour l'évolution des performances
 * @returns Données d'évolution des performances filtrées
 */
export const filterPerformanceEvolutionData = (filters: PerformanceEvolutionFilterOptions): PerformanceEvolutionData => {
  // Sélectionner la période appropriée
  let baseData: PerformanceEvolutionData;
  switch (filters.period) {
    case 'day':
      baseData = { ...performanceEvolutionByDay };
      break;
    case 'week':
      baseData = { ...performanceEvolutionByWeek };
      break;
    case 'month':
      baseData = { ...performanceEvolutionByMonth };
      break;
    default:
      baseData = { ...performanceEvolutionByDay };
  }

  // Appliquer des filtres par type d'assistant si spécifiés
  if (filters.assistantTypes && filters.assistantTypes.length > 0) {
    const beforeValues = Array(baseData.labels.length).fill(0);
    const afterValues = Array(baseData.labels.length).fill(0);
    let count = 0;

    filters.assistantTypes.forEach(type => {
      if (performanceEvolutionByType[type]) {
        const typeData = performanceEvolutionByType[type];
        for (let i = 0; i < typeData.beforeCorrection.length; i += 1) {
          beforeValues[i] += typeData.beforeCorrection[i];
          afterValues[i] += typeData.afterCorrection[i];
        }
        count += 1;
      }
    });

    // Calculer la moyenne
    if (count > 0) {
      for (let i = 0; i < beforeValues.length; i += 1) {
        beforeValues[i] = Math.round(beforeValues[i] / count);
        afterValues[i] = Math.round(afterValues[i] / count);
      }

      baseData.beforeCorrection = beforeValues;
      baseData.afterCorrection = afterValues;
    }
  }

  // Appliquer des filtres par niveau d'éducation si spécifiés
  if (filters.educationLevels && filters.educationLevels.length > 0) {
    const beforeValues = Array(baseData.labels.length).fill(0);
    const afterValues = Array(baseData.labels.length).fill(0);
    let count = 0;

    filters.educationLevels.forEach(level => {
      if (performanceEvolutionByLevel[level]) {
        const levelData = performanceEvolutionByLevel[level];
        for (let i = 0; i < levelData.beforeCorrection.length; i += 1) {
          beforeValues[i] += levelData.beforeCorrection[i];
          afterValues[i] += levelData.afterCorrection[i];
        }
        count += 1;
      }
    });

    // Calculer la moyenne
    if (count > 0) {
      for (let i = 0; i < beforeValues.length; i += 1) {
        beforeValues[i] = Math.round(beforeValues[i] / count);
        afterValues[i] = Math.round(afterValues[i] / count);
      }

      baseData.beforeCorrection = beforeValues;
      baseData.afterCorrection = afterValues;
    }
  }

  // Filtrer pour n'inclure que les améliorations significatives (>10%) si l'option est activée
  if (filters.onlySignificantImprovements) {
    const significantLabels: string[] = [];
    const significantBefore: number[] = [];
    const significantAfter: number[] = [];

    for (let i = 0; i < baseData.labels.length; i += 1) {
      const improvement = baseData.afterCorrection[i] - baseData.beforeCorrection[i];
      const improvementPercentage = (improvement / baseData.beforeCorrection[i]) * 100;

      if (improvementPercentage >= 10) {
        significantLabels.push(baseData.labels[i]);
        significantBefore.push(baseData.beforeCorrection[i]);
        significantAfter.push(baseData.afterCorrection[i]);
      }
    }

    baseData.labels = significantLabels;
    baseData.beforeCorrection = significantBefore;
    baseData.afterCorrection = significantAfter;
  }

  // Ajouter la comparaison avec la période précédente si l'option est activée
  if (filters.compareWithPreviousPeriod) {
    baseData.previousPeriodAfterCorrection = [null, ...baseData.afterCorrection.slice(0, -1)];
  }

  // Simuler la filtration par plage de dates
  if (filters.startDate || filters.endDate) {
    const filteredLabels: string[] = [];
    const filteredBefore: number[] = [];
    const filteredAfter: number[] = [];
    const filteredPrevious = baseData.previousPeriodAfterCorrection
      ? Array(baseData.labels.length).fill(null)
      : undefined;

    // Déterminer l'indice de début pour la filtration de date
    const startIndex = filters.startDate ? Math.floor(baseData.labels.length / 4) : 0;
    const endIndex = filters.endDate ? Math.ceil(baseData.labels.length * 3 / 4) : baseData.labels.length;

    for (let i = startIndex; i < endIndex; i += 1) {
      filteredLabels.push(baseData.labels[i]);
      filteredBefore.push(baseData.beforeCorrection[i]);
      filteredAfter.push(baseData.afterCorrection[i]);

      if (filteredPrevious && baseData.previousPeriodAfterCorrection) {
        filteredPrevious[i - startIndex] = baseData.previousPeriodAfterCorrection[i];
      }
    }

    baseData.labels = filteredLabels;
    baseData.beforeCorrection = filteredBefore;
    baseData.afterCorrection = filteredAfter;

    if (baseData.previousPeriodAfterCorrection && filteredPrevious) {
      baseData.previousPeriodAfterCorrection = filteredPrevious;
    }
  }

  return baseData;
};

/**
 * Filtre les données de correction selon les critères spécifiés
 * @param data Données de correction à filtrer
 * @param filters Options de filtrage
 * @returns Données de correction filtrées
 */
export const filterCorrectionData = (data: CorrectionItem[], filters: FilterOptions): CorrectionItem[] => {
  // Safety check - if no data or no filters, return all data
  if (!data?.length || !filters) {
    return data || [];
  }

  // Handle default filters - early return for efficiency
  if (
    (filters.type === 'all' || !filters.type) &&
    (filters.level === 'all' || !filters.level) &&
    (!filters.searchTerm || filters.searchTerm.trim() === '') &&
    (!filters.correctionTypes?.length) &&
    (!filters.assistants?.length) &&
    (!filters.subjects?.length) &&
    (!filters.chapters?.length) &&
    (!filters.exercises?.length) &&
    (filters.period === 'last30days' || !filters.period)
  ) {
    return data;
  }

  // Apply filters
  return data.filter(item => {
    // 1. Date filtering
    const itemDate = parseDate(item.date);
    if (itemDate && !isInPeriod(itemDate, filters.period, filters.startDate, filters.endDate)) {
      return false;
    }

    // 2. Search term filtering
    if (filters.searchTerm?.trim()) {
      const searchTerm = filters.searchTerm.toLowerCase().trim();
      const matchesSearch =
        item.assistant.toLowerCase().includes(searchTerm) ||
        item.type.toLowerCase().includes(searchTerm) ||
        item.date.includes(searchTerm) ||
        item.impact.toString().includes(searchTerm) ||
        (item.meta.subject?.toLowerCase().includes(searchTerm)) ||
        (item.meta.chapter?.toLowerCase().includes(searchTerm)) ||
        (item.meta.exercise?.toLowerCase().includes(searchTerm));

      if (!matchesSearch) {
        return false;
      }
    }

    // 3. Assistant type filtering
    if (filters.type && filters.type !== 'all') {
      const assistantType = assistantTypeMapping[item.assistant] || 'unknown';

      if (Array.isArray(filters.type)) {
        if (filters.type.length && !filters.type.includes(assistantType)) {
          return false;
        }
      } else if (filters.type !== assistantType) {
        return false;
      }
    }

    // 4. Education level filtering
    if (filters.level && filters.level !== 'all') {
      const level = item.meta.level || '';

      if (Array.isArray(filters.level)) {
        if (filters.level.length > 0 && !filters.level.includes(level)) {
          return false;
        }
      } else if (filters.level !== level) {
        return false;
      }
    }

    // 5. Subject filtering
    if (filters.subjects?.length) {
      const subject = item.meta.subject || '';
      if (!filters.subjects.includes(subject)) {
        return false;
      }
    }

    // 6. Chapter filtering
    if (filters.chapters?.length) {
      const chapter = item.meta.chapter || '';
      if (!filters.chapters.includes(chapter)) {
        return false;
      }
    }

    // 7. Exercise filtering
    if (filters.exercises?.length) {
      const exercise = item.meta.exercise || '';
      if (!filters.exercises.includes(exercise)) {
        return false;
      }
    }

    // 8. Correction type filtering
    if (filters.correctionTypes?.length) {
      const matchesType = filters.correctionTypes.some(corrType =>
        item.type.includes(corrType)
      );

      if (!matchesType) {
        return false;
      }
    }

    // 9. Specific assistants filtering
    if (filters.assistants?.length) {
      if (!filters.assistants.includes(item.assistant)) {
        return false;
      }
    }

    return true; // Item passed all filters
  });
};

// Données pour la comparaison des performances avant/après réentraînement par assistant
export const assistantPerformanceComparisonData: Record<string, {
  metrics: string[];
  beforeRetraining: number[];
  afterRetraining: number[];
}> = {
  'Assistant Mathématiques': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [67, 62, 74, 81, 65],
    afterRetraining: [88, 83, 91, 87, 86]
  },
  'Assistant Recherche': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [70, 75, 68, 86, 72],
    afterRetraining: [89, 92, 84, 91, 90]
  },
  'Assistant Principal': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [68, 64, 72, 79, 70],
    afterRetraining: [87, 82, 89, 84, 88]
  },
  'Assistant Français': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [69, 66, 76, 82, 68],
    afterRetraining: [90, 85, 93, 88, 89]
  },
  'Assistant Sciences': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [71, 67, 70, 83, 69],
    afterRetraining: [91, 86, 88, 89, 87]
  },
  'Assistant Histoire-Géographie': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [65, 62, 73, 80, 66],
    afterRetraining: [84, 81, 90, 86, 85]
  },
  'Assistant Anglais': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [67, 65, 71, 82, 68],
    afterRetraining: [88, 84, 89, 87, 86]
  },
  'Assistant SVT': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [66, 64, 70, 81, 67],
    afterRetraining: [86, 83, 88, 87, 85]
  },
  'Assistant Arts Plastiques': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [63, 60, 68, 79, 64],
    afterRetraining: [82, 80, 86, 84, 83]
  },
  'Assistant Musique': {
    metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
    beforeRetraining: [64, 61, 69, 80, 65],
    afterRetraining: [83, 81, 87, 85, 84]
  }
};

// Add function to get average improvement per assistant
export const getAssistantAverageImprovement = (assistantName: string): number => {
  const data = assistantPerformanceComparisonData[assistantName];
  if (!data) return 0;

  let totalImprovement = 0;
  for (let i = 0; i < data.metrics.length; i += 1) {
    totalImprovement += data.afterRetraining[i] - data.beforeRetraining[i];
  }

  return parseFloat((totalImprovement / data.metrics.length).toFixed(1));
};

// Update filterPerformanceEvolutionData to also filter by assistant
export const filterAssistantPerformanceData = (
  assistants: string[],
  onlyTopPerforming: boolean = false
) => {
  if (!assistants || assistants.length === 0) {
    // Return all assistants data or only top performing ones
    if (onlyTopPerforming) {
      const assistantNames = Object.keys(assistantPerformanceComparisonData);
      const improvements = assistantNames.map(name => ({
        name,
        improvement: getAssistantAverageImprovement(name)
      }));

      // Sort by improvement and take top 3
      improvements.sort((a, b) => b.improvement - a.improvement);
      const topAssistants = improvements.slice(0, 3).map(item => item.name);

      return Object.fromEntries(
        Object.entries(assistantPerformanceComparisonData)
          .filter(([key]) => topAssistants.includes(key))
      );
    }
    return assistantPerformanceComparisonData;
  }

  // Filter by specified assistants
  return Object.fromEntries(
    Object.entries(assistantPerformanceComparisonData)
      .filter(([key]) => assistants.includes(key))
  );
};

// Function to get best and worst performing assistants
export const getPerformingAssistantsAnalysis = () => {
  const assistantNames = Object.keys(assistantPerformanceComparisonData);
  const improvements = assistantNames.map(name => {
    const data = assistantPerformanceComparisonData[name];

    // Calculate average values
    const beforeAvg = data.beforeRetraining.reduce((sum, val) => sum + val, 0) / data.beforeRetraining.length;
    const afterAvg = data.afterRetraining.reduce((sum, val) => sum + val, 0) / data.afterRetraining.length;
    const improvementPct = ((afterAvg - beforeAvg) / beforeAvg) * 100;

    // Find best and worst metrics
    let bestMetricIndex = 0;
    let worstMetricIndex = 0;
    let bestImprovement = data.afterRetraining[0] - data.beforeRetraining[0];
    let worstImprovement = bestImprovement;

    for (let i = 1; i < data.metrics.length; i += 1) {
      const improvement = data.afterRetraining[i] - data.beforeRetraining[i];
      if (improvement > bestImprovement) {
        bestImprovement = improvement;
        bestMetricIndex = i;
      }
      if (improvement < worstImprovement) {
        worstImprovement = improvement;
        worstMetricIndex = i;
      }
    }

    return {
      name,
      beforeAvg: parseFloat(beforeAvg.toFixed(1)),
      afterAvg: parseFloat(afterAvg.toFixed(1)),
      improvement: parseFloat((afterAvg - beforeAvg).toFixed(1)),
      improvementPct: parseFloat(improvementPct.toFixed(1)),
      bestMetric: data.metrics[bestMetricIndex],
      worstMetric: data.metrics[worstMetricIndex],
      bestImprovement,
      worstImprovement
    };
  });

  // Sort by improvement
  improvements.sort((a, b) => b.improvement - a.improvement);

  return {
    bestPerforming: improvements.slice(0, 3),
    worstPerforming: improvements.slice(-3).reverse(),
    averageImprovement: parseFloat((
      improvements.reduce((sum, item) => sum + item.improvement, 0) / improvements.length
    ).toFixed(1)),
    globalBestMetric: getMostImprovedMetric(assistantPerformanceComparisonData)
  };
};

// Function to get the most improved metric across all assistants
export const getMostImprovedMetric = (data: typeof assistantPerformanceComparisonData) => {
  const metricImprovements: Record<string, {
    totalBefore: number;
    totalAfter: number;
    count: number;
  }> = {};

  // Initialize
  const sampleMetrics = Object.values(data)[0].metrics;
  sampleMetrics.forEach(metric => {
    metricImprovements[metric] = {
      totalBefore: 0,
      totalAfter: 0,
      count: 0
    };
  });

  // Sum up values
  Object.values(data).forEach(assistant => {
    assistant.metrics.forEach((metric, index) => {
      metricImprovements[metric].totalBefore += assistant.beforeRetraining[index];
      metricImprovements[metric].totalAfter += assistant.afterRetraining[index];
      metricImprovements[metric].count += 1;
    });
  });

  // Calculate averages and improvements
  const metricsSummary = Object.entries(metricImprovements).map(([metric, values]) => {
    const beforeAvg = values.totalBefore / values.count;
    const afterAvg = values.totalAfter / values.count;
    const improvement = afterAvg - beforeAvg;
    const improvementPct = (improvement / beforeAvg) * 100;

    return {
      metric,
      beforeAvg: parseFloat(beforeAvg.toFixed(1)),
      afterAvg: parseFloat(afterAvg.toFixed(1)),
      improvement: parseFloat(improvement.toFixed(1)),
      improvementPct: parseFloat(improvementPct.toFixed(1))
    };
  });

  // Sort by improvement
  metricsSummary.sort((a, b) => b.improvement - a.improvement);

  return {
    mostImproved: metricsSummary[0],
    leastImproved: metricsSummary[metricsSummary.length - 1],
    allMetrics: metricsSummary
  };
};