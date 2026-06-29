"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Reply, Trash2 } from "lucide-react"

export default function ViewMessageModal({ message, open, onOpenChange, onReply, onDelete }) {
  if (!message) return null

  const isSent = message.senderId === "sa-001"

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {message.subject}
            {!message.read && !isSent && <Badge className="bg-primary text-primary-foreground">New</Badge>}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Message Meta */}
          <div className="flex items-center justify-between rounded-lg bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
                  isSent
                    ? "bg-primary/10 text-primary"
                    : message.senderRole === "admin"
                    ? "bg-amber-500/10 text-amber-600"
                    : "bg-emerald-500/10 text-emerald-600"
                )}
              >
                {message.senderName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">
                  {isSent ? `To: ${message.recipientName}` : `From: ${message.senderName}`}
                </p>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(message.createdAt), "MMM d, yyyy 'at' h:mm a")}
                </p>
              </div>
            </div>

            <Badge
              variant="outline"
              className={cn(
                message.senderRole === "super_admin" && "border-primary bg-primary/10 text-primary",
                message.senderRole === "admin" && "border-amber-500 bg-amber-500/10 text-amber-600",
                message.senderRole === "user" && "border-emerald-500 bg-emerald-500/10 text-emerald-600"
              )}
            >
              {message.senderRole === "super_admin"
                ? "Super Admin"
                : message.senderRole === "admin"
                ? "Admin"
                : "User"}
            </Badge>
          </div>

          {/* Message Content */}
          <div className="rounded-lg border border-border p-4">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{message.content}</p>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            {!isSent && (
              <Button
                className="flex-1"
                onClick={() => {
                  onOpenChange(false)
                  onReply?.(message)
                }}
              >
                <Reply className="mr-2 h-4 w-4" />
                Reply
              </Button>
            )}
            <Button
              variant="outline"
              className={cn(isSent ? "flex-1" : "", "text-destructive hover:text-destructive")}
              onClick={() => {
                onOpenChange(false)
                onDelete?.(message)
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
