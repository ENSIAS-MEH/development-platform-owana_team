export interface AssistantDescriptionDTO {
  assistantId: number;
  name: string;
  description: string;
  type: string;
  status: string;
  active: boolean;
  levelId: number | null;
  subjectId: number | null;
  chapterId: number | null;
  exerciseId: number | null;
  createdAt: string;
  lastUpdated: string;
}

export interface AssistantDescriptionUpdateRequest {
  description: string;
}