export interface IAbonnementItem {
  id: string;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: string[];
  createdAt?: string;
}
