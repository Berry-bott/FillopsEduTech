
import {
  Menu, Search, Bell, Settings, User, ChevronDown, Home,
  CheckCheck, Clock, MessageSquare, AlertTriangle, Package, Info,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ThemeToggle } from "../theme-toggle"
import { Link, useNavigate } from "react-router-dom"
import useAuthStore from "../../../store/authStore"
import useNotificationStore from "../../../store/userNotificationStore"
import { stripHtmlToText } from "@/lib/formatText"

// ─── Map API notification types to icons / colours ───────────────────────────
const TYPE_META = {
  TICKET_REPLIED:  { Icon: MessageSquare, bg: "bg-blue-100 dark:bg-blue-900/40",   icon: "text-blue-500"   },
  TICKET_RECEIVED: { Icon: Info,          bg: "bg-purple-100 dark:bg-purple-900/40", icon: "text-purple-500" },
  SESSION_STARTED: { Icon: Package,       bg: "bg-green-100 dark:bg-green-900/40",  icon: "text-green-500"  },
  ALERT:           { Icon: AlertTriangle, bg: "bg-amber-100 dark:bg-amber-900/40",  icon: "text-amber-500"  },
  DEFAULT:         { Icon: Bell,          bg: "bg-gray-100 dark:bg-gray-700",        icon: "text-gray-500"   },
}

const getMeta = (type) => TYPE_META[type] || TYPE_META.DEFAULT

const timeAgo = (dateStr) => {
  if (!dateStr) return ""
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return "just now"
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24)  return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days}d ago`
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" })
}

// ─── Single notification row inside the popover ──────────────────────────────
function NotificationRow({ notification, onMarkRead, onNavigate }) {
  const id     = notification.id || notification._id
  const isRead = notification.isRead || notification.read
  const { Icon, bg, icon } = getMeta(notification.type)

  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 cursor-pointer transition-colors
        hover:bg-gray-50 dark:hover:bg-gray-700/50
        ${!isRead ? "bg-blue-50/40 dark:bg-blue-950/20" : ""}`}
      onClick={() => {
        if (!isRead) onMarkRead(id)
        onNavigate(id)
      }}
    >
      {/* Icon bubble */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full ${bg} flex items-center justify-center mt-0.5`}>
        <Icon className={`w-4 h-4 ${icon}`} />
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate
          ${isRead ? "text-gray-500 dark:text-gray-400" : "text-gray-900 dark:text-white"}`}>
          {notification.title}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">
          {stripHtmlToText(notification.message || notification.body || notification.description)}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <Clock className="w-3 h-3 text-gray-400" />
          <span className="text-[11px] text-gray-400">
            {timeAgo(notification.createdAt || notification.created_at)}
          </span>
        </div>
      </div>

      {/* Unread dot */}
      {!isRead && (
        <div className="flex-shrink-0 w-2 h-2 rounded-full bg-blue-500 mt-2" />
      )}
    </div>
  )
}

// ─── Main TopNav ──────────────────────────────────────────────────────────────
export default function TopNav() {
  const user      = useAuthStore((state) => state.user)
  const checkAuth = useAuthStore((state) => state.checkAuth)
  const { logout } = useAuthStore()
  const navigate  = useNavigate()

  const {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    fetchUnreadCount,
    markOneAsRead,
    markAllAsRead,
  } = useNotificationStore()

  const [notifOpen, setNotifOpen] = useState(false)
  const [markingAll, setMarkingAll] = useState(false)

  const avatarUrl = user?.passportPhotoUrl
    ? `${user.passportPhotoUrl}?v=${user.updatedAt || user._updatedAt || Date.now()}`
    : "/default-avatar.png"

  // Bootstrap auth
  useEffect(() => { checkAuth() }, [])

  // Fetch unread count on mount (lightweight)
  useEffect(() => { fetchUnreadCount() }, [])

  // When popover opens, load the latest 5 notifications
  useEffect(() => {
    if (notifOpen) fetchNotifications({ page: 1, limit: 5 })
  }, [notifOpen])

  const handleMenuToggle = () => {
    if (typeof window !== "undefined" && window.toggleMenuState) window.toggleMenuState()
  }
  const handleMobileMenuToggle = () => {
    if (typeof window !== "undefined" && window.setIsMobileMenuOpen) {
      window.setIsMobileMenuOpen(!(window.isMobileMenuOpen || false))
    }
  }
  const handleLogout = async () => {
    await logout()
    sessionStorage.clear()
    navigate("/")
  }

  const handleMarkAll = async () => {
    setMarkingAll(true)
    await markAllAsRead()
    setMarkingAll(false)
  }

  // Click a row → mark read + go to notifications page with highlight state
  const goToNotifications = (id = null) => {
    setNotifOpen(false)
    navigate("/notifications", id ? { state: { highlightId: id } } : undefined)
  }

  return (
    <div className="flex items-center justify-between h-full px-2 lg:px-2">

      {/* ── Left ── */}
      <div className="flex items-center">
        <Button variant="ghost" size="sm" onClick={handleMenuToggle} className="hidden lg:flex" title="Toggle Menu">
          <Menu className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" onClick={handleMobileMenuToggle} className="lg:hidden p-2">
          <Menu className="h-4 w-4" />
        </Button>
        <nav className="hidden sm:flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
          <Link to="/dashboard" className="flex items-center hover:text-gray-900 dark:hover:text-white">
            <Home className="h-4 w-4 mr-1" />
            Dashboard
          </Link>
        </nav>
      </div>

      {/* ── Center – Search ── */}
      <div className="hidden md:flex flex-1 max-w-md mx-4">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          />
        </div>
      </div>

      {/* ── Right ── */}
      <div className="flex items-center space-x-2">

        <Button variant="ghost" size="sm" className="md:hidden p-2">
          <Search className="h-4 w-4" />
        </Button>

        <ThemeToggle />

        {/* ── Notification Popover ── */}
        <Popover open={notifOpen} onOpenChange={setNotifOpen}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-4 w-4" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-red-500 text-white border-0">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-80 p-0 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700
              bg-white dark:bg-gray-800 overflow-hidden"
          >
            {/* Header */}
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
                  className="flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400
                    hover:text-blue-800 dark:hover:text-blue-200 transition-colors disabled:opacity-50"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  {markingAll ? "Marking…" : "Mark all read"}
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-gray-100 dark:divide-gray-700/50">
              {loading ? (
                // Skeleton rows
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

            {/* Footer */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => goToNotifications()}
                className="w-full py-3 text-sm font-medium text-blue-600 dark:text-blue-400
                  hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors text-center"
              >
                View all notifications →
              </button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Settings */}
        <Button variant="ghost" size="sm" className="p-2" onClick={() => navigate("/users-settings")}>
          <Settings className="h-4 w-4" />
        </Button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center space-x-2 p-2">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  key={user?.passportPhotoUrl || "no-avatar"}
                  src={avatarUrl}
                  alt={`${user?.firstName || "User"} profile photo`}
                />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {user?.firstName
                    ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
                    : "User"}
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400">Students</span>
              </div>
              <ChevronDown className="hidden lg:block h-4 w-4 text-gray-500" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56 bg-white dark:bg-gray-800 shadow-md rounded-md">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate("/myprofile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate("/users-settings")}>
              <Settings className="mr-2 h-4 w-4" /> Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

      </div>
    </div>
  )
}