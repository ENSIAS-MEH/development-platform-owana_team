// Modèle pour une permission
export interface IPermission {
  id: string;
  name: string;
  description: string;
  roles: string[];
  createdAt: Date;
}

// Données mock pour les permissions
const permissionData: IPermission[] = [
  {
    id: 'p1',
    name: 'Gérer les utilisateurs',
    description: "Permet d'ajouter, modifier et supprimer des utilisateurs.",
    roles: ['Admin', 'Super-admin'],
    createdAt: new Date('2022-01-01T10:00:00Z'),
  },
  {
    id: 'p2',
    name: 'Gérer les événements',
    description: 'Permet de créer, modifier et supprimer des événements.',
    roles: ['Admin', 'Modérateur'],
    createdAt: new Date('2022-02-15T09:30:00Z'),
  },
  {
    id: 'p3',
    name: 'Consulter les rapports',
    description: "Permet d'accéder aux rapports analytiques.",
    roles: ['Admin', 'Super-admin', 'Agent de support'],
    createdAt: new Date('2022-05-20T11:00:00Z'),
  },
  {
    id: 'p4',
    name: 'Modérer les commentaires',
    description: 'Permet de gérer les commentaires des utilisateurs.',
    roles: ['Modérateur'],
    createdAt: new Date('2022-07-10T08:45:00Z'),
  },
  {
    id: 'p5',
    name: "Accès à l'espace parent",
    description: "Permet aux parents d'accéder à leur espace dédié.",
    roles: ['Parent'],
    createdAt: new Date('2022-09-05T14:15:00Z'),
  },
  {
    id: 'p6',
    name: "Accès à l'espace enfant",
    description: "Permet aux enfants d'accéder à leur espace de jeu et d'apprentissage.",
    roles: ['Enfant'],
    createdAt: new Date('2022-12-01T16:30:00Z'),
  },
];

export { permissionData };
