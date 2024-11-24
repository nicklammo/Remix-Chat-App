import { useMessages } from "~/hooks/useMessages";
import { Message } from "./Message";
import { useEffect, useRef } from "react";
import { v4 } from "uuid";

export const Messages = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { currentMessages, markCurrentMessagesAsRead } = useMessages();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, [currentMessages]);

  useEffect(() => {
    markCurrentMessagesAsRead();
  }, [markCurrentMessagesAsRead]);

  if (currentMessages) {
    return (
      <div className="flex-grow overflow-y-auto px-2">
        {currentMessages.map(({ id, authorUsername, content }) => {

          return (
            <Message
              key={`${id}-${v4()}`}
              id={id}
              authorUsername={authorUsername}
              content={content}
            />
          )
        })}
        <div ref={scrollRef} />
      </div>
    )
  }

  return null;
}