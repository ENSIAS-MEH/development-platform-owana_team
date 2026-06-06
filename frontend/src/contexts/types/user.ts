import { _STATUS_OPTIONS } from 'src/shared/_mock/assets';

import type { IRoleItem } from './role';
import type { IAbonnementItem } from './abonnement';
import type { ISubject, IDateValue, ISocialLink } from './common';

export interface Address {
  id?: number;
  country?: string;
  complimentaryAddress?: string;
  city?: string;
  fullAddress?: string;
  zipCode?: string;
  createdAt?: string;
}
export interface TimeScreenResponse {
  id: number;
  duration: string;
  createdAt: string;
  childId: number;
}
export interface SuspensionRequest {
  reason: string;
  suspensionEnd: string;
}
export interface UserStatusHistoryItem {
  createdAt: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'BLOCKED';
  statusEnd: string | null;
  reason: string | null;
}
export interface BaseUser {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'DELETED' | 'BLOCKED';
  userType?: string;
  phoneNumber: string;
  photo?: string;
  primaryAddress?: Address;
  secondaryAddress?: Address;
  createdAt?: string;
  lastLogin?: string;
}
export interface ChildSummaryResponse {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
}
export interface ParentSummaryResponse {
  id: string;
  lastName: string;
  firstName: string;
  email: string;
}
export interface IParent extends BaseUser {
  children?: ChildSummaryResponse[];
}

export interface IChild extends BaseUser {
  totalTimeSpent?: string;
  parent: ParentSummaryResponse | null;
}
export interface ChildRequest extends BaseUser {
  parentId?: string;
}
export interface IAdmin extends BaseUser {
  roles: IRoleItem[] | null;
}
export interface AdminRequest extends BaseUser {
  roleIds?: string[];
}
export interface PurchasedSubscription extends IAbonnementItem {
  interval: string;
}
export interface Pageable<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
  empty: boolean;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
  numberOfElements: number;
}

export type IUserPageable = Pageable<BaseUser>;
export interface UserPageFilterParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
}
export interface IUserResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  userType: string;
  role: string;
  status: string;
  lastLogin: string | null;
  createdAt: Date;
}

// ***

export interface ParentUser extends BaseUser {
  role: 'Parent';
  subscription?: PurchasedSubscription;
  children: ChildUser[];
}

export interface ChildUser extends BaseUser {
  role: 'Enfant';
  parentId: string;
  subjects: ISubject[];
  daily_question_limit?: number;
}
export type IUserItem = ParentUser | ChildUser;

export type IUserTableFilters = {
  name: string;
  email: string;
  role: string[];
  statut: string[];
  createdAt: IDateValue;
  lastLogin: IDateValue;
};

export type IUserProfileCover = {
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: ISocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: IDateValue;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: IDateValue;
  personLikes: { name: string; avatarUrl: string }[];
  comments: {
    id: string;
    message: string;
    createdAt: IDateValue;
    author: { id: string; name: string; avatarUrl: string };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserContact = {
  id: string;
  name: string;
  email: string;
  status: string;
  role: string;
  address: string;
  avatarUrl: string;
  phoneNumber: string;
  lastActivity: string;
};

export type IUserAccount = {
  city: string;
  email: string;
  state: string;
  about: string;
  address: string;
  zipCode: string;
  isPublic: boolean;
  displayName: string;
  phoneNumber: string;
  country: string | null;
  photoURL: File | string | null;
};

export function mapRoleToUserType(role: string): string {
  switch (role) {
    case 'Enfant':
      return 'CHILD';
    case 'Parent':
      return 'PARENT';
    case 'Admin':
      return 'ADMIN';
    default:
      return role;
  }
}
export function mapUserTypeToRole(userType: string): string {
  switch (userType) {
    case 'CHILD':
      return 'Enfant';
    case 'PARENT':
      return 'Parent';
    case 'ADMIN':
      return 'Admin';
    default:
      return userType;
  }
}
export const getStatusValue = (label: string): string | undefined =>
  _STATUS_OPTIONS.find((option) => option.label === label)?.value;

export const getStatusLabel = (value: string): string | undefined =>
  _STATUS_OPTIONS.find((option) => option.value === value)?.label;

export const transformDate = (dateArray: number[]): Date => {
  if (!dateArray || !Array.isArray(dateArray) || dateArray.length < 6) {
    return new Date();
  }

  return new Date(
    dateArray[0],
    dateArray[1] - 1,
    dateArray[2],
    dateArray[3],
    dateArray[4],
    dateArray[5]
  );
};
