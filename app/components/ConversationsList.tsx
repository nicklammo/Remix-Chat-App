import { useAuth } from "~/hooks/useAuth";
import { useConversations } from "~/hooks/useConversations"
import { Conversation } from "./Conversation";
import { v4 } from "uuid";
import { useMessages } from "~/hooks/useMessages";

export const ConversationsList = () => {
  const { currentConversation, conversations } = useConversations();
  const { getLatestMessageByConversationId } = useMessages();
  const { username: authUsername } = useAuth();

  return (
    <div className="flex flex-col gap-1">
      {conversations && conversations.map(({ id, authorUsername, recipientUsername }) => (
        <Conversation
          key={`${id}-${v4()}`}
          id={id}
          username={authorUsername !== authUsername ? authorUsername : recipientUsername}
          latestMessage={getLatestMessageByConversationId(id)}
          isCurrentConversation={currentConversation && currentConversation.id === id || false}
        />
      ))}
    </div>
  )
}