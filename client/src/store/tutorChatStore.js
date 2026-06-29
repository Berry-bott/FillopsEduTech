import { create } from "zustand";
import useTutorAuthStore from "./tutorAuthStore";
import { connectSocket, getSocket } from "@/lib/tutorChatSocket";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// ── Helpers ────────────────────────────────────────────────────────────────────

const mapBookingToUI = (booking) => ({
  id: booking.id,
  studentId: booking.userId || booking.user?.id,
  participant_name: booking.user?.name || "Student",
  participant_role: "student",
  last_message: booking.lastMessage?.content || "",
  last_message_time: booking.lastMessage?.createdAt || null,
  status: (booking.status || "pending").toLowerCase(),
  scheduledAt: booking.scheduledAt || null,
  proposedAt: booking.proposedAt || null,
  duration: booking.duration || null,
  unread_count: booking.unreadCount || 0,
  purpose: booking.purpose || "",
  avatar: booking.user?.avatar || null,
  isBooking: true,
  isOnline: false,
});

// Apply a booking update across ALL filter buffers at once
const applyToAllFilters = (bookingsByFilter, bookingId, patch) => {
  const updated = {};
  Object.keys(bookingsByFilter).forEach((key) => {
    updated[key] = bookingsByFilter[key]?.map((b) =>
      b.id === bookingId ? { ...b, ...patch } : b
    );
  });
  return updated;
};

// Move booking from one status bucket to another across all filters
const moveBookingInFilters = (bookingsByFilter, bookingId, updatedBooking) => {
  const newStatus = updatedBooking.status;
  const updated = {};

  Object.keys(bookingsByFilter).forEach((key) => {
    if (key === "all") {
      // Update in "all" filter
      updated[key] = bookingsByFilter[key]?.map((b) =>
        b.id === bookingId ? updatedBooking : b
      );
    } else if (key === newStatus) {
      // Add to new status bucket if not already there
      const exists = bookingsByFilter[key]?.some((b) => b.id === bookingId);
      updated[key] = exists
        ? bookingsByFilter[key].map((b) => (b.id === bookingId ? updatedBooking : b))
        : [updatedBooking, ...(bookingsByFilter[key] || [])];
    } else {
      // Remove from old status buckets
      updated[key] = bookingsByFilter[key]?.filter((b) => b.id !== bookingId);
    }
  });

  return updated;
};

// ── Store ──────────────────────────────────────────────────────────────────────

export const useTutorChatStore = create((set, get) => ({
  // ── State ──────────────────────────────────────────────────────
  bookingsByFilter: {},
  loadedFilters: new Set(),
  activeFilter: "all",
  selectedBooking: null,
  messages: [],
  isLoading: false,
  isLoadingMessages: false,
  isSending: false,
  socketConnected: false,
  isSomeoneTyping: false,
  typingUserName: null,
  isParticipantOnline: false,
  bookingsPagesLoaded: {},    
  hasMoreBookings: {},             
  loadingOlderBookings: false,

  // ── Socket setup ───────────────────────────────────────────────

  initializeSocket: () => {
    const token = useTutorAuthStore.getState().accessToken;
    if (!token) {
      console.warn("[TutorChatStore] No token — cannot initialize socket");
      return;
    }
    const socket = connectSocket(token);
    set({ socketConnected: socket?.connected || false });
  },

  disconnectSocket: () => {
    const socket = getSocket();
    if (socket?.connected) socket.disconnect();
    set({ socketConnected: false });
  },

  // ── initializeListeners: wires ALL socket events ───────────────
  // Call this once after initializeSocket. Returns a cleanup fn.
  initializeListeners: () => {
    const socket = getSocket();
    if (!socket) return;

    const handlers = {

      "connect": () => {
        set({ socketConnected: true });
        socket.emit("getOnlineUsers");
        const { selectedBooking } = get();
        if (selectedBooking?.id) {
          socket.emit("join:booking", selectedBooking.id, (ack) => {
            if (ack?.success) get().markMessagesAsRead(selectedBooking.id);
          });
        }
      },

      "disconnect": () => set({ socketConnected: false, isParticipantOnline: false }),

      // ── Messages ──────────────────────────────────────────────
      "message:new": (msg) => get().handleNewMessage(msg),
      "messages:read": (ts) => get().handleMessagesReadByStudent(ts),

      // ── Typing ────────────────────────────────────────────────
      "typing:start": (data) => {
        const { selectedBooking } = get();
        if (data?.bookingId !== selectedBooking?.id) return;
        if (data.userType === "tutor") return;
        set({ isSomeoneTyping: true, typingUserName: data.userName || "Student" });
      },
      "typing:stop": (data) => {
        const { selectedBooking } = get();
        if (data?.bookingId !== selectedBooking?.id) return;
        set({ isSomeoneTyping: false, typingUserName: null });
      },

      // ── Online presence ───────────────────────────────────────
      "users:online": (users) => get().handleOnlineUsers(users),
      "onlineUsers":  (users) => get().handleOnlineUsers(users),

      "user:online": (data) => {
        if (data?.userType !== "user" && data?.userType !== "student") return;
        set((s) => ({
          bookingsByFilter: applyToAllFilters(
            s.bookingsByFilter,
            // find booking by studentId
            Object.values(s.bookingsByFilter)
              .flat()
              .find((b) => b.studentId === data.userId)?.id,
            { isOnline: true }
          ),
          isParticipantOnline:
            s.selectedBooking?.studentId === data.userId ? true : s.isParticipantOnline,
        }));
      },

      "user:offline": (data) => {
        if (data?.userType !== "user" && data?.userType !== "student") return;
        set((s) => ({
          bookingsByFilter: applyToAllFilters(
            s.bookingsByFilter,
            Object.values(s.bookingsByFilter)
              .flat()
              .find((b) => b.studentId === data.userId)?.id,
            { isOnline: false }
          ),
          isParticipantOnline:
            s.selectedBooking?.studentId === data.userId ? false : s.isParticipantOnline,
          selectedBooking:
            s.selectedBooking?.studentId === data.userId
              ? { ...s.selectedBooking, isOnline: false }
              : s.selectedBooking,
        }));
      },

      // ── Booking status changes (the core of instant updates) ──
      "booking:confirmed": (data) => {
        set((s) => {
          const updatedBooking = { 
            ...(s.bookingsByFilter["all"]?.find((b) => b.id === data.bookingId) ||
                s.selectedBooking || { id: data.bookingId }),
            status: data.booking ? mapBookingToUI(data.booking).status : "confirmed",
            ...(data.booking ? mapBookingToUI(data.booking) : {}),
          };
          const newStatus = updatedBooking.status;
          return {
            bookingsByFilter: moveBookingInFilters(s.bookingsByFilter, data.bookingId, updatedBooking),
            selectedBooking: s.selectedBooking?.id === data.bookingId ? updatedBooking : s.selectedBooking,
            activeFilter: s.selectedBooking?.id === data.bookingId ? newStatus : s.activeFilter,
          };
        });
        // Refresh counts for affected filters
        get().fetchBookings("confirmed", true);
        get().fetchBookings("pending", true);
        get().fetchBookings("all", true);
      },

      "booking:active": (data) => {
        set((s) => {
          const existing = 
            s.bookingsByFilter["all"]?.find((b) => b.id === data.bookingId) ||
            s.selectedBooking || { id: data.bookingId };
          const updatedBooking = {
            ...existing,
            status: "active",
            ...(data.booking ? mapBookingToUI(data.booking) : {}),
          };
          return {
            bookingsByFilter: moveBookingInFilters(s.bookingsByFilter, data.bookingId, updatedBooking),
            selectedBooking: s.selectedBooking?.id === data.bookingId ? updatedBooking : s.selectedBooking,
            activeFilter: s.selectedBooking?.id === data.bookingId ? "active" : s.activeFilter,
          };
        });
        get().fetchBookings("active", true);
        get().fetchBookings("confirmed", true);
        get().fetchBookings("all", true);
      },

      "booking:cancelled": (data) => {
        set((s) => {
          const existing =
            s.bookingsByFilter["all"]?.find((b) => b.id === data.bookingId) ||
            s.selectedBooking || { id: data.bookingId };
          const updatedBooking = { ...existing, status: "cancelled" };
          return {
            bookingsByFilter: moveBookingInFilters(s.bookingsByFilter, data.bookingId, updatedBooking),
            selectedBooking: s.selectedBooking?.id === data.bookingId ? updatedBooking : s.selectedBooking,
          };
        });
        get().fetchBookings("cancelled", true);
        get().fetchBookings("all", true);
      },

      "booking:completed": (data) => {
        set((s) => {
          const existing =
            s.bookingsByFilter["all"]?.find((b) => b.id === data.bookingId) ||
            s.selectedBooking || { id: data.bookingId };
          const updatedBooking = { ...existing, status: "completed" };
          return {
            bookingsByFilter: moveBookingInFilters(s.bookingsByFilter, data.bookingId, updatedBooking),
            selectedBooking: s.selectedBooking?.id === data.bookingId ? updatedBooking : s.selectedBooking,
            activeFilter: s.selectedBooking?.id === data.bookingId ? "completed" : s.activeFilter,
          };
        });
        get().fetchBookings("completed", true);
        get().fetchBookings("all", true);
      },

      "booking:new": () => {
        get().fetchBookings("pending", true);
        get().fetchBookings("all", true);
      },
      "booking:rescheduled": (data) => {
    set((s) => ({
      bookingsByFilter: applyToAllFilters(
        s.bookingsByFilter, data.bookingId,
        { status: "reschedule-proposed", proposedAt: data.proposedAt }
      ),
      selectedBooking: s.selectedBooking?.id === data.bookingId
        ? { ...s.selectedBooking, status: "reschedule-proposed", proposedAt: data.proposedAt }
        : s.selectedBooking,
    }));
  },

      // ── Session events ─────────────────────────────────────────
      "session:ended":   (data) => get().handleSessionEnded(data),
      "session:kick":    (data) => get().handleSessionKick(data),
      "session:expired": (data) => get().handleSessionExpired(data),

      // ── Session extension ──────────────────────────────────────
      "session:extendOffer": (data) => {
        set((s) => ({
          bookingsByFilter: applyToAllFilters(
            s.bookingsByFilter, data.bookingId,
            { extendOffer: true, extendDuration: data.duration || null }
          ),
          selectedBooking: s.selectedBooking?.id === data.bookingId
            ? { ...s.selectedBooking, extendOffer: true, extendDuration: data.duration || null }
            : s.selectedBooking,
        }));
      },

      "session:extended": (data) => {
        set((s) => ({
          bookingsByFilter: applyToAllFilters(
            s.bookingsByFilter, data.bookingId,
            { extendOffer: false, duration: data.newDuration || s.selectedBooking?.duration }
          ),
          selectedBooking: s.selectedBooking?.id === data.bookingId
            ? { 
                ...s.selectedBooking, 
                extendOffer: false, 
                duration: data.newDuration || s.selectedBooking?.duration 
              }
            : s.selectedBooking,
        }));
      },
    };

    Object.entries(handlers).forEach(([event, fn]) => socket.on(event, fn));

    // Return cleanup
    return () => {
      Object.entries(handlers).forEach(([event, fn]) => socket.off(event, fn));
    };
  },

  // ── Socket event handlers ──────────────────────────────────────

  handleNewMessage: (msg) => {
    set((state) => {
      if (state.messages.some((m) => m.id === msg.id)) return state;

      const isCurrent = msg.bookingId === state.selectedBooking?.id;
      let updatedMessages = [...state.messages];

      let optimisticIndex = -1;
      if (msg.tempId) {
        optimisticIndex = updatedMessages.findIndex((m) => m.tempId === msg.tempId);
      }
      if (optimisticIndex === -1 && msg.sender?.id && msg.content) {
        const msgTime = new Date(msg.createdAt).getTime();
        optimisticIndex = updatedMessages.findIndex(
          (m) =>
            m.isOptimistic === true &&
            m.content === msg.content &&
            m.sender?.id === msg.sender?.id &&
            Math.abs(new Date(m.createdAt).getTime() - msgTime) < 10000
        );
      }

      if (optimisticIndex !== -1) {
        updatedMessages[optimisticIndex] = {
          ...msg, tempId: undefined, isOptimistic: false, status: "sent",
        };
      } else {
        updatedMessages.push({ ...msg, status: "sent" });
      }

      updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      if (!isCurrent && msg.senderRole !== "tutor") {
        return {
          messages: updatedMessages,
          bookingsByFilter: applyToAllFilters(
            state.bookingsByFilter, msg.bookingId,
            { unread_count: (state.bookingsByFilter["all"]?.find((b) => b.id === msg.bookingId)?.unread_count || 0) + 1, last_message: msg.content }
          ),
        };
      }

      return { messages: updatedMessages };
    });
  },

  handleMessagesReadByStudent: (timestamp) => {
    set((state) => ({
      messages: state.messages.map((m) =>
        m.senderRole === "tutor" && new Date(m.createdAt) <= new Date(timestamp)
          ? { ...m, isRead: true } : m
      ),
    }));
  },

  handleSessionEnded: (data) => {
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, data.bookingId, { status: "completed" }),
      selectedBooking: s.selectedBooking?.id === data.bookingId
        ? { ...s.selectedBooking, status: "completed" } : s.selectedBooking,
    }));
  },

  handleSessionKick: (data) => {
    const socket = getSocket();
    if (socket && data?.bookingId) socket.emit("leave:booking", data.bookingId);
    set((s) => ({
      selectedBooking: s.selectedBooking?.id === data?.bookingId ? null : s.selectedBooking,
      messages: s.selectedBooking?.id === data?.bookingId ? [] : s.messages,
    }));
  },

  handleSessionExpired: (data) => {
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, data.bookingId, { status: "completed" }),
      selectedBooking: s.selectedBooking?.id === data.bookingId
        ? { ...s.selectedBooking, status: "completed" } : s.selectedBooking,
    }));
  },

  handleOnlineUsers: (users) => {
    const { bookingsByFilter, selectedBooking } = get();

    const isOnlineCheck = (studentId) =>
      users.some((u) => u.id === studentId && (u.userType === "user" || u.userType === "student"));

    const updatedFilters = {};
    Object.keys(bookingsByFilter).forEach((filter) => {
      updatedFilters[filter] = bookingsByFilter[filter]?.map((b) => ({
        ...b, isOnline: isOnlineCheck(b.studentId),
      }));
    });

    set({
      bookingsByFilter: updatedFilters,
      selectedBooking: selectedBooking
        ? { ...selectedBooking, isOnline: isOnlineCheck(selectedBooking.studentId) }
        : null,
      isParticipantOnline: selectedBooking
        ? isOnlineCheck(selectedBooking.studentId) : false,
    });
  },

  // ── Core actions ───────────────────────────────────────────────
  extendSession: async (bookingId, duration) => {
    // Optimistic update
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, { extendOffer: false }),
      selectedBooking: s.selectedBooking?.id === bookingId
        ? { ...s.selectedBooking, extendOffer: false }
        : s.selectedBooking,
    }));

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/extend`,
        { method: "POST", body: JSON.stringify({ duration }) }
      );
      if (!res.success) throw new Error(res.message || "Extend session failed");

      // Update duration from server response
      if (res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        set((s) => ({
          bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, updatedBooking),
          selectedBooking: s.selectedBooking?.id === bookingId
            ? { ...s.selectedBooking, ...updatedBooking }
            : s.selectedBooking,
        }));
      }

      return res.data;
    } catch (err) {
      console.error("extendSession failed:", err);
      get().fetchBooking(bookingId);
      throw err;
    }
  },

  setSelectedBooking: (booking) => {
    const prevId = get().selectedBooking?.id;
    const socket = getSocket();

    if (prevId && socket?.connected) socket.emit("leave:booking", prevId);

    set({
      selectedBooking: booking,
      messages: [],
      isLoading: false,
      isLoadingMessages: false,
      isSending: false,
      isSomeoneTyping: false,
      typingUserName: null,
      isParticipantOnline: booking?.studentId
        ? get().bookingsByFilter["all"]?.find((b) => b.id === booking.id)?.isOnline || false
        : false,
    });

    if (!booking?.id) return;

    if (socket?.connected) {
      socket.emit("join:booking", booking.id, (ack) => {
        if (ack?.success) get().markMessagesAsRead(booking.id);
        else console.error("❌ Failed to join room:", ack);
      });
    }

    set({ isLoadingMessages: true });
    get().fetchMessages(booking.id).finally(() => set({ isLoadingMessages: false }));
  },

  sendMessage: async (bookingId, content, messageType = "TEXT") => {
    if (!content?.trim() || !bookingId) return;

    let socket = getSocket();
    if (!socket?.connected) {
      get().initializeSocket();
      await new Promise((resolve) => {
        const iv = setInterval(() => {
          if (getSocket()?.connected) {
            clearInterval(iv);
            resolve();
          }
        }, 100);
        setTimeout(() => {
          clearInterval(iv);
          resolve();
        }, 3000);
      });
      socket = getSocket();
      if (!socket?.connected) {
        throw new Error("Cannot connect to chat server. Please refresh.");
      }
    }

    const tempId  = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const tutorId = useTutorAuthStore.getState().tutor?.id;

    set((s) => ({
      messages: [...s.messages, {
        tempId, content, messageType, bookingId,
        sender: { id: tutorId, type: "TUTOR", name: useTutorAuthStore.getState().tutor?.name || "You" },
        senderRole: "tutor",
        createdAt: new Date().toISOString(),
        status: "sending",
        isOptimistic: true,
      }],
      isSending: true,
    }));

    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Send timeout")), 10000);
        socket.emit(
          "message:send",
          { bookingId, content: content.trim(), messageType, tempId },
          (res) => {
            clearTimeout(timeout);
            res?.success ? resolve(res) : reject(new Error(res?.message || "Send failed"));
          }
        );
      });
    } catch (err) {
      console.error("[sendMessage] failed:", err);
      set((s) => ({
        messages: s.messages.filter((m) => m.tempId !== tempId),
        isSending: false,
      }));
      throw err;
    } finally {
      set({ isSending: false });
    }
  },

  sendTyping: (isTyping = true) => {
    const { selectedBooking, socketConnected } = get();
    if (!selectedBooking?.id || !socketConnected) return;
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit(isTyping ? "typing:start" : "typing:stop", {
        bookingId: selectedBooking.id,
        userType: "tutor",
        userName: useTutorAuthStore.getState().tutor?.name || "Tutor",
      });
    }
  },

  markMessagesAsRead: (bookingId) => {
    const socket = getSocket();
    if (socket?.connected) socket.emit("messages:read", bookingId);
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, { unread_count: 0 }),
    }));
  },

  // ── REST calls ─────────────────────────────────────────────────

  fetchMessages: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

      if (res.success && Array.isArray(res.data)) {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

        const sorted = res.data
          .filter((m) => new Date(m.createdAt) >= oneMonthAgo)
          .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

        if (get().selectedBooking?.id === bookingId) set({ messages: sorted });
        return sorted;
      }
      set({ messages: [] });
      return [];
    } catch (err) {
      console.error("[fetchMessages] failed:", err);
      return [];
    }
  },

  fetchBookings: async (filter = "all", mode = "replace") => {
    const currentPage = mode === "older"
      ? (get().bookingsPagesLoaded?.[filter] || 0) + 1
      : 1;

    set({
      isLoading: mode !== "older",
      loadingOlderBookings: mode === "older",
    });

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      let url = `${API_BASE}/api/tutor/bookings?limit=30&page=${currentPage}&sort=-updatedAt`;
      if (filter !== "all") {
        url += `&status=${filter === "cancelled" ? "cancelled_by_user" : filter}`;
      }

      const res = await fetchWithAuth(url);

      // ── Normalise response into a plain array ──────────────────
      // Log the raw shape once so you can confirm which branch fires
      console.log("[fetchBookings] raw res keys:", Object.keys(res || {}), "| data type:", typeof res?.data, Array.isArray(res?.data) ? "(array)" : "");

      let rawList = null;

      if (Array.isArray(res?.data)) {
        rawList = res.data;
      } else if (Array.isArray(res?.data?.bookings)) {
        rawList = res.data.bookings;
      } else if (Array.isArray(res?.data?.data)) {
        rawList = res.data.data;
      } else if (Array.isArray(res?.data?.items)) {
        rawList = res.data.items;
      } else if (Array.isArray(res?.bookings)) {
        rawList = res.bookings;
      } else if (Array.isArray(res?.items)) {
        rawList = res.items;
      } else if (Array.isArray(res?.result)) {
        rawList = res.result;
      }

      if (!rawList) {
        // Log the full response so we can see exactly what the server returned
        console.warn("[fetchBookings] could not find array in response. Full res:", JSON.stringify(res).slice(0, 800));
        set({ isLoading: false, loadingOlderBookings: false });
        return;
      }

      const newBookings = rawList
        .map(mapBookingToUI)
        .sort((a, b) =>
          new Date(b.scheduledAt || b.updatedAt || b.createdAt || 0) -
          new Date(a.scheduledAt || a.updatedAt || a.createdAt || 0)
        );

      set((s) => {
        const existing = s.bookingsByFilter[filter] || [];
        const updatedList = mode === "older"
          ? [...newBookings, ...existing]
          : newBookings;

        return {
          bookingsByFilter:   { ...s.bookingsByFilter, [filter]: updatedList },
          bookingsPagesLoaded: { ...s.bookingsPagesLoaded, [filter]: currentPage },
          hasMoreBookings:    { ...s.hasMoreBookings, [filter]: rawList.length === 30 },
          loadedFilters: mode !== "older"
            ? new Set([...s.loadedFilters, filter])
            : s.loadedFilters,
          isLoading: false,
          loadingOlderBookings: false,
        };
      });

    } catch (err) {
      console.error("[fetchBookings] caught error:", err?.message || err);
      set({ isLoading: false, loadingOlderBookings: false });
    }
  },

loadOlderBookings: () => {
    const { activeFilter, hasMoreBookings, loadingOlderBookings } = get();
    if (loadingOlderBookings || !hasMoreBookings?.[activeFilter]) return;

    get().fetchBookings(activeFilter, "older");
  },
  
  
  // Refresh ALL loaded filters at once (use sparingly — prefer socket events)
  refreshAllFilters: () => {
    const loaded = [...get().loadedFilters];
    Promise.all(loaded.map((f) => get().fetchBookings(f, true)));
  },

  fetchBooking: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}`);
      if (res.success && res.data) {
        const booking = mapBookingToUI(res.data);
        set((s) => ({
          selectedBooking: s.selectedBooking?.id === bookingId ? booking : s.selectedBooking,
          bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, booking),
        }));
        return booking;
      }
      return null;
    } catch (err) {
      console.error("[fetchBooking] failed:", err);
      return null;
    }
  },
  
  confirmBooking: async (bookingId) => {
    // Optimistic
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, { status: "confirmed" }),
      selectedBooking: s.selectedBooking?.id === bookingId
        ? { ...s.selectedBooking, status: "confirmed" } : s.selectedBooking,
    }));

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`, { method: "PATCH" }
      );
      if (!res.success) throw new Error("Confirm failed");

      // Final state from server response (don't wait for socket)
      if (res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        const newStatus = updatedBooking.status;
        set((s) => ({
          bookingsByFilter: moveBookingInFilters(s.bookingsByFilter, bookingId, updatedBooking),
          selectedBooking: s.selectedBooking?.id === bookingId ? updatedBooking : s.selectedBooking,
          activeFilter: s.selectedBooking?.id === bookingId ? newStatus : s.activeFilter,
        }));
        get().fetchBookings(newStatus, true);
        get().fetchBookings("pending", true);
      }
      return res.data;
    } catch (err) {
      console.error("confirmBooking failed:", err);
      // Revert optimistic update
      get().fetchBooking(bookingId);
      throw err;
    }
  },

  cancelBooking: async (bookingId, reason) => {
    if (!reason?.trim()) throw new Error("Cancellation reason is required");

    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, { status: "cancelled" }),
      selectedBooking: s.selectedBooking?.id === bookingId
        ? { ...s.selectedBooking, status: "cancelled" } : s.selectedBooking,
    }));

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
        { method: "POST", body: JSON.stringify({ reason: reason.trim() }) }
      );
      if (!res.success) throw new Error(res.message || "Cancel failed");
      get().fetchBookings("cancelled", true);
      get().fetchBookings("all", true);
      return true;
    } catch (err) {
      console.error("cancelBooking failed:", err);
      get().fetchBooking(bookingId);
      throw err;
    }
  },

  endSession: async (bookingId, notes = "") => {
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, { status: "completed" }),
      selectedBooking: s.selectedBooking?.id === bookingId
        ? { ...s.selectedBooking, status: "completed" } : s.selectedBooking,
    }));

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
        { method: "POST", body: JSON.stringify({ notes }) }
      );
      if (!res.success) throw new Error("End session failed");
      get().fetchBookings("completed", true);
      get().fetchBookings("active", true);
      return true;
    } catch (err) {
      console.error("endSession failed:", err);
      get().fetchBooking(bookingId);
      throw err;
    }
  },

  proposeReschedule: async (bookingId, proposedAt) => {
    const proposedDateTime = new Date(proposedAt).toISOString();
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, {
        status: "reschedule-proposed", proposedAt: proposedDateTime,
      }),
      selectedBooking: s.selectedBooking?.id === bookingId
        ? { ...s.selectedBooking, status: "reschedule-proposed", proposedAt: proposedDateTime }
        : s.selectedBooking,
    }));

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
        { method: "PATCH", body: JSON.stringify({ proposedAt: proposedDateTime }) }
      );
      if (!res.success) throw new Error(res.message || "Reschedule failed");
      return res.data;
    } catch (err) {
      console.error("proposeReschedule failed:", err);
      get().fetchBooking(bookingId);
      throw err;
    }
  },

  acceptReschedule: async (bookingId) => {
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, { status: "confirmed" }),
      selectedBooking: s.selectedBooking?.id === bookingId
        ? { ...s.selectedBooking, status: "confirmed" } : s.selectedBooking,
    }));

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule/accept`, { method: "PATCH" }
      );
      if (!res.success) throw new Error("Accept reschedule failed");
      return res.data;
    } catch (err) {
      console.error("acceptReschedule failed:", err);
      get().fetchBooking(bookingId);
      throw err;
    }
  },

  rejectReschedule: async (bookingId, reason) => {
    set((s) => ({
      bookingsByFilter: applyToAllFilters(s.bookingsByFilter, bookingId, { status: "pending" }),
      selectedBooking: s.selectedBooking?.id === bookingId
        ? { ...s.selectedBooking, status: "pending" } : s.selectedBooking,
    }));

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule/reject`,
        { method: "PATCH", body: JSON.stringify({ reason }) }
      );
      if (!res.success) throw new Error("Reject reschedule failed");
      return res.data;
    } catch (err) {
      console.error("rejectReschedule failed:", err);
      get().fetchBooking(bookingId);
      throw err;
    }
  },

  confirmMessage: async (messageId) => {
    set((s) => ({
      messages: s.messages.map((m) => m.id === messageId ? { ...m, status: "confirmed" } : m),
    }));
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/messages/${messageId}/confirm`, { method: "PATCH" }
      );
      if (res.success && res.data) {
        set((s) => ({ messages: s.messages.map((m) => m.id === messageId ? res.data : m) }));
      }
    } catch (err) {
      console.error("confirmMessage failed:", err);
      const bid = get().selectedBooking?.id;
      if (bid) get().fetchMessages(bid);
    }
  },

  rejectMessage: async (messageId) => {
    set((s) => ({
      messages: s.messages.map((m) => m.id === messageId ? { ...m, status: "rejected" } : m),
    }));
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/messages/${messageId}/reject`, { method: "PATCH" }
      );
      if (res.success && res.data) {
        set((s) => ({ messages: s.messages.map((m) => m.id === messageId ? res.data : m) }));
      }
    } catch (err) {
      console.error("rejectMessage failed:", err);
      const bid = get().selectedBooking?.id;
      if (bid) get().fetchMessages(bid);
    }
  },

  // ── Misc ───────────────────────────────────────────────────────

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  getCurrentBookings: () => {
    const { bookingsByFilter, activeFilter } = get();
    return bookingsByFilter[activeFilter] || [];
  },

  reset: () => {
    get().disconnectSocket();
    set({
      bookingsByFilter: {},
      loadedFilters: new Set(),
      activeFilter: "all",
      selectedBooking: null,
      messages: [],
      isLoading: false,
      isLoadingMessages: false,
      isSending: false,
      socketConnected: false,
      isSomeoneTyping: false,
      typingUserName: null,
      isParticipantOnline: false,
    });
  },
}));
