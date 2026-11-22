// D:\bureau\PFA\dev\back_office\brainboost-front\brainboost-front\src\types\filter-relationships.ts

import type { FilterOptions } from '../shared/_mock/_correction_ai';

/**
 * Interface pour représenter un filtre avec valeur et label
 */
export interface FilterOption {
  value: string;
  label: string;
}

/**
 * Type pour les matières disponibles
 */
export type SubjectName = 'Mathématiques' | 'Français' | 'Histoire' | 'Géographie' | 'Anglais';

/**
 * Type pour la structure des relations chapitres-exercices
 */
export type ChapterExerciseMap = Record<string, string[]>;

/**
 * Type pour la structure des relations matières-chapitres
 */
export type SubjectChapterMap = Record<SubjectName, ChapterExerciseMap>;

/**
 * Interface pour les options de filtrage en cascade
 */
export interface CascadingFilterOptions extends FilterOptions {
  availableChapters?: FilterOption[];
  availableExercises?: FilterOption[];
}

/**
 * Type pour les résultats de filtrage
 */
export type FilterResult<T> = {
  data: T[];
  total: number;
};

/**
 * Type pour les fonctions de modification de filtres
 */
export type FilterChangeHandler = (name: keyof FilterOptions, value: any) => void;

/**
 * Type pour les fonctions de mise à jour cohérente de filtres
 */
export type FilterUpdater = (currentFilters: FilterOptions, changeKey: keyof FilterOptions, newValue: any) => FilterOptions;