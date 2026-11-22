// D:\bureau\PFA\dev\back_office\brainboost-front\brainboost-front\src\shared\_mock\_exercise_performance.ts

import { SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS } from './_subject_relationships';
import { AI_ASSISTANT_TYPE_OPTIONS , AI_ASSISTANT_EDUCATION_LEVELS  } from './_ai-assistant';

// Types pour les données de performance
export interface ExercisePerformance {
  exerciseId: string;
  exerciseName: string;
  chapterId: string;
  chapterName: string;
  subjectId: string;
  subjectName: string;
  educationLevel: string;
  beforeCorrection: number;
  afterCorrection: number;
  improvementPercentage: number;
  impact: number;
  lastUpdated: string;
}

export interface AssistantTypePerformance {
    type: string;
    typeName: string;
    educationLevel: string;
    beforeCorrection: number;
    afterCorrection: number;
    improvementPercentage: number;
    impact: number;
    lastUpdated: string;
}

// Type pour regrouper les performances par niveau d'éducation
export interface PerformanceByLevel {
  [level: string]: ExercisePerformance[];
}

// Type pour regrouper les performances par matière
export interface PerformanceBySuject {
  [subject: string]: ExercisePerformance[];
}

// Type pour regrouper les performances par chapitre
export interface PerformanceByChapter {
  [chapter: string]: ExercisePerformance[];
}

// Type pour regrouper les performances par exercice
export interface PerformanceByExercise {
  [exercise: string]: ExercisePerformance[];
}

// Noms complets des exercices pour l'affichage
const exerciseLabels: Record<string, string> = {
  // Mathématiques
  'exercice-addition-1': 'Addition des nombres à 1 chiffre',
  'exercice-soustraction-1': 'Soustraction des nombres à 1 chiffre',
  'exercice-multiplication-1': 'Tables de multiplication de 1 à 5',
  'exercice-division-1': 'Division simple avec reste',
  'exercice-formes-1': 'Reconnaissance des formes géométriques',
  'exercice-mesures-1': 'Mesures de longueur',
  'exercice-probleme-1': 'Problèmes d\'addition et soustraction',
  'exercice-probleme-2': 'Problèmes de partage',

  // Français
  'exercice-lecture-1': 'Lecture de textes courts',
  'exercice-comprehension-1': 'Compréhension de texte',
  'exercice-ecriture-1': 'Écriture de phrases simples',
  'exercice-orthographe-1': 'Orthographe des mots courants',
  'exercice-grammaire-1': 'Identification des noms et verbes',
  'exercice-conjugaison-1': 'Conjugaison au présent',
  'exercice-vocabulaire-1': 'Vocabulaire des animaux',
  'exercice-vocabulaire-2': 'Vocabulaire de l\'école',

  // Histoire
  'exercice-prehistoire-1': 'La vie des hommes préhistoriques',
  'exercice-antiquite-1': 'L\'Égypte ancienne',
  'exercice-moyen-age-1': 'Les châteaux forts',
  'exercice-moyen-age-2': 'La vie au Moyen Âge',
  'exercice-renaissance-1': 'Les grandes découvertes',
  'exercice-renaissance-2': 'Les inventions importantes',
  'exercice-revolution-1': 'La prise de la Bastille',
  'exercice-revolution-2': 'Les symboles de la République',

  // Géographie
  'exercice-village-1': 'Mon village ou ma ville',
  'exercice-region-1': 'Ma région et ses caractéristiques',
  'exercice-france-1': 'Les régions de France',
  'exercice-france-2': 'Les grandes villes françaises',
  'exercice-europe-1': 'Les pays voisins de la France',
  'exercice-europe-2': 'Les capitales européennes',
  'exercice-monde-1': 'Les continents et les océans',
  'exercice-monde-2': 'Climats et paysages du monde',

  // Anglais
  'exercice-salutations-1': 'Dire bonjour et au revoir',
  'exercice-presentations-1': 'Se présenter en anglais',
  'exercice-nombres-1': 'Compter jusqu\'à 20',
  'exercice-couleurs-1': 'Les couleurs en anglais',
  'exercice-animaux-1': 'Les animaux domestiques et sauvages',
  'exercice-aliments-1': 'La nourriture et les boissons',
  'exercice-phrases-1': 'Construire des phrases simples',
  'exercice-phrases-2': 'Poser des questions'
};

// Générer des données de performance aléatoires mais cohérentes pour chaque exercice
const generatePerformanceData = (): ExercisePerformance[] => {
  const performanceData: ExercisePerformance[] = [];
  const now = new Date();

  // Pour chaque niveau d'éducation
  AI_ASSISTANT_EDUCATION_LEVELS.forEach((levelOption, levelIndex) => {
    const level = levelOption.value;

    // Pour chaque matière
    Object.entries(SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS).forEach(([subject, chapters], subjectIndex) => {

      // Pour chaque chapitre
      Object.entries(chapters).forEach(([chapter, exercises], chapterIndex) => {

        // Pour chaque exercice
        exercises.forEach((exercise, exerciseIndex) => {
          // Générer des valeurs cohérentes
          // Les performances s'améliorent avec le niveau d'éducation
          const basePerformance = 50 + (levelIndex * 5);

          // Avant correction (entre 50% et 75%)
          const beforeCorrection = Math.min(75, basePerformance + Math.floor(Math.random() * 10));

          // Après correction (amélioration de 10-25%)
          const improvement = 10 + Math.floor(Math.random() * 15);
          const afterCorrection = Math.min(98, beforeCorrection + improvement);

          // Impact (pourcentage d'amélioration)
          const impact = ((afterCorrection - beforeCorrection) / beforeCorrection) * 100;

          // Date mise à jour (entre 1 et 30 jours en arrière)
          const lastUpdated = new Date(now);
          lastUpdated.setDate(now.getDate() - Math.floor(Math.random() * 30));

          performanceData.push({
            exerciseId: exercise,
            exerciseName: exerciseLabels[exercise] || exercise,
            chapterId: chapter,
            chapterName: chapter,
            subjectId: subject,
            subjectName: subject,
            educationLevel: level,
            beforeCorrection,
            afterCorrection,
            improvementPercentage: improvement,
            impact: parseFloat(impact.toFixed(2)),
            lastUpdated: lastUpdated.toISOString()
          });
        });
      });
    });
  });

  return performanceData;
};

// Générer des données de performance par type d'assistant
export const generateAssistantTypePerformanceData = (): AssistantTypePerformance[] => {
    const performanceData: AssistantTypePerformance[] = [];
    const now = new Date();

    // Pour chaque niveau d'éducation
    AI_ASSISTANT_EDUCATION_LEVELS.forEach((levelOption, levelIndex) => {
      const level = levelOption.value;

      // Pour chaque type d'assistant
      AI_ASSISTANT_TYPE_OPTIONS.forEach((typeOption, typeIndex) => {
        const type = typeOption.value;

        // Générer des valeurs cohérentes
        // Les performances de base varient selon le type d'assistant
        let basePerformance = 50 + (levelIndex * 5);

        // Ajuster la performance de base selon le type d'assistant
        if (type === 'accueil') basePerformance += 5;
        else if (type === 'recherche') basePerformance += 8;

        // Avant correction (entre 50% et 75%)
        const beforeCorrection = Math.min(75, basePerformance + Math.floor(Math.random() * 10));

        // Après correction (amélioration de 10-25%)
        const improvement = 10 + Math.floor(Math.random() * 15);
        const afterCorrection = Math.min(98, beforeCorrection + improvement);

        // Impact (pourcentage d'amélioration)
        const impact = ((afterCorrection - beforeCorrection) / beforeCorrection) * 100;

        // Date mise à jour (entre 1 et 30 jours en arrière)
        const lastUpdated = new Date(now);
        lastUpdated.setDate(now.getDate() - Math.floor(Math.random() * 30));

        performanceData.push({
          type,
          typeName: typeOption.label,
          educationLevel: level,
          beforeCorrection,
          afterCorrection,
          improvementPercentage: improvement,
          impact: parseFloat(impact.toFixed(2)),
          lastUpdated: lastUpdated.toISOString()
        });
      });
    });

    return performanceData;
};

export const assistantTypePerformanceData = generateAssistantTypePerformanceData();

// Indexer les données pour un accès plus rapide
export const performanceByAssistantType: Record<string, AssistantTypePerformance[]> = {};
export const performanceByAssistantTypeAndLevel: Record<string, Record<string, AssistantTypePerformance[]>> = {};

// Générer l'ensemble des données de performance
export const exercisePerformanceData = generatePerformanceData();

// Indexer les données pour un accès plus rapide
export const performanceByLevel: PerformanceByLevel = {};
export const performanceBySubject: PerformanceBySuject = {};
export const performanceByChapter: PerformanceByChapter = {};
export const performanceByExercise: PerformanceByExercise = {};

// Créer les index pour les performances par type d'assistant
assistantTypePerformanceData.forEach(item => {
    // Par type d'assistant
    if (!performanceByAssistantType[item.type]) {
      performanceByAssistantType[item.type] = [];
    }
    performanceByAssistantType[item.type].push(item);

    // Par type d'assistant et niveau
    if (!performanceByAssistantTypeAndLevel[item.type]) {
      performanceByAssistantTypeAndLevel[item.type] = {};
    }

    if (!performanceByAssistantTypeAndLevel[item.type][item.educationLevel]) {
      performanceByAssistantTypeAndLevel[item.type][item.educationLevel] = [];
    }

    performanceByAssistantTypeAndLevel[item.type][item.educationLevel].push(item);
});

// Ajoutez cette fonction à la fin du fichier
/**
 * Récupère les performances moyennes par type d'assistant
 * @returns Données pour un graphique comparant les types d'assistants
 */
export const getAssistantTypePerformanceData = (level?: string) => {
    const result: Record<string, { before: number, after: number, improvement: number }> = {};

    // Pour chaque type d'assistant
    AI_ASSISTANT_TYPE_OPTIONS.forEach(option => {
      const typeData = level
        ? (performanceByAssistantTypeAndLevel[option.value] || {})[level] || []
        : performanceByAssistantType[option.value] || [];

      if (typeData.length > 0) {
        const avgBefore = typeData.reduce((sum, item) => sum + item.beforeCorrection, 0) / typeData.length;
        const avgAfter = typeData.reduce((sum, item) => sum + item.afterCorrection, 0) / typeData.length;
        const avgImprovement = typeData.reduce((sum, item) => sum + item.improvementPercentage, 0) / typeData.length;

        result[option.label] = {
          before: parseFloat(avgBefore.toFixed(1)),
          after: parseFloat(avgAfter.toFixed(1)),
          improvement: parseFloat(avgImprovement.toFixed(1))
        };
      }
    });

    return {
      labels: Object.keys(result),
      beforeCorrection: Object.values(result).map(v => v.before),
      afterCorrection: Object.values(result).map(v => v.after),
      improvement: Object.values(result).map(v => v.improvement)
    };
};

// Création des index
exercisePerformanceData.forEach(item => {
  // Par niveau
  if (!performanceByLevel[item.educationLevel]) {
    performanceByLevel[item.educationLevel] = [];
  }
  performanceByLevel[item.educationLevel].push(item);

  // Par matière
  if (!performanceBySubject[item.subjectId]) {
    performanceBySubject[item.subjectId] = [];
  }
  performanceBySubject[item.subjectId].push(item);

  // Par chapitre
  if (!performanceByChapter[item.chapterId]) {
    performanceByChapter[item.chapterId] = [];
  }
  performanceByChapter[item.chapterId].push(item);

  // Par exercice
  if (!performanceByExercise[item.exerciseId]) {
    performanceByExercise[item.exerciseId] = [];
  }
  performanceByExercise[item.exerciseId].push(item);
});

/**
 * Récupère les données de performance filtrées selon différents critères
 * @param filters Critères de filtrage
 * @returns Données de performance filtrées
 */
export const getFilteredExercisePerformance = (filters: {
  level?: string | string[];
  subject?: string | string[];
  chapter?: string | string[];
  exercise?: string | string[];
  startDate?: Date | null;
  endDate?: Date | null;
}): ExercisePerformance[] => {
  let filteredData = [...exercisePerformanceData];

  // Filtrer par niveau
  if (filters.level) {
    const levels = Array.isArray(filters.level) ? filters.level : [filters.level];
    if (levels.length > 0 && !levels.includes('all')) {
      filteredData = filteredData.filter(item => levels.includes(item.educationLevel));
    }
  }

  // Filtrer par matière
  if (filters.subject) {
    const subjects = Array.isArray(filters.subject) ? filters.subject : [filters.subject];
    if (subjects.length > 0 && !subjects.includes('all')) {
      filteredData = filteredData.filter(item => subjects.includes(item.subjectId));
    }
  }

  // Filtrer par chapitre
  if (filters.chapter) {
    const chapters = Array.isArray(filters.chapter) ? filters.chapter : [filters.chapter];
    if (chapters.length > 0) {
      filteredData = filteredData.filter(item => chapters.includes(item.chapterId));
    }
  }

  // Filtrer par exercice
  if (filters.exercise) {
    const exercises = Array.isArray(filters.exercise) ? filters.exercise : [filters.exercise];
    if (exercises.length > 0) {
      filteredData = filteredData.filter(item => exercises.includes(item.exerciseId));
    }
  }

  // Filtrer par date
  if (filters.startDate) {
    const startDate = new Date(filters.startDate);
    filteredData = filteredData.filter(item => new Date(item.lastUpdated) >= startDate);
  }

  if (filters.endDate) {
    const endDate = new Date(filters.endDate);
    filteredData = filteredData.filter(item => new Date(item.lastUpdated) <= endDate);
  }

  return filteredData;
};

/**
 * Récupère les performances moyennes par niveau
 * @returns Objet avec les moyennes par niveau
 */
export const getAveragePerformanceByLevel = () => {
  const result: Record<string, { before: number, after: number, improvement: number }> = {};

  Object.entries(performanceByLevel).forEach(([level, data]) => {
    const avgBefore = data.reduce((sum, item) => sum + item.beforeCorrection, 0) / data.length;
    const avgAfter = data.reduce((sum, item) => sum + item.afterCorrection, 0) / data.length;
    const avgImprovement = data.reduce((sum, item) => sum + item.improvementPercentage, 0) / data.length;

    result[level] = {
      before: parseFloat(avgBefore.toFixed(1)),
      after: parseFloat(avgAfter.toFixed(1)),
      improvement: parseFloat(avgImprovement.toFixed(1))
    };
  });

  return result;
};

/**
 * Récupère les performances moyennes par matière
 * @returns Objet avec les moyennes par matière
 */
export const getAveragePerformanceBySubject = () => {
  const result: Record<string, { before: number, after: number, improvement: number }> = {};

  Object.entries(performanceBySubject).forEach(([subject, data]) => {
    const avgBefore = data.reduce((sum, item) => sum + item.beforeCorrection, 0) / data.length;
    const avgAfter = data.reduce((sum, item) => sum + item.afterCorrection, 0) / data.length;
    const avgImprovement = data.reduce((sum, item) => sum + item.improvementPercentage, 0) / data.length;

    result[subject] = {
      before: parseFloat(avgBefore.toFixed(1)),
      after: parseFloat(avgAfter.toFixed(1)),
      improvement: parseFloat(avgImprovement.toFixed(1))
    };
  });

  return result;
};

/**
 * Récupère les exercices ayant le plus progressé
 * @param limit Nombre d'exercices à récupérer
 * @returns Liste des exercices triés par amélioration
 */
export const getTopImprovingExercises = (limit: number = 10) =>
  [...exercisePerformanceData]
    .sort((a, b) => b.impact - a.impact)
    .slice(0, limit);


/**
 * Récupère les données d'évolution des performances pour un chapitre spécifique
 * @param chapterId ID du chapitre
 * @param level Niveau d'éducation (optionnel)
 * @returns Données formatées pour un graphique d'évolution
 */
export const getChapterPerformanceEvolution = (chapterId: string, level?: string) => {
  let chapterData = performanceByChapter[chapterId] || [];

  // Filtrer par niveau si spécifié
  if (level) {
    chapterData = chapterData.filter(item => item.educationLevel === level);
  }

  // Trier par exercice
  const sortedData = [...chapterData].sort((a, b) => a.exerciseId.localeCompare(b.exerciseId));

  return {
    labels: sortedData.map(item => item.exerciseName),
    beforeCorrection: sortedData.map(item => item.beforeCorrection),
    afterCorrection: sortedData.map(item => item.afterCorrection),
    improvement: sortedData.map(item => item.improvementPercentage)
  };
};

/**
 * Récupère les données de performance pour un exercice spécifique par niveau
 * @param exerciseId ID de l'exercice
 * @returns Données de performance par niveau pour cet exercice
 */
export const getExercisePerformanceByLevel = (exerciseId: string) => {
  const exerciseData = performanceByExercise[exerciseId] || [];
  const sortedData = [...exerciseData].sort((a, b) => a.educationLevel.localeCompare(b.educationLevel));

  return {
    labels: sortedData.map(item => item.educationLevel),
    beforeCorrection: sortedData.map(item => item.beforeCorrection),
    afterCorrection: sortedData.map(item => item.afterCorrection),
    improvement: sortedData.map(item => item.improvementPercentage)
  };
};

/**
 * Récupère les données pour un graphique de performance comparant avant/après pour un sujet spécifique
 * @param level Niveau d'éducation
 * @param subject Matière
 * @returns Données pour un graphique de comparaison
 */
export const getSubjectComparisonData = (level: string, subject: string) => {
  const filteredData = exercisePerformanceData.filter(
    item => item.educationLevel === level && item.subjectId === subject
  );

  // Regrouper par chapitre
  const chapterData: Record<string, { before: number[], after: number[] }> = {};

  filteredData.forEach(item => {
    if (!chapterData[item.chapterName]) {
      chapterData[item.chapterName] = { before: [], after: [] };
    }

    chapterData[item.chapterName].before.push(item.beforeCorrection);
    chapterData[item.chapterName].after.push(item.afterCorrection);
  });

  // Calculer les moyennes par chapitre
  const result = {
    chapters: Object.keys(chapterData),
    beforeCorrection: Object.values(chapterData).map(data =>
      parseFloat((data.before.reduce((sum, val) => sum + val, 0) / data.before.length).toFixed(1))
    ),
    afterCorrection: Object.values(chapterData).map(data =>
      parseFloat((data.after.reduce((sum, val) => sum + val, 0) / data.after.length).toFixed(1))
    )
  };

  return result;
};

// Structure pour les métriques de performance d'exercice
export interface ExercisePerformanceMetrics {
  metrics: string[];
  beforeRetraining: number[];
  afterRetraining: number[];
}

// Données de performance par exercice
export const exercisePerformanceMetricsData: Record<string, ExercisePerformanceMetrics> = {};

// Initialiser les données de métriques pour chaque exercice
export const initializeExercisePerformanceMetrics = () => {
  exercisePerformanceData.forEach(exercise => {
    // Créer une clé unique pour chaque exercice (combinant matière, chapitre, exercice et niveau)
    const key = `${exercise.subjectId}_${exercise.chapterId}_${exercise.exerciseId}_${exercise.educationLevel}`;

    // Générer des valeurs de performance cohérentes avec les autres données
    const baseBeforeValue = exercise.beforeCorrection; // Valeur de base avant entraînement

    // Générer des valeurs aléatoires mais cohérentes pour chaque métrique
    exercisePerformanceMetricsData[key] = {
      metrics: ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'],
      beforeRetraining: [
        Math.round(baseBeforeValue * (0.9 + Math.random() * 0.2)), // Précision
        Math.round(baseBeforeValue * (0.85 + Math.random() * 0.2)), // Pertinence
        Math.round(baseBeforeValue * (0.95 + Math.random() * 0.15)), // Clarté
        Math.round(70 + Math.random() * 15), // Temps de réponse (échelle différente)
        Math.round(baseBeforeValue * (0.92 + Math.random() * 0.18)), // Satisfaction
      ],
      afterRetraining: [
        Math.round(exercise.afterCorrection * (0.95 + Math.random() * 0.1)), // Précision
        Math.round(exercise.afterCorrection * (0.9 + Math.random() * 0.15)), // Pertinence
        Math.round(exercise.afterCorrection * (0.98 + Math.random() * 0.07)), // Clarté
        Math.round(80 + Math.random() * 10), // Temps de réponse amélioré
        Math.round(exercise.afterCorrection * (0.96 + Math.random() * 0.09)), // Satisfaction
      ]
    };
  });
};

// Exécuter l'initialisation
initializeExercisePerformanceMetrics();

// Fonction pour obtenir les métriques de performance d'un exercice spécifique
export const getExercisePerformanceMetrics = (
  subjectId: string,
  chapterId: string,
  exerciseId: string,
  educationLevel?: string
): ExercisePerformanceMetrics[] => {
  // Si niveau spécifié, renvoyer seulement les données pour ce niveau
  if (educationLevel) {
    const key = `${subjectId}_${chapterId}_${exerciseId}_${educationLevel}`;
    return exercisePerformanceMetricsData[key] ? [exercisePerformanceMetricsData[key]] : [];
  }

  // Sinon, récupérer toutes les données pour cet exercice à travers tous les niveaux
  const result: ExercisePerformanceMetrics[] = [];

  Object.keys(exercisePerformanceMetricsData).forEach(key => {
    if (key.startsWith(`${subjectId}_${chapterId}_${exerciseId}`)) {
      result.push(exercisePerformanceMetricsData[key]);
    }
  });

  return result;
};

// Fonction pour obtenir les métriques moyennes de performance par matière
// Fonction pour obtenir les métriques moyennes de performance par matière
export const getSubjectPerformanceMetrics = (subjectId: string): ExercisePerformanceMetrics => {
  const metricsData: number[][] = [[], [], [], [], []]; // Un tableau pour chaque métrique
  const metrics = ['Précision', 'Pertinence', 'Clarté', 'Temps de réponse', 'Satisfaction globale'];

  // Collecter toutes les données pour cette matière
  Object.keys(exercisePerformanceMetricsData).forEach(key => {
    if (key.startsWith(`${subjectId}_`)) {
      const data = exercisePerformanceMetricsData[key];

      // Ajouter les valeurs de chaque métrique aux tableaux correspondants
      data.metrics.forEach((_, i) => {
        metricsData[i].push(data.beforeRetraining[i]);
      });
    }
  });

  // Calculer les moyennes
  const beforeRetraining = metricsData.map(values =>
    Math.round(values.reduce((sum, val) => sum + val, 0) / (values.length || 1))
  );

  // Calculer les valeurs après entraînement (amélioration de 15-25%)
  const afterRetraining = beforeRetraining.map(val =>
    Math.min(100, Math.round(val * (1 + (0.15 + Math.random() * 0.1))))
  );

  return {
    metrics,
    beforeRetraining,
    afterRetraining
  };
};