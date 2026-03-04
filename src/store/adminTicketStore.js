import { create } from "zustand";
import useAdminAuthStore from "@/store/adminAuthStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

const useAdminTicketStore = create((set, get) => ({
  // ========== STATE ==========
  tickets: [],
  selectedTicket: null,
  stats: null,
  loading: false,
  error: null,

  // ========== HELPER ==========
  _fetch: async (url, options = {}) => {
    const method = options.method || "GET";
    const timestamp = new Date().toISOString();

    console.log(`[AdminTicketStore ${timestamp}] → ${method} ${url}`);

    try {
      const data = await useAdminAuthStore.getState().fetchWithAuth(url, options);
      console.log(`[AdminTicketStore ${timestamp}] ← ${method} ${url} SUCCESS`, {
        success: data?.success,
        message: data?.message || "no message",
      });
      return data;
    } catch (err) {
      console.error(`[AdminTicketStore ${timestamp}] ← ${method} ${url} ERROR`, {
        message: err.message,
      });
      throw err;
    }
  },

  // ========== GET ALL TICKETS ==========
  // Supports: unassigned=true, sortBy=priority_high|newest|oldest, status=open|in_progress|resolved
  fetchTickets: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    console.log("[fetchTickets] params:", params);
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tickets?${query}`);
      if (data.success) {
        const ticketList = Array.isArray(data.data?.tickets)
          ? data.data.tickets
          : Array.isArray(data.data) ? data.data : [];
        const stats = data.data?.stats ?? null;
        console.log("[fetchTickets] Loaded:", ticketList.length, "tickets");
        set({ tickets: ticketList, stats });
      } else {
        set({ error: data.message });
        console.warn("[fetchTickets] !success:", data.message);
      }
    } catch (err) {
      console.error("[fetchTickets] Error:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // ========== GET TICKET STATS ==========
  fetchStats: async () => {
    console.log("[fetchStats] Fetching ticket stats...");
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tickets/stats`);
      if (data.success) {
        set({ stats: data.data });
        console.log("[fetchStats] Stats:", data.data);
      }
      return data;
    } catch (err) {
      console.error("[fetchStats] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== GET SINGLE TICKET ==========
  fetchTicket: async (ticketId) => {
    console.log("[fetchTicket] ID:", ticketId);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tickets/${ticketId}`);
      if (data.success) {
        const ticket = data.data?.ticket ?? data.data;
        set({ selectedTicket: ticket });
        console.log("[fetchTicket] Loaded ticket:", ticket?.id);
      }
      return data;
    } catch (err) {
      console.error("[fetchTicket] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== ASSIGN TICKET TO SELF ==========
  assignTicket: async (ticketId) => {
    console.log("[assignTicket] Assigning:", ticketId);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tickets/${ticketId}/assign`, {
        method: "PATCH",
      });
      if (data.success) {
        console.log("[assignTicket] Assigned successfully");
        const updated = data.data?.ticket ?? data.data;
        // Update in list and selectedTicket
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId ? { ...t, ...updated } : t
          ),
          selectedTicket:
            state.selectedTicket?.id === ticketId
              ? { ...state.selectedTicket, ...updated }
              : state.selectedTicket,
        }));
      }
      return data;
    } catch (err) {
      console.error("[assignTicket] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== REPLY TO TICKET ==========
  replyToTicket: async (ticketId, message) => {
    console.log("[replyToTicket] Ticket:", ticketId);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tickets/${ticketId}/reply`, {
        method: "POST",
        body: JSON.stringify({ message }),
      });
      console.log("[replyToTicket] Result:", data?.success ? "OK" : "Failed");
      return data;
    } catch (err) {
      console.error("[replyToTicket] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== UPDATE INTERNAL NOTES ==========
  updateNotes: async (ticketId, internalNotes) => {
    console.log("[updateNotes] Ticket:", ticketId);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tickets/${ticketId}/notes`, {
        method: "PATCH",
        body: JSON.stringify({ internalNotes }),
      });
      if (data.success) {
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId ? { ...t, internalNotes } : t
          ),
          selectedTicket:
            state.selectedTicket?.id === ticketId
              ? { ...state.selectedTicket, internalNotes }
              : state.selectedTicket,
        }));
        console.log("[updateNotes] Notes saved");
      }
      return data;
    } catch (err) {
      console.error("[updateNotes] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== RESOLVE TICKET ==========
  resolveTicket: async (ticketId) => {
    console.log("[resolveTicket] Resolving:", ticketId);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tickets/${ticketId}/resolve`, {
        method: "PATCH",
      });
      if (data.success) {
        console.log("[resolveTicket] Resolved successfully");
        set((state) => ({
          tickets: state.tickets.map((t) =>
            t.id === ticketId ? { ...t, status: "RESOLVED" } : t
          ),
          selectedTicket:
            state.selectedTicket?.id === ticketId
              ? { ...state.selectedTicket, status: "RESOLVED" }
              : state.selectedTicket,
        }));
      }
      return data;
    } catch (err) {
      console.error("[resolveTicket] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== DELETE TICKET ==========
  deleteTicket: async (ticketId) => {
    console.log("[deleteTicket] Deleting:", ticketId);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tickets/${ticketId}`, {
        method: "DELETE",
      });
      if (data.success) {
        console.log("[deleteTicket] Deleted successfully");
        set((state) => ({
          tickets: state.tickets.filter((t) => t.id !== ticketId),
          selectedTicket:
            state.selectedTicket?.id === ticketId ? null : state.selectedTicket,
        }));
      }
      return data;
    } catch (err) {
      console.error("[deleteTicket] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== CLEAR SELECTED ==========
  clearSelectedTicket: () => set({ selectedTicket: null }),
  clearError: () => set({ error: null }),
}));

export { useAdminTicketStore };
export default useAdminTicketStore;