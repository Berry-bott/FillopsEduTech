import { useState, useEffect, useCallback, useRef } from "react";
import useTicketStore from "@/store/userTicketStore";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
} from "lucide-react";




const CATEGORIES = ["TECHNICAL", "BILLING", "GENERAL", "ACADEMIC", "OTHER"];
const PRIORITIES = ["LOW", "MEDIUM", "HIGH", "URGENT"];
const STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
];

const STATUS_STYLES = {
  OPEN:        { bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500", border: "border-emerald-200" },
  IN_PROGRESS: { bg: "bg-blue-50",    text: "text-blue-600",    dot: "bg-blue-500",    border: "border-blue-200"   },
  CLOSED:      { bg: "bg-gray-100",   text: "text-gray-500",    dot: "bg-gray-400",    border: "border-gray-200"   },
};

const PRIORITY_STYLES = {
  LOW:    "text-sky-600    bg-sky-50    border border-sky-200",
  MEDIUM: "text-amber-600  bg-amber-50  border border-amber-200",
  HIGH:   "text-orange-600 bg-orange-50 border border-orange-200",
  URGENT: "text-red-600    bg-red-50    border border-red-200",
};

// ─── Normalise message using actual API shape ─────────────────────────────────
// senderAdmin !== null  → admin/support message
// senderUser  !== null  → user message
function normaliseMessage(msg) {
  const isAdmin = msg.senderAdmin != null;
  const adminName = msg.senderAdmin
    ? `${msg.senderAdmin.firstName || ""} ${msg.senderAdmin.lastName || ""}`.trim() || "Support Agent"
    : "Support Agent";
  const userName = msg.senderUser
    ? `${msg.senderUser.firstName || ""} ${msg.senderUser.lastName || ""}`.trim() || "You"
    : "You";

  return {
    id: msg.id,
    isAdmin,
    senderName: isAdmin ? adminName : userName,
    text: msg.message || "",
    createdAt: msg.createdAt || null,
  };
}

function formatTime(dateStr) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const s = STATUS_STYLES[status?.toUpperCase()] || STATUS_STYLES.OPEN;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${s.bg} ${s.text} ${s.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status?.replace(/_/g, " ")}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const cls = PRIORITY_STYLES[priority?.toUpperCase()] || PRIORITY_STYLES.MEDIUM;
  return <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${cls}`}>{priority}</span>;
}

function Toast({ message, type, onClose }) {
  useEffect(() => { const t = setTimeout(onClose, 3500); return () => clearTimeout(t); }, [onClose]);
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-2.5 rounded-lg shadow-lg text-sm font-medium border
      ${type === "error" ? "bg-red-50 text-red-700 border-red-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
      <span>{type === "error" ? "✕" : "✓"}</span>
      {message}
      <button onClick={onClose} className="ml-1 opacity-50 hover:opacity-100 text-xs">✕</button>
    </div>
  );
}

function Spinner() {
  return (
    <div className="flex justify-center items-center py-8">
      <div className="w-5 h-5 border-2 border-gray-200 border-t-violet-500 rounded-full animate-spin" />
    </div>
  );
}

// ─── Create Ticket Modal ──────────────────────────────────────────────────────
function CreateTicketModal({ onClose, onCreated }) {
  const { createTicket, submitting } = useTicketStore();
  const [form, setForm] = useState({ subject: "", message: "", category: "TECHNICAL", priority: "MEDIUM" });

  const handleSubmit = async () => {
    if (!form.subject.trim() || !form.message.trim()) return;
    const result = await createTicket(form);
    if (result.success) {
      // Go straight to chat after ticket is created
      onCreated(result.ticket.id || result.ticket._id);
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-200 rounded-xl w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-gray-800 font-semibold text-sm">New Support Ticket</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-base leading-none">✕</button>
        </div>
        <div className="p-5 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Subject</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-300 text-xs focus:outline-none focus:border-violet-400 focus:ring-2 focus:ring-violet-100 transition-all"
              placeholder="Brief description of your issue"
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Category</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-xs focus:outline-none focus:border-violet-400 bg-white"
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Priority</label>
              <select className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 text-xs focus:outline-none focus:border-violet-400 bg-white"
                value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Message</label>
            <textarea rows={4}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-gray-800 placeholder-gray-300 text-xs focus:outline-none focus:border-violet-400 resize-none"
              placeholder="Describe your issue in detail..."
              value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
            />
          </div>
        </div>
        <div className="flex gap-2 px-5 pb-5">
          <button onClick={onClose} className="flex-1 py-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 text-xs font-medium">Cancel</button>
          <button onClick={handleSubmit} disabled={submitting || !form.subject.trim() || !form.message.trim()}
            className="flex-1 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold">
            {submitting ? "Submitting..." : "Submit Ticket"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Ticket Chat View ─────────────────────────────────────────────────────────
function TicketChatView({ ticketId, isClosed, onBack }) {
  const { selectedTicket, loading, submitting, fetchTicketById, replyToTicket, resetSelectedTicket } = useTicketStore();
  const [replyText, setReplyText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    fetchTicketById(ticketId);
    return () => resetSelectedTicket();
  }, [ticketId]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket]);

  const handleReply = async () => {
    if (!replyText.trim()) return;
    const result = await replyToTicket(ticketId, replyText);
    if (result.success) setReplyText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleReply(); }
  };

  if (loading) return <Spinner />;
  if (!selectedTicket) return null;

  const ticket = selectedTicket;
  // API returns messages array with senderUser / senderAdmin
  const messages = (ticket.messages || []).map(normaliseMessage);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600 transition-colors">←</button>
          <div>
            <h2 className="text-gray-800 font-semibold text-sm leading-tight">{ticket.subject}</h2>
            <p className="text-gray-400 text-xs mt-0.5">#{ticket.id} · {ticket.category}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>
      </div>

      {/* Messages */}
      <div className="space-y-3 mb-3 max-h-64 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="text-center py-6 text-gray-400 text-xs border border-dashed border-gray-200 rounded-lg bg-gray-50">
            Waiting for a support agent to respond…
          </div>
        ) : (
          messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.isAdmin ? "items-start" : "items-end"}`}>
              <div className={`max-w-[85%] rounded-xl px-3 py-2 text-xs leading-relaxed ${
                isClosed
                  ? "bg-gray-100 text-gray-500"
                  : msg.isAdmin
                    ? "bg-gray-100 text-gray-700 rounded-tl-none"
                    : "bg-violet-600 text-white rounded-tr-none"
              }`}>
                {msg.text}
              </div>
              <div className="flex items-center gap-1 mt-0.5 px-1">
                <span className="text-gray-400 text-xs font-medium">
                  {msg.isAdmin ? msg.senderName : "You"}
                </span>
                {msg.createdAt && (
                  <span className="text-gray-300 text-xs">· {formatTime(msg.createdAt)}</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Chat input — only for non-closed tickets */}
      {!isClosed ? (
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <textarea
            rows={2}
            className="w-full px-3 py-2.5 text-gray-800 placeholder-gray-300 text-xs focus:outline-none resize-none"
            placeholder="Type a message… (Enter to send, Shift+Enter for new line)"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <div className="flex items-center justify-end gap-2 px-3 py-2 bg-gray-50 border-t border-gray-100">
<button onClick={handleReply} disabled={submitting || !replyText.trim()}
              className="px-4 py-1.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-lg transition-colors">
              {submitting ? "..." : "Send"}
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-3 text-gray-400 text-xs border border-gray-100 rounded-lg bg-gray-50">
          Issue resolved — ticket closed by support. Open a new ticket if you need further help.
        </div>
      )}

    </div>
  );
}

// ─── Tickets List ─────────────────────────────────────────────────────────────
function TicketsList({ onSelectTicket }) {
  const { tickets, loading, filters, pagination, fetchTickets } = useTicketStore();
  const [activeFilter, setActiveFilter] = useState("open");

  useEffect(() => {
    fetchTickets({ status: activeFilter, page: 1 });
  }, [activeFilter]);

  return (
    <div className="space-y-3">
      <div className="flex gap-0.5 bg-gray-100 p-0.5 rounded-lg w-fit">
        {STATUS_FILTERS.map((f) => (
          <button key={f.value} onClick={() => setActiveFilter(f.value)}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeFilter === f.value ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}>
            {f.label}
          </button>
        ))}
      </div>

      {loading ? <Spinner /> : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-10 text-gray-400">
          <div className="text-2xl mb-2">🎫</div>
          <p className="text-xs font-medium text-gray-500">
            {activeFilter === "closed" ? "No closed tickets" : "No active tickets"}
          </p>
          <p className="text-xs mt-0.5">
            {activeFilter === "closed" ? "Resolved tickets will appear here." : "Submit a ticket and we'll get back to you."}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {tickets.map((ticket) => {
            const status = ticket.status?.toUpperCase();
            const isClosed = status === "CLOSED";
            const isInProgress = status === "IN_PROGRESS";
            const msgCount = ticket.messages?.length || 0;

            return (
              <button key={ticket.id} onClick={() => onSelectTicket(ticket.id, isClosed)}
                className="w-full text-left bg-white hover:bg-gray-50 border border-gray-100 hover:border-violet-200 rounded-lg p-3.5 transition-all group">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {isInProgress && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 animate-pulse" />}
                    <span className="text-gray-800 font-medium text-xs group-hover:text-violet-600 transition-colors truncate">
                      {ticket.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">{ticket.category}</span>
                  <div className="flex items-center gap-2">
                    {msgCount > 0 && <span className="text-gray-400">💬 {msgCount}</span>}
                    {!isClosed && <span className="text-violet-500 font-medium">Open chat →</span>}
                    {ticket.createdAt && <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {pagination.total > pagination.limit && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-gray-400">{pagination.total} tickets</span>
          <div className="flex gap-1 items-center">
            <button onClick={() => fetchTickets({ page: filters.page - 1 })} disabled={filters.page <= 1}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">← Prev</button>
            <span className="px-2 text-xs text-gray-400">Page {filters.page}</span>
            <button onClick={() => fetchTickets({ page: filters.page + 1 })} disabled={filters.page * filters.limit >= pagination.total}
              className="px-2.5 py-1 text-xs border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function TicketsPage() {
  const { error, successMessage, clearMessages } = useTicketStore();
  const [showCreate, setShowCreate] = useState(false);
  const [activeTicket, setActiveTicket] = useState(null); // { id, isClosed }
   const navigate = useNavigate();
  const handleSelectTicket = useCallback((id, isClosed = false) => setActiveTicket({ id, isClosed }), []);
  const handleTicketCreated = useCallback((id) => { setShowCreate(false); setActiveTicket({ id, isClosed: false }); }, []);
  const handleBack = useCallback(() => setActiveTicket(null), []);

  return (
    <>
    <div className="absolute top-0 right-0 mt-8 mr-8">
         <button
          onClick={() => navigate('/user/dashboard')}
          className="group flex items-center justify-end gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm hover:bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-blue-100 hover:border-blue-300"
        >
          <ArrowLeft className="w-5 h-5 text-blue-600 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium text-gray-700">Back to Dashboard</span>
        </button>
    </div>
    
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <style>{`.line-clamp-1{overflow:hidden;display:-webkit-box;-webkit-line-clamp:1;-webkit-box-orient:vertical;}`}</style>

      {error && <Toast message={error} type="error" onClose={clearMessages} />}
      {successMessage && <Toast message={successMessage} type="success" onClose={clearMessages} />}
      {showCreate && <CreateTicketModal onClose={() => setShowCreate(false)} onCreated={handleTicketCreated} />}



      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm w-full max-w-md mx-4 overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h1 className="text-gray-800 font-semibold text-sm">Support Tickets</h1>
            <p className="text-gray-400 text-xs mt-0.5">{activeTicket ? "Chat with support" : "Track your support requests"}</p>
          </div>
          {!activeTicket && (
            <button onClick={() => setShowCreate(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-violet-600 hover:bg-violet-500 rounded-lg text-white text-xs font-semibold transition-colors">
              <span className="text-sm leading-none">+</span> New Ticket
            </button>
          )}
        </div>

        <div className="p-5">
          {!activeTicket && <TicketsList onSelectTicket={handleSelectTicket} />}
          {activeTicket && (
            <TicketChatView ticketId={activeTicket.id} isClosed={activeTicket.isClosed} onBack={handleBack} />
          )}
        </div>
      </div>
    </div>
    </>

  );
}