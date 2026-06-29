import {
  Ticket, Video, AlertTriangle, Bell, ArrowLeft,
  Check, Trash2, X,
} from "lucide-react";

// ─── Icons ────────────────────────────────────────────────────────────────────
export const TicketIcon   = () => <Ticket        size={18} strokeWidth={2} />;
export const SessionIcon  = () => <Video         size={18} strokeWidth={2} />;
export const AlertIcon    = () => <AlertTriangle size={18} strokeWidth={2} />;
export const BellIcon     = ({ size = 18 }) => <Bell size={size} strokeWidth={2} />;
export const BackIcon     = () => <ArrowLeft     size={18} strokeWidth={2.2} />;
export const CheckIcon    = () => <Check         size={14} strokeWidth={2.5} />;
export const TrashIcon    = () => <Trash2        size={14} strokeWidth={2} />;
export const CloseIcon    = () => <X             size={13} strokeWidth={2.2} />;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const timeAgo = (dateStr) => {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

export const formatFullDate = (dateStr) => {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleString("en-US", {
    weekday: "long", year: "numeric", month: "long",
    day: "numeric", hour: "2-digit", minute: "2-digit",
  });
};

// ─── Type config ──────────────────────────────────────────────────────────────
export const typeConfig = {
  TICKET_REPLIED:  { bg: "bg-blue-50",   icon: "text-blue-600",   dot: "bg-blue-500",   border: "border-l-blue-500",   label: "Ticket Reply"   },
  TICKET_RECEIVED: { bg: "bg-purple-50", icon: "text-purple-600", dot: "bg-purple-500", border: "border-l-purple-500", label: "Support Ticket" },
  SESSION_STARTED: { bg: "bg-green-50",  icon: "text-green-600",  dot: "bg-green-500",  border: "border-l-green-500",  label: "Session"        },
  ALERT:           { bg: "bg-orange-50", icon: "text-orange-600", dot: "bg-orange-400", border: "border-l-orange-400", label: "Alert"          },
  order:           { bg: "bg-green-50",  icon: "text-green-700",  dot: "bg-green-500",  border: "border-l-green-500",  label: "Order"          },
  alert:           { bg: "bg-orange-50", icon: "text-orange-700", dot: "bg-orange-400", border: "border-l-orange-400", label: "Alert"          },
  message:         { bg: "bg-blue-50",   icon: "text-blue-700",   dot: "bg-blue-500",   border: "border-l-blue-500",   label: "Message"        },
  default:         { bg: "bg-slate-50",  icon: "text-slate-600",  dot: "bg-slate-400",  border: "border-l-slate-400",  label: "Notification"   },
};

export const getConfig   = (type) => typeConfig[type] || typeConfig.default;

export const getTypeIcon = (type) => {
  if (type === "TICKET_REPLIED" || type === "TICKET_RECEIVED" || type === "message") return <TicketIcon />;
  if (type === "SESSION_STARTED") return <SessionIcon />;
  if (type === "ALERT" || type === "alert") return <AlertIcon />;
  return <BellIcon size={18} />;
};