import { useCallback } from "react";
import { useAuth } from "~/hooks/useAuth";
import { useConversations } from "~/hooks/useConversations";
import { Tooltip } from "./Tooltip";

export const MessagesContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { id: authId, username: authUsername, setUserById } = useAuth();
  const { currentConversation } = useConversations();

  const handleClick = useCallback(() => {
    if (!currentConversation) {
      return;
    }
    if (authId === currentConversation.authorId) {
      setUserById(currentConversation.recipientId);
    }
    else if (authId === currentConversation.recipientId) {
      setUserById(currentConversation.authorId);
    }
  }, [authId, currentConversation, setUserById]);

  if (currentConversation) return (
    <div className="w-full h-full flex flex-col px-2 py-2">
      <div className="flex flex-row px-4 py-2 border-b border-b-gray-600 border-dashed justify-between">
        <div className="font-bold">{authUsername !== currentConversation.authorUsername ? currentConversation.authorUsername : currentConversation.recipientUsername}</div>
        <div className="text-sm">
          <Tooltip text={authUsername !== currentConversation.authorUsername ? currentConversation.authorUsername : currentConversation.recipientUsername}>
            <button
              onClick={handleClick}
              className="hover:bg-gray-800 px-2 py-1 rounded"
            >
              Switch User
            </button>
          </Tooltip>
        </div>
      </div>
      {children}
    </div>
  )
}