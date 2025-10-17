import { useState } from "react";
import styles from "./Chat.module.css";
import type { ChatMessage, Product, Page, StreamEvent } from "./types";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ResultsPanel } from "../results/ResultsPanel";

function createId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

type ProductWithPages = {
  product: Product;
  pages: Page[];
};

export default function Chat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "What are you building? Describe your project and I'll help you find the right technologies.",
      timestamp: Date.now(),
    },
  ]);

  const [input, setInput] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [products, setProducts] = useState<ProductWithPages[]>([]);

  const handleStreamResponse = async (prompt: string) => {
    setIsStreaming(true);
    setProducts([]);

    try {
      const response = await fetch("http://localhost:3000/api/build", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error("No response body");
      }

      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim()) {
            try {
              const event: StreamEvent = JSON.parse(line);
              handleStreamEvent(event);
            } catch (e) {
              console.error("Failed to parse event:", line, e);
            }
          }
        }
      }
    } catch (error) {
      console.error("Streaming error:", error);
      const errorMessage: ChatMessage = {
        id: createId(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStreamEvent = (event: StreamEvent) => {
    switch (event.type) {
      case "status":
        // Add status message
        const statusMessage: ChatMessage = {
          id: createId(),
          role: "assistant",
          content: event.message,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, statusMessage]);
        break;

      case "category":
        // Add category search message
        const categoryMessage: ChatMessage = {
          id: createId(),
          role: "assistant",
          content: `Searching for "${event.category}"...`,
          timestamp: Date.now(),
        };
        setMessages((prev) => [...prev, categoryMessage]);
        break;

      case "product":
        // Add product to results
        setProducts((prev) => {
          const existing = prev.find((p) => p.product.id === event.product.id);
          if (existing) {
            return prev; // Product already exists
          }
          return [...prev, { product: event.product, pages: [] }];
        });
        break;

      case "product-detail":
        // Add page to existing product
        setProducts((prev) =>
          prev.map((p) =>
            p.product.id === event.productId
              ? { ...p, pages: [...p.pages, event.page] }
              : p
          )
        );
        break;

      case "done":
        // Stream complete
        break;
    }
  };

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    const userMessage: ChatMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Start streaming response
    handleStreamResponse(trimmed);
  };

  return (
    <div className={styles.chat}>
      <header className={styles.header}>What are you building?</header>
      <div className={styles.inputSection}>
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          disabled={isStreaming}
        />
      </div>
      <main className={styles.messages}>
        <MessageList messages={messages} />
        <ResultsPanel products={products} />
      </main>
    </div>
  );
}
