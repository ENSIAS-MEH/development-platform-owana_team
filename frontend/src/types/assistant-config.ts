export type ResponseType = "TEXT" | "AUDIO";
export type InputType = "TEXT" | "AUDIO" | "IMAGE" | "PDF";  // ✅ MAJUSCULES pour backend

export interface AssistantResponseConfigDTO {
  assistantId: number;
  responseTypes: ResponseType[];
  inputTypes: InputType[];
  welcomeMessage: string;
  motivationalPhrases: string[];
  helpPhrases: string[];
  audioFormats: string[];
  voiceTranscription: boolean;
  imageSupport: boolean;
  imageFormats: string[];
  pdfSupport: boolean;
  pdfFormats: string[];
}

export interface UpdateResponseConfigRequest {
  responseTypes: ResponseType[];
  inputTypes: InputType[];
  welcomeMessage: string;
  motivationalPhrases: string[];
  audioFormats: string[];
  voiceTranscription: boolean;
  imageSupport: boolean;
  imageFormats: string[];
  pdfSupport: boolean;
  pdfFormats: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: string | null;
  timestamp: number;
}