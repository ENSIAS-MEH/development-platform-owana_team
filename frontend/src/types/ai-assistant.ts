// types/ai-assistant.ts
export interface IAIAssistantItem {
  id: string;
  name: string;
  educationLevel: string;
  type: string;
  subject: string | null;
  chapter: string | null;
  exercise: string | null;
  status: string;
  lastUpdated?: Date | string;
  createdAt?: Date | string | null;
  dateAjoute?: Date | string | null;
  avatarUrl?: string;
  description?: string | null;
}

export interface IAIAssistantDetailLevel {
  level: number; // Niveau entre 1 et 5
}

export interface IAdvancedFilter {
  column: string;
  operator: string;
  value: string;
}

export interface IAIAssistantCustomizationSettings {
  responseType: ("text" | "audio" | "image")[];
  inputType: "text" | "audio" | "image";
  welcomeMessage: string;
  motivationalPhrases: string[];
  helpPhrases: string[];
  audioFormat: ("mp3" | "wav" | "aac")[]; // Changed to array
  voiceTranscription: boolean;
  imageSupport: boolean;
  imageFormat: ("jpg" | "png" | "svg" | "pdf")[]; // Assurez-vous que "pdf" est inclus ici
  deletionHistory: { phrase: string; date: string; type: "motivation" | "aide" }[];
}

export interface IAIAssistantTableColumns {
  name: boolean;
  type: boolean;
  educationLevel: boolean;
  subject: boolean;
  chapter: boolean;
  exercise: boolean;
  status: boolean;
  dateAjoute: boolean;
}

export interface IAIAssistantTableFilters {
  name: string;
  type: string[];
  status: string;
  educationLevel: string;
  subject: string;
  chapter: string;
  exercise: string;
  dateAjoute: string;
  visibleColumns: IAIAssistantTableColumns;
  advancedFilter?: IAdvancedFilter | null;
}

export interface IAIAssistantTableFiltersResultProps {
  filters: IAIAssistantTableFilters;
  onFilters: (name: string, value: string | string[]) => void;
  onResetFilters: () => void;
  onResetPage: () => void;
  sx?: object;
  results: number;
  options: {
    types: {
      value: string;
      label: string;
    }[];
    educationLevels: {
      value: string;
      label: string;
    }[];
    subjects: {
      value: string;
      label: string;
    }[];
    statuses: {
      value: string;
      label: string;
    }[];
  };
}

export type SupervisionRule = {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  isSystemRule: boolean;
  parameters?: {
    [key: string]: any;
  };
  lastModified?: string;
  lastModifiedBy?: string;
  lastModificationComment?: string;
};

export type ModificationHistoryEntry = {
  id: string;
  date: string;
  user: string;
  action: 'add' | 'modify' | 'delete' | 'toggle';
  ruleName: string;
  comment: string;
};

export type AIAssistantFilteringProps = {
  assistantId: string;
};

export type AIAssistantLanguagesProps = {
  assistantId: string;
};

export type LanguageOption = {
  code: string;
  name: string;
  enabled: boolean;
};

export type CommunicationStyle = "amical" | "neutre" | "académique";

export type AIAssistantDetailLevelProps = {
  assistantId?: string;
};

export type AIAssistantDescriptionProps = {
  assistantId: string;
};
// Nouvelle interface pour DefaultValue
export interface IDefaultValueProps {
  /**
   * La valeur à afficher
   */
  value: any;
  
  /**
   * Texte à afficher quand la valeur est vide ou invalide
   */
  defaultText?: string;
  
  /**
   * Style visuel du placeholder
   */
  variant?: 'subtle' | 'dash' | 'badge' | 'alert';
  
  /**
   * Afficher une icône avec la valeur par défaut
   */
  showIcon?: boolean;
  
  /**
   * Fonction personnalisée pour déterminer si une valeur est vide
   */
  isEmpty?: (val: any) => boolean;
  
  /**
   * Fonction de validation optionnelle
   */
  validator?: ((val: any) => boolean) | null;
  
  /**
   * Afficher en ligne ou en bloc
   */
  inline?: boolean;
  
  /**
   * Styles MUI supplémentaires
   */
  sx?: Record<string, any>;
}