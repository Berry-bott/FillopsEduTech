import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAppStore } from "@/components/DashboardComponents/admin/store"
import { formatDistanceToNow } from "date-fns"
import { cn } from "@/lib/utils"

function RecentActivity() {
  const activityLogs = useAppStore((state) => state.activityLogs)
  const recentLogs = activityLogs.slice(0, 5)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentLogs.map((log) => (
          <div key={log.id} className="flex items-start gap-3">
            <div
              className={cn(
                "mt-1 h-2 w-2 rounded-full",
                log.userRole === "super_admin" && "bg-primary",
                log.userRole === "admin" && "bg-amber-500",
                log.userRole === "user" && "bg-emerald-500"
              )}
            />
            <div className="flex-1 space-y-1">
              <p className="text-sm text-foreground">
                <span className="font-medium">{log.userName}</span>{" "}
                <span className="text-muted-foreground">{log.action}</span>
                {log.target && <span className="font-medium"> {log.target}</span>}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(log.createdAt, { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export default RecentActivity
