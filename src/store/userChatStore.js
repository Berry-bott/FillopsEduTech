



// // import { create } from "zustand";
// // import useAuthStore from "./authStore";
// // import { io } from "socket.io-client";

// // const API_BASE = "https://fillops-server-5fuf.onrender.com";
// // let socket = null;

// // export const useUserChatStore = create((set, get) => ({
// //   // ─── Core States ────────────────────────────────────────────
// //   tutors: [],
// //   bookings: [],
// //   selectedBooking: null,
// //   messages: [],
// //   isLoading: false,
// //   isSending: false,
// //   error: null,
// //   socketConnected: false,

// //   // ─── Socket Connection Management ───────────────────────────
// //   connectSocket: () => {
// //     if (socket?.connected) return;

// //     const token = useAuthStore.getState().accessToken;
// //     if (!token) {
// //       console.warn("[UserSocket] No token available → cannot connect");
// //       return;
// //     }

// //     socket = io(API_BASE, {
// //       auth: { token },
// //       autoConnect: false,
// //       transports: ["websocket"],
// //       reconnection: true,
// //       reconnectionAttempts: 5,
// //     });

// //     socket.connect();

// //     socket.on("connect", () => {
// //       console.log("[UserSocket] Connected successfully");
// //       set({ socketConnected: true });
// //     });

// //     socket.on("connect_error", (err) => {
// //       console.error("[UserSocket] Connection error:", err.message);
// //       set({ socketConnected: false });
// //     });

// //     socket.on("disconnect", (reason) => {
// //       console.log("[UserSocket] Disconnected:", reason);
// //       set({ socketConnected: false });
// //     });

// //     // ─── Real-time incoming messages ────────────────────────────
// //     socket.on("newMessage", (message) => {
// //       const { selectedBooking } = get();

// //       // Add to current chat if viewing that booking
// //       if (message.bookingId === selectedBooking?.id) {
// //         set((state) => ({
// //           messages: [...state.messages, message],
// //         }));
// //       }

// //       // Update preview in booking list + unread count
// //       set((state) => ({
// //         bookings: state.bookings.map((b) =>
// //           b.id === message.bookingId
// //             ? {
// //                 ...b,
// //                 last_message: message.content,
// //                 last_message_time: message.createdAt,
// //                 unread_count: (b.unread_count || 0) + 1,
// //               }
// //             : b
// //         ),
// //       }));
// //     });

// //     // ─── Message confirmation / rejection ───────────────────────
// //     socket.on("messageConfirmed", ({ tempId, message }) => {
// //       set((state) => ({
// //         messages: state.messages.map((m) =>
// //           m.tempId === tempId ? { ...message, tempId: undefined, isSending: false } : m
// //         ),
// //       }));
// //     });

// //     socket.on("messageError", ({ tempId, error }) => {
// //       set((state) => ({
// //         messages: state.messages.filter((m) => m.tempId !== tempId),
// //         error: error || "Failed to send message",
// //       }));
// //     });
// //   },

// //   disconnectSocket: () => {
// //     if (socket) {
// //       socket.disconnect();
// //       socket = null;
// //       set({ socketConnected: false });
// //       console.log("[UserSocket] Manually disconnected");
// //     }
// //   },

// //   // ─── Send Message (Socket-first, HTTP fallback) ─────────────
// //   sendMessage: async (bookingId, content) => {
// //     if (!bookingId || !content?.trim()) {
// //       console.warn("[sendMessage] Missing bookingId or content");
// //       return;
// //     }

// //     const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

// //     const optimisticMsg = {
// //       tempId,
// //       bookingId,
// //       content,
// //       sender: {
// //         id: useAuthStore.getState().user?.id,
// //         name: useAuthStore.getState().user?.name || "You",
// //         type: "USER",
// //       },
// //       createdAt: new Date().toISOString(),
// //       isSending: true,
// //     };

// //     set((state) => ({
// //       messages: [...state.messages, optimisticMsg],
// //       isSending: true,
// //       error: null,
// //     }));

// //     // Ensure socket is connected
// //     if (!socket?.connected) {
// //       get().connectSocket();
// //       await new Promise((resolve) => setTimeout(resolve, 1200)); // small grace period
// //     }

// //     if (socket?.connected) {
// //       console.log("[UserSocket] Sending message:", { bookingId, tempId });
// //       socket.emit("sendMessage", {
// //         bookingId,
// //         content: content.trim(),
// //         messageType: "TEXT",
// //         tempId,
// //       });
// //     } else {
// //       console.warn("[UserSocket] Socket not ready → using HTTP fallback");
// //       try {
// //         const { fetchWithAuth } = useAuthStore.getState();
// //         const res = await fetchWithAuth(
// //           `${API_BASE}/api/users/bookings/${bookingId}/messages`,
// //           {
// //             method: "POST",
// //             body: JSON.stringify({ content: content.trim(), messageType: "TEXT" }),
// //           }
// //         );

// //         if (res.success && res.data) {
// //           set((state) => ({
// //             messages: state.messages.map((m) =>
// //               m.tempId === tempId ? { ...res.data, isSending: false } : m
// //             ),
// //           }));
// //         } else {
// //           throw new Error(res.message || "HTTP send failed");
// //         }
// //       } catch (err) {
// //         set((state) => ({
// //           messages: state.messages.filter((m) => m.tempId !== tempId),
// //           error: err.message || "Failed to send message",
// //         }));
// //       }
// //     }

// //     set({ isSending: false });
// //   },

// //   // ─── Core Data Fetching ─────────────────────────────────────
// //   fetchTutors: async ({ search, category } = {}) => {
// //     set({ isLoading: true, error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       let url = `${API_BASE}/api/users/tutors`;
// //       const params = new URLSearchParams();
// //       if (search) params.append("search", search);
// //       if (category) params.append("category", category);
// //       if (params.toString()) url += `?${params.toString()}`;

// //       const res = await fetchWithAuth(url);

// //       if (!res?.success || !Array.isArray(res.data)) {
// //         console.warn("[fetchTutors] Invalid response", res);
// //         set({ tutors: [], isLoading: false });
// //         return;
// //       }

// //       const tutors = res.data.map((t) => ({
// //         id: t.id || t._id,
// //         name: t.name || "Unknown Tutor",
// //         participant_name: t.name || "Unknown Tutor",
// //         participant_role: "tutor",
// //         avatar: t.avatar || null,
// //         bio: t.bio || "",
// //         subjects: t.subjects || [],
// //         completedSessions: t.completedSessions || 0,
// //         rating: t.rating || null,
// //         isTutor: true,
// //         last_message: "",
// //         last_message_time: null,
// //         status: "available",
// //         unread_count: 0,
// //       }));

// //       set({ tutors, isLoading: false });
// //       console.log(`[fetchTutors] Loaded ${tutors.length} tutors`);
// //     } catch (err) {
// //       console.error("[fetchTutors] Error:", err);
// //       set({ tutors: [], isLoading: false, error: err.message });
// //     }
// //   },

// //   fetchBookings: async ({ status = "", page = 1, limit = 100 } = {}) => {
// //     set({ isLoading: true, error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       let url = `${API_BASE}/api/users/bookings?limit=${limit}`;
// //       if (status) url += `&status=${status.toUpperCase()}`;
// //       if (page > 1) url += `&page=${page}`;

// //       const res = await fetchWithAuth(url);

// //       if (!res?.success || !Array.isArray(res.data)) {
// //         console.warn("[fetchBookings] Invalid response", res);
// //         set({ bookings: [], isLoading: false });
// //         return;
// //       }

// //       const bookings = res.data.map((b) => ({
// //         id: b.id,
// //         name: b.tutor?.name || "Unknown",
// //         tutorId: b.tutorId || b.tutor?.id,
// //         participant_name: b.tutor?.name || "Unknown",
// //         participant_role: "tutor",
// //         avatar: b.tutor?.avatar || null,
// //         bio: b.tutor?.bio || "",
// //         subjects: b.tutor?.subjects || [],
// //         completedSessions: b.tutor?.completedSessions || 0,
// //         rating: b.rating || null,
// //         status: b.status?.toLowerCase() || "pending",
// //         scheduledAt: b.scheduledAt || null,
// //         duration: b.duration || null,
// //         purpose: b.purpose || "",
// //         last_message: b.lastMessage?.content || "",
// //         last_message_time: b.lastMessage?.createdAt || null,
// //         unread_count: b.unreadCount || 0,
// //         isBooking: true,
// //       }));

// //       set((state) => {
// //         let newSelected = state.selectedBooking;
// //         if (newSelected?.isBooking) {
// //           newSelected = bookings.find((b) => b.id === newSelected.id) || newSelected;
// //         }
// //         return { bookings, selectedBooking: newSelected, isLoading: false };
// //       });

// //       console.log(`[fetchBookings] Loaded ${bookings.length} bookings`);
// //     } catch (err) {
// //       console.error("[fetchBookings] Error:", err);
// //       set({ bookings: [], isLoading: false, error: err.message });
// //     }
// //   },

// //   fetchMessages: async (bookingId) => {
// //     if (!bookingId) return;

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`);

// //       if (res.success && Array.isArray(res.data)) {
// //         set({ messages: res.data });
// //         console.log(`[fetchMessages] Loaded ${res.data.length} messages for ${bookingId}`);
// //       } else {
// //         set({ messages: [] });
// //       }
// //     } catch (err) {
// //       console.error("[fetchMessages] Error:", err);
// //       set({ messages: [] });
// //     }
// //   },

// //   // ─── Booking Actions (HTTP) ─────────────────────────────────
// //   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
// //         method: "POST",
// //         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
// //       });

// //       if (res.success && res.data) {
// //         const newBooking = {
// //           ...res.data,
// //           participant_name: res.data.tutor?.name || "Unknown",
// //           participant_role: "tutor",
// //           isBooking: true,
// //         };

// //         set((state) => ({
// //           bookings: [...state.bookings, newBooking],
// //           tutors: state.tutors.filter((t) => t.id !== tutorId),
// //           selectedBooking: newBooking,
// //           isLoading: false,
// //         }));

// //         return newBooking;
// //       }
// //       throw new Error(res.message || "Failed to create booking");
// //     } catch (err) {
// //       set({ isLoading: false, error: err.message });
// //       throw err;
// //     }
// //   },

// //   // ... (keep your other HTTP actions: confirmBooking, cancelBooking, startChat, endChat, rateSession ...)
  
// //   // ---------------- CONFIRM BOOKING ----------------
// //   confirmBooking: async (bookingId) => {
// //     console.log("[confirmBooking] START - ID:", bookingId);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/confirm`;
// //       console.log("[confirmBooking] PATCH to:", url);

// //       const res = await fetchWithAuth(url, { 
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" }
// //       });

// //       console.log("[confirmBooking] Response:", res);

// //       if (res.success) {
// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, status: res.data?.status || "confirmed" } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: res.data?.status || "confirmed" }
// //             : state.selectedBooking
// //         }));
// //         console.log("[confirmBooking] SUCCESS - Status updated to confirmed/active");
// //         return res.data;
// //       }
// //       throw new Error(res.message || "Failed to confirm booking");
// //     } catch (err) {
// //       console.error("[confirmBooking] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       throw err;
// //     }
// //   },

// //   // ---------------- CANCEL BOOKING ----------------
// //   cancelBooking: async (bookingId, reason) => {
// //     console.log("[cancelBooking] START - ID:", bookingId, "Reason:", reason);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/cancel`;
// //       console.log("[cancelBooking] PATCH to:", url);

// //       const res = await fetchWithAuth(url, { 
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ reason })
// //       });

// //       console.log("[cancelBooking] Response:", res);

// //       if (res.success) {
// //         const booking = get().bookings.find(b => b.id === bookingId);
// //         const tutorId = booking?.tutorId;

// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, status: "cancelled" } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId 
// //             ? { ...state.selectedBooking, status: "cancelled" }
// //             : state.selectedBooking
// //         }));

// //         if (tutorId) {
// //           console.log("[cancelBooking] Refreshing tutors after cancel");
// //           get().fetchTutors();
// //         }

// //         console.log("[cancelBooking] SUCCESS");
// //         return res.data;
// //       }
// //       throw new Error(res.message || "Failed to cancel booking");
// //     } catch (err) {
// //       console.error("[cancelBooking] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       throw err;
// //     }
// //   },

// //   // ---------------- START CHAT ----------------
// //   startChat: async (bookingId) => {
// //     console.log("[startChat] START - ID:", bookingId);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/start`;
// //       console.log("[startChat] POST to:", url);

// //       const res = await fetchWithAuth(url, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" }
// //       });

// //       console.log("[startChat] Response:", res);

// //       if (res.success) {
// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, status: "active" } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: "active" }
// //             : state.selectedBooking
// //         }));
// //         console.log("[startChat] SUCCESS - Status updated to active");
// //         return res.data;
// //       }
// //       throw new Error(res.message || "Failed to start chat");
// //     } catch (err) {
// //       console.error("[startChat] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       throw err;
// //     }
// //   },

// //   // // ---------------- SEND MESSAGE ----------------
// //   // sendMessage: async (bookingId, content) => {
// //   //   console.log("[sendMessage] START - Booking:", bookingId, "Content:", content);
// //   //   set({ isSending: true, error: null });

// //   //   try {
// //   //     const { fetchWithAuth } = useAuthStore.getState();
// //   //     const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
// //   //     console.log("[sendMessage] POST to:", url);

// //   //     const res = await fetchWithAuth(url, {
// //   //       method: "POST",
// //   //       headers: { "Content-Type": "application/json" },
// //   //       body: JSON.stringify({ content, messageType: "TEXT" }),
// //   //     });

// //   //     console.log("[sendMessage] Response:", res);

// //   //     if (res.success && res.data) {
// //   //       set((state) => ({ 
// //   //         messages: [...state.messages, res.data],
// //   //         isSending: false 
// //   //       }));
        
// //   //       set((state) => ({
// //   //         bookings: state.bookings.map((b) => 
// //   //           b.id === bookingId 
// //   //             ? { 
// //   //                 ...b, 
// //   //                 last_message: content,
// //   //                 last_message_time: new Date().toISOString()
// //   //               } 
// //   //             : b
// //   //         ),
// //   //       }));
// //   //       console.log("[sendMessage] SUCCESS - Message added");
// //   //       return res.data;
// //   //     }
// //   //     throw new Error(res.message || "Failed to send message");
// //   //   } catch (err) {
// //   //     console.error("[sendMessage] CRASH:", err.message, err.stack);
// //   //     set({ isSending: false, error: err.message });
// //   //     throw err;
// //   //   }
// //   // },

// //   // ---------------- GET MESSAGES ----------------
// //   fetchMessages: async (bookingId) => {
// //     console.log("[fetchMessages] START - Booking:", bookingId);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
// //       console.log("[fetchMessages] Fetching:", url);

// //       const res = await fetchWithAuth(url);
// //       console.log("[fetchMessages] Response:", res);

// //       if (res.success && Array.isArray(res.data)) {
// //         console.log("[fetchMessages] Messages loaded:", res.data.length);
// //         set({ messages: res.data });
// //         return res.data;
// //       } else {
// //         console.warn("[fetchMessages] No messages or invalid response", res);
// //         set({ messages: [] });
// //         return [];
// //       }
// //     } catch (err) {
// //       console.error("[fetchMessages] CRASH:", err.message, err.stack);
// //       set({ messages: [], error: err.message });
// //       return [];
// //     }
// //   },

// //   // ---------------- END CHAT ----------------
// //   endChat: async (bookingId) => {
// //     console.log("[endChat] START - ID:", bookingId);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/end`;
// //       console.log("[endChat] POST to:", url);

// //       const res = await fetchWithAuth(url, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" }
// //       });

// //       console.log("[endChat] Response:", res);

// //       if (res.success) {
// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, status: "completed" } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: "completed" }
// //             : state.selectedBooking
// //         }));
// //         console.log("[endChat] SUCCESS - Status updated to completed");
// //         return res.data;
// //       }
// //       throw new Error(res.message || "Failed to end chat");
// //     } catch (err) {
// //       console.error("[endChat] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       throw err;
// //     }
// //   },

// //   // ---------------- RATE SESSION ----------------
  // rateSession: async (bookingId, rating, feedback) => {
  //   console.log("[rateSession] START - ID:", bookingId, "Rating:", rating, "Feedback:", feedback);
  //   set({ error: null });

  //   try {
  //     const { fetchWithAuth } = useAuthStore.getState();
  //     const url = `${API_BASE}/api/users/bookings/${bookingId}/rate`;
  //     console.log("[rateSession] POST to:", url);

  //     const res = await fetchWithAuth(url, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ rating, feedback }),
  //     });

  //     console.log("[rateSession] Response:", res);

  //     if (res.success) {
  //       set((state) => ({
  //         bookings: state.bookings.map((b) => 
  //           b.id === bookingId 
  //             ? { ...b, rating, feedback } 
  //             : b
  //         ),
  //         selectedBooking: state.selectedBooking?.id === bookingId
  //           ? { ...state.selectedBooking, rating, feedback }
  //           : state.selectedBooking
  //       }));
  //       console.log("[rateSession] SUCCESS");
  //       return true;
  //     }
  //     throw new Error(res.message || "Failed to rate session");
  //   } catch (err) {
  //     console.error("[rateSession] CRASH:", err.message, err.stack);
  //     set({ error: err.message });
  //     return false;
  //   }
  // },

// //   // ---------------- CHAT HISTORY ----------------
// //   fetchChatHistory: async (data) => {
// //     console.log("[fetchChatHistory] START - params:", data);
// //     set({ isLoading: true, error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/chat/history`;
// //       console.log("[fetchChatHistory] POST to:", url);

// //       const res = await fetchWithAuth(url, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(data),
// //       });

// //       console.log("[fetchChatHistory] Response:", res);

// //       if (res.success && Array.isArray(res.data)) {
// //         console.log("[fetchChatHistory] History loaded:", res.data.length);
// //         set({ chatHistory: res.data, isLoading: false });
// //         return res.data;
// //       } else {
// //         console.warn("[fetchChatHistory] Invalid response", res);
// //         set({ chatHistory: [], isLoading: false });
// //         return [];
// //       }
// //     } catch (err) {
// //       console.error("[fetchChatHistory] CRASH:", err.message, err.stack);
// //       set({ chatHistory: [], isLoading: false, error: err.message });
// //       return [];
// //     }
// //   },


// //   // ─── Utils ──────────────────────────────────────────────────
// //   setSelectedBooking: (booking) => set({ selectedBooking: booking }),

// //   clearError: () => set({ error: null }),

// //   reset: () => {
// //     get().disconnectSocket();
// //     set({
// //       tutors: [],
// //       bookings: [],
// //       selectedBooking: null,
// //       messages: [],
// //       isLoading: false,
// //       isSending: false,
// //       error: null,
// //       socketConnected: false,
// //     });
// //   },
// // }));












// // import { create } from "zustand";
// // import useAuthStore from "./authStore";
// // import { io } from "socket.io-client";

// // const API_BASE = "https://fillops-server-5fuf.onrender.com";
// // let socket = null;

// // export const useUserChatStore = create((set, get) => ({
// //   tutors: [],
// //   bookings: [],
// //   selectedBooking: null,
// //   messages: [],
// //   isLoading: false,
// //   isSending: false,
// //   error: null,
// //   socketConnected: false,

// //   connectSocket: () => {
// //     if (socket?.connected) return;

// //     const token = useAuthStore.getState().accessToken;
// //     if (!token) {
// //       console.warn("[UserSocket] No token → cannot connect");
// //       return;
// //     }

// //     socket = io(API_BASE, {
// //       auth: { token },
// //       autoConnect: false,
// //       transports: ["websocket"],
// //       reconnection: true,
// //       reconnectionAttempts: 5,
// //     });

// //     socket.connect();

// //     socket.on("connect", () => {
// //       console.log("%c[UserSocket] Connected", "background:#28a745;color:white;padding:4px;");
// //       set({ socketConnected: true });

// //       // Auto-join current booking if selected
// //       const currentId = get().selectedBooking?.id;
// //       if (currentId) {
// //         socket.emit("join:booking", currentId, (ack) => {
// //           if (ack?.success) {
// //             console.log("[UserSocket] ✓ Joined booking room");
// //           } else {
// //             console.error("[UserSocket] Join failed:", ack);
// //           }
// //         });
// //       }
// //     });

// //     socket.on("connect_error", (err) => {
// //       console.error("[UserSocket] Connection error:", err.message);
// //       set({ socketConnected: false });
// //     });

// //     socket.on("disconnect", (reason) => {
// //       console.log("[UserSocket] Disconnected:", reason);
// //       set({ socketConnected: false });
// //     });

// //     // ─── Real-time message receive (backend uses "message:new") ───────
// //     socket.on("message:new", (message) => {
// //       console.log("%c[UserSocket] ← message:new", "background:#673ab7;color:white;padding:4px;", message);

// //       const { selectedBooking } = get();

// //       // Add to current chat if viewing that booking
// //       if (message.bookingId === selectedBooking?.id) {
// //         set((state) => ({
// //           messages: [...state.messages, message],
// //         }));
// //       }

// //       // Update booking preview + unread count
// //       set((state) => ({
// //         bookings: state.bookings.map((b) =>
// //           b.id === message.bookingId
// //             ? {
// //                 ...b,
// //                 last_message: message.content,
// //                 last_message_time: message.createdAt,
// //                 unread_count: b.id === selectedBooking?.id ? 0 : (b.unread_count || 0) + 1,
// //               }
// //             : b
// //         ),
// //       }));
// //     });

// //     // ─── Typing indicators (backend uses start/stop) ───────────────────
// //     socket.on("typing:start", ({ userType, userName }) => {
// //       // You can show "Tutor is typing..." here
// //       console.log("[UserSocket] Typing started by:", userName, userType);
// //       // Optional: set some state like isTutorTyping: true
// //     });

// //     socket.on("typing:stop", () => {
// //       // Hide typing indicator
// //       console.log("[UserSocket] Typing stopped");
// //     });

// //     // ─── Session events ────────────────────────────────────────────────
// //     socket.on("session:ended", (data) => {
// //       console.log("[UserSocket] Session ended:", data);
// //       const { bookingId } = data;
// //       set((state) => ({
// //         bookings: state.bookings.map(b =>
// //           b.id === bookingId ? { ...b, status: "completed" } : b
// //         ),
// //         selectedBooking:
// //           state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: "completed" }
// //             : state.selectedBooking,
// //       }));
// //       toast({ title: "Session Ended", description: "The tutor has ended the session." });
// //     });

// //     socket.on("session:kick", (data) => {
// //       console.warn("[UserSocket] Kicked from session:", data);
// //       const { bookingId } = data;
// //       set((state) => ({
// //         selectedBooking: state.selectedBooking?.id === bookingId ? null : state.selectedBooking,
// //         bookings: state.bookings.filter(b => b.id !== bookingId),
// //       }));
// //       toast({ variant: "destructive", title: "Removed", description: "You were removed from this session." });
// //     });

// //     // Optional: online users
// //     socket.on("onlineUsers", (users) => {
// //       console.log("[UserSocket] Online users:", users);
// //       // You could show green dot if tutor is online
// //     });
// //   },

// //   disconnectSocket: () => {
// //     if (socket) {
// //       socket.disconnect();
// //       socket = null;
// //       set({ socketConnected: false });
// //     }
// //   },

// //   // ─── Send Message ──────────────────────────────────────────────────
// //   sendMessage: async (bookingId, content) => {
// //     if (!bookingId || !content?.trim()) return;

// //     const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

// //     const optimistic = {
// //       tempId,
// //       bookingId,
// //       content,
// //       sender: {
// //         id: useAuthStore.getState().user?.id,
// //         name: useAuthStore.getState().user?.name || "You",
// //         type: "USER",
// //       },
// //       createdAt: new Date().toISOString(),
// //       isSending: true,
// //     };

// //     set((s) => ({
// //       messages: [...s.messages, optimistic],
// //       isSending: true,
// //       error: null,
// //     }));

// //     if (!socket?.connected) {
// //       get().connectSocket();
// //       await new Promise(r => setTimeout(r, 1500));
// //     }

// //     if (socket?.connected) {
// //       socket.emit("message:send", {
// //         bookingId,
// //         content: content.trim(),
// //         messageType: "TEXT",
// //         tempId,
// //       });
// //     } else {
// //       // HTTP fallback (your existing code)
// //       try {
// //         const { fetchWithAuth } = useAuthStore.getState();
// //         const res = await fetchWithAuth(
// //           `${API_BASE}/api/users/bookings/${bookingId}/messages`,
// //           {
// //             method: "POST",
// //             body: JSON.stringify({ content: content.trim(), messageType: "TEXT" }),
// //           }
// //         );
// //         if (res.success && res.data) {
// //           set((s) => ({
// //             messages: s.messages.map(m =>
// //               m.tempId === tempId ? { ...res.data, isSending: false } : m
// //             ),
// //           }));
// //         }
// //       } catch (err) {
// //         set((s) => ({
// //           messages: s.messages.filter(m => m.tempId !== tempId),
// //           error: "Failed to send (offline)",
// //         }));
// //       }
// //     }

// //     set({ isSending: false });
// //   },

// //   // ─── Join room when selecting booking ──────────────────────────────
// //   setSelectedBooking: (booking) => {
// //     set({ selectedBooking: booking });

// //     if (booking?.id && socket?.connected) {
// //       socket.emit("join:booking", booking.id, (ack) => {
// //         if (ack?.success) {
// //           console.log("[UserChat] ✓ Joined booking room");
// //         }
// //       });
// //     }

// //     if (booking?.id) {
// //       get().fetchMessages(booking.id);
// //     }
// //   },

//   // // ─── Core Data Fetching ─────────────────────────────────────
//   // fetchTutors: async ({ search, category } = {}) => {
//   //   set({ isLoading: true, error: null });

//   //   try {
//   //     const { fetchWithAuth } = useAuthStore.getState();
//   //     let url = `${API_BASE}/api/users/tutors`;
//   //     const params = new URLSearchParams();
//   //     if (search) params.append("search", search);
//   //     if (category) params.append("category", category);
//   //     if (params.toString()) url += `?${params.toString()}`;

//   //     const res = await fetchWithAuth(url);

//   //     if (!res?.success || !Array.isArray(res.data)) {
//   //       console.warn("[fetchTutors] Invalid response", res);
//   //       set({ tutors: [], isLoading: false });
//   //       return;
//   //     }

//   //     const tutors = res.data.map((t) => ({
//   //       id: t.id || t._id,
//   //       name: t.name || "Unknown Tutor",
//   //       participant_name: t.name || "Unknown Tutor",
//   //       participant_role: "tutor",
//   //       avatar: t.avatar || null,
//   //       bio: t.bio || "",
//   //       subjects: t.subjects || [],
//   //       completedSessions: t.completedSessions || 0,
//   //       rating: t.rating || null,
//   //       isTutor: true,
//   //       last_message: "",
//   //       last_message_time: null,
//   //       status: "available",
//   //       unread_count: 0,
//   //     }));

//   //     set({ tutors, isLoading: false });
//   //     console.log(`[fetchTutors] Loaded ${tutors.length} tutors`);
//   //   } catch (err) {
//   //     console.error("[fetchTutors] Error:", err);
//   //     set({ tutors: [], isLoading: false, error: err.message });
//   //   }
//   // },

//   // fetchBookings: async ({ status = "", page = 1, limit = 100 } = {}) => {
//   //   set({ isLoading: true, error: null });

//   //   try {
//   //     const { fetchWithAuth } = useAuthStore.getState();
//   //     let url = `${API_BASE}/api/users/bookings?limit=${limit}`;
//   //     if (status) url += `&status=${status.toUpperCase()}`;
//   //     if (page > 1) url += `&page=${page}`;

//   //     const res = await fetchWithAuth(url);

//   //     if (!res?.success || !Array.isArray(res.data)) {
//   //       console.warn("[fetchBookings] Invalid response", res);
//   //       set({ bookings: [], isLoading: false });
//   //       return;
//   //     }

//   //     const bookings = res.data.map((b) => ({
//   //       id: b.id,
//   //       name: b.tutor?.name || "Unknown",
//   //       tutorId: b.tutorId || b.tutor?.id,
//   //       participant_name: b.tutor?.name || "Unknown",
//   //       participant_role: "tutor",
//   //       avatar: b.tutor?.avatar || null,
//   //       bio: b.tutor?.bio || "",
//   //       subjects: b.tutor?.subjects || [],
//   //       completedSessions: b.tutor?.completedSessions || 0,
//   //       rating: b.rating || null,
//   //       status: b.status?.toLowerCase() || "pending",
//   //       scheduledAt: b.scheduledAt || null,
//   //       duration: b.duration || null,
//   //       purpose: b.purpose || "",
//   //       last_message: b.lastMessage?.content || "",
//   //       last_message_time: b.lastMessage?.createdAt || null,
//   //       unread_count: b.unreadCount || 0,
//   //       isBooking: true,
//   //     }));

//   //     set((state) => {
//   //       let newSelected = state.selectedBooking;
//   //       if (newSelected?.isBooking) {
//   //         newSelected = bookings.find((b) => b.id === newSelected.id) || newSelected;
//   //       }
//   //       return { bookings, selectedBooking: newSelected, isLoading: false };
//   //     });

//   //     console.log(`[fetchBookings] Loaded ${bookings.length} bookings`);
//   //   } catch (err) {
//   //     console.error("[fetchBookings] Error:", err);
//   //     set({ bookings: [], isLoading: false, error: err.message });
//   //   }
//   // },

// //   fetchMessages: async (bookingId) => {
// //     if (!bookingId) return;

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`);

// //       if (res.success && Array.isArray(res.data)) {
// //         set({ messages: res.data });
// //         console.log(`[fetchMessages] Loaded ${res.data.length} messages for ${bookingId}`);
// //       } else {
// //         set({ messages: [] });
// //       }
// //     } catch (err) {
// //       console.error("[fetchMessages] Error:", err);
// //       set({ messages: [] });
// //     }
// //   },

// //   // ─── Booking Actions (HTTP) ─────────────────────────────────
// //   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
// //         method: "POST",
// //         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
// //       });

// //       if (res.success && res.data) {
// //         const newBooking = {
// //           ...res.data,
// //           participant_name: res.data.tutor?.name || "Unknown",
// //           participant_role: "tutor",
// //           isBooking: true,
// //         };

// //         set((state) => ({
// //           bookings: [...state.bookings, newBooking],
// //           tutors: state.tutors.filter((t) => t.id !== tutorId),
// //           selectedBooking: newBooking,
// //           isLoading: false,
// //         }));

// //         return newBooking;
// //       }
// //       throw new Error(res.message || "Failed to create booking");
// //     } catch (err) {
// //       set({ isLoading: false, error: err.message });
// //       throw err;
// //     }
// //   },

// //   // ---------------- CONFIRM BOOKING ----------------
// //   confirmBooking: async (bookingId) => {
// //     console.log("[confirmBooking] START - ID:", bookingId);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/confirm`;
// //       console.log("[confirmBooking] PATCH to:", url);

// //       const res = await fetchWithAuth(url, { 
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" }
// //       });

// //       console.log("[confirmBooking] Response:", res);

// //       if (res.success) {
// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, status: res.data?.status || "confirmed" } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: res.data?.status || "confirmed" }
// //             : state.selectedBooking
// //         }));
// //         console.log("[confirmBooking] SUCCESS - Status updated to confirmed/active");
// //         return res.data;
// //       }
// //       throw new Error(res.message || "Failed to confirm booking");
// //     } catch (err) {
// //       console.error("[confirmBooking] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       throw err;
// //     }
// //   },

// //   // ---------------- CANCEL BOOKING ----------------
// //   cancelBooking: async (bookingId, reason) => {
// //     console.log("[cancelBooking] START - ID:", bookingId, "Reason:", reason);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/cancel`;
// //       console.log("[cancelBooking] PATCH to:", url);

// //       const res = await fetchWithAuth(url, { 
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ reason })
// //       });

// //       console.log("[cancelBooking] Response:", res);

// //       if (res.success) {
// //         const booking = get().bookings.find(b => b.id === bookingId);
// //         const tutorId = booking?.tutorId;

// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, status: "cancelled" } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId 
// //             ? { ...state.selectedBooking, status: "cancelled" }
// //             : state.selectedBooking
// //         }));

// //         if (tutorId) {
// //           console.log("[cancelBooking] Refreshing tutors after cancel");
// //           get().fetchTutors();
// //         }

// //         console.log("[cancelBooking] SUCCESS");
// //         return res.data;
// //       }
// //       throw new Error(res.message || "Failed to cancel booking");
// //     } catch (err) {
// //       console.error("[cancelBooking] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       throw err;
// //     }
// //   },

// //   // ---------------- START CHAT ----------------
// //   startChat: async (bookingId) => {
// //     console.log("[startChat] START - ID:", bookingId);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/start`;
// //       console.log("[startChat] POST to:", url);

// //       const res = await fetchWithAuth(url, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" }
// //       });

// //       console.log("[startChat] Response:", res);

// //       if (res.success) {
// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, status: "active" } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: "active" }
// //             : state.selectedBooking
// //         }));
// //         console.log("[startChat] SUCCESS - Status updated to active");
// //         return res.data;
// //       }
// //       throw new Error(res.message || "Failed to start chat");
// //     } catch (err) {
// //       console.error("[startChat] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       throw err;
// //     }
// //   },

//   // fetchMessages: async (bookingId) => {
//   //   console.log("[fetchMessages] START - Booking:", bookingId);
//   //   set({ error: null });

//   //   try {
//   //     const { fetchWithAuth } = useAuthStore.getState();
//   //     const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
//   //     console.log("[fetchMessages] Fetching:", url);

//   //     const res = await fetchWithAuth(url);
//   //     console.log("[fetchMessages] Response:", res);

//   //     if (res.success && Array.isArray(res.data)) {
//   //       console.log("[fetchMessages] Messages loaded:", res.data.length);
//   //       set({ messages: res.data });
//   //       return res.data;
//   //     } else {
//   //       console.warn("[fetchMessages] No messages or invalid response", res);
//   //       set({ messages: [] });
//   //       return [];
//   //     }
//   //   } catch (err) {
//   //     console.error("[fetchMessages] CRASH:", err.message, err.stack);
//   //     set({ messages: [], error: err.message });
//   //     return [];
//   //   }
//   // },

// //   // ---------------- END CHAT ----------------
// //   endChat: async (bookingId) => {
// //     console.log("[endChat] START - ID:", bookingId);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/end`;
// //       console.log("[endChat] POST to:", url);

// //       const res = await fetchWithAuth(url, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" }
// //       });

// //       console.log("[endChat] Response:", res);

// //       if (res.success) {
// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, status: "completed" } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: "completed" }
// //             : state.selectedBooking
// //         }));
// //         console.log("[endChat] SUCCESS - Status updated to completed");
// //         return res.data;
// //       }
// //       throw new Error(res.message || "Failed to end chat");
// //     } catch (err) {
// //       console.error("[endChat] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       throw err;
// //     }
// //   },

// //   // ---------------- RATE SESSION ----------------
// //   rateSession: async (bookingId, rating, feedback) => {
// //     console.log("[rateSession] START - ID:", bookingId, "Rating:", rating, "Feedback:", feedback);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/rate`;
// //       console.log("[rateSession] POST to:", url);

// //       const res = await fetchWithAuth(url, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ rating, feedback }),
// //       });

// //       console.log("[rateSession] Response:", res);

// //       if (res.success) {
// //         set((state) => ({
// //           bookings: state.bookings.map((b) => 
// //             b.id === bookingId 
// //               ? { ...b, rating, feedback } 
// //               : b
// //           ),
// //           selectedBooking: state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, rating, feedback }
// //             : state.selectedBooking
// //         }));
// //         console.log("[rateSession] SUCCESS");
// //         return true;
// //       }
// //       throw new Error(res.message || "Failed to rate session");
// //     } catch (err) {
// //       console.error("[rateSession] CRASH:", err.message, err.stack);
// //       set({ error: err.message });
// //       return false;
// //     }
// //   },

// //   // ---------------- CHAT HISTORY ----------------
// //   fetchChatHistory: async (data) => {
// //     console.log("[fetchChatHistory] START - params:", data);
// //     set({ isLoading: true, error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/chat/history`;
// //       console.log("[fetchChatHistory] POST to:", url);

// //       const res = await fetchWithAuth(url, {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(data),
// //       });

// //       console.log("[fetchChatHistory] Response:", res);

// //       if (res.success && Array.isArray(res.data)) {
// //         console.log("[fetchChatHistory] History loaded:", res.data.length);
// //         set({ chatHistory: res.data, isLoading: false });
// //         return res.data;
// //       } else {
// //         console.warn("[fetchChatHistory] Invalid response", res);
// //         set({ chatHistory: [], isLoading: false });
// //         return [];
// //       }
// //     } catch (err) {
// //       console.error("[fetchChatHistory] CRASH:", err.message, err.stack);
// //       set({ chatHistory: [], isLoading: false, error: err.message });
// //       return [];
// //     }
// //   },

// //   reset: () => {
// //     get().disconnectSocket();
// //     set({
// //       tutors: [],
// //       bookings: [],
// //       selectedBooking: null,
// //       messages: [],
// //       isLoading: false,
// //       isSending: false,
// //       error: null,
// //       socketConnected: false,
// //     });
// //   },
// // }));












// // // src/store/userChatStore.js
// // import { create } from "zustand";
// // import useAuthStore from "./authStore";
// // import { connectUserSocket, getUserSocket } from "@/lib/user-socket";

// // const API_BASE = "https://fillops-server-5fuf.onrender.com";

// // const mapBookingToUI = (booking) => ({
// //   id: booking.id,
// //   tutorId: booking.tutorId || booking.tutor?.id,
// //   participant_name: booking.tutor?.name || "Tutor",
// //   participant_role: "tutor",
// //   last_message: booking.lastMessage?.content || "",
// //   last_message_time: booking.lastMessage?.createdAt || null,
// //   status: (booking.status || "pending").toLowerCase(),
// //   scheduledAt: booking.scheduledAt || null,
// //   proposedAt: booking.proposedAt || null,
// //   duration: booking.duration || null,
// //   unread_count: booking.unreadCount || 0,
// //   purpose: booking.purpose || "",
// //   subject: booking.subject?.name || "",
// //   avatar: booking.tutor?.avatar || null,
// //   isBooking: true,
// // });

// // export const useUserChatStore = create((set, get) => ({
// //   bookings: [],
// //   selectedBooking: null,
// //   messages: [],
// //   tutors: [],
// //   hasFetchedBookings: false,
// //   hasFetchedTutors: false,
// //   isLoading: false,
// //   isSending: false,
// //   socketConnected: false,
// //   isSomeoneTyping: false,
// //   typingUserName: null,
// //   isParticipantOnline: false,

// //   // ────────────────────────────────────────────────────────────────
// //   // Socket connection
// //   // ────────────────────────────────────────────────────────────────
// //   initializeSocket: () => {
// //     console.log("[UserChatStore] initializeSocket called");
    
// //     const token = useAuthStore.getState().accessToken;
// //     if (!token) {
// //       console.warn("[UserChatStore] No token → cannot initialize socket");
// //       return;
// //     }

// //     const socket = connectUserSocket(token);
// //     set({ socketConnected: socket?.connected || false });
// //   },

// //   disconnectSocket: () => {
// //     const socket = getUserSocket();
// //     if (socket?.connected) {
// //       socket.disconnect();
// //     }
// //     set({ socketConnected: false });
// //   },

// //   // ────────────────────────────────────────────────────────────────
// //   // Socket event handlers (called by global listeners in userSocket.js)
// //   // ────────────────────────────────────────────────────────────────
// //   // handleNewMessage: (msg) => {
// //   //   console.log("📨 [USER] handleNewMessage called:", msg);
    
// //   //   set((state) => {
// //   //     // Prevent duplicate messages by ID
// //   //     if (state.messages.some((m) => m.id === msg.id)) {
// //   //       console.log("⚠️ Duplicate message (by ID) skipped:", msg.id);
// //   //       return state;
// //   //     }

// //   //     const isCurrent = msg.bookingId === state.selectedBooking?.id;
// //   //     let updatedMessages = [...state.messages];

// //   //     // 1️⃣ Try to find optimistic message by tempId
// //   //     let optimisticIndex = -1;
// //   //     if (msg.tempId) {
// //   //       optimisticIndex = updatedMessages.findIndex((m) => m.tempId === msg.tempId);
// //   //       console.log("🔎 Searching for tempId:", msg.tempId, "→ Found at index:", optimisticIndex);
// //   //     }

// //   //     // 2️⃣ Fallback: match by content + sender + recent time
// //   //     if (optimisticIndex === -1 && msg.sender?.id && msg.content) {
// //   //       const msgTime = new Date(msg.createdAt).getTime();
// //   //       optimisticIndex = updatedMessages.findIndex((m) => 
// //   //         m.isOptimistic === true &&
// //   //         m.content === msg.content &&
// //   //         m.sender?.id === msg.sender?.id &&
// //   //         Math.abs(new Date(m.createdAt).getTime() - msgTime) < 10000
// //   //       );
// //   //       console.log("🔎 Fallback search by content+sender:", optimisticIndex);
// //   //     }

// //   //     if (optimisticIndex !== -1) {
// //   //       console.log("✅ REPLACING optimistic message at index:", optimisticIndex);
// //   //       updatedMessages[optimisticIndex] = {
// //   //         ...msg,
// //   //         tempId: undefined,
// //   //         isOptimistic: false,
// //   //         status: "sent",
// //   //       };
// //   //     } else {
// //   //       console.log("➕ Adding new message (no optimistic found)");
// //   //       updatedMessages.push({ ...msg, status: "sent" });
// //   //     }

// //   //     updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// //   //     // Update unread count if not current chat
// //   //     if (!isCurrent && msg.senderRole === "tutor") {
// //   //       const updatedBookings = state.bookings.map((b) =>
// //   //         b.id === msg.bookingId
// //   //           ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
// //   //           : b
// //   //       );
// //   //       return { messages: updatedMessages, bookings: updatedBookings };
// //   //     }

// //   //     return { messages: updatedMessages };
// //   //   });
// //   // },
// //    handleNewMessage: (msg) => {
// //     console.log("📨 [USER] handleNewMessage called:", msg);
    
// //     set((state) => {
// //       // Prevent duplicate by ID
// //       if (state.messages.some((m) => m.id === msg.id)) {
// //         console.log("⚠️ Duplicate message (by ID) skipped:", msg.id);
// //         return state;
// //       }

// //       const isCurrent = msg.bookingId === state.selectedBooking?.id;
// //       let updatedMessages = [...state.messages];

// //       // 1️⃣ Try to find optimistic message by tempId
// //       let optimisticIndex = -1;
// //       if (msg.tempId) {
// //         optimisticIndex = updatedMessages.findIndex((m) => m.tempId === msg.tempId);
// //         console.log("🔎 Searching for tempId:", msg.tempId, "→ Found at index:", optimisticIndex);
// //       }

// //       // 2️⃣ Fallback: match by content + sender + recent time (within 10 seconds)
// //       if (optimisticIndex === -1 && msg.sender?.id && msg.content) {
// //         const msgTime = new Date(msg.createdAt).getTime();
// //         optimisticIndex = updatedMessages.findIndex((m) => 
// //           m.isOptimistic === true &&
// //           m.content === msg.content &&
// //           m.sender?.id === msg.sender?.id &&
// //           Math.abs(new Date(m.createdAt).getTime() - msgTime) < 10000
// //         );
// //         console.log("🔎 Fallback search by content+sender:", optimisticIndex);
// //       }

// //       if (optimisticIndex !== -1) {
// //         console.log("✅ REPLACING optimistic message at index:", optimisticIndex);
// //         updatedMessages[optimisticIndex] = {
// //           ...msg,
// //           tempId: undefined,
// //           isOptimistic: false,
// //           status: "sent",
// //         };
// //       } else {
// //         console.log("➕ Adding new message (no optimistic found)");
// //         updatedMessages.push({ ...msg, status: "sent" });
// //       }

// //       updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

// //       // Update sidebar unread count if not current chat
// //       if (!isCurrent && msg.senderRole === "tutor") {
// //         const updatedBookings = state.bookings.map((b) =>
// //           b.id === msg.bookingId
// //             ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
// //             : b
// //         );
// //         return { messages: updatedMessages, bookings: updatedBookings };
// //       }

// //       return { messages: updatedMessages };
// //     });
// //   },

// //   handleMessagesReadByTutor: (timestamp) => {
// //     console.log("📖 Tutor read messages up to:", timestamp);
// //     set((state) => ({
// //       messages: state.messages.map((m) =>
// //         m.senderRole === "user" && new Date(m.createdAt) <= new Date(timestamp)
// //           ? { ...m, isRead: true }
// //           : m
// //       ),
// //     }));
// //   },

// //   handleSessionEnded: (data) => {
// //     console.log("🏁 Session ended:", data);
// //     const { bookingId } = data;
// //     set((state) => {
// //       if (state.selectedBooking?.id !== bookingId) return state;
// //       return {
// //         selectedBooking: { ...state.selectedBooking, status: "completed" },
// //       };
// //     });
// //   },

// //   handleSessionKick: (data) => {
// //     console.log("👢 Kicked from session:", data);
// //     const socket = getUserSocket();
// //     if (socket && data?.bookingId) {
// //       socket.emit("leave:booking", data.bookingId);
// //     }

// //     set((state) => ({
// //       selectedBooking: state.selectedBooking?.id === data?.bookingId ? null : state.selectedBooking,
// //       messages: state.selectedBooking?.id === data?.bookingId ? [] : state.messages,
// //     }));
// //   },

// //   handleSessionExpired: (data) => {
// //     console.log("⏰ Session expired:", data);
// //     const { bookingId } = data;
// //     set((state) => {
// //       if (state.selectedBooking?.id !== bookingId) return state;
// //       return {
// //         selectedBooking: { ...state.selectedBooking, status: "completed" },
// //       };
// //     });
// //   },

// //   handleOnlineUsers: (users) => {
// //     console.log("👥 Online users:", users);
// //     const tutorId = get().selectedBooking?.tutorId;
// //     const isOnline = users?.some((u) => u.id === tutorId && u.userType === "tutor");
// //     set({ isParticipantOnline: !!isOnline });
// //   },

// //   handleBookingConfirmed: (data) => {
// //     console.log("✅ Booking confirmed:", data);
// //     const { bookingId } = data;
// //     set((state) => ({
// //       bookings: state.bookings.map((b) =>
// //         b.id === bookingId ? { ...b, status: "confirmed" } : b
// //       ),
// //       selectedBooking:
// //         state.selectedBooking?.id === bookingId
// //           ? { ...state.selectedBooking, status: "confirmed" }
// //           : state.selectedBooking,
// //     }));
// //   },

// //   handleBookingCancelled: (data) => {
// //     console.log("❌ Booking cancelled:", data);
// //     const { bookingId } = data;
// //     set((state) => ({
// //       bookings: state.bookings.map((b) =>
// //         b.id === bookingId ? { ...b, status: "cancelled" } : b
// //       ),
// //       selectedBooking:
// //         state.selectedBooking?.id === bookingId
// //           ? { ...state.selectedBooking, status: "cancelled" }
// //           : state.selectedBooking,
// //     }));
// //   },

// //   handleBookingRescheduled: (data) => {
// //     console.log("📅 Booking rescheduled:", data);
// //     get().fetchBookings(true); // Refresh bookings list
// //   },

// //   handleBookingUpdated: (data) => {
// //     console.log("🔄 Booking updated:", data);
// //     const { bookingId } = data;
// //     if (get().selectedBooking?.id === bookingId) {
// //       get().fetchBooking(bookingId);
// //     }
// //   },

// //   handleRescheduleProposed: (data) => {
// //     console.log("📅 Reschedule proposed by tutor:", data);
// //     const { bookingId, proposedAt } = data;
// //     set((state) => ({
// //       bookings: state.bookings.map((b) =>
// //         b.id === bookingId
// //           ? { ...b, status: "reschedule-proposed", proposedAt }
// //           : b
// //       ),
// //       selectedBooking:
// //         state.selectedBooking?.id === bookingId
// //           ? { ...state.selectedBooking, status: "reschedule-proposed", proposedAt }
// //           : state.selectedBooking,
// //     }));
// //   },

// //   // ────────────────────────────────────────────────────────────────
// //   // Core chat actions
// //   // ────────────────────────────────────────────────────────────────
// //   setSelectedBooking: (booking) => {
// //     const prevId = get().selectedBooking?.id;
// //     const socket = getUserSocket();

// //     // Leave previous room
// //     if (prevId && socket?.connected) {
// //       socket.emit("leave:booking", prevId);
// //     }

// //     set({
// //       selectedBooking: booking,
// //       messages: [],
// //       isLoading: true,
// //       isSomeoneTyping: false,
// //       typingUserName: null,
// //       isParticipantOnline: false,
// //     });

// //     if (!booking?.id) return;

// //     // Join new room
// //     if (socket?.connected) {
// //       socket.emit("join:booking", booking.id, (ack) => {
// //         if (ack?.success) {
// //           console.log("✅ User joined booking room:", booking.id);
// //           get().markMessagesAsRead(booking.id);
// //         } else {
// //           console.error("❌ Failed to join room:", ack);
// //         }
// //       });
// //     }

// //     get().fetchMessages(booking.id);
// //   },

// //  sendMessage: async (bookingId, content, messageType = "TEXT") => {
// //   if (!content?.trim() || !bookingId) {
// //     console.warn("[sendMessage] Invalid input");
// //     return;
// //   }

// //   const socket = getUserSocket();
  

// //   if (!socket?.connected) {
// //     console.error("[sendMessage] Socket not connected - attempting reconnection");
    
// //     // Try to reconnect
// //     get().initializeSocket();
    
// //     // Wait for connection
// //     await new Promise((resolve) => {
// //       const checkConnection = setInterval(() => {
// //         const newSocket = getUserSocket();
// //         if (newSocket?.connected) {
// //           clearInterval(checkConnection);
// //           resolve();
// //         }
// //       }, 100);
      
// //       // Timeout after 3 seconds
// //       setTimeout(() => {
// //         clearInterval(checkConnection);
// //         resolve();
// //       }, 3000);
// //     });
    
// //     // Check again
// //     const reconnectedSocket = getUserSocket();
// //     if (!reconnectedSocket?.connected) {
// //       console.error("[sendMessage] Failed to reconnect socket");
// //       throw new Error("Cannot connect to chat server. Please refresh the page.");
// //     }
// //   }

// //   const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
// //   const userId = useAuthStore.getState().user?.id;
// //   const userName = useAuthStore.getState().user?.name || 'You';

// //   const optimisticMsg = {
// //     tempId,
// //     content,
// //     messageType,
// //     bookingId,
// //     sender: { 
// //       id: userId,
// //       type: 'USER',
// //       name: userName
// //     },
// //     senderRole: "user",
// //     createdAt: new Date().toISOString(),
// //     status: "sending",
// //     isOptimistic: true,
// //   };

// //   console.log("📤 [USER] Sending message with tempId:", tempId);

// //   // Add optimistic message
// //   set((s) => ({
// //     messages: [...s.messages, optimisticMsg],
// //     isSending: true,
// //   }));

// //   try {
// //     const activeSocket = getUserSocket();
    
// //     // Emit with acknowledgment callback
// //     await new Promise((resolve, reject) => {
// //       const timeout = setTimeout(() => {
// //         reject(new Error("Message send timeout"));
// //       }, 10000); // 10 second timeout

// //       activeSocket.emit("message:send", {
// //         bookingId,
// //         content: content.trim(),
// //         messageType,
// //         tempId,
// //       }, (response) => {
// //         clearTimeout(timeout);
        
// //         if (response?.success) {
// //           console.log("✅ Message sent successfully:", response);
// //           resolve(response);
// //         } else {
// //           console.error("❌ Server rejected message:", response);
// //           reject(new Error(response?.message || "Failed to send message"));
// //         }
// //       });
// //     });
    
// //   } catch (err) {
// //     console.error("[sendMessage] failed:", err);
    
// //     // Remove optimistic message on error
// //     set((s) => ({
// //       messages: s.messages.filter((m) => m.tempId !== tempId),
// //       isSending: false,
// //     }));
    
// //     throw err;
// //   } finally {
// //     set({ isSending: false });
// //   }
// // },


// // sendTyping: (isTyping = true) => {
// //   const { selectedBooking, socketConnected } = get();
  
// //   if (!selectedBooking?.id || !socketConnected) {
// //     console.warn("[sendTyping] Cannot send - no booking or socket disconnected");
// //     return;
// //   }

// //   const socket = getUserSocket();
// //   if (!socket?.connected) {
// //     console.warn("[sendTyping] Socket not connected");
// //     return;
// //   }

// //   const event = isTyping ? "typing:start" : "typing:stop";
  
// //   console.log(`📝 [USER] Emitting ${event} for booking:`, selectedBooking.id);
  
// //   socket.emit(event, {
// //     bookingId: selectedBooking.id,
// //     userType: "user",
// //     userName: useAuthStore.getState().user?.name || "User"
// //   });
// // },

// //   markMessagesAsRead: (bookingId) => {
// //     const socket = getUserSocket();
// //     if (socket?.connected) {
// //       socket.emit("messages:read", bookingId);
// //     }

// //     // Optimistic UI update
// //     set((s) => ({
// //       bookings: s.bookings.map((b) =>
// //         b.id === bookingId ? { ...b, unread_count: 0 } : b
// //       ),
// //     }));
// //   },

// //     // ─── Core Data Fetching ─────────────────────────────────────
// //   fetchTutors: async ({ search, category } = {}) => {
// //     set({ isLoading: true, error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       let url = `${API_BASE}/api/users/tutors`;
// //       const params = new URLSearchParams();
// //       if (search) params.append("search", search);
// //       if (category) params.append("category", category);
// //       if (params.toString()) url += `?${params.toString()}`;

// //       const res = await fetchWithAuth(url);

// //       if (!res?.success || !Array.isArray(res.data)) {
// //         console.warn("[fetchTutors] Invalid response", res);
// //         set({ tutors: [], isLoading: false });
// //         return;
// //       }

// //       const tutors = res.data.map((t) => ({
// //         id: t.id || t._id,
// //         name: t.name || "Unknown Tutor",
// //         participant_name: t.name || "Unknown Tutor",
// //         participant_role: "tutor",
// //         avatar: t.avatar || null,
// //         bio: t.bio || "",
// //         subjects: t.subjects || [],
// //         completedSessions: t.completedSessions || 0,
// //         rating: t.rating || null,
// //         isTutor: true,
// //         last_message: "",
// //         last_message_time: null,
// //         status: "available",
// //         unread_count: 0,
// //       }));

// //       set({ tutors, isLoading: false });
// //       console.log(`[fetchTutors] Loaded ${tutors.length} tutors`);
// //     } catch (err) {
// //       console.error("[fetchTutors] Error:", err);
// //       set({ tutors: [], isLoading: false, error: err.message });
// //     }
// //   },


// //   // ────────────────────────────────────────────────────────────────
// //   // REST API calls
// //   // ────────────────────────────────────────────────────────────────

// //     fetchMessages: async (bookingId) => {
// //     console.log("[fetchMessages] START - Booking:", bookingId);
// //     set({ error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
// //       console.log("[fetchMessages] Fetching:", url);

// //       const res = await fetchWithAuth(url);
// //       console.log("[fetchMessages] Response:", res);

// //       if (res.success && Array.isArray(res.data)) {
// //         console.log("[fetchMessages] Messages loaded:", res.data.length);
// //         set({ messages: res.data });
// //         return res.data;
// //       } else {
// //         console.warn("[fetchMessages] No messages or invalid response", res);
// //         set({ messages: [] });
// //         return [];
// //       }
// //     } catch (err) {
// //       console.error("[fetchMessages] CRASH:", err.message, err.stack);
// //       set({ messages: [], error: err.message });
// //       return [];
// //     }
// //   },

// //     // ─── Booking Actions (HTTP) ─────────────────────────────────
// //   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
// //     set({ isLoading: true, error: null });
// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
// //         method: "POST",
// //         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
// //       });

// //       if (res.success && res.data) {
// //         const newBooking = {
// //           ...res.data,
// //           participant_name: res.data.tutor?.name || "Unknown",
// //           participant_role: "tutor",
// //           isBooking: true,
// //         };

// //         set((state) => ({
// //           bookings: [...state.bookings, newBooking],
// //           tutors: state.tutors.filter((t) => t.id !== tutorId),
// //           selectedBooking: newBooking,
// //           isLoading: false,
// //         }));

// //         return newBooking;
// //       }
// //       throw new Error(res.message || "Failed to create booking");
// //     } catch (err) {
// //       set({ isLoading: false, error: err.message });
// //       throw err;
// //     }
// //   },

// //     fetchBookings: async ({ status = "", page = 1, limit = 100 } = {}) => {
// //     set({ isLoading: true, error: null });

// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       let url = `${API_BASE}/api/users/bookings?limit=${limit}`;
// //       if (status) url += `&status=${status.toUpperCase()}`;
// //       if (page > 1) url += `&page=${page}`;

// //       const res = await fetchWithAuth(url);

// //       if (!res?.success || !Array.isArray(res.data)) {
// //         console.warn("[fetchBookings] Invalid response", res);
// //         set({ bookings: [], isLoading: false });
// //         return;
// //       }

// //       const bookings = res.data.map((b) => ({
// //         id: b.id,
// //         name: b.tutor?.name || "Unknown",
// //         tutorId: b.tutorId || b.tutor?.id,
// //         participant_name: b.tutor?.name || "Unknown",
// //         participant_role: "tutor",
// //         avatar: b.tutor?.avatar || null,
// //         bio: b.tutor?.bio || "",
// //         subjects: b.tutor?.subjects || [],
// //         completedSessions: b.tutor?.completedSessions || 0,
// //         rating: b.rating || null,
// //         status: b.status?.toLowerCase() || "pending",
// //         scheduledAt: b.scheduledAt || null,
// //         duration: b.duration || null,
// //         purpose: b.purpose || "",
// //         last_message: b.lastMessage?.content || "",
// //         last_message_time: b.lastMessage?.createdAt || null,
// //         unread_count: b.unreadCount || 0,
// //         isBooking: true,
// //       }));

// //       set((state) => {
// //         let newSelected = state.selectedBooking;
// //         if (newSelected?.isBooking) {
// //           newSelected = bookings.find((b) => b.id === newSelected.id) || newSelected;
// //         }
// //         return { bookings, selectedBooking: newSelected, isLoading: false };
// //       });

// //       console.log(`[fetchBookings] Loaded ${bookings.length} bookings`);
// //     } catch (err) {
// //       console.error("[fetchBookings] Error:", err);
// //       set({ bookings: [], isLoading: false, error: err.message });
// //     }
// //   },

// //   fetchBooking: async (bookingId) => {
// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const url = `${API_BASE}/api/user/bookings/${bookingId}`;
// //       console.log("[USER fetchBooking] Fetching:", url);

// //       const res = await fetchWithAuth(url);

// //       if (res.success && res.data) {
// //         const booking = mapBookingToUI(res.data);
// //         console.log("[USER fetchBooking] Success:", booking.id);

// //         set({ selectedBooking: booking });

// //         set((state) => ({
// //           bookings: state.bookings.map((b) =>
// //             b.id === bookingId ? booking : b
// //           ),
// //         }));

// //         return booking;
// //       } else {
// //         console.warn("[USER fetchBooking] No data for ID:", bookingId);
// //         return null;
// //       }
// //     } catch (err) {
// //       console.error("[USER fetchBooking] FAILED:", err.message || err);
// //       return null;
// //     }
// //   },

// //   // Reschedule actions
// //   acceptReschedule: async (bookingId) => {
// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();

// //       set((state) => ({
// //         bookings: state.bookings.map((b) =>
// //           b.id === bookingId ? { ...b, status: "confirmed" } : b
// //         ),
// //         selectedBooking:
// //           state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: "confirmed" }
// //             : state.selectedBooking,
// //       }));

// //       const res = await fetchWithAuth(
// //         `${API_BASE}/api/user/bookings/${bookingId}/reschedule/accept`,
// //         { method: "PATCH" }
// //       );

// //       if (res.success && res.data) {
// //         const updatedBooking = mapBookingToUI(res.data);
// //         set((state) => ({
// //           bookings: state.bookings.map((b) =>
// //             b.id === bookingId ? updatedBooking : b
// //           ),
// //           selectedBooking:
// //             state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
// //         }));
// //         return res.data;
// //       }

// //       throw new Error("Accept reschedule failed");
// //     } catch (err) {
// //       console.error("acceptReschedule failed:", err);
// //       throw err;
// //     }
// //   },

// //   rejectReschedule: async (bookingId, reason) => {
// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();

// //       set((state) => ({
// //         bookings: state.bookings.map((b) =>
// //           b.id === bookingId ? { ...b, status: "pending" } : b
// //         ),
// //         selectedBooking:
// //           state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: "pending" }
// //             : state.selectedBooking,
// //       }));

// //       const res = await fetchWithAuth(
// //         `${API_BASE}/api/user/bookings/${bookingId}/reschedule/reject`,
// //         {
// //           method: "PATCH",
// //           body: JSON.stringify({ reason }),
// //         }
// //       );

// //       if (res.success && res.data) {
// //         const updatedBooking = mapBookingToUI(res.data);
// //         set((state) => ({
// //           bookings: state.bookings.map((b) =>
// //             b.id === bookingId ? updatedBooking : b
// //           ),
// //           selectedBooking:
// //             state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
// //         }));
// //         return res.data;
// //       }

// //       throw new Error("Reject reschedule failed");
// //     } catch (err) {
// //       console.error("rejectReschedule failed:", err);
// //       throw err;
// //     }
// //   },

// //   cancelBooking: async (bookingId, reason) => {
// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();

// //       if (!reason || !reason.trim()) {
// //         throw new Error("Cancellation reason is required");
// //       }

// //       set((state) => ({
// //         bookings: state.bookings.map((b) =>
// //           b.id === bookingId ? { ...b, status: "cancelled" } : b
// //         ),
// //         selectedBooking:
// //           state.selectedBooking?.id === bookingId
// //             ? { ...state.selectedBooking, status: "cancelled" }
// //             : state.selectedBooking,
// //       }));

// //       const res = await fetchWithAuth(
// //         `${API_BASE}/api/user/bookings/${bookingId}/cancel`,
// //         {
// //           method: "PATCH",
// //           body: JSON.stringify({ reason: reason.trim() }),
// //         }
// //       );

// //       if (res.success) {
// //         return true;
// //       }

// //       throw new Error(res.message || "Cancel failed");
// //     } catch (err) {
// //       console.error("cancelBooking failed:", err);
// //       throw err;
// //     }
// //   },

// //   reset: () => {
// //     get().disconnectSocket();
// //     set({
// //       bookings: [],
// //       selectedBooking: null,
// //       messages: [],
// //       isLoading: false,
// //       isSending: false,
// //       socketConnected: false,
// //       isSomeoneTyping: false,
// //       typingUserName: null,
// //       isParticipantOnline: false,
// //     });
// //   },
// // }));








// // src/store/userChatStore.js
// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { connectUserSocket, getUserSocket } from "@/lib/user-socket";

// const API_BASE = "https://fillops-server-5fuf.onrender.com";

// const mapBookingToUI = (booking) => ({
//   id: booking.id,
//   tutorId: booking.tutorId || booking.tutor?.id,
//   participant_name: booking.tutor?.name || "Tutor",
//   participant_role: "tutor",
//   last_message: booking.lastMessage?.content || "",
//   last_message_time: booking.lastMessage?.createdAt || null,
//   status: (booking.status || "pending").toLowerCase(),
//   scheduledAt: booking.scheduledAt || null,
//   proposedAt: booking.proposedAt || null,
//   duration: booking.duration || null,
//   unread_count: booking.unreadCount || 0,
//   purpose: booking.purpose || "",
//   subject: booking.subject?.name || "",
//   avatar: booking.tutor?.avatar || null,
//   isBooking: true,
// });

// export const useUserChatStore = create((set, get) => ({
//   bookings: [],
//   selectedBooking: null,
//   messages: [],
//   tutors: [],
//   isLoading: false,
//   isSending: false,
//   socketConnected: false,
//   isSomeoneTyping: false,
//   typingUserName: null,
//   isParticipantOnline: false,
//   hasFetchedBookings: false,
//   hasFetchedTutors: false,

//   // ────────────────────────────────────────────────────────────────
//   // Socket connection
//   // ────────────────────────────────────────────────────────────────
//   initializeSocket: () => {
//     console.log("[UserChatStore] initializeSocket called");
    
//     const token = useAuthStore.getState().accessToken;
//     if (!token) {
//       console.warn("[UserChatStore] No token → cannot initialize socket");
//       return;
//     }

//     const socket = connectUserSocket(token);
//     set({ socketConnected: socket?.connected || false });
//   },

//   disconnectSocket: () => {
//     const socket = getUserSocket();
//     if (socket?.connected) {
//       socket.disconnect();
//     }
//     set({ socketConnected: false });
//   },

//   // ────────────────────────────────────────────────────────────────
//   // Socket event handlers (called by global listeners in userSocket.js)
//   // ────────────────────────────────────────────────────────────────
//   handleNewMessage: (msg) => {
//     console.log("📨 [USER] handleNewMessage called:", msg);
    
//     set((state) => {
//       // Prevent duplicate by ID
//       if (state.messages.some((m) => m.id === msg.id)) {
//         console.log("⚠️ Duplicate message (by ID) skipped:", msg.id);
//         return state;
//       }

//       const isCurrent = msg.bookingId === state.selectedBooking?.id;
//       let updatedMessages = [...state.messages];

//       // 1️⃣ Try to find optimistic message by tempId
//       let optimisticIndex = -1;
//       if (msg.tempId) {
//         optimisticIndex = updatedMessages.findIndex((m) => m.tempId === msg.tempId);
//         console.log("🔎 Searching for tempId:", msg.tempId, "→ Found at index:", optimisticIndex);
//       }

//       // 2️⃣ Fallback: match by content + sender + recent time (within 10 seconds)
//       if (optimisticIndex === -1 && msg.sender?.id && msg.content) {
//         const msgTime = new Date(msg.createdAt).getTime();
//         optimisticIndex = updatedMessages.findIndex((m) => 
//           m.isOptimistic === true &&
//           m.content === msg.content &&
//           m.sender?.id === msg.sender?.id &&
//           Math.abs(new Date(m.createdAt).getTime() - msgTime) < 10000
//         );
//         console.log("🔎 Fallback search by content+sender:", optimisticIndex);
//       }

//       if (optimisticIndex !== -1) {
//         console.log("✅ REPLACING optimistic message at index:", optimisticIndex);
//         updatedMessages[optimisticIndex] = {
//           ...msg,
//           tempId: undefined,
//           isOptimistic: false,
//           status: "sent",
//         };
//       } else {
//         console.log("➕ Adding new message (no optimistic found)");
//         updatedMessages.push({ ...msg, status: "sent" });
//       }

//       updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//       // Update sidebar unread count if not current chat
//       if (!isCurrent && msg.senderRole === "tutor") {
//         const updatedBookings = state.bookings.map((b) =>
//           b.id === msg.bookingId
//             ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
//             : b
//         );
//         return { messages: updatedMessages, bookings: updatedBookings };
//       }

//       return { messages: updatedMessages };
//     });
//   },

//   handleMessagesReadByTutor: (timestamp) => {
//     console.log("📖 Tutor read messages up to:", timestamp);
//     set((state) => ({
//       messages: state.messages.map((m) =>
//         m.senderRole === "user" && new Date(m.createdAt) <= new Date(timestamp)
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
//     const socket = getUserSocket();
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
//     const tutorId = get().selectedBooking?.tutorId;
//     const isOnline = users?.some((u) => u.id === tutorId && u.userType === "tutor");
//     set({ isParticipantOnline: !!isOnline });
//   },

//   handleBookingConfirmed: (data) => {
//     console.log("✅ Booking confirmed:", data);
//     const { bookingId } = data;
//     set((state) => ({
//       bookings: state.bookings.map((b) =>
//         b.id === bookingId ? { ...b, status: "confirmed" } : b
//       ),
//       selectedBooking:
//         state.selectedBooking?.id === bookingId
//           ? { ...state.selectedBooking, status: "confirmed" }
//           : state.selectedBooking,
//     }));
//   },

//   handleBookingCancelled: (data) => {
//     console.log("❌ Booking cancelled:", data);
//     const { bookingId } = data;
//     set((state) => ({
//       bookings: state.bookings.map((b) =>
//         b.id === bookingId ? { ...b, status: "cancelled" } : b
//       ),
//       selectedBooking:
//         state.selectedBooking?.id === bookingId
//           ? { ...state.selectedBooking, status: "cancelled" }
//           : state.selectedBooking,
//     }));
//   },

//   handleBookingRescheduled: (data) => {
//     console.log("📅 Booking rescheduled:", data);
//     get().fetchBookings(true); // Force refresh bookings list
//   },

//   handleBookingUpdated: (data) => {
//     console.log("🔄 Booking updated:", data);
//     const { bookingId } = data;
//     if (get().selectedBooking?.id === bookingId) {
//       get().fetchBooking(bookingId);
//     }
//   },

//   handleRescheduleProposed: (data) => {
//     console.log("📅 Reschedule proposed by tutor:", data);
//     const { bookingId, proposedAt } = data;
//     set((state) => ({
//       bookings: state.bookings.map((b) =>
//         b.id === bookingId
//           ? { ...b, status: "reschedule-proposed", proposedAt }
//           : b
//       ),
//       selectedBooking:
//         state.selectedBooking?.id === bookingId
//           ? { ...state.selectedBooking, status: "reschedule-proposed", proposedAt }
//           : state.selectedBooking,
//     }));
//   },

//   // ────────────────────────────────────────────────────────────────
//   // Core chat actions
//   // ────────────────────────────────────────────────────────────────
//   setSelectedBooking: (booking) => {
//     const prevId = get().selectedBooking?.id;
//     const socket = getUserSocket();

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
//           console.log("✅ User joined booking room:", booking.id);
//           get().markMessagesAsRead(booking.id);
//         } else {
//           console.error("❌ Failed to join room:", ack);
//         }
//       });
//     }

//     get().fetchMessages(booking.id);
//   },

//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     if (!content?.trim() || !bookingId) {
//       console.warn("[sendMessage] Invalid input");
//       return;
//     }

//     const socket = getUserSocket();
    
//     // Check socket connection
//     if (!socket?.connected) {
//       console.error("[sendMessage] Socket not connected - attempting reconnection");
      
//       // Try to reconnect
//       get().initializeSocket();
      
//       // Wait for connection
//       await new Promise((resolve) => {
//         const checkConnection = setInterval(() => {
//           const newSocket = getUserSocket();
//           if (newSocket?.connected) {
//             clearInterval(checkConnection);
//             resolve();
//           }
//         }, 100);
        
//         // Timeout after 3 seconds
//         setTimeout(() => {
//           clearInterval(checkConnection);
//           resolve();
//         }, 3000);
//       });
      
//       // Check again
//       const reconnectedSocket = getUserSocket();
//       if (!reconnectedSocket?.connected) {
//         console.error("[sendMessage] Failed to reconnect socket");
//         throw new Error("Cannot connect to chat server. Please refresh the page.");
//       }
//     }

//     const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
//     const userId = useAuthStore.getState().user?.id;
//     const userName = useAuthStore.getState().user?.name || 'You';

//     const optimisticMsg = {
//       tempId,
//       content,
//       messageType,
//       bookingId,
//       sender: { 
//         id: userId,
//         type: 'USER',
//         name: userName
//       },
//       senderRole: "user",
//       createdAt: new Date().toISOString(),
//       status: "sending",
//       isOptimistic: true,
//     };

//     console.log("📤 [USER] Sending message with tempId:", tempId);

//     // Add optimistic message
//     set((s) => ({
//       messages: [...s.messages, optimisticMsg],
//       isSending: true,
//     }));

//     try {
//       const activeSocket = getUserSocket();
      
//       // Emit with acknowledgment callback
//       await new Promise((resolve, reject) => {
//         const timeout = setTimeout(() => {
//           reject(new Error("Message send timeout"));
//         }, 10000); // 10 second timeout

//         activeSocket.emit("message:send", {
//           bookingId,
//           content: content.trim(),
//           messageType,
//           tempId,
//         }, (response) => {
//           clearTimeout(timeout);
          
//           if (response?.success) {
//             console.log("✅ Message sent successfully:", response);
//             resolve(response);
//           } else {
//             console.error("❌ Server rejected message:", response);
//             reject(new Error(response?.message || "Failed to send message"));
//           }
//         });
//       });
      
//     } catch (err) {
//       console.error("[sendMessage] failed:", err);
      
//       // Remove optimistic message on error
//       set((s) => ({
//         messages: s.messages.filter((m) => m.tempId !== tempId),
//         isSending: false,
//       }));
      
//       throw err;
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   sendTyping: (isTyping = true) => {
//     const { selectedBooking, socketConnected } = get();
    
//     if (!selectedBooking?.id || !socketConnected) {
//       console.warn("[sendTyping] Cannot send - no booking or socket disconnected");
//       return;
//     }

//     const socket = getUserSocket();
//     if (!socket?.connected) {
//       console.warn("[sendTyping] Socket not connected");
//       return;
//     }

//     const event = isTyping ? "typing:start" : "typing:stop";
    
//     console.log(`📝 [USER] Emitting ${event} for booking:`, selectedBooking.id);
    
//     socket.emit(event, {
//       bookingId: selectedBooking.id,
//       userType: "user",
//       userName: useAuthStore.getState().user?.name || "User"
//     });
//   },

//   markMessagesAsRead: (bookingId) => {
//     const socket = getUserSocket();
//     if (socket?.connected) {
//       socket.emit("messages:read", bookingId);
//     }

//     // Optimistic UI update
//     set((s) => ({
//       bookings: s.bookings.map((b) =>
//         b.id === bookingId ? { ...b, unread_count: 0 } : b
//       ),
//     }));
//   },

//   // ────────────────────────────────────────────────────────────────
//   // REST API calls
//   // ────────────────────────────────────────────────────────────────

//   fetchTutors: async ({ search, category } = {}) => {
//     const { hasFetchedTutors } = get();
    
//     // Skip if already fetched and no filters
//     if (hasFetchedTutors && !search && !category) {
//       console.log("[fetchTutors] Already fetched, skipping");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/tutors`;
//       const params = new URLSearchParams();
//       if (search) params.append("search", search);
//       if (category) params.append("category", category);
//       if (params.toString()) url += `?${params.toString()}`;

//       const res = await fetchWithAuth(url);

//       if (!res?.success || !Array.isArray(res.data)) {
//         console.warn("[fetchTutors] Invalid response", res);
//         set({ tutors: [], isLoading: false });
//         return;
//       }

//       const tutors = res.data.map((t) => ({
//         id: t.id || t._id,
//         name: t.name || "Unknown Tutor",
//         participant_name: t.name || "Unknown Tutor",
//         participant_role: "tutor",
//         avatar: t.avatar || null,
//         bio: t.bio || "",
//         subjects: t.subjects || [],
//         completedSessions: t.completedSessions || 0,
//         rating: t.rating || null,
//         isTutor: true,
//         last_message: "",
//         last_message_time: null,
//         status: "available",
//         unread_count: 0,
//       }));

//       set({ tutors, hasFetchedTutors: true, isLoading: false });
//       console.log(`[fetchTutors] Loaded ${tutors.length} tutors`);
//     } catch (err) {
//       console.error("[fetchTutors] Error:", err);
//       set({ tutors: [], isLoading: false, error: err.message });
//     }
//   },

//   fetchMessages: async (bookingId) => {
//     console.log("[fetchMessages] START - Booking:", bookingId);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
//       console.log("[fetchMessages] Fetching:", url);

//       const res = await fetchWithAuth(url);
//       console.log("[fetchMessages] Response:", res);

//       if (res.success && Array.isArray(res.data)) {
//         console.log("[fetchMessages] Messages loaded:", res.data.length);
//         set({ messages: res.data });
//         return res.data;
//       } else {
//         console.warn("[fetchMessages] No messages or invalid response", res);
//         set({ messages: [] });
//         return [];
//       }
//     } catch (err) {
//       console.error("[fetchMessages] CRASH:", err.message, err.stack);
//       set({ messages: [], error: err.message });
//       return [];
//     }
//   },

//   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
//     set({ isLoading: true, error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
//         method: "POST",
//         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
//       });

//       if (res.success && res.data) {
//         const newBooking = {
//           ...res.data,
//           participant_name: res.data.tutor?.name || "Unknown",
//           participant_role: "tutor",
//           isBooking: true,
//         };

//         set((state) => ({
//           bookings: [...state.bookings, newBooking],
//           tutors: state.tutors.filter((t) => t.id !== tutorId),
//           selectedBooking: newBooking,
//           isLoading: false,
//         }));

//         return newBooking;
//       }
//       throw new Error(res.message || "Failed to create booking");
//     } catch (err) {
//       set({ isLoading: false, error: err.message });
//       throw err;
//     }
//   },

//   fetchBookings: async (forceRefresh = false, { status = "", page = 1, limit = 30 } = {}) => {
//     const { hasFetchedBookings } = get();
    
//     // Skip if already fetched (unless forced or paginating)
//     if (hasFetchedBookings && !forceRefresh && page === 1) {
//       console.log("[fetchBookings] Already fetched, skipping");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/bookings?limit=${limit}`;
//       if (status) url += `&status=${status.toUpperCase()}`;
//       if (page > 1) url += `&page=${page}`;

//       const res = await fetchWithAuth(url);

//       if (!res?.success || !Array.isArray(res.data)) {
//         console.warn("[fetchBookings] Invalid response", res);
//         set({ bookings: [], isLoading: false });
//         return;
//       }

//       const bookings = res.data.map((b) => ({
//         id: b.id,
//         name: b.tutor?.name || "Unknown",
//         tutorId: b.tutorId || b.tutor?.id,
//         participant_name: b.tutor?.name || "Unknown",
//         participant_role: "tutor",
//         avatar: b.tutor?.avatar || null,
//         bio: b.tutor?.bio || "",
//         subjects: b.tutor?.subjects || [],
//         completedSessions: b.tutor?.completedSessions || 0,
//         rating: b.rating || null,
//         status: b.status?.toLowerCase() || "pending",
//         scheduledAt: b.scheduledAt || null,
//         duration: b.duration || null,
//         purpose: b.purpose || "",
//         last_message: b.lastMessage?.content || "",
//         last_message_time: b.lastMessage?.createdAt || null,
//         unread_count: b.unreadCount || 0,
//         isBooking: true,
//       }));

//       set((state) => {
//         let newSelected = state.selectedBooking;
//         if (newSelected?.isBooking) {
//           newSelected = bookings.find((b) => b.id === newSelected.id) || newSelected;
//         }
//         return { 
//           bookings, 
//           selectedBooking: newSelected, 
//           hasFetchedBookings: true,
//           isLoading: false 
//         };
//       });

//       console.log(`[fetchBookings] Loaded ${bookings.length} bookings`);
//     } catch (err) {
//       console.error("[fetchBookings] Error:", err);
//       set({ bookings: [], isLoading: false, error: err.message });
//     }
//   },

//   fetchBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/user/bookings/${bookingId}`;
//       console.log("[USER fetchBooking] Fetching:", url);

//       const res = await fetchWithAuth(url);

//       if (res.success && res.data) {
//         const booking = mapBookingToUI(res.data);
//         console.log("[USER fetchBooking] Success:", booking.id);

//         set({ selectedBooking: booking });

//         set((state) => ({
//           bookings: state.bookings.map((b) =>
//             b.id === bookingId ? booking : b
//           ),
//         }));

//         return booking;
//       } else {
//         console.warn("[USER fetchBooking] No data for ID:", bookingId);
//         return null;
//       }
//     } catch (err) {
//       console.error("[USER fetchBooking] FAILED:", err.message || err);
//       return null;
//     }
//   },

//   acceptReschedule: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       set((state) => ({
//         bookings: state.bookings.map((b) =>
//           b.id === bookingId ? { ...b, status: "confirmed" } : b
//         ),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "confirmed" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/user/bookings/${bookingId}/reschedule/accept`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => ({
//           bookings: state.bookings.map((b) =>
//             b.id === bookingId ? updatedBooking : b
//           ),
//           selectedBooking:
//             state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//         }));
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
//       const { fetchWithAuth } = useAuthStore.getState();

//       set((state) => ({
//         bookings: state.bookings.map((b) =>
//           b.id === bookingId ? { ...b, status: "pending" } : b
//         ),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "pending" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/user/bookings/${bookingId}/reschedule/reject`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ reason }),
//         }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
//         set((state) => ({
//           bookings: state.bookings.map((b) =>
//             b.id === bookingId ? updatedBooking : b
//           ),
//           selectedBooking:
//             state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//         }));
//         return res.data;
//       }

//       throw new Error("Reject reschedule failed");
//     } catch (err) {
//       console.error("rejectReschedule failed:", err);
//       throw err;
//     }
//   },

//   cancelBooking: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       if (!reason || !reason.trim()) {
//         throw new Error("Cancellation reason is required");
//       }

//       set((state) => ({
//         bookings: state.bookings.map((b) =>
//           b.id === bookingId ? { ...b, status: "cancelled" } : b
//         ),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "cancelled" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/user/bookings/${bookingId}/cancel`,
//         {
//           method: "PATCH",
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

//   // Force refresh methods
//   refreshBookings: async (options) => {
//     return get().fetchBookings(true, options);
//   },

//   refreshTutors: async (options) => {
//     set({ hasFetchedTutors: false });
//     return get().fetchTutors(options);
//   },

//   reset: () => {
//     get().disconnectSocket();
//     set({
//       bookings: [],
//       selectedBooking: null,
//       messages: [],
//       tutors: [],
//       isLoading: false,
//       isSending: false,
//       socketConnected: false,
//       isSomeoneTyping: false,
//       typingUserName: null,
//       isParticipantOnline: false,
//       hasFetchedBookings: false,
//       hasFetchedTutors: false,
//     });
//   },
// }));









// // src/store/userChatStore.js
// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { connectUserSocket, getUserSocket } from "@/lib/userChatSocket";

// const API_BASE = "https://fillops-server-5fuf.onrender.com";

// const mapBookingToUI = (booking) => ({
//   id: booking.id,
//   tutorId: booking.tutorId || booking.tutor?.id,
//   participant_name: booking.tutor?.name || "Tutor",
//   participant_role: "tutor",
//   last_message: booking.lastMessage?.content || "",
//   last_message_time: booking.lastMessage?.createdAt || null,
//   status: (booking.status || "pending").toLowerCase(),
//   scheduledAt: booking.scheduledAt || null,
//   proposedAt: booking.proposedAt || null,
//   duration: booking.duration || null,
//   unread_count: booking.unreadCount || 0,
//   purpose: booking.purpose || "",
//   subject: booking.subject?.name || "",
//   avatar: booking.tutor?.avatar || null,
//   isBooking: true,
// });

// export const useUserChatStore = create((set, get) => ({
//   // ✅ Separate buffers for each tab
//   allBookings: [], // All bookings (no filter)
//   pendingBookings: null, // Pending bookings buffer
//   confirmedBookings: null, // Confirmed bookings buffer
//   activeBookings: null, // Active bookings buffer
//   completedBookings: null, // Completed bookings buffer
  
//   bookings: [], // Currently displayed bookings
//   selectedBooking: null,
//   messages: [],
//   tutors: [],
//   isLoading: false,
//   isSending: false,
//   socketConnected: false,
//   isSomeoneTyping: false,
//   typingUserName: null,
//   isParticipantOnline: false,
  
//   // ✅ Track which tabs have been fetched
//   hasFetchedAllBookings: false,
//   hasFetchedPending: false,
//   hasFetchedConfirmed: false,
//   hasFetchedActive: false,
//   hasFetchedCompleted: false,
//   hasFetchedTutors: false,

//   // ────────────────────────────────────────────────────────────────
//   // Socket connection
//   // ────────────────────────────────────────────────────────────────
//   initializeSocket: () => {
//     console.log("[UserChatStore] initializeSocket called");
    
//     const token = useAuthStore.getState().accessToken;
//     if (!token) {
//       console.warn("[UserChatStore] No token → cannot initialize socket");
//       return;
//     }

//     const socket = connectUserSocket(token);
//     set({ socketConnected: socket?.connected || false });
//   },

//   disconnectSocket: () => {
//     const socket = getUserSocket();
//     if (socket?.connected) {
//       socket.disconnect();
//     }
//     set({ socketConnected: false });
//   },

//   // ────────────────────────────────────────────────────────────────
//   // Socket event handlers
//   // ────────────────────────────────────────────────────────────────
//   handleNewMessage: (msg) => {
//     console.log("📨 [USER] handleNewMessage called:", msg);
    
//     set((state) => {
//       if (state.messages.some((m) => m.id === msg.id)) {
//         console.log("⚠️ Duplicate message (by ID) skipped:", msg.id);
//         return state;
//       }

//       const isCurrent = msg.bookingId === state.selectedBooking?.id;
//       let updatedMessages = [...state.messages];

//       let optimisticIndex = -1;
//       if (msg.tempId) {
//         optimisticIndex = updatedMessages.findIndex((m) => m.tempId === msg.tempId);
//         console.log("🔎 Searching for tempId:", msg.tempId, "→ Found at index:", optimisticIndex);
//       }

//       if (optimisticIndex === -1 && msg.sender?.id && msg.content) {
//         const msgTime = new Date(msg.createdAt).getTime();
//         optimisticIndex = updatedMessages.findIndex((m) => 
//           m.isOptimistic === true &&
//           m.content === msg.content &&
//           m.sender?.id === msg.sender?.id &&
//           Math.abs(new Date(m.createdAt).getTime() - msgTime) < 10000
//         );
//         console.log("🔎 Fallback search by content+sender:", optimisticIndex);
//       }

//       if (optimisticIndex !== -1) {
//         console.log("✅ REPLACING optimistic message at index:", optimisticIndex);
//         updatedMessages[optimisticIndex] = {
//           ...msg,
//           tempId: undefined,
//           isOptimistic: false,
//           status: "sent",
//         };
//       } else {
//         console.log("➕ Adding new message (no optimistic found)");
//         updatedMessages.push({ ...msg, status: "sent" });
//       }

//       updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//       // Update all buffers with new message data
//       const updateBookingInBuffer = (buffer) => {
//         if (!buffer) return buffer;
//         return buffer.map((b) =>
//           b.id === msg.bookingId
//             ? { ...b, unread_count: isCurrent ? 0 : (b.unread_count || 0) + 1, last_message: msg.content }
//             : b
//         );
//       };

//       if (!isCurrent && msg.senderRole === "tutor") {
//         return {
//           messages: updatedMessages,
//           bookings: state.bookings.map((b) =>
//             b.id === msg.bookingId
//               ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
//               : b
//           ),
//           allBookings: updateBookingInBuffer(state.allBookings),
//           pendingBookings: updateBookingInBuffer(state.pendingBookings),
//           confirmedBookings: updateBookingInBuffer(state.confirmedBookings),
//           activeBookings: updateBookingInBuffer(state.activeBookings),
//           completedBookings: updateBookingInBuffer(state.completedBookings),
//         };
//       }

//       return { messages: updatedMessages };
//     });
//   },

//   handleMessagesReadByTutor: (timestamp) => {
//     console.log("📖 Tutor read messages up to:", timestamp);
//     set((state) => ({
//       messages: state.messages.map((m) =>
//         m.senderRole === "user" && new Date(m.createdAt) <= new Date(timestamp)
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
//     console.log("Kicked from session:", data);
//     const socket = getUserSocket();
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
//     const tutorId = get().selectedBooking?.tutorId;
//     const isOnline = users?.some((u) => u.id === tutorId && u.userType === "tutor");
//     set({ isParticipantOnline: !!isOnline });
//   },

//   handleBookingConfirmed: (data) => {
//     console.log("✅ Booking confirmed:", data);
//     const { bookingId } = data;
    
//     const updateStatus = (buffer) => {
//       if (!buffer) return buffer;
//       return buffer.map((b) => b.id === bookingId ? { ...b, status: "confirmed" } : b);
//     };

//     set((state) => ({
//       bookings: updateStatus(state.bookings),
//       allBookings: updateStatus(state.allBookings),
//       pendingBookings: updateStatus(state.pendingBookings),
//       confirmedBookings: updateStatus(state.confirmedBookings),
//       activeBookings: updateStatus(state.activeBookings),
//       completedBookings: updateStatus(state.completedBookings),
//       selectedBooking:
//         state.selectedBooking?.id === bookingId
//           ? { ...state.selectedBooking, status: "confirmed" }
//           : state.selectedBooking,
//     }));
//   },

//   handleBookingCancelled: (data) => {
//     console.log("❌ Booking cancelled:", data);
//     const { bookingId } = data;
    
//     const updateStatus = (buffer) => {
//       if (!buffer) return buffer;
//       return buffer.map((b) => b.id === bookingId ? { ...b, status: "cancelled" } : b);
//     };

//     set((state) => ({
//       bookings: updateStatus(state.bookings),
//       allBookings: updateStatus(state.allBookings),
//       pendingBookings: updateStatus(state.pendingBookings),
//       confirmedBookings: updateStatus(state.confirmedBookings),
//       activeBookings: updateStatus(state.activeBookings),
//       completedBookings: updateStatus(state.completedBookings),
//       selectedBooking:
//         state.selectedBooking?.id === bookingId
//           ? { ...state.selectedBooking, status: "cancelled" }
//           : state.selectedBooking,
//     }));
//   },

//   handleBookingRescheduled: (data) => {
//     console.log("📅 Booking rescheduled:", data);
//     get().refreshAllBookings();
//   },

//   handleBookingUpdated: (data) => {
//     console.log("🔄 Booking updated:", data);
//     const { bookingId } = data;
//     if (get().selectedBooking?.id === bookingId) {
//       get().fetchBooking(bookingId);
//     }
//   },

//   handleRescheduleProposed: (data) => {
//     console.log("📅 Reschedule proposed by tutor:", data);
//     const { bookingId, proposedAt } = data;
    
//     const updateStatus = (buffer) => {
//       if (!buffer) return buffer;
//       return buffer.map((b) =>
//         b.id === bookingId ? { ...b, status: "reschedule-proposed", proposedAt } : b
//       );
//     };

//     set((state) => ({
//       bookings: updateStatus(state.bookings),
//       allBookings: updateStatus(state.allBookings),
//       pendingBookings: updateStatus(state.pendingBookings),
//       confirmedBookings: updateStatus(state.confirmedBookings),
//       activeBookings: updateStatus(state.activeBookings),
//       completedBookings: updateStatus(state.completedBookings),
//       selectedBooking:
//         state.selectedBooking?.id === bookingId
//           ? { ...state.selectedBooking, status: "reschedule-proposed", proposedAt }
//           : state.selectedBooking,
//     }));
//   },

//   // ────────────────────────────────────────────────────────────────
//   // Core chat actions
//   // ────────────────────────────────────────────────────────────────
//   setSelectedBooking: (booking) => {
//     const prevId = get().selectedBooking?.id;
//     const socket = getUserSocket();

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

//     if (socket?.connected) {
//       socket.emit("join:booking", booking.id, (ack) => {
//         if (ack?.success) {
//           console.log("✅ User joined booking room:", booking.id);
//           get().markMessagesAsRead(booking.id);
//         } else {
//           console.error("❌ Failed to join room:", ack);
//         }
//       });
//     }

//     get().fetchMessages(booking.id);
//   },

//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     if (!content?.trim() || !bookingId) {
//       console.warn("[sendMessage] Invalid input");
//       return;
//     }

//     const socket = getUserSocket();
    
//     if (!socket?.connected) {
//       console.error("[sendMessage] Socket not connected - attempting reconnection");
      
//       get().initializeSocket();
      
//       await new Promise((resolve) => {
//         const checkConnection = setInterval(() => {
//           const newSocket = getUserSocket();
//           if (newSocket?.connected) {
//             clearInterval(checkConnection);
//             resolve();
//           }
//         }, 100);
        
//         setTimeout(() => {
//           clearInterval(checkConnection);
//           resolve();
//         }, 3000);
//       });
      
//       const reconnectedSocket = getUserSocket();
//       if (!reconnectedSocket?.connected) {
//         console.error("[sendMessage] Failed to reconnect socket");
//         throw new Error("Cannot connect to chat server. Please refresh the page.");
//       }
//     }

//     const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
//     const userId = useAuthStore.getState().user?.id;
//     const userName = useAuthStore.getState().user?.name || 'You';

//     const optimisticMsg = {
//       tempId,
//       content,
//       messageType,
//       bookingId,
//       sender: { 
//         id: userId,
//         type: 'USER',
//         name: userName
//       },
//       senderRole: "user",
//       createdAt: new Date().toISOString(),
//       status: "sending",
//       isOptimistic: true,
//     };

//     console.log("📤 [USER] Sending message with tempId:", tempId);

//     set((s) => ({
//       messages: [...s.messages, optimisticMsg],
//       isSending: true,
//     }));

//     try {
//       const activeSocket = getUserSocket();
      
//       await new Promise((resolve, reject) => {
//         const timeout = setTimeout(() => {
//           reject(new Error("Message send timeout"));
//         }, 10000);

//         activeSocket.emit("message:send", {
//           bookingId,
//           content: content.trim(),
//           messageType,
//           tempId,
//         }, (response) => {
//           clearTimeout(timeout);
          
//           if (response?.success) {
//             console.log("✅ Message sent successfully:", response);
//             resolve(response);
//           } else {
//             console.error("❌ Server rejected message:", response);
//             reject(new Error(response?.message || "Failed to send message"));
//           }
//         });
//       });
      
//     } catch (err) {
//       console.error("[sendMessage] failed:", err);
      
//       set((s) => ({
//         messages: s.messages.filter((m) => m.tempId !== tempId),
//         isSending: false,
//       }));
      
//       throw err;
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   sendTyping: (isTyping = true) => {
//     const { selectedBooking, socketConnected } = get();
    
//     if (!selectedBooking?.id || !socketConnected) {
//       console.warn("[sendTyping] Cannot send - no booking or socket disconnected");
//       return;
//     }

//     const socket = getUserSocket();
//     if (!socket?.connected) {
//       console.warn("[sendTyping] Socket not connected");
//       return;
//     }

//     const event = isTyping ? "typing:start" : "typing:stop";
    
//     console.log(`📝 [USER] Emitting ${event} for booking:`, selectedBooking.id);
    
//     socket.emit(event, {
//       bookingId: selectedBooking.id,
//       userType: "user",
//       userName: useAuthStore.getState().user?.name || "User"
//     });
//   },

//   markMessagesAsRead: (bookingId) => {
//     const socket = getUserSocket();
//     if (socket?.connected) {
//       socket.emit("messages:read", bookingId);
//     }

//     const updateUnreadInBuffer = (buffer) => {
//       if (!buffer) return buffer;
//       return buffer.map((b) => b.id === bookingId ? { ...b, unread_count: 0 } : b);
//     };

//     set((s) => ({
//       bookings: updateUnreadInBuffer(s.bookings),
//       allBookings: updateUnreadInBuffer(s.allBookings),
//       pendingBookings: updateUnreadInBuffer(s.pendingBookings),
//       confirmedBookings: updateUnreadInBuffer(s.confirmedBookings),
//       activeBookings: updateUnreadInBuffer(s.activeBookings),
//       completedBookings: updateUnreadInBuffer(s.completedBookings),
//     }));
//   },

//   // ────────────────────────────────────────────────────────────────
//   // ✅ TAB-SPECIFIC FETCH FUNCTIONS
//   // ────────────────────────────────────────────────────────────────

//   // Fetch bookings by status with caching per tab
//   fetchBookingsByStatus: async (status = "") => {
//     const statusLower = status.toLowerCase();
//     const state = get();

//     // Check if this specific tab has been fetched
//     const bufferMap = {
//       "": { buffer: state.allBookings, flag: state.hasFetchedAllBookings, flagName: "hasFetchedAllBookings", bufferName: "allBookings" },
//       "pending": { buffer: state.pendingBookings, flag: state.hasFetchedPending, flagName: "hasFetchedPending", bufferName: "pendingBookings" },
//       "confirmed": { buffer: state.confirmedBookings, flag: state.hasFetchedConfirmed, flagName: "hasFetchedConfirmed", bufferName: "confirmedBookings" },
//       "active": { buffer: state.activeBookings, flag: state.hasFetchedActive, flagName: "hasFetchedActive", bufferName: "activeBookings" },
//       "completed": { buffer: state.completedBookings, flag: state.hasFetchedCompleted, flagName: "hasFetchedCompleted", bufferName: "completedBookings" },
//     };

//     const tabInfo = bufferMap[statusLower] || bufferMap[""];

//     // If already fetched for this tab, use cached data
//     if (tabInfo.flag && tabInfo.buffer !== null) {
//       console.log(`[fetchBookingsByStatus] Using cached ${statusLower || 'all'} bookings`);
//       set({ bookings: tabInfo.buffer, isLoading: false });
//       return;
//     }

//     // Fetch from API
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/bookings?limit=50`;
//       if (statusLower) url += `&status=${statusLower.toUpperCase()}`;

//       const res = await fetchWithAuth(url);

//       if (!res?.success || !Array.isArray(res.data)) {
//         console.warn("[fetchBookingsByStatus] Invalid response", res);
//         set({ bookings: [], isLoading: false });
//         return;
//       }

//       const bookings = res.data.map((b) => ({
//         id: b.id,
//         name: b.tutor?.name || "Unknown",
//         tutorId: b.tutorId || b.tutor?.id,
//         participant_name: b.tutor?.name || "Unknown",
//         participant_role: "tutor",
//         avatar: b.tutor?.avatar || null,
//         bio: b.tutor?.bio || "",
//         subjects: b.tutor?.subjects || [],
//         completedSessions: b.tutor?.completedSessions || 0,
//         rating: b.rating || null,
//         status: b.status?.toLowerCase() || "pending",
//         scheduledAt: b.scheduledAt || null,
//         duration: b.duration || null,
//         purpose: b.purpose || "",
//         last_message: b.lastMessage?.content || "",
//         last_message_time: b.lastMessage?.createdAt || null,
//         unread_count: b.unreadCount || 0,
//         isBooking: true,
//       }));

//       // Update the specific buffer and flag
//       set({
//         bookings,
//         [tabInfo.bufferName]: bookings,
//         [tabInfo.flagName]: true,
//         isLoading: false,
//       });

//       console.log(`[fetchBookingsByStatus] Loaded ${bookings.length} ${statusLower || 'all'} bookings`);
//     } catch (err) {
//       console.error("[fetchBookingsByStatus] Error:", err);
//       set({ bookings: [], isLoading: false, error: err.message });
//     }
//   },

//   // ✅ Wrapper for backward compatibility
//   fetchBookings: async (forceRefresh = false, { status = "", page = 1, limit = 50 } = {}) => {
//     if (forceRefresh) {
//       // Clear all caches and re-fetch
//       set({
//         hasFetchedAllBookings: false,
//         hasFetchedPending: false,
//         hasFetchedConfirmed: false,
//         hasFetchedActive: false,
//         hasFetchedCompleted: false,
//         allBookings: [],
//         pendingBookings: null,
//         confirmedBookings: null,
//         activeBookings: null,
//         completedBookings: null,
//       });
//     }
    
//     return get().fetchBookingsByStatus(status);
//   },

//   // Force refresh all bookings (clears all caches)
//   refreshAllBookings: async () => {
//     set({
//       hasFetchedAllBookings: false,
//       hasFetchedPending: false,
//       hasFetchedConfirmed: false,
//       hasFetchedActive: false,
//       hasFetchedCompleted: false,
//       allBookings: [],
//       pendingBookings: null,
//       confirmedBookings: null,
//       activeBookings: null,
//       completedBookings: null,
//     });
//     return get().fetchBookingsByStatus("");
//   },

//   fetchTutors: async ({ search, category } = {}) => {
//     const { hasFetchedTutors, tutors } = get();
    
//     // Skip if already fetched
//     if (hasFetchedTutors && tutors.length > 0) {
//       console.log("[fetchTutors] Already fetched, using cached data");
//       return;
//     }

//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/tutors`;

//       const res = await fetchWithAuth(url);

//       if (!res?.success || !Array.isArray(res.data)) {
//         console.warn("[fetchTutors] Invalid response", res);
//         set({ tutors: [], isLoading: false });
//         return;
//       }

//       const tutors = res.data.map((t) => ({
//         id: t.id || t._id,
//         name: t.name || "Unknown Tutor",
//         participant_name: t.name || "Unknown Tutor",
//         participant_role: "tutor",
//         avatar: t.avatar || null,
//         bio: t.bio || "",
//         subjects: t.subjects || [],
//         completedSessions: t.completedSessions || 0,
//         rating: t.rating || null,
//         isTutor: true,
//         last_message: "",
//         last_message_time: null,
//         status: "available",
//         unread_count: 0,
//       }));

//       set({ 
//         tutors, 
//         hasFetchedTutors: true, 
//         isLoading: false 
//       });
      
//       console.log(`[fetchTutors] Loaded ${tutors.length} tutors`);
//     } catch (err) {
//       console.error("[fetchTutors] Error:", err);
//       set({ tutors: [], isLoading: false, error: err.message });
//     }
//   },

//   fetchMessages: async (bookingId) => {
//     console.log("[fetchMessages] START - Booking:", bookingId);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;

//       const res = await fetchWithAuth(url);

//       if (res.success && Array.isArray(res.data)) {
//         console.log("[fetchMessages] Messages loaded:", res.data.length);
//         set({ messages: res.data });
//         return res.data;
//       } else {
//         console.warn("[fetchMessages] No messages or invalid response", res);
//         set({ messages: [] });
//         return [];
//       }
//     } catch (err) {
//       console.error("[fetchMessages] CRASH:", err.message, err.stack);
//       set({ messages: [], error: err.message });
//       return [];
//     }
//   },

//   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
//     set({ isLoading: true, error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
//         method: "POST",
//         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
//       });

//       if (res.success && res.data) {
//         const newBooking = mapBookingToUI(res.data);

//         set((state) => ({
//           bookings: [newBooking, ...state.bookings],
//           allBookings: [newBooking, ...state.allBookings],
//           pendingBookings: state.pendingBookings ? [newBooking, ...state.pendingBookings] : null,
//           tutors: state.tutors.filter((t) => t.id !== tutorId),
//           selectedBooking: newBooking,
//           isLoading: false,
//         }));

//         return newBooking;
//       }
//       throw new Error(res.message || "Failed to create booking");
//     } catch (err) {
//       set({ isLoading: false, error: err.message });
//       throw err;
//     }
//   },

//   fetchBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/user/bookings/${bookingId}`;

//       const res = await fetchWithAuth(url);

//       if (res.success && res.data) {
//         const booking = mapBookingToUI(res.data);

//         const updateBookingInBuffer = (buffer) => {
//           if (!buffer) return buffer;
//           return buffer.map((b) => b.id === bookingId ? booking : b);
//         };

//         set((state) => ({
//           selectedBooking: booking,
//           bookings: updateBookingInBuffer(state.bookings),
//           allBookings: updateBookingInBuffer(state.allBookings),
//           pendingBookings: updateBookingInBuffer(state.pendingBookings),
//           confirmedBookings: updateBookingInBuffer(state.confirmedBookings),
//           activeBookings: updateBookingInBuffer(state.activeBookings),
//           completedBookings: updateBookingInBuffer(state.completedBookings),
//         }));

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

//   acceptReschedule: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const updateStatus = (buffer) => {
//         if (!buffer) return buffer;
//         return buffer.map((b) => b.id === bookingId ? { ...b, status: "confirmed" } : b);
//       };

//       set((state) => ({
//         bookings: updateStatus(state.bookings),
//         allBookings: updateStatus(state.allBookings),
//         pendingBookings: updateStatus(state.pendingBookings),
//         confirmedBookings: updateStatus(state.confirmedBookings),
//         activeBookings: updateStatus(state.activeBookings),
//         completedBookings: updateStatus(state.completedBookings),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "confirmed" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/user/bookings/${bookingId}/reschedule/accept`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
        
//         const updateBooking = (buffer) => {
//           if (!buffer) return buffer;
//           return buffer.map((b) => b.id === bookingId ? updatedBooking : b);
//         };

//         set((state) => ({
//           bookings: updateBooking(state.bookings),
//           allBookings: updateBooking(state.allBookings),
//           pendingBookings: updateBooking(state.pendingBookings),
//           confirmedBookings: updateBooking(state.confirmedBookings),
//           activeBookings: updateBooking(state.activeBookings),
//           completedBookings: updateBooking(state.completedBookings),
//           selectedBooking:
//             state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//         }));
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
//       const { fetchWithAuth } = useAuthStore.getState();

//       const updateStatus = (buffer) => {
//         if (!buffer) return buffer;
//         return buffer.map((b) => b.id === bookingId ? { ...b, status: "pending" } : b);
//       };

//       set((state) => ({
//         bookings: updateStatus(state.bookings),
//         allBookings: updateStatus(state.allBookings),
//         pendingBookings: updateStatus(state.pendingBookings),
//         confirmedBookings: updateStatus(state.confirmedBookings),
//         activeBookings: updateStatus(state.activeBookings),
//         completedBookings: updateStatus(state.completedBookings),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "pending" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/user/bookings/${bookingId}/reschedule/reject`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ reason }),
//         }
//       );

//       if (res.success && res.data) {
//         const updatedBooking = mapBookingToUI(res.data);
        
//         const updateBooking = (buffer) => {
//           if (!buffer) return buffer;
//           return buffer.map((b) => b.id === bookingId ? updatedBooking : b);
//         };

//         set((state) => ({
//           bookings: updateBooking(state.bookings),
//           allBookings: updateBooking(state.allBookings),
//           pendingBookings: updateBooking(state.pendingBookings),
//           confirmedBookings: updateBooking(state.confirmedBookings),
//           activeBookings: updateBooking(state.activeBookings),
//           completedBookings: updateBooking(state.completedBookings),
//           selectedBooking:
//             state.selectedBooking?.id === bookingId ? updatedBooking : state.selectedBooking,
//         }));
//         return res.data;
//       }

//       throw new Error("Reject reschedule failed");
//     } catch (err) {
//       console.error("rejectReschedule failed:", err);
//       throw err;
//     }
//   },

//   cancelBooking: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       if (!reason || !reason.trim()) {
//         throw new Error("Cancellation reason is required");
//       }

//       const updateStatus = (buffer) => {
//         if (!buffer) return buffer;
//         return buffer.map((b) => b.id === bookingId ? { ...b, status: "cancelled" } : b);
//       };

//       set((state) => ({
//         bookings: updateStatus(state.bookings),
//         allBookings: updateStatus(state.allBookings),
//         pendingBookings: updateStatus(state.pendingBookings),
//         confirmedBookings: updateStatus(state.confirmedBookings),
//         activeBookings: updateStatus(state.activeBookings),
//         completedBookings: updateStatus(state.completedBookings),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "cancelled" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/users/bookings/${bookingId}/cancel`,
//         {
//           method: "PATCH",
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

//   // Force refresh methods
//   refreshBookings: async (options) => {
//     return get().fetchBookings(true, options);
//   },

//   refreshTutors: async (options) => {
//     set({ hasFetchedTutors: false, tutors: [] });
//     return get().fetchTutors(options);
//   },

//   reset: () => {
//     get().disconnectSocket();
//     set({
//       bookings: [],
//       allBookings: [],
//       pendingBookings: null,
//       confirmedBookings: null,
//       activeBookings: null,
//       completedBookings: null,
//       selectedBooking: null,
//       messages: [],
//       tutors: [],
//       isLoading: false,
//       isSending: false,
//       socketConnected: false,
//       isSomeoneTyping: false,
//       typingUserName: null,
//       isParticipantOnline: false,
//       hasFetchedAllBookings: false,
//       hasFetchedPending: false,
//       hasFetchedConfirmed: false,
//       hasFetchedActive: false,
//       hasFetchedCompleted: false,
//       hasFetchedTutors: false,
//     });
//   },
// }));












// src/store/userChatStore.js


import { create } from "zustand";
import useAuthStore from "./authStore";
import { connectUserSocket, getUserSocket } from "@/lib/userChatSocket";

const API_BASE = "https://fillops-server-5fuf.onrender.com";

const mapBookingToUI = (booking) => ({
  id: booking.id,
  tutorId: booking.tutorId || booking.tutor?.id,
  participant_name: booking.tutor?.name || "Tutor",
  participant_role: "tutor",
  last_message: booking.lastMessage?.content || "",
  last_message_time: booking.lastMessage?.createdAt || null,
  status: (booking.status || "pending").toLowerCase(),
  scheduledAt: booking.scheduledAt || null,
  proposedAt: booking.proposedAt || null,
  duration: booking.duration || null,
  unread_count: booking.unreadCount || 0,
  purpose: booking.purpose || "",
  subject: booking.subject?.name || "",
  avatar: booking.tutor?.avatar || null,
  isBooking: true,
});

const updateStatusInAllBuffers = (state, bookingId, patch) => {
  const apply = (buffer) =>
    buffer ? buffer.map((b) => b.id === bookingId ? { ...b, ...patch } : b) : buffer;
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

export const useUserChatStore = create((set, get) => ({
  allBookings:       [],
  pendingBookings:   null,
  confirmedBookings: null,
  activeBookings:    null,
  completedBookings: null,
  bookings:          [],
  selectedBooking:   null,
  messages:          [],
  tutors:            [],
  isLoading:         false,
  isSending:         false,
  socketConnected:      false,
  isSomeoneTyping:      false,
  typingUserName:       null,
  isParticipantOnline:  false,
  onlineTutors: {},
  activeTab: "sessions",
  hasFetchedAllBookings: false,
  hasFetchedPending:     false,
  hasFetchedConfirmed:   false,
  hasFetchedActive:      false,
  hasFetchedCompleted:   false,
  hasFetchedTutors:      false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  initializeSocket: () => {
    const token = useAuthStore.getState().accessToken;
    if (!token) { console.warn("[UserChatStore] No token"); return; }
    const socket = connectUserSocket(token);
    set({ socketConnected: socket?.connected || false });
  },

  disconnectSocket: () => {
    const socket = getUserSocket();
    if (socket?.connected) socket.disconnect();
    set({ socketConnected: false });
  },

  initializeListeners: () => {
    const socket = getUserSocket();
    if (!socket) return;
    console.log("[UserChatStore] Attaching listeners");

    const handlers = {
      // ← FIX 3: emit getOnlineUsers on connect
      "connect": () => {
        set({ socketConnected: true });
        socket.emit("getOnlineUsers"); // ← ADDED: was missing, so online dots never appeared on load
        const { selectedBooking } = get();
        if (selectedBooking?.id) {
          socket.emit("join:booking", selectedBooking.id, (ack) => {
            if (ack?.success) get().markMessagesAsRead(selectedBooking.id);
          });
        }
      },
      "disconnect": () => set({ socketConnected: false, isParticipantOnline: false }),

      "message:new": (msg) => get().handleNewMessage(msg),

      "typing:start": (data) => {
        const { selectedBooking } = get();
        if (!data?.bookingId || data.bookingId !== selectedBooking?.id) return;
        if (data.userType === "user") return;
        set({ isSomeoneTyping: true, typingUserName: data.userName || "Tutor" });
      },
      "typing:stop": (data) => {
        const { selectedBooking } = get();
        if (!data?.bookingId || data.bookingId !== selectedBooking?.id) return;
        set({ isSomeoneTyping: false, typingUserName: null });
      },

      // ← FIX 4: handle both event names — some socket.io server versions send "onlineUsers"
      "users:online": (users) => get().handleOnlineUsers(users),
      "onlineUsers":  (users) => get().handleOnlineUsers(users), // ← ADDED

      "user:online": (data) => {
        if (data?.userType !== "tutor") return;
        set((s) => ({
          onlineTutors: { ...s.onlineTutors, [data.userId]: true },
          isParticipantOnline:
            s.selectedBooking?.tutorId === data.userId ? true : s.isParticipantOnline,
        }));
      },
      "user:offline": (data) => {
        if (data?.userType !== "tutor") return;
        set((s) => {
          const onlineTutors = { ...s.onlineTutors };
          delete onlineTutors[data.userId];
          return {
            onlineTutors,
            isParticipantOnline:
              s.selectedBooking?.tutorId === data.userId ? false : s.isParticipantOnline,
          };
        });
      },

      "messages:read": (timestamp) => get().handleMessagesReadByTutor(timestamp),

      "session:ended":   (data) => get().handleSessionEnded(data),
      "session:kick":    (data) => get().handleSessionKick(data),
      "session:expired": (data) => get().handleSessionExpired(data),

      "booking:confirmed": (data) => {
        set((s) => {
          const next = updateStatusInAllBuffers(s, data.bookingId, { status: "confirmed" });
          const shouldSwitch =
            s.selectedBooking?.id === data.bookingId && s.activeTab === "pending";
          return { ...next, ...(shouldSwitch ? { activeTab: "confirmed" } : {}) };
        });
      },

      "booking:active": (data) => {
        set((s) => {
          const next = updateStatusInAllBuffers(s, data.bookingId, { status: "active" });
          const shouldSwitch =
            s.selectedBooking?.id === data.bookingId &&
            (s.activeTab === "pending" || s.activeTab === "confirmed");
          return { ...next, ...(shouldSwitch ? { activeTab: "active" } : {}) };
        });
      },

      "booking:cancelled":           (data) => get().handleBookingCancelled(data),
      "booking:rescheduled":         () => get().refreshAllBookings(),
      "booking:updated":             (data) => get().handleBookingUpdated(data),
      "booking:reschedule_proposed": (data) => get().handleRescheduleProposed(data),
    };

    Object.entries(handlers).forEach(([e, fn]) => socket.on(e, fn));

    return () => {
      console.log("[UserChatStore] Removing listeners");
      Object.entries(handlers).forEach(([e, fn]) => socket.off(e, fn));
    };
  },

  // Shared handler — called by both "users:online" and "onlineUsers"
  handleOnlineUsers: (users) => {
    if (!Array.isArray(users)) return;
    const onlineTutors = {};
    users.forEach((u) => {
      if (u.userType === "tutor" || u.userType === "TUTOR") onlineTutors[u.id] = true;
    });
    const tutorId = get().selectedBooking?.tutorId;
    set({
      onlineTutors,
      isParticipantOnline: tutorId ? !!onlineTutors[tutorId] : false,
    });
  },

  handleNewMessage: (msg) => {
    set((state) => {
      if (state.messages.some((m) => m.id === msg.id)) return state;
      const isCurrent = msg.bookingId === state.selectedBooking?.id;
      let msgs = [...state.messages];

      let idx = msg.tempId ? msgs.findIndex((m) => m.tempId === msg.tempId) : -1;
      if (idx === -1 && msg.sender?.id && msg.content) {
        const t = new Date(msg.createdAt).getTime();
        idx = msgs.findIndex((m) =>
          m.isOptimistic && m.content === msg.content &&
          m.sender?.id === msg.sender?.id &&
          Math.abs(new Date(m.createdAt).getTime() - t) < 10000
        );
      }
      if (idx !== -1) {
        msgs[idx] = { ...msg, tempId: undefined, isOptimistic: false, status: "sent" };
      } else {
        msgs.push({ ...msg, status: "sent" });
      }
      msgs.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      const updateBuf = (buf) =>
        buf ? buf.map((b) =>
          b.id === msg.bookingId
            ? { ...b, unread_count: isCurrent ? 0 : (b.unread_count || 0) + 1, last_message: msg.content }
            : b
        ) : buf;

      if (!isCurrent && msg.senderRole === "tutor") {
        return {
          messages:          msgs,
          bookings:          updateBuf(state.bookings),
          allBookings:       updateBuf(state.allBookings),
          pendingBookings:   updateBuf(state.pendingBookings),
          confirmedBookings: updateBuf(state.confirmedBookings),
          activeBookings:    updateBuf(state.activeBookings),
          completedBookings: updateBuf(state.completedBookings),
        };
      }
      return { messages: msgs };
    });
  },

  rateSession: async (bookingId, rating, feedback) => {
    console.log("[rateSession] START - ID:", bookingId, "Rating:", rating, "Feedback:", feedback);
    set({ error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings/${bookingId}/rate`;
      console.log("[rateSession] POST to:", url);

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, feedback }),
      });

      console.log("[rateSession] Response:", res);

     if (res.success) {
    set((state) => ({
      bookings: state.bookings.map((b) => 
        b.id === bookingId 
          ? { ...b, rating, feedback } 
          : b
      ),
      selectedBooking: state.selectedBooking?.id === bookingId
        ? { ...state.selectedBooking, rating, feedback }
        : state.selectedBooking
    }));
    console.log("[rateSession] SUCCESS");
    return { success: true, message: res.message || "Thank you for your feedback!" };
}
      throw new Error(res.message || "Failed to rate session");
    } catch (err) {
      console.error("[rateSession] CRASH:", err.message, err.stack);
      set({ error: err.message });
      return false;
    }
  },
  // rateSession: async (bookingId, rating, feedback) => {
  //   console.log("[rateSession] START - ID:", bookingId, "Rating:", rating, "Feedback:", feedback);
  //   set({ error: null });

  //   try {
  //     const { fetchWithAuth } = useAuthStore.getState();
  //     const url = `${API_BASE}/api/users/bookings/${bookingId}/rate`;
  //     console.log("[rateSession] POST to:", url);

  //     const res = await fetchWithAuth(url, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ rating, feedback }),
  //     });

  //     console.log("[rateSession] Response:", res);

  //     if (res.success) {
  //       set((state) => ({
  //         bookings: state.bookings.map((b) => 
  //           b.id === bookingId 
  //             ? { ...b, rating, feedback } 
  //             : b
  //         ),
  //         selectedBooking: state.selectedBooking?.id === bookingId
  //           ? { ...state.selectedBooking, rating, feedback }
  //           : state.selectedBooking
  //       }));
  //       console.log("[rateSession] SUCCESS");
  //       return true;
  //     }
  //     throw new Error(res.message || "Failed to rate session");
  //   } catch (err) {
  //     console.error("[rateSession] CRASH:", err.message, err.stack);
  //     set({ error: err.message });
  //     return false;
  //   }
  // },

  handleMessagesReadByTutor: (timestamp) => {
    set((s) => ({
      messages: s.messages.map((m) =>
        m.senderRole === "user" && new Date(m.createdAt) <= new Date(timestamp)
          ? { ...m, isRead: true } : m
      ),
    }));
  },

  // ← FIX 1: was `s.selectedBooking?.id !== data.bookingId ? s : { selectedBooking: ... }`
  //   which only updated selectedBooking, leaving sidebar cards stale on "active"
  handleSessionEnded: (data) => {
    set((s) => updateStatusInAllBuffers(s, data.bookingId, { status: "completed" }));
  },

  handleSessionKick: (data) => {
    const socket = getUserSocket();
    if (socket && data?.bookingId) socket.emit("leave:booking", data.bookingId);
    set((s) => ({
      ...updateStatusInAllBuffers(s, data.bookingId, { status: "completed" }),
      selectedBooking: s.selectedBooking?.id === data?.bookingId ? null : s.selectedBooking,
      messages:        s.selectedBooking?.id === data?.bookingId ? [] : s.messages,
    }));
  },

  // ← FIX 2: same bug as handleSessionEnded above
  handleSessionExpired: (data) => {
    set((s) => updateStatusInAllBuffers(s, data.bookingId, { status: "completed" }));
  },

  handleBookingCancelled: (data) => {
    set((s) => updateStatusInAllBuffers(s, data.bookingId, { status: "cancelled" }));
  },

  handleBookingUpdated: (data) => {
    if (get().selectedBooking?.id === data.bookingId) get().fetchBooking(data.bookingId);
  },

  handleRescheduleProposed: (data) => {
    set((s) =>
      updateStatusInAllBuffers(s, data.bookingId, {
        status: "reschedule-proposed", proposedAt: data.proposedAt,
      })
    );
  },

  setSelectedBooking: (booking) => {
    const prevId = get().selectedBooking?.id;
    const socket = getUserSocket();
    if (prevId && socket?.connected) socket.emit("leave:booking", prevId);

    set({
      selectedBooking:     booking,
      messages:            [],
      isLoading:           true,
      isSomeoneTyping:     false,
      typingUserName:      null,
      isParticipantOnline: booking?.tutorId ? !!get().onlineTutors[booking.tutorId] : false,
    });

    if (!booking?.id) return;

    if (socket?.connected) {
      socket.emit("join:booking", booking.id, (ack) => {
        if (ack?.success) get().markMessagesAsRead(booking.id);
        else console.error("❌ Failed to join room:", ack);
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
        const check = setInterval(() => {
          if (getUserSocket()?.connected) { clearInterval(check); resolve(); }
        }, 100);
        setTimeout(() => { clearInterval(check); resolve(); }, 3000);
      });
      socket = getUserSocket();
      if (!socket?.connected)
        throw new Error("Cannot connect to chat server. Please refresh the page.");
    }

    const tempId   = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    const userId   = useAuthStore.getState().user?.id;
    const userName = useAuthStore.getState().user?.name || "You";

    set((s) => ({
      messages: [...s.messages, {
        tempId, content, messageType, bookingId,
        sender: { id: userId, type: "USER", name: userName },
        senderRole: "user", createdAt: new Date().toISOString(),
        status: "sending", isOptimistic: true,
      }],
      isSending: true,
    }));

    try {
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Message send timeout")), 10000);
        socket.emit("message:send",
          { bookingId, content: content.trim(), messageType, tempId },
          (response) => {
            clearTimeout(timeout);
            response?.success ? resolve(response)
              : reject(new Error(response?.message || "Failed to send"));
          }
        );
      });
    } catch (err) {
      set((s) => ({ messages: s.messages.filter((m) => m.tempId !== tempId), isSending: false }));
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
    const clr = (buf) => buf ? buf.map((b) => b.id === bookingId ? { ...b, unread_count: 0 } : b) : buf;
    set((s) => ({
      bookings:          clr(s.bookings),
      allBookings:       clr(s.allBookings),
      pendingBookings:   clr(s.pendingBookings),
      confirmedBookings: clr(s.confirmedBookings),
      activeBookings:    clr(s.activeBookings),
      completedBookings: clr(s.completedBookings),
    }));
  },

  fetchBookingsByStatus: async (status = "") => {
    const statusLower = status.toLowerCase();
    const state = get();
    const bufferMap = {
      "":          { buffer: state.allBookings,       flag: state.hasFetchedAllBookings, flagName: "hasFetchedAllBookings", bufferName: "allBookings" },
      "pending":   { buffer: state.pendingBookings,   flag: state.hasFetchedPending,     flagName: "hasFetchedPending",     bufferName: "pendingBookings" },
      "confirmed": { buffer: state.confirmedBookings, flag: state.hasFetchedConfirmed,   flagName: "hasFetchedConfirmed",   bufferName: "confirmedBookings" },
      "active":    { buffer: state.activeBookings,    flag: state.hasFetchedActive,      flagName: "hasFetchedActive",      bufferName: "activeBookings" },
      "completed": { buffer: state.completedBookings, flag: state.hasFetchedCompleted,   flagName: "hasFetchedCompleted",   bufferName: "completedBookings" },
    };
    const tabInfo = bufferMap[statusLower] || bufferMap[""];
    if (tabInfo.flag && tabInfo.buffer !== null) {
      set({ bookings: tabInfo.buffer, isLoading: false });
      return;
    }
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      let url = `${API_BASE}/api/users/bookings?limit=50`;
      if (statusLower) url += `&status=${statusLower.toUpperCase()}`;
      const res = await fetchWithAuth(url);
      if (!res?.success || !Array.isArray(res.data)) { set({ bookings: [], isLoading: false }); return; }
      const bookings = res.data.map((b) => ({
        id: b.id, name: b.tutor?.name || "Unknown", tutorId: b.tutorId || b.tutor?.id,
        participant_name: b.tutor?.name || "Unknown", participant_role: "tutor",
        avatar: b.tutor?.avatar || null, bio: b.tutor?.bio || "",
        subjects: b.tutor?.subjects || [], completedSessions: b.tutor?.completedSessions || 0,
        rating: b.rating || null, status: b.status?.toLowerCase() || "pending",
        scheduledAt: b.scheduledAt || null, duration: b.duration || null,
        purpose: b.purpose || "", last_message: b.lastMessage?.content || "",
        last_message_time: b.lastMessage?.createdAt || null,
        unread_count: b.unreadCount || 0, isBooking: true,
      }));
      set({ bookings, [tabInfo.bufferName]: bookings, [tabInfo.flagName]: true, isLoading: false });
    } catch (err) {
      console.error("[fetchBookingsByStatus]", err);
      set({ bookings: [], isLoading: false });
    }
  },

  fetchBookings: async (forceRefresh = false, { status = "" } = {}) => {
    if (forceRefresh) {
      set({
        hasFetchedAllBookings: false, hasFetchedPending: false,
        hasFetchedConfirmed: false, hasFetchedActive: false, hasFetchedCompleted: false,
        allBookings: [], pendingBookings: null, confirmedBookings: null,
        activeBookings: null, completedBookings: null,
      });
    }
    return get().fetchBookingsByStatus(status);
  },

  refreshAllBookings: async () => {
    set({
      hasFetchedAllBookings: false, hasFetchedPending: false,
      hasFetchedConfirmed: false, hasFetchedActive: false, hasFetchedCompleted: false,
      allBookings: [], pendingBookings: null, confirmedBookings: null,
      activeBookings: null, completedBookings: null,
    });
    return get().fetchBookingsByStatus("");
  },

  fetchTutors: async () => {
    const { hasFetchedTutors, tutors } = get();
    if (hasFetchedTutors && tutors.length > 0) return;
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/tutors`);
      if (!res?.success || !Array.isArray(res.data)) { set({ tutors: [], isLoading: false }); return; }
      const mapped = res.data.map((t) => ({
        id: t.id || t._id, name: t.name || "Unknown Tutor",
        participant_name: t.name || "Unknown Tutor", participant_role: "tutor",
        avatar: t.avatar || null, bio: t.bio || "", subjects: t.subjects || [],
        completedSessions: t.completedSessions || 0, rating: t.rating || null,
        isTutor: true, last_message: "", last_message_time: null,
        status: "available", unread_count: 0,
      }));
      set({ tutors: mapped, hasFetchedTutors: true, isLoading: false });
    } catch (err) {
      console.error("[fetchTutors]", err);
      set({ tutors: [], isLoading: false });
    }
  },

  fetchMessages: async (bookingId) => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`);
      if (res.success && Array.isArray(res.data)) {
        set({ messages: res.data, isLoading: false });
        return res.data;
      }
      set({ messages: [], isLoading: false });
      return [];
    } catch (err) {
      console.error("[fetchMessages]", err);
      set({ messages: [], isLoading: false });
      return [];
    }
  },

  createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
        method: "POST", body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
      });
      if (res.success && res.data) {
        const newBooking = mapBookingToUI(res.data);
        set((s) => ({
          bookings: [newBooking, ...s.bookings], allBookings: [newBooking, ...s.allBookings],
          pendingBookings: s.pendingBookings ? [newBooking, ...s.pendingBookings] : null,
          tutors: s.tutors.filter((t) => t.id !== tutorId),
          selectedBooking: newBooking, isLoading: false,
        }));
        return newBooking;
      }
      throw new Error(res.message || "Failed to create booking");
    } catch (err) {
      set({ isLoading: false });
      throw err;
    }
  },

  fetchBooking: async (bookingId) => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/user/bookings/${bookingId}`);
      if (res.success && res.data) {
        const booking = mapBookingToUI(res.data);
        const upd = (buf) => buf ? buf.map((b) => b.id === bookingId ? booking : b) : buf;
        set((s) => ({
          selectedBooking: booking, bookings: upd(s.bookings), allBookings: upd(s.allBookings),
          pendingBookings: upd(s.pendingBookings), confirmedBookings: upd(s.confirmedBookings),
          activeBookings: upd(s.activeBookings), completedBookings: upd(s.completedBookings),
        }));
        return booking;
      }
      return null;
    } catch (err) { console.error("[fetchBooking]", err); return null; }
  },

  acceptReschedule: async (bookingId) => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      set((s) => updateStatusInAllBuffers(s, bookingId, { status: "confirmed" }));
      const res = await fetchWithAuth(
        `${API_BASE}/api/user/bookings/${bookingId}/reschedule/accept`, { method: "PATCH" }
      );
      if (res.success && res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        const upd = (buf) => buf ? buf.map((b) => b.id === bookingId ? updatedBooking : b) : buf;
        set((s) => ({
          bookings: upd(s.bookings), allBookings: upd(s.allBookings),
          pendingBookings: upd(s.pendingBookings), confirmedBookings: upd(s.confirmedBookings),
          activeBookings: upd(s.activeBookings), completedBookings: upd(s.completedBookings),
          selectedBooking: s.selectedBooking?.id === bookingId ? updatedBooking : s.selectedBooking,
        }));
        return res.data;
      }
      throw new Error("Accept reschedule failed");
    } catch (err) { console.error("acceptReschedule failed:", err); throw err; }
  },

  rejectReschedule: async (bookingId, reason) => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      set((s) => updateStatusInAllBuffers(s, bookingId, { status: "pending" }));
      const res = await fetchWithAuth(
        `${API_BASE}/api/user/bookings/${bookingId}/reschedule/reject`,
        { method: "PATCH", body: JSON.stringify({ reason }) }
      );
      if (res.success && res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        const upd = (buf) => buf ? buf.map((b) => b.id === bookingId ? updatedBooking : b) : buf;
        set((s) => ({
          bookings: upd(s.bookings), allBookings: upd(s.allBookings),
          pendingBookings: upd(s.pendingBookings), confirmedBookings: upd(s.confirmedBookings),
          activeBookings: upd(s.activeBookings), completedBookings: upd(s.completedBookings),
          selectedBooking: s.selectedBooking?.id === bookingId ? updatedBooking : s.selectedBooking,
        }));
        return res.data;
      }
      throw new Error("Reject reschedule failed");
    } catch (err) { console.error("rejectReschedule failed:", err); throw err; }
  },

  cancelBooking: async (bookingId, reason) => {
    if (!reason?.trim()) throw new Error("Cancellation reason is required");
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      set((s) => updateStatusInAllBuffers(s, bookingId, { status: "cancelled" }));
      const res = await fetchWithAuth(
        `${API_BASE}/api/users/bookings/${bookingId}/cancel`,
        { method: "PATCH", body: JSON.stringify({ reason: reason.trim() }) }
      );
      if (res.success) return true;
      throw new Error(res.message || "Cancel failed");
    } catch (err) { console.error("cancelBooking failed:", err); throw err; }
  },

  

  refreshBookings: async (options) => get().fetchBookings(true, options),
  refreshTutors: async () => { set({ hasFetchedTutors: false, tutors: [] }); return get().fetchTutors(); },

  reset: () => {
    get().disconnectSocket();
    set({
      bookings: [], allBookings: [], pendingBookings: null, confirmedBookings: null,
      activeBookings: null, completedBookings: null, selectedBooking: null,
      messages: [], tutors: [], isLoading: false, isSending: false,
      socketConnected: false, isSomeoneTyping: false, typingUserName: null,
      isParticipantOnline: false, onlineTutors: {}, activeTab: "sessions",
      hasFetchedAllBookings: false, hasFetchedPending: false, hasFetchedConfirmed: false,
      hasFetchedActive: false, hasFetchedCompleted: false, hasFetchedTutors: false,
    });
  },
}));