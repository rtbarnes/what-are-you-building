import type { ChatMessage } from "./types";
import styles from "./MessageList.module.css";
import { ProductCard } from "./ProductCard";

type MessageListProps = {
  messages: ChatMessage[];
};

export function MessageList({ messages }: MessageListProps) {
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
            {message.productCard && (
              <ProductCard productCard={message.productCard} />
            )}
          </div>
        );
      })}
    </div>
  );
}
