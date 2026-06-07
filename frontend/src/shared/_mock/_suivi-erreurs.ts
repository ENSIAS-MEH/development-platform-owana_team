// Sample data for error management
export const errorManagementData = [
    {
      label: 'Taux moyen d\'échec',
      value: '24.8%',
      description: 'tous exercices',
      trend: {
        value: 3.2,
        isPositive: true,
      },
      icon: 'error',
    },
    {
      label: 'Exercices problématiques',
      value: '12',
      description: 'exercices > 40% d\'échec',
      trend: {
        value: 2,
        isPositive: false,
      },
      icon: 'exercise',
    },
    {
      label: 'Concepts difficiles',
      value: '8',
      description: 'notions à renforcer',
      trend: {
        value: 3,
        isPositive: true, 
      },
      icon: 'concept',
    },
    {
      label: 'Élèves en difficulté',
      value: '52',
      description: 'étudiants < 60% de réussite',
      trend: {
        value: 5,
        isPositive: true,
      },
      icon: 'student',
    },
  ];

// Sample data for pedagogical recommendations
export const pedagogicalRecommendations = [
    {
      id: '1',
      title: 'Renforcer le concept d\'équations du second degré',
      description: '68.2% des élèves rencontrent des difficultés avec la résolution des équations du second degré. Les erreurs principales concernent la factorisation et l\'utilisation du discriminant.',
      percentage: 68.2,
    },
    {
      id: '2',
      title: 'Réviser les ressources sur l\'accord du participe passé',
      description: '62.7% des élèves font des erreurs sur l\'accord du participe passé, particulièrement avec l\'auxiliaire avoir et les pronoms COD.',
      percentage: 62.7,
    },
    {
      id: '3',
      title: 'Créer plus d\'exercices pratiques sur les réactions d\'oxydoréduction',
      description: '54.3% des élèves ont des difficultés à identifier correctement les réactions d\'oxydoréduction et à équilibrer les équations.',
      percentage: 54.3,
    },
  ];

// Sample data for success rate evolution chart
export const successRateChartData = {
  months: ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Fev', 'Mar'],
  series: [
    {
      name: 'Français',
      data: [72, 70, 71, 73, 75, 78, 81],
    },
    {
      name: 'Maths',
      data: [62, 60, 63, 65, 68, 72, 74],
    },
    {
      name: 'Histoire-Géo',
      data: [68, 65, 66, 69, 71, 73, 76],
    },
    {
      name: 'Sciences',
      data: [65, 63, 66, 68, 71, 74, 77],
    },
    {
      name: 'Langues',
      data: [70, 68, 70, 72, 73, 77, 80],
    },
  ],
};

// Sample data for exercises with high failure rates
export const exercisesWithHighFailureRate = [
  {
    id: '1',
    exercice: 'Équations du second degré',
    matiere: 'Mathématiques',
    chapitre: 'Chap. 3',
    tauxEchec: 68.2,
    evolution: 4.5,
    alerte: 'Élevée' as const,
  },
  {
    id: '2',
    exercice: 'Accord du participe passé',
    matiere: 'Français',
    chapitre: 'Chap. 5',
    tauxEchec: 62.7,
    evolution: -2.1,
    alerte: 'Élevée' as const,
  },
  {
    id: '3',
    exercice: 'Réactions d\'oxydoréduction',
    matiere: 'Chimie',
    chapitre: 'Chap. 4',
    tauxEchec: 54.3,
    evolution: 1.2,
    alerte: 'Élevée' as const,
  },
  {
    id: '4',
    exercice: 'Théorème de Pythagore',
    matiere: 'Mathématiques',
    chapitre: 'Chap. 2',
    tauxEchec: 49.8,
    evolution: -3.2,
    alerte: 'Moyenne' as const,
  },
  {
    id: '5',
    exercice: 'Accord sujet-verbe',
    matiere: 'Français',
    chapitre: 'Chap. 2',
    tauxEchec: 45.1,
    evolution: -1.8,
    alerte: 'Moyenne' as const,
  },
];