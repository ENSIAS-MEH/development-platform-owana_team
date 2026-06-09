
import { _mock } from "./_mock";

import type { IDateValue } from "../sections/moderation/types/common";

export interface ICategoryItem {
  id: string;
  title: string;
  description: string;
  numberFaq: number;
  datePublication: IDateValue;
}

export const _categoriesList: ICategoryItem[] = [
  {
    id: 'cat-1',
    title: 'Compte',
    description: 'Toutes les questions liées au compte utilisateur',
    numberFaq: 5,
    datePublication: _mock.time(1),
  },
  {
    id: 'cat-2',
    title: 'Facturation',
    description: 'Toutes les questions liées à la facturation',
    numberFaq: 6,
    datePublication: _mock.time(2),
  },
  {
    id: 'cat-3',
    title: 'Sécurité',
    description: 'Toutes les questions liées à la sécurité',
    numberFaq: 9,
    datePublication: _mock.time(3),
  },
  {
    id: 'cat-4',
    title: 'Support technique',
    description: 'Questions relatives au support technique et assistance',
    numberFaq: 7,
    datePublication: _mock.time(4),
  },
  {
    id: 'cat-5',
    title: 'Mises à jour',
    description: 'Informations sur les mises à jour du produit et du système',
    numberFaq: 4,
    datePublication: _mock.time(5),
  },
  {
    id: 'cat-6',
    title: 'Installation',
    description: 'Guide et questions sur l\'installation des logiciels',
    numberFaq: 8,
    datePublication: _mock.time(6),
  },
  {
    id: 'cat-7',
    title: 'Performance',
    description: 'Questions relatives à l\'optimisation et à la performance',
    numberFaq: 3,
    datePublication: _mock.time(7),
  },
];
