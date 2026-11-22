// --- Chat Data Models ---

export type IConversation = {
  _id: string;
  type: 'direct' | 'group';
  participants: string[]; // userIds
  startupId: string | null;
  lastMessage: string;
  createdAt: string;
  updatedAt: string;
};

export type IMessage = {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  fileUrl: string | null;
  fileType: 'image' | 'audio' | 'pdf' | 'video' | 'file' | null;
  fileName: string | null;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
};

export type IUploadResponse = {
  fileUrl: string;
  fileType: 'image' | 'audio' | 'pdf' | 'video' | 'file';
  fileName: string;
  fileSize: number;
};

export type ISendMessagePayload = {
  conversationId: string;
  content?: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
};

export type ITypingEvent = {
  conversationId: string;
  userId: string;
};

export type IMessagesReadEvent = {
  conversationId: string;
  readBy: string;
};
