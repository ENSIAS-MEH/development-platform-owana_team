export interface DetailLevelConfigDTO {
  id: number;
  versionId: number;
  detailLevel: number;
  calculatedTemperature: number;
  conversionMethod: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastModifiedBy?: string;
}

export interface UpdateDetailLevelRequest {
  detailLevel: number;
  conversionMethod?: string;
  changeReason?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode?: string;
  timestamp: number;
}

export interface TemperatureMappingResponse {
  LINEAR: Record<number, number>;
  EXPONENTIAL: Record<number, number>;
  CONTEXTUAL: Record<number, number>;
}

export interface TemperatureCalculationResponse {
  detailLevel: number;
  conversionMethod: string;
  calculatedTemperature: number;
}

export type ConversionMethod = 'LINEAR' | 'EXPONENTIAL' | 'CONTEXTUAL';

export interface DetailLevelFormData {
  level: number;
  method: ConversionMethod;
  comment?: string;
}

export interface DetailLevelHistoryEntry {
  id: number;
  previousLevel?: number;
  newLevel: number;
  previousTemperature?: number;
  newTemperature: number;
  changeReason?: string;
  changedBy?: string;
  changedAt: string;
}

export interface DetailLevelState {
  config: DetailLevelConfigDTO | null;
  history: DetailLevelHistoryEntry[];
  mapping: TemperatureMappingResponse | null;
  loading: boolean;
  error: string | null;
}

export interface DetailLevelUIProps {
  versionId: string;
  onSave?: (config: DetailLevelConfigDTO) => void;
  onError?: (error: string) => void;
  readOnly?: boolean;
}