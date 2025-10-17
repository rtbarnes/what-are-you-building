import styles from "./MessageInput.module.css";

type MessageInputProps = {
  value: string;
  onChange: (next: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
};

export function MessageInput({
  value,
  onChange,
  onSubmit,
  disabled,
}: MessageInputProps) {
  return (
    <form
      className={styles.inputBar}
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim()) return;
        onSubmit();
      }}
    >
      <input
        className={styles.textInput}
        type="text"
        placeholder="Type a message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoFocus
      />
      <button
        className={styles.sendButton}
        type="submit"
        disabled={disabled || !value.trim()}
      >
        Send
      </button>
    </form>
  );
}
