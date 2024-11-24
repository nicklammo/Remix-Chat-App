import { MessageType } from "~/contexts/MessagesContext";
import { useConversations } from "~/hooks/useConversations";

export const Conversation = ({
  id,
  username,
  latestMessage,
  isCurrentConversation,
}: {
  id: number;
  username: string;
  latestMessage: MessageType | null;
  isCurrentConversation: boolean;
}) => {
  const { setCurrentConversationById } = useConversations();
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => setCurrentConversationById(id)}
      onKeyDown={(e) => e.key === "Enter" || e.key === " " && setCurrentConversationById(id)}
      className={`border-b ${isCurrentConversation ? "bg-sky-800 border-gray-400" : "hover:bg-gray-800 border-gray-600"} py-2 px-4 rounded`}
    >
      <div>
        {username}
      </div>
      {latestMessage && (
        <div className={`text-sm max-w-fit ${isCurrentConversation ? "text-white" : "text-gray-400"} whitespace-nowrap overflow-hidden overflow-ellipsis`}>
          {latestMessage.authorUsername}: {latestMessage.content}
        </div>
      )}
    </div>
  )
}