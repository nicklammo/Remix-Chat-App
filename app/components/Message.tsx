import { useAuth } from "~/hooks/useAuth";
import { useMessages } from "~/hooks/useMessages";
import "../styles/Messages.css";
import { useConversations } from "~/hooks/useConversations";
import { useMemo } from "react";

export const Message = ({
  id,
  authorUsername,
  content,
}: {
  id: number;
  authorUsername: string;
  content: string;
}) => {
  const { username: authUsername } = useAuth();
  const { currentConversation } = useConversations();
  const { isMessageReadById, getLatestMessageByConversationId } = useMessages();
  const isAuthor = authUsername === authorUsername;
  const isRecipient = authUsername !== authorUsername;
  const isLatestMessage = useMemo(() => {
    if (currentConversation) {
      const latestMessage = getLatestMessageByConversationId(currentConversation.id);
      if (latestMessage && latestMessage.id === id) {
        return true;
      }
    }
    return false;
  }, [currentConversation, getLatestMessageByConversationId, id]);
  return (
    <div
      style={{
        marginLeft: isAuthor ? "10%" : 0,
        marginRight: isRecipient ? "10%" : 0
      }}
      className={`${isAuthor ? "bg-green-800" : "bg-sky-800"} px-4 p-2 rounded mt-2 whitespace-pre-wrap ${isRecipient && isLatestMessage ? "bounce" : ""}`}
    >
      <div>{content}</div>
      <div className="text-sm text-right">{isAuthor ? isMessageReadById(id) ? "Read" : "Unread" : ""}</div>
    </div>
  )
}