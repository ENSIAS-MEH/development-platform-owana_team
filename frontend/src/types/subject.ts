interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}


export interface Subject extends BaseEntity {
  name: string;
  description: string;
  active: boolean;
  color: string;
  levelId: string;
  chaptersCount?: number;
}


export type SubjectRequest = {
  name: string;
  description: string;
  active: boolean;
  color: string;
  levelId: string;
};

export type SubjectList = {
  id: string;
  name: string;
  code: string;
  description: string;
  active: boolean;
  color: string;
  createdAt: string;
  updatedAt: string;
  levelId: string;
  chaptersCount: number;
};

export type SubjectPageFilterParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  nameSearch?: string;
  descriptionSearch?: string;
  chaptersSearch?: string;
  dateSearch?: string;
};




