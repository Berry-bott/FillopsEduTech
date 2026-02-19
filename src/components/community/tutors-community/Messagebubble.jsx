// src/components/tutor-community/MessageBubble.jsx
import { memo } from "react";
import { Avatar, TutorBadge } from "./atoms/ChatAtoms";

const MessageBubble = memo(({ message, isOwn, showAvatar }) => {
  const sender  = message.sender || {};
  const isTutor = sender.type === "TUTOR";
  const time    = new Date(message.createdAt).toLocaleTimeString([], {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className={`flex gap-2.5 mb-2.5 items-end ${isOwn ? "flex-row-reverse" : "flex-row"}`}>
      {/* Avatar slot — always same width to keep alignment */}
      <div className="w-8 flex-shrink-0">
        {showAvatar && !isOwn && (
          <Avatar name={sender.name || "?"} size={32} type={sender.type} />
        )}
      </div>

      <div className={`flex flex-col gap-1 max-w-[68%] ${isOwn ? "items-end" : "items-start"}`}>
        {/* Sender name + tutor badge */}
        {!isOwn && showAvatar && (
          <div className="flex items-center gap-1.5 px-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {sender.name}
            </span>
            {isTutor && <TutorBadge />}
          </div>
        )}

        {/* Bubble */}
        <div
          className={`px-4 py-2.5 text-sm leading-relaxed break-words shadow-sm ${
            isOwn
              ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-2xl rounded-br-sm shadow-amber-500/20"
              : isTutor
                ? "bg-amber-50 dark:bg-amber-900/20 text-slate-800 dark:text-slate-100 border border-amber-200 dark:border-amber-700/40 rounded-2xl rounded-bl-sm"
                : "bg-slate-100 dark:bg-slate-800/80 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700/50 rounded-2xl rounded-bl-sm"
          }`}
        >
          <p className="m-0 whitespace-pre-wrap">{message.content}</p>
          <div className={`text-[10px] mt-1.5 ${isOwn ? "text-orange-100/70 border text-right" : "text-slate-400 dark:text-slate-500 text-left"}`}>
            {time}
          </div>
        </div>
      </div>
    </div>
  );
});

export default MessageBubble;