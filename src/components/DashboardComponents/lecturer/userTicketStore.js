import { create } from "zustand";
import { useAuthStore } from "./authStore";

const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/users/tickets";

const getAuthHeaders = () => {
  const token = useAuthStore.getState().token;
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };
};

export const useTicketStore = create((set, get) => ({
  // ─── State ───────────────────────────────────────────────
  tickets: [],
  selectedTicket: null,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { status: "", page: 1, limit: 10 },
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,

  // ─── Helpers ─────────────────────────────────────────────
  setError: (error) => set({ error }),
  clearMessages: () => set({ error: null, successMessage: null }),

  // ─── Fetch All Tickets ────────────────────────────────────
  fetchTickets: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const merged = { ...get().filters, ...filters };
      set({ filters: merged });

      const params = new URLSearchParams();
      if (merged.status) params.append("status", merged.status);
      if (merged.page) params.append("page", merged.page);
      if (merged.limit) params.append("limit", merged.limit);

      const url = `${BASE_URL}${params.toString() ? `?${params}` : ""}`;
      const res = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");

      set({
        tickets: data.data?.tickets || data.tickets || data.data || [],
        pagination: {
          page: data.data?.page || merged.page,
          limit: merged.limit,
          total: data.data?.total || data.total || 0,
        },
      });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // ─── Fetch Single Ticket ──────────────────────────────────
  fetchTicketById: async (ticketId) => {
    set({ loading: true, error: null, selectedTicket: null });
    try {
      const res = await fetch(`${BASE_URL}/${ticketId}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch ticket");

      set({ selectedTicket: data.data || data });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // ─── Create Ticket ────────────────────────────────────────
  createTicket: async (payload) => {
    set({ submitting: true, error: null, successMessage: null });
    try {
      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create ticket");

      const newTicket = data.data || data;
      set((state) => ({
        tickets: [newTicket, ...state.tickets],
        successMessage: "Ticket created successfully!",
      }));
      return { success: true, ticket: newTicket };
    } catch (err) {
      set({ error: err.message });
      return { success: false };
    } finally {
      set({ submitting: false });
    }
  },

  // ─── Reply to Ticket ──────────────────────────────────────
  replyToTicket: async (ticketId, message) => {
    set({ submitting: true, error: null, successMessage: null });
    try {
      const res = await fetch(`${BASE_URL}/${ticketId}/reply`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reply");

      await get().fetchTicketById(ticketId);
      set({ successMessage: "Reply sent!" });
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false };
    } finally {
      set({ submitting: false });
    }
  },

  // ─── Close Ticket ─────────────────────────────────────────
  closeTicket: async (ticketId) => {
    set({ submitting: true, error: null, successMessage: null });
    try {
      const res = await fetch(`${BASE_URL}/${ticketId}/close`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to close ticket");

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t._id === ticketId || t.id === ticketId
            ? { ...t, status: "CLOSED" }
            : t
        ),
        selectedTicket:
          state.selectedTicket?._id === ticketId ||
          state.selectedTicket?.id === ticketId
            ? { ...state.selectedTicket, status: "CLOSED" }
            : state.selectedTicket,
        successMessage: "Ticket closed.",
      }));
      return { success: true };
    } catch (err) {
      set({ error: err.message });
      return { success: false };
    } finally {
      set({ submitting: false });
    }
  },

  // ─── Reset ────────────────────────────────────────────────
  resetSelectedTicket: () => set({ selectedTicket: null }),
}));