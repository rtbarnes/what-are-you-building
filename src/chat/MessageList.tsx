import { useEffect, useRef } from "react";
import type { ChatMessage } from "./types";
import styles from "./MessageList.module.css";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className={styles.list}>
      {messages.map((message) => {
        const isUser = message.role === "user";
        return (
          <div
            key={message.id}
            className={`${styles.message} ${
              isUser ? styles.user : styles.assistant
            }`}
          >
            {message.content && (
              <div className={styles.bubble}>{message.content}</div>
            )}
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
}
