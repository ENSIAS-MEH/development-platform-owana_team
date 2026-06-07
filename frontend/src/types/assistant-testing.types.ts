import type { TestEvaluationType } from 'src/types/assistant-testing-enums';

// Base interfaces
export interface TestQueryRequest {
  query: string;
  subject?: string;
  expectedType?: string;
}

export interface TestEvaluationRequest {
  evaluationType: TestEvaluationType;
  score: number;
  feedback?: string;
}

export interface TestResultResponse {
  testId: string;
  assistantId: string;
  query: string;
  response: string;
  evaluationType: TestEvaluationType;
  score?: number;
  success: boolean;
  message: string;
}

// Test History
export interface AssistantTestHistory {
  id: string;
  assistantId: string;
  createdAt: string;
  query: string;
  response: string;
  evaluationType?: TestEvaluationType;
  score?: number;
  feedback?: string;
  responseTimeMs?: number;
  testPassed?: boolean;
}

export interface PagedTestHistory {
  content: AssistantTestHistory[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  size: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// Statistics DTOs
export interface EvaluationTypeStatDTO {
  evaluationType: TestEvaluationType;
  count: number;
}

export interface TestStatisticsDTO {
  assistantId: string;
  totalTests: number;
  averageScore: number;
  passedTests: number;
  passRate: number;
  recentTests: number;
  evaluationTypes: EvaluationTypeStatDTO[];
  recentAverageScore: number;
}

export interface DailyActivityDTO {
  date: string;
  testCount: number;
}

export interface PerformanceMetricsDTO {
  assistantId: string;
  averageScore: number;
  totalTests: number;
  periodDays: number;
  dailyActivity: DailyActivityDTO[];
  scoreImprovement: number;
}

// Report DTOs
export interface ReportPeriodDTO {
  startDate: string;
  endDate: string;
  totalTests: number;
}

export interface ScoreDistributionDTO {
  excellent: number;
  good: number;
  average: number;
  poor: number;
}

export interface TestTrendsDTO {
  scoreImprovement: number;
  volumeTrend: number;
}

export interface TestReportDTO {
  assistantId: string;
  reportPeriod: ReportPeriodDTO;
  averageScore: number;
  evaluationTypeDistribution: EvaluationTypeStatDTO[];
  scoreDistribution: ScoreDistributionDTO;
  topPerformingTests: AssistantTestHistory[];
  worstPerformingTests: AssistantTestHistory[];
  trends: TestTrendsDTO;
  generatedAt: string;
}

// Bulk testing
export interface BulkTestResultDTO {
  totalSubmitted: number;
  successCount: number;
  failureCount: number;
  results: TestResultResponse[];
}

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errorCode?: string;
  timestamp: number;
}

// Filter and search options
export interface TestSearchFilters {
  query?: string;
  evaluationType?: TestEvaluationType;
  scoreRange?: {
    min: number;
    max: number;
  };
  dateRange?: {
    start: string;
    end: string;
  };
}

