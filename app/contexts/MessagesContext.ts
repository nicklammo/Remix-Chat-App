import { createContext } from "react";

export type MessageType = {
  id: number;
  authorId: number;
  authorUsername: string;
  recipientId: number;
  recipientUsername: string;
  content: string;
  conversationId: number;
  isRead: boolean;
}

type MessagesContext = {
  currentMessages: MessageType[] | null;
  postMessage: (content: string) => void;
  isMessageReadById: (messageId: number) => boolean;
  getLatestMessageByConversationId: (conversationId: number) => MessageType | null;
  markCurrentMessagesAsRead: () => void;
}

export const MessagesContext = createContext<MessagesContext | undefined>(undefined);