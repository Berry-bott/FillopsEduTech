// import React from "react";
// import { Bell, Search } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import  useAdminStore  from "@/store/adminStore";

// function Header({ title, description }) {
//   const dashboard = useAdminStore((state) => state.dashboard);
//   const unreadCount = dashboard?.unreadMessages ?? 0;

//   return (
//     <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
//       <div>
//         <h1 className="text-xl font-semibold text-foreground">{title}</h1>
//         {description && (
//           <p className="text-sm text-muted-foreground">{description}</p>
//         )}
//       </div>
//       <div className="flex items-center gap-4">
//         <div className="relative">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
//           <Input placeholder="Search..." className="w-64 pl-9" />
//         </div>
//         <Button variant="ghost" size="icon" className="relative">
//           <Bell className="h-5 w-5" />
//           {unreadCount > 0 && (
//             <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-xs font-medium text-destructive-foreground">
//               {unreadCount}
//             </span>
//           )}
//         </Button>
//       </div>
//     </header>
//   );
// }

// export default Header;












import React, { useEffect, useState } from "react";
import { Bell, Search, Clock, CheckCheck, MessageSquare, AlertTriangle, Package, Info } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import useAdminNotificationStore from "@/store/adminNotificationStore";

// ─── Type → icon / colour map ─────────────────────────────────────────────────
const TYPE_META = {
  TICKET_REPLIED:  { Icon: MessageSquare, bg: "bg-blue-100 dark:bg-blue-900/40",    icon: "text-blue-500"   },
  TICKET_RECEIVED: { Icon: Info,          bg: "bg-purple-100 dark:bg-purple-900/40", icon: "text-purple-500" },
  SESSION_STARTED: { Icon: Package,       bg: "bg-green-100 dark:bg-green-900/40",   icon: "text-green-500"  },
  ALERT:           { Icon: AlertTriangle, bg: "bg-amber-100 dark:bg-amber-900/40",   icon: "text-amber-500"  },
  DEFAULT:         { Icon: Bell,          bg: "bg-gray-100 dark:bg-gray-700",         icon: "text-gray-500"   },
};

const getMeta = (type) => TYPE_META[type] || TYPE_META.DEFAULT;

const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7)  return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

// ─── Single notification row ──────────────────────────────────────────────────
function NotificationRow({ notification, onMarkRead, onNavigate }) {
  const id     = notification.id || notification._id;
  const isRead = notification.isRead || notification.read;
  const { Icon, bg, icon } = getMeta(notification.type);

  return (
    <div
      className={[
        "flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors",
        "hover:bg-gray-50 dark:hover:bg-gray-700/50",
        !isRead ? "bg-blue-50/40 dark:bg-blue-950/20" : "",
      ].join(" ")}
      onClick={() => {
        if (!isRead) onMarkRead(id);
        onNavigate(id);
      }}
    >
      {/* Icon bubble */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bg} flex items-center justify-center mt-0.5`}>
        <Icon className={`w-4 h-4 ${icon}`} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate ${isRead ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
          {notification.title || notification.subject || "Notification"}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
          {notification.message || notification.body || notification.description}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-[11px] text-gray-400">
            {timeAgo(notification.createdAt || notification.created_at || notification.date)}
          </span>
        </div>
      </div>

      {/* Unread dot */}
      {!isRead && (
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
      )}
    </div>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────────
function Header({ title, description }) {
  const navigate = useNavigate();

  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markOneAsRead,
    markAllAsRead,
  } = useAdminNotificationStore();

  const [notifOpen,  setNotifOpen]  = useState(false);
  const [markingAll, setMarkingAll] = useState(false);

  // Fetch unread count on mount + poll every 60 s
  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 60_000);
    return () => clearInterval(interval);
  }, [fetchUnreadCount]);

  // Load latest 5 whenever popover opens
  useEffect(() => {
    if (notifOpen) fetchNotifications({ page: 1, limit: 5 });
  }, [notifOpen]);

  const handleMarkAll = async () => {
    setMarkingAll(true);
    await markAllAsRead();
    setMarkingAll(false);
  };

  // Mark read inline then navigate to full page (with optional highlight)
  const goToNotifications = (id = null) => {
    setNotifOpen(false);
    navigate("/admin/notifications", id ? { state: { highlightId: id } } : undefined);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-6 backdrop-blur">
      {/* ── Left: title ── */}
      <div>
        <h1 className="text-xl font-semibold text-foreground">{title}</h1>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
      </div>

      {/* ── Right: search + bell ── */}
      <div className="flex items-center gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search..." className="w-64 pl-9" />
        </div>

        {/* ── Notification Popover ── */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              aria-label={`Notifications${unreadCount > 0 ? `, ${unreadCount} unread` : ""}`}
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground border-0 animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-80 p-0 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
          >
            {/* Popover header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                <span className="font-semibold text-sm text-gray-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <Badge className="text-[10px] px-1.5 py-0 bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-0">
                    {unreadCount} new
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAll}
                  disabled={markingAll}
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors disabled:opacity-50"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  {markingAll ? "Marking…" : "Mark all read"}
                </button>
              )}
            </div>

            {/* Notification list */}
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-3 px-4 py-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 animate-pulse shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-3/4" />
                      <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-full" />
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded animate-pulse w-1/3" />
                    </div>
                  </div>
                ))
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                  <Bell className="w-8 h-8 mb-2 opacity-30" />
                  <p className="text-sm">No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((n) => (
                  <NotificationRow
                    key={n.id || n._id}
                    notification={n}
                    onMarkRead={markOneAsRead}
                    onNavigate={goToNotifications}
                  />
                ))
              )}
            </div>

            {/* Footer → full page */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => goToNotifications()}
                className="w-full py-3 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-center"
              >
                View all notifications →
              </button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </header>
  );
}

export default Header;