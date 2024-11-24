import { useCallback, useEffect, useState } from "react";
import { ConversationsContext, ConversationType } from "~/contexts/ConversationsContext";
import { useAuth } from "~/hooks/useAuth";
import { DatabaseConversation } from "~/types";

export const ConversationsProvider = ({
  initConversations,
  children,
}: {
  initConversations: DatabaseConversation[];
  children: React.ReactNode;
}) => {
  const [currentConversation, setCurrentConversation] = useState<ConversationType | null>(null);
  const [conversations, setConversations] = useState<ConversationType[] | null>(null);
  const [conversationsMap, setConversationsMap] = useState<Map<number, ConversationType[] | null>>(new Map());

  const { id: authId } = useAuth();

  const initConversationsMap = useCallback(() => {
    setConversationsMap((prev) => {
      const newConversationsMap = new Map(prev);
      const newInitConversations = initConversations.map((conversation) => {
        console.log(conversation.messages)
        return {
          id: conversation.id,
          authorId: conversation.participants[0].id,
          authorUsername: conversation.participants[0].username,
          recipientId: conversation.participants[1].id,
          recipientUsername: conversation.participants[1].username,
          messages: conversation.messages.map((message) => {
            return {
              id: message.id,
              conversationId: conversation.id,
              authorId: message.authorId,
              authorUsername: message.author.username,
              recipientId: message.recipients[0].id,
              recipientUsername: message.recipients[0].username,
              content: message.content,
              isRead: message.isRead,
            }
          }),
        };
      });
      if (newInitConversations) {
        newConversationsMap.set(authId, newInitConversations);
      }
      return newConversationsMap;
    });
  }, [authId, initConversations]);

  const includeCurrentConversation = useCallback(() => {
    if (!currentConversation) {
      return;
    }
    setConversationsMap((prev) => {
      const newConversationsMap = new Map(prev);
      const authConversation = newConversationsMap.get(authId);
      if (authConversation) {
        const newAuthConversation = authConversation.filter(({ id }) => currentConversation.id !== id);
        newConversationsMap.set(authId, [currentConversation, ...newAuthConversation]);
      } else {
        newConversationsMap.set(authId, [currentConversation]);
      }
      return newConversationsMap;
    })
  }, [authId, currentConversation]);

  const getConversationIdByParticipantIds = useCallback((userOneId: number, userTwoId: number) => {
    if (!conversations) {
      return null;
    }
    const conversation = conversations.find(({ authorId, recipientId }) => (
      (authorId === userOneId && recipientId === userTwoId) ||
      (authorId === userTwoId && recipientId === userOneId)
    ));
    return conversation ? conversation.id : null;
  }, [conversations]);

  const updateConversations = useCallback(() => {
    setConversations((prev) => {
      if (!prev || !currentConversation) {
        return prev;
      }
      const filteredConversations = prev.filter(({ id }) => currentConversation.id !== id);
      const newConversations = [currentConversation, ...filteredConversations];
      setConversationsMap((prev) => {
        const newConversationsMap = new Map(prev);
        newConversationsMap.set(authId, newConversations);
        return newConversationsMap;
      });

      return newConversations;
    });
  }, [authId, currentConversation]);

  useEffect(() => {
    initConversationsMap();
  }, [initConversationsMap]);

  useEffect(() => {
    includeCurrentConversation();
  }, [includeCurrentConversation]);

  useEffect(() => {
    const authConversations = conversationsMap.get(authId) || null;
    setConversations(authConversations);
  }, [authId, conversationsMap]);

  useEffect(() => {
    updateConversations();
  }, [updateConversations]);

  const createNewConversation = useCallback(async (newConversation: Omit<ConversationType, "id" | "messages">): Promise<number> => {
    await fetch(`http://localhost:5173/api/create-conversation?recipientId=${newConversation.recipientId}`);
    return new Promise((resolve) => {
      setConversations((prev): ConversationType[] | null => {
        if (!prev) {
          resolve(1);
          return [{ ...newConversation, id: 1, messages: [] }];
        }
        const conversationExists = prev.some(({ authorId, recipientId }) =>
          (newConversation.authorId === authorId && newConversation.recipientId === recipientId) ||
          (newConversation.recipientId === authorId && newConversation.authorId === recipientId)
        );

        if (!conversationExists) {
          const newConvoId = prev ? Math.max(...prev.map((convo) => convo.id)) + 1 : 1;
          const newConversationWithId: ConversationType = { ...newConversation, id: newConvoId, messages: [] };
          resolve(newConvoId);
          return [...prev, newConversationWithId]
        }
        return prev;
      });
    });
  }, []);

  const setCurrentConversationById = useCallback((convoId: number) => {
    setCurrentConversation((prev) => {
      if (!conversations) {
        return prev;
      }
      const newConversation = conversations.find(({ id }) => convoId === id) || null;
      if (newConversation) {
        setCurrentConversation(newConversation);
      }
      return newConversation;
    });
  }, [conversations]);

  return (
    <ConversationsContext.Provider value={{
      conversations,
      currentConversation,
      setCurrentConversation,
      setCurrentConversationById,
      createNewConversation,
      getConversationIdByParticipantIds,
      updateConversations
    }}>
      {children}
    </ConversationsContext.Provider>
  )
}