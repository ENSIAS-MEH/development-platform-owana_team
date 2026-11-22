interface BaseEntity {
  id: string;
  createdAt?: string;
  lastUpdated?: string;
}

export type AssistantStatus = 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE' | 'DISABLED';

export interface AssistantManager extends BaseEntity {
  name: string;
  description: string;
  type: string;
  status: AssistantStatus;
  active: boolean;
  levelId: string;
  subjectId: string;
  chapterId: string;
  exerciseId: string;
}

export type AssistantRequest = {
  name: string;
  description: string;
  type: string;
  status: AssistantStatus;
  levelId: string;
  subjectId: string;
  chapterId: string;
  exerciseId: string;
};

export type AssistantList = {
  id: string;
  name: string;
  description: string;
  type: string;
  status: AssistantStatus;
  active: boolean;
  levelId: string;
  subjectId: string;
  chapterId: string;
  exerciseId: string;
  createdAt: any;
  lastUpdated: any; 
};

export type AssistantPageFilterParams = {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  nameSearch?: string;
  typeSearch?: string;
  levelSearch?: string;
  subjectSearch?: string;
  chapterSearch?: string;
  exerciseSearch?: string;
  statusSearch?: string;
  dateSearch?: string;
};

export interface Pagination {
  page: number;
  size: number;
  total: number;
}





