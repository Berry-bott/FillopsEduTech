// src/components/tutor-community/ChatInput.jsx
import { useState, useRef, useCallback } from "react";
import useTutorCommunityStore from "@/store/tutorCommunityStore";

export default function ChatInput() {
  const [text, setText] = useState("");
  const { sendMessage, startTyping, sendingMessage } = useTutorCommunityStore();
  const textareaRef = useRef(null);

  const handleChange = (e) => {
    setText(e.target.value);
    startTyping();
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

  const canSend = text.trim().length > 0 && !sendingMessage;

  return (
    <div className="flex-shrink-0 px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-950/90 backdrop-blur-sm">
      <div
        className={`flex items-end gap-2 rounded-2xl px-4 py-2.5 transition-all duration-200 border ${
          text
            ? "border-amber-400 dark:border-amber-500/50 bg-white dark:bg-slate-800/60 shadow-lg shadow-amber-500/10"
            : "border-slate-200 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-800/40"
        }`}
      >
        {/* Emoji */}
        <button className="flex-shrink-0 text-slate-400 hover:text-amber-500 transition-colors text-lg pb-0.5 cursor-pointer">
          😊
        </button>

        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Write a message to the group…"
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm leading-relaxed max-h-36 overflow-y-auto py-1"
          style={{ fontFamily: "inherit" }}
        />

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={!canSend}
          className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 ${
            canSend
              ? "bg-gradient-to-br from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-lg shadow-amber-500/30 cursor-pointer scale-100"
              : "bg-slate-200 dark:bg-slate-700/50 opacity-40 scale-95 cursor-not-allowed"
          }`}
        >
          {sendingMessage ? (
            <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
          ) : (
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          )}
        </button>
      </div>

      <p className="text-center text-[10px] text-slate-400 dark:text-slate-600 mt-1.5">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}