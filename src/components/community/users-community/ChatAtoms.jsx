// src/components/community/atoms/ChatAtoms.jsx
import { memo } from "react";

const GRADIENTS = [
  ["#f43f5e","#e11d48"], ["#14b8a6","#0d9488"], ["#0ea5e9","#0284c7"],
  ["#10b981","#059669"], ["#f59e0b","#d97706"], ["#a855f7","#9333ea"],
  ["#6366f1","#4f46e5"], ["#f97316","#ea580c"], ["#d946ef","#c026d3"],
  ["#06b6d4","#0891b2"],
];

const getColor  = (str = "") => GRADIENTS[str.charCodeAt(0) % GRADIENTS.length] || GRADIENTS[0];
const getInitials = (name = "?") =>
  name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

// ── Avatar ────────────────────────────────────────────────────────────
export const Avatar = memo(({ name = "?", avatar, size = 36, type = "USER", className = "" }) => {
  const [c1, c2] = getColor(name);
  const isTutor = type === "TUTOR";
  return (
    <div
      className={`relative flex-shrink-0 rounded-full flex items-center justify-center font-bold text-white overflow-hidden shadow-md
        ${isTutor ? "ring-2 ring-amber-400 ring-offset-2 ring-offset-white dark:ring-offset-slate-950" : ""}
        ${className}`}
      style={{
        width: size, height: size, fontSize: size * 0.36,
        background: avatar ? "transparent" : `linear-gradient(135deg, ${c1}, ${c2})`,
      }}
    >
      {avatar
        ? <img src={avatar} alt={name} className="w-full h-full object-cover" />
        : getInitials(name)
      }
      {isTutor && (
        <div
          className="absolute -bottom-0.5 -right-0.5 rounded-full bg-amber-400 flex items-center justify-center"
          style={{ width: size * 0.32, height: size * 0.32, fontSize: size * 0.18 }}
        >⭐</div>
      )}
    </div>
  );
});

// ── OnlineBadge ───────────────────────────────────────────────────────
export const OnlineBadge = memo(({ count = 0, className = "" }) => {
  if (count <= 0) return null;
  return (
    <div className={`flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/25 rounded-full px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 ${className}`}>
      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse block" />
      {count} online
    </div>
  );
});

// ── Spinner ───────────────────────────────────────────────────────────
export const Spinner = memo(({ size = "md", className = "" }) => {
  const cls = { sm: "w-5 h-5", md: "w-8 h-8", lg: "w-12 h-12" }[size] || "w-8 h-8";
  return (
    <div
      className={`${cls} rounded-full border-indigo-500/30 border-t-indigo-500 animate-spin ${className}`}
      style={{ borderWidth: size === "sm" ? 2 : size === "lg" ? 4 : 3 }}
    />
  );
});

// ── TypingDots ────────────────────────────────────────────────────────
export const TypingDots = memo(({ className = "" }) => (
  <div className={`flex gap-1 items-center ${className}`}>
    {[0, 1, 2].map((i) => (
      <span
        key={i}
        className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 animate-bounce block"
        style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.9s" }}
      />
    ))}
  </div>
));