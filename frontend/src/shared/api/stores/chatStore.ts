import type { IConversation, IMessage } from 'src/types/chat';

import { create } from 'zustand';

type ChatState = {
  conversations: IConversation[];
  selectedConversationId: string | null;
  messages: Record<string, IMessage[]>;
  unreadCounts: Record<string, number>;
  typingUsers: Record<string, string[]>;
  messagesLoading: boolean;
  conversationsLoading: boolean;
  hasMoreMessages: Record<string, boolean>;
  messagePage: Record<string, number>;
};

type ChatActions = {
  setConversations: (conversations: IConversation[]) => void;
  selectConversation: (id: string | null) => void;
  addMessage: (conversationId: string, message: IMessage) => void;
  setMessages: (conversationId: string, messages: IMessage[], hasMore: boolean) => void;
  appendOlderMessages: (conversationId: string, messages: IMessage[], hasMore: boolean) => void;
  updateUnreadCount: (conversationId: string, count: number) => void;
  incrementUnread: (conversationId: string) => void;
  resetUnread: (conversationId: string) => void;
  setTypingUser: (conversationId: string, userId: string) => void;
  removeTypingUser: (conversationId: string, userId: string) => void;
  markMessagesRead: (conversationId: string, readByUserId: string) => void;
  updateLastMessage: (conversationId: string, lastMessage: string) => void;
};

type ChatStore = ChatState & ChatActions;

export const useChatStore = create<ChatStore>((set) => ({
  conversations: [],
  selectedConversationId: null,
  messages: {},
  unreadCounts: {},
  typingUsers: {},
  messagesLoading: false,
  conversationsLoading: false,
  hasMoreMessages: {},
  messagePage: {},

  setConversations: (conversations) => {
    set({ conversations });
  },

  selectConversation: (id) => {
    set({ selectedConversationId: id });
  },

  addMessage: (conversationId, message) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] || []), message],
      },
    }));
  },

  setMessages: (conversationId, messages, hasMore) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
      hasMoreMessages: {
        ...state.hasMoreMessages,
        [conversationId]: hasMore,
      },
      messagePage: {
        ...state.messagePage,
        [conversationId]: 1,
      },
    }));
  },

  appendOlderMessages: (conversationId, messages, hasMore) => {
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...messages, ...(state.messages[conversationId] || [])],
      },
      hasMoreMessages: {
        ...state.hasMoreMessages,
        [conversationId]: hasMore,
      },
      messagePage: {
        ...state.messagePage,
        [conversationId]: (state.messagePage[conversationId] || 1) + 1,
      },
    }));
  },

  updateUnreadCount: (conversationId, count) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: count,
      },
    }));
  },

  incrementUnread: (conversationId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: (state.unreadCounts[conversationId] || 0) + 1,
      },
    }));
  },

  resetUnread: (conversationId) => {
    set((state) => ({
      unreadCounts: {
        ...state.unreadCounts,
        [conversationId]: 0,
      },
    }));
  },

  setTypingUser: (conversationId, userId) => {
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      if (current.includes(userId)) return state;
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...current, userId],
        },
      };
    });
  },

  removeTypingUser: (conversationId, userId) => {
    set((state) => {
      const current = state.typingUsers[conversationId] || [];
      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: current.filter((id) => id !== userId),
        },
      };
    });
  },

  markMessagesRead: (conversationId, readByUserId) => {
    set((state) => {
      const conversationMessages = state.messages[conversationId];
      if (!conversationMessages) return state;

      return {
        messages: {
          ...state.messages,
          [conversationId]: conversationMessages.map((msg) =>
            msg.readBy.includes(readByUserId) ? msg : { ...msg, readBy: [...msg.readBy, readByUserId] }
          ),
        },
      };
    });
  },

  updateLastMessage: (conversationId, lastMessage) => {
    set((state) => ({
      conversations: state.conversations.map((conv) =>
        conv._id === conversationId
          ? { ...conv, lastMessage, updatedAt: new Date().toISOString() }
          : conv
      ),
    }));
  },
}));
