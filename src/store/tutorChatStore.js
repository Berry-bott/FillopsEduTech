// import { create } from "zustand";
// import useTutorAuthStore from "./tutorAuthStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com";

// export const useTutorChatStore = create((set, get) => ({
//   // ---------------- STATES ----------------
//   bookings: [],
//   selectedBooking: null,
//   messages: [],
//   isLoading: false,
//   isSending: false,

//   // ---------------- GET ALL BOOKINGS ----------------
//   fetchBookings: async (status = null) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       let url = `${API_BASE}/api/tutor/bookings`;
      
//       // Add status filter if provided (e.g., "pending")
//       if (status) {
//         url += `?status=${status}`;
//       }

//       const res = await fetchWithAuth(url);
//       if (res.success && Array.isArray(res.data)) {
//         // Map API bookings to UI-friendly format
//         const mappedBookings = res.data.map((booking) => ({
//           id: booking.id,
//           studentId: booking.studentId || booking.student?.id,
//           participant_name: booking.student?.name || "Student",
//           participant_role: "student",
//           last_message: booking.lastMessage?.content || "",
//           last_message_time: booking.lastMessage?.createdAt || null,
//           status: booking.status || "pending",
//           scheduledAt: booking.scheduledAt || null,
//           duration: booking.duration || null,
//           unread_count: booking.unreadCount || 0,
//           purpose: booking.purpose || "",
//           avatar: booking.student?.avatar || null,
//           isBooking: true,
//         }));

//         set({ bookings: mappedBookings });
//       } else {
//         set({ bookings: [] });
//       }
//     } catch (err) {
//       console.error("Failed to fetch bookings:", err);
//       set({ bookings: [] });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ---------------- VIEW BOOKING DETAILS ----------------
//   fetchBooking: async (bookingId) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}`);
      
//       if (res.success && res.data) {
//         const booking = {
//           id: res.data.id,
//           studentId: res.data.studentId || res.data.student?.id,
//           participant_name: res.data.student?.name || "Student",
//           participant_role: "student",
//           last_message: res.data.lastMessage?.content || "",
//           last_message_time: res.data.lastMessage?.createdAt || null,
//           status: res.data.status || "pending",
//           scheduledAt: res.data.scheduledAt || null,
//           duration: res.data.duration || null,
//           unread_count: res.data.unreadCount || 0,
//           purpose: res.data.purpose || "",
//           avatar: res.data.student?.avatar || null,
//           isBooking: true,
//         };
        
//         set({ selectedBooking: booking });
//         return booking;
//       }
//     } catch (err) {
//       console.error("Failed to fetch booking:", err);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ---------------- PROPOSE RESCHEDULE ----------------
//   proposeReschedule: async (bookingId, proposedAt) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ proposedAt }),
//         }
//       );
      
//       if (res.success && res.data) {
//         // Update booking in state
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: res.data.status || b.status, scheduledAt: res.data.scheduledAt || b.scheduledAt } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: res.data.status || state.selectedBooking.status, scheduledAt: res.data.scheduledAt || state.selectedBooking.scheduledAt }
//             : state.selectedBooking
//         }));
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to propose reschedule:", err);
//     }
//   },

//   // ---------------- CONFIRM BOOKING ----------------
//   confirmBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
//         { method: "PATCH" }
//       );
//       console.log(res);
      
      
//       if (res.success && res.data) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: res.data.status || "confirmed" } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: res.data.status || "confirmed" }
//             : state.selectedBooking
//         }));
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to confirm booking:", err);
//     }
//   },

//   // ---------------- CANCEL BOOKING ----------------
//   cancelBooking: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
//         { 
//           method: "PATCH", 
//           body: JSON.stringify({ reason }) 
//         }
//       );
      
//       if (res.success) {
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
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to cancel booking:", err);
//     }
//   },

//   // ---------------- SEND MESSAGE ----------------
//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     set({ isSending: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
//         {
//           method: "POST",
//           body: JSON.stringify({ content, messageType }),
//         }
//       );
      
//       if (res.success && res.data) {
//         set((state) => ({ messages: [...state.messages, res.data] }));
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   // ---------------- GET MESSAGES/HISTORY ----------------
//   fetchMessages: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);
      
//       if (res.success && Array.isArray(res.data)) {
//         set({ messages: res.data });
//         return res.data;
//       } else {
//         set({ messages: [] });
//         return [];
//       }
//     } catch (err) {
//       console.error("Failed to fetch messages:", err);
//       set({ messages: [] });
//       return [];
//     }
//   },

//   // ---------------- END SESSION ----------------
//   endSession: async (bookingId, notes = "") => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
//         {
//           method: "POST",
//           body: JSON.stringify({ notes }),
//         }
//       );
      
//       if (res.success) {
//         // Update booking status to completed
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
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to end session:", err);
//     }
//   },
// }));












// import { create } from "zustand";
// import useTutorAuthStore from "./tutorAuthStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com";

// export const useTutorChatStore = create((set, get) => ({
//   // ---------------- STATES ----------------
//   bookings: [],
//   selectedBooking: null,
//   messages: [],
//   isLoading: false,
//   isSending: false,

//   // ---------------- GET ALL BOOKINGS ----------------
//   fetchBookings: async (status = null) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       let url = `${API_BASE}/api/tutor/bookings`;
      
//       // Add status filter if provided (e.g., "pending")
//       if (status) {
//         url += `?status=${status}`;
//       }

//       const res = await fetchWithAuth(url);

//       if (res.success && Array.isArray(res.data)) {
//         // Map API bookings to UI-friendly format
//         const mappedBookings = res.data.map((booking) => ({
//           id: booking.id,
//           studentId: booking.userId || booking.user?.id,
//           participant_name: booking.user?.name || "Student",
//           participant_role: "student",
//           last_message: booking.lastMessage?.content || "",
//           last_message_time: booking.lastMessage?.createdAt || null,
//           status: booking.status?.toLowerCase() || "pending", // Convert to lowercase
//           scheduledAt: booking.scheduledAt || null,
//           duration: booking.duration || null,
//           unread_count: booking.unreadCount || 0,
//           purpose: booking.purpose || "",
//           avatar: booking.user?.avatar || null,
//           isBooking: true,
//         }));

//         set({ bookings: mappedBookings });
//       } else {
//         set({ bookings: [] });
//       }
//     } catch (err) {
//       console.error("Failed to fetch bookings:", err);
//       set({ bookings: [] });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ---------------- VIEW BOOKING DETAILS ----------------
//   fetchBooking: async (bookingId) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}`);
      
//       if (res.success && res.data) {
//         const booking = {
//           id: res.data.id,
//           studentId: res.data.userId || res.data.user?.id,
//           participant_name: res.data.user?.name || "Student",
//           participant_role: "student",
//           last_message: res.data.lastMessage?.content || "",
//           last_message_time: res.data.lastMessage?.createdAt || null,
//           status: res.data.status?.toLowerCase() || "pending",
//           scheduledAt: res.data.scheduledAt || null,
//           duration: res.data.duration || null,
//           unread_count: res.data.unreadCount || 0,
//           purpose: res.data.purpose || "",
//           avatar: res.data.user?.avatar || null,
//           isBooking: true,
//         };
        
//         set({ selectedBooking: booking });
//         return booking;
//       }
//     } catch (err) {
//       console.error("Failed to fetch booking:", err);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ---------------- PROPOSE RESCHEDULE ----------------
//   proposeReschedule: async (bookingId, proposedAt) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ proposedAt }),
//         }
//       );
      
//       if (res.success && res.data) {
//         // Update booking in state
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, status: res.data.status?.toLowerCase() || b.status, scheduledAt: res.data.scheduledAt || b.scheduledAt } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: res.data.status?.toLowerCase() || state.selectedBooking.status, scheduledAt: res.data.scheduledAt || state.selectedBooking.scheduledAt }
//             : state.selectedBooking
//         }));
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to propose reschedule:", err);
//     }
//   },

//   // ---------------- CONFIRM BOOKING ----------------
//   // confirmBooking: async (bookingId) => {
//   //   try {
//   //     const { fetchWithAuth } = useTutorAuthStore.getState();
//   //     const res = await fetchWithAuth(
//   //       `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
//   //       { method: "PATCH" }
//   //     );
//   //     console.log(res);
      
      
//   //     if (res.success && res.data) {
//   //       set((state) => ({
//   //         bookings: state.bookings.map((b) => 
//   //           b.id === bookingId 
//   //             ? { ...b, status: res.data.status?.toLowerCase() || "confirmed" } 
//   //             : b
//   //         ),
//   //         selectedBooking: state.selectedBooking?.id === bookingId
//   //           ? { ...state.selectedBooking, status: res.data.status?.toLowerCase() || "confirmed" }
//   //           : state.selectedBooking
//   //       }));
//   //       return res.data;
//   //     }
//   //   } catch (err) {
//   //     console.error("Failed to confirm booking:", err);
//   //   }
//   // },
//   // In useTutorChatStore

//   confirmBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         // Option A: optimistic + full refresh (recommended)
//         set((state) => ({
//           bookings: state.bookings.map((b) =>
//             b.id === bookingId
//               ? { ...b, status: "confirmed" }
//               : b
//           ),
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? { ...state.selectedBooking, status: "confirmed" }
//               : state.selectedBooking,
//         }));

//         // Important: refresh list from server
//         await get().fetchBookings();           // ← add this
//         // or: await get().fetchBookings("confirmed");  // if you want only confirmed
//       }

//       return res.data;
//     } catch (err) {
//       console.error("Failed to confirm booking:", err);
//     }
//   },

//   // ---------------- CANCEL BOOKING ----------------
//   cancelBooking: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
//         { 
//           method: "PATCH", 
//           body: JSON.stringify({ reason }) 
//         }
//       );
      
//       if (res.success) {
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
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to cancel booking:", err);
//     }
//   },

//   // ---------------- SEND MESSAGE ----------------
//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     set({ isSending: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
//         {
//           method: "POST",
//           body: JSON.stringify({ content, messageType }),
//         }
//       );
      
//       if (res.success && res.data) {
//         set((state) => ({ messages: [...state.messages, res.data] }));
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to send message:", err);
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   // ---------------- GET MESSAGES/HISTORY ----------------
//   fetchMessages: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);
      
//       if (res.success && Array.isArray(res.data)) {
//         set({ messages: res.data });
//         return res.data;
//       } else {
//         set({ messages: [] });
//         return [];
//       }
//     } catch (err) {
//       console.error("Failed to fetch messages:", err);
//       set({ messages: [] });
//       return [];
//     }
//   },

//   // ---------------- END SESSION ----------------
//   endSession: async (bookingId, notes = "") => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
//         {
//           method: "POST",
//           body: JSON.stringify({ notes }),
//         }
//       );
      
//       if (res.success) {
//         // Update booking status to completed
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
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to end session:", err);
//     }
//   },
// }));





// import { create } from "zustand";
// import useTutorAuthStore from "./tutorAuthStore";

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
//   duration: booking.duration || null,
//   unread_count: booking.unreadCount || 0,
//   purpose: booking.purpose || "",
//   avatar: booking.user?.avatar || null,
//   isBooking: true,
// });

// export const useTutorChatStore = create((set, get) => ({
//   // ── State ────────────────────────────────────────────────
//   bookings: [],
//   selectedBooking: null,
//   messages: [],
//   isLoading: false,
//   isSending: false,
//   // You can add: error: null,  later if needed

//   // ── Helpers ──────────────────────────────────────────────
//   _refreshBookings: async (statusFilter = null) => {
//     await get().fetchBookings(statusFilter);
//   },

//   // ── Fetch all bookings (with optional status filter) ─────
//   fetchBookings: async (status = null) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       let url = `${API_BASE}/api/tutor/bookings`;
//       if (status) url += `?status=${status}`;

//       const res = await fetchWithAuth(url);

//       if (res.success && Array.isArray(res.data)) {
//         const mapped = res.data.map(mapBookingToUI);
//         set({ bookings: mapped });
//       } else {
//         set({ bookings: [] });
//       }
//     } catch (err) {
//       console.error("fetchBookings failed:", err);
//       set({ bookings: [] });
//       // Optional: set({ error: err.message });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ── Fetch single booking details ─────────────────────────
//   fetchBooking: async (bookingId) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}`);

//       if (res.success && res.data) {
//         const booking = mapBookingToUI(res.data);
//         set({ selectedBooking: booking });
//         return booking;
//       }
//       return null;
//     } catch (err) {
//       console.error("fetchBooking failed:", err);
//       return null;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ── Propose reschedule ───────────────────────────────────
//   proposeReschedule: async (bookingId, proposedAt) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const prevBooking = get().bookings.find(b => b.id === bookingId);

//       // Optimistic update
//       set(state => ({
//         bookings: state.bookings.map(b =>
//           b.id === bookingId ? { ...b, status: "reschedule-proposed" } : b
//         ),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "reschedule-proposed" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ proposedAt }),
//         }
//       );

//       if (res.success && res.data) {
//         // Update with real data + refresh list
//         set(state => ({
//           bookings: state.bookings.map(b =>
//             b.id === bookingId ? mapBookingToUI(res.data) : b
//           ),
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? mapBookingToUI(res.data)
//               : state.selectedBooking,
//         }));
//         await get()._refreshBookings(); // or pass status filter if you use one
//         return res.data;
//       }

//       // Rollback on failure
//       if (prevBooking) {
//         set(state => ({
//           bookings: state.bookings.map(b => (b.id === bookingId ? prevBooking : b)),
//           selectedBooking:
//             state.selectedBooking?.id === bookingId ? prevBooking : state.selectedBooking,
//         }));
//       }
//       throw new Error("Reschedule failed");
//     } catch (err) {
//       console.error("proposeReschedule failed:", err);
//       throw err; // let component show error if needed
//     }
//   },

//   // ── Confirm booking ──────────────────────────────────────
//   confirmBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       // Optimistic
//       set(state => ({
//         bookings: state.bookings.map(b =>
//           b.id === bookingId ? { ...b, status: "confirmed" } : b
//         ),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "confirmed" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         set(state => ({
//           bookings: state.bookings.map(b =>
//             b.id === bookingId ? mapBookingToUI(res.data) : b
//           ),
//           selectedBooking:
//             state.selectedBooking?.id === bookingId
//               ? mapBookingToUI(res.data)
//               : state.selectedBooking,
//         }));
//         await get()._refreshBookings(); // ← this fixes the main issue
//         return res.data;
//       }

//       throw new Error("Confirm failed");
//     } catch (err) {
//       console.error("confirmBooking failed:", err);
//       // Optional: rollback here if you want to be strict
//       await get()._refreshBookings(); // safest: just reload everything
//       throw err;
//     }
//   },

//   // ── Cancel booking ───────────────────────────────────────
//   cancelBooking: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       // Optimistic
//       set(state => ({
//         bookings: state.bookings.map(b =>
//           b.id === bookingId ? { ...b, status: "cancelled" } : b
//         ),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "cancelled" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ reason }),
//         }
//       );

//       if (res.success) {
//         await get()._refreshBookings();
//         return true;
//       }

//       throw new Error("Cancel failed");
//     } catch (err) {
//       console.error("cancelBooking failed:", err);
//       await get()._refreshBookings(); // recover
//       throw err;
//     }
//   },

//   // ── Send message ─────────────────────────────────────────
//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     set({ isSending: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
//         {
//           method: "POST",
//           body: JSON.stringify({ content, messageType }),
//         }
//       );

//       if (res.success && res.data) {
//         set(state => ({ messages: [...state.messages, res.data] }));
//         // Optional: refresh bookings to update last_message / unread
//         await get()._refreshBookings();
//         return res.data;
//       }
//       throw new Error("Send failed");
//     } catch (err) {
//       console.error("sendMessage failed:", err);
//       throw err;
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   // ── Fetch messages ───────────────────────────────────────
//   fetchMessages: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

//       if (res.success && Array.isArray(res.data)) {
//         set({ messages: res.data });
//         return res.data;
//       }
//       set({ messages: [] });
//       return [];
//     } catch (err) {
//       console.error("fetchMessages failed:", err);
//       set({ messages: [] });
//       return [];
//     }
//   },

//   // ── End session ──────────────────────────────────────────
//   endSession: async (bookingId, notes = "") => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       // Optimistic
//       set(state => ({
//         bookings: state.bookings.map(b =>
//           b.id === bookingId ? { ...b, status: "completed" } : b
//         ),
//         selectedBooking:
//           state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, status: "completed" }
//             : state.selectedBooking,
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
//         {
//           method: "POST",
//           body: JSON.stringify({ notes }),
//         }
//       );

//       if (res.success) {
//         await get()._refreshBookings();
//         return true;
//       }

//       throw new Error("End session failed");
//     } catch (err) {
//       console.error("endSession failed:", err);
//       await get()._refreshBookings();
//       throw err;
//     }
//   },
// }));











import { create } from "zustand";
import useTutorAuthStore from "./tutorAuthStore";

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
  duration: booking.duration || null,
  unread_count: booking.unreadCount || 0,
  purpose: booking.purpose || "",
  avatar: booking.user?.avatar || null,
  isBooking: true,
});

export const useTutorChatStore = create((set, get) => ({
  bookings: [],
  selectedBooking: null,
  messages: [],
  isLoading: false,
  isSending: false,

  _refreshBookings: async (statusFilter = null) => {
    await get().fetchBookings(statusFilter);
  },

  fetchBookings: async (status = null) => {
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      let url = `${API_BASE}/api/tutor/bookings`;
      if (status) url += `?status=${status}`;

      const res = await fetchWithAuth(url);

      if (res.success && Array.isArray(res.data)) {
        const mapped = res.data.map(mapBookingToUI);
        set({ bookings: mapped });
      } else {
        set({ bookings: [] });
      }
    } catch (err) {
      console.error("fetchBookings failed:", err);
      set({ bookings: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchBooking: async (bookingId) => {
    set({ isLoading: true });
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}`);

      if (res.success && res.data) {
        const booking = mapBookingToUI(res.data);
        set({ selectedBooking: booking });
        return booking;
      }
      return null;
    } catch (err) {
      console.error("fetchBooking failed:", err);
      return null;
    } finally {
      set({ isLoading: false });
    }
  },

  proposeReschedule: async (bookingId, proposedAt) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const prevBooking = get().bookings.find(b => b.id === bookingId);

      set(state => ({
        bookings: state.bookings.map(b =>
          b.id === bookingId ? { ...b, status: "reschedule-proposed" } : b
        ),
        selectedBooking:
          state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: "reschedule-proposed" }
            : state.selectedBooking,
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/reschedule`,
        {
          method: "PATCH",
          body: JSON.stringify({ proposedAt }),
        }
      );

      if (res.success && res.data) {
        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === bookingId ? mapBookingToUI(res.data) : b
          ),
          selectedBooking:
            state.selectedBooking?.id === bookingId
              ? mapBookingToUI(res.data)
              : state.selectedBooking,
        }));
        await get()._refreshBookings();
        return res.data;
      }

      // rollback
      if (prevBooking) {
        set(state => ({
          bookings: state.bookings.map(b => b.id === bookingId ? prevBooking : b),
          selectedBooking:
            state.selectedBooking?.id === bookingId ? prevBooking : state.selectedBooking,
        }));
      }
      throw new Error("Reschedule failed");
    } catch (err) {
      console.error("proposeReschedule failed:", err);
      throw err;
    }
  },

  confirmBooking: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set(state => ({
        bookings: state.bookings.map(b =>
          b.id === bookingId ? { ...b, status: "confirmed" } : b
        ),
        selectedBooking:
          state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: "confirmed" }
            : state.selectedBooking,
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/confirm`,
        { method: "PATCH" }
      );

      if (res.success && res.data) {
        set(state => ({
          bookings: state.bookings.map(b =>
            b.id === bookingId ? mapBookingToUI(res.data) : b
          ),
          selectedBooking:
            state.selectedBooking?.id === bookingId
              ? mapBookingToUI(res.data)
              : state.selectedBooking,
        }));
        await get()._refreshBookings();           // Keep this
        return res.data;
      }

      throw new Error("Confirm failed");
    } catch (err) {
      console.error("confirmBooking failed:", err);
      await get()._refreshBookings();           // Recover
      throw err;
    }
  },

  cancelBooking: async (bookingId, reason) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set(state => ({
        bookings: state.bookings.map(b =>
          b.id === bookingId ? { ...b, status: "cancelled" } : b
        ),
        selectedBooking:
          state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: "cancelled" }
            : state.selectedBooking,
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/cancel`,
        {
          method: "PATCH",
          body: JSON.stringify({ reason }),
        }
      );

      if (res.success) {
        await get()._refreshBookings();
        return true;
      }

      throw new Error("Cancel failed");
    } catch (err) {
      console.error("cancelBooking failed:", err);
      await get()._refreshBookings();
      throw err;
    }
  },

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
        set(state => ({ messages: [...state.messages, res.data] }));

        // IMPORTANT FIX: refresh bookings so last_message & unread update
        await get()._refreshBookings();

        return res.data;
      }
      throw new Error("Send failed");
    } catch (err) {
      console.error("sendMessage failed:", err);
      throw err;
    } finally {
      set({ isSending: false });
    }
  },

  fetchMessages: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

      if (res.success && Array.isArray(res.data)) {
        set({ messages: res.data });
        return res.data;
      }
      set({ messages: [] });
      return [];
    } catch (err) {
      console.error("fetchMessages failed:", err);
      set({ messages: [] });
      return [];
    }
  },

  endSession: async (bookingId, notes = "") => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set(state => ({
        bookings: state.bookings.map(b =>
          b.id === bookingId ? { ...b, status: "completed" } : b
        ),
        selectedBooking:
          state.selectedBooking?.id === bookingId
            ? { ...state.selectedBooking, status: "completed" }
            : state.selectedBooking,
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/end`,
        {
          method: "POST",
          body: JSON.stringify({ notes }),
        }
      );

      if (res.success) {
        await get()._refreshBookings();
        return true;
      }

      throw new Error("End session failed");
    } catch (err) {
      console.error("endSession failed:", err);
      await get()._refreshBookings();
      throw err;
    }
  },
}));