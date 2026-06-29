import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "@/components/DashboardComponents/admin/adminComponents/dashboard/sidebar";
import Header from "@/components/DashboardComponents/admin/adminComponents/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import useAdminTicketStore from "@/store/adminTicketStore";
import { cn } from "@/lib/utils";
import { format, formatDistanceToNow } from "date-fns";
import {
  Search, RefreshCw, Ticket, CheckCircle2, Clock,
  AlertTriangle, Inbox, X, Send, UserCheck,
  StickyNote, Trash2, ChevronLeft, Filter,
  MessageSquare, Users, TrendingUp, Loader2,
  MoreHorizontal, CircleDot, ArrowUpRight,
} from "lucide-react";


// ─── Constants ────────────────────────────────────────────────
const STATUS_OPTIONS = [
  { value: "all",        label: "All Tickets" },
  { value: "open",       label: "Open"        },
  { value: "in_progress",label: "In Progress" },
  { value: "resolved",   label: "Resolved"    },
];

const SORT_OPTIONS = [
  { value: "default",        label: "Default"        },
  { value: "priority_high",  label: "Priority ↑"     },
  { value: "newest",         label: "Newest First"   },
  { value: "oldest",         label: "Oldest First"   },
];

const STATUS_META = {
  OPEN:        { label: "Open",        color: "text-emerald-600", bg: "bg-emerald-500/10", border: "border-emerald-500", dot: "bg-emerald-500" },
  IN_PROGRESS: { label: "In Progress", color: "text-blue-600",    bg: "bg-blue-500/10",    border: "border-blue-500",    dot: "bg-blue-500"    },
  RESOLVED:    { label: "Resolved",    color: "text-gray-500",    bg: "bg-gray-100",        border: "border-gray-300",    dot: "bg-gray-400"    },
  CLOSED:      { label: "Closed",      color: "text-gray-500",    bg: "bg-gray-100",        border: "border-gray-300",    dot: "bg-gray-400"    },
};

const PRIORITY_META = {
  LOW:    { label: "Low",    color: "text-sky-600",    bg: "bg-sky-500/10",    border: "border-sky-400"    },
  MEDIUM: { label: "Medium", color: "text-amber-600",  bg: "bg-amber-500/10",  border: "border-amber-400"  },
  HIGH:   { label: "High",   color: "text-orange-600", bg: "bg-orange-500/10", border: "border-orange-400" },
  URGENT: { label: "Urgent", color: "text-red-600",    bg: "bg-red-500/10",    border: "border-red-400"    },
};

// ─── Small helpers ─────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_META[status?.toUpperCase()] ?? STATUS_META.OPEN;
  return (
    <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-medium border", s.bg, s.color, s.border)}>
      <span className={cn("w-1.5 h-1.5 rounded-full", s.dot)} />
      {s.label}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const p = PRIORITY_META[priority?.toUpperCase()] ?? PRIORITY_META.MEDIUM;
  return (
    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-semibold border", p.bg, p.color, p.border)}>
      {p.label}
    </span>
  );
}

function StatCard({ icon: Icon, iconClass, bgClass, label, value, valueClass, sub }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-3 p-3">
        <div className={cn("rounded-md p-2 shrink-0", bgClass)}>
          <Icon className={cn("h-4 w-4", iconClass)} />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground">{label}</p>
          <p className={cn("text-lg font-bold leading-tight", valueClass)}>{value ?? "—"}</p>
          {sub && <p className="text-[10px] text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

function SkeletonRows({ rows = 5 }) {
  return (
    <div className="space-y-2 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-16 w-full animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

function EmptyState({ icon: Icon, label, sub }) {
  return (
    <div className="py-12 text-center">
      <Icon className="mx-auto h-10 w-10 text-muted-foreground/30" />
      <p className="mt-3 text-sm font-medium text-muted-foreground">{label}</p>
      {sub && <p className="mt-1 text-xs text-muted-foreground/60">{sub}</p>}
    </div>
  );
}

// ─── Ticket Chat / Detail Panel ────────────────────────────────
function TicketDetail({ ticketId, onClose, onResolved, onDeleted }) {
  const {
    fetchTicket, replyToTicket, assignTicket,
    updateNotes, resolveTicket, deleteTicket,
  } = useAdminTicketStore();

  const [ticket, setTicket]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [replyText, setReplyText] = useState("");
  const [notes, setNotes]         = useState("");
  const [sending, setSending]     = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const bottomRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetchTicket(ticketId);
    if (res?.success) {
      const t = res.data?.ticket ?? res.data;
      setTicket(t);
      setNotes(t?.internalNotes ?? "");
    }
    setLoading(false);
  }, [ticketId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.messages?.length]);

  const handleReply = async () => {
    if (!replyText.trim() || sending) return;
    setSending(true);
    const res = await replyToTicket(ticketId, replyText);
    if (res?.success) {
      setReplyText("");
      await load();
    }
    setSending(false);
  };

  const handleAssign = async () => {
    setAssigning(true);
    await assignTicket(ticketId);
    await load();
    setAssigning(false);
  };

  const handleSaveNotes = async () => {
    setSavingNotes(true);
    await updateNotes(ticketId, notes);
    setSavingNotes(false);
  };

  const handleResolve = async () => {
    setResolving(true);
    const res = await resolveTicket(ticketId);
    if (res?.success) { onResolved?.(ticketId); await load(); }
    setResolving(false);
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setDeleting(true);
    const res = await deleteTicket(ticketId);
    if (res?.success) onDeleted?.(ticketId);
    setDeleting(false);
  };

  const isResolved = ["RESOLVED", "CLOSED"].includes(ticket?.status?.toUpperCase());

  const messages = ticket?.messages ?? [];

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-background border-l border-border shadow-2xl">

        {/* Header */}
        <div className="flex items-center gap-3 border-b px-4 py-3">
          <Button type="button" variant="ghost" size="icon" className="h-7 w-7 shrink-0" onClick={onClose}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {loading ? (
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
          ) : (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-foreground">{ticket?.subject}</p>
              <p className="text-[10px] text-muted-foreground">
                #{ticket?.id?.slice(0, 8)} · {ticket?.category} · opened {ticket?.createdAt ? formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true }) : "—"}
              </p>
            </div>
          )}
          {ticket && (
            <div className="flex items-center gap-1.5 shrink-0">
              <StatusBadge status={ticket.status} />
              <PriorityBadge priority={ticket.priority} />
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !ticket ? (
          <EmptyState icon={Ticket} label="Could not load ticket" />
        ) : (
          <>
            {/* Action bar */}
            <div className="flex items-center gap-2 border-b px-4 py-2 bg-muted/30">
              {/* Assign to self */}
              {!ticket.assignedTo && (
                <Button type="button"  variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={handleAssign} disabled={assigning}>
                  {assigning ? <Loader2 className="h-3 w-3 animate-spin" /> : <UserCheck className="h-3 w-3" />}
                  Assign to Me
                </Button>
              )}
              {ticket.assignedTo && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <UserCheck className="h-3 w-3 text-emerald-500" />
                  Assigned: {ticket.assignedTo.firstName} {ticket.assignedTo.lastName}
                </span>
              )}

              <div className="ml-auto flex items-center gap-1.5">
                {/* Notes toggle */}
                <Button
                  type="button"
                  variant={showNotes ? "default" : "outline"}
                  size="sm"
                  className="h-7 gap-1.5 text-xs"
                  onClick={() => setShowNotes((v) => !v)}
                >
                  <StickyNote className="h-3 w-3" /> Notes
                </Button>

                {/* Resolve */}
                {!isResolved && (
                  <Button type="button" variant="outline" size="sm" className="h-7 gap-1.5 text-xs text-emerald-600 border-emerald-300 hover:bg-emerald-50" onClick={handleResolve} disabled={resolving}>
                    {resolving ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle2 className="h-3 w-3" />}
                    Resolve
                  </Button>
                )}

                {/* Delete */}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className={cn("h-7 gap-1.5 text-xs", confirmDelete ? "border-red-500 text-red-600 bg-red-50" : "text-muted-foreground")}
                  onClick={handleDelete}
                  disabled={deleting}
                  onBlur={() => setConfirmDelete(false)}
                >
                  {deleting ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  {confirmDelete ? "Confirm?" : "Delete"}
                </Button>
              </div>
            </div>

            {/* Internal notes panel */}
            {showNotes && (
              <div className="border-b px-4 py-3 bg-amber-50/50 dark:bg-amber-950/20">
                <p className="mb-1.5 text-xs font-medium text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <StickyNote className="h-3 w-3" /> Internal Notes (not visible to user)
                </p>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add internal notes, observations, or follow-up actions…"
                  className="min-h-[70px] text-xs resize-none border-amber-200 bg-white dark:bg-background"
                  rows={3}
                />
                <div className="mt-2 flex justify-end">
                  <Button type="button" size="sm" variant="outline" className="h-7 text-xs gap-1.5 border-amber-300 text-amber-700 hover:bg-amber-100" onClick={handleSaveNotes} disabled={savingNotes}>
                    {savingNotes ? <Loader2 className="h-3 w-3 animate-spin" /> : null}
                    Save Notes
                  </Button>
                </div>
              </div>
            )}

            {/* User info strip */}
            <div className="flex items-center gap-3 border-b px-4 py-2 text-xs text-muted-foreground">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
                {(ticket.user?.firstName?.[0] ?? "U")}
              </div>
              <span className="font-medium text-foreground">
                {ticket.user ? `${ticket.user.firstName} ${ticket.user.lastName}` : "Unknown User"}
              </span>
              {ticket.user?.email && <span className="text-muted-foreground">{ticket.user.email}</span>}
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <EmptyState icon={MessageSquare} label="No messages yet" sub="Reply below to start the conversation" />
              ) : (
                messages.map((msg) => {
                  const isAdmin = msg.senderAdmin != null;
                  const senderName = isAdmin
                    ? `${msg.senderAdmin?.firstName ?? ""} ${msg.senderAdmin?.lastName ?? ""}`.trim() || "Support Agent"
                    : `${msg.senderUser?.firstName ?? ""} ${msg.senderUser?.lastName ?? ""}`.trim() || "User";
                  return (
                    <div key={msg.id} className={cn("flex flex-col", isAdmin ? "items-end" : "items-start")}>
                      <div className={cn(
                        "max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed",
                        isAdmin
                          ? "bg-primary text-primary-foreground rounded-tr-none"
                          : "bg-muted text-foreground rounded-tl-none"
                      )}>
                        {msg.message}
                      </div>
                      <div className="mt-0.5 flex items-center gap-1 px-1 text-[10px] text-muted-foreground">
                        {isAdmin && <span className="text-primary font-medium">You</span>}
                        {!isAdmin && <span>{senderName}</span>}
                        {msg.createdAt && <span>· {format(new Date(msg.createdAt), "MMM d, h:mm a")}</span>}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Reply input */}
            {isResolved ? (
              <div className="border-t p-4 text-center text-xs text-muted-foreground bg-muted/20">
                This ticket is resolved. Delete or reopen from support if needed.
              </div>
            ) : (
              <div className="border-t p-4">
                <div className="flex gap-2">
                  <Textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); 
                    e.stopPropagation();  handleReply(); } }}
                    placeholder="Reply to user… (Enter to send, Shift+Enter for new line)"
                    className="min-h-[72px] text-xs resize-none flex-1"
                    rows={3}
                  />
                </div>
                <div className="mt-2 flex justify-end">
                  <Button type="button" size="sm" className="h-8 gap-1.5 text-xs" 
                  
                  onClick={handleReply} disabled={sending || !replyText.trim()}>
                    
                    {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                    Send Reply
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Tickets Page ─────────────────────────────────────────
export default function AdminTicketsPage() {
  const {
    fetchTickets, tickets, stats, loading,
  } = useAdminTicketStore();

  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy]             = useState("default");
  const [unassignedOnly, setUnassignedOnly] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState(null);

  const load = useCallback(() => {
    const params = {};
    if (statusFilter && statusFilter !== "all")     params.status     = statusFilter;
    if (sortBy       && sortBy       !== "default") params.sortBy     = sortBy;
    if (unassignedOnly)                             params.unassigned = true;
    fetchTickets(params);
  }, [statusFilter, sortBy, unassignedOnly]);

  useEffect(() => { load(); }, [load]);

  const ticketList = tickets ?? [];
  const ticketStats = stats;

  const filteredTickets = ticketList.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      (t.subject   ?? "").toLowerCase().includes(q) ||
      (t.category  ?? "").toLowerCase().includes(q) ||
      (t.user?.firstName ?? "").toLowerCase().includes(q) ||
      (t.user?.lastName  ?? "").toLowerCase().includes(q) ||
      (t.user?.email     ?? "").toLowerCase().includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <main className="pl-64 min-w-0 overflow-hidden">
        <Header title="Support Tickets" description="Manage and respond to user support requests" />

        <div className="p-4">

          {/* Stats */}
          <div className="mb-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard
              icon={Ticket}      bgClass="bg-primary/10"     iconClass="text-primary"
              label="Total"      value={ticketStats?.total ?? ticketList.length}
              valueClass="text-foreground"
            />
            <StatCard
              icon={Inbox}       bgClass="bg-emerald-500/10" iconClass="text-emerald-600"
              label="Open"       value={ticketStats?.open ?? ticketList.filter((t) => t.status?.toUpperCase() === "OPEN").length}
              valueClass="text-emerald-600"
            />
            <StatCard
              icon={Clock}       bgClass="bg-blue-500/10"    iconClass="text-blue-600"
              label="In Progress" value={ticketStats?.inProgress ?? ticketList.filter((t) => t.status?.toUpperCase() === "IN_PROGRESS").length}
              valueClass="text-blue-600"
            />
            <StatCard
              icon={CheckCircle2} bgClass="bg-gray-100"       iconClass="text-gray-500"
              label="Resolved"   value={ticketStats?.resolved ?? ticketList.filter((t) => ["RESOLVED","CLOSED"].includes(t.status?.toUpperCase())).length}
              valueClass="text-muted-foreground"
            />
          </div>

          {/* Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <div className="relative min-w-[160px] flex-1">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search tickets, users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-8 pl-8 text-xs"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="h-8 w-36 text-xs"><SelectValue placeholder="Sort by" /></SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
              </SelectContent>
            </Select>

            <Button
              type="button"
              variant={unassignedOnly ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setUnassignedOnly((v) => !v)}
            >
              <Filter className="h-3.5 w-3.5" />
              Unassigned
            </Button>

            <Button 
            type="button"
            variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={load}>
              <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} /> Refresh
            </Button>
          </div>

          {/* Ticket list */}
          <Card>
            <CardHeader className="py-2.5 px-4">
              <CardTitle className="text-sm">Tickets ({filteredTickets.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading && !ticketList.length ? (
                <SkeletonRows />
              ) : filteredTickets.length === 0 ? (
                <EmptyState icon={Inbox} label="No tickets found" sub="Try adjusting your filters" />
              ) : (
                <div className="divide-y divide-border">
                  {filteredTickets.map((ticket) => {
                    const isUrgent   = ticket.priority?.toUpperCase() === "URGENT";
                    const isResolved = ["RESOLVED", "CLOSED"].includes(ticket.status?.toUpperCase());
                    const userName   = ticket.user
                      ? `${ticket.user.firstName} ${ticket.user.lastName}`
                      : "Unknown";
                    const msgCount   = ticket._count?.messages ?? ticket.messages?.length ?? 0;

                    return (
                      <div
                        key={ticket.id}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-muted/40 cursor-pointer transition-colors group"
                        onClick={() => setSelectedTicketId(ticket.id)}
                      >
                        {/* Priority dot */}
                        <div className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          isResolved        ? "bg-gray-300"    :
                          isUrgent          ? "bg-red-500 animate-pulse" :
                          ticket.priority?.toUpperCase() === "HIGH"   ? "bg-orange-500" :
                          ticket.priority?.toUpperCase() === "MEDIUM" ? "bg-amber-500"  : "bg-sky-500"
                        )} />

                        {/* Main info */}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <p className={cn(
                              "truncate text-xs font-medium",
                              isResolved ? "text-muted-foreground" : "text-foreground group-hover:text-primary"
                            )}>
                              {ticket.subject}
                            </p>
                            {!ticket.assignedTo && !isResolved && (
                              <Badge variant="outline" className="shrink-0 border-orange-300 bg-orange-50 text-orange-600 text-[9px] px-1 py-0">
                                Unassigned
                              </Badge>
                            )}
                          </div>
                          <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                            <span className="font-medium">{userName}</span>
                            <span>·</span>
                            <span>{ticket.category}</span>
                            {msgCount > 0 && <><span>·</span><span className="flex items-center gap-0.5"><MessageSquare className="h-2.5 w-2.5" />{msgCount}</span></>}
                            {ticket.createdAt && <><span>·</span><span>{formatDistanceToNow(new Date(ticket.createdAt), { addSuffix: true })}</span></>}
                          </div>
                        </div>

                        {/* Badges */}
                        <div className="flex shrink-0 items-center gap-1.5">
                          <PriorityBadge priority={ticket.priority} />
                          <StatusBadge   status={ticket.status}   />
                          <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Detail drawer */}
      {selectedTicketId && (
        <TicketDetail
          ticketId={selectedTicketId}
          onClose={() => setSelectedTicketId(null)}
          onResolved={() => { load(); }}
          onDeleted={() => { setSelectedTicketId(null); load(); }}
        />
      )}
    </div>
  );
}