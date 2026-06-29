
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2, Ban, WifiOff } from "lucide-react";
import { useTutorChatStore } from "@/store/tutorChatStore";

export default function ChatInput({
  onSend,
  isSending,
  disabled,
}) {
  const [message, setMessage] = useState("");
  const { socketConnected, sendTyping } = useTutorChatStore();

  const typingTimeoutRef = useRef(null);
  const isTypingRef      = useRef(false);

  // ── Typing ─────────────────────────────────────────────────────
  const handleTyping = (value) => {
    setMessage(value);

    // Emit typing:start only once per typing session
    if (!isTypingRef.current && value.trim()) {
      sendTyping(true);
      isTypingRef.current = true;
    }

    // If field is cleared, stop immediately
    if (!value.trim() && isTypingRef.current) {
      sendTyping(false);
      isTypingRef.current = false;
      clearTimeout(typingTimeoutRef.current);
      return;
    }

    // Reset the idle timer — stop typing after 1.5 s of no keystrokes
    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      sendTyping(false);
      isTypingRef.current = false;
    }, 1500);
  };

  // ── Send ────────────────────────────────────────────────────────
  const handleSend = () => {
    if (!message.trim() || isSending || disabled || !socketConnected) return;

    // Stop typing before sending
    sendTyping(false);
    isTypingRef.current = false;
    clearTimeout(typingTimeoutRef.current);

    onSend(message.trim());
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── States ──────────────────────────────────────────────────────

  // Booking status doesn't allow chat
  if (disabled) {
    return (
      <div className="flex items-center justify-center py-4 px-4">
        <div className="inline-flex items-center gap-3 px-5 py-3 bg-muted/50 rounded-lg border text-muted-foreground text-sm">
          <Ban className="size-4 flex-shrink-0" />
          Messaging is disabled for this booking status
        </div>
      </div>
    );
  }

  // Socket not connected yet
  if (!socketConnected) {
    return (
      <div className="flex items-center justify-center py-4 px-4">
      <div className="inline-flex items-center gap-3 px-5 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
        <WifiOff className="size-4 flex-shrink-0 animate-pulse" />
        Connecting to chat server…
        </div>
      </div>
    );
  }

  // Normal active input
  return (
    <div className="flex gap-3 items-end">
      <div className="flex-1">
        <Textarea
          value={message}
          onChange={(e) => handleTyping(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            sendTyping(false);
            isTypingRef.current = false;
            clearTimeout(typingTimeoutRef.current);
          }}
          placeholder="Type a message… (Shift+Enter for new line)"
          className="min-h-[44px] max-h-[140px] resize-none text-sm"
          rows={2}
        />
      </div>

      <Button
        onClick={handleSend}
        disabled={!message.trim() || isSending}
        className="h-[44px] px-4 mb-0.5"
      >
        {isSending ? (
          <>
            <Loader2 className="size-4 mr-2 animate-spin" />
            Sending
          </>
        ) : (
          <Send className="size-4" />
        )}
      </Button>
    </div>
  );
}
