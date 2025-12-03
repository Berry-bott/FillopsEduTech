import  Sidebar  from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header  from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import  StatsCard  from "@/components/DashboardComponents/admin/adminComponents/dashboard/stats-card";
import  RecentActivity  from "@/components/DashboardComponents/admin/adminComponents/dashboard/recent-activity";
import  UserTable  from "@/components/DashboardComponents/admin/adminComponents/dashboard/user-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAppStore } from "@/components/DashboardComponents/admin/store";
import { Users, UserCog, MessageSquare, Activity, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";



export default function DashboardPage() {
  const users = useAppStore((state) => state.users)
  const messages = useAppStore((state) => state.messages)

  const totalUsers = users.filter((u) => u.role === "user").length
  const totalAdmins = users.filter((u) => u.role === "admin").length
  const unreadMessages = messages.filter((m) => !m.read && m.recipientId === "sa-001").length
  const suspendedAccounts = users.filter((u) => u.status === "suspended").length

  const recentUsers = users
    .filter((u) => u.role !== "super_admin")
    .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
    .slice(0, 5)

  // Simple React navigation
  const navigate = (url) => {
    window.location.href = url
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      
      <main className="pl-64">
        <Header title="Dashboard Overview" description="Welcome back, Super Admin" />

        <div className="p-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title="Total Users"
              value={totalUsers}
              change="+12% from last month"
              changeType="positive"
              icon={Users}
              iconColor="bg-emerald-500/10 text-emerald-600"
            />

            <StatsCard
              title="Active Admins"
              value={totalAdmins}
              change={`${users.filter((u) => u.role === "admin" && u.status === "active").length} active`}
              changeType="neutral"
              icon={UserCog}
              iconColor="bg-amber-500/10 text-amber-600"
            />

            <StatsCard
              title="Unread Messages"
              value={unreadMessages}
              change="Requires attention"
              changeType={unreadMessages > 0 ? "negative" : "neutral"}
              icon={MessageSquare}
              iconColor="bg-primary/10 text-primary"
            />

            <StatsCard
              title="Suspended Accounts"
              value={suspendedAccounts}
              change="Review required"
              changeType={suspendedAccounts > 0 ? "negative" : "positive"}
              icon={AlertTriangle}
              iconColor="bg-destructive/10 text-destructive"
            />
          </div>

          {/* Main Content */}
          <div className="mt-6 grid gap-6 lg:grid-cols-3">
            {/* Recent Users */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-base">Recent Users & Admins</CardTitle>

                <Button variant="ghost" size="sm" onClick={() => navigate("/users")}>
                  View All
                </Button>
              </CardHeader>

              <CardContent>
                <UserTable users={recentUsers} />
              </CardContent>
            </Card>

            {/* Activity Feed */}
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="flex flex-wrap gap-3">

                <Button onClick={() => navigate("/admins?create=true")}>
                  <UserCog className="mr-2 h-4 w-4" />
                  Create Admin
                </Button>

                <Button variant="outline" onClick={() => navigate("/messages?compose=true")}>
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Send Message
                </Button>

                <Button variant="outline" onClick={() => navigate("/activity")}>
                  <Activity className="mr-2 h-4 w-4" />
                  View Logs
                </Button>

              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
