

import { useUserChatStore } from "@/store/userChatStore";
import { Badge } from "@/components/ui/badge";
import { Check, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const roleBadgeColors = {
  admin: "bg-rose-100 text-rose-700 border-rose-200",
  tutor: "bg-blue-100 text-blue-700 border-blue-200",
  support: "bg-emerald-100 text-emerald-700 border-emerald-200",
};

export default function ChatMessage({ message }) {
  const user = useUserChatStore((state) => state.user);

  const isOwnMessage = message.sender_id === user?.id;

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp;
    }
  };

  return (
    <div className={cn("flex gap-3 group", isOwnMessage && "flex-row-reverse")}>
      {/* Avatar for other users */}
      {!isOwnMessage && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0 shadow-md">
          {message.sender_name?.charAt(0).toUpperCase() || "T"}
        </div>
      )}

      <div className="flex flex-col gap-1 max-w-[70%]">
        {/* Sender info for other users */}
        {!isOwnMessage && (
          <div className="flex items-center gap-2 px-1">
            <span className="text-sm font-semibold text-slate-700">
              {message.sender_name || "Tutor"}
            </span>
            {message.sender_role && (
              <Badge
                variant="outline"
                className={cn(
                  "text-xs font-medium border",
                  roleBadgeColors[message.sender_role] || "bg-slate-100 text-slate-700"
                )}
              >
                {message.sender_role}
              </Badge>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={cn(
            "message-bubble px-4 py-3 rounded-2xl shadow-sm",
            isOwnMessage
              ? "bg-gradient-to-br from-indigo-600 to-purple-600 text-white rounded-br-sm"
              : "bg-white text-slate-900 rounded-bl-sm border border-slate-200"
          )}
        >
          <p className="text-[15px] leading-relaxed break-words whitespace-pre-wrap">
            {message.content || message.text}
          </p>
        </div>

        {/* Time and status */}
        <div
          className={cn(
            "flex items-center gap-1.5 px-1 opacity-0 group-hover:opacity-100 transition-opacity",
            isOwnMessage && "justify-end"
          )}
        >
          <span className="text-xs text-slate-400 font-medium">
            {formatTime(message.timestamp || message.createdAt)}
          </span>
          {isOwnMessage && (
            <CheckCheck className="h-3.5 w-3.5 text-indigo-600" />
          )}
        </div>
      </div>
    </div>
  );
}