import { getAdminConfig, getAdminTypeIcon, adminTimeAgo, AdminBackIcon, AdminCloseIcon, AdminCheckIcon } from "./adminNotificationUtils";
import { stripHtmlToText } from "@/lib/formatText";

export default function AdminNotificationDetail({ notification, onBack, onMarkRead, onRequestDelete }) {
  const id     = notification._id || notification.id;
  const isRead = notification.read || notification.isRead;
  const cfg    = getAdminConfig(notification.type);

  return (
    <div
      className="absolute inset-0 z-20 bg-slate-50 flex flex-col"
      style={{ animation: "slideInRight 0.22s ease both" }}
    >
      {/* ── Top bar ── */}
      <div className="flex items-center justify-between px-4 py-4 bg-white border-b border-slate-100 shadow-sm">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <AdminBackIcon />
          Back
        </button>
        <div className="flex items-center gap-2">
          {!isRead && (
            <button
              onClick={() => onMarkRead(id, false)}
              className="flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition-colors"
            >
              <AdminCheckIcon />
              Mark read
            </button>
          )}
          <button
            onClick={(e) => onRequestDelete(id, e)}
            className="flex items-center justify-center w-7 h-7 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-lg transition-colors"
          >
            <AdminCloseIcon />
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="flex-1 overflow-y-auto px-4 py-6 border-2">
        {/* Type badge + icon */}
        <div className="flex items-center gap-3 mb-5">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cfg.bg} ${cfg.icon}`}>
            {getAdminTypeIcon(notification.type)}
          </div>
          <div>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.icon}`}>
              {notification.type?.replace(/_/g, " ") || "Notification"}
            </span>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {adminTimeAgo(notification.createdAt || notification.created_at || notification.date)}
            </p>
          </div>
          {!isRead && (
            <span className={`ml-auto w-2.5 h-2.5 rounded-full ${cfg.dot} shrink-0`} />
          )}
        </div>

        {/* Title */}
        <h2 className="text-lg font-extrabold text-slate-900 leading-snug mb-3">
          {notification.title || notification.subject || "Notification"}
        </h2>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-4" />

        {/* Message */}
        <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
          {stripHtmlToText(notification.message || notification.body || notification.description) || "No content."}
        </p>

        {/* Meta */}
        {(notification.sender || notification.from || notification.userId) && (
          <div className="mt-6 p-3 bg-white rounded-xl border border-slate-100 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">From: </span>
            {notification.sender || notification.from || notification.userId}
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
      `}</style>
    </div>
  );
}