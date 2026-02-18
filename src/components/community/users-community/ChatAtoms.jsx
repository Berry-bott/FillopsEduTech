// src/components/community/atoms/ChatAtoms.jsx
import { memo } from "react";

// ─────────────────────────────────────────────
// SHARED CONSTANTS
// ─────────────────────────────────────────────
const SUBJECT_COLORS = [
  "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4",
  "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F",
  "#BB8FCE", "#85C1E9",
];

const getColor = (str = "") => SUBJECT_COLORS[str.charCodeAt(0) % SUBJECT_COLORS.length] || "#64748B";

const getInitials = (name = "?") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

// ─────────────────────────────────────────────
// AVATAR
// ─────────────────────────────────────────────
export const Avatar = memo(({ 
  name = "?", 
  avatar, 
  size = 36, 
  type = "USER", 
  className = "" 
}) => {
  const bg = avatar ? "transparent" : `linear-gradient(135deg, ${getColor(name)}, ${getColor(name)}88)`;

  return (
    <div
      className={`avatar ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        flexShrink: 0,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: size * 0.36,
        fontWeight: 700,
        color: "#fff",
        border: type === "TUTOR" ? "2px solid #F59E0B" : "none",
        overflow: "hidden",
        position: "relative",
        boxShadow: "0 2px 8px rgba(0,0,0,0.25)",
      }}
    >
      {avatar ? (
        <img
          src={avatar}
          alt={name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        getInitials(name)
      )}

      {type === "TUTOR" && (
        <div
          style={{
            position: "absolute",
            bottom: -1,
            right: -1,
            width: size * 0.32,
            height: size * 0.32,
            borderRadius: "50%",
            background: "#F59E0B",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: size * 0.17,
          }}
        >
          ⭐
        </div>
      )}
    </div>
  );
});

// ─────────────────────────────────────────────
// ONLINE BADGE
// ─────────────────────────────────────────────
export const OnlineBadge = memo(({ count = 0, className = "" }) => {
  if (count <= 0) return null;

  return (
    <div
      className={`online-badge ${className}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: "rgba(16, 185, 129, 0.12)",
        borderRadius: 20,
        padding: "4px 11px",
        fontSize: 12,
        color: "#10B981",
        fontWeight: 600,
      }}
    >
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "#10B981",
          animation: "pulse 2s infinite",
        }}
      />
      {count} online
    </div>
  );
});

// ─────────────────────────────────────────────
// SPINNER
// ─────────────────────────────────────────────
export const Spinner = memo(({ size = 24, color = "#6366F1", className = "" }) => {
  return (
    <div
      className={`spinner ${className}`}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        border: `3px solid ${color}33`,
        borderTopColor: color,
        animation: "spin 0.8s linear infinite",
        display: "inline-block",
      }}
    />
  );
});

// ─────────────────────────────────────────────
// TYPING DOTS
// ─────────────────────────────────────────────
export const TypingDots = memo(({ className = "" }) => {
  return (
    <div
      className={`typing-dots ${className}`}
      style={{
        display: "flex",
        gap: 4,
        alignItems: "center",
      }}
    >
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#64748B",
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }}
        />
      ))}
    </div>
  );
});