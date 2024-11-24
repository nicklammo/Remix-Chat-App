import { useCallback, useEffect, useState } from "react";
import { useAuth } from "~/hooks/useAuth"
import { useConversations } from "~/hooks/useConversations";
import { useTabs } from "~/hooks/useTabs";

export const Contacts = () => {
  const { id: authId, username: authUsername, contacts } = useAuth();
  const { currentConversation, getConversationIdByParticipantIds, setCurrentConversationById, createNewConversation } = useConversations();
  const { setCurrentTabById } = useTabs();
  const [tempConversationId, setTempConversationId] = useState<number | null>(null);

  const handleClick = useCallback(async (recipientId: number, recipientUsername: string) => {

    let convoId = getConversationIdByParticipantIds(authId, recipientId);
    if (!convoId) {
      convoId = await createNewConversation({
        authorId: authId,
        authorUsername: authUsername,
        recipientId: recipientId,
        recipientUsername: recipientUsername,
      });
    }
    setTempConversationId(convoId);
  }, [authId, authUsername, createNewConversation, getConversationIdByParticipantIds]);

  useEffect(() => {
    if (tempConversationId) {
      setCurrentConversationById(tempConversationId);
      setCurrentTabById(1);
    }
  }, [setCurrentConversationById, setCurrentTabById, tempConversationId]);

  return (
    <div className="flex flex-col gap-1">
      {contacts.map(({ id, username }) => {
        const isCurrentConversation = currentConversation?.id === getConversationIdByParticipantIds(authId, id);
        return (
          <div
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" || e.key === " " && handleClick(id, username)}
            onClick={() => handleClick(id, username)}
            className={`border-b ${isCurrentConversation ? "bg-sky-800 border-gray-400" : "hover:bg-gray-800 border-gray-600"} py-2 px-4 rounded`}
            key={id}
          >
            <div>
              {username}
            </div>
          </div>
        );
      })}
    </div>
  )
}