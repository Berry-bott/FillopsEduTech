
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
//   proposedAt: booking.proposedAt || null, // NEW: for reschedule proposals
//   duration: booking.duration || null,
//   unread_count: booking.unreadCount || 0,
//   purpose: booking.purpose || "",
//   avatar: booking.user?.avatar || null,
//   isBooking: true,
// });

// export const useTutorChatStore = create((set, get) => ({
//   bookingsByFilter: {},
//   activeFilter: "all",
//   selectedBooking: null,
//   messages: [],
//   isLoading: false,
//   isSending: false,

//   setActiveFilter: (filter) => set({ activeFilter: filter }),

//   getCurrentBookings: () => {
//     const { bookingsByFilter, activeFilter } = get();
//     return bookingsByFilter[activeFilter] || [];
//   },

//   _refreshBookingsSilent: async (specificFilter = null) => {
//     const filter = specificFilter || get().activeFilter;
//     if (!filter) return;

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       const shouldPaginate = filter === "all" || filter === "completed";
//       let rawBookings = [];

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
//             rawBookings = [...rawBookings, ...res.data];
//             hasMore = res.data.length === 10;
//             page++;

//             if (page > 50) hasMore = false;
//           } else {
//             hasMore = false;
//           }
//         }
//       } else {
//         let url = `${API_BASE}/api/tutor/bookings`;

//         if (filter !== "all") {
//           const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//           url += `?status=${backendStatus}`;
//         }

//         url += `${url.includes("?") ? "&" : "?"}limit=100`;

//         const res = await fetchWithAuth(url);

//         if (res.success && Array.isArray(res.data)) {
//           rawBookings = res.data;
//         }
//       }

//       // Sort newest first (using last message priority)
//       rawBookings.sort((a, b) => {
//         const getDate = (booking) => {
//           if (booking.lastMessage?.createdAt) return new Date(booking.lastMessage.createdAt);
//           if (booking.updatedAt) return new Date(booking.updatedAt);
//           if (booking.scheduledAt) return new Date(booking.scheduledAt);
//           if (booking.createdAt) return new Date(booking.createdAt);
//           return new Date(0);
//         };
//         return getDate(b) - getDate(a);
//       });

//       const mapped = rawBookings.map(mapBookingToUI);

//       set((state) => ({
//         bookingsByFilter: {
//           ...state.bookingsByFilter,
//           [filter]: mapped,
//         },
//       }));

//       // Update selected booking if it exists in the refreshed list
//       const current = get().selectedBooking;
//       if (current) {
//         const updated = mapped.find((b) => b.id === current.id);
//         if (updated) set({ selectedBooking: updated });
//       }
//     } catch (err) {
//       console.error("[_refreshBookingsSilent] failed for filter", filter, ":", err);
//     }
//   },

//   fetchBookings: async (filter = "all") => {
//   console.log("[fetchBookings] START", { filter });
//   set({ isLoading: true });

//   try {
//     const { fetchWithAuth } = useTutorAuthStore.getState();

//     const shouldPaginate = filter === "all" || filter === "completed";
//     let rawBookings = [];

//     if (shouldPaginate) {
//       console.log(`[fetchBookings] 📄 Fetching ALL pages for "${filter}"...`);
//       let page = 1;
//       let hasMore = true;

//       while (hasMore) {
//         let url = `${API_BASE}/api/tutor/bookings`;

//         if (filter !== "all") {
//           // ✅ Map frontend filter to backend status
//           const backendStatus = 
//             filter === "cancelled" ? "cancelled_by_user" : 
//             filter === "rescheduled" ? "reschedule_proposed" :  // ✅ ADD THIS
//             filter;
//           url += `?status=${backendStatus}&page=${page}`;
//         } else {
//           url += `?page=${page}`;
//         }

//         console.log(`[fetchBookings] 📥 Fetching page ${page}:`, url);

//         const res = await fetchWithAuth(url);

//         if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//           rawBookings = [...rawBookings, ...res.data];
//           console.log(`Page ${page}: ${res.data.length} items (total: ${rawBookings.length})`);

//           hasMore = res.data.length === 10;
//           page++;

//           if (page > 50) {
//             console.warn("[fetchBookings] Reached page limit (50), stopping");
//             hasMore = false;
//           }
//         } else {
//           hasMore = false;
//         }
//       }
//     } else {
//       let url = `${API_BASE}/api/tutor/bookings`;

//       if (filter !== "all") {
//         // ✅ Map frontend filter to backend status
//         const backendStatus = 
//           filter === "cancelled" ? "cancelled_by_user" : 
//           filter === "rescheduled" ? "reschedule_proposed" :  // ✅ ADD THIS
//           filter;
//         url += `?status=${backendStatus}`;
//       }

//       const separator = url.includes('?') ? '&' : '?';
//       url += `${separator}limit=100`;

//       console.log("[fetchBookings] Fetching URL:", url);

//       const res = await fetchWithAuth(url);

//       if (res.success && Array.isArray(res.data)) {
//         rawBookings = res.data;
//       } else {
//         rawBookings = [];
//       }
//     }

//     // ... rest of the sorting and mapping code stays the same

//   // fetchBookings: async (filter = "all") => {
//   //   console.log("[fetchBookings] START", { filter });
//   //   set({ isLoading: true });

//   //   try {
//   //     const { fetchWithAuth } = useTutorAuthStore.getState();

//   //     const shouldPaginate = filter === "all" || filter === "completed";
//   //     let rawBookings = [];

//   //     if (shouldPaginate) {
//   //       let page = 1;
//   //       let hasMore = true;

//   //       while (hasMore) {
//   //         let url = `${API_BASE}/api/tutor/bookings`;

//   //         if (filter !== "all") {
//   //           const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//   //           url += `?status=${backendStatus}&page=${page}`;
//   //         } else {
//   //           url += `?page=${page}`;
//   //         }

//   //         const res = await fetchWithAuth(url);

//   //         if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//   //           rawBookings = [...rawBookings, ...res.data];
//   //           hasMore = res.data.length === 10;
//   //           page++;

//   //           if (page > 50) hasMore = false;
//   //         } else {
//   //           hasMore = false;
//   //         }
//   //       }
//   //     } else {
//   //       let url = `${API_BASE}/api/tutor/bookings`;

//   //       if (filter !== "all") {
//   //         const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//   //         url += `?status=${backendStatus}`;
//   //       }

//   //       url += `${url.includes("?") ? "&" : "?"}limit=100`;

//   //       const res = await fetchWithAuth(url);

//   //       if (res.success && Array.isArray(res.data)) {
//   //         rawBookings = res.data;
//   //       }
//   //     }

//       // Same sorting logic as silent refresh
//       rawBookings.sort((a, b) => {
//         const getDate = (booking) => {
//           if (booking.lastMessage?.createdAt) return new Date(booking.lastMessage.createdAt);
//           if (booking.updatedAt) return new Date(booking.updatedAt);
//           if (booking.scheduledAt) return new Date(booking.scheduledAt);
//           if (booking.createdAt) return new Date(booking.createdAt);
//           return new Date(0);
//         };
//         return getDate(b) - getDate(a);
//       });

//       const mapped = rawBookings.map(mapBookingToUI);

//       set((state) => ({
//         bookingsByFilter: {
//           ...state.bookingsByFilter,
//           [filter]: mapped,
//         },
//       }));
//     } catch (err) {
//       console.error("[fetchBookings] FAILED:", err);
//       set((state) => ({
//         bookingsByFilter: {
//           ...state.bookingsByFilter,
//           [filter]: [],
//         },
//       }));
//     } finally {
//       set({ isLoading: false });
//       console.log("[fetchBookings] END");
//     }
//   },

//   // _refreshBookingsSilent: async () => {
//   //   const { activeFilter } = get();
//   //   if (!activeFilter) return;

//   //   try {
//   //     const { fetchWithAuth } = useTutorAuthStore.getState();
      
//   //     const shouldPaginate = activeFilter === "all" || activeFilter === "completed";
      
//   //     if (shouldPaginate) {
//   //       // Fetch all pages
//   //       let allBookings = [];
//   //       let page = 1;
//   //       let hasMore = true;
        
//   //       while (hasMore) {
//   //         let url = `${API_BASE}/api/tutor/bookings`;
          
//   //         if (activeFilter !== "all") {
//   //           const backendStatus = activeFilter === "cancelled" ? "cancelled_by_user" : activeFilter;
//   //           url += `?status=${backendStatus}&page=${page}`;
//   //         } else {
//   //           url += `?page=${page}`;
//   //         }
          
//   //         const res = await fetchWithAuth(url);
          
//   //         if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//   //           allBookings = [...allBookings, ...res.data];
//   //           hasMore = res.data.length === 10;
//   //           page++;
            
//   //           if (page > 50) hasMore = false; // Safety limit
//   //         } else {
//   //           hasMore = false;
//   //         }
//   //       }
        
//   //       // Sort by most recent
//   //       allBookings.sort((a, b) => {
//   //         const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
//   //         const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
//   //         return dateB - dateA;
//   //       });
        
//   //       const mapped = allBookings.map(mapBookingToUI);
        
//   //       set(state => ({
//   //         bookingsByFilter: {
//   //           ...state.bookingsByFilter,
//   //           [activeFilter]: mapped,
//   //         },
//   //       }));
        
//   //       const current = get().selectedBooking;
//   //       if (current) {
//   //         const updated = mapped.find(b => b.id === current.id);
//   //         if (updated) set({ selectedBooking: updated });
//   //       }
        
//   //     } else {
//   //       // Single page fetch
//   //       let url = `${API_BASE}/api/tutor/bookings`;
//   //       if (activeFilter !== "all") {
//   //         const backendStatus = activeFilter === "cancelled" ? "cancelled_by_user" : activeFilter;
//   //         url += `?status=${backendStatus}`;
//   //       }
        
//   //       const separator = url.includes('?') ? '&' : '?';
//   //       url += `${separator}limit=100`;
        
//   //       const res = await fetchWithAuth(url);
        
//   //       if (res.success && Array.isArray(res.data)) {
//   //         const mapped = res.data.map(mapBookingToUI);
//   //         set(state => ({
//   //           bookingsByFilter: {
//   //             ...state.bookingsByFilter,
//   //             [activeFilter]: mapped,
//   //           },
//   //         }));
          
//   //         const current = get().selectedBooking;
//   //         if (current) {
//   //           const updated = mapped.find(b => b.id === current.id);
//   //           if (updated) set({ selectedBooking: updated });
//   //         }
//   //       }
//   //     }
//   //   } catch (err) {
//   //     console.error("[_refreshBookingsSilent] failed:", err);
//   //   }
//   // },

//   // fetchBookings: async (filter = "all") => {
//   //   console.log("[fetchBookings] START", { filter });
//   //   set({ isLoading: true });

//   //   try {
//   //     const { fetchWithAuth } = useTutorAuthStore.getState();
      
//   //     // Fetch all pages for "all" and "completed" filters
//   //     const shouldPaginate = filter === "all" || filter === "completed";
      
//   //     if (shouldPaginate) {
//   //       console.log(`[fetchBookings] 📄 Fetching ALL pages for "${filter}"...`);
        
//   //       let allBookings = [];
//   //       let page = 1;
//   //       let hasMore = true;
        
//   //       while (hasMore) {
//   //         let url = `${API_BASE}/api/tutor/bookings`;
          
//   //         if (filter !== "all") {
//   //           const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//   //           url += `?status=${backendStatus}&page=${page}`;
//   //         } else {
//   //           url += `?page=${page}`;
//   //         }
          
//   //         console.log(`[fetchBookings] 📥 Fetching page ${page}:`, url);
          
//   //         const res = await fetchWithAuth(url);
          
//   //         if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//   //           allBookings = [...allBookings, ...res.data];
//   //           console.log(`[fetchBookings] ✅ Page ${page}: ${res.data.length} items (Total so far: ${allBookings.length})`);
            
//   //           // If we got less than 10, we're on the last page
//   //           hasMore = res.data.length === 10;
//   //           page++;
            
//   //           // Safety limit to prevent infinite loops
//   //           if (page > 50) {
//   //             console.warn("[fetchBookings] ⚠️ Reached page limit (50), stopping");
//   //             hasMore = false;
//   //           }
//   //         } else {
//   //           console.log(`[fetchBookings] 🏁 Last page reached (page ${page})`);
//   //           hasMore = false;
//   //         }
//   //       }
        
//   //       // Sort by most recent first (newest scheduledAt or createdAt)
//   //       allBookings.sort((a, b) => {
//   //         const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
//   //         const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
//   //         return dateB - dateA; // Descending order (newest first)
//   //       });
        
//   //       const mapped = allBookings.map(mapBookingToUI);
//   //       console.log(`[fetchBookings] 🎉 TOTAL for "${filter}": ${mapped.length} items (sorted by most recent)`);
        
//   //       set(state => ({
//   //         bookingsByFilter: {
//   //           ...state.bookingsByFilter,
//   //           [filter]: mapped,
//   //         },
//   //       }));
        
//   //     } else {
//   //       // For other filters, fetch single page with limit
//   //       let url = `${API_BASE}/api/tutor/bookings`;
        
//   //       if (filter !== "all") {
//   //         const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//   //         url += `?status=${backendStatus}`;
//   //       }
        
//   //       // Add pagination parameters to get more results
//   //       const separator = url.includes('?') ? '&' : '?';
//   //       url += `${separator}limit=100`;
        
//   //       console.log("[fetchBookings] Fetching URL:", url);
        
//   //       const res = await fetchWithAuth(url);
        
//   //       console.log("[fetchBookings] Response:", res.success, "data length:", res.data?.length);
        
//   //       if (res.success && Array.isArray(res.data)) {
//   //         const mapped = res.data.map(mapBookingToUI);
//   //         console.log("[fetchBookings] Mapped count:", mapped.length);
          
//   //         set(state => ({
//   //           bookingsByFilter: {
//   //             ...state.bookingsByFilter,
//   //             [filter]: mapped,
//   //           },
//   //         }));
//   //       } else {
//   //         console.warn("[fetchBookings] No valid data for filter:", filter);
//   //         set(state => ({
//   //           bookingsByFilter: {
//   //             ...state.bookingsByFilter,
//   //             [filter]: [],
//   //           },
//   //         }));
//   //       }
//   //     }
//   //   } catch (err) {
//   //     console.error("[fetchBookings] FAILED:", err.message || err);
//   //     set(state => ({
//   //       bookingsByFilter: {
//   //         ...state.bookingsByFilter,
//   //         [filter]: [],
//   //       },
//   //     }));
//   //   } finally {
//   //     set({ isLoading: false });
//   //     console.log("[fetchBookings] END");
//   //   }
//   // },
//   fetchBookings: async (filter = "all") => {
//   console.log("[fetchBookings] START", { filter });
//   set({ isLoading: true });

//   try {
//     const { fetchWithAuth } = useTutorAuthStore.getState();

//     const shouldPaginate = filter === "all" || filter === "completed";
//     let rawBookings = [];

//     if (shouldPaginate) {
//       console.log(`[fetchBookings] 📄 Fetching ALL pages for "${filter}"...`);
//       let page = 1;
//       let hasMore = true;

//       while (hasMore) {
//         let url = `${API_BASE}/api/tutor/bookings`;

//         if (filter !== "all") {
//           const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//           url += `?status=${backendStatus}&page=${page}`;
//         } else {
//           url += `?page=${page}`;
//         }

//         console.log(`[fetchBookings] 📥 Fetching page ${page}:`, url);

//         const res = await fetchWithAuth(url);

//         if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//           rawBookings = [...rawBookings, ...res.data];
//           console.log(`Page ${page}: ${res.data.length} items (total: ${rawBookings.length})`);

//           hasMore = res.data.length === 10; // assuming page size = 10
//           page++;

//           if (page > 50) {
//             console.warn("[fetchBookings] Reached page limit (50), stopping");
//             hasMore = false;
//           }
//         } else {
//           hasMore = false;
//         }
//       }
//     } else {
//       // Non-paginated filters – single call with high limit
//       let url = `${API_BASE}/api/tutor/bookings`;

//       if (filter !== "all") {
//         const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//         url += `?status=${backendStatus}`;
//       }

//       const separator = url.includes('?') ? '&' : '?';
//       url += `${separator}limit=100`;

//       console.log("[fetchBookings] Fetching URL:", url);

//       const res = await fetchWithAuth(url);

//       if (res.success && Array.isArray(res.data)) {
//         rawBookings = res.data;
//       } else {
//         rawBookings = [];
//       }
//     }

//     // ────────────────────────────────────────────────
//     // SORTING – applied to EVERY filter (newest first)
//     // ────────────────────────────────────────────────
//     rawBookings.sort((a, b) => {
//       const getRecencyDate = (booking) => {
//         // 1. Most user-relevant: last message
//         if (booking.lastMessage?.createdAt) {
//           return new Date(booking.lastMessage.createdAt);
//         }
//         // 2. Booking was recently updated (status change, reschedule, etc.)
//         if (booking.updatedAt) {
//           return new Date(booking.updatedAt);
//         }
//         // 3. Future/past relevance: scheduled time
//         if (booking.scheduledAt) {
//           return new Date(booking.scheduledAt);
//         }
//         // 4. Creation time as last resort
//         if (booking.createdAt) {
//           return new Date(booking.createdAt);
//         }
//         return new Date(0); // very old fallback
//       };

//       const dateA = getRecencyDate(a);
//       const dateB = getRecencyDate(b);

//       return dateB - dateA; // newest → oldest
//     });

//     // Optional: special override only if you really want different behavior for completed
//     // (most people prefer the same recency logic everywhere — comment out if not needed)
//     /*
//     if (filter === "completed") {
//       rawBookings.sort((a, b) => {
//         const dateA = new Date(a.scheduledAt || a.createdAt || 0);
//         const dateB = new Date(b.scheduledAt || b.createdAt || 0);
//         return dateB - dateA; // newest scheduled first
//       });
//     }
//     */

//     const mapped = rawBookings.map(mapBookingToUI);

//     console.log(`[fetchBookings] 🎉 TOTAL for "${filter}": ${mapped.length} items (sorted newest first)`);

//     set(state => ({
//       bookingsByFilter: {
//         ...state.bookingsByFilter,
//         [filter]: mapped,
//       },
//     }));
//   } catch (err) {
//     console.error("[fetchBookings] FAILED:", err);
//     set(state => ({
//       bookingsByFilter: {
//         ...state.bookingsByFilter,
//         [filter]: [],
//       },
//     }));
//   } finally {
//     set({ isLoading: false });
//     console.log("[fetchBookings] END");
//   }
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

//         set(state => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach(key => {
//             updatedFilters[key] = updatedFilters[key].map(b =>
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

//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     set({ isSending: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const { tutor } = useTutorAuthStore.getState();

//       const optimisticMessage = {
//         id: `temp-${Date.now()}`,
//         content,
//         messageType,
//         senderId: tutor?.id,
//         senderRole: "tutor",
//         bookingId,
//         createdAt: new Date().toISOString(),
//         isOptimistic: true,
//       };

//       set(state => ({
//         messages: [...state.messages, optimisticMessage]
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
//         {
//           method: "POST",
//           body: JSON.stringify({ content, messageType }),
//         }
//       );

//       if (res.success && res.data) {
//         set(state => ({
//           messages: state.messages.map(m =>
//             m.id === optimisticMessage.id ? res.data : m
//           )
//         }));

//         get()._refreshBookingsSilent();
//         return res.data;
//       }
//       throw new Error("Send failed");
//     } catch (err) {
//       console.error("sendMessage failed:", err);
//       set(state => ({
//         messages: state.messages.filter(m => !m.isOptimistic)
//       }));
//       throw err;
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   confirmMessage: async (messageId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       set(state => ({
//         messages: state.messages.map(m =>
//           m.id === messageId ? { ...m, status: "confirmed" } : m
//         )
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/messages/${messageId}/confirm`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         set(state => ({
//           messages: state.messages.map(m =>
//             m.id === messageId ? res.data : m
//           )
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

//       set(state => ({
//         messages: state.messages.map(m =>
//           m.id === messageId ? { ...m, status: "rejected" } : m
//         )
//       }));

//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/messages/${messageId}/reject`,
//         { method: "PATCH" }
//       );

//       if (res.success && res.data) {
//         set(state => ({
//           messages: state.messages.map(m =>
//             m.id === messageId ? res.data : m
//           )
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

//       // Ensure proposedAt is in ISO format
//       const proposedDateTime = new Date(proposedAt).toISOString();

//       // Optimistic update across all filters
//       set(state => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach(key => {
//           updatedFilters[key] = updatedFilters[key].map(b =>
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
//         set(state => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach(key => {
//             updatedFilters[key] = updatedFilters[key].map(b =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId
//                 ? updatedBooking
//                 : state.selectedBooking,
//           };
//         });
//         await get()._refreshBookingsSilent();
//         return res.data;
//       }

//       throw new Error(res.message || "Reschedule failed");
//     } catch (err) {
//       console.error("proposeReschedule failed:", err);
//       await get()._refreshBookingsSilent();
//       throw err;
//     }
//   },

//   acceptReschedule: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       // Optimistic update - move to confirmed
//       set(state => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach(key => {
//           updatedFilters[key] = updatedFilters[key].map(b =>
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
//         set(state => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach(key => {
//             updatedFilters[key] = updatedFilters[key].map(b =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId
//                 ? updatedBooking
//                 : state.selectedBooking,
//           };
//         });
//         await get()._refreshBookingsSilent();
//         return res.data;
//       }

//       throw new Error("Accept reschedule failed");
//     } catch (err) {
//       console.error("acceptReschedule failed:", err);
//       await get()._refreshBookingsSilent();
//       throw err;
//     }
//   },

//   rejectReschedule: async (bookingId, reason) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       // Optimistic update - revert to pending
//       set(state => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach(key => {
//           updatedFilters[key] = updatedFilters[key].map(b =>
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
//         set(state => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach(key => {
//             updatedFilters[key] = updatedFilters[key].map(b =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId
//                 ? updatedBooking
//                 : state.selectedBooking,
//           };
//         });
//         await get()._refreshBookingsSilent();
//         return res.data;
//       }

//       throw new Error("Reject reschedule failed");
//     } catch (err) {
//       console.error("rejectReschedule failed:", err);
//       await get()._refreshBookingsSilent();
//       throw err;
//     }
//   },

//   confirmBooking: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       // Optimistic update across all filters
//       set(state => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach(key => {
//           updatedFilters[key] = updatedFilters[key].map(b =>
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
//         set(state => {
//           const updatedFilters = { ...state.bookingsByFilter };
//           Object.keys(updatedFilters).forEach(key => {
//             updatedFilters[key] = updatedFilters[key].map(b =>
//               b.id === bookingId ? updatedBooking : b
//             );
//           });
//           return {
//             bookingsByFilter: updatedFilters,
//             selectedBooking:
//               state.selectedBooking?.id === bookingId
//                 ? updatedBooking
//                 : state.selectedBooking,
//           };
//         });
//         await get()._refreshBookingsSilent();
//         return res.data;
//       }

//       throw new Error("Confirm failed");
//     } catch (err) {
//       console.error("confirmBooking failed:", err);
//       await get()._refreshBookingsSilent();
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

//       // Optimistic update across all filters
//       set(state => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach(key => {
//           updatedFilters[key] = updatedFilters[key].map(b =>
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

//       console.log("[cancelBooking] Response:", res);

//       if (res.success) {
//         await get()._refreshBookingsSilent();
//         return true;
//       }

//       throw new Error(res.message || "Cancel failed");
//     } catch (err) {
//       console.error("cancelBooking failed:", err);
//       await get()._refreshBookingsSilent();
//       throw err;
//     }
//   },

//   endSession: async (bookingId, notes = "") => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();

//       // Optimistic update across all filters
//       set(state => {
//         const updatedFilters = { ...state.bookingsByFilter };
//         Object.keys(updatedFilters).forEach(key => {
//           updatedFilters[key] = updatedFilters[key].map(b =>
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
//         await get()._refreshBookingsSilent();
//         return true;
//       }

//       throw new Error("End session failed");
//     } catch (err) {
//       console.error("endSession failed:", err);
//       await get()._refreshBookingsSilent();
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
  proposedAt: booking.proposedAt || null, // NEW: for reschedule proposals
  duration: booking.duration || null,
  unread_count: booking.unreadCount || 0,
  purpose: booking.purpose || "",
  avatar: booking.user?.avatar || null,
  isBooking: true,
});

export const useTutorChatStore = create((set, get) => ({
  bookingsByFilter: {},
  filterTimestamps: {}, // NEW: Track when each filter was last fetched
  activeFilter: "all",
  selectedBooking: null,
  messages: [],
  isLoading: false,
  isSending: false,

  // Cache duration in milliseconds (30 seconds default)
  CACHE_DURATIONS: {
    all: 30 * 1000,        // 30s - changes often
    active: 10 * 1000,     // 10s - real-time sessions
    pending: 20 * 1000,    // 20s - new requests come in
    confirmed: 60 * 1000,  // 1min - more stable
    completed: 300 * 1000, // 5min - historical data
    cancelled: 300 * 1000, // 5min - historical data
    rescheduled: 30 * 1000, // 30s - active reschedules
  },

  // Check if filter data is fresh
  isFilterFresh: (filter) => {
    const { filterTimestamps, CACHE_DURATIONS } = get();
    const lastFetch = filterTimestamps[filter];
    
    if (!lastFetch) return false;
    
    const cacheDuration = CACHE_DURATIONS[filter] || 30000;
    const age = Date.now() - lastFetch;
    
    return age < cacheDuration;
  },

  // Get cache status for debugging
  getCacheStatus: () => {
    const { filterTimestamps, CACHE_DURATIONS } = get();
    const now = Date.now();
    
    return Object.entries(filterTimestamps).map(([filter, timestamp]) => {
      const cacheDuration = CACHE_DURATIONS[filter] || 30000;
      const age = now - timestamp;
      return {
        filter,
        ageSeconds: Math.round(age / 1000),
        fresh: age < cacheDuration,
        expiresIn: Math.round((cacheDuration - age) / 1000) + 's',
      };
    });
  },

  // Refresh only stale filters (for background updates)
  refreshStaleFilters: async () => {
    const { filterTimestamps, CACHE_DURATIONS, fetchBookings } = get();
    const now = Date.now();
    
    const staleFilters = Object.keys(filterTimestamps).filter(filter => {
      const cacheDuration = CACHE_DURATIONS[filter] || 30000;
      const age = now - filterTimestamps[filter];
      return age >= cacheDuration;
    });
    
    if (staleFilters.length === 0) {
      console.log("✅ All filters are fresh, skipping refresh");
      return;
    }
    
    console.log(`🔄 Refreshing ${staleFilters.length} stale filters:`, staleFilters);
    
    // Refresh stale filters in parallel
    await Promise.all(
      staleFilters.map(filter => fetchBookings(filter, true))
    );
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  getCurrentBookings: () => {
    const { bookingsByFilter, activeFilter } = get();
    return bookingsByFilter[activeFilter] || [];
  },

  _refreshBookingsSilent: async () => {
    const { activeFilter } = get();
    if (!activeFilter) return;

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      
      const shouldPaginate = activeFilter === "all" || activeFilter === "completed";
      
      if (shouldPaginate) {
        // Fetch all pages
        let allBookings = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
          let url = `${API_BASE}/api/tutor/bookings`;
          
          if (activeFilter !== "all") {
            const backendStatus = activeFilter === "cancelled" ? "cancelled_by_user" : activeFilter;
            url += `?status=${backendStatus}&page=${page}`;
          } else {
            url += `?page=${page}`;
          }
          
          const res = await fetchWithAuth(url);
          
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            allBookings = [...allBookings, ...res.data];
            hasMore = res.data.length === 10;
            page++;
            
            if (page > 50) hasMore = false; // Safety limit
          } else {
            hasMore = false;
          }
        }
        
        // Sort by most recent
        allBookings.sort((a, b) => {
          const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
          const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
          return dateB - dateA;
        });
        
        const mapped = allBookings.map(mapBookingToUI);
        
        set(state => ({
          bookingsByFilter: {
            ...state.bookingsByFilter,
            [activeFilter]: mapped,
          },
        }));
        
        const current = get().selectedBooking;
        if (current) {
          const updated = mapped.find(b => b.id === current.id);
          if (updated) set({ selectedBooking: updated });
        }
        
      } else {
        // Single page fetch
        let url = `${API_BASE}/api/tutor/bookings`;
        if (activeFilter !== "all") {
          const backendStatus = activeFilter === "cancelled" ? "cancelled_by_user" : activeFilter;
          url += `?status=${backendStatus}`;
        }
        
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}limit=100`;
        
        const res = await fetchWithAuth(url);
        
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(mapBookingToUI);
          set(state => ({
            bookingsByFilter: {
              ...state.bookingsByFilter,
              [activeFilter]: mapped,
            },
          }));
          
          const current = get().selectedBooking;
          if (current) {
            const updated = mapped.find(b => b.id === current.id);
            if (updated) set({ selectedBooking: updated });
          }
        }
      }
    } catch (err) {
      console.error("[_refreshBookingsSilent] failed:", err);
    }
  },

  fetchBookings: async (filter = "all", force = false) => {
    // ✅ CHECK CACHE FIRST - skip if data is fresh and not forced
    if (!force && get().isFilterFresh(filter)) {
      const { filterTimestamps } = get();
      const age = Math.round((Date.now() - filterTimestamps[filter]) / 1000);
      console.log(`⚡ Using cached data for "${filter}" (${age}s old, still fresh)`);
      return;
    }

    console.log("[fetchBookings] START", { filter, forced: force });
    set({ isLoading: true });

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      
      // Fetch all pages for "all" and "completed" filters
      const shouldPaginate = filter === "all" || filter === "completed";
      
      if (shouldPaginate) {
        console.log(`[fetchBookings] 📄 Fetching ALL pages for "${filter}"...`);
        
        let allBookings = [];
        let page = 1;
        let hasMore = true;
        
        while (hasMore) {
          let url = `${API_BASE}/api/tutor/bookings`;
          
          if (filter !== "all") {
            const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
            url += `?status=${backendStatus}&page=${page}`;
          } else {
            url += `?page=${page}`;
          }
          
          console.log(`[fetchBookings] 📥 Fetching page ${page}:`, url);
          
          const res = await fetchWithAuth(url);
          
          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            allBookings = [...allBookings, ...res.data];
            console.log(`[fetchBookings] ✅ Page ${page}: ${res.data.length} items (Total so far: ${allBookings.length})`);
            
            // If we got less than 10, we're on the last page
            hasMore = res.data.length === 10;
            page++;
            
            // Safety limit to prevent infinite loops
            if (page > 50) {
              console.warn("[fetchBookings] ⚠️ Reached page limit (50), stopping");
              hasMore = false;
            }
          } else {
            console.log(`[fetchBookings] 🏁 Last page reached (page ${page})`);
            hasMore = false;
          }
        }
        
        // Sort by most recent first (newest scheduledAt or createdAt)
        allBookings.sort((a, b) => {
          const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
          const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
          return dateB - dateA; // Descending order (newest first)
        });
        
        const mapped = allBookings.map(mapBookingToUI);
        console.log(`[fetchBookings] 🎉 TOTAL for "${filter}": ${mapped.length} items (sorted by most recent)`);
        
        // ✅ UPDATE CACHE TIMESTAMP
        set(state => ({
          bookingsByFilter: {
            ...state.bookingsByFilter,
            [filter]: mapped,
          },
          filterTimestamps: {
            ...state.filterTimestamps,
            [filter]: Date.now(), // Record when fetched
          },
        }));
        
      } else {
        // For other filters, fetch single page with limit
        let url = `${API_BASE}/api/tutor/bookings`;
        
        if (filter !== "all") {
          const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
          url += `?status=${backendStatus}`;
        }
        
        // Add pagination parameters to get more results
        const separator = url.includes('?') ? '&' : '?';
        url += `${separator}limit=100`;
        
        console.log("[fetchBookings] Fetching URL:", url);
        
        const res = await fetchWithAuth(url);
        
        console.log("[fetchBookings] Response:", res.success, "data length:", res.data?.length);
        
        if (res.success && Array.isArray(res.data)) {
          const mapped = res.data.map(mapBookingToUI);
          console.log("[fetchBookings] Mapped count:", mapped.length);
          
          // ✅ UPDATE CACHE TIMESTAMP
          set(state => ({
            bookingsByFilter: {
              ...state.bookingsByFilter,
              [filter]: mapped,
            },
            filterTimestamps: {
              ...state.filterTimestamps,
              [filter]: Date.now(), // Record when fetched
            },
          }));
        } else {
          console.warn("[fetchBookings] No valid data for filter:", filter);
          set(state => ({
            bookingsByFilter: {
              ...state.bookingsByFilter,
              [filter]: [],
            },
          }));
        }
      }
    } catch (err) {
      console.error("[fetchBookings] FAILED:", err.message || err);
      set(state => ({
        bookingsByFilter: {
          ...state.bookingsByFilter,
          [filter]: [],
        },
      }));
    } finally {
      set({ isLoading: false });
      console.log("[fetchBookings] END");
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
        console.log("[fetchBooking] Success - setting selectedBooking:", booking.id);

        set({ selectedBooking: booking });

        set(state => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach(key => {
            updatedFilters[key] = updatedFilters[key].map(b =>
              b.id === bookingId ? booking : b
            );
          });
          return { bookingsByFilter: updatedFilters };
        });

        return booking;
      } else {
        console.warn("[fetchBooking] No data or failed for ID:", bookingId);
        return null;
      }
    } catch (err) {
      console.error("[fetchBooking] FAILED:", err.message || err);
      return null;
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

  sendMessage: async (bookingId, content, messageType = "TEXT") => {
    set({ isSending: true });
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const { tutor } = useTutorAuthStore.getState();

      const optimisticMessage = {
        id: `temp-${Date.now()}`,
        content,
        messageType,
        senderId: tutor?.id,
        senderRole: "tutor",
        bookingId,
        createdAt: new Date().toISOString(),
        isOptimistic: true,
      };

      set(state => ({
        messages: [...state.messages, optimisticMessage]
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({ content, messageType }),
        }
      );

      if (res.success && res.data) {
        set(state => ({
          messages: state.messages.map(m =>
            m.id === optimisticMessage.id ? res.data : m
          )
        }));

        get()._refreshBookingsSilent();
        return res.data;
      }
      throw new Error("Send failed");
    } catch (err) {
      console.error("sendMessage failed:", err);
      set(state => ({
        messages: state.messages.filter(m => !m.isOptimistic)
      }));
      throw err;
    } finally {
      set({ isSending: false });
    }
  },

  confirmMessage: async (messageId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      set(state => ({
        messages: state.messages.map(m =>
          m.id === messageId ? { ...m, status: "confirmed" } : m
        )
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/messages/${messageId}/confirm`,
        { method: "PATCH" }
      );

      if (res.success && res.data) {
        set(state => ({
          messages: state.messages.map(m =>
            m.id === messageId ? res.data : m
          )
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

      set(state => ({
        messages: state.messages.map(m =>
          m.id === messageId ? { ...m, status: "rejected" } : m
        )
      }));

      const res = await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/messages/${messageId}/reject`,
        { method: "PATCH" }
      );

      if (res.success && res.data) {
        set(state => ({
          messages: state.messages.map(m =>
            m.id === messageId ? res.data : m
          )
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

      console.log("[proposeReschedule] Proposing:", { bookingId, proposedAt });

      // Ensure proposedAt is in ISO format
      const proposedDateTime = new Date(proposedAt).toISOString();

      // Optimistic update across all filters
      set(state => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach(key => {
          updatedFilters[key] = updatedFilters[key].map(b =>
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

      console.log("[proposeReschedule] Response:", res);

      if (res.success && res.data) {
        const updatedBooking = mapBookingToUI(res.data);
        set(state => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach(key => {
            updatedFilters[key] = updatedFilters[key].map(b =>
              b.id === bookingId ? updatedBooking : b
            );
          });
          return {
            bookingsByFilter: updatedFilters,
            selectedBooking:
              state.selectedBooking?.id === bookingId
                ? updatedBooking
                : state.selectedBooking,
          };
        });
        await get()._refreshBookingsSilent();
        return res.data;
      }

      throw new Error(res.message || "Reschedule failed");
    } catch (err) {
      console.error("proposeReschedule failed:", err);
      await get()._refreshBookingsSilent();
      throw err;
    }
  },

  acceptReschedule: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      // Optimistic update - move to confirmed
      set(state => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach(key => {
          updatedFilters[key] = updatedFilters[key].map(b =>
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
        set(state => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach(key => {
            updatedFilters[key] = updatedFilters[key].map(b =>
              b.id === bookingId ? updatedBooking : b
            );
          });
          return {
            bookingsByFilter: updatedFilters,
            selectedBooking:
              state.selectedBooking?.id === bookingId
                ? updatedBooking
                : state.selectedBooking,
          };
        });
        await get()._refreshBookingsSilent();
        return res.data;
      }

      throw new Error("Accept reschedule failed");
    } catch (err) {
      console.error("acceptReschedule failed:", err);
      await get()._refreshBookingsSilent();
      throw err;
    }
  },

  rejectReschedule: async (bookingId, reason) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      // Optimistic update - revert to pending
      set(state => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach(key => {
          updatedFilters[key] = updatedFilters[key].map(b =>
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
        set(state => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach(key => {
            updatedFilters[key] = updatedFilters[key].map(b =>
              b.id === bookingId ? updatedBooking : b
            );
          });
          return {
            bookingsByFilter: updatedFilters,
            selectedBooking:
              state.selectedBooking?.id === bookingId
                ? updatedBooking
                : state.selectedBooking,
          };
        });
        await get()._refreshBookingsSilent();
        return res.data;
      }

      throw new Error("Reject reschedule failed");
    } catch (err) {
      console.error("rejectReschedule failed:", err);
      await get()._refreshBookingsSilent();
      throw err;
    }
  },

  confirmBooking: async (bookingId) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      // Optimistic update across all filters
      set(state => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach(key => {
          updatedFilters[key] = updatedFilters[key].map(b =>
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
        set(state => {
          const updatedFilters = { ...state.bookingsByFilter };
          Object.keys(updatedFilters).forEach(key => {
            updatedFilters[key] = updatedFilters[key].map(b =>
              b.id === bookingId ? updatedBooking : b
            );
          });
          return {
            bookingsByFilter: updatedFilters,
            selectedBooking:
              state.selectedBooking?.id === bookingId
                ? updatedBooking
                : state.selectedBooking,
          };
        });
        await get()._refreshBookingsSilent();
        return res.data;
      }

      throw new Error("Confirm failed");
    } catch (err) {
      console.error("confirmBooking failed:", err);
      await get()._refreshBookingsSilent();
      throw err;
    }
  },

  cancelBooking: async (bookingId, reason) => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      console.log("[cancelBooking] Cancelling:", { bookingId, reason });

      if (!reason || !reason.trim()) {
        throw new Error("Cancellation reason is required");
      }

      // Optimistic update across all filters
      set(state => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach(key => {
          updatedFilters[key] = updatedFilters[key].map(b =>
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
          method: "PATCH",
          body: JSON.stringify({ reason: reason.trim() }),
        }
      );

      console.log("[cancelBooking] Response:", res);

      if (res.success) {
        await get()._refreshBookingsSilent();
        return true;
      }

      throw new Error(res.message || "Cancel failed");
    } catch (err) {
      console.error("cancelBooking failed:", err);
      await get()._refreshBookingsSilent();
      throw err;
    }
  },

  endSession: async (bookingId, notes = "") => {
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();

      // Optimistic update across all filters
      set(state => {
        const updatedFilters = { ...state.bookingsByFilter };
        Object.keys(updatedFilters).forEach(key => {
          updatedFilters[key] = updatedFilters[key].map(b =>
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
        await get()._refreshBookingsSilent();
        return true;
      }

      throw new Error("End session failed");
    } catch (err) {
      console.error("endSession failed:", err);
      await get()._refreshBookingsSilent();
      throw err;
    }
  },
}));