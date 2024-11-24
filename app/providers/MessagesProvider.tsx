import { MessagesContext, MessageType } from "~/contexts/MessagesContext";
import { useConversations } from "~/hooks/useConversations";
import { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/hooks/useAuth";
import { DatabaseMessage } from "~/types";

export const MessagesProvider = ({
  messageBoxRef,
  children,
}: {
  messageBoxRef: React.RefObject<HTMLTextAreaElement>;
  children: React.ReactNode;
}) => {
  const { currentConversation, conversations, setCurrentConversation } = useConversations();
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(currentConversation ? currentConversation.id : null);
  const { id: authId, username: authUsername } = useAuth();
  const [currentMessages, setCurrentMessages] = useState<MessageType[] | null>(null);

  useEffect(() => {
    setCurrentConversationId(currentConversation?.id || null);
  }, [currentConversation, currentConversationId]);

  const postMessage = useCallback(async (content: string) => {
    if (!currentConversation) {
      return;
    }
    const res = await fetch(`http://localhost:5173/api/create-message?conversationId=${currentConversation.id}&messageContent=${content.trim()}`);
    const data = await res.json();
    const message = data.message as DatabaseMessage;
    if (message) {
      setCurrentConversation((prev) => {
        if (!prev) {
          return prev;
        }
        const newMessage: MessageType = {
          id: message.id,
          authorId: authId,
          authorUsername: authUsername,
          recipientId: prev.recipientId,
          recipientUsername: prev.recipientUsername,
          content: message.content,
          conversationId: message.conversationId,
          isRead: message.isRead,
        }
        return {
          ...prev,
          messages: prev.messages ? [...prev.messages, newMessage] : [newMessage],
        };
      });
    }
  }, [authId, authUsername, currentConversation, setCurrentConversation]);

  const isMessageReadById = useCallback((messageId: number) => {
    if (!currentMessages) {
      return false;
    }
    return currentMessages.find(({ id }) => messageId === id)?.isRead ?? false;
  }, [currentMessages]);

  const getLatestMessageByConversationId = useCallback((conversationId: number) => {
    if (!conversationId || !conversations) {
      return null;
    }
    const conversation = conversations.find(({ id }) => conversationId === id);
    if (conversation?.messages) {
      return conversation.messages[conversation.messages.length - 1] || null;
    }
    return null;
  }, [conversations]);

  const updateCurrentMessages = useCallback(() => {
    if (currentConversation) {
      setCurrentMessages(currentConversation.messages);
    }
  }, [currentConversation]);

  const markCurrentMessagesAsRead = useCallback(async () => {
    if (!currentConversationId) {
      return;
    }
    const res = await fetch(`http://localhost:5173/api/mark-messages-as-read?conversationId=${currentConversationId}`);
    if (res.ok) {
      setCurrentConversation((prev) => {
        if (!prev || !prev.messages) {
          return null;
        }
        const newConversation = {
          ...prev,
          messages: prev.messages.map((message) => ({
            ...message,
            isRead: authId === message.recipientId ? true : message.isRead,
          })),
        };
        return newConversation;
      });
    }
  }, [authId, currentConversationId, setCurrentConversation]);

  useEffect(() => {
    updateCurrentMessages();
  }, [updateCurrentMessages])

  useEffect(() => {
    markCurrentMessagesAsRead();
  }, [markCurrentMessagesAsRead]);

  useEffect(() => {
    const handleKeyDown = () => {
      const messageBox = messageBoxRef.current;
      if (!messageBox) {
        return;
      }
      if (document.activeElement !== messageBox) {
        messageBox.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [messageBoxRef]);

  return (
    <MessagesContext.Provider value={{
      currentMessages,
      postMessage,
      isMessageReadById,
      getLatestMessageByConversationId,
      markCurrentMessagesAsRead
    }}>
      {children}
    </MessagesContext.Provider>
  )
}