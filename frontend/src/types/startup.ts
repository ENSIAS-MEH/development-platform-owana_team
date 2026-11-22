// --- API Response Types ---

export type IStartupItem = {
  id: string;
  name: string;
  description: string;
  location: string;
  sector: string;
  highlights: string;
  programmes: string;
  logoUrl: string | null;
  founderId: string;
  createdAt: string;
};

export type IStartupMember = {
  id: string;
  userId: string;
  startupId: string;
  startupRole: 'FOUNDER' | 'CO_FOUNDER';
};

export type IStartupPhoto = {
  id: string;
  photoUrl: string;
};

export type IStartupJoinRequest = {
  id: string;
  userId: string;
  startupId: string;
  requestDate: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
};

export type IUserProfile = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureURL: string | null;
};

export type IPageResponse<T> = {
  content: T[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  pageSize: number;
  isLast: boolean;
};

// --- Derived/Resolved Types ---

export type IStartupMemberResolved = IStartupMember & {
  firstName: string;
  lastName: string;
  profilePictureURL: string | null;
};

export type IStartupJoinRequestResolved = IStartupJoinRequest & {
  firstName: string;
  lastName: string;
  profilePictureURL: string | null;
};

export type IProgramme = {
  title: string;
  description: string;
  imageUrl: string;
};

// --- Filter/Sort Types ---

export type IStartupSortOption = 'latest' | 'oldest';

// --- Form Types ---

export type IStartupCreateForm = {
  name: string;
  description: string;
  location: string;
  sector: string;
  highlights: string;
  photos: File[];
};
