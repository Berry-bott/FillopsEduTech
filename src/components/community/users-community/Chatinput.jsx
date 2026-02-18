// src/components/community/ChatInput.jsx
import { useState, useRef, useCallback } from "react";
import useCommunityStore from "@/store/userCommunityStore";

export default function ChatInput({ groupId }) {
  const [text, setText] = useState("");
  const { sendMessage, startTyping, sendingMessage } = useCommunityStore();
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    startTyping();
    // Auto-resize textarea
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = Math.min(el.scrollHeight, 140) + "px";
    }
  };

  const handleSend = useCallback(async () => {
    const val = text.trim();
    if (!val || sendingMessage) return;
    setText("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(val);
  }, [text, sendingMessage, sendMessage]);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{
      padding: "12px 16px",
      borderTop: "1px solid rgba(255,255,255,0.08)",
      background: "rgba(15,23,42,0.95)",
      backdropFilter: "blur(10px)",
    }}>
      <div style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        background: "rgba(255,255,255,0.06)",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        padding: "8px 12px",
        transition: "border-color 0.2s",
      }}
        onFocus={() => {}}
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
          rows={1}
          style={{
            flex: 1,
            background: "transparent",
            border: "none",
            outline: "none",
            color: "#e2e8f0",
            fontSize: 14,
            lineHeight: 1.5,
            resize: "none",
            maxHeight: 140,
            overflowY: "auto",
            fontFamily: "inherit",
          }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sendingMessage}
          style={{
            width: 36, height: 36,
            borderRadius: "50%",
            background: text.trim() && !sendingMessage
              ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
              : "rgba(255,255,255,0.08)",
            border: "none",
            color: "white",
            cursor: text.trim() && !sendingMessage ? "pointer" : "not-allowed",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16,
            flexShrink: 0,
            transition: "all 0.2s",
            transform: text.trim() ? "scale(1)" : "scale(0.9)",
            opacity: text.trim() ? 1 : 0.5,
          }}
        >
          {sendingMessage ? "⏳" : "➤"}
        </button>
      </div>
      <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 6 }}>
        Press Enter to send · Shift+Enter for new line
      </div>
    </div>
  );
}