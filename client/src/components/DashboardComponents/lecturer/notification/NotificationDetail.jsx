import { useEffect, useRef } from "react";
import { BackIcon, CheckIcon, TrashIcon, getConfig, getTypeIcon, formatFullDate } from "./NotificationUtils";

function decodeHtml(html) {
  if (!html) return "";

  const normalized = String(html)
    .replace(/&nbsp;/gi, " ")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<(\/)?(p|div|li|ul|ol|h[1-6]|blockquote|pre|table|tr|td|th)[^>]*>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  const txt = document.createElement("textarea");
  txt.innerHTML = normalized;
  return txt.value.replace(/\u00a0/g, " ").trim();
}

export default function NotificationDetail({ notification, onBack, onMarkRead, onRequestDelete }) {
  const id     = notification.id || notification._id;
  const isRead = notification.isRead || notification.read;
  const cfg    = getConfig(notification.type);
  const scrollRef = useRef(null);
  const notifId = notification.id || notification._id;

  // Snap browser window to top whenever the detail panel opens
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  // Reset inner card scroll when navigating between notifications
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [notifId]);

  const message = decodeHtml(
    notification.message || notification.body || notification.description || "No message content."
  );

  return (
    <div
      className="absolute inset-0 bg-slate-50 z-20 flex flex-col"
      style={{ animation: "slideInRight 0.22s ease both" }}
    >
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 pt-10 pb-4">
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
        >
          <BackIcon />
        </button>
        <span className="text-sm font-semibold text-slate-700">Notification detail</span>
      </div>

      {/* Card */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 pb-10">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

          {/* Coloured header */}
          <div className={`px-5 py-5 ${cfg.bg} border-b border-slate-100`}>
            <div className="flex items-start gap-4">
              <div className={`w-11 h-11 rounded-xl ${cfg.bg} border border-white shadow-sm flex items-center justify-center ${cfg.icon} shrink-0`}>
                {getTypeIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.icon} border border-current/10`}>
                    {cfg.label}
                  </span>
                  {!isRead && (
                    <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-500">
                      Unread
                    </span>
                  )}
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                  {notification.title || "Notification"}
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  {formatFullDate(notification.createdAt || notification.created_at)}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div className="px-5 py-5">
            <p className="text-sm text-slate-700 leading-relaxed">
              {message}
            </p>

            {/* Extra data key/value table — internal/technical fields hidden */}
            {(() => {
              const HIDDEN_KEYS = new Set([
                "id", "_id", "newsId", "postId", "articleId", "itemId",
                "slug", "url", "coverImage", "image", "thumbnail",
              ]);
              const HIDDEN_SUFFIX = /[Ii][Dd]$/; // catches anything ending in Id/ID/id
              const visible = notification.data
                ? Object.entries(notification.data).filter(
                    ([key]) => !HIDDEN_KEYS.has(key) && !HIDDEN_SUFFIX.test(key)
                  )
                : [];
              return visible.length > 0 ? (
                <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100">
                  {visible.map(([key, val]) => (
                    <div key={key} className="flex items-start justify-between gap-3 px-4 py-3">
                      <span className="text-xs text-slate-400 capitalize shrink-0">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span className="text-xs text-slate-600 font-mono text-right break-all">
                        {String(val)}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null;
            })()}
          </div>

          {/* Actions */}
          <div className="px-5 pb-5 flex gap-3">
            <button
              onClick={() => onRequestDelete(id)}
              className="flex items-center gap-2 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors ml-auto"
            >
              <TrashIcon /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}