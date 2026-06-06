export enum TestEvaluationType {
  QUALITE = 'QUALITE',
  PERTINENCE = 'PERTINENCE', 
  PRECISION = 'PRECISION',
  COMPREHENSION = 'COMPREHENSION',
  PEDAGOGIQUE = 'PEDAGOGIQUE'
}

// Labels français pour l'affichage
export const TestEvaluationTypeLabels = {
  [TestEvaluationType.QUALITE]: 'Qualité',
  [TestEvaluationType.PERTINENCE]: 'Pertinence',
  [TestEvaluationType.PRECISION]: 'Précision', 
  [TestEvaluationType.COMPREHENSION]: 'Compréhension',
  [TestEvaluationType.PEDAGOGIQUE]: 'Pédagogique'
} as const;

// Descriptions pour chaque type
export const TestEvaluationTypeDescriptions = {
  [TestEvaluationType.QUALITE]: 'Évalue la qualité globale de la réponse',
  [TestEvaluationType.PERTINENCE]: 'Vérifie si la réponse correspond à la question',
  [TestEvaluationType.PRECISION]: 'Contrôle la précision des informations données',
  [TestEvaluationType.COMPREHENSION]: 'Teste si la réponse est adaptée au niveau de l\'élève',
  [TestEvaluationType.PEDAGOGIQUE]: 'Évalue l\'aspect pédagogique et éducatif'
} as const;