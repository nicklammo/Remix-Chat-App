import { createContext, Dispatch, SetStateAction } from "react";
import { MessageType } from "./MessagesContext";

export type ConversationType = {
  id: number;
  authorId: number;
  authorUsername: string;  
  recipientId: number;
  recipientUsername: string;
  messages: MessageType[] | null;
}

export type ConversationContextType = {
  conversations: ConversationType[] | null;
  currentConversation: ConversationType | null;
  setCurrentConversation: Dispatch<SetStateAction<ConversationType | null>>;
  setCurrentConversationById: (conversationId: number) => void;
  createNewConversation: (newConversation: Omit<ConversationType, "id" | "messages">) => Promise<number>;
  updateConversations: () => void;
  getConversationIdByParticipantIds: (userOneId: number, userTwoId: number) => number | null;
}

export const ConversationsContext = createContext<ConversationContextType | undefined>(undefined);