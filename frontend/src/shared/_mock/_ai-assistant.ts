import type { IAIAssistantItem } from 'src/types/ai-assistant';

// ----------------------------------------------------------------------

export const AI_ASSISTANT_STATUS_OPTIONS = [
  { value: 'ACTIVE', label: 'Actif' },
  { value: 'INACTIVE', label: 'Inactif' },
];

export const AI_ASSISTANT_TYPE_OPTIONS = [
  { value: 'Apprentissage', label: "Apprentissage" },
  { value: 'Accueil', label: 'Accueil' },
  { value: 'Recherche', label: 'Recherche' },
];

export const AI_ASSISTANT_EDUCATION_LEVELS = [
  { value: 'CP', label: 'CP' },
  { value: 'CE1', label: 'CE1' },
  { value: 'CE2', label: 'CE2' },
  { value: 'CM1', label: 'CM1' },
  { value: 'CM2', label: 'CM2' },
];

// Matières alignées avec celles de _subject_relationships.ts
export const AI_ASSISTANT_SUBJECTS = [
  { value: 'Mathématiques', label: 'Mathématiques' },
  { value: 'Français', label: 'Français' },
  { value: 'Histoire', label: 'Histoire' },
  { value: 'Géographie', label: 'Géographie' },
  { value: 'Anglais', label: 'Anglais' },
];

// Chapitres alignés avec ceux de _subject_relationships.ts
export const AI_ASSISTANT_CHAPTERS = [
  // Mathématiques
  { value: 'Additions et Soustractions', label: 'Additions et Soustractions' },
  { value: 'Multiplications et Divisions', label: 'Multiplications et Divisions' },
  { value: 'Géométrie de Base', label: 'Géométrie de Base' },
  { value: 'Problèmes Simples', label: 'Problèmes Simples' },
  // Français
  { value: 'Lecture et Compréhension', label: 'Lecture et Compréhension' },
  { value: 'Écriture et Orthographe', label: 'Écriture et Orthographe' },
  { value: 'Grammaire de Base', label: 'Grammaire de Base' },
  { value: 'Vocabulaire', label: 'Vocabulaire' },
  // Histoire
  { value: 'Préhistoire et Antiquité', label: 'Préhistoire et Antiquité' },
  { value: 'Moyen Âge', label: 'Moyen Âge' },
  { value: 'Renaissance', label: 'Renaissance' },
  { value: 'Révolution Française', label: 'Révolution Française' },
  // Géographie
  { value: 'Mon Village et Ma Région', label: 'Mon Village et Ma Région' },
  { value: 'La France', label: 'La France' },
  { value: 'LEurope', label: 'L\'Europe' },
  { value: 'Le Monde', label: 'Le Monde' },
  // Anglais
  { value: 'Salutations et Présentations', label: 'Salutations et Présentations' },
  { value: 'Nombres et Couleurs', label: 'Nombres et Couleurs' },
  { value: 'Animaux et Aliments', label: 'Animaux et Aliments' },
  { value: 'Phrases Simples', label: 'Phrases Simples' },
];

// Exercices alignés avec ceux de _subject_relationships.ts
export const AI_ASSISTANT_EXERCISES = [
  // Mathématiques - Additions et Soustractions
  { value: 'exercice-addition-1', label: 'Exercice Addition 1' },
  { value: 'exercice-soustraction-1', label: 'Exercice Soustraction 1' },
  // Mathématiques - Multiplications et Divisions
  { value: 'exercice-multiplication-1', label: 'Exercice Multiplication 1' },
  { value: 'exercice-division-1', label: 'Exercice Division 1' },
  // Mathématiques - Géométrie de Base
  { value: 'exercice-formes-1', label: 'Exercice Formes 1' },
  { value: 'exercice-mesures-1', label: 'Exercice Mesures 1' },
  // Mathématiques - Problèmes Simples
  { value: 'exercice-probleme-1', label: 'Exercice Problème 1' },
  { value: 'exercice-probleme-2', label: 'Exercice Problème 2' },

  // Français - Lecture et Compréhension
  { value: 'exercice-lecture-1', label: 'Exercice Lecture 1' },
  { value: 'exercice-comprehension-1', label: 'Exercice Compréhension 1' },
  // Français - Écriture et Orthographe
  { value: 'exercice-ecriture-1', label: 'Exercice Écriture 1' },
  { value: 'exercice-orthographe-1', label: 'Exercice Orthographe 1' },
  // Français - Grammaire de Base
  { value: 'exercice-grammaire-1', label: 'Exercice Grammaire 1' },
  { value: 'exercice-conjugaison-1', label: 'Exercice Conjugaison 1' },
  // Français - Vocabulaire
  { value: 'exercice-vocabulaire-1', label: 'Exercice Vocabulaire 1' },
  { value: 'exercice-vocabulaire-2', label: 'Exercice Vocabulaire 2' },

  // Histoire - Préhistoire et Antiquité
  { value: 'exercice-prehistoire-1', label: 'Exercice Préhistoire 1' },
  { value: 'exercice-antiquite-1', label: 'Exercice Antiquité 1' },
  // Histoire - Moyen Âge
  { value: 'exercice-moyen-age-1', label: 'Exercice Moyen Âge 1' },
  { value: 'exercice-moyen-age-2', label: 'Exercice Moyen Âge 2' },
  // Histoire - Renaissance
  { value: 'exercice-renaissance-1', label: 'Exercice Renaissance 1' },
  { value: 'exercice-renaissance-2', label: 'Exercice Renaissance 2' },
  // Histoire - Révolution Française
  { value: 'exercice-revolution-1', label: 'Exercice Révolution 1' },
  { value: 'exercice-revolution-2', label: 'Exercice Révolution 2' },

  // Géographie - Mon Village et Ma Région
  { value: 'exercice-village-1', label: 'Exercice Village 1' },
  { value: 'exercice-region-1', label: 'Exercice Région 1' },
  // Géographie - La France
  { value: 'exercice-france-1', label: 'Exercice France 1' },
  { value: 'exercice-france-2', label: 'Exercice France 2' },
  // Géographie - L'Europe
  { value: 'exercice-europe-1', label: 'Exercice Europe 1' },
  { value: 'exercice-europe-2', label: 'Exercice Europe 2' },
  // Géographie - Le Monde
  { value: 'exercice-monde-1', label: 'Exercice Monde 1' },
  { value: 'exercice-monde-2', label: 'Exercice Monde 2' },

  // Anglais - Salutations et Présentations
  { value: 'exercice-salutations-1', label: 'Exercice Salutations 1' },
  { value: 'exercice-presentations-1', label: 'Exercice Présentations 1' },
  // Anglais - Nombres et Couleurs
  { value: 'exercice-nombres-1', label: 'Exercice Nombres 1' },
  { value: 'exercice-couleurs-1', label: 'Exercice Couleurs 1' },
  // Anglais - Animaux et Aliments
  { value: 'exercice-animaux-1', label: 'Exercice Animaux 1' },
  { value: 'exercice-aliments-1', label: 'Exercice Aliments 1' },
  // Anglais - Phrases Simples
  { value: 'exercice-phrases-1', label: 'Exercice Phrases 1' },
  { value: 'exercice-phrases-2', label: 'Exercice Phrases 2' },
];

// Create sample descriptions based on the assistant type and subject
const getAssistantDescription = (type: string, subject: string | null, educationLevel: string): string => {
  if (type === 'Apprentissage') {
    const subjectName = AI_ASSISTANT_SUBJECTS.find(s => s.value === subject)?.label || '';
    const levelName = AI_ASSISTANT_EDUCATION_LEVELS.find(l => l.value === educationLevel)?.label || '';
    return `Assistant pédagogique pour l'apprentissage de ${subjectName} au niveau ${levelName}. Aide les élèves à comprendre les concepts, résoudre des exercices et progresser dans leur apprentissage.`;
  }

  if (type === 'accueil') {
    return `Assistant d'accueil pour guider les utilisateurs et répondre aux questions fréquentes sur la plateforme. Aide à naviguer et trouver les ressources appropriées.`;
  }

  if (type === 'recherche') {
    return `Assistant de recherche permettant d'explorer les contenus éducatifs. Facilite la découverte de ressources pertinentes et apporte une aide contextuelle.`;
  }

  return `Assistant IA polyvalent pour améliorer l'expérience d'apprentissage.`;
};

// ----------------------------------------------------------------------

export const _mockAIAssistants: IAIAssistantItem[] = [...Array(10)].map((_, index) => {
  const type = AI_ASSISTANT_TYPE_OPTIONS[index % AI_ASSISTANT_TYPE_OPTIONS.length].value;
  const educationLevel = AI_ASSISTANT_EDUCATION_LEVELS[index % AI_ASSISTANT_EDUCATION_LEVELS.length].value;
  const subject = type === 'Apprentissage' ? AI_ASSISTANT_SUBJECTS[index % AI_ASSISTANT_SUBJECTS.length].value : null;
  const chapter = type === 'Apprentissage' ? AI_ASSISTANT_CHAPTERS[index % AI_ASSISTANT_CHAPTERS.length].value : null;
  const exercise = type === 'Apprentissage' ? AI_ASSISTANT_EXERCISES[index % AI_ASSISTANT_EXERCISES.length].value : null;

  return {
    id: `ai-assistant-${index + 1}`,
    name: `Assistant IA ${index + 1}`,
    description: getAssistantDescription(type, subject, educationLevel),
    type,
    status: index % 2 === 0 ? 'active' : 'inactive',
    educationLevel,
    subject,
    chapter,
    exercise,
    lastUpdated: new Date().toISOString(),
    avatarUrl: '',
  };
});

// Ajouter au moins 5 assistants de type "Apprentissge" pour garantir leur présence
for (let i = 0; i < 5; i += 1) {
  const educationLevel = AI_ASSISTANT_EDUCATION_LEVELS[i % AI_ASSISTANT_EDUCATION_LEVELS.length].value;
  const subject = AI_ASSISTANT_SUBJECTS[i % AI_ASSISTANT_SUBJECTS.length].value;

  _mockAIAssistants[i] = {
    id: `ai-assistant-Apprentissge-${i + 1}`,
    name: `Apprentissge ${i + 1}`,
    description: getAssistantDescription('Apprentissage', subject, educationLevel),
    type: 'Apprentissage',
    status: 'active',
    educationLevel,
    subject,
    chapter: AI_ASSISTANT_CHAPTERS[i % AI_ASSISTANT_CHAPTERS.length].value,
    exercise: AI_ASSISTANT_EXERCISES[i % AI_ASSISTANT_EXERCISES.length].value,
    lastUpdated: new Date().toISOString(),
    avatarUrl: '',
  };
}
