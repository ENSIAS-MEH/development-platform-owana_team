// Types pour la configuration des langues
export type CommunicationStyle = "AMICAL" | "NEUTRE" | "ACADEMIQUE";

export interface LanguageInfo {
  code: string;
  name: string;
  flag: string;
}

export interface AssistantLanguageConfigDTO {
  assistantId: number;
  primaryLanguage: string;
  secondaryLanguage: string | null;
  communicationStyle: CommunicationStyle;
  supportedLanguages: string[];
}

export interface UpdateLanguageConfigRequest {
  primaryLanguage: string;
  secondaryLanguage?: string | null;
  communicationStyle: CommunicationStyle;
}

// Réponses API
export interface SupportedLanguagesResponse {
  languages: LanguageInfo[];
  totalLanguages: number;
  success: boolean;
  message: string;
}

export interface LanguageToggleResponse {
  assistantId: number;
  languageCode: string;
  languageName: string;
  enabled: boolean;
  success: boolean;
  message: string;
}

export interface PrimaryLanguageResponse {
  assistantId: number;
  previousLanguage: string;
  newLanguage: string;
  success: boolean;
  message: string;
}

export interface SecondaryLanguageResponse {
  assistantId: number;
  previousLanguage: string | null;
  newLanguage: string;
  success: boolean;
  message: string;
}

export interface CommunicationStyleResponse {
  assistantId: number;
  previousStyle: CommunicationStyle;
  newStyle: CommunicationStyle;
  success: boolean;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  timestamp: number;
}