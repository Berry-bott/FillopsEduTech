import React from "react";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, UserCog, Activity, Settings, Shield, LogOut, UserCheck } from "lucide-react";
import useAdminAuthStore from "@/store/adminAuthStore"; 
import { Link, useLocation, useNavigate } from "react-router-dom"; 

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/manage-tutors", label: "Tutor Management", icon: UserCog },
  { to: "/manage-users", label: "User Management", icon: Users },
  { to: "/activity", label: "Activity Logs", icon: Activity },
  { to: "/pricing", label: "Pricing", icon: UserCheck },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/supports", label: "Ticket", icon: UserCog },
  { to: "/news/admin", label: "Set Notifications", icon: Shield },
  { to: "/blog/admin", label: "Blog", icon: UserCog },
  { to: "/user-promo", label: "UserPromo", icon: Activity },
  { to: "/admin/notifications", label: "Notification", icon: Activity },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation(); // ← better than window.location.pathname
  const admin = useAdminAuthStore((s) => s.admin);
  const logout = useAdminAuthStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate("/admin/login", { replace: true });
  };

  const initials = admin
    ? `${admin.firstName?.[0] ?? ""}${admin.lastName?.[0] ?? ""}`.toUpperCase() || "A"
    : "A";

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen  w-64 border-r border-border bg-card">
      <div className="flex h-full flex-col">

        {/* Logo */}
        <div className="flex h-16 items-center gap-2 border-b border-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Shield className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">Control Center</p>
          </div>
        </div>

        {/* Navigation – use <Link> instead of <a> */}
        <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Admin Info + Logout */}
        <div className="border-t border-border p-4">
          <div className="flex items-center gap-3 rounded-lg bg-accent/50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {admin ? `${admin.firstName} ${admin.lastName}` : "Admin"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{admin?.email ?? ""}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>

      </div>
    </aside>
  );
}