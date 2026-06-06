// D:\bureau\PFA\dev\back_office\brainboost-front\brainboost-front\src\shared\_mock\_mock_taux_ai.ts

import { _mockAIAssistants } from './_ai-assistant';
import { SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS } from './_subject_relationships';

import type { 
  FilterOptions, 
  AssistantType, 
  ChartDataPoint, 
  EducationLevel, 
  FeedbackComment, 
  PerformanceStat,
  RatingDistribution,
  AssistantSatisfactionData
} from '../sections/ai/dashboard/taux/type';

// Données pour le graphique d'évolution du taux de satisfaction
export const mockSatisfactionTrend: ChartDataPoint[] = [
  { period: 'Lun', value: 85, totalResponses: 120 },
  { period: 'Mar', value: 82, totalResponses: 105 },
  { period: 'Mer', value: 88, totalResponses: 145 },
  { period: 'Jeu', value: 90, totalResponses: 130 },
  { period: 'Ven', value: 87, totalResponses: 110 },
  { period: 'Sam', value: 92, totalResponses: 90 },
  { period: 'Dim', value: 89, totalResponses: 75 },
];

// Générer des données de satisfaction pour tous les assistants, niveaux, matières et exercices
const generateAssistantData = (): AssistantSatisfactionData[] => {
  const result: AssistantSatisfactionData[] = [];

  // Récupérer tous les assistants from _mockAIAssistants
  _mockAIAssistants.forEach((assistant) => {
    // Créer une entrée pour chaque assistant
    result.push({
      name: assistant.name,
      type: assistant.type as AssistantType,
      level: (assistant.educationLevel?.toLowerCase() || 'all') as EducationLevel,
      satisfactionRate: Math.floor(75 + Math.random() * 20), // Entre 75 et 95
      totalResponses: Math.floor(100 + Math.random() * 400), // Entre 100 et 500
      totalUsers: Math.floor(50 + Math.random() * 200), // Ajout de la propriété manquante
      trend: Math.floor(Math.random() * 7) - 3, // Entre -3 et +3
    });
    
    // Pour les assistants de type "Apprentissge", ajouter des entrées supplémentaires
    if (assistant.type === 'Apprentissge' && assistant.subject) {
      // Ajouter des entrées pour chaque niveau
      const levels = ['cp', 'ce1', 'ce2', 'cm1', 'cm2'];
      levels.forEach((level) => {
        if (level !== assistant.educationLevel?.toLowerCase()) {
          result.push({
            name: `${assistant.name} (${level.toUpperCase()})`,
            type: assistant.type as AssistantType,
            level: level as EducationLevel,
            satisfactionRate: Math.floor(75 + Math.random() * 20),
            totalResponses: Math.floor(50 + Math.random() * 200),
            totalUsers: Math.floor(25 + Math.random() * 100), // Ajout de la propriété manquante
            trend: Math.floor(Math.random() * 7) - 3,
          });
        }
      });
      
      // Même correction à faire pour les autres entrées
      ['Mathématiques', 'Français', 'Histoire', 'Géographie', 'Anglais'].forEach((subject) => {
        if (subject !== assistant.subject) {
          result.push({
            name: `${assistant.name} (${subject})`,
            type: assistant.type as AssistantType,
            level: (assistant.educationLevel?.toLowerCase() || 'all') as EducationLevel,
            satisfactionRate: Math.floor(75 + Math.random() * 20),
            totalResponses: Math.floor(50 + Math.random() * 200),
            totalUsers: Math.floor(25 + Math.random() * 100), // Ajout de la propriété manquante
            trend: Math.floor(Math.random() * 7) - 3,
          });
          
          // Pour chaque matière, ajouter des entrées pour chaque chapitre
          if (SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject as keyof typeof SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS]) {
            const chapters = Object.keys(SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject as keyof typeof SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS]);
            
            chapters.forEach((chapter) => {
              result.push({
                name: `${assistant.name} (${subject} - ${chapter})`,
                type: assistant.type as AssistantType,
                level: (assistant.educationLevel?.toLowerCase() || 'all') as EducationLevel,
                satisfactionRate: Math.floor(75 + Math.random() * 20),
                totalResponses: Math.floor(30 + Math.random() * 100),
                totalUsers: Math.floor(15 + Math.random() * 50), // Ajout de la propriété manquante
                trend: Math.floor(Math.random() * 7) - 3,
              });
            });
          }
        }
      });
    }
  });

  return result;
};
export const mockAssistantComparison: AssistantSatisfactionData[] = generateAssistantData();

// Fonction pour filtrer les données des assistants en fonction des filtres
export const filterAssistantData = (filters: FilterOptions): AssistantSatisfactionData[] => {
  let filteredData = [...mockAssistantComparison];
  
  // Filtrer par type d'assistant
  if (filters.types && !filters.types.includes('all')) {
    filteredData = filteredData.filter(assistant => 
      filters.types.includes(assistant.type)
    );
  }
  
  // Filtrer par niveau
  if (filters.levels && !filters.levels.includes('all')) {
    filteredData = filteredData.filter(assistant => 
      filters.levels.includes(assistant.level)
    );
  }
  
  // Filtrer par matière
  if (filters.subjects && filters.subjects.length > 0) {
    filteredData = filteredData.filter(assistant => {
      // Si on a au moins une matière sélectionnée
      const subjectMatches = filters.subjects?.some(subject => 
        assistant.name.includes(subject)
      );
      return subjectMatches || false;
    });
  }
  
  // Filtrer par chapitre
  if (filters.chapters && filters.chapters.length > 0) {
    filteredData = filteredData.filter(assistant => {
      // Si on a au moins un chapitre sélectionné
      const chapterMatches = filters.chapters?.some(chapter => 
        assistant.name.includes(chapter)
      );
      return chapterMatches || false;
    });
  }
  
  // Filtrer par exercice
  if (filters.exercises && filters.exercises.length > 0) {
    filteredData = filteredData.filter(assistant => {
      // Si on a au moins un exercice sélectionné
      const exerciseMatches = filters.exercises?.some(exercise => 
        assistant.name.includes(exercise)
      );
      return exerciseMatches || false;
    });
  }
  
  // Si on a trop de résultats, ne garder que les 10 premiers
  if (filteredData.length > 10) {
    filteredData = filteredData.sort((a, b) => b.satisfactionRate - a.satisfactionRate).slice(0, 10);
  }
  
  return filteredData;
};

export const mockRatingDistribution: RatingDistribution[] = [
  { rating: 5, count: 420, percentage: 42 },
  { rating: 4, count: 350, percentage: 35 },
  { rating: 3, count: 150, percentage: 15 },
  { rating: 2, count: 50, percentage: 5 },
  { rating: 1, count: 30, percentage: 3 },
];

export const mockRecentFeedbacks: FeedbackComment[] = [
  { id: 'fb1', date: '2025-03-28', assistant: 'Apprentissge', rating: 5, comment: 'Explication très claire des règles de division!', tags: ['clair', 'utile'], educationLevel: 'CM1', subject: 'Mathématiques', chapter: 'Multiplications et Divisions', exercise: 'exercice-division-1' },
  { id: 'fb2', date: '2025-03-27', assistant: 'Apprentissge', rating: 3, comment: 'Explication un peu compliquée pour mon niveau.', tags: ['difficile', 'confus'], educationLevel: 'CE1', subject: 'Français', chapter: 'Grammaire de Base', exercise: 'exercice-grammaire-1' },
  { id: 'fb3', date: '2025-03-26', assistant: 'accueil', rating: 4, comment: 'Aide utile pour naviguer sur la plateforme!', tags: ['utile', 'efficace'], educationLevel: null, subject: null, chapter: null, exercise: null },
  { id: 'fb4', date: '2025-03-26', assistant: 'Apprentissge', rating: 5, comment: 'Parfait pour comprendre la notion de périmètre!', tags: ['parfait', 'clair'], educationLevel: 'CM2', subject: 'Mathématiques', chapter: 'Géométrie de Base', exercise: 'exercice-mesures-1' },
  { id: 'fb5', date: '2025-03-25', assistant: 'recherche', rating: 2, comment: 'Résultats de recherche pas assez précis.', tags: ['imprécis', 'à améliorer'], educationLevel: null, subject: null, chapter: null, exercise: null },
  { id: 'fb6', date: '2025-03-25', assistant: 'Apprentissge', rating: 4, comment: 'Explications claires, mais pourrait être plus interactif.', tags: ['clair', 'améliorable'], educationLevel: 'CP', subject: 'Mathématiques', chapter: 'Additions et Soustractions', exercise: 'exercice-addition-1' },
  { id: 'fb7', date: '2025-03-24', assistant: 'recherche', rating: 5, comment: 'Réponse rapide et précise, très satisfait!', tags: ['rapide', 'précis'], educationLevel: null, subject: null, chapter: null, exercise: null },
  { id: 'fb8', date: '2025-03-23', assistant: 'Apprentissge', rating: 4, comment: 'Bonne explication des conjugaisons.', tags: ['utile', 'éducatif'], educationLevel: 'CE2', subject: 'Français', chapter: 'Grammaire de Base', exercise: 'exercice-conjugaison-1' },
  { id: 'fb9', date: '2025-03-22', assistant: 'Apprentissge', rating: 1, comment: 'Je n\'ai pas du tout compris l\'explication des fractions.', tags: ['confus', 'difficile'], educationLevel: 'CM1', subject: 'Mathématiques', chapter: 'Problèmes Simples', exercise: 'exercice-probleme-2' },
  { id: 'fb10', date: '2025-03-21', assistant: 'Apprentissge', rating: 3, comment: 'Moyen, il manque des exemples concrets.', tags: ['moyen', 'incomplet'], educationLevel: 'CE2', subject: 'Histoire', chapter: 'Moyen Âge', exercise: 'exercice-moyen-age-1' },
  { id: 'fb11', date: '2025-03-20', assistant: 'accueil', rating: 5, comment: 'Super guide pour découvrir la plateforme!', tags: ['utile', 'intuitif'], educationLevel: null, subject: null, chapter: null, exercise: null },
  { id: 'fb12', date: '2025-03-19', assistant: 'Apprentissge', rating: 4, comment: 'Bon exercice de vocabulaire, mais un peu court.', tags: ['bon', 'court'], educationLevel: 'CE1', subject: 'Français', chapter: 'Vocabulaire', exercise: 'exercice-vocabulaire-1' },
  { id: 'fb13', date: '2025-03-18', assistant: 'Apprentissge', rating: 5, comment: 'Excellente aide pour apprendre les couleurs en anglais!', tags: ['excellent', 'interactif'], educationLevel: 'CP', subject: 'Anglais', chapter: 'Nombres et Couleurs', exercise: 'exercice-couleurs-1' },
  { id: 'fb14', date: '2025-03-17', assistant: 'recherche', rating: 3, comment: 'Recherche fonctionnelle mais pourrait être plus rapide.', tags: ['fonctionnel', 'lent'], educationLevel: null, subject: null, chapter: null, exercise: null },
  { id: 'fb15', date: '2025-03-16', assistant: 'Apprentissge', rating: 2, comment: 'Pas assez d\'explications sur l\'Europe.', tags: ['insuffisant', 'incomplet'], educationLevel: 'CM2', subject: 'Géographie', chapter: 'LEurope', exercise: 'exercice-europe-1' },
  { id: 'fb16', date: '2025-03-15', assistant: 'Apprentissge', rating: 5, comment: 'Explication parfaite de la préhistoire!', tags: ['parfait', 'intéressant'], educationLevel: 'CE2', subject: 'Histoire', chapter: 'Préhistoire et Antiquité', exercise: 'exercice-prehistoire-1' },
  { id: 'fb17', date: '2025-03-14', assistant: 'Apprentissge', rating: 4, comment: 'Bon exercice sur les formes géométriques.', tags: ['utile', 'visuel'], educationLevel: 'CP', subject: 'Mathématiques', chapter: 'Géométrie de Base', exercise: 'exercice-formes-1' },
  { id: 'fb18', date: '2025-03-13', assistant: 'accueil', rating: 3, comment: 'Interface correcte mais navigation perfectible.', tags: ['correct', 'améliorable'], educationLevel: null, subject: null, chapter: null, exercise: null },
  { id: 'fb19', date: '2025-03-12', assistant: 'Apprentissge', rating: 5, comment: 'Excellent pour apprendre les nombres en anglais!', tags: ['excellent', 'pratique'], educationLevel: 'CE1', subject: 'Anglais', chapter: 'Nombres et Couleurs', exercise: 'exercice-nombres-1' },
  { id: 'fb20', date: '2025-03-11', assistant: 'Apprentissge', rating: 1, comment: 'Explication trop compliquée pour la Renaissance.', tags: ['compliqué', 'confus'], educationLevel: 'CM1', subject: 'Histoire', chapter: 'Renaissance', exercise: 'exercice-renaissance-1' },
  { id: 'fb21', date: '2025-03-10', assistant: 'Apprentissge', rating: 4, comment: 'Bonne aide pour la lecture!', tags: ['utile', 'progressif'], educationLevel: 'CP', subject: 'Français', chapter: 'Lecture et Compréhension', exercise: 'exercice-lecture-1' },
  { id: 'fb22', date: '2025-03-09', assistant: 'recherche', rating: 5, comment: 'Recherche très efficace pour trouver les ressources.', tags: ['efficace', 'rapide'], educationLevel: null, subject: null, chapter: null, exercise: null },
  { id: 'fb23', date: '2025-03-08', assistant: 'Apprentissge', rating: 3, comment: 'Exercice sur la France moyennement intéressant.', tags: ['moyen', 'basique'], educationLevel: 'CM2', subject: 'Géographie', chapter: 'La France', exercise: 'exercice-france-1' },
  { id: 'fb24', date: '2025-03-07', assistant: 'Apprentissge', rating: 5, comment: 'Super pour apprendre les premiers mots en anglais!', tags: ['super', 'ludique'], educationLevel: 'CP', subject: 'Anglais', chapter: 'Salutations et Présentations', exercise: 'exercice-salutations-1' },
  { id: 'fb25', date: '2025-03-06', assistant: 'Apprentissge', rating: 4, comment: 'Bonnes explications, mais pourrait être plus concises.', tags: ['utile', 'concis'], educationLevel: 'CM1', subject: 'Mathématiques', chapter: 'Problèmes Simples', exercise: 'exercice-probleme-1' }
];

export const mockPerformanceStats: PerformanceStat[] = [
  { id: 'totalFeedbacks', label: 'Total des feedbacks', value: 1000, unit: '', change: 5, changeDirection: 'up' },
  { id: 'satisfactionRate', label: 'Taux de satisfaction global', value: 87, unit: '%', change: 2, changeDirection: 'up' },
  { id: 'dissatisfactionRate', label: 'Taux d\'insatisfaction', value: 8, unit: '%', change: 1, changeDirection: 'down' },
  { id: 'noResponseFeedbacks', label: 'Feedbacks sans réponse', value: 50, unit: '', change: 10, changeDirection: 'down' },
];