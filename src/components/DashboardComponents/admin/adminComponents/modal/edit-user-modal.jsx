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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAppStore } from "../../store"

export default function EditUserModal({ user, open, onOpenChange }) {
  const updateUser = useAppStore((state) => state.updateUser)
  const addActivityLog = useAppStore((state) => state.addActivityLog)

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState("active")

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setStatus(user.status)
    }
  }, [user])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!user) return

    updateUser(user.id, { name, email, status })
    addActivityLog({
      id: `log-${Date.now()}`,
      userId: "sa-001",
      userName: "Super Admin",
      userRole: "super_admin",
      action: `Updated ${user.role} account`,
      target: name,
      createdAt: new Date(),
    })

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit {user?.role === "admin" ? "Admin" : "User"}</DialogTitle>
          <DialogDescription>Update the details for {user?.name}</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Full Name</Label>
              <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-email">Email Address</Label>
              <Input id="edit-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
