import { useState, useEffect, useRef } from "react";
import { Bell, X, CheckCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useNotificationStore from "@/store/tutorNotificationStore";
import { getConfig, getTypeIcon, timeAgo } from "@/components/DashboardComponents/lecturer/notification/NotificationUtils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function stripHtml(html) {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return txt.value;
}

// ─── BellNotificationRow ──────────────────────────────────────────────────────

function BellNotificationRow({ notification, onClick }) {
  const isRead  = notification.read || notification.isRead;
  const cfg     = getConfig(notification.type);
  const preview = stripHtml(notification.message || notification.body || notification.description);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onClick(notification)}
      onKeyDown={(e) => e.key === "Enter" && onClick(notification)}
      className={cn(
        "flex items-start gap-3 px-4 py-3 cursor-pointer transition-all duration-150 border-l-4",
        "hover:bg-slate-50 outline-none focus-visible:bg-slate-50",
        isRead ? "border-l-transparent" : cfg.border,
      )}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.icon}`}>
        {getTypeIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-sm text-slate-800 leading-snug ${isRead ? "font-medium" : "font-bold"}`}>
            {notification.title || notification.subject || "Notification"}
          </span>
          <span className="text-[10px] text-slate-400 shrink-0 mt-0.5 whitespace-nowrap">
            {timeAgo(notification.createdAt || notification.created_at || notification.date)}
          </span>
        </div>
        {preview && (
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed truncate">{preview}</p>
        )}
      </div>

      {!isRead && <span className={`w-1.5 h-1.5 rounded-full shrink-0 self-center ${cfg.dot}`} />}
    </div>
  );
}

// ─── NotificationBellDropdown ─────────────────────────────────────────────────

export default function NotificationBellDropdown({ onViewAll }) {
  const [open,       setOpen]       = useState(false);
  const [markingAll, setMarkingAll] = useState(false);
  const dropdownRef = useRef(null);

  const {
    notifications, unreadCount, loading, hasMore, loadingMore,
    fetchNotifications, fetchUnreadCount, loadMoreNotifications,
    markOneAsRead, markAllAsRead,
  } = useNotificationStore();

  // Close on outside click
  useEffect(() => {
    function onOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  // Fetch on open
  useEffect(() => {
    if (!open) return;
    fetchNotifications({ page: 1, limit: 10 });
    fetchUnreadCount();
  }, [open, fetchNotifications, fetchUnreadCount]);

  // Click a row → mark read, close dropdown, tell parent which ID to highlight
  const handleRowClick = (n) => {
    const id = n.id || n._id;
    if (!(n.isRead || n.read)) markOneAsRead(id);
    setOpen(false);
    onViewAll?.(id); // ← passes the ID up so parent can switch tab + set highlightId
  };

  const handleMarkAll = async () => {
    setMarkingAll(true);
    await markAllAsRead();
    setMarkingAll(false);
    fetchUnreadCount();
  };

  return (
    <div ref={dropdownRef} className="relative">

      {/* Bell trigger */}
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={() => setOpen((o) => !o)}
        aria-label={unreadCount > 0 ? `${unreadCount} unread notifications` : "Notifications"}
      >
        <Bell className={cn("h-5 w-5", open && "text-primary")} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full leading-none border-2 border-background animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-[360px] max-h-[520px] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-[99999]"
          style={{ animation: "bellFadeDown 0.15s ease both" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-white shrink-0">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Notifications</h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  disabled={markingAll}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  {markingAll ? "Marking…" : "Mark all read"}
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="flex flex-col gap-2 p-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" style={{ animationDelay: `${i * 60}ms` }} />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-slate-400">
                <Bell className="w-10 h-10 opacity-30" />
                <p className="text-sm">No notifications yet</p>
              </div>
            ) : (
              notifications.map((n) => (
                <BellNotificationRow
                  key={n._id || n.id}
                  notification={n}
                  onClick={handleRowClick}
                />
              ))
            )}

            {/* Load more */}
            {!loading && hasMore && (
              <div className="flex justify-center py-3">
                <button
                  onClick={() => loadMoreNotifications({})}
                  disabled={loadingMore}
                  className="flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-50 transition-colors"
                >
                  {loadingMore && <span className="w-3 h-3 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />}
                  {loadingMore ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t bg-slate-50 shrink-0">
            <button
              onClick={() => { setOpen(false); onViewAll?.(); }}
              className="w-full flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View all notifications
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bellFadeDown {
          from { opacity: 0; transform: translateY(-6px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}