// src/components/community/MessageBubble.jsx
import { memo } from "react";
import { Avatar } from "./ChatAtoms";

const MessageBubble = memo(({ message, isOwn, showAvatar }) => {
  const sender = message.sender || {};
  const time = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{
      display: "flex",
      marginBottom: 12,
      flexDirection: isOwn ? "row-reverse" : "row",
      alignItems: "flex-end",
      gap: 8,
    }}>
      {showAvatar && !isOwn && (
        <Avatar name={sender.name || "?"} size={34} type={sender.type} />
      )}
      {showAvatar && isOwn && <div style={{ width: 34 }} />}

      <div style={{ maxWidth: "70%" }}>
        {!isOwn && showAvatar && (
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 4, paddingLeft: 2 }}>
            {sender.name}
            {sender.type === "TUTOR" && (
              <span style={{
                marginLeft: 6, fontSize: 10, background: "rgba(245,158,11,0.15)",
                color: "#F59E0B", borderRadius: 4, padding: "1px 6px", fontWeight: 700,
              }}>Tutor</span>
            )}
          </div>
        )}

        <div style={{
          padding: "10px 14px",
          borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
          background: isOwn
            ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
            : "rgba(255,255,255,0.07)",
          color: isOwn ? "white" : "#e2e8f0",
          fontSize: 14,
          lineHeight: 1.6,
          wordBreak: "break-word",
          boxShadow: isOwn
            ? "0 4px 12px rgba(99,102,241,0.3)"
            : "0 2px 8px rgba(0,0,0,0.2)",
        }}>
          {message.content}
          <div style={{
            fontSize: 10, opacity: 0.6, marginTop: 4,
            textAlign: isOwn ? "right" : "left",
          }}>
            {time}
          </div>
        </div>
      </div>
    </div>
  );
});

export default MessageBubble;