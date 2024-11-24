import { useEffect } from "react"
import { useMessages } from "~/hooks/useMessages";

export const MessageBox = ({
  messageBoxRef,
}: {
  messageBoxRef: React.RefObject<HTMLTextAreaElement>;
}) => {
  const { postMessage } = useMessages();

  useEffect(() => {
    const textarea = messageBoxRef.current;
    if (!textarea) {
      return;
    }
    const handleInput = () => {
      if (textarea) {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (!textarea.value.trim()) {
          return;
        }
        const newMessage = textarea.value;
        textarea.value = "";
        postMessage(newMessage);
        handleInput();
      }
    }
    textarea.addEventListener("input", handleInput);
    textarea.addEventListener("keydown", handleKeyDown);

    return () => {
      textarea.removeEventListener("input", handleInput);
      textarea.removeEventListener("keydown", handleKeyDown);
    }
  }, [postMessage, messageBoxRef]);
  return (
    <textarea
      placeholder="Write your message"
      className="w-full bg-gray-800 rounded-lg px-3 py-1 resize-none"
      rows={1}
      ref={messageBoxRef}
    />
  )
}