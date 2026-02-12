// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { io } from "socket.io-client"; // ← make sure installed: npm i socket.io-client



// const API_BASE = "https://fillops-server-5fuf.onrender.com";
// let socket = null;
// export const useUserChatStore = create((set, get) => ({
//   // ---------------- STATES ----------------
//   tutors: [],
//   bookings: [],
//   selectedBooking: null,
//   messages: [],
//   chatHistory: [],
//   isLoading: false,
//   isSending: false,
//   error: null,


//   // ─── Socket Initialization ──────────────────────────────────
//   connectSocket: () => {
//     if (socket) return;

//     const token = useAuthStore.getState().accessToken;
//     if (!token) {
//       console.warn("[UserSocket] No token → cannot connect");
//       return;
//     }

//     socket = io(API_BASE, {
//       auth: { token },
//       autoConnect: false,
//       transports: ["websocket"],
//       reconnection: true,
//       reconnectionAttempts: 5,
//     });

//     socket.connect();

//     socket.on("connect", () => {
//       console.log("%c█ USER SOCKET CONNECTED █", "background:#28a745;color:white;padding:4px 8px;");
//       set({ socketConnected: true });
//     });

//     socket.on("connect_error", (err) => {
//       console.error("[UserSocket] Connection failed:", err.message);
//       set({ socketConnected: false });
//     });

//     socket.on("disconnect", () => {
//       console.log("[UserSocket] Disconnected");
//       set({ socketConnected: false });
//     });

//     // ─── Real-time message received ─────────────────────────────
//     socket.on("newMessage", (message) => {
//       const { selectedBooking } = get();
//       if (message.bookingId === selectedBooking?.id) {
//         set((state) => ({
//           messages: [...state.messages, message],
//         }));
//       }

//       // Update last message preview in booking list
//       set((state) => ({
//         bookings: state.bookings.map((b) =>
//           b.id === message.bookingId
//             ? {
//                 ...b,
//                 last_message: message.content,
//                 last_message_time: message.createdAt,
//                 unread_count: b.unread_count + 1,
//               }
//             : b
//         ),
//       }));
//     });

//     // Optional: confirmation / error from server
//     socket.on("messageConfirmed", ({ tempId, message }) => {
//       set((state) => ({
//         messages: state.messages.map((m) =>
//           m.tempId === tempId ? { ...message, tempId: undefined, isSending: false } : m
//         ),
//       }));
//     });

//     socket.on("messageError", ({ tempId, error }) => {
//       set((state) => ({
//         messages: state.messages.filter((m) => m.tempId !== tempId),
//         error: error || "Message failed to send",
//       }));
//     });
//   },

//   disconnectSocket: () => {
//     if (socket) {
//       socket.disconnect();
//       socket = null;
//       set({ socketConnected: false });
//     }
//   },

//   // ─── Send message via Socket.IO ─────────────────────────────
//   sendMessage: async (bookingId, content) => {
//     if (!bookingId || !content.trim()) return;

//     const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

//     const optimistic = {
//       tempId,
//       bookingId,
//       content,
//       sender: {
//         id: useAuthStore.getState().user?.id,
//         name: useAuthStore.getState().user?.name || "You",
//         type: "USER",
//       },
//       createdAt: new Date().toISOString(),
//       isSending: true,
//     };

//     set((state) => ({
//       messages: [...state.messages, optimistic],
//       isSending: true,
//     }));

//     if (!socket?.connected) {
//       get().connectSocket();
//       // Wait a tiny bit for connection — not ideal but works for demo
//       await new Promise((r) => setTimeout(r, 800));
//     }

//     if (socket?.connected) {
//       socket.emit("sendMessage", {
//         bookingId,
//         content,
//         messageType: "TEXT",
//         tempId,
//       });

//       console.log("[UserSocket] Emitted sendMessage:", { bookingId, tempId });
//     } else {
//       // Fallback to HTTP if socket not ready
//       console.warn("[UserSocket] Socket not connected → falling back to HTTP");
//       try {
//         const { fetchWithAuth } = useAuthStore.getState();
//         const res = await fetchWithAuth(
//           `${API_BASE}/api/users/bookings/${bookingId}/messages`,
//           {
//             method: "POST",
//             body: JSON.stringify({ content, messageType: "TEXT" }),
//           }
//         );

//         if (res.success && res.data) {
//           set((state) => ({
//             messages: state.messages.map((m) =>
//               m.tempId === tempId ? { ...res.data, isSending: false } : m
//             ),
//           }));
//         }
//       } catch (err) {
//         set((state) => ({
//           messages: state.messages.filter((m) => m.tempId !== tempId),
//         }));
//       }
//     }

//     set({ isSending: false });
//   },

//   _refreshBookingsSilent: async ({ status = "" } = {}) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/bookings`;
//       const params = new URLSearchParams();
//       if (status) params.append("status", status.toUpperCase());
//       if (params.toString()) url += `?${params.toString()}`;

//       const res = await fetchWithAuth(url);

//       if (!res?.success || !Array.isArray(res?.data)) {
//         console.warn("[Silent Refresh] Invalid response:", res);
//         return;
//       }

//       const mapped = res.data.map((booking) => ({
//         id: booking.id,
//         tutorId: booking.tutorId || booking.tutor?.id,
//         participant_name: booking.tutor?.name || "Unknown",
//         participant_role: "tutor",
//         last_message: booking.lastMessage?.content || "",
//         last_message_time: booking.lastMessage?.createdAt || null,
//         status: booking.status || "pending",
//         scheduledAt: booking.scheduledAt || null,
//         duration: booking.duration || null,
//         unread_count: booking.unreadCount || 0,
//         purpose: booking.purpose || "",
//         avatar: booking.tutor?.avatar || null,
//         bio: booking.tutor?.bio || "",
//         subjects: booking.tutor?.subjects || [],
//         completedSessions: booking.tutor?.completedSessions || 0,
//         rating: booking.rating || null,
//         feedback: booking.feedback || null,
//         isBooking: true,
//       }));

//       set((state) => {
//         const newBookings = mapped;
//         let newSelected = state.selectedBooking;
//         if (newSelected?.isBooking) {
//           newSelected = newBookings.find(b => b.id === newSelected.id) || newSelected;
//         }
//         return {
//           bookings: newBookings,
//           selectedBooking: newSelected,
//         };
//       });
//     } catch (err) {
//       console.warn("[Silent Refresh] Failed:", err);
//     }
//   },

//   fetchTutors: async ({ search, category } = {}) => {
//     console.log("[fetchTutors] START - params:", { search, category });
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/tutors`;
//       const params = new URLSearchParams();
//       if (search) params.append("search", search);
//       if (category) params.append("category", category);
//       if (params.toString()) url += `?${params.toString()}`;

//       console.log("[fetchTutors] Fetching URL:", url);
//       const res = await fetchWithAuth(url);
//       console.log("[fetchTutors] Full API response:", res);

//       if (!res?.success) {
//         console.warn("[fetchTutors] API did not return success flag", res);
//         set({ tutors: [], isLoading: false });
//         return;
//       }

//       let rawTutors = res.data || res.tutors || [];
//       console.log("[fetchTutors] Raw tutors count:", rawTutors.length);

//       if (!Array.isArray(rawTutors)) {
//         console.error("[fetchTutors] Tutors response is NOT an array!", rawTutors);
//         set({ tutors: [], isLoading: false });
//         return;
//       }

//       const mappedTutors = rawTutors.map((tutor) => ({
//         id: tutor.id || tutor._id,
//         name: tutor.name || "Unknown Tutor", // ✅ Direct name field
//         avatar: tutor.avatar || null,
//         bio: tutor.bio || "",
//         subjects: tutor.subjects || [],
//         completedSessions: tutor.completedSessions || 0,
//         rating: tutor.rating || null,
//         isTutor: true,
//         // Legacy support
//         participant_name: tutor.name || "Unknown Tutor",
//         participant_role: "tutor",
//         last_message: "",
//         last_message_time: null,
//         status: "available",
//         scheduledAt: null,
//         duration: null,
//         unread_count: 0,
//       }));

//       console.log("[fetchTutors] SUCCESS - Loaded", mappedTutors.length, "tutors");
//       set({ tutors: mappedTutors, isLoading: false });
//     } catch (err) {
//       console.error("[fetchTutors] CRASH:", err.message, err.stack);
//       set({ tutors: [], isLoading: false, error: err.message });
//     }
//   },

//   fetchBookings: async ({ status = "", page = 1, limit = 100 } = {}) => {
//     console.log("[fetchBookings] START - status:", status, "page:", page, "limit:", limit);
//     set({ isLoading: true, error: null });

//     const authState = useAuthStore.getState();
//     if (!authState?.fetchWithAuth) {
//       console.error("[fetchBookings] fetchWithAuth not available");
//       set({ isLoading: false, error: "Auth not initialized" });
//       return;
//     }

//     const { fetchWithAuth } = authState;

//     try {
//       let url = `${API_BASE}/api/users/bookings`;
//       const params = new URLSearchParams();
//       if (status) params.append("status", status.toUpperCase());
//       if (page > 1) params.append("page", page);
//       params.append("limit", limit); // ✅ Add limit parameter
//       if (params.toString()) url += `?${params.toString()}`;

//       console.log("[fetchBookings] Fetching URL:", url);
//       const res = await fetchWithAuth(url);
//       console.log("[fetchBookings] Response:", res);

//       if (res.success && Array.isArray(res.data)) {
//         const mappedBookings = res.data.map((booking) => ({
//           id: booking.id,
//           name: booking.tutor?.name || "Unknown",
//           tutorId: booking.tutorId || booking.tutor?.id,
//           avatar: booking.tutor?.avatar || null,
//           bio: booking.tutor?.bio || "",
//           subjects: booking.tutor?.subjects || [],
//           completedSessions: booking.tutor?.completedSessions || 0,
//           rating: booking.rating || null,
//           feedback: booking.feedback || null,
//           status: booking.status || "pending",
//           scheduledAt: booking.scheduledAt || null,
//           duration: booking.duration || null,
//           purpose: booking.purpose || "",
//           unread_count: booking.unreadCount || 0,
//           isBooking: true,
//           participant_name: booking.tutor?.name || "Unknown",
//           participant_role: "tutor",
//           last_message: booking.lastMessage?.content || "",
//           last_message_time: booking.lastMessage?.createdAt || null,
//         }));

//         const currentSelection = get().selectedBooking;
//         let newSelection = currentSelection;
        
//         if (currentSelection?.isBooking) {
//           const updatedBooking = mappedBookings.find(b => b.id === currentSelection.id);
//           newSelection = updatedBooking || currentSelection;
//         }

//         console.log("[fetchBookings] SUCCESS - Loaded", mappedBookings.length, "bookings");
//         set({ 
//           bookings: mappedBookings,
//           selectedBooking: newSelection,
//           isLoading: false 
//         });
//       } else {
//         console.warn("[fetchBookings] No success or data not array", res);
//         set({ bookings: [], isLoading: false });
//       }
//     } catch (err) {
//       console.error("[fetchBookings] CRASH:", err);
//       set({ isLoading: false, error: err.message });
//     }
//   },

//   // ---------------- FETCH TUTORS ----------------
// fetchTutors: async ({ search, category } = {}) => {
//   console.log("[fetchTutors] START - params:", { search, category });
//   set({ isLoading: true, error: null });

//   try {
//     const { fetchWithAuth } = useAuthStore.getState();
//     let url = `${API_BASE}/api/users/tutors`;
//     const params = new URLSearchParams();
//     if (search) params.append("search", search);
//     if (category) params.append("category", category);
//     if (params.toString()) url += `?${params.toString()}`;

//     console.log("[fetchTutors] Fetching URL:", url);

//     const res = await fetchWithAuth(url);

//     console.log("[fetchTutors] Full API response:", res);

//     if (!res?.success) {
//       console.warn("[fetchTutors] API did not return success flag", res);
//       set({ tutors: [], isLoading: false });
//       return;
//     }

//     let rawTutors = res.data || res.tutors || [];
//     console.log("[fetchTutors] Raw tutors count:", rawTutors.length);

//     if (!Array.isArray(rawTutors)) {
//       console.error("[fetchTutors] Tutors response is NOT an array!", rawTutors);
//       set({ tutors: [], isLoading: false });
//       return;
//     }

//     const mappedTutors = rawTutors.map((tutor) => {
//       const mapped = {
//         id: tutor.id || tutor._id,
//         name: tutor.name || "Unknown Tutor", // ✅ ADD THIS LINE
//         participant_name: tutor.name || "Unknown Tutor",
//         participant_role: "tutor",
//         avatar: tutor.avatar || null,
//         bio: tutor.bio || "",
//         subjects: tutor.subjects || [],
//         completedSessions: tutor.completedSessions || 0,
//         rating: tutor.rating || null,
//         isTutor: true,
//         last_message: "",
//         last_message_time: null,
//         status: "available",
//         scheduledAt: null,
//         duration: null,
//         unread_count: 0,
//       };
//       console.log("✅ Mapped tutor:", mapped.name, "ID:", mapped.id); // ✅ ADD DEBUG LOG
//       return mapped;
//     });

//     const availableTutors = mappedTutors;
//     console.log(
//       `[fetchTutors] SUCCESS - Loaded ${mappedTutors.length} tutors → showing ${availableTutors.length}`
//     );

//     set({ tutors: availableTutors, isLoading: false });
//   } catch (err) {
//     console.error("[fetchTutors] CRASH:", err.message, err.stack);
//     set({ tutors: [], isLoading: false, error: err.message });
//   }
// },

//   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
//     console.log("[createBooking] START - params:", { tutorId, purpose, scheduledAt, duration });
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings`;
//       console.log("[createBooking] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
//       });

//       console.log("[createBooking] Full response:", res);

//       if (res.success && res.data) {
//         const newBooking = {
//           id: res.data.id,
//           tutorId: res.data.tutorId || res.data.tutor?.id,
//           participant_name: res.data.tutor?.name || "Unknown",
//           participant_role: "tutor",
//           last_message: "",
//           last_message_time: null,
//           status: res.data.status || "pending",
//           scheduledAt: res.data.scheduledAt || null,
//           duration: res.data.duration || null,
//           unread_count: 0,
//           purpose: res.data.purpose || purpose,
//           avatar: res.data.tutor?.avatar || null,
//           bio: res.data.tutor?.bio || "",
//           subjects: res.data.tutor?.subjects || [],
//           completedSessions: res.data.tutor?.completedSessions || 0,
//           isBooking: true,
//         };
//         console.log("[createBooking] Created new booking:", newBooking.id, newBooking.participant_name);

//         set((state) => ({ 
//           bookings: [...state.bookings, newBooking],
//           tutors: state.tutors.filter(t => t.id !== tutorId),
//           selectedBooking: state.selectedBooking?.id === tutorId ? newBooking : state.selectedBooking,
//           isLoading: false
//         }));

//         return newBooking;
//       }
//       throw new Error(res.message || "Failed to create booking");
//     } catch (err) {
//       console.error("[createBooking] CRASH:", err.message, err.stack);
//       set({ isLoading: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- FETCH SINGLE BOOKING DETAILS ----------------
//   fetchBooking: async (bookingId) => {
//     console.log("[fetchBooking] START - ID:", bookingId);
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}`;
//       console.log("[fetchBooking] Fetching:", url);

//       const res = await fetchWithAuth(url);
//       console.log("[fetchBooking] Response:", res);

//       if (res.success && res.data) {
//         const bookingDetails = {
//           ...res.data,
//           participant_name: res.data.tutor?.name || "Unknown",
//           participant_role: "tutor",
//           avatar: res.data.tutor?.avatar || null,
//           bio: res.data.tutor?.bio || "",
//           subjects: res.data.tutor?.subjects || [],
//           isBooking: true,
//         };
//         console.log("[fetchBooking] Fetched details:", bookingDetails.id, bookingDetails.participant_name);

//         set({ selectedBooking: bookingDetails, isLoading: false });
//         return bookingDetails;
//       }
//       throw new Error(res.message || "Failed to fetch booking");
//     } catch (err) {
//       console.error("[fetchBooking] CRASH:", err.message, err.stack);
//       set({ isLoading: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- CONFIRM BOOKING ----------------
//   confirmBooking: async (bookingId) => {
//     console.log("[confirmBooking] START - ID:", bookingId);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/confirm`;
//       console.log("[confirmBooking] PATCH to:", url);

//       const res = await fetchWithAuth(url, { 
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("[confirmBooking] Response:", res);

//       if (res.success) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: res.data?.status || "confirmed" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: res.data?.status || "confirmed" }
//             : state.selectedBooking
//         }));
//         console.log("[confirmBooking] SUCCESS - Status updated to confirmed/active");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to confirm booking");
//     } catch (err) {
//       console.error("[confirmBooking] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- CANCEL BOOKING ----------------
//   cancelBooking: async (bookingId, reason) => {
//     console.log("[cancelBooking] START - ID:", bookingId, "Reason:", reason);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/cancel`;
//       console.log("[cancelBooking] PATCH to:", url);

//       const res = await fetchWithAuth(url, { 
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reason })
//       });

//       console.log("[cancelBooking] Response:", res);

//       if (res.success) {
//         const booking = get().bookings.find(b => b.id === bookingId);
//         const tutorId = booking?.tutorId;

//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: "cancelled" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId 
//             ? { ...state.selectedBooking, status: "cancelled" }
//             : state.selectedBooking
//         }));

//         if (tutorId) {
//           console.log("[cancelBooking] Refreshing tutors after cancel");
//           get().fetchTutors();
//         }

//         console.log("[cancelBooking] SUCCESS");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to cancel booking");
//     } catch (err) {
//       console.error("[cancelBooking] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- START CHAT ----------------
//   startChat: async (bookingId) => {
//     console.log("[startChat] START - ID:", bookingId);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/start`;
//       console.log("[startChat] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("[startChat] Response:", res);

//       if (res.success) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: "active" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "active" }
//             : state.selectedBooking
//         }));
//         console.log("[startChat] SUCCESS - Status updated to active");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to start chat");
//     } catch (err) {
//       console.error("[startChat] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- SEND MESSAGE ----------------
//   sendMessage: async (bookingId, content) => {
//     console.log("[sendMessage] START - Booking:", bookingId, "Content:", content);
//     set({ isSending: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
//       console.log("[sendMessage] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content, messageType: "TEXT" }),
//       });

//       console.log("[sendMessage] Response:", res);

//       if (res.success && res.data) {
//         set((state) => ({ 
//           messages: [...state.messages, res.data],
//           isSending: false 
//         }));
        
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { 
//                   ...b, 
//                   last_message: content,
//                   last_message_time: new Date().toISOString()
//                 } 
//               : b
//           ),
//         }));
//         console.log("[sendMessage] SUCCESS - Message added");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to send message");
//     } catch (err) {
//       console.error("[sendMessage] CRASH:", err.message, err.stack);
//       set({ isSending: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- GET MESSAGES ----------------
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

//   // ---------------- END CHAT ----------------
//   endChat: async (bookingId) => {
//     console.log("[endChat] START - ID:", bookingId);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/end`;
//       console.log("[endChat] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("[endChat] Response:", res);

//       if (res.success) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: "completed" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "completed" }
//             : state.selectedBooking
//         }));
//         console.log("[endChat] SUCCESS - Status updated to completed");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to end chat");
//     } catch (err) {
//       console.error("[endChat] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- RATE SESSION ----------------
//   rateSession: async (bookingId, rating, feedback) => {
//     console.log("[rateSession] START - ID:", bookingId, "Rating:", rating, "Feedback:", feedback);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/rate`;
//       console.log("[rateSession] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ rating, feedback }),
//       });

//       console.log("[rateSession] Response:", res);

//       if (res.success) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, rating, feedback } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, rating, feedback }
//             : state.selectedBooking
//         }));
//         console.log("[rateSession] SUCCESS");
//         return true;
//       }
//       throw new Error(res.message || "Failed to rate session");
//     } catch (err) {
//       console.error("[rateSession] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       return false;
//     }
//   },

//   // ---------------- CHAT HISTORY ----------------
//   fetchChatHistory: async (data) => {
//     console.log("[fetchChatHistory] START - params:", data);
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/chat/history`;
//       console.log("[fetchChatHistory] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       console.log("[fetchChatHistory] Response:", res);

//       if (res.success && Array.isArray(res.data)) {
//         console.log("[fetchChatHistory] History loaded:", res.data.length);
//         set({ chatHistory: res.data, isLoading: false });
//         return res.data;
//       } else {
//         console.warn("[fetchChatHistory] Invalid response", res);
//         set({ chatHistory: [], isLoading: false });
//         return [];
//       }
//     } catch (err) {
//       console.error("[fetchChatHistory] CRASH:", err.message, err.stack);
//       set({ chatHistory: [], isLoading: false, error: err.message });
//       return [];
//     }
//   },

//   // ---------------- UTILS ----------------
//   clearError: () => {
//     console.log("[clearError] Clearing error state");
//     set({ error: null });
//   },

//   setSelectedBooking: (booking) => {
//     console.log("[setSelectedBooking] Setting:", booking?.id, booking?.participant_name);
//     set({ selectedBooking: booking });
//   },
//   // Cleanup on logout / unmount
//   reset: () => {
//     get().disconnectSocket();
//     set({
//       tutors: [],
//       bookings: [],
//       selectedBooking: null,
//       messages: [],
//       chatHistory: [],
//       isLoading: false,
//       isSending: false,
//       error: null,
//       socketConnected: false,
//     });
//   },
// }));








import { create } from "zustand";
import useAuthStore from "./authStore";
import { io } from "socket.io-client";

const API_BASE = "https://fillops-server-5fuf.onrender.com";
let socket = null;

export const useUserChatStore = create((set, get) => ({
  // ─── Core States ────────────────────────────────────────────
  tutors: [],
  bookings: [],
  selectedBooking: null,
  messages: [],
  isLoading: false,
  isSending: false,
  error: null,
  socketConnected: false,

  // ─── Socket Connection Management ───────────────────────────
  connectSocket: () => {
    if (socket?.connected) return;

    const token = useAuthStore.getState().accessToken;
    if (!token) {
      console.warn("[UserSocket] No token available → cannot connect");
      return;
    }

    socket = io(API_BASE, {
      auth: { token },
      autoConnect: false,
      transports: ["websocket"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    socket.connect();

    socket.on("connect", () => {
      console.log("[UserSocket] Connected successfully");
      set({ socketConnected: true });
    });

    socket.on("connect_error", (err) => {
      console.error("[UserSocket] Connection error:", err.message);
      set({ socketConnected: false });
    });

    socket.on("disconnect", (reason) => {
      console.log("[UserSocket] Disconnected:", reason);
      set({ socketConnected: false });
    });

    // ─── Real-time incoming messages ────────────────────────────
    socket.on("newMessage", (message) => {
      const { selectedBooking } = get();

      // Add to current chat if viewing that booking
      if (message.bookingId === selectedBooking?.id) {
        set((state) => ({
          messages: [...state.messages, message],
        }));
      }

      // Update preview in booking list + unread count
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b.id === message.bookingId
            ? {
                ...b,
                last_message: message.content,
                last_message_time: message.createdAt,
                unread_count: (b.unread_count || 0) + 1,
              }
            : b
        ),
      }));
    });

    // ─── Message confirmation / rejection ───────────────────────
    socket.on("messageConfirmed", ({ tempId, message }) => {
      set((state) => ({
        messages: state.messages.map((m) =>
          m.tempId === tempId ? { ...message, tempId: undefined, isSending: false } : m
        ),
      }));
    });

    socket.on("messageError", ({ tempId, error }) => {
      set((state) => ({
        messages: state.messages.filter((m) => m.tempId !== tempId),
        error: error || "Failed to send message",
      }));
    });
  },

  disconnectSocket: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
      set({ socketConnected: false });
      console.log("[UserSocket] Manually disconnected");
    }
  },

  // ─── Send Message (Socket-first, HTTP fallback) ─────────────
  sendMessage: async (bookingId, content) => {
    if (!bookingId || !content?.trim()) {
      console.warn("[sendMessage] Missing bookingId or content");
      return;
    }

    const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const optimisticMsg = {
      tempId,
      bookingId,
      content,
      sender: {
        id: useAuthStore.getState().user?.id,
        name: useAuthStore.getState().user?.name || "You",
        type: "USER",
      },
      createdAt: new Date().toISOString(),
      isSending: true,
    };

    set((state) => ({
      messages: [...state.messages, optimisticMsg],
      isSending: true,
      error: null,
    }));

    // Ensure socket is connected
    if (!socket?.connected) {
      get().connectSocket();
      await new Promise((resolve) => setTimeout(resolve, 1200)); // small grace period
    }

    if (socket?.connected) {
      console.log("[UserSocket] Sending message:", { bookingId, tempId });
      socket.emit("sendMessage", {
        bookingId,
        content: content.trim(),
        messageType: "TEXT",
        tempId,
      });
    } else {
      console.warn("[UserSocket] Socket not ready → using HTTP fallback");
      try {
        const { fetchWithAuth } = useAuthStore.getState();
        const res = await fetchWithAuth(
          `${API_BASE}/api/users/bookings/${bookingId}/messages`,
          {
            method: "POST",
            body: JSON.stringify({ content: content.trim(), messageType: "TEXT" }),
          }
        );

        if (res.success && res.data) {
          set((state) => ({
            messages: state.messages.map((m) =>
              m.tempId === tempId ? { ...res.data, isSending: false } : m
            ),
          }));
        } else {
          throw new Error(res.message || "HTTP send failed");
        }
      } catch (err) {
        set((state) => ({
          messages: state.messages.filter((m) => m.tempId !== tempId),
          error: err.message || "Failed to send message",
        }));
      }
    }

    set({ isSending: false });
  },

  // ─── Core Data Fetching ─────────────────────────────────────
  fetchTutors: async ({ search, category } = {}) => {
    set({ isLoading: true, error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      let url = `${API_BASE}/api/users/tutors`;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetchWithAuth(url);

      if (!res?.success || !Array.isArray(res.data)) {
        console.warn("[fetchTutors] Invalid response", res);
        set({ tutors: [], isLoading: false });
        return;
      }

      const tutors = res.data.map((t) => ({
        id: t.id || t._id,
        name: t.name || "Unknown Tutor",
        participant_name: t.name || "Unknown Tutor",
        participant_role: "tutor",
        avatar: t.avatar || null,
        bio: t.bio || "",
        subjects: t.subjects || [],
        completedSessions: t.completedSessions || 0,
        rating: t.rating || null,
        isTutor: true,
        last_message: "",
        last_message_time: null,
        status: "available",
        unread_count: 0,
      }));

      set({ tutors, isLoading: false });
      console.log(`[fetchTutors] Loaded ${tutors.length} tutors`);
    } catch (err) {
      console.error("[fetchTutors] Error:", err);
      set({ tutors: [], isLoading: false, error: err.message });
    }
  },

  fetchBookings: async ({ status = "", page = 1, limit = 100 } = {}) => {
    set({ isLoading: true, error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      let url = `${API_BASE}/api/users/bookings?limit=${limit}`;
      if (status) url += `&status=${status.toUpperCase()}`;
      if (page > 1) url += `&page=${page}`;

      const res = await fetchWithAuth(url);

      if (!res?.success || !Array.isArray(res.data)) {
        console.warn("[fetchBookings] Invalid response", res);
        set({ bookings: [], isLoading: false });
        return;
      }

      const bookings = res.data.map((b) => ({
        id: b.id,
        name: b.tutor?.name || "Unknown",
        tutorId: b.tutorId || b.tutor?.id,
        participant_name: b.tutor?.name || "Unknown",
        participant_role: "tutor",
        avatar: b.tutor?.avatar || null,
        bio: b.tutor?.bio || "",
        subjects: b.tutor?.subjects || [],
        completedSessions: b.tutor?.completedSessions || 0,
        rating: b.rating || null,
        status: b.status?.toLowerCase() || "pending",
        scheduledAt: b.scheduledAt || null,
        duration: b.duration || null,
        purpose: b.purpose || "",
        last_message: b.lastMessage?.content || "",
        last_message_time: b.lastMessage?.createdAt || null,
        unread_count: b.unreadCount || 0,
        isBooking: true,
      }));

      set((state) => {
        let newSelected = state.selectedBooking;
        if (newSelected?.isBooking) {
          newSelected = bookings.find((b) => b.id === newSelected.id) || newSelected;
        }
        return { bookings, selectedBooking: newSelected, isLoading: false };
      });

      console.log(`[fetchBookings] Loaded ${bookings.length} bookings`);
    } catch (err) {
      console.error("[fetchBookings] Error:", err);
      set({ bookings: [], isLoading: false, error: err.message });
    }
  },

  fetchMessages: async (bookingId) => {
    if (!bookingId) return;

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`);

      if (res.success && Array.isArray(res.data)) {
        set({ messages: res.data });
        console.log(`[fetchMessages] Loaded ${res.data.length} messages for ${bookingId}`);
      } else {
        set({ messages: [] });
      }
    } catch (err) {
      console.error("[fetchMessages] Error:", err);
      set({ messages: [] });
    }
  },

  // ─── Booking Actions (HTTP) ─────────────────────────────────
  createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
    set({ isLoading: true, error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
        method: "POST",
        body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
      });

      if (res.success && res.data) {
        const newBooking = {
          ...res.data,
          participant_name: res.data.tutor?.name || "Unknown",
          participant_role: "tutor",
          isBooking: true,
        };

        set((state) => ({
          bookings: [...state.bookings, newBooking],
          tutors: state.tutors.filter((t) => t.id !== tutorId),
          selectedBooking: newBooking,
          isLoading: false,
        }));

        return newBooking;
      }
      throw new Error(res.message || "Failed to create booking");
    } catch (err) {
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  // ... (keep your other HTTP actions: confirmBooking, cancelBooking, startChat, endChat, rateSession ...)
  
  // ---------------- CONFIRM BOOKING ----------------
  confirmBooking: async (bookingId) => {
    console.log("[confirmBooking] START - ID:", bookingId);
    set({ error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings/${bookingId}/confirm`;
      console.log("[confirmBooking] PATCH to:", url);

      const res = await fetchWithAuth(url, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" }
      });

      console.log("[confirmBooking] Response:", res);

      if (res.success) {
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId 
              ? { ...b, status: res.data?.status || "confirmed" } 
              : b
          ),
          selectedBooking: state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: res.data?.status || "confirmed" }
            : state.selectedBooking
        }));
        console.log("[confirmBooking] SUCCESS - Status updated to confirmed/active");
        return res.data;
      }
      throw new Error(res.message || "Failed to confirm booking");
    } catch (err) {
      console.error("[confirmBooking] CRASH:", err.message, err.stack);
      set({ error: err.message });
      throw err;
    }
  },

  // ---------------- CANCEL BOOKING ----------------
  cancelBooking: async (bookingId, reason) => {
    console.log("[cancelBooking] START - ID:", bookingId, "Reason:", reason);
    set({ error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings/${bookingId}/cancel`;
      console.log("[cancelBooking] PATCH to:", url);

      const res = await fetchWithAuth(url, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });

      console.log("[cancelBooking] Response:", res);

      if (res.success) {
        const booking = get().bookings.find(b => b.id === bookingId);
        const tutorId = booking?.tutorId;

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

        if (tutorId) {
          console.log("[cancelBooking] Refreshing tutors after cancel");
          get().fetchTutors();
        }

        console.log("[cancelBooking] SUCCESS");
        return res.data;
      }
      throw new Error(res.message || "Failed to cancel booking");
    } catch (err) {
      console.error("[cancelBooking] CRASH:", err.message, err.stack);
      set({ error: err.message });
      throw err;
    }
  },

  // ---------------- START CHAT ----------------
  startChat: async (bookingId) => {
    console.log("[startChat] START - ID:", bookingId);
    set({ error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings/${bookingId}/start`;
      console.log("[startChat] POST to:", url);

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      console.log("[startChat] Response:", res);

      if (res.success) {
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId 
              ? { ...b, status: "active" } 
              : b
          ),
          selectedBooking: state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: "active" }
            : state.selectedBooking
        }));
        console.log("[startChat] SUCCESS - Status updated to active");
        return res.data;
      }
      throw new Error(res.message || "Failed to start chat");
    } catch (err) {
      console.error("[startChat] CRASH:", err.message, err.stack);
      set({ error: err.message });
      throw err;
    }
  },

  // // ---------------- SEND MESSAGE ----------------
  // sendMessage: async (bookingId, content) => {
  //   console.log("[sendMessage] START - Booking:", bookingId, "Content:", content);
  //   set({ isSending: true, error: null });

  //   try {
  //     const { fetchWithAuth } = useAuthStore.getState();
  //     const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
  //     console.log("[sendMessage] POST to:", url);

  //     const res = await fetchWithAuth(url, {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ content, messageType: "TEXT" }),
  //     });

  //     console.log("[sendMessage] Response:", res);

  //     if (res.success && res.data) {
  //       set((state) => ({ 
  //         messages: [...state.messages, res.data],
  //         isSending: false 
  //       }));
        
  //       set((state) => ({
  //         bookings: state.bookings.map((b) => 
  //           b.id === bookingId 
  //             ? { 
  //                 ...b, 
  //                 last_message: content,
  //                 last_message_time: new Date().toISOString()
  //               } 
  //             : b
  //         ),
  //       }));
  //       console.log("[sendMessage] SUCCESS - Message added");
  //       return res.data;
  //     }
  //     throw new Error(res.message || "Failed to send message");
  //   } catch (err) {
  //     console.error("[sendMessage] CRASH:", err.message, err.stack);
  //     set({ isSending: false, error: err.message });
  //     throw err;
  //   }
  // },

  // ---------------- GET MESSAGES ----------------
  fetchMessages: async (bookingId) => {
    console.log("[fetchMessages] START - Booking:", bookingId);
    set({ error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
      console.log("[fetchMessages] Fetching:", url);

      const res = await fetchWithAuth(url);
      console.log("[fetchMessages] Response:", res);

      if (res.success && Array.isArray(res.data)) {
        console.log("[fetchMessages] Messages loaded:", res.data.length);
        set({ messages: res.data });
        return res.data;
      } else {
        console.warn("[fetchMessages] No messages or invalid response", res);
        set({ messages: [] });
        return [];
      }
    } catch (err) {
      console.error("[fetchMessages] CRASH:", err.message, err.stack);
      set({ messages: [], error: err.message });
      return [];
    }
  },

  // ---------------- END CHAT ----------------
  endChat: async (bookingId) => {
    console.log("[endChat] START - ID:", bookingId);
    set({ error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings/${bookingId}/end`;
      console.log("[endChat] POST to:", url);

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      console.log("[endChat] Response:", res);

      if (res.success) {
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
        console.log("[endChat] SUCCESS - Status updated to completed");
        return res.data;
      }
      throw new Error(res.message || "Failed to end chat");
    } catch (err) {
      console.error("[endChat] CRASH:", err.message, err.stack);
      set({ error: err.message });
      throw err;
    }
  },

  // ---------------- RATE SESSION ----------------
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
        return true;
      }
      throw new Error(res.message || "Failed to rate session");
    } catch (err) {
      console.error("[rateSession] CRASH:", err.message, err.stack);
      set({ error: err.message });
      return false;
    }
  },

  // ---------------- CHAT HISTORY ----------------
  fetchChatHistory: async (data) => {
    console.log("[fetchChatHistory] START - params:", data);
    set({ isLoading: true, error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/chat/history`;
      console.log("[fetchChatHistory] POST to:", url);

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("[fetchChatHistory] Response:", res);

      if (res.success && Array.isArray(res.data)) {
        console.log("[fetchChatHistory] History loaded:", res.data.length);
        set({ chatHistory: res.data, isLoading: false });
        return res.data;
      } else {
        console.warn("[fetchChatHistory] Invalid response", res);
        set({ chatHistory: [], isLoading: false });
        return [];
      }
    } catch (err) {
      console.error("[fetchChatHistory] CRASH:", err.message, err.stack);
      set({ chatHistory: [], isLoading: false, error: err.message });
      return [];
    }
  },


  // ─── Utils ──────────────────────────────────────────────────
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),

  clearError: () => set({ error: null }),

  reset: () => {
    get().disconnectSocket();
    set({
      tutors: [],
      bookings: [],
      selectedBooking: null,
      messages: [],
      isLoading: false,
      isSending: false,
      error: null,
      socketConnected: false,
    });
  },
}));














// import { create } from "zustand";
// import useAuthStore from "./authStore";


// const API_BASE = "https://fillops-server-5fuf.onrender.com";
// export const useUserChatStore = create((set, get) => ({
//   // ---------------- STATES ----------------
//   tutors: [],
//   bookings: [],
//   selectedBooking: null,
//   messages: [],
//   chatHistory: [],
//   isLoading: false,
//   isSending: false,
//   error: null,


//   _refreshBookingsSilent: async ({ status = "" } = {}) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/bookings`;
//       const params = new URLSearchParams();
//       if (status) params.append("status", status.toUpperCase());
//       if (params.toString()) url += `?${params.toString()}`;

//       const res = await fetchWithAuth(url);

//       if (!res?.success || !Array.isArray(res?.data)) {
//         console.warn("[Silent Refresh] Invalid response:", res);
//         return;
//       }

//       const mapped = res.data.map((booking) => ({
//         id: booking.id,
//         tutorId: booking.tutorId || booking.tutor?.id,
//         participant_name: booking.tutor?.name || "Unknown",
//         participant_role: "tutor",
//         last_message: booking.lastMessage?.content || "",
//         last_message_time: booking.lastMessage?.createdAt || null,
//         status: booking.status || "pending",
//         scheduledAt: booking.scheduledAt || null,
//         duration: booking.duration || null,
//         unread_count: booking.unreadCount || 0,
//         purpose: booking.purpose || "",
//         avatar: booking.tutor?.avatar || null,
//         bio: booking.tutor?.bio || "",
//         subjects: booking.tutor?.subjects || [],
//         completedSessions: booking.tutor?.completedSessions || 0,
//         rating: booking.rating || null,
//         feedback: booking.feedback || null,
//         isBooking: true,
//       }));

//       set((state) => {
//         const newBookings = mapped;
//         let newSelected = state.selectedBooking;
//         if (newSelected?.isBooking) {
//           newSelected = newBookings.find(b => b.id === newSelected.id) || newSelected;
//         }
//         return {
//           bookings: newBookings,
//           selectedBooking: newSelected,
//         };
//       });
//     } catch (err) {
//       console.warn("[Silent Refresh] Failed:", err);
//     }
//   },

//   fetchTutors: async ({ search, category } = {}) => {
//     console.log("[fetchTutors] START - params:", { search, category });
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/tutors`;
//       const params = new URLSearchParams();
//       if (search) params.append("search", search);
//       if (category) params.append("category", category);
//       if (params.toString()) url += `?${params.toString()}`;

//       console.log("[fetchTutors] Fetching URL:", url);
//       const res = await fetchWithAuth(url);
//       console.log("[fetchTutors] Full API response:", res);

//       if (!res?.success) {
//         console.warn("[fetchTutors] API did not return success flag", res);
//         set({ tutors: [], isLoading: false });
//         return;
//       }

//       let rawTutors = res.data || res.tutors || [];
//       console.log("[fetchTutors] Raw tutors count:", rawTutors.length);

//       if (!Array.isArray(rawTutors)) {
//         console.error("[fetchTutors] Tutors response is NOT an array!", rawTutors);
//         set({ tutors: [], isLoading: false });
//         return;
//       }

//       const mappedTutors = rawTutors.map((tutor) => ({
//         id: tutor.id || tutor._id,
//         name: tutor.name || "Unknown Tutor", // ✅ Direct name field
//         avatar: tutor.avatar || null,
//         bio: tutor.bio || "",
//         subjects: tutor.subjects || [],
//         completedSessions: tutor.completedSessions || 0,
//         rating: tutor.rating || null,
//         isTutor: true,
//         // Legacy support
//         participant_name: tutor.name || "Unknown Tutor",
//         participant_role: "tutor",
//         last_message: "",
//         last_message_time: null,
//         status: "available",
//         scheduledAt: null,
//         duration: null,
//         unread_count: 0,
//       }));

//       console.log("[fetchTutors] SUCCESS - Loaded", mappedTutors.length, "tutors");
//       set({ tutors: mappedTutors, isLoading: false });
//     } catch (err) {
//       console.error("[fetchTutors] CRASH:", err.message, err.stack);
//       set({ tutors: [], isLoading: false, error: err.message });
//     }
//   },

//   fetchBookings: async ({ status = "", page = 1, limit = 100 } = {}) => {
//     console.log("[fetchBookings] START - status:", status, "page:", page, "limit:", limit);
//     set({ isLoading: true, error: null });

//     const authState = useAuthStore.getState();
//     if (!authState?.fetchWithAuth) {
//       console.error("[fetchBookings] fetchWithAuth not available");
//       set({ isLoading: false, error: "Auth not initialized" });
//       return;
//     }

//     const { fetchWithAuth } = authState;

//     try {
//       let url = `${API_BASE}/api/users/bookings`;
//       const params = new URLSearchParams();
//       if (status) params.append("status", status.toUpperCase());
//       if (page > 1) params.append("page", page);
//       params.append("limit", limit); // ✅ Add limit parameter
//       if (params.toString()) url += `?${params.toString()}`;

//       console.log("[fetchBookings] Fetching URL:", url);
//       const res = await fetchWithAuth(url);
//       console.log("[fetchBookings] Response:", res);

//       if (res.success && Array.isArray(res.data)) {
//         const mappedBookings = res.data.map((booking) => ({
//           id: booking.id,
//           name: booking.tutor?.name || "Unknown",
//           tutorId: booking.tutorId || booking.tutor?.id,
//           avatar: booking.tutor?.avatar || null,
//           bio: booking.tutor?.bio || "",
//           subjects: booking.tutor?.subjects || [],
//           completedSessions: booking.tutor?.completedSessions || 0,
//           rating: booking.rating || null,
//           feedback: booking.feedback || null,
//           status: booking.status || "pending",
//           scheduledAt: booking.scheduledAt || null,
//           duration: booking.duration || null,
//           purpose: booking.purpose || "",
//           unread_count: booking.unreadCount || 0,
//           isBooking: true,
//           participant_name: booking.tutor?.name || "Unknown",
//           participant_role: "tutor",
//           last_message: booking.lastMessage?.content || "",
//           last_message_time: booking.lastMessage?.createdAt || null,
//         }));

//         const currentSelection = get().selectedBooking;
//         let newSelection = currentSelection;
        
//         if (currentSelection?.isBooking) {
//           const updatedBooking = mappedBookings.find(b => b.id === currentSelection.id);
//           newSelection = updatedBooking || currentSelection;
//         }

//         console.log("[fetchBookings] SUCCESS - Loaded", mappedBookings.length, "bookings");
//         set({ 
//           bookings: mappedBookings,
//           selectedBooking: newSelection,
//           isLoading: false 
//         });
//       } else {
//         console.warn("[fetchBookings] No success or data not array", res);
//         set({ bookings: [], isLoading: false });
//       }
//     } catch (err) {
//       console.error("[fetchBookings] CRASH:", err);
//       set({ isLoading: false, error: err.message });
//     }
//   },

//   // ---------------- FETCH TUTORS ----------------
// fetchTutors: async ({ search, category } = {}) => {
//   console.log("[fetchTutors] START - params:", { search, category });
//   set({ isLoading: true, error: null });

//   try {
//     const { fetchWithAuth } = useAuthStore.getState();
//     let url = `${API_BASE}/api/users/tutors`;
//     const params = new URLSearchParams();
//     if (search) params.append("search", search);
//     if (category) params.append("category", category);
//     if (params.toString()) url += `?${params.toString()}`;

//     console.log("[fetchTutors] Fetching URL:", url);

//     const res = await fetchWithAuth(url);

//     console.log("[fetchTutors] Full API response:", res);

//     if (!res?.success) {
//       console.warn("[fetchTutors] API did not return success flag", res);
//       set({ tutors: [], isLoading: false });
//       return;
//     }

//     let rawTutors = res.data || res.tutors || [];
//     console.log("[fetchTutors] Raw tutors count:", rawTutors.length);

//     if (!Array.isArray(rawTutors)) {
//       console.error("[fetchTutors] Tutors response is NOT an array!", rawTutors);
//       set({ tutors: [], isLoading: false });
//       return;
//     }

//     const mappedTutors = rawTutors.map((tutor) => {
//       const mapped = {
//         id: tutor.id || tutor._id,
//         name: tutor.name || "Unknown Tutor", // ✅ ADD THIS LINE
//         participant_name: tutor.name || "Unknown Tutor",
//         participant_role: "tutor",
//         avatar: tutor.avatar || null,
//         bio: tutor.bio || "",
//         subjects: tutor.subjects || [],
//         completedSessions: tutor.completedSessions || 0,
//         rating: tutor.rating || null,
//         isTutor: true,
//         last_message: "",
//         last_message_time: null,
//         status: "available",
//         scheduledAt: null,
//         duration: null,
//         unread_count: 0,
//       };
//       console.log("✅ Mapped tutor:", mapped.name, "ID:", mapped.id); // ✅ ADD DEBUG LOG
//       return mapped;
//     });

//     const availableTutors = mappedTutors;
//     console.log(
//       `[fetchTutors] SUCCESS - Loaded ${mappedTutors.length} tutors → showing ${availableTutors.length}`
//     );

//     set({ tutors: availableTutors, isLoading: false });
//   } catch (err) {
//     console.error("[fetchTutors] CRASH:", err.message, err.stack);
//     set({ tutors: [], isLoading: false, error: err.message });
//   }
// },

//   // ---------------- FETCH ALL BOOKINGS ----------------
//   // fetchBookings: async () => {
//   //   console.log("[fetchBookings] START");
//   //   set({ isLoading: true, error: null });

//   //   try {
//   //     const { fetchWithAuth } = useAuthStore.getState();
//   //     const url = `${API_BASE}/api/users/bookings`;
//   //     console.log("[fetchBookings] Fetching URL:", url);

//   //     const res = await fetchWithAuth(url);
//   //     console.log("[fetchBookings] Full API response:", res);

//   //     if (res.success && Array.isArray(res.data)) {
//   //       const mappedBookings = res.data.map((booking) => {
//   //         const mapped = {
//   //           id: booking.id,
//   //           tutorId: booking.tutorId || booking.tutor?.id,
//   //           participant_name: booking.tutor?.name || "Unknown",
//   //           participant_role: "tutor",
//   //           last_message: booking.lastMessage?.content || "",
//   //           last_message_time: booking.lastMessage?.createdAt || null,
//   //           status: booking.status || "pending",
//   //           scheduledAt: booking.scheduledAt || null,
//   //           duration: booking.duration || null,
//   //           unread_count: booking.unreadCount || 0,
//   //           purpose: booking.purpose || "",
//   //           avatar: booking.tutor?.avatar || null,
//   //           bio: booking.tutor?.bio || "",
//   //           subjects: booking.tutor?.subjects || [],
//   //           completedSessions: booking.tutor?.completedSessions || 0,
//   //           rating: booking.rating || null,
//   //           feedback: booking.feedback || null,
//   //           isBooking: true,
//   //         };
//   //         console.log("[fetchBookings] Mapped booking:", mapped.id, mapped.participant_name, mapped.status);
//   //         return mapped;
//   //       });

//   //       const currentSelection = get().selectedBooking;
//   //       let newSelection = currentSelection;

//   //       if (currentSelection?.isTutor) {
//   //         const bookingForTutor = mappedBookings.find(b => b.tutorId === currentSelection.id);
//   //         if (bookingForTutor) {
//   //           newSelection = bookingForTutor;
//   //           console.log("[fetchBookings] Updated selection from tutor to booking:", newSelection.id);
//   //         }
//   //       } else if (currentSelection?.isBooking) {
//   //         const updatedBooking = mappedBookings.find(b => b.id === currentSelection.id);
//   //         newSelection = updatedBooking || currentSelection;
//   //         console.log("[fetchBookings] Updated existing booking selection:", newSelection.id);
//   //       }

//   //       set({ 
//   //         bookings: mappedBookings,
//   //         selectedBooking: newSelection,
//   //         isLoading: false 
//   //       });
//   //       console.log("[fetchBookings] SUCCESS - Bookings count:", mappedBookings.length);

//   //       const bookedTutorIds = mappedBookings.map(b => b.tutorId);
//   //       const tutors = get().tutors;
//   //       const availableTutors = tutors.filter(t => !bookedTutorIds.includes(t.id));
//   //       set({ tutors: availableTutors });
//   //       console.log("[fetchBookings] Available tutors after filter:", availableTutors.length);
//   //     } else {
//   //       console.warn("[fetchBookings] No success or data not array", res);
//   //       set({ bookings: [], isLoading: false });
//   //     }
//   //   } catch (err) {
//   //     console.error("[fetchBookings] CRASH:", err.message, err.stack);
//   //     set({ bookings: [], isLoading: false, error: err.message });
//   //   }
//   // },

//   // ---------------- CREATE NEW BOOKING ----------------
//   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
//     console.log("[createBooking] START - params:", { tutorId, purpose, scheduledAt, duration });
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings`;
//       console.log("[createBooking] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
//       });

//       console.log("[createBooking] Full response:", res);

//       if (res.success && res.data) {
//         const newBooking = {
//           id: res.data.id,
//           tutorId: res.data.tutorId || res.data.tutor?.id,
//           participant_name: res.data.tutor?.name || "Unknown",
//           participant_role: "tutor",
//           last_message: "",
//           last_message_time: null,
//           status: res.data.status || "pending",
//           scheduledAt: res.data.scheduledAt || null,
//           duration: res.data.duration || null,
//           unread_count: 0,
//           purpose: res.data.purpose || purpose,
//           avatar: res.data.tutor?.avatar || null,
//           bio: res.data.tutor?.bio || "",
//           subjects: res.data.tutor?.subjects || [],
//           completedSessions: res.data.tutor?.completedSessions || 0,
//           isBooking: true,
//         };
//         console.log("[createBooking] Created new booking:", newBooking.id, newBooking.participant_name);

//         set((state) => ({ 
//           bookings: [...state.bookings, newBooking],
//           tutors: state.tutors.filter(t => t.id !== tutorId),
//           selectedBooking: state.selectedBooking?.id === tutorId ? newBooking : state.selectedBooking,
//           isLoading: false
//         }));

//         return newBooking;
//       }
//       throw new Error(res.message || "Failed to create booking");
//     } catch (err) {
//       console.error("[createBooking] CRASH:", err.message, err.stack);
//       set({ isLoading: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- FETCH SINGLE BOOKING DETAILS ----------------
//   fetchBooking: async (bookingId) => {
//     console.log("[fetchBooking] START - ID:", bookingId);
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}`;
//       console.log("[fetchBooking] Fetching:", url);

//       const res = await fetchWithAuth(url);
//       console.log("[fetchBooking] Response:", res);

//       if (res.success && res.data) {
//         const bookingDetails = {
//           ...res.data,
//           participant_name: res.data.tutor?.name || "Unknown",
//           participant_role: "tutor",
//           avatar: res.data.tutor?.avatar || null,
//           bio: res.data.tutor?.bio || "",
//           subjects: res.data.tutor?.subjects || [],
//           isBooking: true,
//         };
//         console.log("[fetchBooking] Fetched details:", bookingDetails.id, bookingDetails.participant_name);

//         set({ selectedBooking: bookingDetails, isLoading: false });
//         return bookingDetails;
//       }
//       throw new Error(res.message || "Failed to fetch booking");
//     } catch (err) {
//       console.error("[fetchBooking] CRASH:", err.message, err.stack);
//       set({ isLoading: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- CONFIRM BOOKING ----------------
//   confirmBooking: async (bookingId) => {
//     console.log("[confirmBooking] START - ID:", bookingId);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/confirm`;
//       console.log("[confirmBooking] PATCH to:", url);

//       const res = await fetchWithAuth(url, { 
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("[confirmBooking] Response:", res);

//       if (res.success) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: res.data?.status || "confirmed" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: res.data?.status || "confirmed" }
//             : state.selectedBooking
//         }));
//         console.log("[confirmBooking] SUCCESS - Status updated to confirmed/active");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to confirm booking");
//     } catch (err) {
//       console.error("[confirmBooking] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- CANCEL BOOKING ----------------
//   cancelBooking: async (bookingId, reason) => {
//     console.log("[cancelBooking] START - ID:", bookingId, "Reason:", reason);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/cancel`;
//       console.log("[cancelBooking] PATCH to:", url);

//       const res = await fetchWithAuth(url, { 
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ reason })
//       });

//       console.log("[cancelBooking] Response:", res);

//       if (res.success) {
//         const booking = get().bookings.find(b => b.id === bookingId);
//         const tutorId = booking?.tutorId;

//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: "cancelled" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId 
//             ? { ...state.selectedBooking, status: "cancelled" }
//             : state.selectedBooking
//         }));

//         if (tutorId) {
//           console.log("[cancelBooking] Refreshing tutors after cancel");
//           get().fetchTutors();
//         }

//         console.log("[cancelBooking] SUCCESS");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to cancel booking");
//     } catch (err) {
//       console.error("[cancelBooking] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- START CHAT ----------------
//   startChat: async (bookingId) => {
//     console.log("[startChat] START - ID:", bookingId);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/start`;
//       console.log("[startChat] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("[startChat] Response:", res);

//       if (res.success) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: "active" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "active" }
//             : state.selectedBooking
//         }));
//         console.log("[startChat] SUCCESS - Status updated to active");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to start chat");
//     } catch (err) {
//       console.error("[startChat] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- SEND MESSAGE ----------------
//   sendMessage: async (bookingId, content) => {
//     console.log("[sendMessage] START - Booking:", bookingId, "Content:", content);
//     set({ isSending: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
//       console.log("[sendMessage] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content, messageType: "TEXT" }),
//       });

//       console.log("[sendMessage] Response:", res);

//       if (res.success && res.data) {
//         set((state) => ({ 
//           messages: [...state.messages, res.data],
//           isSending: false 
//         }));
        
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { 
//                   ...b, 
//                   last_message: content,
//                   last_message_time: new Date().toISOString()
//                 } 
//               : b
//           ),
//         }));
//         console.log("[sendMessage] SUCCESS - Message added");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to send message");
//     } catch (err) {
//       console.error("[sendMessage] CRASH:", err.message, err.stack);
//       set({ isSending: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- GET MESSAGES ----------------
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

//   // ---------------- END CHAT ----------------
//   endChat: async (bookingId) => {
//     console.log("[endChat] START - ID:", bookingId);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/end`;
//       console.log("[endChat] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("[endChat] Response:", res);

//       if (res.success) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: "completed" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "completed" }
//             : state.selectedBooking
//         }));
//         console.log("[endChat] SUCCESS - Status updated to completed");
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to end chat");
//     } catch (err) {
//       console.error("[endChat] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- RATE SESSION ----------------
//   rateSession: async (bookingId, rating, feedback) => {
//     console.log("[rateSession] START - ID:", bookingId, "Rating:", rating, "Feedback:", feedback);
//     set({ error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/bookings/${bookingId}/rate`;
//       console.log("[rateSession] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ rating, feedback }),
//       });

//       console.log("[rateSession] Response:", res);

//       if (res.success) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, rating, feedback } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, rating, feedback }
//             : state.selectedBooking
//         }));
//         console.log("[rateSession] SUCCESS");
//         return true;
//       }
//       throw new Error(res.message || "Failed to rate session");
//     } catch (err) {
//       console.error("[rateSession] CRASH:", err.message, err.stack);
//       set({ error: err.message });
//       return false;
//     }
//   },

//   // ---------------- CHAT HISTORY ----------------
//   fetchChatHistory: async (data) => {
//     console.log("[fetchChatHistory] START - params:", data);
//     set({ isLoading: true, error: null });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const url = `${API_BASE}/api/users/chat/history`;
//       console.log("[fetchChatHistory] POST to:", url);

//       const res = await fetchWithAuth(url, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       console.log("[fetchChatHistory] Response:", res);

//       if (res.success && Array.isArray(res.data)) {
//         console.log("[fetchChatHistory] History loaded:", res.data.length);
//         set({ chatHistory: res.data, isLoading: false });
//         return res.data;
//       } else {
//         console.warn("[fetchChatHistory] Invalid response", res);
//         set({ chatHistory: [], isLoading: false });
//         return [];
//       }
//     } catch (err) {
//       console.error("[fetchChatHistory] CRASH:", err.message, err.stack);
//       set({ chatHistory: [], isLoading: false, error: err.message });
//       return [];
//     }
//   },

//   // ---------------- UTILS ----------------
//   clearError: () => {
//     console.log("[clearError] Clearing error state");
//     set({ error: null });
//   },

//   setSelectedBooking: (booking) => {
//     console.log("[setSelectedBooking] Setting:", booking?.id, booking?.participant_name);
//     set({ selectedBooking: booking });
//   },
// }));