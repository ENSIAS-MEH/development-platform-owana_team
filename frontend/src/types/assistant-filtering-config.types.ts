export interface AssistantFilteringConfigDTO {
  assistantId: string;
  blockedTermsAssistant: string[];
  blockedTermsStudents: string[];
  customRules: AssistantFilteringRuleDTO[];
}

export interface AssistantFilteringRuleDTO {
  id?: string; // Ajouter l'ID pour pouvoir identifier les règles
  rule: string;
  description: string;
  severity: string;
  isActive?: boolean; // Ajouter l'état actif
}

export interface AssistantFilteringRuleDisplay {
  id: string;
  ruleName: string;
  ruleType: string;
  description?: string;
  isActive: boolean;
  isSystemRule: boolean;
  lastModified?: string;
  lastModifiedBy?: string;
  lastModificationComment?: string;
}

export interface UpdateFilteringRulesRequest {
  blockedTermsAssistant: string[];
  blockedTermsStudents: string[];
  customRules: AssistantFilteringRuleDTO[];
}

export interface AssistantFilteringRule {
  id?: string; // Optionnel pour la création
  assistantId: string;
  ruleName: string;
  ruleType: string;
  blockedTermsAssistant?: string[];
  blockedTermsStudents?: string[];
  isSystemRule: boolean;
  isActive: boolean;
  description?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}