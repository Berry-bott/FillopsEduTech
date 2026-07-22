import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useNotificationStore from "../../store/tutorNotificationStore";
import { BellIcon, BackIcon, CloseIcon, getConfig, getTypeIcon, timeAgo } from "../../components/DashboardComponents/lecturer/notification/NotificationUtils";
import NotificationDetail  from "../../components/DashboardComponents/lecturer/notification/NotificationDetail";
import DeleteConfirmModal  from "../../components/DashboardComponents/lecturer/notification/DeleteConfirmModal";

// Strips HTML tags and decodes entities (e.g. &nbsp; → space) for plain-text previews
function stripHtml(html) {
  if (!html) return "";
  const txt = document.createElement("textarea");
  txt.innerHTML = html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  return txt.value;
}

// ─── NotificationItem ─────────────────────────────────────────────────────────
function NotificationItem({ notification, index, onOpen, onRequestDelete, isPending }) {
  const id     = notification._id || notification.id;
  const isRead = notification.read || notification.isRead;
  const cfg    = getConfig(notification.type);
  const preview = stripHtml(notification.message || notification.body || notification.description);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(notification)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(notification)}
      className={[
        "flex items-start gap-3 px-4 py-3.5 rounded-2xl border-l-4 cursor-pointer",
        "bg-white shadow-sm transition-all duration-150",
        "hover:shadow-md hover:-translate-y-px",
        "outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
        isRead ? "border-l-transparent" : cfg.border,
        isPending ? "opacity-40 pointer-events-none" : "",
      ].join(" ")}
      style={{ animation: `fadeUp 0.3s ease ${index * 40}ms both` }}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.icon}`}>
        {getTypeIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <span className={`text-sm text-slate-800 leading-snug ${isRead ? "font-medium" : "font-bold"}`}>
            {notification.title || notification.subject || "Notification"}
          </span>
          <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
            {timeAgo(notification.createdAt || notification.created_at || notification.date)}
          </span>
        </div>
        {preview && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed truncate">{preview}</p>
        )}
        <p className="text-[10px] text-slate-300 mt-1.5 font-medium">Tap to read →</p>
      </div>

      <div className="flex flex-col items-center gap-1.5 shrink-0 self-center">
        {!isRead && <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
        <button
          onClick={(e) => onRequestDelete(id, e)}
          className="text-slate-300 hover:text-red-400 transition-colors p-0.5 rounded"
          title="Remove"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  );
}

// ─── NotificationsPage ────────────────────────────────────────────────────────
export default function NotificationsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    notifications, unreadCount, loading, loadingMore, hasMore, error,
    fetchNotifications, fetchUnreadCount, loadMoreNotifications,
    markOneAsRead, markAllAsRead, deleteNotification, clearError,
  } = useNotificationStore();

  const [filter,          setFilter]          = useState("all");
  const [markingAllRead,  setMarkingAllRead]   = useState(false);
  const [selected,        setSelected]        = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting,      setIsDeleting]      = useState(false);

  // Guard so the highlight effect only fires once, not on every Load More
  const highlightHandled = useRef(false);

  const load = useCallback((f = filter) => {
    fetchNotifications({ page: 1, limit: 10, unreadOnly: f === "unread" });
    fetchUnreadCount();
  }, [filter]);

  useEffect(() => { load(filter); }, [filter]);

  useEffect(() => {
    if (highlightHandled.current) return;
    const highlightId = location.state?.highlightId;
    if (highlightId && notifications.length > 0) {
      const found = notifications.find((n) => (n.id || n._id) === highlightId);
      if (found) {
        setSelected(found);
        highlightHandled.current = true;
      }
    }
  }, [location.state, notifications]);

  const handleOpen = (n) => {
    setSelected(n);
    const id = n.id || n._id;
    if (!(n.isRead || n.read)) markOneAsRead(id);
  };

  const handleMarkRead = async (id, isRead) => {
    if (isRead) return;
    await markOneAsRead(id);
    setSelected((prev) => prev ? { ...prev, isRead: true, read: true } : prev);
  };

  const handleMarkAll = async () => {
    setMarkingAllRead(true);
    await markAllAsRead();
    setMarkingAllRead(false);
  };

  const requestDelete = (id, e) => {
    if (e) e.stopPropagation();
    setPendingDeleteId(id);
  };

  const handleDeleteConfirm = async () => {
    if (!pendingDeleteId) return;
    setIsDeleting(true);
    await deleteNotification(pendingDeleteId);
    setIsDeleting(false);
    if (selected && (selected.id === pendingDeleteId || selected._id === pendingDeleteId)) {
      setSelected(null);
    }
    setPendingDeleteId(null);
  };

  return (
    <div className=" relative overflow-hidden">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10  mx-auto" style={{ minHeight: "100vh" }}>
        <div className="px-4 py-1 pb-20">

          {/* ── Header ── */}
          <div className="flex items-center justify-between mb-7">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
                <BellIcon size={22} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-slate-50 animate-pulse">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">Notifications</h1>
                <p className="text-xs text-slate-400 mt-0.5">
                  {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/tutor/dashboard")}
                className="flex items-center justify-center w-9 h-9 bg-white/80 hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
              >
                <BackIcon />
              </button>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  disabled={markingAllRead}
                  className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 px-3.5 py-2 rounded-xl transition-colors"
                >
                  {markingAllRead ? "Marking…" : "Mark all read"}
                </button>
              )}
            </div>
          </div>

          {/* ── Filter tabs ── */}
          <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-5">
            {["all", "unread"].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  filter === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab === "all" ? "All" : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
              </button>
            ))}
          </div>

          {/* ── Error ── */}
          {error && (
            <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs text-red-700">
              <span>{error}</span>
              <button onClick={clearError} className="font-bold text-red-500 hover:text-red-700 ml-3">✕</button>
            </div>
          )}

          {/* ── List ── */}
          {loading ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center py-16 gap-4">
              <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-300">
                <BellIcon size={36} />
              </div>
              <p className="text-sm text-slate-400">
                {filter === "unread" ? "No unread notifications" : "No notifications yet"}
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {notifications.map((n, idx) => (
                <NotificationItem
                  key={n._id || n.id}
                  notification={n}
                  index={idx}
                  onOpen={handleOpen}
                  onRequestDelete={requestDelete}
                  isPending={pendingDeleteId === (n._id || n.id)}
                />
              ))}
            </div>
          )}

          {/* ── Load more ── */}
          {!loading && hasMore && notifications.length > 0 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={() => loadMoreNotifications({ unreadOnly: filter === "unread" })}
                disabled={loadingMore}
                className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 px-7 py-2.5 rounded-xl transition-all shadow-sm"
              >
                {loadingMore ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                    Loading…
                  </>
                ) : "Load more"}
              </button>
            </div>
          )}
        </div>

        {/* ── Detail panel ── */}
        {selected && (
          <NotificationDetail
            notification={selected}
            onBack={() => setSelected(null)}
            onMarkRead={handleMarkRead}
            onRequestDelete={requestDelete}
          />
        )}
      </div>

      {/* ── Delete modal ── */}
      {pendingDeleteId && (
        <DeleteConfirmModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => { if (!isDeleting) setPendingDeleteId(null); }}
          isDeleting={isDeleting}
        />
      )}

    </div>
  );
}