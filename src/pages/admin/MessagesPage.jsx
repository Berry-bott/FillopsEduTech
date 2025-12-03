import React, { useState, useEffect } from "react"
import  Sidebar  from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar"
import  Header  from "@/components/DashboardComponents/admin/adminComponents/dashboard/header"
import  ComposeMessageModal  from "../../components/DashboardComponents/admin/adminComponents/modal/compose-messageModal"
import  ViewMessageModal  from "../../components/DashboardComponents/admin/adminComponents/modal/view-message-modal"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAppStore } from "../../components/DashboardComponents/admin/store"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"
import { Search, PenSquare, Inbox, Send, Mail, MailOpen } from "lucide-react"

export default function MessagesPage() {
  const messages = useAppStore((state) => state.messages)
  const markMessageRead = useAppStore((state) => state.markMessageRead)
  const deleteMessage = useAppStore((state) => state.deleteMessage)
  const addActivityLog = useAppStore((state) => state.addActivityLog)

  const [search, setSearch] = useState("")
  const [composeOpen, setComposeOpen] = useState(false)
  const [viewOpen, setViewOpen] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [preselectedRecipient, setPreselectedRecipient] = useState("")

  // Inbox & Sent messages
  const inboxMessages = messages.filter((m) => m.recipientId === "sa-001")
  const sentMessages = messages.filter((m) => m.senderId === "sa-001")
  const unreadCount = inboxMessages.filter((m) => !m.read).length

  // URL query handling
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const compose = params.get("compose")
    const to = params.get("to")

    if (compose === "true") {
      if (to) setPreselectedRecipient(to)
      setComposeOpen(true)
    }
  }, [])

  // Filtering
  const filteredInbox = inboxMessages.filter(
    (m) =>
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.senderName.toLowerCase().includes(search.toLowerCase())
  )

  const filteredSent = sentMessages.filter(
    (m) =>
      m.subject.toLowerCase().includes(search.toLowerCase()) ||
      m.recipientName.toLowerCase().includes(search.toLowerCase())
  )

  // Message Row
  const MessageRow = ({ message, isSent }) => (
    <div
      className={cn(
        "flex cursor-pointer items-center gap-4 rounded-lg border border-transparent p-4 transition-colors hover:border-border hover:bg-muted/50",
        !message.read && !isSent && "bg-primary/5"
      )}
      onClick={() => {
        setSelectedMessage(message)
        setViewOpen(true)
        if (!message.read && message.recipientId === "sa-001") {
          markMessageRead(message.id)
        }
      }}
    >
      <div
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium",
          isSent
            ? "bg-muted text-muted-foreground"
            : message.senderRole === "admin"
            ? "bg-amber-500/10 text-amber-600"
            : "bg-emerald-500/10 text-emerald-600"
        )}
      >
        {(isSent ? message.recipientName : message.senderName)
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("text-sm", !message.read && !isSent ? "font-semibold" : "font-medium")}>
          {isSent ? message.recipientName : message.senderName}
        </p>
        <p className="truncate text-sm text-muted-foreground">{message.subject}</p>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(message.createdAt, { addSuffix: true })}
        </span>

        {message.read || isSent ? (
          <MailOpen className="h-4 w-4 text-muted-foreground" />
        ) : (
          <Mail className="h-4 w-4 text-primary" />
        )}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64">
        <Header title="Messages" description="Communicate with admins and users" />

        <div className="p-6">
          {/* Search + Compose */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search messages..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-64 pl-9"
              />
            </div>

            <Button
              onClick={() => {
                setPreselectedRecipient("")
                setComposeOpen(true)
              }}
            >
              <PenSquare className="mr-2 h-4 w-4" />
              Compose
            </Button>
          </div>

          {/* Stats */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Inbox className="h-5 w-5 text-primary bg-primary/10 p-3 rounded-lg" />
                <div>
                  <p className="text-sm text-muted-foreground">Inbox</p>
                  <p className="text-2xl font-bold">{inboxMessages.length}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Mail className="h-5 w-5 text-amber-600 bg-amber-500/10 p-3 rounded-lg" />
                <div>
                  <p className="text-sm text-muted-foreground">Unread</p>
                  <p className="text-2xl font-bold text-amber-600">{unreadCount}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex items-center gap-4 p-4">
                <Send className="h-5 w-5 text-emerald-600 bg-emerald-500/10 p-3 rounded-lg" />
                <div>
                  <p className="text-sm text-muted-foreground">Sent</p>
                  <p className="text-2xl font-bold text-emerald-600">{sentMessages.length}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Messages</CardTitle>
            </CardHeader>

            <CardContent>
              <Tabs defaultValue="inbox">
                <TabsList>
                  <TabsTrigger value="inbox" className="gap-2">
                    <Inbox className="h-4 w-4" />
                    Inbox
                    {unreadCount > 0 && (
                      <Badge className="ml-1 h-5 bg-primary px-1.5 text-xs text-primary-foreground">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>

                  <TabsTrigger value="sent" className="gap-2">
                    <Send className="h-4 w-4" />
                    Sent
                  </TabsTrigger>
                </TabsList>

                {/* Inbox */}
                <TabsContent value="inbox" className="mt-4 space-y-2">
                  {filteredInbox.length > 0 ? (
                    filteredInbox
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map((msg) => <MessageRow key={msg.id} message={msg} isSent={false} />)
                  ) : (
                    <div className="py-12 text-center">
                      <Inbox className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No messages in your inbox</p>
                    </div>
                  )}
                </TabsContent>

                {/* Sent */}
                <TabsContent value="sent" className="mt-4 space-y-2">
                  {filteredSent.length > 0 ? (
                    filteredSent
                      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                      .map((msg) => <MessageRow key={msg.id} message={msg} isSent={true} />)
                  ) : (
                    <div className="py-12 text-center">
                      <Send className="mx-auto h-12 w-12 text-muted-foreground/50" />
                      <p className="mt-4 text-muted-foreground">No sent messages</p>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Modals */}
      <ComposeMessageModal
        open={composeOpen}
        onOpenChange={setComposeOpen}
        preselectedRecipient={preselectedRecipient}
      />

      <ViewMessageModal
        message={selectedMessage}
        open={viewOpen}
        onOpenChange={setViewOpen}
        onReply={(msg) => {
          setPreselectedRecipient(msg.senderId)
          setComposeOpen(true)
        }}
        onDelete={(msg) => {
          deleteMessage(msg.id)
          addActivityLog({
            id: `log-${Date.now()}`,
            userId: "sa-001",
            userName: "Super Admin",
            userRole: "super_admin",
            action: "Deleted message",
            target: msg.subject,
            createdAt: new Date(),
          })
        }}
      />
    </div>
  )
}
