import { create } from "zustand";
import useTutorAuthStore from "./tutorAuthStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com";

export const useTutorChatStore = create((set, get) => ({
  // ---------------- STATES ----------------
  bookings: [],
  selectedBooking: null,
  messages: [],
  isLoading: false,
  isSending: false,

  // ---------------- GET ALL BOOKINGS ----------------
  fetchBookings: async (status = null) => {
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      let url = `${API_BASE}/api/tutor/bookings`;
      
      // Add status filter if provided (e.g., "pending")
      if (status) {
        url += `?status=${status}`;
      }

      const res = await fetchWithAuth(url);
      if (res.success && Array.isArray(res.data)) {
        // Map API bookings to UI-friendly format
        const mappedBookings = res.data.map((booking) => ({
          id: booking.id,
          studentId: booking.studentId || booking.student?.id,
          participant_name: booking.student?.name || "Student",
          participant_role: "student",
          last_message: booking.lastMessage?.content || "",
          last_message_time: booking.lastMessage?.createdAt || null,
          status: booking.status || "pending",
          scheduledAt: booking.scheduledAt || null,
          duration: booking.duration || null,
          unread_count: booking.unreadCount || 0,
          purpose: booking.purpose || "",
          avatar: booking.student?.avatar || null,
          isBooking: true,
        }));

        set({ bookings: mappedBookings });
      } else {
        set({ bookings: [] });
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      set({ bookings: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- VIEW BOOKING DETAILS ----------------
  fetchBooking: async (bookingId) => {
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}`);
      
      if (res.success && res.data) {
        const booking = {
          id: res.data.id,
          studentId: res.data.studentId || res.data.student?.id,
          participant_name: res.data.student?.name || "Student",
          participant_role: "student",
          last_message: res.data.lastMessage?.content || "",
          last_message_time: res.data.lastMessage?.createdAt || null,
          status: res.data.status || "pending",
          scheduledAt: res.data.scheduledAt || null,
          duration: res.data.duration || null,
          unread_count: res.data.unreadCount || 0,
          purpose: res.data.purpose || "",
          avatar: res.data.student?.avatar || null,
          isBooking: true,
        };
        
        set({ selectedBooking: booking });
        return booking;
      }
    } catch (err) {
      console.error("Failed to fetch booking:", err);
    } finally {
      set({ isLoading: false });
    }
  },

  // ---------------- PROPOSE RESCHEDULE ----------------
  proposeReschedule: async (bookingId, proposedAt) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
        {
          method: "PATCH",
          body: JSON.stringify({ proposedAt }),
        }
      );
      
      if (res.success && res.data) {
        // Update booking in state
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId 
              ? { ...b, status: res.data.status || b.status, scheduledAt: res.data.scheduledAt || b.scheduledAt } 
              : b
          ),
          selectedBooking: state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: res.data.status || state.selectedBooking.status, scheduledAt: res.data.scheduledAt || state.selectedBooking.scheduledAt }
            : state.selectedBooking
        }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to propose reschedule:", err);
    }
  },

  // ---------------- CONFIRM BOOKING ----------------
  confirmBooking: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
        { method: "PATCH" }
      );
      
      if (res.success && res.data) {
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId 
              ? { ...b, status: res.data.status || "confirmed" } 
              : b
          ),
          selectedBooking: state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: res.data.status || "confirmed" }
            : state.selectedBooking
        }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to confirm booking:", err);
    }
  },

  // ---------------- CANCEL BOOKING ----------------
  cancelBooking: async (bookingId, reason) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
        { 
          method: "PATCH", 
          body: JSON.stringify({ reason }) 
        }
      );
      
      if (res.success) {
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId 
              ? { ...b, status: "cancelled" } 
              : b
          ),
          selectedBooking: state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: "cancelled" }
            : state.selectedBooking
        }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    }
  },

  // ---------------- SEND MESSAGE ----------------
  sendMessage: async (bookingId, content, messageType = "TEXT") => {
    set({ isSending: true });
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content, messageType }),
        }
      );
      
      if (res.success && res.data) {
        set((state) => ({ messages: [...state.messages, res.data] }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    } finally {
      set({ isSending: false });
    }
  },

  // ---------------- GET MESSAGES ----------------
  fetchMessages: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);
      
      if (res.success && Array.isArray(res.data)) {
        set({ messages: res.data });
        return res.data;
      } else {
        set({ messages: [] });
        return [];
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      set({ messages: [] });
      return [];
    }
  },

  // ---------------- END SESSION ----------------
  endSession: async (bookingId, notes = "") => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
        {
          method: "POST",
          body: JSON.stringify({ notes }),
        }
      );
      
      if (res.success) {
        // Update booking status to completed
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId 
              ? { ...b, status: "completed" } 
              : b
          ),
          selectedBooking: state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: "completed" }
            : state.selectedBooking
        }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to end session:", err);
    }
  },
}));