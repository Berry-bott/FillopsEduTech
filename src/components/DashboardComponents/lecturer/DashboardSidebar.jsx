import { cn } from "@/lib/utils"
import { Bell, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import fillopLogo from "../../../assets/images/fillopsLogo.png"
import useNotificationStore from "@/store/tutorNotificationStore"
import { NAV_ITEMS } from "./DashboardContent"




export default function DashboardSidebar({
   
  tutor,
  activeTab,
  setActiveTab,
  mobileSidebarOpen,
  setMobileSidebarOpen,
  onLogout,
}) {
  const { unreadCount } = useNotificationStore()

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-[989] w-64 bg-card flex flex-col border-r shadow-xl",
        "transform transition-transform duration-300 lg:translate-x-0",
        mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      {/* Close button — mobile only */}
      <div className="flex justify-end p-4 md:hidden">
        <Button variant="ghost" className="p-2" onClick={() => setMobileSidebarOpen(false)}>
          <X className="w-6 h-6" />
        </Button>
      </div>

      {/* Logo */}
      <div className="flex items-center p-2">
        <img src={fillopLogo} alt="Fillop Logo" className="w-12 h-12 object-contain" />
        <div className="leading-none mx-4 md:ml-2">
          <p className="text-primary font-bold font-merriweather text-xl">FILLOP TECH</p>
          <p className="text-education-orange text-[9px] font-merriweather">...simplifying your tech world</p>
        </div>
      </div>

      {/* Nav items */}
      <ScrollArea className="flex-1 px-4 py-6">
        <div className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const isNotif = item.id === "notification"

            return (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 font-medium rounded-xl transition-all",
                  isActive ? "bg-primary text-gray-100 hover:text-gray-700" : "text-gray-700"
                )}
                onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false) }}
              >
                <span className="relative">
                  <Icon className="w-5 h-5" />
                  {isNotif && unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-0.5 flex items-center justify-center bg-red-500 text-white text-[9px] font-bold rounded-full leading-none">
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </span>
                {item.label}
              </Button>
            )
          })}
        </div>
      </ScrollArea>

      {/* User footer */}
      <div className="p-4 border-t">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10 border">
            <AvatarImage src={tutor?.avatar || tutor?.profileImage || ""} alt="User" />
            <AvatarFallback>{tutor?.firstName?.[0]}{tutor?.lastName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden flex-1">
            <span className="truncate text-sm font-semibold">{tutor?.firstName} {tutor?.lastName}</span>
            <span className="truncate text-xs text-gray-600">{tutor?.email}</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onLogout} className="text-xs text-red-600">
            Logout
          </Button>
        </div>
      </div>
    </aside>
  )
}