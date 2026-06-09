export interface IAbonnementSubscribers {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
}
export interface ISubject {
  id: string;
  name: string;
  description?: string;
}
export type IDateValue = string | number | null;
export interface ISocialLink {
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  twitter?: string;
}
