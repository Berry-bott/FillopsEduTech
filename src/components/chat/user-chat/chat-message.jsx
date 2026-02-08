
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
  const { user, selectedBooking } = useUserChatStore();

  // ────────────────────────────────────────────────
  // Message type detection
  // ────────────────────────────────────────────────
  const isOwnMessage = message.sender?.type === "USER" && 
    message.sender?.id === user?.id;

  const isTutorMessage = message.sender?.type === "TUTOR";

  const isSystemMessage = message.isSystem || message.sender?.type === "SYSTEM";

  const formatTime = (timestamp) => {
    try {
      return new Date(timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return timestamp || "—";
    }
  };

  // ────────────────────────────────────────────────
  // Sender name
  // ────────────────────────────────────────────────
  const senderName = isSystemMessage
    ? "System"
    : isOwnMessage
    ? (user?.name || message.sender?.name || "You")
    : (message.sender?.name || selectedBooking?.participant_name || "Tutor");

  // ────────────────────────────────────────────────
  // Avatar: prefer real photo from tutor data or message
  // ────────────────────────────────────────────────
  let avatarUrl = null;

  // For tutor messages: use avatar from selectedBooking.tutor (from fetchBookings)
  if (isTutorMessage && selectedBooking?.avatar) {
    avatarUrl = selectedBooking.avatar;
  }

  // Fallback to message.sender.avatar if available
  if (!avatarUrl && message.sender?.avatar) {
    avatarUrl = message.sender.avatar;
  }

  // For your own messages: use your avatar from user store
  if (isOwnMessage && user?.avatar) {
    avatarUrl = user.avatar;
  }

  const avatarLetter = senderName.charAt(0).toUpperCase() || 
    (isOwnMessage ? "U" : "T");

  const avatarBg = isOwnMessage
    ? "from-indigo-500 to-purple-600"
    : isTutorMessage
    ? "from-blue-500 to-indigo-600"
    : "from-gray-500 to-slate-600";

  return (
    <div 
      className={cn(
        "flex w-full group py-3 px-4 animate-fade-in",
        isSystemMessage ? "justify-center" :
        isTutorMessage   ? "justify-start"     :
                           "justify-end"
      )}
    >
      {/* Avatar - real photo or letter fallback */}
      {!isSystemMessage && (
        <div className={cn(
          "flex-shrink-0",
          isOwnMessage ? "ml-3 order-last" : "mr-3"
        )}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={senderName}
              className="w-10 h-10 rounded-full object-cover shadow-md ring-2 ring-offset-2 ring-gray-200"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = "none"; // hide broken image
              }}
            />
          ) : (
            <div 
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md ring-2 ring-offset-2",
                `bg-gradient-to-br ${avatarBg}`
              )}
            >
              {avatarLetter}
            </div>
          )}
        </div>
      )}

      {/* Message content block */}
      <div className={cn(
        "flex flex-col max-w-[75%]",
        isOwnMessage   && "items-end",
        isSystemMessage && "items-center"
      )}>
        {/* Sender name - only above tutor messages */}
        {isTutorMessage && (
          <div className="mb-1.5 px-1">
            <span className="text-sm font-semibold text-slate-800">
              {senderName}
            </span>
            {message.sender?.role && (
              <Badge
                variant="outline"
                className={cn(
                  "ml-2 text-xs border",
                  roleBadgeColors[message.sender?.role] || "bg-slate-100 text-slate-700"
                )}
              >
                {message.sender?.role}
              </Badge>
            )}
          </div>
        )}

        {/* Bubble */}
        <div
          className={cn(
            "px-4 py-3 rounded-2xl shadow-md max-w-full break-words",
            isSystemMessage
              ? "bg-gray-100 text-gray-800 text-center shadow-none border-0 max-w-[80%]"
              : isOwnMessage
              ? "bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-br-none"
              : "bg-white text-slate-900 rounded-bl-none border border-slate-200"
          )}
        >
          <p className="text-[15px] leading-relaxed whitespace-pre-wrap">
            {message.content || "[No content]"}
          </p>
        </div>

        {/* Time + status */}
        <div
          className={cn(
            "mt-1 flex items-center gap-2 text-xs text-slate-500 font-medium",
            isOwnMessage   ? "justify-end" :
            isSystemMessage ? "justify-center" :
                             "justify-start"
          )}
        >
          <span>{formatTime(message.createdAt)}</span>
          {isOwnMessage && !isSystemMessage && (
            <CheckCheck className="h-4 w-4 text-indigo-300" />
          )}
        </div>
      </div>
    </div>
  );
}