
// src/store/tutorChatStore.js
import { create } from "zustand";
import useTutorAuthStore from "./tutorAuthStore";
import { connectSocket, getSocket } from "@/lib/tutorChatSocket";

const API_BASE = "https://fillops-server-5fuf.onrender.com";

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

// ✅ Helper to check if booking is older than 1 month
const isOlderThanMonth = (booking) => {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
  
  const bookingDate = new Date(
    booking.scheduledAt || 
    booking.updatedAt || 
    booking.createdAt || 
    0
  );
  
  return bookingDate < oneMonthAgo;
};

export const useTutorChatStore = create((set, get) => ({
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

  // ────────────────────────────────────────────────────────────────
  // Socket connection
  // ────────────────────────────────────────────────────────────────
  initializeSocket: () => {
    console.log("[TutorChatStore] initializeSocket called");
    
    const token = useTutorAuthStore.getState().accessToken;
    if (!token) {
      console.warn("[TutorChatStore] No token → cannot initialize socket");
      return;
    }

    const socket = connectSocket(token);
    set({ socketConnected: socket?.connected || false });
  },

  disconnectSocket: () => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.disconnect();
    }
    set({ socketConnected: false });
  },

  // ────────────────────────────────────────────────────────────────
  // Socket event handlers
  // ────────────────────────────────────────────────────────────────
  handleNewMessage: (msg) => {
    console.log("📨 handleNewMessage called:", msg);
    
    set((state) => {
      if (state.messages.some((m) => m.id === msg.id)) {
        console.log("⚠️ Duplicate message (by ID) skipped:", msg.id);
        return state;
      }

      const isCurrent = msg.bookingId === state.selectedBooking?.id;
      let updatedMessages = [...state.messages];

      let optimisticIndex = -1;
      if (msg.tempId) {
        optimisticIndex = updatedMessages.findIndex((m) => m.tempId === msg.tempId);
        console.log("🔎 Searching for tempId:", msg.tempId, "→ Found at index:", optimisticIndex);
      }

      if (optimisticIndex === -1 && msg.sender?.id && msg.content) {
        const msgTime = new Date(msg.createdAt).getTime();
        optimisticIndex = updatedMessages.findIndex((m) => 
          m.isOptimistic === true &&
          m.content === msg.content &&
          m.sender?.id === msg.sender?.id &&
          Math.abs(new Date(m.createdAt).getTime() - msgTime) < 10000
        );
        console.log("🔎 Fallback search by content+sender:", optimisticIndex);
      }

      if (optimisticIndex !== -1) {
        console.log("✅ REPLACING optimistic message at index:", optimisticIndex);
        updatedMessages[optimisticIndex] = {
          ...msg,
          tempId: undefined,
          isOptimistic: false,
          status: "sent",
        };
      } else {
        console.log("➕ Adding new message (no optimistic found)");
        updatedMessages.push({ ...msg, status: "sent" });
      }

      updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      if (!isCurrent && msg.senderRole !== "tutor") {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach((filter) => {
          updatedFilters[filter] = updatedFilters[filter]?.map((b) =>
            b.id === msg.bookingId
              ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
              : b
          );
        });
        return { messages: updatedMessages, bookingsByFilter: updatedFilters };
      }

      return { messages: updatedMessages };
    });
  },

  handleMessagesReadByStudent: (timestamp) => {
    console.log("📖 Student read messages up to:", timestamp);
    set((state) => ({
      messages: state.messages.map((m) =>
        m.senderRole === "tutor" && new Date(m.createdAt) <= new Date(timestamp)
          ? { ...m, isRead: true }
          : m
      ),
    }));
  },

  handleSessionEnded: (data) => {
    console.log("🏁 Session ended:", data);
    const { bookingId } = data;
    set((state) => {
      if (state.selectedBooking?.id !== bookingId) return state;
      return {
        selectedBooking: { ...state.selectedBooking, status: "completed" },
      };
    });
  },

  handleSessionKick: (data) => {
    console.log("👢 Kicked from session:", data);
    const socket = getSocket();
    if (socket && data?.bookingId) {
      socket.emit("leave:booking", data.bookingId);
    }

    set((state) => ({
      selectedBooking: state.selectedBooking?.id === data?.bookingId ? null : state.selectedBooking,
      messages: state.selectedBooking?.id === data?.bookingId ? [] : state.messages,
    }));
  },

  handleSessionExpired: (data) => {
    console.log("⏰ Session expired:", data);
    const { bookingId } = data;
    set((state) => {
      if (state.selectedBooking?.id !== bookingId) return state;
      return {
        selectedBooking: { ...state.selectedBooking, status: "completed" },
      };
    });
  },

  // handleOnlineUsers: (users) => {
  //   console.log("👥 Online users:", users);
  //   const studentId = get().selectedBooking?.studentId;
  //   const isOnline = users?.some((u) => u.id === studentId && u.userType === "user");
  //   set({ isParticipantOnline: !!isOnline });
  // },

  handleOnlineUsers: (users) => {
  console.log("👥 Online users:", users);

  const { bookingsByFilter, selectedBooking } = get();

  // Loop through all bookings and set isOnline
  const updatedFilters = {};
  Object.keys(bookingsByFilter).forEach((filter) => {
    updatedFilters[filter] = bookingsByFilter[filter].map((b) => {
      const isOnline = users.some((u) => u.id === b.studentId && u.userType === "user");
      return { ...b, isOnline };
    });
  });

  // Update selectedBooking if online
  const updatedSelected = selectedBooking
    ? {
        ...selectedBooking,
        isOnline: users.some((u) => u.id === selectedBooking.studentId && u.userType === "user"),
      }
    : null;

  set({ bookingsByFilter: updatedFilters, selectedBooking: updatedSelected });
},

  handleNewBookingNotification: (data) => {
    console.log("🔔 New booking notification:", data);
    get().fetchBookings("pending", true);
    get().fetchBookings("all", true);
  },

  handleBookingCancelled: (data) => {
    console.log("❌ Booking cancelled:", data);
    get().fetchBookings("cancelled", true);
    get().fetchBookings("all", true);
  },

  handleBookingRescheduled: (data) => {
    console.log("📅 Booking rescheduled:", data);
    get().fetchBookings("rescheduled", true);
    get().fetchBookings("all", true);
  },

  // ────────────────────────────────────────────────────────────────
  // Core chat actions// In tutorChatStore.js - Replace your setSelectedBooking with this:

setSelectedBooking: (booking) => {
  const prevId = get().selectedBooking?.id;
  const socket = getSocket();

  // Leave previous room
  if (prevId && socket?.connected) {
    socket.emit("leave:booking", prevId);
  }

  // ✅ INSTANT UI UPDATE - Show chat interface immediately
  set({
    selectedBooking: booking, // Show booking data immediately
    messages: [], // Empty messages (chat UI shows instantly)
    isLoading: false, // ✅ UI is ready - no spinner!
    isLoadingMessages: false, // Start fresh
    isSending: false,
    isSomeoneTyping: false,
    typingUserName: null,
    isParticipantOnline: false,
  });

  if (!booking?.id) return;

  // ✅ Join room in background (non-blocking)
  if (socket?.connected) {
    socket.emit("join:booking", booking.id, (ack) => {
      if (ack?.success) {
        console.log("✅ Joined booking room:", booking.id);
        get().markMessagesAsRead(booking.id);
      } else {
        console.error("❌ Failed to join room:", ack);
      }
    });
  }

  // ✅ Fetch messages in background (non-blocking)
  set({ isLoadingMessages: true });
  get().fetchMessages(booking.id).finally(() => {
    set({ isLoadingMessages: false });
  });
},
  // ────────────────────────────────────────────────────────────────
  // setSelectedBooking: (booking) => {
  //   const prevId = get().selectedBooking?.id;
  //   const socket = getSocket();

  //   if (prevId && socket?.connected) {
  //     socket.emit("leave:booking", prevId);
  //   }

  //   set({
  //     selectedBooking: booking,
  //     messages: [],
  //     isLoading: true,
  //     isSomeoneTyping: false,
  //     typingUserName: null,
  //     isParticipantOnline: false,
  //   });

  //   if (!booking?.id) return;

  //   if (socket?.connected) {
  //     socket.emit("join:booking", booking.id, (ack) => {
  //       if (ack?.success) {
  //         console.log("✅ Joined booking room:", booking.id);
  //         get().markMessagesAsRead(booking.id);
  //       } else {
  //         console.error("❌ Failed to join room:", ack);
  //       }
  //     });
  //   }

  //   get().fetchMessages(booking.id);
  // },
  setSelectedBooking: (booking) => {
  const prevId = get().selectedBooking?.id;
  const socket = getSocket();

  // Leave previous room
  if (prevId && socket?.connected) {
    socket.emit("leave:booking", prevId);
  }

  // ✅ INSTANT UI UPDATE - Show chat interface immediately with empty messages
  set({
    selectedBooking: booking,
    messages: [], // Empty array = chat UI shows instantly
    isLoading: false, // ✅ NOT loading - UI is ready!
    isSending: false,
    isSomeoneTyping: false,
    typingUserName: null,
    isParticipantOnline: false,
  });

  if (!booking?.id) return;

  // ✅ Join room in background (non-blocking)
  if (socket?.connected) {
    socket.emit("join:booking", booking.id, (ack) => {
      if (ack?.success) {
        console.log("✅ Joined booking room:", booking.id);
        get().markMessagesAsRead(booking.id);
      } else {
        console.error("❌ Failed to join room:", ack);
      }
    });
  }

  // ✅ Fetch messages in background (non-blocking)
  get().fetchMessages(booking.id);
},

  sendMessage: async (bookingId, content, messageType = "TEXT") => {
    if (!content?.trim() || !bookingId) return;

    const socket = getSocket();
    if (!socket?.connected) {
      console.warn("[sendMessage] Socket not connected");
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const tutorId = useTutorAuthStore.getState().tutor?.id;

    const optimisticMsg = {
      tempId,
      content,
      messageType,
      bookingId,
      sender: { 
        id: tutorId,
        type: 'TUTOR',
        name: useTutorAuthStore.getState().tutor?.name || 'You'
      },
      senderRole: "tutor",
      createdAt: new Date().toISOString(),
      status: "sending",
      isOptimistic: true,
    };

    console.log("📤 Sending message with tempId:", tempId);

    set((s) => ({
      messages: [...s.messages, optimisticMsg],
      isSending: true,
    }));

    try {
      socket.emit("message:send", {
        bookingId,
        content: content.trim(),
        messageType,
        tempId,
      });
      
      console.log("✅ Message emitted to socket");
    } catch (err) {
      console.error("[sendMessage] failed:", err);
      set((s) => ({
        messages: s.messages.filter((m) => m.tempId !== tempId),
      }));
    } finally {
      set({ isSending: false });
    }
  },

  sendTyping: (isTyping = true) => {
    const { selectedBooking, socketConnected } = get();
    if (!selectedBooking?.id || !socketConnected) return;

    const socket = getSocket();
    if (socket?.connected) {
      const event = isTyping ? "typing:start" : "typing:stop";
      socket.emit(event, selectedBooking.id);
    }
  },

  markMessagesAsRead: (bookingId) => {
    const socket = getSocket();
    if (socket?.connected) {
      socket.emit("messages:read", bookingId);
    }

    set((s) => ({
      bookingsByFilter: {
        ...s.bookingsByFilter,
        [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map((b) =>
          b.id === bookingId ? { ...b, unread_count: 0 } : b
        ),
      },
    }));
  },

  // ────────────────────────────────────────────────────────────────
  // ✅ OPTIMIZED REST API calls
  // ────────────────────────────────────────────────────────────────
  // fetchMessages: async (bookingId) => {
  //   console.log("[FETCH] Messages for booking:", bookingId);
  //   set({ isLoading: true });

  //   try {
  //     const { fetchWithAuth } = useTutorAuthStore.getState();
  //     const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

  //     if (res.success && Array.isArray(res.data)) {
  //       // ✅ Filter out messages older than 1 month
  //       const oneMonthAgo = new Date();
  //       oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
  //       const recentMessages = res.data.filter(msg => {
  //         const msgDate = new Date(msg.createdAt);
  //         return msgDate >= oneMonthAgo;
  //       });

  //       const sorted = [...recentMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  //       set({ messages: sorted });
  //       console.log(`[FETCH] Loaded ${sorted.length} recent messages (filtered ${res.data.length - sorted.length} old messages)`);
  //     } else {
  //       set({ messages: [] });
  //     }
  //   } catch (err) {
  //     console.error("[FETCH] Messages failed:", err);
  //     set({ messages: [] });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },
  fetchMessages: async (bookingId) => {
  console.log("[FETCH] Messages for booking:", bookingId);
  
  try {
    const { fetchWithAuth } = useTutorAuthStore.getState();
    const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

    if (res.success && Array.isArray(res.data)) {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      
      const recentMessages = res.data.filter(msg => {
        const msgDate = new Date(msg.createdAt);
        return msgDate >= oneMonthAgo;
      });

      const sorted = [...recentMessages].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      
      // ✅ Only update if still viewing this booking
      const currentBookingId = get().selectedBooking?.id;
      if (currentBookingId === bookingId) {
        set({ messages: sorted });
      }
      
      console.log(`[FETCH] Loaded ${sorted.length} messages`);
      return sorted;
    } else {
      set({ messages: [] });
      return [];
    }
  } catch (err) {
    console.error("[FETCH] Messages failed:", err);
    // Don't clear messages on error - keep UI stable
    return [];
  }
},

  fetchBookings: async (filter = "all", force = false) => {
    if (!force && get().loadedFilters.has(filter)) {
      console.log(`[fetchBookings] Using cached data for "${filter}"`);
      return;
    }

    console.log("[fetchBookings] START", { filter, forced: force });
    set({ isLoading: true });

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      
      // ✅ Fetch only 30 items per filter (much faster!)
      let url = `${API_BASE}/api/tutor/bookings?limit=50`;
      
      if (filter !== "all") {
        const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
        url += `&status=${backendStatus}`;
      }

      const res = await fetchWithAuth(url);

      if (!res.success || !Array.isArray(res.data)) {
        console.warn("[fetchBookings] Invalid response", res);
        set((state) => ({
          bookingsByFilter: { ...state.bookingsByFilter, [filter]: [] },
          isLoading: false,
        }));
        return;
      }

      // ✅ Filter out bookings older than 1 month
      const recentBookings = res.data.filter(b => !isOlderThanMonth(b));

      // Sort by date
      recentBookings.sort((a, b) => {
        const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
        const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
        return dateB - dateA;
      });

      const mapped = recentBookings.map(mapBookingToUI);

      set((state) => ({
        bookingsByFilter: {
          ...state.bookingsByFilter,
          [filter]: mapped,
        },
        loadedFilters: new Set([...state.loadedFilters, filter]),
        isLoading: false,
      }));

      console.log(`[fetchBookings] Loaded ${mapped.length} recent bookings for "${filter}" (filtered ${res.data.length - recentBookings.length} old bookings)`);
    } catch (err) {
      console.error("[fetchBookings] FAILED:", err);
      set((state) => ({
        bookingsByFilter: { ...state.bookingsByFilter, [filter]: [] },
        isLoading: false,
      }));
    }
  },

  fetchBooking: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const url = `${API_BASE}/api/tutor/bookings/${bookingId}`;
      console.log("[fetchBooking] Fetching:", url);

      const res = await fetchWithAuth(url);

      if (res.success && res.data) {
        const booking = mapBookingToUI(res.data);
        console.log("[fetchBooking] Success:", booking.id);

        set({ selectedBooking: booking });

        set((state) => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach((key) => {
            updatedFilters[key] = updatedFilters[key].map((b) =>
              b.id === bookingId ? booking : b
            );
          });
          return { bookingsByFilter: updatedFilters };
        });

        return booking;
      } else {
        console.warn("[fetchBooking] No data for ID:", bookingId);
        return null;
      }
    } catch (err) {
      console.error("[fetchBooking] FAILED:", err.message || err);
      return null;
    }
  },

  confirmMessage: async (messageId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId ? { ...m, status: "confirmed" } : m
        ),
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/messages/${messageId}/confirm`,
        { method: "PATCH" }
      );

      if (res.success && res.data) {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === messageId ? res.data : m
          ),
        }));
        return res.data;
      }
      throw new Error("Confirm failed");
    } catch (err) {
      console.error("confirmMessage failed:", err);
      const bookingId = get().selectedBooking?.id;
      if (bookingId) await get().fetchMessages(bookingId);
      throw err;
    }
  },

  rejectMessage: async (messageId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set((state) => ({
        messages: state.messages.map((m) =>
          m.id === messageId ? { ...m, status: "rejected" } : m
        ),
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/messages/${messageId}/reject`,
        { method: "PATCH" }
      );

      if (res.success && res.data) {
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === messageId ? res.data : m
          ),
        }));
        return res.data;
      }
      throw new Error("Reject failed");
    } catch (err) {
      console.error("rejectMessage failed:", err);
      const bookingId = get().selectedBooking?.id;
      if (bookingId) await get().fetchMessages(bookingId);
      throw err;
    }
  },

  proposeReschedule: async (bookingId, proposedAt) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      const proposedDateTime = new Date(proposedAt).toISOString();

      set((state) => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach((key) => {
          updatedFilters[key] = updatedFilters[key].map((b) =>
            b.id === bookingId ? { ...b, status: "reschedule-proposed", proposedAt: proposedDateTime } : b
          );
        });
        return {
          bookingsByFilter: updatedFilters,
          selectedBooking:
            state.selectedBooking?.id === bookingId
              ? { ...state.selectedBooking, status: "reschedule-proposed", proposedAt: proposedDateTime }
              : state.selectedBooking,
        };
      });

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
        {
          method: "PATCH",
          body: JSON.stringify({ proposedAt: proposedDateTime }),
        }
      );

      if (res.success && res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        set((state) => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach((key) => {
            updatedFilters[key] = updatedFilters[key].map((b) =>
              b.id === bookingId ? updatedBooking : b
            );
          });
          return {
            bookingsByFilter: updatedFilters,
            selectedBooking:
              state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
          };
        });
        return res.data;
      }

      throw new Error(res.message || "Reschedule failed");
    } catch (err) {
      console.error("proposeReschedule failed:", err);
      throw err;
    }
  },

  acceptReschedule: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set((state) => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach((key) => {
          updatedFilters[key] = updatedFilters[key].map((b) =>
            b.id === bookingId ? { ...b, status: "confirmed" } : b
          );
        });
        return {
          bookingsByFilter: updatedFilters,
          selectedBooking:
            state.selectedBooking?.id === bookingId
              ? { ...state.selectedBooking, status: "confirmed" }
              : state.selectedBooking,
        };
      });

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule/accept`,
        { method: "PATCH" }
      );

      if (res.success && res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        set((state) => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach((key) => {
            updatedFilters[key] = updatedFilters[key].map((b) =>
              b.id === bookingId ? updatedBooking : b
            );
          });
          return {
            bookingsByFilter: updatedFilters,
            selectedBooking:
              state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
          };
        });
        return res.data;
      }

      throw new Error("Accept reschedule failed");
    } catch (err) {
      console.error("acceptReschedule failed:", err);
      throw err;
    }
  },

  rejectReschedule: async (bookingId, reason) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set((state) => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach((key) => {
          updatedFilters[key] = updatedFilters[key].map((b) =>
            b.id === bookingId ? { ...b, status: "pending" } : b
          );
        });
        return {
          bookingsByFilter: updatedFilters,
          selectedBooking:
            state.selectedBooking?.id === bookingId
              ? { ...state.selectedBooking, status: "pending" }
              : state.selectedBooking,
        };
      });

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule/reject`,
        {
          method: "PATCH",
          body: JSON.stringify({ reason }),
        }
      );

      if (res.success && res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        set((state) => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach((key) => {
            updatedFilters[key] = updatedFilters[key].map((b) =>
              b.id === bookingId ? updatedBooking : b
            );
          });
          return {
            bookingsByFilter: updatedFilters,
            selectedBooking:
              state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
          };
        });
        return res.data;
      }

      throw new Error("Reject reschedule failed");
    } catch (err) {
      console.error("rejectReschedule failed:", err);
      throw err;
    }
  },

  confirmBooking: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set((state) => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach((key) => {
          updatedFilters[key] = updatedFilters[key].map((b) =>
            b.id === bookingId ? { ...b, status: "confirmed" } : b
          );
        });
        return {
          bookingsByFilter: updatedFilters,
          selectedBooking:
            state.selectedBooking?.id === bookingId
              ? { ...state.selectedBooking, status: "confirmed" }
              : state.selectedBooking,
        };
      });

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
        { method: "PATCH" }
      );

      if (res.success && res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        set((state) => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach((key) => {
            updatedFilters[key] = updatedFilters[key].map((b) =>
              b.id === bookingId ? updatedBooking : b
            );
          });
          return {
            bookingsByFilter: updatedFilters,
            selectedBooking:
              state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
          };
        });
        return res.data;
      }

      throw new Error("Confirm failed");
    } catch (err) {
      console.error("confirmBooking failed:", err);
      throw err;
    }
  },

  cancelBooking: async (bookingId, reason) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      if (!reason || !reason.trim()) {
        throw new Error("Cancellation reason is required");
      }

      set((state) => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach((key) => {
          updatedFilters[key] = updatedFilters[key].map((b) =>
            b.id === bookingId ? { ...b, status: "cancelled" } : b
          );
        });
        return {
          bookingsByFilter: updatedFilters,
          selectedBooking:
            state.selectedBooking?.id === bookingId
              ? { ...state.selectedBooking, status: "cancelled" }
              : state.selectedBooking,
        };
      });

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
        {
          method: "POST",
          body: JSON.stringify({ reason: reason.trim() }),
        }
      );

      if (res.success) {
        return true;
      }

      throw new Error(res.message || "Cancel failed");
    } catch (err) {
      console.error("cancelBooking failed:", err);
      throw err;
    }
  },

  endSession: async (bookingId, notes = "") => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set((state) => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach((key) => {
          updatedFilters[key] = updatedFilters[key].map((b) =>
            b.id === bookingId ? { ...b, status: "completed" } : b
          );
        });
        return {
          bookingsByFilter: updatedFilters,
          selectedBooking:
            state.selectedBooking?.id === bookingId
              ? { ...state.selectedBooking, status: "completed" }
              : state.selectedBooking,
        };
      });

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
        {
          method: "POST",
          body: JSON.stringify({ notes }),
        }
      );

      if (res.success) {
        return true;
      }

      throw new Error("End session failed");
    } catch (err) {
      console.error("endSession failed:", err);
      throw err;
    }
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
      isSending: false,
      socketConnected: false,
      isSomeoneTyping: false,
      typingUserName: null,
      isParticipantOnline: false,
    });
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  getCurrentBookings: () => {
    const { bookingsByFilter, activeFilter } = get();
    return bookingsByFilter[activeFilter] || [];
  },
}));











// // src/store/tutorChatStore.js
// import { create } from "zustand";
// import useTutorAuthStore from "./tutorAuthStore";
// import { connectSocket, getSocket } from "@/lib/tutor-socket";

// const API_BASE = "https://fillops-server-5fuf.onrender.com";

// const mapBookingToUI = (booking) => ({
//   id: booking.id,
//   studentId: booking.userId || booking.user?.id,
//   participant_name: booking.user?.name || "Student",
//   participant_role: "student",
//   last_message: booking.lastMessage?.content || "",
//   last_message_time: booking.lastMessage?.createdAt || null,
//   status: (booking.status || "pending").toLowerCase(),
//   scheduledAt: booking.scheduledAt || null,
//   proposedAt: booking.proposedAt || null,
//   duration: booking.duration || null,
//   unread_count: booking.unreadCount || 0,
//   purpose: booking.purpose || "",
//   avatar: booking.user?.avatar || null,
//   isBooking: true,
// });

// export const useTutorChatStore = create((set, get) => ({
//   bookingsByFilter: {},
//   loadedFilters: new Set(),
//   activeFilter: "all",
//   selectedBooking: null,
//   messages: [],
//   isLoading: false,
//   isSending: false,
//   socketConnected: false,
//   isSomeoneTyping: false,
//   typingUserName: null,
//   isParticipantOnline: false,

//   // ────────────────────────────────────────────────────────────────
//   // Socket connection
//   // ────────────────────────────────────────────────────────────────
//   initializeSocket: () => {
//     console.log("[TutorChatStore] initializeSocket called");
    
//     const token = useTutorAuthStore.getState().accessToken;
//     if (!token) {
//       console.warn("[TutorChatStore] No token → cannot initialize socket");
//       return;
//     }

//     const socket = connectSocket(token);
//     set({ socketConnected: socket?.connected || false });
//   },

//   disconnectSocket: () => {
//     const socket = getSocket();
//     if (socket?.connected) {
//       socket.disconnect();
//     }
//     set({ socketConnected: false });
//   },

//   // ────────────────────────────────────────────────────────────────
//   // Socket event handlers (called by global listeners in socket.js)
//   // ────────────────────────────────────────────────────────────────
//   handleNewMessage: (msg) => {
//   console.log("📨 handleNewMessage called:", msg);
  
//   set((state) => {
//     // Prevent duplicate by ID
//     if (state.messages.some((m) => m.id === msg.id)) {
//       console.log("⚠️ Duplicate message (by ID) skipped:", msg.id);
//       return state;
//     }

//     const isCurrent = msg.bookingId === state.selectedBooking?.id;
//     let updatedMessages = [...state.messages];

//     // 1️⃣ Try to find optimistic message by tempId
//     let optimisticIndex = -1;
//     if (msg.tempId) {
//       optimisticIndex = updatedMessages.findIndex((m) => m.tempId === msg.tempId);
//       console.log("🔎 Searching for tempId:", msg.tempId, "→ Found at index:", optimisticIndex);
//     }

//     // 2️⃣ Fallback: match by content + sender + recent time (within 10 seconds)
//     if (optimisticIndex === -1 && msg.sender?.id && msg.content) {
//       const msgTime = new Date(msg.createdAt).getTime();
//       optimisticIndex = updatedMessages.findIndex((m) => 
//         m.isOptimistic === true &&
//         m.content === msg.content &&
//         m.sender?.id === msg.sender?.id &&
//         Math.abs(new Date(m.createdAt).getTime() - msgTime) < 10000
//       );
//       console.log("🔎 Fallback search by content+sender:", optimisticIndex);
//     }

//     if (optimisticIndex !== -1) {
//       console.log("✅ REPLACING optimistic message at index:", optimisticIndex);
//       updatedMessages[optimisticIndex] = {
//         ...msg,
//         tempId: undefined,
//         isOptimistic: false,
//         status: "sent",
//       };
//     } else {
//       console.log("➕ Adding new message (no optimistic found)");
//       updatedMessages.push({ ...msg, status: "sent" });
//     }

//     updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//     // Update sidebar unread count if not current chat
//     if (!isCurrent && msg.senderRole !== "tutor") {
//       const updatedFilters = { ...state.bookingsByFilter };
//       Object.keys(updatedFilters).forEach((filter) => {
//         updatedFilters[filter] = updatedFilters[filter]?.map((b) =>
//           b.id === msg.bookingId
//             ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
//             : b
//         );
//       });
//       return { messages: updatedMessages, bookingsByFilter: updatedFilters };
//     }

//     return { messages: updatedMessages };
//   });
// },

//   handleMessagesReadByStudent: (timestamp) => {
//     console.log("📖 Student read messages up to:", timestamp);
//     set((state) => ({
//       messages: state.messages.map((m) =>
//         m.senderRole === "tutor" && new Date(m.createdAt) <= new Date(timestamp)
//           ? { ...m, isRead: true }
//           : m
//       ),
//     }));
//   },

//   handleSessionEnded: (data) => {
//     console.log("🏁 Session ended:", data);
//     const { bookingId } = data;
//     set((state) => {
//       if (state.selectedBooking?.id !== bookingId) return state;
//       return {
//         selectedBooking: { ...state.selectedBooking, status: "completed" },
//       };
//     });
//   },

//   handleSessionKick: (data) => {
//     console.log("👢 Kicked from session:", data);
//     const socket = getSocket();
//     if (socket && data?.bookingId) {
//       socket.emit("leave:booking", data.bookingId);
//     }

//     set((state) => ({
//       selectedBooking: state.selectedBooking?.id === data?.bookingId ? null : state.selectedBooking,
//       messages: state.selectedBooking?.id === data?.bookingId ? [] : state.messages,
//     }));
//   },

//   handleSessionExpired: (data) => {
//     console.log("⏰ Session expired:", data);
//     const { bookingId } = data;
//     set((state) => {
//       if (state.selectedBooking?.id !== bookingId) return state;
//       return {
//         selectedBooking: { ...state.selectedBooking, status: "completed" },
//       };
//     });
//   },

//   handleOnlineUsers: (users) => {
//     console.log("👥 Online users:", users);
//     const studentId = get().selectedBooking?.studentId;
//     const isOnline = users?.some((u) => u.id === studentId && u.userType === "user");
//     set({ isParticipantOnline: !!isOnline });
//   },

//   handleNewBookingNotification: (data) => {
//     console.log("🔔 New booking notification:", data);
//     get().fetchBookings("pending", true);
//     get().fetchBookings("all", true);
//   },

//   handleBookingCancelled: (data) => {
//     console.log("❌ Booking cancelled:", data);
//     get().fetchBookings("cancelled", true);
//     get().fetchBookings("all", true);
//   },

//   handleBookingRescheduled: (data) => {
//     console.log("📅 Booking rescheduled:", data);
//     get().fetchBookings("rescheduled", true);
//     get().fetchBookings("all", true);
//   },

//   // ────────────────────────────────────────────────────────────────
//   // Core chat actions
//   // ────────────────────────────────────────────────────────────────
//   setSelectedBooking: (booking) => {
//     const prevId = get().selectedBooking?.id;
//     const socket = getSocket();

//     // Leave previous room
//     if (prevId && socket?.connected) {
//       socket.emit("leave:booking", prevId);
//     }

//     set({
//       selectedBooking: booking,
//       messages: [],
//       isLoading: true,
//       isSomeoneTyping: false,
//       typingUserName: null,
//       isParticipantOnline: false,
//     });

//     if (!booking?.id) return;

//     // Join new room
//     if (socket?.connected) {
//       socket.emit("join:booking", booking.id, (ack) => {
//         if (ack?.success) {
//           console.log("✅ Joined booking room:", booking.id);
//           get().markMessagesAsRead(booking.id);
//         } else {
//           console.error("❌ Failed to join room:", ack);
//         }
//       });
//     }

//     get().fetchMessages(booking.id);
//   },

//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     if (!content?.trim() || !bookingId) return;

//     const socket = getSocket();
//     if (!socket?.connected) {
//       console.warn("[sendMessage] Socket not connected");
//       return;
//     }

//     const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
//     const tutorId = useTutorAuthStore.getState().tutor?.id;

//     const optimisticMsg = {
//       tempId,
//       content,
//       messageType,
//       bookingId,
//       sender: { 
//         id: tutorId,
//         type: 'TUTOR',
//         name: useTutorAuthStore.getState().tutor?.name || 'You'
//       },
//       senderRole: "tutor",
//       createdAt: new Date().toISOString(),
//       status: "sending",
//       isOptimistic: true,
//     };

//     console.log("📤 Sending message with tempId:", tempId);

//     set((s) => ({
//       messages: [...s.messages, optimisticMsg],
//       isSending: true,
//     }));

//     try {
//       socket.emit("message:send", {
//         bookingId,
//         content: content.trim(),
//         messageType,
//         tempId,
//       });
      
//       console.log("✅ Message emitted to socket");
//     } catch (err) {
//       console.error("[sendMessage] failed:", err);
//       set((s) => ({
//         messages: s.messages.filter((m) => m.tempId !== tempId),
//       }));
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   sendTyping: (isTyping = true) => {
//     const { selectedBooking, socketConnected } = get();
//     if (!selectedBooking?.id || !socketConnected) return;

//     const socket = getSocket();
//     if (socket?.connected) {
//       const event = isTyping ? "typing:start" : "typing:stop";
//       socket.emit(event, selectedBooking.id);
//     }
//   },

//   markMessagesAsRead: (bookingId) => {
//     const socket = getSocket();
//     if (socket?.connected) {
//       socket.emit("messages:read", bookingId);
//     }

//     // Optimistic sidebar update
//     set((s) => ({
//       bookingsByFilter: {
//         ...s.bookingsByFilter,
//         [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map((b) =>
//           b.id === bookingId ? { ...b, unread_count: 0 } : b
//         ),
//       },
//     }));
//   },

//   // ────────────────────────────────────────────────────────────────
//   // REST API calls
//   // ────────────────────────────────────────────────────────────────
//   fetchMessages: async (bookingId) => {
//     console.log("[FETCH] Messages for booking:", bookingId);
//     set({ isLoading: true });

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

//       if (res.success && Array.isArray(res.data)) {
//         const sorted = [...res.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         set({ messages: sorted });
//         console.log(`[FETCH] Loaded ${sorted.length} messages`);
//       } else {
//         set({ messages: [] });
//       }
//     } catch (err) {
//       console.error("[FETCH] Messages failed:", err);
//       set({ messages: [] });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   fetchBookings: async (filter = "all", force = false) => {
//     if (!force && get().loadedFilters.has(filter)) {
//       console.log(`[fetchBookings] Using cached data for "${filter}"`);
//       return;
//     }

//     console.log("[fetchBookings] START", { filter, forced: force });
//     set({ isLoading: true });

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const shouldPaginate = filter === "all" || filter === "completed";

//       let allBookings = [];

//       if (shouldPaginate) {
//         let page = 1;
//         let hasMore = true;

//         while (hasMore) {
//           let url = `${API_BASE}/api/tutor/bookings`;
//           if (filter !== "all") {
//             const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//             url += `?status=${backendStatus}&page=${page}`;
//           } else {
//             url += `?page=${page}`;
//           }

//           const res = await fetchWithAuth(url);

//           if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//             allBookings = [...allBookings, ...res.data];
//             hasMore = res.data.length === 10;
//             page++;
//             if (page > 50) hasMore = false;
//           } else {
//             hasMore = false;
//           }
//         }

//         allBookings.sort((a, b) => {
//           const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
//           const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
//           return dateB - dateA;
//         });
//       } else {
//         let url = `${API_BASE}/api/tutor/bookings`;
//         if (filter !== "all") {
//           const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//           url += `?status=${backendStatus}`;
//         }
//         url += (url.includes("?") ? "&" : "?") + "limit=100";

//         const res = await fetchWithAuth(url);
//         if (res.success && Array.isArray(res.data)) {
//           allBookings = res.data;
//         }
//       }

//       const mapped = allBookings.map(mapBookingToUI);

//       set((state) => ({
//         bookingsByFilter: {
//           ...state.bookingsByFilter,
//           [filter]: mapped,
//         },
//         loadedFilters: new Set([...state.loadedFilters, filter]),
//       }));
//     } catch (err) {
//       console.error("[fetchBookings] FAILED:", err);
//       set((state) => ({
//         bookingsByFilter: { ...state.bookingsByFilter, [filter]: [] },
//       }));
//     } finally {
//       set({ isLoading: false });
//       console.log("[fetchBookings] END");
//     }
//   },

//   fetchBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const url = `${API_BASE}/api/tutor/bookings/${bookingId}`;
//       console.log("[fetchBooking] Fetching:", url);

//       const res = await fetchWithAuth(url);

//       if (res.success && res.data) {
//         const booking = mapBookingToUI(res.data);
//         console.log("[fetchBooking] Success:", booking.id);

//         set({ selectedBooking: booking });

//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? booking : b
//             );
//           });
//           return { bookingsByFilter: updatedFilters };
//         });

//         return booking;
//       } else {
//         console.warn("[fetchBooking] No data for ID:", bookingId);
//         return null;
//       }
//     } catch (err) {
//       console.error("[fetchBooking] FAILED:", err.message || err);
//       return null;
//     }
//   },

//   confirmMessage: async (messageId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => ({
//         messages: state.messages.map((m) =>
//           m.id === messageId ? { ...m, status: "confirmed" } : m
//         ),
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/messages/${messageId}/confirm`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         set((state) => ({
//           messages: state.messages.map((m) =>
//             m.id === messageId ? res.data : m
//           ),
//         }));
//         return res.data;
//       }
//       throw new Error("Confirm failed");
//     } catch (err) {
//       console.error("confirmMessage failed:", err);
//       const bookingId = get().selectedBooking?.id;
//       if (bookingId) await get().fetchMessages(bookingId);
//       throw err;
//     }
//   },

//   rejectMessage: async (messageId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => ({
//         messages: state.messages.map((m) =>
//           m.id === messageId ? { ...m, status: "rejected" } : m
//         ),
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/messages/${messageId}/reject`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         set((state) => ({
//           messages: state.messages.map((m) =>
//             m.id === messageId ? res.data : m
//           ),
//         }));
//         return res.data;
//       }
//       throw new Error("Reject failed");
//     } catch (err) {
//       console.error("rejectMessage failed:", err);
//       const bookingId = get().selectedBooking?.id;
//       if (bookingId) await get().fetchMessages(bookingId);
//       throw err;
//     }
//   },

//   proposeReschedule: async (bookingId, proposedAt) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       const proposedDateTime = new Date(proposedAt).toISOString();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "reschedule-proposed", proposedAt: proposedDateTime } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "reschedule-proposed", proposedAt: proposedDateTime }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ proposedAt: proposedDateTime }),
//         }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//           };
//         });
//         return res.data;
//       }

//       throw new Error(res.message || "Reschedule failed");
//     } catch (err) {
//       console.error("proposeReschedule failed:", err);
//       throw err;
//     }
//   },

//   acceptReschedule: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "confirmed" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "confirmed" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule/accept`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//           };
//         });
//         return res.data;
//       }

//       throw new Error("Accept reschedule failed");
//     } catch (err) {
//       console.error("acceptReschedule failed:", err);
//       throw err;
//     }
//   },

//   rejectReschedule: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "pending" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "pending" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule/reject`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ reason }),
//         }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//           };
//         });
//         return res.data;
//       }

//       throw new Error("Reject reschedule failed");
//     } catch (err) {
//       console.error("rejectReschedule failed:", err);
//       throw err;
//     }
//   },

//   confirmBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "confirmed" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "confirmed" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//           };
//         });
//         return res.data;
//       }

//       throw new Error("Confirm failed");
//     } catch (err) {
//       console.error("confirmBooking failed:", err);
//       throw err;
//     }
//   },

//   cancelBooking: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       if (!reason || !reason.trim()) {
//         throw new Error("Cancellation reason is required");
//       }

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "cancelled" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "cancelled" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
//         {
//           method: "POST",
//           body: JSON.stringify({ reason: reason.trim() }),
//         }
//       );

//       if (res.success) {
//         return true;
//       }

//       throw new Error(res.message || "Cancel failed");
//     } catch (err) {
//       console.error("cancelBooking failed:", err);
//       throw err;
//     }
//   },

//   endSession: async (bookingId, notes = "") => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "completed" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "completed" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
//         {
//           method: "POST",
//           body: JSON.stringify({ notes }),
//         }
//       );

//       if (res.success) {
//         return true;
//       }

//       throw new Error("End session failed");
//     } catch (err) {
//       console.error("endSession failed:", err);
//       throw err;
//     }
//   },

//   reset: () => {
//     get().disconnectSocket();
//     set({
//       bookingsByFilter: {},
//       loadedFilters: new Set(),
//       activeFilter: "all",
//       selectedBooking: null,
//       messages: [],
//       isLoading: false,
//       isSending: false,
//       socketConnected: false,
//       isSomeoneTyping: false,
//       typingUserName: null,
//       isParticipantOnline: false,
//     });
//   },

//   setActiveFilter: (filter) => set({ activeFilter: filter }),

//   getCurrentBookings: () => {
//     const { bookingsByFilter, activeFilter } = get();
//     return bookingsByFilter[activeFilter] || [];
//   },
// }));









// // src/store/tutorChatStore.js
// import { create } from "zustand";
// import useTutorAuthStore from "./tutorAuthStore";
// import { connectSocket, getSocket } from "@/lib/socket";

// const API_BASE = "https://fillops-server-5fuf.onrender.com";

// const mapBookingToUI = (booking) => ({
//   id: booking.id,
//   studentId: booking.userId || booking.user?.id,
//   participant_name: booking.user?.name || "Student",
//   participant_role: "student",
//   last_message: booking.lastMessage?.content || "",
//   last_message_time: booking.lastMessage?.createdAt || null,
//   status: (booking.status || "pending").toLowerCase(),
//   scheduledAt: booking.scheduledAt || null,
//   proposedAt: booking.proposedAt || null,
//   duration: booking.duration || null,
//   unread_count: booking.unreadCount || 0,
//   purpose: booking.purpose || "",
//   avatar: booking.user?.avatar || null,
//   isBooking: true,
// });

// export const useTutorChatStore = create((set, get) => ({
//   bookingsByFilter: {},
//   loadedFilters: new Set(),
//   activeFilter: "all",
//   selectedBooking: null,
//   messages: [],
//   isLoading: false,
//   isSending: false,
//   socketConnected: false,
//   isSomeoneTyping: false,
//   typingTimer: null,

//   initializeSocket: () => {
//     console.log("[TutorChatStore] initializeSocket called");

//     const token = useTutorAuthStore.getState().accessToken;
//     if (!token) {
//       console.warn("[SOCKET] No token → cannot initialize");
//       return;
//     }

//     let socket = getSocket();
//     if (!socket) {
//       console.log("[SOCKET] Creating new connection...");
//       socket = connectSocket(token);
//     }

//     if (socket.connected) {
//       console.log("[SOCKET] Already connected →", socket.id);
//       set({ socketConnected: true });
//       return;
//     }

//     socket.connect();

//     socket.on("connect", () => {
//       console.log("%c[SOCKET] CONNECTED", "background:#28a745;color:white;padding:4px 12px;");
//       set({ socketConnected: true });

//       const currentId = get().selectedBooking?.id;
//       if (currentId) {
//         console.log("[SOCKET] Re-joining room:", currentId);
//         socket.emit("join:booking", currentId, (ack) => {
//           if (ack?.success) {
//             console.log("%c[CHAT] ✓ Joined room OK", "background:#4CAF50;color:white;padding:6px;");
//             get().markMessagesAsRead(currentId);
//           } else {
//             console.error("[CHAT] Join failed:", ack);
//           }
//         });
//       }
//     });

//     socket.on("connect_error", (err) => {
//       console.error("[SOCKET] connect_error:", err.message);
//       set({ socketConnected: false });
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("[SOCKET] disconnected:", reason);
//       set({ socketConnected: false });
//     });

//     // ─── Receive new messages (backend uses "message:new") ─────────────────
//     socket.on("message:new", (msg) => {
//       console.log("%c[SOCKET] ← message:new", "background:#673ab7;color:white;padding:4px;", msg);

//       const state = get();
//       const isCurrent = msg.bookingId === state.selectedBooking?.id;

//       if (!isCurrent) {
//         if (msg.senderRole === "tutor") {
//           set((s) => ({
//             bookingsByFilter: {
//               ...s.bookingsByFilter,
//               [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map(b =>
//                 b.id === msg.bookingId
//                   ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
//                   : b
//               ),
//             },
//           }));
//         }
//         return;
//       }

//       set((s) => {
//         let updated = [...s.messages];

//         // Replace optimistic message using tempId
//         const optimisticIndex = updated.findIndex(m => m.tempId === msg.tempId);
//         if (optimisticIndex !== -1) {
//           updated[optimisticIndex] = {
//             ...msg,
//             tempId: undefined,
//             isOptimistic: false,
//             status: "sent",
//           };
//         } else if (!updated.some(m => m.id === msg.id)) {
//           updated.push({ ...msg, status: "sent" });
//         }

//         updated.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         return { messages: updated };
//       });
//     });

//     // ─── Typing (backend uses start/stop) ─────────────────
//     socket.on("typing:start", () => {
//       if (get().selectedBooking?.id) set({ isSomeoneTyping: true });
//     });

//     socket.on("typing:stop", () => {
//       set({ isSomeoneTyping: false });
//     });

//     // Dev logging
//     if (import.meta.env.DEV) {
//       socket.onAny((event, ...args) => {
//         if (/message|chat|msg|join|room|typing|session/i.test(event)) {
//           console.log(`%c🔥 ${event}`, 'background:#d81e5b;color:white;padding:6px;border-radius:4px;', ...args);
//         }
//       });
//     }
//   },

//   disconnectSocket: () => {
//     const socket = getSocket();
//     if (socket?.connected) socket.disconnect();
//     set({ socketConnected: false });
//   },

//   setSelectedBooking: (booking) => {
//     const prevId = get().selectedBooking?.id;
//     const socket = getSocket();

//     if (prevId && socket?.connected) {
//       socket.emit("leaveBooking", prevId);   // or "leave:booking" if backend changed
//     }

//     set({
//       selectedBooking: booking,
//       messages: [],
//       isLoading: true,
//       isSomeoneTyping: false,
//     });

//     if (!booking?.id) return;

//     get().fetchMessages(booking.id);
//   },

//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     if (!content?.trim() || !bookingId) return;

//     const socket = getSocket();
//     if (!socket?.connected) {
//       console.warn("[sendMessage] Socket not connected");
//       return;
//     }

//     const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

//     const optimisticMsg = {
//       tempId,
//       content,
//       messageType,
//       sender: { id: useTutorAuthStore.getState().tutor?.id },
//       senderRole: "tutor",
//       createdAt: new Date().toISOString(),
//       status: "sending",
//       isOptimistic: true,
//     };

//     set((s) => ({
//       messages: [...s.messages, optimisticMsg],
//       isSending: true,
//     }));

//     try {
//       socket.emit("message:send", {
//         bookingId,
//         content: content.trim(),
//         messageType,
//         tempId,
//       });
//     } catch (err) {
//       console.error("[sendMessage] failed:", err);
//       set((s) => ({
//         messages: s.messages.filter(m => m.tempId !== tempId),
//       }));
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   sendTyping: (isTyping = true) => {
//     const { selectedBooking, socketConnected } = get();
//     if (!selectedBooking?.id || !socketConnected) return;

//     const socket = getSocket();
//     if (socket?.connected) {
//       const event = isTyping ? "typing:start" : "typing:stop";
//       socket.emit(event, selectedBooking.id);
//     }
//   },

//   markMessagesAsRead: async (bookingId) => {
//     const socket = getSocket();
//     if (socket?.connected) {
//       socket.emit("messages:read", bookingId);
//     }

//     // Optimistic UI update
//     set((s) => ({
//       bookingsByFilter: {
//         ...s.bookingsByFilter,
//         [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map(b =>
//           b.id === bookingId ? { ...b, unread_count: 0 } : b
//         ),
//       },
//     }));
//   },
  
//   fetchMessages: async (bookingId) => {
//     console.log("[FETCH] Messages for booking:", bookingId);
//     set({ isLoading: true });

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

//       if (res.success && Array.isArray(res.data)) {
//         const sorted = [...res.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
//         set({ messages: sorted });
//         console.log(`[FETCH] Loaded ${sorted.length} messages`);
//       } else {
//         set({ messages: [] });
//       }
//     } catch (err) {
//       console.error("[FETCH] Messages failed:", err);
//       set({ messages: [] });
//     } finally {
//       set({ isLoading: false });
//     }
//   },


//   fetchBookings: async (filter = "all", force = false) => {
//     if (!force && get().loadedFilters.has(filter)) {
//       console.log(`[fetchBookings] Using already loaded data for "${filter}"`);
//       return;
//     }

//     console.log("[fetchBookings] START", { filter, forced: force });
//     set({ isLoading: true });

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const shouldPaginate = filter === "all" || filter === "completed";

//       let allBookings = [];

//       if (shouldPaginate) {
//         let page = 1;
//         let hasMore = true;

//         while (hasMore) {
//           let url = `${API_BASE}/api/tutor/bookings`;
//           if (filter !== "all") {
//             const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//             url += `?status=${backendStatus}&page=${page}`;
//           } else {
//             url += `?page=${page}`;
//           }

//           const res = await fetchWithAuth(url);

//           if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//             allBookings = [...allBookings, ...res.data];
//             hasMore = res.data.length === 10;
//             page++;
//             if (page > 50) hasMore = false;
//           } else {
//             hasMore = false;
//           }
//         }

//         allBookings.sort((a, b) => {
//           const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
//           const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
//           return dateB - dateA;
//         });
//       } else {
//         let url = `${API_BASE}/api/tutor/bookings`;
//         if (filter !== "all") {
//           const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//           url += `?status=${backendStatus}`;
//         }
//         url += (url.includes("?") ? "&" : "?") + "limit=100";

//         const res = await fetchWithAuth(url);
//         if (res.success && Array.isArray(res.data)) {
//           allBookings = res.data;
//         }
//       }

//       const mapped = allBookings.map(mapBookingToUI);

//       set((state) => ({
//         bookingsByFilter: {
//           ...state.bookingsByFilter,
//           [filter]: mapped,
//         },
//         loadedFilters: new Set([...state.loadedFilters, filter]),
//       }));
//     } catch (err) {
//       console.error("[fetchBookings] FAILED:", err);
//       set((state) => ({
//         bookingsByFilter: { ...state.bookingsByFilter, [filter]: [] },
//       }));
//     } finally {
//       set({ isLoading: false });
//       console.log("[fetchBookings] END");
//     }
//   },

//   fetchBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const url = `${API_BASE}/api/tutor/bookings/${bookingId}`;
//       console.log("[fetchBooking] Fetching:", url);

//       const res = await fetchWithAuth(url);

//       if (res.success && res.data) {
//         const booking = mapBookingToUI(res.data);
//         console.log("[fetchBooking] Success - setting selectedBooking:", booking.id);

//         set({ selectedBooking: booking });

//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? booking : b
//             );
//           });
//           return { bookingsByFilter: updatedFilters };
//         });

//         return booking;
//       } else {
//         console.warn("[fetchBooking] No data or failed for ID:", bookingId);
//         return null;
//       }
//     } catch (err) {
//       console.error("[fetchBooking] FAILED:", err.message || err);
//       return null;
//     }
//   },

//   confirmMessage: async (messageId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => ({
//         messages: state.messages.map((m) =>
//           m.id === messageId ? { ...m, status: "confirmed" } : m
//         ),
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/messages/${messageId}/confirm`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         set((state) => ({
//           messages: state.messages.map((m) =>
//             m.id === messageId ? res.data : m
//           ),
//         }));
//         return res.data;
//       }
//       throw new Error("Confirm failed");
//     } catch (err) {
//       console.error("confirmMessage failed:", err);
//       const bookingId = get().selectedBooking?.id;
//       if (bookingId) await get().fetchMessages(bookingId);
//       throw err;
//     }
//   },

//   rejectMessage: async (messageId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => ({
//         messages: state.messages.map((m) =>
//           m.id === messageId ? { ...m, status: "rejected" } : m
//         ),
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/messages/${messageId}/reject`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         set((state) => ({
//           messages: state.messages.map((m) =>
//             m.id === messageId ? res.data : m
//           ),
//         }));
//         return res.data;
//       }
//       throw new Error("Reject failed");
//     } catch (err) {
//       console.error("rejectMessage failed:", err);
//       const bookingId = get().selectedBooking?.id;
//       if (bookingId) await get().fetchMessages(bookingId);
//       throw err;
//     }
//   },

//   proposeReschedule: async (bookingId, proposedAt) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       console.log("[proposeReschedule] Proposing:", { bookingId, proposedAt });

//       const proposedDateTime = new Date(proposedAt).toISOString();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "reschedule-proposed", proposedAt: proposedDateTime } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "reschedule-proposed", proposedAt: proposedDateTime }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ proposedAt: proposedDateTime }),
//         }
//       );

//       console.log("[proposeReschedule] Response:", res);

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//           };
//         });
//         return res.data;
//       }

//       throw new Error(res.message || "Reschedule failed");
//     } catch (err) {
//       console.error("proposeReschedule failed:", err);
//       throw err;
//     }
//   },

//   acceptReschedule: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "confirmed" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "confirmed" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule/accept`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//           };
//         });
//         return res.data;
//       }

//       throw new Error("Accept reschedule failed");
//     } catch (err) {
//       console.error("acceptReschedule failed:", err);
//       throw err;
//     }
//   },

//   rejectReschedule: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "pending" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "pending" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule/reject`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ reason }),
//         }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//           };
//         });
//         return res.data;
//       }

//       throw new Error("Reject reschedule failed");
//     } catch (err) {
//       console.error("rejectReschedule failed:", err);
//       throw err;
//     }
//   },

//   confirmBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "confirmed" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "confirmed" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach((key) => {
//             updatedFilters[key] = updatedFilters[key].map((b) =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//           };
//         });
//         return res.data;
//       }

//       throw new Error("Confirm failed");
//     } catch (err) {
//       console.error("confirmBooking failed:", err);
//       throw err;
//     }
//   },

//   cancelBooking: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       console.log("[cancelBooking] Cancelling:", { bookingId, reason });

//       if (!reason || !reason.trim()) {
//         throw new Error("Cancellation reason is required");
//       }

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "cancelled" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "cancelled" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ reason: reason.trim() }),
//         }
//       );

//       console.log("[cancelBooking] Response:", res);

//       if (res.success) {
//         return true;
//       }

//       throw new Error(res.message || "Cancel failed");
//     } catch (err) {
//       console.error("cancelBooking failed:", err);
//       throw err;
//     }
//   },

//   endSession: async (bookingId, notes = "") => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set((state) => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach((key) => {
//           updatedFilters[key] = updatedFilters[key].map((b) =>
//             b.id === bookingId ? { ...b, status: "completed" } : b
//           );
//         });
//         return {
//           bookingsByFilter: updatedFilters,
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "completed" }
//               : state.selectedBooking,
//         };
//       });

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
//         {
//           method: "POST",
//           body: JSON.stringify({ notes }),
//         }
//       );

//       if (res.success) {
//         return true;
//       }

//       throw new Error("End session failed");
//     } catch (err) {
//       console.error("endSession failed:", err);
//       throw err;
//     }
//   },

//   reset: () => {
//     get().disconnectSocket();
//     set({
//       bookingsByFilter: {},
//       loadedFilters: new Set(),
//       activeFilter: "all",
//       selectedBooking: null,
//       messages: [],
//       isLoading: false,
//       isSending: false,
//       socketConnected: false,
//       isSomeoneTyping: false,
//     });
//   },

//   setActiveFilter: (filter) => set({ activeFilter: filter }),

//   getCurrentBookings: () => {
//     const { bookingsByFilter, activeFilter } = get();
//     return bookingsByFilter[activeFilter] || [];
//   },
// }));