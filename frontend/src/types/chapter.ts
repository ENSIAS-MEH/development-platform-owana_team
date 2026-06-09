interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Chapter extends BaseEntity {
  name: string;
  description: string;
  order: number;
  difficulty: Difficulty;
  subjectId: string;
  active?: boolean;
}

export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type ChapterRequest = {
  name: string;
  description: string;
  order: number;
  difficulty: Difficulty;
  subjectId: string;
};


export type ChapterList = {
  id: string;
  name: string;
  description: string;
  order: number;
  difficulty: Difficulty;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  subjectId: string;
};

export type ChapterPageFilterParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  nameSearch?: string;
  orderSearch?: string;
  descriptionSearch?: string;
  difficultySearch?: string;
  dateSearch?: string;
};





