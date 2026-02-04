
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

//   // ---------------- FETCH TUTORS ----------------
//   fetchTutors: async ({ search, category } = {}) => {
//     set({ isLoading: true, error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/tutors`;
//       const params = new URLSearchParams();
//       if (search) params.append("search", search);
//       if (category) params.append("category", category);
//       if (params.toString()) url += `?${params.toString()}`;

//       console.log("Fetching tutors →", url);

//       const res = await fetchWithAuth(url);

//       console.log("Tutors API full response:", res);

//       // Safety checks
//       if (!res?.success) {
//         console.warn("Tutors fetch failed - no success flag", res);
//         set({ tutors: [], isLoading: false });
//         return;
//       }

//       let rawTutors = res.data || res.tutors || []; // backend might use "data" or "tutors"

//       if (!Array.isArray(rawTutors)) {
//         console.error("Tutors response is not an array!", rawTutors);
//         set({ tutors: [], isLoading: false });
//         return;
//       }

//       const mappedTutors = rawTutors.map((tutor) => ({
//         id: tutor.id || tutor._id,
//         participant_name: tutor.name || "Unknown Tutor",
//         participant_role: "tutor",
//         avatar: tutor.avatar || null,
//         bio: tutor.bio || "",
//         subjects: tutor.subjects || [],
//         completedSessions: tutor.completedSessions || 0,
//         rating: tutor.rating || null,
//         isTutor: true,
//         // default values for chat-like display
//         last_message: "",
//         last_message_time: null,
//         status: "available",
//         scheduledAt: null,
//         duration: null,
//         unread_count: 0,
//       }));

//       // Optional: show ALL tutors in "Tutors" tab (remove booked filter for this view)
//       // If you want only available → keep the filter below
//       // const bookedTutorIds = get().bookings.map(b => b.tutorId);
//       // const availableTutors = mappedTutors.filter(t => !bookedTutorIds.includes(t.id));

//       // For now — show all (most users expect to see tutors even if booked)
//       const availableTutors = mappedTutors;

//       console.log(`Loaded ${mappedTutors.length} tutors → showing ${availableTutors.length}`);

//       set({ tutors: availableTutors, isLoading: false });
//     } catch (err) {
//       console.error("fetchTutors crashed:", err);
//       set({ tutors: [], isLoading: false, error: err.message });
//     }
//   },

//   // ---------------- FETCH ALL BOOKINGS ----------------
//   fetchBookings: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`);
//       console.log("📚 Bookings response:", res);

//       if (res.success && Array.isArray(res.data)) {
//         const mappedBookings = res.data.map((booking) => ({
//           id: booking.id,
//           tutorId: booking.tutorId || booking.tutor?.id,
//           participant_name: booking.tutor?.name || "Unknown",
//           participant_role: "tutor",
//           last_message: booking.lastMessage?.content || "",
//           last_message_time: booking.lastMessage?.createdAt || null,
//           status: booking.status || "pending",
//           scheduledAt: booking.scheduledAt || null,
//           duration: booking.duration || null,
//           unread_count: booking.unreadCount || 0,
//           purpose: booking.purpose || "",
//           avatar: booking.tutor?.avatar || null,
//           bio: booking.tutor?.bio || "",
//           subjects: booking.tutor?.subjects || [],
//           completedSessions: booking.tutor?.completedSessions || 0,
//           rating: booking.rating || null,
//           feedback: booking.feedback || null,
//           isBooking: true,
//         }));

//         const currentSelection = get().selectedBooking;
//         let newSelection = currentSelection;

//         if (currentSelection?.isTutor) {
//           const bookingForTutor = mappedBookings.find(b => b.tutorId === currentSelection.id);
//           if (bookingForTutor) {
//             newSelection = bookingForTutor;
//           }
//         } else if (currentSelection?.isBooking) {
//           const updatedBooking = mappedBookings.find(b => b.id === currentSelection.id);
//           newSelection = updatedBooking || currentSelection;
//         }

//         set({ 
//           bookings: mappedBookings,
//           selectedBooking: newSelection,
//           isLoading: false
//         });

//         const bookedTutorIds = mappedBookings.map(b => b.tutorId);
//         const tutors = get().tutors;
//         const availableTutors = tutors.filter(t => !bookedTutorIds.includes(t.id));
//         set({ tutors: availableTutors });
//       } else {
//         set({ bookings: [], isLoading: false });
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch bookings:", err);
//       set({ bookings: [], isLoading: false, error: err.message });
//     }
//   },

//   // ---------------- CREATE NEW BOOKING ----------------
//   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
//     set({ isLoading: true, error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       console.log("📝 Creating booking:", { tutorId, purpose, scheduledAt, duration });

//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
//       });

//       console.log("✅ Create booking response:", res);

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
//       console.error("❌ Failed to create booking:", err);
//       set({ isLoading: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- FETCH SINGLE BOOKING DETAILS ----------------
//   fetchBooking: async (bookingId) => {
//     set({ isLoading: true, error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}`);
//       console.log("📖 Booking details response:", res);

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
//         set({ selectedBooking: bookingDetails, isLoading: false });
//         return bookingDetails;
//       }
//       throw new Error(res.message || "Failed to fetch booking");
//     } catch (err) {
//       console.error("❌ Failed to fetch booking:", err);
//       set({ isLoading: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- CONFIRM BOOKING ----------------
//   confirmBooking: async (bookingId) => {
//     set({ error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       console.log("✅ Confirming booking:", bookingId);

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/users/bookings/${bookingId}/confirm`,
//         { 
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" }
//         }
//       );

//       console.log("✅ Confirm response:", res);

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
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to confirm booking");
//     } catch (err) {
//       console.error("❌ Failed to confirm booking:", err);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- CANCEL BOOKING ----------------
//   cancelBooking: async (bookingId, reason) => {
//     set({ error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       console.log("❌ Cancelling booking:", bookingId, "Reason:", reason);

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/users/bookings/${bookingId}/cancel`,
//         { 
//           method: "PATCH",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ reason })
//         }
//       );

//       console.log("❌ Cancel response:", res);

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
//           get().fetchTutors();
//         }

//         return res.data;
//       }
//       throw new Error(res.message || "Failed to cancel booking");
//     } catch (err) {
//       console.error("❌ Failed to cancel booking:", err);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- START CHAT ----------------
//   startChat: async (bookingId) => {
//     set({ error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       console.log("🚀 Starting chat for booking:", bookingId);

//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/start`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("🚀 Start chat response:", res);

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
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to start chat");
//     } catch (err) {
//       console.error("❌ Failed to start chat:", err);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- SEND MESSAGE ----------------
//   sendMessage: async (bookingId, content) => {
//     set({ isSending: true, error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       console.log("💬 Sending message to booking:", bookingId);

//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ content, messageType: "TEXT" }),
//       });

//       console.log("💬 Send message response:", res);

//       if (res.success && res.data) {
//         set((state) => ({ 
//           messages: [...state.messages, res.data],
//           isSending: false 
//         }));
        
//         // Update last message in bookings
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
        
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to send message");
//     } catch (err) {
//       console.error("❌ Failed to send message:", err);
//       set({ isSending: false, error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- GET MESSAGES ----------------
//   fetchMessages: async (bookingId) => {
//     set({ error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`);
      
//       if (res.success && Array.isArray(res.data)) {
//         set({ messages: res.data });
//         return res.data;
//       } else {
//         set({ messages: [] });
//         return [];
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch messages:", err);
//       set({ messages: [], error: err.message });
//       return [];
//     }
//   },

//   // ---------------- END CHAT ----------------
//   endChat: async (bookingId) => {
//     set({ error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       console.log("🏁 Ending chat for booking:", bookingId);

//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/end`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" }
//       });

//       console.log("🏁 End chat response:", res);

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
//         return res.data;
//       }
//       throw new Error(res.message || "Failed to end chat");
//     } catch (err) {
//       console.error("❌ Failed to end chat:", err);
//       set({ error: err.message });
//       throw err;
//     }
//   },

//   // ---------------- RATE SESSION ----------------
//   rateSession: async (bookingId, rating, feedback) => {
//     set({ error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       console.log("⭐ Rating session:", bookingId, "Rating:", rating);

//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/rate`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ rating, feedback }),
//       });

//       console.log("⭐ Rate session response:", res);

//       if (res.success) {
//         // Update booking with rating
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
        
//         return true;
//       }
//       throw new Error(res.message || "Failed to rate session");
//     } catch (err) {
//       console.error("❌ Failed to rate session:", err);
//       set({ error: err.message });
//       return false;
//     }
//   },

//   // ---------------- CHAT HISTORY ----------------
//   fetchChatHistory: async (data) => {
//     set({ isLoading: true, error: null });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/chat/history`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(data),
//       });

//       console.log("📜 Chat history response:", res);

//       if (res.success && Array.isArray(res.data)) {
//         set({ chatHistory: res.data, isLoading: false });
//         return res.data;
//       } else {
//         set({ chatHistory: [], isLoading: false });
//         return [];
//       }
//     } catch (err) {
//       console.error("❌ Failed to fetch chat history:", err);
//       set({ chatHistory: [], isLoading: false, error: err.message });
//       return [];
//     }
//   },

//   // ---------------- CLEAR ERROR ----------------
//   clearError: () => set({ error: null }),

//   // ---------------- SET SELECTED BOOKING ----------------
//   setSelectedBooking: (booking) => set({ selectedBooking: booking }),
// }));










import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com";

export const useUserChatStore = create((set, get) => ({
  // ---------------- STATES ----------------
  tutors: [],
  bookings: [],
  selectedBooking: null,
  messages: [],
  chatHistory: [],
  isLoading: false,
  isSending: false,
  error: null,

  // ---------------- FETCH TUTORS ----------------
  fetchTutors: async ({ search, category } = {}) => {
    console.log("[fetchTutors] START - params:", { search, category });
    set({ isLoading: true, error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      let url = `${API_BASE}/api/users/tutors`;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (params.toString()) url += `?${params.toString()}`;

      console.log("[fetchTutors] Fetching URL:", url);

      const res = await fetchWithAuth(url);

      console.log("[fetchTutors] Full API response:", res);

      if (!res?.success) {
        console.warn("[fetchTutors] API did not return success flag", res);
        set({ tutors: [], isLoading: false });
        return;
      }

      let rawTutors = res.data || res.tutors || [];
      console.log("[fetchTutors] Raw tutors count:", rawTutors.length);

      if (!Array.isArray(rawTutors)) {
        console.error("[fetchTutors] Tutors response is NOT an array!", rawTutors);
        set({ tutors: [], isLoading: false });
        return;
      }

      const mappedTutors = rawTutors.map((tutor) => {
        const mapped = {
          id: tutor.id || tutor._id,
          participant_name: tutor.name || "Unknown Tutor",
          participant_role: "tutor",
          avatar: tutor.avatar || null,
          bio: tutor.bio || "",
          subjects: tutor.subjects || [],
          completedSessions: tutor.completedSessions || 0,
          rating: tutor.rating || null,
          isTutor: true,
          last_message: "",
          last_message_time: null,
          status: "available",
          scheduledAt: null,
          duration: null,
          unread_count: 0,
        };
        console.log("[fetchTutors] Mapped single tutor:", mapped.participant_name, mapped.id);
        return mapped;
      });

      const availableTutors = mappedTutors; // Showing all for now
      console.log(
        `[fetchTutors] SUCCESS - Loaded ${mappedTutors.length} tutors → showing ${availableTutors.length}`
      );

      set({ tutors: availableTutors, isLoading: false });
    } catch (err) {
      console.error("[fetchTutors] CRASH:", err.message, err.stack);
      set({ tutors: [], isLoading: false, error: err.message });
    }
  },

  // ---------------- FETCH ALL BOOKINGS ----------------
  fetchBookings: async () => {
    console.log("[fetchBookings] START");
    set({ isLoading: true, error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings`;
      console.log("[fetchBookings] Fetching URL:", url);

      const res = await fetchWithAuth(url);
      console.log("[fetchBookings] Full API response:", res);

      if (res.success && Array.isArray(res.data)) {
        const mappedBookings = res.data.map((booking) => {
          const mapped = {
            id: booking.id,
            tutorId: booking.tutorId || booking.tutor?.id,
            participant_name: booking.tutor?.name || "Unknown",
            participant_role: "tutor",
            last_message: booking.lastMessage?.content || "",
            last_message_time: booking.lastMessage?.createdAt || null,
            status: booking.status || "pending",
            scheduledAt: booking.scheduledAt || null,
            duration: booking.duration || null,
            unread_count: booking.unreadCount || 0,
            purpose: booking.purpose || "",
            avatar: booking.tutor?.avatar || null,
            bio: booking.tutor?.bio || "",
            subjects: booking.tutor?.subjects || [],
            completedSessions: booking.tutor?.completedSessions || 0,
            rating: booking.rating || null,
            feedback: booking.feedback || null,
            isBooking: true,
          };
          console.log("[fetchBookings] Mapped booking:", mapped.id, mapped.participant_name, mapped.status);
          return mapped;
        });

        const currentSelection = get().selectedBooking;
        let newSelection = currentSelection;

        if (currentSelection?.isTutor) {
          const bookingForTutor = mappedBookings.find(b => b.tutorId === currentSelection.id);
          if (bookingForTutor) {
            newSelection = bookingForTutor;
            console.log("[fetchBookings] Updated selection from tutor to booking:", newSelection.id);
          }
        } else if (currentSelection?.isBooking) {
          const updatedBooking = mappedBookings.find(b => b.id === currentSelection.id);
          newSelection = updatedBooking || currentSelection;
          console.log("[fetchBookings] Updated existing booking selection:", newSelection.id);
        }

        set({ 
          bookings: mappedBookings,
          selectedBooking: newSelection,
          isLoading: false 
        });
        console.log("[fetchBookings] SUCCESS - Bookings count:", mappedBookings.length);

        const bookedTutorIds = mappedBookings.map(b => b.tutorId);
        const tutors = get().tutors;
        const availableTutors = tutors.filter(t => !bookedTutorIds.includes(t.id));
        set({ tutors: availableTutors });
        console.log("[fetchBookings] Available tutors after filter:", availableTutors.length);
      } else {
        console.warn("[fetchBookings] No success or data not array", res);
        set({ bookings: [], isLoading: false });
      }
    } catch (err) {
      console.error("[fetchBookings] CRASH:", err.message, err.stack);
      set({ bookings: [], isLoading: false, error: err.message });
    }
  },

  // ---------------- CREATE NEW BOOKING ----------------
  createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
    console.log("[createBooking] START - params:", { tutorId, purpose, scheduledAt, duration });
    set({ isLoading: true, error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings`;
      console.log("[createBooking] POST to:", url);

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
      });

      console.log("[createBooking] Full response:", res);

      if (res.success && res.data) {
        const newBooking = {
          id: res.data.id,
          tutorId: res.data.tutorId || res.data.tutor?.id,
          participant_name: res.data.tutor?.name || "Unknown",
          participant_role: "tutor",
          last_message: "",
          last_message_time: null,
          status: res.data.status || "pending",
          scheduledAt: res.data.scheduledAt || null,
          duration: res.data.duration || null,
          unread_count: 0,
          purpose: res.data.purpose || purpose,
          avatar: res.data.tutor?.avatar || null,
          bio: res.data.tutor?.bio || "",
          subjects: res.data.tutor?.subjects || [],
          completedSessions: res.data.tutor?.completedSessions || 0,
          isBooking: true,
        };
        console.log("[createBooking] Created new booking:", newBooking.id, newBooking.participant_name);

        set((state) => ({ 
          bookings: [...state.bookings, newBooking],
          tutors: state.tutors.filter(t => t.id !== tutorId),
          selectedBooking: state.selectedBooking?.id === tutorId ? newBooking : state.selectedBooking,
          isLoading: false
        }));

        return newBooking;
      }
      throw new Error(res.message || "Failed to create booking");
    } catch (err) {
      console.error("[createBooking] CRASH:", err.message, err.stack);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

  // ---------------- FETCH SINGLE BOOKING DETAILS ----------------
  fetchBooking: async (bookingId) => {
    console.log("[fetchBooking] START - ID:", bookingId);
    set({ isLoading: true, error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings/${bookingId}`;
      console.log("[fetchBooking] Fetching:", url);

      const res = await fetchWithAuth(url);
      console.log("[fetchBooking] Response:", res);

      if (res.success && res.data) {
        const bookingDetails = {
          ...res.data,
          participant_name: res.data.tutor?.name || "Unknown",
          participant_role: "tutor",
          avatar: res.data.tutor?.avatar || null,
          bio: res.data.tutor?.bio || "",
          subjects: res.data.tutor?.subjects || [],
          isBooking: true,
        };
        console.log("[fetchBooking] Fetched details:", bookingDetails.id, bookingDetails.participant_name);

        set({ selectedBooking: bookingDetails, isLoading: false });
        return bookingDetails;
      }
      throw new Error(res.message || "Failed to fetch booking");
    } catch (err) {
      console.error("[fetchBooking] CRASH:", err.message, err.stack);
      set({ isLoading: false, error: err.message });
      throw err;
    }
  },

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

  // ---------------- SEND MESSAGE ----------------
  sendMessage: async (bookingId, content) => {
    console.log("[sendMessage] START - Booking:", bookingId, "Content:", content);
    set({ isSending: true, error: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const url = `${API_BASE}/api/users/bookings/${bookingId}/messages`;
      console.log("[sendMessage] POST to:", url);

      const res = await fetchWithAuth(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, messageType: "TEXT" }),
      });

      console.log("[sendMessage] Response:", res);

      if (res.success && res.data) {
        set((state) => ({ 
          messages: [...state.messages, res.data],
          isSending: false 
        }));
        
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId 
              ? { 
                  ...b, 
                  last_message: content,
                  last_message_time: new Date().toISOString()
                } 
              : b
          ),
        }));
        console.log("[sendMessage] SUCCESS - Message added");
        return res.data;
      }
      throw new Error(res.message || "Failed to send message");
    } catch (err) {
      console.error("[sendMessage] CRASH:", err.message, err.stack);
      set({ isSending: false, error: err.message });
      throw err;
    }
  },

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

  // ---------------- UTILS ----------------
  clearError: () => {
    console.log("[clearError] Clearing error state");
    set({ error: null });
  },

  setSelectedBooking: (booking) => {
    console.log("[setSelectedBooking] Setting:", booking?.id, booking?.participant_name);
    set({ selectedBooking: booking });
  },
}));