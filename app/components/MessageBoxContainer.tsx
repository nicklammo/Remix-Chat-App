import { useConversations } from "~/hooks/useConversations";

export const MessageBoxContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { currentConversation } = useConversations();

  return (
    <div className="flex flex-col-reverse mt-2">
      {currentConversation ? children : null}
    </div>
  )
}