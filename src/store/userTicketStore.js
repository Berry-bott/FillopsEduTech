import { create } from "zustand";
import useAuthStore from "./authStore";

const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/users/tickets";

const getAuthHeaders = () => {
  const state = useAuthStore.getState();
  const token =
    state.token ||
    state.accessToken ||
    state.user?.token ||
    state.user?.accessToken ||
    state.authToken ||
    null;

  if (!token) console.warn("[ticketStore] No auth token found in useAuthStore");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token || ""}`,
  };
};

const unwrapTicket  = (data) => data?.data?.ticket || data?.data || data;
const unwrapTickets = (data) =>
  data?.data?.tickets || data?.tickets || (Array.isArray(data?.data) ? data.data : []);

const useTicketStore = create((set, get) => ({
  tickets: [],
  selectedTicket: null,
  pagination: { page: 1, limit: 10, total: 0 },
  filters: { status: "", page: 1, limit: 10 },
  loading: false,
  submitting: false,
  error: null,
  successMessage: null,

  setError: (error) => set({ error }),
  clearMessages: () => set({ error: null, successMessage: null }),

  // GET /api/users/tickets
  fetchTickets: async (filters = {}) => {
    set({ loading: true, error: null });
    try {
      const merged = { ...get().filters, ...filters };
      set({ filters: merged });

      const params = new URLSearchParams();
      if (merged.status) params.append("status", merged.status);
      if (merged.page)   params.append("page",   merged.page);
      if (merged.limit)  params.append("limit",  merged.limit);

      const url = `${BASE_URL}${params.toString() ? `?${params}` : ""}`;
      const res  = await fetch(url, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch tickets");

      set({
        tickets: unwrapTickets(data),
        pagination: {
          page:  data?.data?.page  || merged.page,
          limit: merged.limit,
          total: data?.data?.total || data?.total || 0,
        },
      });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // GET /api/users/tickets/:ticketId
  // Response: { success, data: { ticket: { id, subject, messages: [...] } } }
  fetchTicketById: async (ticketId) => {
    set({ loading: true, error: null, selectedTicket: null });
    try {
      const res  = await fetch(`${BASE_URL}/${ticketId}`, { headers: getAuthHeaders() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch ticket");

      set({ selectedTicket: unwrapTicket(data) });
    } catch (err) {
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // POST /api/users/tickets
  createTicket: async (payload) => {
    set({ submitting: true, error: null, successMessage: null });
    try {
      const res  = await fetch(BASE_URL, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          subject:  payload.subject,
          message:  payload.message,
          category: payload.category,
          priority: payload.priority,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create ticket");

      const newTicket = unwrapTicket(data);
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

  // POST /api/users/tickets/:ticketId/reply
  // Appends message optimistically — NO refetch, NO page refresh.
  // Rolls back only if server returns an error.
  replyToTicket: async (ticketId, message) => {
    set({ submitting: true, error: null });

    // Build optimistic msg using the same shape the API returns
    const authState   = useAuthStore.getState();
    const currentUser = authState?.user || authState;
    const optimisticMsg = {
      id:            `optimistic-${Date.now()}`,
      message,
      attachmentUrl: null,
      createdAt:     new Date().toISOString(),
      senderUser: {
        id:        currentUser?.id        || "me",
        firstName: currentUser?.firstName || "You",
        lastName:  currentUser?.lastName  || "",
      },
      senderAdmin: null,
    };

    // Show message instantly
    set((state) => ({
      selectedTicket: state.selectedTicket
        ? { ...state.selectedTicket, messages: [...(state.selectedTicket.messages || []), optimisticMsg] }
        : state.selectedTicket,
    }));

    try {
      const res  = await fetch(`${BASE_URL}/${ticketId}/reply`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reply");

      // If server returns the saved message, swap optimistic entry for real one
      const serverMsg = data?.data?.message || null;
      if (serverMsg) {
        set((state) => ({
          selectedTicket: state.selectedTicket
            ? {
                ...state.selectedTicket,
                messages: state.selectedTicket.messages.map((m) =>
                  m.id === optimisticMsg.id ? serverMsg : m
                ),
              }
            : state.selectedTicket,
        }));
      }

      return { success: true };
    } catch (err) {
      // Roll back the optimistic message
      set((state) => ({
        error: err.message,
        selectedTicket: state.selectedTicket
          ? {
              ...state.selectedTicket,
              messages: state.selectedTicket.messages.filter(
                (m) => m.id !== optimisticMsg.id
              ),
            }
          : state.selectedTicket,
      }));
      return { success: false };
    } finally {
      set({ submitting: false });
    }
  },

  // PATCH /api/users/tickets/:ticketId/close
  closeTicket: async (ticketId) => {
    set({ submitting: true, error: null, successMessage: null });
    try {
      const res  = await fetch(`${BASE_URL}/${ticketId}/close`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to close ticket");

      set((state) => ({
        tickets: state.tickets.map((t) =>
          t.id === ticketId ? { ...t, status: "CLOSED" } : t
        ),
        selectedTicket:
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

  resetSelectedTicket: () => set({ selectedTicket: null }),
}));

export default useTicketStore;