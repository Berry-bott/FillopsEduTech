
import { create } from "zustand";
import useAuthStore from "./authStore";
import { connectUserSocket, getUserSocket } from "@/lib/userChatSocket";

const API_BASE = import.meta.env.VITE_BACKEND_URL;

// ── Helpers ────────────────────────────────────────────────────────────────────

const mapBookingToUI = (b) => ({
  id:               b.id,
  tutorId:          b.tutorId || b.tutor?.id,
  name:             b.tutor?.name || b.tutorName || "Tutor",
  participant_name: b.tutor?.name || b.tutorName || "Tutor",
  participant_role: "tutor",
  avatar:           b.tutor?.avatar || null,
  bio:              b.tutor?.bio || "",
  subjects:         b.tutor?.subjects || [],
  completedSessions:b.tutor?.completedSessions || 0,
  status:           (b.status || "pending").toLowerCase(),
  scheduledAt:      b.scheduledAt || null,
  proposedAt:       b.proposedAt  || null,
  duration:         b.duration    || null,
  purpose:          b.purpose     || "",
  subject:          b.subject?.name || "",
  last_message:     b.lastMessage?.content  || "",
  last_message_time:b.lastMessage?.createdAt || null,
  unread_count:     b.unreadCount || 0,
  rating:           b.rating   || null,
  feedback:         b.feedback || null,
  isBooking:        true,
  createdAt:        b.createdAt || null,
});

// Patch one booking across every buffer + selectedBooking in a single set()
const patchBooking = (state, bookingId, patch) => {
  const apply = (buf) =>
    buf ? buf.map((b) => (b.id === bookingId ? { ...b, ...patch } : b)) : buf;
  return {
    bookings:          apply(state.bookings),
    allBookings:       apply(state.allBookings),
    pendingBookings:   apply(state.pendingBookings),
    confirmedBookings: apply(state.confirmedBookings),
    activeBookings:    apply(state.activeBookings),
    completedBookings: apply(state.completedBookings),
    selectedBooking:
      state.selectedBooking?.id === bookingId
        ? { ...state.selectedBooking, ...patch }
        : state.selectedBooking,
  };
};

// ── Store ──────────────────────────────────────────────────────────────────────

export const useUserChatStore = create((set, get) => ({

  // ── State ────────────────────────────────────────────────────────────────────
  bookings:          [],   // what the active tab shows
  allBookings:       [],
  pendingBookings:   null,
  confirmedBookings: null,
  activeBookings:    null,
  completedBookings: null,

  selectedBooking:      null,
  messages:             [],
  tutors:               [],

  isLoading:            false,
  isSending:            false,
  socketConnected:      false,
  isSomeoneTyping:      false,
  typingUserName:       null,
  isParticipantOnline:  false,
  onlineTutors:         {},   // { [tutorId]: true }

  activeTab: "sessions",

  // cache flags — true = already fetched, don't re-fetch unless forced
  hasFetchedAll:       false,
  hasFetchedPending:   false,
  hasFetchedConfirmed: false,
  hasFetchedActive:    false,
  hasFetchedCompleted: false,
  hasFetchedTutors:    false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  // ── Socket setup ─────────────────────────────────────────────────────────────

  initializeSocket: () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) { console.warn("[UserSocket] no token"); return; }
    const socket = connectUserSocket(token);
    set({ socketConnected: socket?.connected || false });
  },

  disconnectSocket: () => {
    const s = getUserSocket();
    if (s?.connected) s.disconnect();
    set({ socketConnected: false });
  },

  // Wire every socket event. Call once after initializeSocket(). Returns cleanup fn.
  initializeListeners: () => {
    const socket = getUserSocket();
    if (!socket) return () => {};

    const handlers = {};
    const on = (event, fn) => {
      handlers[event] = fn;
      socket.on(event, fn);
    };

    // ── connect / disconnect ─────────────────────────────────────────────────
    on("connect", () => {
      console.log("[UserSocket] connected", socket.id);
      set({ socketConnected: true });
      socket.emit("getOnlineUsers");
      const { selectedBooking } = get();
      if (selectedBooking?.id && selectedBooking.isBooking) {
        socket.emit("join:booking", selectedBooking.id, (ack) => {
          if (ack?.success) get().markMessagesAsRead(selectedBooking.id);
        });
      }
    });

    on("disconnect", () => {
      console.log("[UserSocket] disconnected");
      set({ socketConnected: false, isParticipantOnline: false });
    });

    // ── messages ─────────────────────────────────────────────────────────────
    on("message:new",   (msg) => get()._onNewMessage(msg));
    on("messages:read", (ts)  => get()._onMessagesRead(ts));

    // ── typing ───────────────────────────────────────────────────────────────
    on("typing:start", (data) => {
      if (data?.bookingId !== get().selectedBooking?.id) return;
      if (data.userType === "user") return;
      set({ isSomeoneTyping: true, typingUserName: data.userName || "Tutor" });
    });
    on("typing:stop", (data) => {
      if (data?.bookingId !== get().selectedBooking?.id) return;
      set({ isSomeoneTyping: false, typingUserName: null });
    });

    // ── online presence ──────────────────────────────────────────────────────
    on("users:online", (users) => get()._onOnlineUsers(users));
    on("onlineUsers",  (users) => get()._onOnlineUsers(users));

    on("user:online", (data) => {
      if (data?.userType !== "tutor") return;
      set((s) => ({
        onlineTutors: { ...s.onlineTutors, [data.userId]: true },
        isParticipantOnline:
          s.selectedBooking?.tutorId === data.userId ? true : s.isParticipantOnline,
      }));
    });
    on("user:offline", (data) => {
      if (data?.userType !== "tutor") return;
      set((s) => {
        const { [data.userId]: _removed, ...rest } = s.onlineTutors;
        return {
          onlineTutors: rest,
          isParticipantOnline:
            s.selectedBooking?.tutorId === data.userId ? false : s.isParticipantOnline,
        };
      });
    });

    // ── booking status changes — INSTANT UI UPDATE, no refetch ───────────────
    on("booking:confirmed", (data) => {
      const bookingId = data.bookingId || data.id;
      const { bookings, selectedBooking } = get();
      console.log("🟢 [Socket] booking:confirmed", {
        bookingId,
        raw: data,
        foundInBookings: bookings.some((b) => b.id === bookingId),
        isSelected: selectedBooking?.id === bookingId,
        currentStatus: bookings.find((b) => b.id === bookingId)?.status,
      });
      set((s) => ({
        ...patchBooking(s, bookingId, { status: "confirmed" }),
        activeTab:
          s.selectedBooking?.id === bookingId && s.activeTab === "pending"
            ? "confirmed"
            : s.activeTab,
      }));
      console.log("🟢 [Socket] booking:confirmed — after patch status:", get().bookings.find((b) => b.id === bookingId)?.status);
    });

    on("booking:active", (data) => {
      const bookingId = data.bookingId || data.id;
      const { bookings, selectedBooking } = get();
      console.log("🔵 [Socket] booking:active", {
        bookingId,
        raw: data,
        foundInBookings: bookings.some((b) => b.id === bookingId),
        isSelected: selectedBooking?.id === bookingId,
        currentStatus: bookings.find((b) => b.id === bookingId)?.status,
      });
      set((s) => ({
        ...patchBooking(s, bookingId, { status: "active" }),
        activeTab:
          s.selectedBooking?.id === bookingId &&
          ["pending", "confirmed"].includes(s.activeTab)
            ? "active"
            : s.activeTab,
      }));
      console.log("🔵 [Socket] booking:active — after patch status:", get().bookings.find((b) => b.id === bookingId)?.status);
    });

    on("booking:cancelled", (data) => {
      const bookingId = data.bookingId || data.id;
      console.log("🔴 [Socket] booking:cancelled", { bookingId, raw: data });
      set((s) => patchBooking(s, bookingId, { status: "cancelled" }));
    });

    on("booking:completed", (data) => {
      const bookingId = data.bookingId || data.id;
      console.log("⚫ [Socket] booking:completed", { bookingId, raw: data });
      set((s) => patchBooking(s, bookingId, { status: "completed" }));
    });

    on("booking:rescheduled", (data) => {
      const bookingId = data.bookingId || data.id;
      console.log("🟣 [Socket] booking:rescheduled", { bookingId, raw: data });
      set((s) =>
        patchBooking(s, bookingId, {
          status:     "reschedule-proposed",
          proposedAt: data.proposedAt,
        })
      );
    });

    on("booking:reschedule_proposed", (data) => {
      const bookingId = data.bookingId || data.id;
      console.log("🟣 [Socket] booking:reschedule_proposed", { bookingId, raw: data });
      set((s) =>
        patchBooking(s, bookingId, {
          status:     "reschedule-proposed",
          proposedAt: data.proposedAt,
        })
      );
    });

    on("booking:new", () => {
      // New booking created — force refetch of all/pending lists
      get().forceRefetchAll();
    });

    on("booking:updated", (data) => {
      const bookingId = data.bookingId || data.id;
      get().fetchOneBooking(bookingId);
    });

    // ── session events ────────────────────────────────────────────────────────
    on("session:ended", (data) => {
      console.log("[Socket] session:ended", data);
      const bookingId = data.bookingId || data.id;
      set((s) => patchBooking(s, bookingId, { status: "completed" }));
    });

    on("session:expired", (data) => {
      const bookingId = data.bookingId || data.id;
      set((s) => patchBooking(s, bookingId, { status: "completed" }));
    });

    on("session:kick", (data) => {
      const bookingId = data.bookingId || data.id;
      const sock = getUserSocket();
      if (sock) sock.emit("leave:booking", bookingId);
      set((s) => ({
        ...patchBooking(s, bookingId, { status: "completed" }),
        selectedBooking: s.selectedBooking?.id === bookingId ? null : s.selectedBooking,
        messages:        s.selectedBooking?.id === bookingId ? []   : s.messages,
      }));
    });

    // return cleanup
    return () => {
      Object.entries(handlers).forEach(([event, fn]) => socket.off(event, fn));
    };
  },

  // ── Internal socket handlers ─────────────────────────────────────────────────

  _onOnlineUsers: (users) => {
    if (!Array.isArray(users)) return;
    const onlineTutors = {};
    users.forEach((u) => {
      if (u.userType === "tutor" || u.userType === "TUTOR") onlineTutors[u.id] = true;
    });
    set((s) => ({
      onlineTutors,
      isParticipantOnline: s.selectedBooking?.tutorId
        ? !!onlineTutors[s.selectedBooking.tutorId]
        : false,
    }));
  },

  _onNewMessage: (msg) => {
    set((state) => {
      if (state.messages.some((m) => m.id === msg.id)) return state;

      const isCurrent = msg.bookingId === state.selectedBooking?.id;
      let msgs = [...state.messages];

      // replace optimistic placeholder
      let idx = msg.tempId ? msgs.findIndex((m) => m.tempId === msg.tempId) : -1;
      if (idx === -1 && msg.sender?.id) {
        const t = new Date(msg.createdAt).getTime();
        idx = msgs.findIndex(
          (m) =>
            m.isOptimistic &&
            m.content === msg.content &&
            m.sender?.id === msg.sender?.id &&
            Math.abs(new Date(m.createdAt).getTime() - t) < 10_000
        );
      }
      if (idx !== -1) {
        msgs[idx] = { ...msg, tempId: undefined, isOptimistic: false, status: "sent" };
      } else {
        msgs.push({ ...msg, status: "sent" });
      }
      msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      // update sidebar preview + unread badge in every buffer
      const updateBuf = (buf) =>
        buf?.map((b) =>
          b.id === msg.bookingId
            ? {
                ...b,
                last_message:      msg.content,
                last_message_time: msg.createdAt,
                unread_count: isCurrent ? 0 : (b.unread_count || 0) + 1,
              }
            : b
        ) ?? buf;

      return {
        messages:          msgs,
        bookings:          updateBuf(state.bookings),
        allBookings:       updateBuf(state.allBookings),
        pendingBookings:   updateBuf(state.pendingBookings),
        confirmedBookings: updateBuf(state.confirmedBookings),
        activeBookings:    updateBuf(state.activeBookings),
        completedBookings: updateBuf(state.completedBookings),
      };
    });
  },

  _onMessagesRead: (timestamp) => {
    set((s) => ({
      messages: s.messages.map((m) =>
        m.senderRole === "user" && new Date(m.createdAt) <= new Date(timestamp)
          ? { ...m, isRead: true }
          : m
      ),
    }));
  },

  // ── Core actions ─────────────────────────────────────────────────────────────

  setSelectedBooking: (booking) => {
    const prevId = get().selectedBooking?.id;
    const socket = getUserSocket();

    // leave previous room
    if (prevId && socket?.connected) socket.emit("leave:booking", prevId);

    set({
      selectedBooking:     booking,
      messages:            [],
      isLoading:           !!booking?.isBooking,
      isSomeoneTyping:     false,
      typingUserName:      null,
      isParticipantOnline: booking?.tutorId
        ? !!get().onlineTutors[booking.tutorId]
        : false,
    });

    // tutor profile — no socket join, no message fetch
    if (!booking?.id || !booking?.isBooking) return;

    if (socket?.connected) {
      socket.emit("join:booking", booking.id, (ack) => {
        if (ack?.success) get().markMessagesAsRead(booking.id);
        else console.error("[join:booking] denied:", ack);
      });
    }

    get().fetchMessages(booking.id);
  },

  sendMessage: async (bookingId, content, messageType = "TEXT") => {
    if (!content?.trim() || !bookingId) return;

    let socket = getUserSocket();
    if (!socket?.connected) {
      get().initializeSocket();
      await new Promise((resolve) => {
        const iv = setInterval(() => {
          if (getUserSocket()?.connected) { clearInterval(iv); resolve(); }
        }, 100);
        setTimeout(() => { clearInterval(iv); resolve(); }, 3000);
      });
      socket = getUserSocket();
      if (!socket?.connected) throw new Error("Cannot connect to chat server. Please refresh.");
    }

    const tempId   = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const userId   = useAuthStore.getState().user?.id;
    const userName = useAuthStore.getState().user?.name || "You";

    set((s) => ({
      messages: [
        ...s.messages,
        {
          tempId, content, messageType, bookingId,
          sender:     { id: userId, type: "USER", name: userName },
          senderRole: "user",
          createdAt:  new Date().toISOString(),
          status:     "sending",
          isOptimistic: true,
        },
      ],
      isSending: true,
    }));

    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Send timeout")), 10_000);
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
    const { selectedBooking } = get();
    if (!selectedBooking?.id) return;
    const socket = getUserSocket();
    if (!socket?.connected) return;
    socket.emit(isTyping ? "typing:start" : "typing:stop", {
      bookingId: selectedBooking.id,
      userType:  "user",
      userName:  useAuthStore.getState().user?.name || "User",
    });
  },

  markMessagesAsRead: (bookingId) => {
    const socket = getUserSocket();
    if (socket?.connected) socket.emit("messages:read", bookingId);
    const clr = (buf) =>
      buf?.map((b) => (b.id === bookingId ? { ...b, unread_count: 0 } : b)) ?? buf;
    set((s) => ({
      bookings:          clr(s.bookings),
      allBookings:       clr(s.allBookings),
      pendingBookings:   clr(s.pendingBookings),
      confirmedBookings: clr(s.confirmedBookings),
      activeBookings:    clr(s.activeBookings),
      completedBookings: clr(s.completedBookings),
    }));
  },

  // ── REST ─────────────────────────────────────────────────────────────────────

  fetchMessages: async (bookingId) => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`);
      if (res.success && Array.isArray(res.data)) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
        );
        if (get().selectedBooking?.id === bookingId)
          set({ messages: sorted, isLoading: false });
        return sorted;
      }
      set({ messages: [], isLoading: false });
      return [];
    } catch (err) {
      console.error("[fetchMessages]", err);
      set({ messages: [], isLoading: false });
      return [];
    }
  },

  // Fetch bookings for a specific status. Uses cache unless forced.
  fetchBookingsByStatus: async (status = "", force = false) => {
    const s = status.toLowerCase();

    const map = {
      "":          { bufKey: "allBookings",       flagKey: "hasFetchedAll",       buf: () => get().allBookings,       flag: () => get().hasFetchedAll },
      "pending":   { bufKey: "pendingBookings",   flagKey: "hasFetchedPending",   buf: () => get().pendingBookings,   flag: () => get().hasFetchedPending },
      "confirmed": { bufKey: "confirmedBookings", flagKey: "hasFetchedConfirmed", buf: () => get().confirmedBookings, flag: () => get().hasFetchedConfirmed },
      "active":    { bufKey: "activeBookings",    flagKey: "hasFetchedActive",    buf: () => get().activeBookings,    flag: () => get().hasFetchedActive },
      "completed": { bufKey: "completedBookings", flagKey: "hasFetchedCompleted", buf: () => get().completedBookings, flag: () => get().hasFetchedCompleted },
    };
    const entry = map[s] ?? map[""];

    // serve from cache
    if (!force && entry.flag() && entry.buf() !== null) {
      set({ bookings: entry.buf(), isLoading: false });
      return;
    }

    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      let url = `${API_BASE}/api/users/bookings?limit=50`;
      if (s) url += `&status=${s.toUpperCase()}`;

      const res = await fetchWithAuth(url);
      if (!res?.success || !Array.isArray(res.data)) {
        set({ bookings: [], isLoading: false });
        return;
      }

      const sorted = res.data
        .map(mapBookingToUI)
        .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

      set({
        bookings:         sorted,
        [entry.bufKey]:   sorted,
        [entry.flagKey]:  true,
        isLoading:        false,
      });
    } catch (err) {
      console.error("[fetchBookingsByStatus]", err);
      set({ bookings: [], isLoading: false });
    }
  },

  // Main entry point used by components
  fetchBookings: async (forceRefresh = false, { status = "" } = {}) => {
    if (forceRefresh) get()._clearCache();
    return get().fetchBookingsByStatus(status, forceRefresh);
  },

  // Fetch a single booking and update all buffers with fresh data
  fetchOneBooking: async (bookingId) => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}`);
      if (res.success && res.data) {
        const booking = mapBookingToUI(res.data);
        set((s) => patchBooking(s, bookingId, booking));
        return booking;
      }
      return null;
    } catch (err) {
      console.error("[fetchOneBooking]", err);
      return null;
    }
  },

  fetchTutors: async () => {
    if (get().hasFetchedTutors && get().tutors.length > 0) return;
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/tutors`);
      if (!res?.success || !Array.isArray(res.data)) {
        set({ tutors: [], isLoading: false });
        return;
      }
      const mapped = res.data.map((t) => ({
        id:                t.id || t._id,
        name:              t.name || "Unknown Tutor",
        participant_name:  t.name || "Unknown Tutor",
        participant_role:  "tutor",
        avatar:            t.avatar || null,
        bio:               t.bio || "",
        subjects:          t.subjects || [],
        completedSessions: t.completedSessions || 0,
        rating:            t.rating || null,
        isTutor:           true,
        isBooking:         false,
        last_message:      "",
        last_message_time: null,
        status:            "available",
        unread_count:      0,
      }));
      set({ tutors: mapped, hasFetchedTutors: true, isLoading: false });
    } catch (err) {
      console.error("[fetchTutors]", err);
      set({ tutors: [], isLoading: false });
    }
  },

  // ── Booking actions ───────────────────────────────────────────────────────────

  createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
        method: "POST",
        body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
      });
      if (res.success && res.data) {
        const booking = mapBookingToUI(res.data);
        set((s) => ({
          bookings:       [booking, ...s.bookings],
          allBookings:    [booking, ...s.allBookings],
          pendingBookings: s.pendingBookings ? [booking, ...s.pendingBookings] : [booking],
          selectedBooking: booking,
          tutors:          s.tutors.filter((t) => t.id !== tutorId),
          isLoading:       false,
        }));
        return booking;
      }
      throw new Error(res.message || "Failed to create booking");
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  cancelBooking: async (bookingId, reason) => {
    if (!reason?.trim()) throw new Error("Cancellation reason is required");
    // optimistic
    set((s) => patchBooking(s, bookingId, { status: "cancelled" }));
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/cancel`, {
        method: "PATCH",
        body:   JSON.stringify({ reason: reason.trim() }),
      });
      if (res.success) return true;
      throw new Error(res.message || "Cancel failed");
    } catch (err) {
      // revert
      get().fetchOneBooking(bookingId);
      throw err;
    }
  },

  rescheduleBooking: async (bookingId, scheduledAt, duration) => {
    // optimistic
    set((s) =>
      patchBooking(s, bookingId, {
        status:     "reschedule-proposed",
        proposedAt: new Date(scheduledAt).toISOString(),
        duration,
      })
    );
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/reschedule`, {
        method: "PATCH",
        body:   JSON.stringify({ scheduledAt: new Date(scheduledAt).toISOString(), duration }),
      });
      if (res.success && res.data) {
        set((s) => patchBooking(s, bookingId, mapBookingToUI(res.data)));
        return res.data;
      }
      throw new Error(res.message || "Reschedule failed");
    } catch (err) {
      get().fetchOneBooking(bookingId);
      throw err;
    }
  },

  acceptReschedule: async (bookingId) => {
    set((s) => patchBooking(s, bookingId, { status: "confirmed" }));
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/users/bookings/${bookingId}/reschedule/accept`,
        { method: "PATCH" }
      );
      if (res.success && res.data) {
        set((s) => patchBooking(s, bookingId, mapBookingToUI(res.data)));
        return res.data;
      }
      throw new Error("Accept failed");
    } catch (err) {
      get().fetchOneBooking(bookingId);
      throw err;
    }
  },

  rejectReschedule: async (bookingId, reason) => {
    set((s) => patchBooking(s, bookingId, { status: "pending" }));
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/users/bookings/${bookingId}/reschedule/reject`,
        { method: "PATCH", body: JSON.stringify({ reason }) }
      );
      if (res.success && res.data) {
        set((s) => patchBooking(s, bookingId, mapBookingToUI(res.data)));
        return res.data;
      }
      throw new Error("Reject failed");
    } catch (err) {
      get().fetchOneBooking(bookingId);
      throw err;
    }
  },

  rateSession: async (bookingId, rating, feedback) => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/rate`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ rating, feedback }),
      });
      if (res.success) {
        set((s) => patchBooking(s, bookingId, { rating, feedback }));
        return { success: true, message: res.message || "Thank you for your feedback!" };
      }
      throw new Error(res.message || "Rating failed");
    } catch (err) {
      console.error("[rateSession]", err);
      throw err;
    }
  },

  // ── Utilities ────────────────────────────────────────────────────────────────

  // Force-clear all caches so next fetchBookings does a real request
  forceRefetchAll: () => {
    get()._clearCache();
    get().fetchBookingsByStatus("", true);
  },

  _clearCache: () => {
    set({
      hasFetchedAll: false, hasFetchedPending: false,
      hasFetchedConfirmed: false, hasFetchedActive: false, hasFetchedCompleted: false,
      allBookings: [], pendingBookings: null, confirmedBookings: null,
      activeBookings: null, completedBookings: null,
    });
  },

  reset: () => {
    get().disconnectSocket();
    set({
      bookings: [], allBookings: [], pendingBookings: null,
      confirmedBookings: null, activeBookings: null, completedBookings: null,
      selectedBooking: null, messages: [], tutors: [],
      isLoading: false, isSending: false,
      socketConnected: false, isSomeoneTyping: false,
      typingUserName: null, isParticipantOnline: false,
      onlineTutors: {}, activeTab: "sessions",
      hasFetchedAll: false, hasFetchedPending: false,
      hasFetchedConfirmed: false, hasFetchedActive: false,
      hasFetchedCompleted: false, hasFetchedTutors: false,
    });
  },
}));
