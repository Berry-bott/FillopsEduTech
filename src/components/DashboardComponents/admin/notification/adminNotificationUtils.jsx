import {
  Bell,
  MessageSquare,
  AlertTriangle,
  Package,
  Info,
  CheckCircle,
  ArrowLeft,
  X,
} from "lucide-react";

// ─── Type config ──────────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  TICKET_REPLIED:  {
    bg: "bg-blue-50",   icon: "text-blue-500",   border: "border-l-blue-400",   dot: "bg-blue-400",
  },
  TICKET_RECEIVED: {
    bg: "bg-purple-50", icon: "text-purple-500", border: "border-l-purple-400", dot: "bg-purple-400",
  },
  SESSION_STARTED: {
    bg: "bg-green-50",  icon: "text-green-500",  border: "border-l-green-400",  dot: "bg-green-400",
  },
  ALERT: {
    bg: "bg-amber-50",  icon: "text-amber-500",  border: "border-l-amber-400",  dot: "bg-amber-400",
  },
  DEFAULT: {
    bg: "bg-slate-50",  icon: "text-slate-400",  border: "border-l-slate-300",  dot: "bg-slate-400",
  },
};

export const getAdminConfig = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.DEFAULT;

export const getAdminTypeIcon = (type) => {
  const props = { size: 15 };
  switch (type) {
    case "TICKET_REPLIED":  return <MessageSquare {...props} />;
    case "TICKET_RECEIVED": return <Info {...props} />;
    case "SESSION_STARTED": return <Package {...props} />;
    case "ALERT":           return <AlertTriangle {...props} />;
    default:                return <Bell {...props} />;
  }
};

export const adminTimeAgo = (dateStr) => {
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

// ─── Icon components ──────────────────────────────────────────────────────────
export const AdminBellIcon    = ({ size = 20 }) => <Bell size={size} />;
export const AdminBackIcon    = () => <ArrowLeft size={16} />;
export const AdminCloseIcon   = () => <X size={13} />;
export const AdminCheckIcon   = () => <CheckCircle size={14} />;