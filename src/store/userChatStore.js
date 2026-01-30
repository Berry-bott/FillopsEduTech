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
//   user: null, // Current user information

//   // ---------------- SET USER ----------------
//   setUser: (user) => set({ user }),

//   // ---------------- FETCH TUTORS ----------------
//   fetchTutors: async ({ search, category } = {}) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       let url = `${API_BASE}/api/users/tutors`;
//       const params = new URLSearchParams();
//       if (search) params.append("search", search);
//       if (category) params.append("category", category);
//       if (params.toString()) url += `?${params.toString()}`;

//       const res = await fetchWithAuth(url);
//       if (res.success && Array.isArray(res.data)) {
//         // Map API data to UI-friendly format
//         const mappedTutors = res.data.map((tutor) => ({
//           id: tutor.id,
//           participant_name: tutor.name,
//           participant_role: "tutor",
//           last_message: "",
//           last_message_time: null,
//           status: "active",
//           scheduledAt: null,
//           duration: null,
//           unread_count: 0,
//           avatar: tutor.avatar || null,
//           bio: tutor.bio || "",
//           expertise: tutor.expertise || [],
//           subjects: tutor.subjects || [],
//           completedSessions: tutor.completedSessions || 0,
//           isTutor: true, // Flag to identify tutors
//         }));

//         // Filter out tutors that already have bookings
//         const bookings = get().bookings;
//         const bookedTutorIds = bookings.map(b => b.tutorId);
//         const availableTutors = mappedTutors.filter(t => !bookedTutorIds.includes(t.id));

//         set({ tutors: availableTutors });
//       } else {
//         set({ tutors: [] });
//       }
//     } catch (err) {
//       console.error("Failed to fetch tutors:", err);
//       set({ tutors: [] });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ---------------- FETCH ALL BOOKINGS ----------------
//   fetchBookings: async () => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`);
//       if (res.success && Array.isArray(res.data)) {
//         // Map API bookings to UI-friendly format
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
//           unreadMessages: booking.unreadCount || 0,
//           purpose: booking.purpose || "",
//           avatar: booking.tutor?.avatar || null,
//           bio: booking.tutor?.bio || "",
//           subjects: booking.tutor?.subjects || [],
//           completedSessions: booking.tutor?.completedSessions || 0,
//           isBooking: true, // Flag to identify bookings
//         }));

//         // Keep current selection if it still exists
//         const currentSelection = get().selectedBooking;
//         let newSelection = currentSelection;

//         // If current selection was a tutor and now has a booking, select the booking
//         if (currentSelection?.isTutor) {
//           const bookingForTutor = mappedBookings.find(b => b.tutorId === currentSelection.id);
//           if (bookingForTutor) {
//             newSelection = bookingForTutor;
//           }
//         } else if (currentSelection?.isBooking) {
//           // If current selection was a booking, update it
//           const updatedBooking = mappedBookings.find(b => b.id === currentSelection.id);
//           newSelection = updatedBooking || currentSelection;
//         }

//         set({ 
//           bookings: mappedBookings,
//           selectedBooking: newSelection
//         });

//         // Remove tutors that now have bookings
//         const bookedTutorIds = mappedBookings.map(b => b.tutorId);
//         const tutors = get().tutors;
//         const availableTutors = tutors.filter(t => !bookedTutorIds.includes(t.id));
//         set({ tutors: availableTutors });
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

//   // ---------------- CREATE NEW BOOKING ----------------
//   createBooking: async ({ tutorId, purpose, scheduledAt, duration }) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`, {
//         method: "POST",
//         body: JSON.stringify({ tutorId, purpose, scheduledAt, duration }),
//       });

//       if (res.success && res.data) {
//         // Map the new booking
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
//           unreadMessages: 0,
//           purpose: res.data.purpose || purpose,
//           avatar: res.data.tutor?.avatar || null,
//           bio: res.data.tutor?.bio || "",
//           subjects: res.data.tutor?.subjects || [],
//           completedSessions: res.data.tutor?.completedSessions || 0,
//           isBooking: true,
//         };

//         // Add to bookings
//         set((state) => ({ 
//           bookings: [...state.bookings, newBooking],
//           // Remove the tutor from tutors list
//           tutors: state.tutors.filter(t => t.id !== tutorId),
//           // Select the new booking if the tutor was selected
//           selectedBooking: state.selectedBooking?.id === tutorId ? newBooking : state.selectedBooking
//         }));

//         return newBooking;
//       }
//     } catch (err) {
//       console.error("Failed to create booking:", err);
//       throw err;
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ---------------- FETCH SINGLE BOOKING ----------------
//   fetchBooking: async (bookingId) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}`);
//       if (res.success && res.data) {
//         set({ selectedBooking: res.data });
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to fetch booking:", err);
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ---------------- CONFIRM BOOKING ----------------
//   confirmBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/users/bookings/${bookingId}/confirm`,
//         { method: "PATCH" }
//       );
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
//       throw err;
//     }
//   },

//   // ---------------- CANCEL BOOKING ----------------
//   cancelBooking: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/users/bookings/${bookingId}/cancel`,
//         { method: "POST", body: JSON.stringify({ reason }) }
//       );
//       if (res.success) {
//         // Get the booking's tutor ID before removing
//         const booking = get().bookings.find(b => b.id === bookingId);
//         const tutorId = booking?.tutorId;

//         set((state) => ({
//           bookings: state.bookings.filter((b) => b.id !== bookingId),
//           selectedBooking: state.selectedBooking?.id === bookingId ? null : state.selectedBooking
//         }));

//         // Re-fetch tutors to add the cancelled booking's tutor back
//         if (tutorId) {
//           get().fetchTutors();
//         }

//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to cancel booking:", err);
//       throw err;
//     }
//   },

//   // ---------------- DELETE BOOKING/SESSION ----------------
//   deleteBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/users/bookings/${bookingId}`,
//         { method: "DELETE" }
//       );
      
//       if (res.success) {
//         // Get the booking's tutor ID before removing
//         const booking = get().bookings.find(b => b.id === bookingId);
//         const tutorId = booking?.tutorId;

//         set((state) => ({
//           bookings: state.bookings.filter((b) => b.id !== bookingId),
//           messages: state.selectedBooking?.id === bookingId ? [] : state.messages,
//           selectedBooking: state.selectedBooking?.id === bookingId ? null : state.selectedBooking
//         }));

//         // Re-fetch tutors to add the deleted booking's tutor back
//         if (tutorId) {
//           get().fetchTutors();
//         }

//         return true;
//       }
//       return false;
//     } catch (err) {
//       console.error("Failed to delete booking:", err);
//       throw err;
//     }
//   },

//   // ---------------- START CHAT ----------------
//   startChat: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/start`, {
//         method: "POST",
//       });
      
//       if (res.success) {
//         // Update booking status to active
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
//         return true;
//       }
//       return false;
//     } catch (err) {
//       console.error("Failed to start chat:", err);
//       throw err;
//     }
//   },

//   // ---------------- SEND MESSAGE ----------------
//   sendMessage: async (bookingId, content) => {
//     set({ isSending: true });
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`, {
//         method: "POST",
//         body: JSON.stringify({ content, messageType: "TEXT" }),
//       });
//       if (res.success && res.data) {
//         set((state) => ({ messages: [...state.messages, res.data] }));
//         return res.data;
//       }
//     } catch (err) {
//       console.error("Failed to send message:", err);
//       throw err;
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   // ---------------- GET MESSAGES ----------------
//   fetchMessages: async (bookingId) => {
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
//       console.error("Failed to fetch messages:", err);
//       set({ messages: [] });
//       return [];
//     }
//   },

//   // ---------------- END CHAT ----------------
//   endChat: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/end`, {
//         method: "POST",
//       });
      
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
//         return true;
//       }
//       return false;
//     } catch (err) {
//       console.error("Failed to end chat:", err);
//       throw err;
//     }
//   },

//   // ---------------- RATE SESSION ----------------
//   rateSession: async (bookingId, rating, feedback) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/rate`, {
//         method: "POST",
//         body: JSON.stringify({ rating, feedback }),
//       });
      
//       if (res.success) {
//         // Optionally update the booking with rating info
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, rating, feedback } 
//               : b
//           ),
//         }));
//         return true;
//       }
//       return false;
//     } catch (err) {
//       console.error("Failed to rate session:", err);
//       throw err;
//     }
//   },

//   // ---------------- CHAT HISTORY ----------------
//   fetchChatHistory: async (data) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/users/chat/history`, {
//         method: "POST",
//         body: JSON.stringify(data),
//       });
//       if (res.success && Array.isArray(res.data)) {
//         set({ chatHistory: res.data });
//         return res.data;
//       } else {
//         set({ chatHistory: [] });
//         return [];
//       }
//     } catch (err) {
//       console.error("Failed to fetch chat history:", err);
//       set({ chatHistory: [] });
//       return [];
//     }
//   },

//   // ---------------- RESCHEDULE BOOKING ----------------
//   rescheduleBooking: async (bookingId, scheduledAt) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/users/bookings/${bookingId}/reschedule`,
//         { 
//           method: "PATCH",
//           body: JSON.stringify({ scheduledAt })
//         }
//       );
      
//       if (res.success && res.data) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, scheduledAt: res.data.scheduledAt || scheduledAt } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, scheduledAt: res.data.scheduledAt || scheduledAt }
//             : state.selectedBooking
//         }));
//         return res.data;
//       }
//       return false;
//     } catch (err) {
//       console.error("Failed to reschedule booking:", err);
//       throw err;
//     }
//   },

//   // ---------------- UPDATE BOOKING ----------------
//   updateBooking: async (bookingId, updates) => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/users/bookings/${bookingId}`,
//         { 
//           method: "PATCH",
//           body: JSON.stringify(updates)
//         }
//       );
      
//       if (res.success && res.data) {
//         set((state) => ({
//           bookings: state.bookings.map((b) => 
//             b.id === bookingId 
//               ? { ...b, ...updates } 
//               : b
//           ),
//           selectedBooking: state.selectedBooking?.id === bookingId
//             ? { ...state.selectedBooking, ...updates }
//             : state.selectedBooking
//         }));
//         return res.data;
//       }
//       return false;
//     } catch (err) {
//       console.error("Failed to update booking:", err);
//       throw err;
//     }
//   },

//   // ---------------- CLEAR MESSAGES ----------------
//   clearMessages: () => set({ messages: [] }),

//   // ---------------- RESET STATE ----------------
//   resetState: () => set({
//     tutors: [],
//     bookings: [],
//     selectedBooking: null,
//     messages: [],
//     chatHistory: [],
//     isLoading: false,
//     isSending: false,
//   }),
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
    set({ isLoading: true, error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      let url = `${API_BASE}/api/users/tutors`;
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (params.toString()) url += `?${params.toString()}`;

      const res = await fetchWithAuth(url);
      if (res.success && Array.isArray(res.data)) {
        const mappedTutors = res.data.map((tutor) => ({
          id: tutor.id,
          participant_name: tutor.name,
          participant_role: "tutor",
          last_message: "",
          last_message_time: null,
          status: "active",
          scheduledAt: null,
          duration: null,
          unread_count: 0,
          avatar: tutor.avatar || null,
          bio: tutor.bio || "",
          expertise: tutor.expertise || [],
          subjects: tutor.subjects || [],
          completedSessions: tutor.completedSessions || 0,
          rating: tutor.rating || null,
          isTutor: true,
        }));

        const bookings = get().bookings;
        const bookedTutorIds = bookings.map(b => b.tutorId);
        const availableTutors = mappedTutors.filter(t => !bookedTutorIds.includes(t.id));

        set({ tutors: availableTutors, isLoading: false });
      } else {
        set({ tutors: [], isLoading: false });
      }
    } catch (err) {
      console.error("Failed to fetch tutors:", err);
      set({ tutors: [], isLoading: false, error: err.message });
    }
  },

  // ---------------- FETCH ALL BOOKINGS ----------------
  fetchBookings: async () => {
    set({ isLoading: true, error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings`);
      if (res.success && Array.isArray(res.data)) {
        const mappedBookings = res.data.map((booking) => ({
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
        }));

        const currentSelection = get().selectedBooking;
        let newSelection = currentSelection;

        if (currentSelection?.isTutor) {
          const bookingForTutor = mappedBookings.find(b => b.tutorId === currentSelection.id);
          if (bookingForTutor) {
            newSelection = bookingForTutor;
          }
        } else if (currentSelection?.isBooking) {
          const updatedBooking = mappedBookings.find(b => b.id === currentSelection.id);
          newSelection = updatedBooking || currentSelection;
        }

        set({ 
          bookings: mappedBookings,
          selectedBooking: newSelection,
          isLoading: false
        });

        const bookedTutorIds = mappedBookings.map(b => b.tutorId);
        const tutors = get().tutors;
        const availableTutors = tutors.filter(t => !bookedTutorIds.includes(t.id));
        set({ tutors: availableTutors });
      } else {
        set({ bookings: [], isLoading: false });
      }
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      set({ bookings: [], isLoading: false, error: err.message });
    }
  },

  // ---------------- CREATE NEW BOOKING ----------------
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

        set((state) => ({ 
          bookings: [...state.bookings, newBooking],
          tutors: state.tutors.filter(t => t.id !== tutorId),
          selectedBooking: state.selectedBooking?.id === tutorId ? newBooking : state.selectedBooking,
          isLoading: false
        }));

        return newBooking;
      }
    } catch (err) {
      console.error("Failed to create booking:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  // ---------------- FETCH SINGLE BOOKING DETAILS ----------------
  fetchBooking: async (bookingId) => {
    set({ isLoading: true, error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}`);
      if (res.success && res.data) {
        const bookingDetails = {
          ...res.data,
          participant_name: res.data.tutor?.name || "Unknown",
          participant_role: "tutor",
          isBooking: true,
        };
        set({ selectedBooking: bookingDetails, isLoading: false });
        return bookingDetails;
      }
    } catch (err) {
      console.error("Failed to fetch booking:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  // ---------------- RESCHEDULE BOOKING ----------------
  rescheduleBooking: async (bookingId, scheduledAt, duration) => {
    set({ isLoading: true, error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/users/bookings/${bookingId}/reschedule`,
        { 
          method: "PATCH",
          body: JSON.stringify({ scheduledAt, duration })
        }
      );
      
      if (res.success && res.data) {
        set((state) => ({
          bookings: state.bookings.map((b) => 
            b.id === bookingId 
              ? { 
                  ...b, 
                  scheduledAt: res.data.scheduledAt || scheduledAt,
                  duration: res.data.duration || duration,
                  status: res.data.status || b.status
                } 
              : b
          ),
          selectedBooking: state.selectedBooking?.id === bookingId
            ? { 
                ...state.selectedBooking, 
                scheduledAt: res.data.scheduledAt || scheduledAt,
                duration: res.data.duration || duration,
                status: res.data.status || state.selectedBooking.status
              }
            : state.selectedBooking,
          isLoading: false
        }));
        return res.data;
      }
    } catch (err) {
      console.error("Failed to reschedule booking:", err);
      set({ isLoading: false, error: err.message });
    }
  },

  // ---------------- CONFIRM BOOKING ----------------
  confirmBooking: async (bookingId) => {
    set({ error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/users/bookings/${bookingId}/confirm`,
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
      set({ error: err.message });
    }
  },

  // ---------------- CANCEL BOOKING ----------------
  cancelBooking: async (bookingId, reason) => {
    set({ error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/api/users/bookings/${bookingId}/cancel`,
        { method: "POST", body: JSON.stringify({ reason }) }
      );
      
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
          get().fetchTutors();
        }

        return res.data;
      }
    } catch (err) {
      console.error("Failed to cancel booking:", err);
      set({ error: err.message });
    }
  },


  // ---------------- START CHAT ----------------
  startChat: async (bookingId) => {
    set({ error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/start`, {
        method: "POST",
      });
      
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
    } catch (err) {
      console.error("Failed to start chat:", err);
      set({ error: err.message });
    }
  },

  // ---------------- SEND MESSAGE ----------------
  sendMessage: async (bookingId, content) => {
    set({ isSending: true, error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`, {
        method: "POST",
        body: JSON.stringify({ content, messageType: "TEXT" }),
      });
      if (res.success && res.data) {
        set((state) => ({ 
          messages: [...state.messages, res.data],
          isSending: false 
        }));
        
        // Update last message in bookings
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
        
        return res.data;
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      set({ isSending: false, error: err.message });
    }
  },

  // ---------------- GET MESSAGES ----------------
  fetchMessages: async (bookingId) => {
    set({ error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/messages`);
      if (res.success && Array.isArray(res.data)) {
        set({ messages: res.data });
        return res.data;
      } else {
        set({ messages: [] });
        return [];
      }
    } catch (err) {
      console.error("Failed to fetch messages:", err);
      set({ messages: [], error: err.message });
      return [];
    }
  },

  // ---------------- END CHAT ----------------
  endChat: async (bookingId) => {
    set({ error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/end`, {
        method: "POST",
      });
      
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
    } catch (err) {
      console.error("Failed to end chat:", err);
      set({ error: err.message });
    }
  },

  // ---------------- RATE SESSION ----------------
  rateSession: async (bookingId, rating, feedback) => {
    set({ error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      await fetchWithAuth(`${API_BASE}/api/users/bookings/${bookingId}/rate`, {
        method: "POST",
        body: JSON.stringify({ rating, feedback }),
      });
      
      // Update booking with rating
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
      
      return true;
    } catch (err) {
      console.error("Failed to rate session:", err);
      set({ error: err.message });
      return false;
    }
  },

  // ---------------- CHAT HISTORY ----------------
  fetchChatHistory: async (data) => {
    set({ isLoading: true, error: null });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/api/users/chat/history`, {
        method: "POST",
        body: JSON.stringify(data),
      });
      if (res.success && Array.isArray(res.data)) {
        set({ chatHistory: res.data, isLoading: false });
        return res.data;
      } else {
        set({ chatHistory: [], isLoading: false });
        return [];
      }
    } catch (err) {
      console.error("Failed to fetch chat history:", err);
      set({ chatHistory: [], isLoading: false, error: err.message });
      return [];
    }
  },



  // ---------------- CLEAR ERROR ----------------
  clearError: () => set({ error: null }),

  // ---------------- SET SELECTED BOOKING ----------------
  setSelectedBooking: (booking) => set({ selectedBooking: booking }),
}));