// import { useState, useEffect, useCallback } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import useNotificationStore from "../../store/notificationstore";
// import {
//   Ticket, Video, AlertTriangle, Bell, ArrowLeft,
//   Check, Trash2, X,
// } from "lucide-react";

// const TicketIcon  = () => <Ticket       size={18} strokeWidth={2} />;
// const SessionIcon = () => <Video        size={18} strokeWidth={2} />;
// const AlertIcon   = () => <AlertTriangle size={18} strokeWidth={2} />;
// const BellIcon    = ({ size = 18 }) => <Bell size={size} strokeWidth={2} />;
// const BackIcon    = () => <ArrowLeft    size={18} strokeWidth={2.2} />;
// const CheckIcon   = () => <Check        size={14} strokeWidth={2.5} />;
// const TrashIcon   = () => <Trash2       size={14} strokeWidth={2} />;
// const CloseIcon   = () => <X            size={13} strokeWidth={2.2} />;

// // ─── helpers ──────────────────────────────────────────────────────────────────
// const timeAgo = (dateStr) => {
//   if (!dateStr) return "";
//   const diff = Date.now() - new Date(dateStr).getTime();
//   const mins = Math.floor(diff / 60000);
//   if (mins < 1) return "just now";
//   if (mins < 60) return `${mins}m ago`;
//   const hrs = Math.floor(mins / 60);
//   if (hrs < 24) return `${hrs}h ago`;
//   const days = Math.floor(hrs / 24);
//   if (days < 7) return `${days}d ago`;
//   return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
// };

// const formatFullDate = (dateStr) => {
//   if (!dateStr) return "";
//   return new Date(dateStr).toLocaleString("en-US", {
//     weekday: "long", year: "numeric", month: "long",
//     day: "numeric", hour: "2-digit", minute: "2-digit",
//   });
// };

// // ─── type config ──────────────────────────────────────────────────────────────
// const typeConfig = {
//   TICKET_REPLIED:  { bg: "bg-blue-50",   icon: "text-blue-600",   dot: "bg-blue-500",   border: "border-l-blue-500",   label: "Ticket Reply"   },
//   TICKET_RECEIVED: { bg: "bg-purple-50", icon: "text-purple-600", dot: "bg-purple-500", border: "border-l-purple-500", label: "Support Ticket" },
//   SESSION_STARTED: { bg: "bg-green-50",  icon: "text-green-600",  dot: "bg-green-500",  border: "border-l-green-500",  label: "Session"        },
//   ALERT:           { bg: "bg-orange-50", icon: "text-orange-600", dot: "bg-orange-400", border: "border-l-orange-400", label: "Alert"          },
//   order:           { bg: "bg-green-50",  icon: "text-green-700",  dot: "bg-green-500",  border: "border-l-green-500",  label: "Order"          },
//   alert:           { bg: "bg-orange-50", icon: "text-orange-700", dot: "bg-orange-400", border: "border-l-orange-400", label: "Alert"          },
//   message:         { bg: "bg-blue-50",   icon: "text-blue-700",   dot: "bg-blue-500",   border: "border-l-blue-500",   label: "Message"        },
//   default:         { bg: "bg-slate-50",  icon: "text-slate-600",  dot: "bg-slate-400",  border: "border-l-slate-400",  label: "Notification"   },
// };
// const getConfig  = (type) => typeConfig[type] || typeConfig.default;
// const getTypeIcon = (type) => {
//   if (type === "TICKET_REPLIED" || type === "TICKET_RECEIVED" || type === "message") return <TicketIcon />;
//   if (type === "SESSION_STARTED") return <SessionIcon />;
//   if (type === "ALERT" || type === "alert") return <AlertIcon />;
//   return <BellIcon size={18} />;
// };

// // ─── Delete Confirm Modal ─────────────────────────────────────────────────────
// // Rendered at the ROOT level so it's never trapped inside a transform/overflow context
// function DeleteConfirmModal({ onConfirm, onCancel, isDeleting }) {
//   // Lock body scroll while modal is open
//   useEffect(() => {
//     document.body.style.overflow = "hidden";
//     return () => { document.body.style.overflow = ""; };
//   }, []);

//   return (
//     <div className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center px-4 pb-6 sm:pb-0">
//       {/* Backdrop */}
//       <div
//         className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
//         onClick={!isDeleting ? onCancel : undefined}
//       />

//       {/* Dialog */}
//       <div
//         className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden"
//         style={{ animation: "slideUp 0.2s ease both" }}
//       >
//         <div className="h-1 w-full bg-gradient-to-r from-red-400 to-rose-500" />

//         <div className="px-6 pt-6 pb-5">
//           <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4 text-red-500">
//             <Trash2 size={22} strokeWidth={2} />
//           </div>
//           <h3 className="text-base font-bold text-slate-900">Delete notification?</h3>
//           <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">
//             This notification will be permanently removed. This action cannot be undone.
//           </p>
//         </div>

//         <div className="flex gap-2.5 px-6 pb-6">
//           <button
//             onClick={onCancel}
//             disabled={isDeleting}
//             className="flex-1 py-2.5 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-50 rounded-xl transition-colors"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isDeleting}
//             className="flex-1 py-2.5 text-sm font-semibold text-white bg-red-500 hover:bg-red-600 disabled:opacity-70 rounded-xl transition-colors flex items-center justify-center gap-2"
//           >
//             {isDeleting ? (
//               <>
//                 <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
//                 Deleting…
//               </>
//             ) : "Delete"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Detail Panel ─────────────────────────────────────────────────────────────
// function NotificationDetail({ notification, onBack, onMarkRead, onRequestDelete }) {
//   const id     = notification.id || notification._id;
//   const isRead = notification.isRead || notification.read;
//   const cfg    = getConfig(notification.type);

//   return (
//     <div
//       className="absolute inset-0 bg-slate-50 z-20 flex flex-col"
//       style={{ animation: "slideInRight 0.22s ease both" }}
//     >
//       {/* Top bar */}
//       <div className="flex items-center gap-3 px-4 pt-10 pb-4">
//         <button
//           onClick={onBack}
//           className="w-9 h-9 rounded-xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-slate-600 hover:text-slate-900 transition-colors"
//         >
//           <BackIcon />
//         </button>
//         <span className="text-sm font-semibold text-slate-700">Notification detail</span>
//       </div>

//       {/* Card */}
//       <div className="flex-1 overflow-y-auto px-4 pb-10">
//         <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">

//           {/* Coloured header */}
//           <div className={`px-5 py-5 ${cfg.bg} border-b border-slate-100`}>
//             <div className="flex items-start gap-4">
//               <div className={`w-11 h-11 rounded-xl ${cfg.bg} border border-white shadow-sm flex items-center justify-center ${cfg.icon} shrink-0`}>
//                 {getTypeIcon(notification.type)}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <span className={`text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.icon} border border-current/10`}>
//                     {cfg.label}
//                   </span>
//                   {!isRead && (
//                     <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-red-50 text-red-500">
//                       Unread
//                     </span>
//                   )}
//                 </div>
//                 <h2 className="text-base font-bold text-slate-900 mt-2 leading-snug">
//                   {notification.title || "Notification"}
//                 </h2>
//                 <p className="text-xs text-slate-400 mt-1">
//                   {formatFullDate(notification.createdAt || notification.created_at)}
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Message */}
//           <div className="px-5 py-5">
//             <p className="text-sm text-slate-700 leading-relaxed">
//               {notification.message || notification.body || notification.description || "No message content."}
//             </p>

//             {notification.data && Object.keys(notification.data).length > 0 && (
//               <div className="mt-5 rounded-xl bg-slate-50 border border-slate-100 divide-y divide-slate-100">
//                 {Object.entries(notification.data).map(([key, val]) => (
//                   <div key={key} className="flex items-start justify-between gap-3 px-4 py-3">
//                     <span className="text-xs text-slate-400 capitalize shrink-0">
//                       {key.replace(/([A-Z])/g, " $1").trim()}
//                     </span>
//                     <span className="text-xs text-slate-600 font-mono text-right break-all">
//                       {String(val)}
//                     </span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Actions */}
//           <div className="px-5 pb-5 flex gap-3">
//             {!isRead && (
//               <button
//                 onClick={() => onMarkRead(id, false)}
//                 className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 px-4 py-2.5 rounded-xl transition-colors"
//               >
//                 <CheckIcon /> Mark as read
//               </button>
//             )}
//             <button
//               onClick={() => onRequestDelete(id)}
//               className="flex items-center gap-2 text-xs font-semibold text-red-500 bg-red-50 hover:bg-red-100 px-4 py-2.5 rounded-xl transition-colors ml-auto"
//             >
//               <TrashIcon /> Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Main page ────────────────────────────────────────────────────────────────
// export default function NotificationsPage() {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const {
//     notifications, unreadCount, loading, loadingMore, hasMore, error,
//     fetchNotifications, fetchUnreadCount, loadMoreNotifications,
//     markOneAsRead, markAllAsRead, deleteNotification, clearError,
//   } = useNotificationStore();

//   const [filter,         setFilter]         = useState("all");
//   const [markingAllRead, setMarkingAllRead]  = useState(false);
//   const [selected,       setSelected]       = useState(null);   // detail view
//   const [pendingDeleteId, setPendingDeleteId] = useState(null); // id waiting for confirm
//   const [isDeleting,     setIsDeleting]     = useState(false);

//   const load = useCallback((f = filter) => {
//     fetchNotifications({ page: 1, limit: 10, unreadOnly: f === "unread" });
//     fetchUnreadCount();
//   }, [filter]);

//   useEffect(() => { load(filter); }, [filter]);

//   // Auto-open from TopNav highlight
//   useEffect(() => {
//     const highlightId = location.state?.highlightId;
//     if (highlightId && notifications.length > 0) {
//       const found = notifications.find((n) => (n.id || n._id) === highlightId);
//       if (found) setSelected(found);
//     }
//   }, [location.state, notifications]);

//   const handleOpen = (n) => {
//     const id     = n.id || n._id;
//     const isRead = n.isRead || n.read;
//     setSelected(n);
//     if (!isRead) markOneAsRead(id);
//   };

//   const handleMarkRead = async (id, isRead) => {
//     if (isRead) return;
//     await markOneAsRead(id);
//     setSelected((prev) => prev ? { ...prev, isRead: true, read: true } : prev);
//   };

//   const handleMarkAll = async () => {
//     setMarkingAllRead(true);
//     await markAllAsRead();
//     setMarkingAllRead(false);
//   };

//   // Single entry point for delete — both list X and detail Delete btn call this
//   const requestDelete = (id, e) => {
//     if (e) e.stopPropagation();
//     setPendingDeleteId(id);
//   };

//   const handleDeleteConfirm = async () => {
//     if (!pendingDeleteId) return;
//     setIsDeleting(true);
//     await deleteNotification(pendingDeleteId);
//     setIsDeleting(false);
//     // If we were in detail view for this notification, go back to list
//     if (selected && (selected.id === pendingDeleteId || selected._id === pendingDeleteId)) {
//       setSelected(null);
//     }
//     setPendingDeleteId(null);
//   };

//   const handleDeleteCancel = () => {
//     if (isDeleting) return;
//     setPendingDeleteId(null);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 relative overflow-hidden">
//       {/* Grid bg */}
//       <div
//         className="fixed inset-0 pointer-events-none z-0"
//         style={{
//           backgroundImage:
//             "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
//           backgroundSize: "32px 32px",
//         }}
//       />

//       {/* Clipping wrapper */}
//       <div className="relative z-10 max-w-xl mx-auto" style={{ minHeight: "100vh" }}>

//         {/* ── List view ── */}
//         <div className="px-4 py-10 pb-20">

//           {/* Header */}
//           <div className="flex items-center gap-3 justify-between mb-7">
//             <div className="flex items-center gap-3">
//               <div className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-100">
//                 <BellIcon size={22} />
//                 {unreadCount > 0 && (
//                   <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold leading-none px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-slate-50 animate-pulse">
//                     {unreadCount > 99 ? "99+" : unreadCount}
//                   </span>
//                 )}
//               </div>
//               <div>
//                 <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight leading-tight">
//                   Notifications
//                 </h1>
//                 <p className="text-xs text-slate-400 mt-0.5">
//                   {unreadCount > 0 ? `${unreadCount} unread` : "All caught up"}
//                 </p>
//               </div>
//             </div>

//             <div className="flex items-center gap-2">
//               <button
//                 onClick={() => navigate("/user/dashboard")}
//                 className="group flex items-center gap-2 px-3 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-900"
//               >
//                 <BackIcon />
//               </button>

//               {unreadCount > 0 && (
//                 <button
//                   onClick={handleMarkAll}
//                   disabled={markingAllRead}
//                   className="text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 px-3.5 py-2 rounded-xl transition-colors"
//                 >
//                   {markingAllRead ? "Marking…" : "Mark all read"}
//                 </button>
//               )}
//             </div>
//           </div>

//           {/* Filter tabs */}
//           <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl mb-5">
//             {["all", "unread"].map((tab) => (
//               <button
//                 key={tab}
//                 onClick={() => setFilter(tab)}
//                 className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
//                   filter === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400 hover:text-slate-600"
//                 }`}
//               >
//                 {tab === "all" ? "All" : `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
//               </button>
//             ))}
//           </div>

//           {/* Error */}
//           {error && (
//             <div className="flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4 text-xs text-red-700">
//               <span>{error}</span>
//               <button onClick={clearError} className="font-bold text-red-500 hover:text-red-700 ml-3">✕</button>
//             </div>
//           )}

//           {/* List */}
//           <div className="flex flex-col gap-2">
//             {loading ? (
//               Array.from({ length: 5 }).map((_, i) => (
//                 <div key={i} className="h-20 rounded-2xl bg-slate-100 animate-pulse" style={{ animationDelay: `${i * 80}ms` }} />
//               ))
//             ) : notifications.length === 0 ? (
//               <div className="flex flex-col items-center py-16 gap-4">
//                 <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-sm border border-slate-100 text-slate-300">
//                   <BellIcon size={36} />
//                 </div>
//                 <p className="text-sm text-slate-400">
//                   {filter === "unread" ? "No unread notifications" : "No notifications yet"}
//                 </p>
//               </div>
//             ) : (
//               notifications.map((n, idx) => {
//                 const id        = n._id || n.id;
//                 const isRead    = n.read || n.isRead;
//                 const cfg       = getConfig(n.type);
//                 const isPending = pendingDeleteId === id;

//                 return (
//                   <div
//                     key={id}
//                     role="button"
//                     tabIndex={0}
//                     onClick={() => handleOpen(n)}
//                     onKeyDown={(e) => e.key === "Enter" && handleOpen(n)}
//                     className={[
//                       "flex items-start gap-3 px-4 py-3.5 rounded-2xl border-l-4 cursor-pointer",
//                       "bg-white shadow-sm transition-all duration-150",
//                       "hover:shadow-md hover:-translate-y-px",
//                       "outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
//                       isRead ? "border-l-transparent" : cfg.border,
//                       isPending ? "opacity-40 pointer-events-none" : "",
//                     ].join(" ")}
//                     style={{ animation: `fadeUp 0.3s ease ${idx * 40}ms both` }}
//                   >
//                     <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${cfg.bg} ${cfg.icon}`}>
//                       {getTypeIcon(n.type)}
//                     </div>

//                     <div className="flex-1 min-w-0">
//                       <div className="flex items-start justify-between gap-2">
//                         <span className={`text-sm text-slate-800 leading-snug ${isRead ? "font-medium" : "font-bold"}`}>
//                           {n.title || n.subject || "Notification"}
//                         </span>
//                         <span className="text-[10px] text-slate-400 shrink-0 mt-0.5">
//                           {timeAgo(n.createdAt || n.created_at || n.date)}
//                         </span>
//                       </div>
//                       {(n.message || n.body || n.description) && (
//                         <p className="text-xs text-slate-500 mt-1 leading-relaxed truncate">
//                           {n.message || n.body || n.description}
//                         </p>
//                       )}
//                       <p className="text-[10px] text-slate-300 mt-1.5 font-medium">Tap to read →</p>
//                     </div>

//                     <div className="flex flex-col items-center gap-1.5 shrink-0 self-center">
//                       {!isRead && <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />}
//                       <button
//                         onClick={(e) => requestDelete(id, e)}
//                         className="text-slate-300 hover:text-red-400 transition-colors p-0.5 rounded"
//                         title="Remove"
//                       >
//                         <CloseIcon />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })
//             )}
//           </div>

//           {/* Load more */}
//           {!loading && hasMore && notifications.length > 0 && (
//             <div className="flex justify-center mt-6">
//               <button
//                 onClick={() => loadMoreNotifications({ unreadOnly: filter === "unread" })}
//                 disabled={loadingMore}
//                 className="flex items-center gap-2 text-xs font-semibold text-indigo-600 bg-white border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 disabled:opacity-50 px-7 py-2.5 rounded-xl transition-all shadow-sm"
//               >
//                 {loadingMore ? (
//                   <>
//                     <span className="w-3.5 h-3.5 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
//                     Loading…
//                   </>
//                 ) : "Load more"}
//               </button>
//             </div>
//           )}
//         </div>

//         {/* ── Detail slide-in panel ── */}
//         {selected && (
//           <NotificationDetail
//             notification={selected}
//             onBack={() => setSelected(null)}
//             onMarkRead={handleMarkRead}
//             onRequestDelete={requestDelete}
//           />
//         )}
//       </div>

//       {/* ── Delete modal — rendered OUTSIDE all transform/overflow containers ── */}
//       {pendingDeleteId && (
//         <DeleteConfirmModal
//           onConfirm={handleDeleteConfirm}
//           onCancel={handleDeleteCancel}
//           isDeleting={isDeleting}
//         />
//       )}

//     </div>
//   );
// }





import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useNotificationStore from "../../store/userNotificationStore";
import { BellIcon, BackIcon, CloseIcon, getConfig, getTypeIcon, timeAgo } from "../../components/DashboardComponents/user/notification/NotificationUtils";
import NotificationDetail  from "../../components/DashboardComponents/user/notification/NotificationDetail";
import DeleteConfirmModal  from "../../components/DashboardComponents/user/notification/DeleteConfirmModal";

// ─── NotificationItem ─────────────────────────────────────────────────────────
function NotificationItem({ notification, index, onOpen, onRequestDelete, isPending }) {
  const id     = notification._id || notification.id;
  const isRead = notification.read || notification.isRead;
  const cfg    = getConfig(notification.type);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(notification)}
      onKeyDown={(e) => e.key === "Enter" && onOpen(notification)}
      className={[
        "flex items-start gap-3 px-4 py-3.5 rounded-2xl border-l-4 cursor-pointer",
        "bg-white shadow-sm transition-all duration-150 ",
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
        {(notification.message || notification.body || notification.description) && (
          <p className="text-xs text-slate-500 mt-1 leading-relaxed truncate">
            {notification.message || notification.body || notification.description}
          </p>
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

  const load = useCallback((f = filter) => {
    fetchNotifications({ page: 1, limit: 10, unreadOnly: f === "unread" });
    fetchUnreadCount();
  }, [filter]);

  useEffect(() => { load(filter); }, [filter]);

  useEffect(() => {
    const highlightId = location.state?.highlightId;
    if (highlightId && notifications.length > 0) {
      const found = notifications.find((n) => (n.id || n._id) === highlightId);
      if (found) setSelected(found);
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
    <div className="min-h-screen bg-slate-50 relative overflow-hidden">
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(99,102,241,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.04) 1px,transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-10 max-w-xl mx-auto" style={{ minHeight: "100vh" }}>
        <div className="px-4 py-10 pb-20">

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
                onClick={() => navigate("/user/dashboard")}
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