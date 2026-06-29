import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import  useAdminStore  from "@/store/adminStore";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

function RecentActivity() {
  const dashboard = useAdminStore((state) => state.dashboard);
  const recentLogs = dashboard?.recentActivity?.slice(0, 5) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentLogs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
        ) : (
          recentLogs.map((log) => (
            <div key={log.id} className="flex items-start gap-3">
              <div
                className={cn(
                  "mt-1 h-2 w-2 rounded-full shrink-0",
                  log.userRole === "super_admin" && "bg-primary",
                  log.userRole === "admin" && "bg-amber-500",
                  log.userRole === "user" && "bg-emerald-500",
                  !log.userRole && "bg-gray-400"
                )}
              />
              <div className="flex-1 space-y-1">
                <p className="text-sm text-foreground">
                  <span className="font-medium">{log.userName ?? log.user}</span>{" "}
                  <span className="text-muted-foreground">{log.action}</span>
                  {log.target && <span className="font-medium"> {log.target}</span>}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(log.createdAt), { addSuffix: true })}
                </p>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

export default RecentActivity;