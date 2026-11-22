// D:\bureau\PFA\dev\back_office\brainboost-front\brainboost-front\src\shared\_mock\_subject_relationships.ts

// Type pour les matières disponibles
type SubjectName = 'Mathématiques' | 'Français' | 'Histoire' | 'Géographie' | 'Anglais';

// Type pour la structure des relations
type ChapterExerciseMap = Record<string, string[]>;
type SubjectChapterMap = Record<SubjectName, ChapterExerciseMap>;

// Structure qui définit les relations entre matières, chapitres et exercices
export const SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS: SubjectChapterMap = {
    // Mathématiques
    'Mathématiques': {
      'Additions et Soustractions': ['exercice-addition-1', 'exercice-soustraction-1'],
      'Multiplications et Divisions': ['exercice-multiplication-1', 'exercice-division-1'],
      'Géométrie de Base': ['exercice-formes-1', 'exercice-mesures-1'],
      'Problèmes Simples': ['exercice-probleme-1', 'exercice-probleme-2'],
    },
    // Français
    'Français': {
      'Lecture et Compréhension': ['exercice-lecture-1', 'exercice-comprehension-1'],
      'Écriture et Orthographe': ['exercice-ecriture-1', 'exercice-orthographe-1'],
      'Grammaire de Base': ['exercice-grammaire-1', 'exercice-conjugaison-1'],
      'Vocabulaire': ['exercice-vocabulaire-1', 'exercice-vocabulaire-2'],
    },
    // Histoire
    'Histoire': {
      'Préhistoire et Antiquité': ['exercice-prehistoire-1', 'exercice-antiquite-1'],
      'Moyen Âge': ['exercice-moyen-age-1', 'exercice-moyen-age-2'],
      'Renaissance': ['exercice-renaissance-1', 'exercice-renaissance-2'],
      'Révolution Française': ['exercice-revolution-1', 'exercice-revolution-2'],
    },
    // Géographie
    'Géographie': {
      'Mon Village et Ma Région': ['exercice-village-1', 'exercice-region-1'],
      'La France': ['exercice-france-1', 'exercice-france-2'],
      'LEurope': ['exercice-europe-1', 'exercice-europe-2'],
      'Le Monde': ['exercice-monde-1', 'exercice-monde-2'],
    },
    // Anglais
    'Anglais': {
      'Salutations et Présentations': ['exercice-salutations-1', 'exercice-presentations-1'],
      'Nombres et Couleurs': ['exercice-nombres-1', 'exercice-couleurs-1'],
      'Animaux et Aliments': ['exercice-animaux-1', 'exercice-aliments-1'],
      'Phrases Simples': ['exercice-phrases-1', 'exercice-phrases-2'],
    },
};
// Helper pour obtenir tous les chapitres d'une matière donnée
export const getChaptersBySubject = (subject: string): string[] => {
  // Vérifier si la matière existe dans notre structure
  if (isValidSubject(subject) && SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject as SubjectName]) {
    return Object.keys(SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject as SubjectName]);
  }
  return [];
};

// Fonction pour vérifier si une chaîne est une matière valide
function isValidSubject(subject: string): subject is SubjectName {
  return Object.keys(SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS).includes(subject);
}

// Helper pour obtenir tous les chapitres pour plusieurs matières
export const getChaptersBySubjects = (subjects: string[]): string[] => {
  if (!subjects || subjects.length === 0) {
    return [];
  }
  
  // Utiliser un Set pour éviter les doublons
  const chaptersSet = new Set<string>();
  
  subjects.forEach(subject => {
    if (isValidSubject(subject) && SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject]) {
      Object.keys(SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject]).forEach(chapter => {
        chaptersSet.add(chapter);
      });
    }
  });
  
  return Array.from(chaptersSet);
};

// Helper pour obtenir tous les exercices d'un chapitre donné (pour une matière spécifique)
export const getExercisesByChapter = (subject: string, chapter: string): string[] => {
  if (!isValidSubject(subject) || !SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject]) {
    return [];
  }
  return SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject][chapter] || [];
};

// Helper pour obtenir tous les exercices pour plusieurs chapitres (à travers plusieurs matières)
export const getExercisesByChapters = (selectedSubjects: string[], selectedChapters: string[]): string[] => {
  if (!selectedSubjects || selectedSubjects.length === 0 || !selectedChapters || selectedChapters.length === 0) {
    return [];
  }
  
  // Utiliser un Set pour éviter les doublons
  const exercisesSet = new Set<string>();
  
  selectedSubjects.forEach(subject => {
    if (isValidSubject(subject) && SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject]) {
      const subjectChapters = Object.keys(SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject]);
      
      // Filtrer pour ne garder que les chapitres qui sont à la fois dans la matière et dans la sélection
      const relevantChapters = subjectChapters.filter(chapter => selectedChapters.includes(chapter));
      
      relevantChapters.forEach(chapter => {
        const exercises = SUBJECT_CHAPTER_EXERCISE_RELATIONSHIPS[subject][chapter] || [];
        exercises.forEach(exercise => exercisesSet.add(exercise));
      });
    }
  });
  
  return Array.from(exercisesSet);
};