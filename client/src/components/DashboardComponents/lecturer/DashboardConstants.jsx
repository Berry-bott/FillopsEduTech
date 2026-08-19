import {
  LayoutDashboard, BookOpen, FileText, HelpCircle,
  Users, BarChart3, Settings, Bell, Group,
} from "lucide-react"

export const EXAM_BODIES = [
  { id: "all-catigories", label: "All Categories", color: "bg-pink-500/10 text-blue-600 dark:text-blue-400" },
  { id: "jamb",           label: "JAMB",          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  { id: "waec",           label: "WAEC",          color: "bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  { id: "neco",           label: "NECO",          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
]

export const COLOR_OPTIONS = [
  { value: "all",            label: "All Colors", color: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" },
  { value: "bg-blue-500",    label: "Blue",       color: "bg-blue-500" },
  { value: "bg-emerald-500", label: "Green",      color: "bg-emerald-500" },
  { value: "bg-purple-500",  label: "Purple",     color: "bg-purple-500" },
  { value: "bg-amber-500",   label: "Amber",      color: "bg-amber-500" },
  { value: "bg-red-500",     label: "Red",        color: "bg-red-500" },
  { value: "bg-pink-500",    label: "Pink",       color: "bg-pink-500" },
]

export const NAV_ITEMS = [
  { id: "overview",     label: "Overview",       icon: LayoutDashboard },
  { id: "subjects",     label: "Subjects",       icon: BookOpen },
  { id: "topics",       label: "Topics",         icon: FileText },
  { id: "questions",    label: "Questions Bank", icon: HelpCircle },
  { id: "analytics",    label: "Analytics",      icon: BarChart3 },
  { id: "chat",         label: "Chat",           icon: Users },
  { id: "community",    label: "Community",      icon: Group },
  { id: "settings",     label: "Settings",       icon: Settings },
  { id: "notification", label: "Notifications",  icon: Bell },
]