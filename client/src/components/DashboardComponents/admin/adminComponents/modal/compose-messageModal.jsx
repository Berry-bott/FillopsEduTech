"use client"

import React, { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "../../store"

export default function ComposeMessageModal({ open, onOpenChange, preselectedRecipient }) {
  const users = useAppStore((state) => state.users)
  const addMessage = useAppStore((state) => state.addMessage)
  const addActivityLog = useAppStore((state) => state.addActivityLog)

  const recipients = users.filter((u) => u.id !== "sa-001")

  const [recipientId, setRecipientId] = useState("")
  const [subject, setSubject] = useState("")
  const [content, setContent] = useState("")

  useEffect(() => {
    if (preselectedRecipient) {
      setRecipientId(preselectedRecipient)
    }
  }, [preselectedRecipient])

  const handleSubmit = (e) => {
    e.preventDefault()
    const recipient = users.find((u) => u.id === recipientId)
    if (!recipient) return

    const newMessage = {
      id: `msg-${Date.now()}`,
      senderId: "sa-001",
      senderName: "Super Admin",
      senderRole: "super_admin",
      recipientId,
      recipientName: recipient.name,
      subject,
      content,
      read: false,
      createdAt: new Date(),
    }

    addMessage(newMessage)
    addActivityLog({
      id: `log-${Date.now()}`,
      userId: "sa-001",
      userName: "Super Admin",
      userRole: "super_admin",
      action: `Sent message to ${recipient.role}`,
      target: recipient.name,
      createdAt: new Date(),
    })

    // Reset form
    setRecipientId("")
    setSubject("")
    setContent("")
    onOpenChange(false)
  }

  const handleClose = () => {
    setRecipientId("")
    setSubject("")
    setContent("")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Compose Message</DialogTitle>
          <DialogDescription>Send a direct message to any user or admin</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Select value={recipientId} onValueChange={setRecipientId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select recipient" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-admins" disabled>
                    -- Admins --
                  </SelectItem>
                  {recipients
                    .filter((u) => u.role === "admin")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                  <SelectItem value="all-users" disabled>
                    -- Users --
                  </SelectItem>
                  {recipients
                    .filter((u) => u.role === "user")
                    .map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name} ({user.email})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                placeholder="Message subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Message</Label>
              <Textarea
                id="content"
                placeholder="Write your message..."
                rows={5}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit">Send Message</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
