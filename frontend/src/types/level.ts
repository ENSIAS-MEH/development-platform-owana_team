interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Level extends BaseEntity {
  name: string;
  code: string;
  description: string;
  active?: boolean;
  subjectsCount?: number;
}

export type LevelRequest = {
  name: string;
  code: string;
  description: string;
};

export type LevelList = {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  subjectsCount: number;

};

export type LevelPageFilterParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  nameSearch?: string;
  codeSearch?: string;
  descriptionSearch?: string;
  dateSearch?: string;
};





