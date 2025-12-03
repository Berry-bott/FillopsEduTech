"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Mail, Edit, Ban } from "lucide-react"

export default function ViewUserModal({ user, open, onOpenChange, onEdit, onMessage, onSuspend }) {
  if (!user) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Profile Header */}
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-xl font-semibold text-primary">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{user.name}</h3>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              <div className="mt-2 flex gap-2">
                <Badge
                  variant="outline"
                  className={cn(
                    user.role === "super_admin" && "border-primary bg-primary/10 text-primary",
                    user.role === "admin" && "border-amber-500 bg-amber-500/10 text-amber-600",
                    user.role === "user" && "border-emerald-500 bg-emerald-500/10 text-emerald-600"
                  )}
                >
                  {user.role === "super_admin"
                    ? "Super Admin"
                    : user.role === "admin"
                    ? "Admin"
                    : "User"}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    user.status === "active" && "border-emerald-500 bg-emerald-500/10 text-emerald-600",
                    user.status === "suspended" && "border-destructive bg-destructive/10 text-destructive",
                    user.status === "pending" && "border-amber-500 bg-amber-500/10 text-amber-600"
                  )}
                >
                  {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4 rounded-lg border border-border p-4">
            <div>
              <p className="text-xs text-muted-foreground">Account ID</p>
              <p className="font-mono text-sm text-foreground">{user.id}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Created At</p>
              <p className="text-sm text-foreground">{format(new Date(user.createdAt), "MMM d, yyyy")}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Last Active</p>
              <p className="text-sm text-foreground">
                {format(new Date(user.lastActive), "MMM d, yyyy 'at' h:mm a")}
              </p>
            </div>
            {user.createdBy && (
              <div>
                <p className="text-xs text-muted-foreground">Created By</p>
                <p className="text-sm text-foreground">Super Admin</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                onOpenChange(false)
                onMessage?.(user)
              }}
            >
              <Mail className="mr-2 h-4 w-4" />
              Message
            </Button>
            <Button
              variant="outline"
              className="flex-1 bg-transparent"
              onClick={() => {
                onOpenChange(false)
                onEdit?.(user)
              }}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
            <Button
              variant="outline"
              className="flex-1 text-amber-600 hover:text-amber-700 bg-transparent"
              onClick={() => {
                onOpenChange(false)
                onSuspend?.(user)
              }}
            >
              <Ban className="mr-2 h-4 w-4" />
              {user.status === "suspended" ? "Unsuspend" : "Suspend"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
