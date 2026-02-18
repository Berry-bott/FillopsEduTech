// src/components/community/MessageBubble.jsx
import { Avatar } from "./ChatAtoms";

export default function MessageBubble({ message, isOwn, showAvatar }) {
  const sender = message.sender || {};
  const time = new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  return (
    <div
      style={{
        display: "flex",
        marginBottom: 12,
        flexDirection: isOwn ? "row-reverse" : "row",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      {showAvatar && !isOwn && <Avatar name={sender.name} size={36} type={sender.type} />}

      <div style={{ maxWidth: "70%" }}>
        {!isOwn && showAvatar && (
          <div style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", marginBottom: 4 }}>
            {sender.name}
          </div>
        )}

        <div
          style={{
            padding: "10px 14px",
            borderRadius: isOwn ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
            background: isOwn ? "linear-gradient(to right, #6366f1, #8b5cf6)" : "rgba(255,255,255,0.08)",
            color: isOwn ? "white" : "#e2e8f0",
            fontSize: 14,
            lineHeight: 1.5,
          }}
        >
          {message.content}
          <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4, textAlign: isOwn ? "right" : "left" }}>
            {time}
          </div>
        </div>
      </div>
    </div>
  );
}