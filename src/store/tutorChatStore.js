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
//   filterTimestamps: {}, // NEW: Track when each filter was last fetched
//   activeFilter: "all",
//   selectedBooking: null,
//   messages: [],
//   isLoading: false,
//   isSending: false,

//   // Cache duration in milliseconds (30 seconds default)
//   CACHE_DURATIONS: {
//     all: 30 * 1000,        // 30s - changes often
//     active: 10 * 1000,     // 10s - real-time sessions
//     pending: 20 * 1000,    // 20s - new requests come in
//     confirmed: 60 * 1000,  // 1min - more stable
//     completed: 300 * 1000, // 5min - historical data
//     cancelled: 300 * 1000, // 5min - historical data
//     rescheduled: 30 * 1000, // 30s - active reschedules
//   },

//   // Check if filter data is fresh
//   isFilterFresh: (filter) => {
//     const { filterTimestamps, CACHE_DURATIONS } = get();
//     const lastFetch = filterTimestamps[filter];
    
//     if (!lastFetch) return false;
    
//     const cacheDuration = CACHE_DURATIONS[filter] || 30000;
//     const age = Date.now() - lastFetch;
    
//     return age < cacheDuration;
//   },

//   // Get cache status for debugging
//   getCacheStatus: () => {
//     const { filterTimestamps, CACHE_DURATIONS } = get();
//     const now = Date.now();
    
//     return Object.entries(filterTimestamps).map(([filter, timestamp]) => {
//       const cacheDuration = CACHE_DURATIONS[filter] || 30000;
//       const age = now - timestamp;
//       return {
//         filter,
//         ageSeconds: Math.round(age / 1000),
//         fresh: age < cacheDuration,
//         expiresIn: Math.round((cacheDuration - age) / 1000) + 's',
//       };
//     });
//   },

//   // Refresh only stale filters (for background updates)
//   refreshStaleFilters: async () => {
//     const { filterTimestamps, CACHE_DURATIONS, fetchBookings } = get();
//     const now = Date.now();
    
//     const staleFilters = Object.keys(filterTimestamps).filter(filter => {
//       const cacheDuration = CACHE_DURATIONS[filter] || 30000;
//       const age = now - filterTimestamps[filter];
//       return age >= cacheDuration;
//     });
    
//     if (staleFilters.length === 0) {
//       console.log("✅ All filters are fresh, skipping refresh");
//       return;
//     }
    
//     console.log(`🔄 Refreshing ${staleFilters.length} stale filters:`, staleFilters);
    
//     // Refresh stale filters in parallel
//     await Promise.all(
//       staleFilters.map(filter => fetchBookings(filter, true))
//     );
//   },

//   setActiveFilter: (filter) => set({ activeFilter: filter }),

//   getCurrentBookings: () => {
//     const { bookingsByFilter, activeFilter } = get();
//     return bookingsByFilter[activeFilter] || [];
//   },

//   _refreshBookingsSilent: async () => {
//     const { activeFilter } = get();
//     if (!activeFilter) return;

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
      
//       const shouldPaginate = activeFilter === "all" || activeFilter === "completed";
      
//       if (shouldPaginate) {
//         // Fetch all pages
//         let allBookings = [];
//         let page = 1;
//         let hasMore = true;
        
//         while (hasMore) {
//           let url = `${API_BASE}/api/tutor/bookings`;
          
//           if (activeFilter !== "all") {
//             const backendStatus = activeFilter === "cancelled" ? "cancelled_by_user" : activeFilter;
//             url += `?status=${backendStatus}&page=${page}`;
//           } else {
//             url += `?page=${page}`;
//           }
          
//           const res = await fetchWithAuth(url);
          
//           if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//             allBookings = [...allBookings, ...res.data];
//             hasMore = res.data.length === 10;
//             page++;
            
//             if (page > 50) hasMore = false; // Safety limit
//           } else {
//             hasMore = false;
//           }
//         }
        
//         // Sort by most recent
//         allBookings.sort((a, b) => {
//           const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
//           const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
//           return dateB - dateA;
//         });
        
//         const mapped = allBookings.map(mapBookingToUI);
        
//         set(state => ({
//           bookingsByFilter: {
//             ...state.bookingsByFilter,
//             [activeFilter]: mapped,
//           },
//         }));
        
//         const current = get().selectedBooking;
//         if (current) {
//           const updated = mapped.find(b => b.id === current.id);
//           if (updated) set({ selectedBooking: updated });
//         }
        
//       } else {
//         // Single page fetch
//         let url = `${API_BASE}/api/tutor/bookings`;
//         if (activeFilter !== "all") {
//           const backendStatus = activeFilter === "cancelled" ? "cancelled_by_user" : activeFilter;
//           url += `?status=${backendStatus}`;
//         }
        
//         const separator = url.includes('?') ? '&' : '?';
//         url += `${separator}limit=100`;
        
//         const res = await fetchWithAuth(url);
        
//         if (res.success && Array.isArray(res.data)) {
//           const mapped = res.data.map(mapBookingToUI);
//           set(state => ({
//             bookingsByFilter: {
//               ...state.bookingsByFilter,
//               [activeFilter]: mapped,
//             },
//           }));
          
//           const current = get().selectedBooking;
//           if (current) {
//             const updated = mapped.find(b => b.id === current.id);
//             if (updated) set({ selectedBooking: updated });
//           }
//         }
//       }
//     } catch (err) {
//       console.error("[_refreshBookingsSilent] failed:", err);
//     }
//   },

//   fetchBookings: async (filter = "all", force = false) => {
//     // ✅ CHECK CACHE FIRST - skip if data is fresh and not forced
//     if (!force && get().isFilterFresh(filter)) {
//       const { filterTimestamps } = get();
//       const age = Math.round((Date.now() - filterTimestamps[filter]) / 1000);
//       console.log(`⚡ Using cached data for "${filter}" (${age}s old, still fresh)`);
//       return;
//     }

//     console.log("[fetchBookings] START", { filter, forced: force });
//     set({ isLoading: true });

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
      
//       // Fetch all pages for "all" and "completed" filters
//       const shouldPaginate = filter === "all" || filter === "completed";
      
//       if (shouldPaginate) {
//         console.log(`[fetchBookings] 📄 Fetching ALL pages for "${filter}"...`);
        
//         let allBookings = [];
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
          
//           console.log(`[fetchBookings] 📥 Fetching page ${page}:`, url);
          
//           const res = await fetchWithAuth(url);
          
//           if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//             allBookings = [...allBookings, ...res.data];
//             console.log(`[fetchBookings] ✅ Page ${page}: ${res.data.length} items (Total so far: ${allBookings.length})`);
            
//             // If we got less than 10, we're on the last page
//             hasMore = res.data.length === 10;
//             page++;
            
//             // Safety limit to prevent infinite loops
//             if (page > 50) {
//               console.warn("[fetchBookings] ⚠️ Reached page limit (50), stopping");
//               hasMore = false;
//             }
//           } else {
//             console.log(`[fetchBookings] 🏁 Last page reached (page ${page})`);
//             hasMore = false;
//           }
//         }
        
//         // Sort by most recent first (newest scheduledAt or createdAt)
//         allBookings.sort((a, b) => {
//           const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
//           const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
//           return dateB - dateA; // Descending order (newest first)
//         });
        
//         const mapped = allBookings.map(mapBookingToUI);
//         console.log(`[fetchBookings] 🎉 TOTAL for "${filter}": ${mapped.length} items (sorted by most recent)`);
        
//         // ✅ UPDATE CACHE TIMESTAMP
//         set(state => ({
//           bookingsByFilter: {
//             ...state.bookingsByFilter,
//             [filter]: mapped,
//           },
//           filterTimestamps: {
//             ...state.filterTimestamps,
//             [filter]: Date.now(), // Record when fetched
//           },
//         }));
        
//       } else {
//         // For other filters, fetch single page with limit
//         let url = `${API_BASE}/api/tutor/bookings`;
        
//         if (filter !== "all") {
//           const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//           url += `?status=${backendStatus}`;
//         }
        
//         // Add pagination parameters to get more results
//         const separator = url.includes('?') ? '&' : '?';
//         url += `${separator}limit=100`;
        
//         console.log("[fetchBookings] Fetching URL:", url);
        
//         const res = await fetchWithAuth(url);
        
//         console.log("[fetchBookings] Response:", res.success, "data length:", res.data?.length);
        
//         if (res.success && Array.isArray(res.data)) {
//           const mapped = res.data.map(mapBookingToUI);
//           console.log("[fetchBookings] Mapped count:", mapped.length);
          
//           // ✅ UPDATE CACHE TIMESTAMP
//           set(state => ({
//             bookingsByFilter: {
//               ...state.bookingsByFilter,
//               [filter]: mapped,
//             },
//             filterTimestamps: {
//               ...state.filterTimestamps,
//               [filter]: Date.now(), // Record when fetched
//             },
//           }));
//         } else {
//           console.warn("[fetchBookings] No valid data for filter:", filter);
//           set(state => ({
//             bookingsByFilter: {
//               ...state.bookingsByFilter,
//               [filter]: [],
//             },
//           }));
//         }
//       }
//     } catch (err) {
//       console.error("[fetchBookings] FAILED:", err.message || err);
//       set(state => ({
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
//           method: "PATCH",
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










// // src/store/tutorChatStore.js
// import { create } from "zustand";
// import useTutorAuthStore from "./tutorAuthStore";
// import { io } from "socket.io-client";

// const API_BASE = "https://fillops-server-5fuf.onrender.com";
// const SOCKET_URL = API_BASE; 

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

// let socket = null;

// export const useTutorChatStore = create((set, get) => ({
//   // ─── Core States ────────────────────────────────────────────
//   bookingsByFilter: {},
//   filterTimestamps: {},
//   activeFilter: "all",
//   selectedBooking: null,
//   messages: [],
//   isLoading: false,
//   isSending: false,
//   socketConnected: false,
//   isSomeoneTyping: false,

//   // ─── Cache Settings ─────────────────────────────────────────
//   CACHE_DURATIONS: {
//     all: 30 * 1000,
//     active: 10 * 1000,
//     pending: 20 * 1000,
//     confirmed: 60 * 1000,
//     completed: 300 * 1000,
//     cancelled: 300 * 1000,
//     rescheduled: 30 * 1000,
//   },

//   isFilterFresh: (filter) => {
//     const { filterTimestamps, CACHE_DURATIONS } = get();
//     const lastFetch = filterTimestamps[filter];
//     if (!lastFetch) return false;
//     const age = Date.now() - lastFetch;
//     return age < (CACHE_DURATIONS[filter] || 30000);
//   },

//   // ─── Socket Connection ──────────────────────────────────────
//   initializeSocket: () => {
//     const { tutor } = useTutorAuthStore.getState();
//     if (!tutor?.id || socket) return;

//     socket = io(SOCKET_URL, {
//       auth: { tutorId: tutor.id },
//       reconnection: true,
//       reconnectionAttempts: 5,
//       reconnectionDelay: 1000,
//       autoConnect: false,
//     });

//     socket.connect();

//     socket.on("connect", () => {
//       console.log("[TutorSocket] Connected:", socket.id);
//       set({ socketConnected: true });
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("[TutorSocket] Disconnected:", reason);
//       set({ socketConnected: false });
//     });

//     // ─── Real-time message listener ────────────────────────────
//     socket.on("newMessage", (message) => {
//       console.log("[TutorSocket] New message:", message);

//       const currentBookingId = get().selectedBooking?.id;

//       set((state) => {
//         // If message belongs to current open chat → add immediately
//         if (message.bookingId === currentBookingId) {
//           return {
//             messages: [...state.messages, message],
//           };
//         }

//         // Otherwise update preview & unread count
//         return {
//           bookingsByFilter: Object.fromEntries(
//             Object.entries(state.bookingsByFilter).map(([filter, bookings]) => [
//               filter,
//               bookings.map((b) =>
//                 b.id === message.bookingId
//                   ? {
//                       ...b,
//                       last_message: message.content,
//                       last_message_time: message.createdAt,
//                       unread_count: (b.unread_count || 0) + 1,
//                     }
//                   : b
//               ),
//             ])
//           ),
//         };
//       });
//     });

//     // Optional: listen for booking status changes
//     // socket.on("bookingUpdated", (updatedBooking) => {
//     //   console.log("[TutorSocket] Booking updated:", updatedBooking);
//     //   const uiBooking = mapBookingToUI(updatedBooking);

//     //   set((state) => {
//     //     const updatedFilters = { ...state.bookingsByFilter };
//     //     Object.keys(updatedFilters).forEach((key) => {
//     //       updatedFilters[key] = updatedFilters[key].map((b) =>
//     //         b.id === uiBooking.id ? uiBooking : b
//     //       );
//     //     });

//     //     return {
//     //       bookingsByFilter: updatedFilters,
//     //       selectedBooking:
//     //         state.selectedBooking?.id === uiBooking.id ? uiBooking : state.selectedBooking,
//     //     };
//     //   });
//     // });
//     socket.on("newMessage", (message) => {
//   console.log("[TutorSocket] New message:", message);

//   set(state => {
//     const currentBookingId = state.selectedBooking?.id;

//     // Case 1: message belongs to currently open chat
//     if (message.bookingId === currentBookingId) {
//       // prevent duplicates
//       if (state.messages.some(m => m.id === message.id)) {
//         return state;
//       }
//       return {
//         messages: [...state.messages, message],
//       };
//     }

//     // Case 2: message for another booking → only update preview & unread count
//     const updatedFilters = Object.fromEntries(
//       Object.entries(state.bookingsByFilter).map(([filter, bookings]) => [
//         filter,
//         bookings.map(b =>
//           b.id === message.bookingId
//             ? {
//                 ...b,
//                 last_message: message.content,
//                 last_message_time: message.createdAt,
//                 unread_count: (b.unread_count || 0) + 1,
//               }
//             : b
//         ),
//       ])
//     );

//     return { bookingsByFilter: updatedFilters };
//   });
//     });

// // ─── Typing indicator ────────────────────────────────
//     socket.on("typing", ({ bookingId }) => {
//       const currentBookingId = get().selectedBooking?.id;

//       if (bookingId === currentBookingId) {
//         set({ isSomeoneTyping: true });

//         // Auto-hide after ~3 seconds if no more typing events
//         clearTimeout(window.typingTimer);
//         window.typingTimer = setTimeout(() => {
//           set({ isSomeoneTyping: false });
//         }, 2800);
//       }
//     });
//   },

//   disconnectSocket: () => {
//     if (socket) {
//       socket.disconnect();
//       socket = null;
//       set({ socketConnected: false });
//       console.log("[TutorSocket] Disconnected");
//     }
//   },

//   // ─── Send message (Socket.IO preferred + HTTP fallback) ─────
//   // sendMessage: async (bookingId, content, messageType = "TEXT") => {
//   //   if (!bookingId || !content.trim()) return;

//   //   set({ isSending: true });

//   //   const tempMessage = {
//   //     id: `temp-${Date.now()}`,
//   //     content,
//   //     messageType,
//   //     sender: { id: useTutorAuthStore.getState().tutor?.id, type: "TUTOR" },
//   //     bookingId,
//   //     createdAt: new Date().toISOString(),
//   //     status: "sending",
//   //   };

//   //   // Optimistic update
//   //   set((state) => ({
//   //     messages:
//   //       state.selectedBooking?.id === bookingId ? [...state.messages, tempMessage] : state.messages,
//   //   }));

//   //   try {
//   //     const socket = socket || get().initializeSocket();

//   //     if (socket?.connected) {
//   //       // Real-time send
//   //       socket.emit("sendMessage", {
//   //         bookingId,
//   //         content,
//   //         messageType,
//   //       });

//   //       // Server will broadcast back → no need to add again
//   //     } else {
//   //       // Fallback HTTP
//   //       const { fetchWithAuth } = useTutorAuthStore.getState();
//   //       const res = await fetchWithAuth(
//   //         `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
//   //         {
//   //           method: "POST",
//   //           body: JSON.stringify({ content, messageType }),
//   //         }
//   //       );

//   //       if (!res.success) throw new Error(res.message || "Send failed");
//   //     }

//   //     set({ isSending: false });
//   //   } catch (err) {
//   //     console.error("sendMessage failed:", err);
//   //     set((state) => ({
//   //       messages: state.messages.filter((m) => m.id !== tempMessage.id),
//   //       isSending: false,
//   //     }));
//   //     throw err;
//   //   }
//   // },
//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//   const tutor = useTutorAuthStore.getState().tutor;
//   if (!tutor?.id) throw new Error("Not authenticated");

//   set({ isSending: true });

//   const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

//   const optimistic = {
//     id: tempId,
//     content,
//     messageType,
//     sender: { id: tutor.id, name: tutor.name || "You", avatar: tutor.avatar },
//     senderRole: "tutor",
//     bookingId,
//     createdAt: new Date().toISOString(),
//     status: "sending",
//     isOptimistic: true,
//   };

//   // Add optimistic message only if this is the currently open chat
//   set(state => ({
//     messages: state.selectedBooking?.id === bookingId
//       ? [...state.messages, optimistic]
//       : state.messages,
//   }));

//   try {
//     if (socket?.connected) {
//       socket.emit("sendMessage", {
//         bookingId,
//         content,
//         messageType,
//         tempId,
//       });

//       // Wait for server confirmation (recommended)
//       return new Promise((resolve, reject) => {
//         const timeout = setTimeout(() => reject(new Error("No confirmation from server")), 15000);

//         const handler = (confirmedMsg) => {
//           if (confirmedMsg.tempId === tempId) {
//             socket.off("messageConfirmed", handler);
//             clearTimeout(timeout);

//             set(state => ({
//               messages: state.messages.map(m =>
//                 m.id === tempId ? { ...confirmedMsg, isOptimistic: false, status: "sent" } : m
//               )
//             }));
//             resolve(confirmedMsg);
//           }
//         };

//         socket.on("messageConfirmed", handler);
//       });
//     } else {
//       // HTTP fallback
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
//         {
//           method: "POST",
//           body: JSON.stringify({ content, messageType }),
//         }
//       );

//       if (!res.success || !res.data) throw new Error(res.message || "Send failed");

//       const realMsg = res.data;

//       set(state => ({
//         messages: state.messages.map(m =>
//           m.id === tempId ? { ...realMsg, isOptimistic: false } : m
//         ),
//       }));

//       return realMsg;
//     }
//   } catch (err) {
//     console.error("sendMessage failed:", err);
//     set(state => ({
//       messages: state.messages.filter(m => m.id !== tempId),
//     }));
//     throw err;
//   } finally {
//     set({ isSending: false });
//   }
// },

//   // ─── Your existing actions (fetchBookings, fetchMessages, etc.) ──
//   // ... keep them as they are, they will work alongside socket ...
  
//   // Check if filter data is fresh
//   isFilterFresh: (filter) => {
//     const { filterTimestamps, CACHE_DURATIONS } = get();
//     const lastFetch = filterTimestamps[filter];
    
//     if (!lastFetch) return false;
    
//     const cacheDuration = CACHE_DURATIONS[filter] || 30000;
//     const age = Date.now() - lastFetch;
    
//     return age < cacheDuration;
//   },

//   // Get cache status for debugging
//   getCacheStatus: () => {
//     const { filterTimestamps, CACHE_DURATIONS } = get();
//     const now = Date.now();
    
//     return Object.entries(filterTimestamps).map(([filter, timestamp]) => {
//       const cacheDuration = CACHE_DURATIONS[filter] || 30000;
//       const age = now - timestamp;
//       return {
//         filter,
//         ageSeconds: Math.round(age / 1000),
//         fresh: age < cacheDuration,
//         expiresIn: Math.round((cacheDuration - age) / 1000) + 's',
//       };
//     });
//   },

//   // Refresh only stale filters (for background updates)
//   // refreshStaleFilters: async () => {
//   //   const { filterTimestamps, CACHE_DURATIONS, fetchBookings } = get();
//   //   const now = Date.now();
    
//   //   const staleFilters = Object.keys(filterTimestamps).filter(filter => {
//   //     const cacheDuration = CACHE_DURATIONS[filter] || 30000;
//   //     const age = now - filterTimestamps[filter];
//   //     return age >= cacheDuration;
//   //   });
    
//   //   if (staleFilters.length === 0) {
//   //     console.log("✅ All filters are fresh, skipping refresh");
//   //     return;
//   //   }
    
//   //   console.log(`🔄 Refreshing ${staleFilters.length} stale filters:`, staleFilters);
    
//   //   // Refresh stale filters in parallel
//   //   await Promise.all(
//   //     staleFilters.map(filter => fetchBookings(filter, true))
//   //   );
//   // },

//   setActiveFilter: (filter) => set({ activeFilter: filter }),

//   getCurrentBookings: () => {
//     const { bookingsByFilter, activeFilter } = get();
//     return bookingsByFilter[activeFilter] || [];
//   },

//   _refreshBookingsSilent: async () => {
//     const { activeFilter } = get();
//     if (!activeFilter) return;

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
      
//       const shouldPaginate = activeFilter === "all" || activeFilter === "completed";
      
//       if (shouldPaginate) {
//         // Fetch all pages
//         let allBookings = [];
//         let page = 1;
//         let hasMore = true;
        
//         while (hasMore) {
//           let url = `${API_BASE}/api/tutor/bookings`;
          
//           if (activeFilter !== "all") {
//             const backendStatus = activeFilter === "cancelled" ? "cancelled_by_user" : activeFilter;
//             url += `?status=${backendStatus}&page=${page}`;
//           } else {
//             url += `?page=${page}`;
//           }
          
//           const res = await fetchWithAuth(url);
          
//           if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//             allBookings = [...allBookings, ...res.data];
//             hasMore = res.data.length === 10;
//             page++;
            
//             if (page > 50) hasMore = false; // Safety limit
//           } else {
//             hasMore = false;
//           }
//         }
        
//         // Sort by most recent
//         allBookings.sort((a, b) => {
//           const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
//           const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
//           return dateB - dateA;
//         });
        
//         const mapped = allBookings.map(mapBookingToUI);
        
//         set(state => ({
//           bookingsByFilter: {
//             ...state.bookingsByFilter,
//             [activeFilter]: mapped,
//           },
//         }));
        
//         const current = get().selectedBooking;
//         if (current) {
//           const updated = mapped.find(b => b.id === current.id);
//           if (updated) set({ selectedBooking: updated });
//         }
        
//       } else {
//         // Single page fetch
//         let url = `${API_BASE}/api/tutor/bookings`;
//         if (activeFilter !== "all") {
//           const backendStatus = activeFilter === "cancelled" ? "cancelled_by_user" : activeFilter;
//           url += `?status=${backendStatus}`;
//         }
        
//         const separator = url.includes('?') ? '&' : '?';
//         url += `${separator}limit=100`;
        
//         const res = await fetchWithAuth(url);
        
//         if (res.success && Array.isArray(res.data)) {
//           const mapped = res.data.map(mapBookingToUI);
//           set(state => ({
//             bookingsByFilter: {
//               ...state.bookingsByFilter,
//               [activeFilter]: mapped,
//             },
//           }));
          
//           const current = get().selectedBooking;
//           if (current) {
//             const updated = mapped.find(b => b.id === current.id);
//             if (updated) set({ selectedBooking: updated });
//           }
//         }
//       }
//     } catch (err) {
//       console.error("[_refreshBookingsSilent] failed:", err);
//     }
//   },

//   fetchBookings: async (filter = "all", force = false) => {
//     // ✅ CHECK CACHE FIRST - skip if data is fresh and not forced
//     if (!force && get().isFilterFresh(filter)) {
//       const { filterTimestamps } = get();
//       const age = Math.round((Date.now() - filterTimestamps[filter]) / 1000);
//       console.log(`⚡ Using cached data for "${filter}" (${age}s old, still fresh)`);
//       return;
//     }

//     console.log("[fetchBookings] START", { filter, forced: force });
//     set({ isLoading: true });

//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
      
//       // Fetch all pages for "all" and "completed" filters
//       const shouldPaginate = filter === "all" || filter === "completed";
      
//       if (shouldPaginate) {
//         console.log(`[fetchBookings] 📄 Fetching ALL pages for "${filter}"...`);
        
//         let allBookings = [];
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
          
//           console.log(`[fetchBookings] 📥 Fetching page ${page}:`, url);
          
//           const res = await fetchWithAuth(url);
          
//           if (res.success && Array.isArray(res.data) && res.data.length > 0) {
//             allBookings = [...allBookings, ...res.data];
//             console.log(`[fetchBookings] ✅ Page ${page}: ${res.data.length} items (Total so far: ${allBookings.length})`);
            
//             // If we got less than 10, we're on the last page
//             hasMore = res.data.length === 10;
//             page++;
            
//             // Safety limit to prevent infinite loops
//             if (page > 50) {
//               console.warn("[fetchBookings] ⚠️ Reached page limit (50), stopping");
//               hasMore = false;
//             }
//           } else {
//             console.log(`[fetchBookings] 🏁 Last page reached (page ${page})`);
//             hasMore = false;
//           }
//         }
        
//         // Sort by most recent first (newest scheduledAt or createdAt)
//         allBookings.sort((a, b) => {
//           const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
//           const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
//           return dateB - dateA; // Descending order (newest first)
//         });
        
//         const mapped = allBookings.map(mapBookingToUI);
//         console.log(`[fetchBookings] 🎉 TOTAL for "${filter}": ${mapped.length} items (sorted by most recent)`);
        
//         // ✅ UPDATE CACHE TIMESTAMP
//         set(state => ({
//           bookingsByFilter: {
//             ...state.bookingsByFilter,
//             [filter]: mapped,
//           },
//           filterTimestamps: {
//             ...state.filterTimestamps,
//             [filter]: Date.now(), // Record when fetched
//           },
//         }));
        
//       } else {
//         // For other filters, fetch single page with limit
//         let url = `${API_BASE}/api/tutor/bookings`;
        
//         if (filter !== "all") {
//           const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
//           url += `?status=${backendStatus}`;
//         }
        
//         // Add pagination parameters to get more results
//         const separator = url.includes('?') ? '&' : '?';
//         url += `${separator}limit=100`;
        
//         console.log("[fetchBookings] Fetching URL:", url);
        
//         const res = await fetchWithAuth(url);
        
//         console.log("[fetchBookings] Response:", res.success, "data length:", res.data?.length);
        
//         if (res.success && Array.isArray(res.data)) {
//           const mapped = res.data.map(mapBookingToUI);
//           console.log("[fetchBookings] Mapped count:", mapped.length);
          
//           // ✅ UPDATE CACHE TIMESTAMP
//           set(state => ({
//             bookingsByFilter: {
//               ...state.bookingsByFilter,
//               [filter]: mapped,
//             },
//             filterTimestamps: {
//               ...state.filterTimestamps,
//               [filter]: Date.now(), // Record when fetched
//             },
//           }));
//         } else {
//           console.warn("[fetchBookings] No valid data for filter:", filter);
//           set(state => ({
//             bookingsByFilter: {
//               ...state.bookingsByFilter,
//               [filter]: [],
//             },
//           }));
//         }
//       }
//     } catch (err) {
//       console.error("[fetchBookings] FAILED:", err.message || err);
//       set(state => ({
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
//           method: "PATCH",
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

//   // Example: refresh bookings when socket reconnects
//   refreshOnReconnect: () => {
//     const { socketConnected } = get();
//     if (socketConnected) {
//       console.log("[TutorChat] Socket reconnected → refreshing bookings");
//       get().fetchBookings(get().activeFilter, true);
//     }
//   },

//   // Reset everything on logout
//   reset: () => {
//     get().disconnectSocket();
//     set({
//       bookingsByFilter: {},
//       filterTimestamps: {},
//       activeFilter: "all",
//       selectedBooking: null,
//       messages: [],
//       isLoading: false,
//       isSending: false,
//       socketConnected: false,
//     });
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
//   // ─── Core States ────────────────────────────────────────────
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

//   // ─── Socket Lifecycle ───────────────────────────────────────
//   initializeSocket: () => {
//     console.log("initializeSocket() called");

//     const token = useTutorAuthStore.getState().accessToken;
//     if (!token) {
//       console.warn("No token → cannot initialize socket");
//       return;
//     }

//     let socket = getSocket();

//     if (socket?.connected) {
//       console.log("Socket already connected →", socket.id);
//       set({ socketConnected: true });
//       return;
//     }

//     if (!socket) {
//       console.log("Creating new socket connection...");
//       socket = connectSocket(token);
//     }

//     if (!socket) {
//       console.error("connectSocket returned null/undefined");
//       return;
//     }

//     socket.connect();

//     socket.on("connect", () => {
//       console.log("%c SOCKET CONNECTED ", "background:#28a745;color:white;padding:4px 12px;");
//       console.log("Socket ID:", socket.id);
//       set({ socketConnected: true });

//       // Re-join current booking room if we have one open
//       const currentId = get().selectedBooking?.id;
//       if (currentId) {
//         socket.emit("joinBooking", currentId);
//       }
//     });

//     socket.on("connect_error", (err) => {
//       console.error("Socket connect_error:", err.message, err);
//       set({ socketConnected: false });
//     });

//     socket.on("disconnect", (reason) => {
//       console.log("Socket disconnected:", reason);
//       set({ socketConnected: false });
//     });

//     // ─── Real-time message handler ───────────────────────────────
//     socket.on("newMessage", (msg) => {
//       console.log("%c ← newMessage ", "background:#673ab7;color:white;padding:4px 12px;");

//       const state = get();
//       if (msg.bookingId !== state.selectedBooking?.id) {
//         // Message for different chat → only update unread if needed
//         if (msg.senderRole === "student") {
//           set((s) => ({
//             bookingsByFilter: {
//               ...s.bookingsByFilter,
//               [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map((b) =>
//                 b.id === msg.bookingId
//                   ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
//                   : b
//               ),
//             },
//           }));
//         }
//         return;
//       }

//       // Message belongs to current open chat
//       set((s) => {
//         const alreadyExists = s.messages.some((m) => m.id === msg.id);
//         if (alreadyExists) return s; // avoid duplicate

//         // Replace optimistic message if tempId matches
//         let updatedMessages = s.messages.map((m) =>
//           m.tempId === msg.tempId
//             ? { ...msg, tempId: undefined, isOptimistic: false, status: "sent" }
//             : m
//         );

//         // If no match → it's a new message (from student)
//         if (updatedMessages.every((m) => m.id !== msg.id)) {
//           updatedMessages = [...updatedMessages, { ...msg, status: "sent" }];
//         }

//         // Keep sorted
//         updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

//         return { messages: updatedMessages };
//       });
//     });

//     // ─── Typing indicators ───────────────────────────────────────
//     socket.on("typing", ({ bookingId, isTyping }) => {
//       if (bookingId !== get().selectedBooking?.id) return;
//       set({ isSomeoneTyping: isTyping });

//       if (isTyping) {
//         clearTimeout(get().typingTimer);
//         const timer = setTimeout(() => set({ isSomeoneTyping: false }), 4000);
//         set({ typingTimer: timer });
//       }
//     });
//   },

//   disconnectSocket: () => {
//     const socket = getSocket();
//     if (socket?.connected) {
//       socket.disconnect();
//       set({ socketConnected: false });
//     }
//   },

//   // ─── Join / Leave room when changing active chat ─────────────
//   setSelectedBooking: (booking) => {
//     const prevId = get().selectedBooking?.id;
//     const newId = booking?.id;

//     const socket = getSocket();

//     if (prevId && prevId !== newId && socket?.connected) {
//       socket.emit("leaveBooking", prevId);
//       console.log("Left booking room:", prevId);
//     }

//     set({ selectedBooking: booking, messages: [] });

//     if (newId && socket?.connected) {
//       socket.emit("joinBooking", newId);
//       console.log("Joined booking room:", newId);
//       get().fetchMessages(newId);
//       get().markMessagesAsRead(newId);
//     }
//   },

//   // ─── Send message ─────────────────────────────────────────────
//   sendMessage: async (bookingId, content, messageType = "TEXT") => {
//     const tutor = useTutorAuthStore.getState().tutor;
//     if (!tutor?.id) throw new Error("Not authenticated");

//     if (!content?.trim()) return;

//     const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2,8)}`;

//     const optimisticMsg = {
//       id: tempId,
//       tempId,
//       content: content.trim(),
//       messageType,
//       sender: { id: tutor.id, name: tutor.name || "You", avatar: tutor.avatar },
//       senderRole: "tutor",
//       bookingId,
//       createdAt: new Date().toISOString(),
//       status: "sending",
//       isOptimistic: true,
//     };

//     set((state) => ({
//       messages:
//         state.selectedBooking?.id === bookingId
//           ? [...state.messages, optimisticMsg]
//           : state.messages,
//       isSending: true,
//     }));

//     try {
//       const socket = getSocket();

//       if (socket?.connected) {
//         socket.emit("sendMessage", {
//           bookingId,
//           content: content.trim(),
//           messageType,
//           tempId,
//         });

//         // Also emit typing stop
//         socket.emit("typing", { bookingId, isTyping: false });
//       } else {
//         // HTTP fallback (optional but recommended)
//         const { fetchWithAuth } = useTutorAuthStore.getState();
//         const res = await fetchWithAuth(
//           `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
//           {
//             method: "POST",
//             body: JSON.stringify({ content: content.trim(), messageType }),
//           }
//         );

//         if (!res?.success) throw new Error(res?.message || "Send failed");

//         const realMsg = res.data;
//         set((s) => ({
//           messages: s.messages.map((m) =>
//             m.tempId === tempId ? { ...realMsg, isOptimistic: false, status: "sent" } : m
//           ),
//         }));
//       }
//     } catch (err) {
//       console.error("sendMessage failed:", err);
//       set((s) => ({
//         messages: s.messages.filter((m) => m.id !== tempId),
//       }));
//       throw err;
//     } finally {
//       set({ isSending: false });
//     }
//   },

//   // ─── Typing ───────────────────────────────────────────────────
//   sendTyping: (isTyping = true) => {
//     const { selectedBooking } = get();
//     if (!selectedBooking?.id) return;

//     const socket = getSocket();
//     if (socket?.connected) {
//       socket.emit("typing", {
//         bookingId: selectedBooking.id,
//         isTyping,
//       });
//     }
//   },

//   // ─── Mark as read ─────────────────────────────────────────────
//   markMessagesAsRead: async (bookingId) => {
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       await fetchWithAuth(
//         `${API_BASE}/api/tutor/bookings/${bookingId}/messages/read`,
//         { method: "POST" }
//       );

//       // Optimistic update
//       set((s) => ({
//         bookingsByFilter: {
//           ...s.bookingsByFilter,
//           [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map((b) =>
//             b.id === bookingId ? { ...b, unread_count: 0 } : b
//           ),
//         },
//       }));
//     } catch (err) {
//       console.warn("markMessagesAsRead failed:", err);
//     }
//   },

//   // ─── Fetch messages (with reset on error) ─────────────────────
//   fetchMessages: async (bookingId) => {
//     set({ isLoading: true });
//     try {
//       const { fetchWithAuth } = useTutorAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

//       if (res.success && Array.isArray(res.data)) {
//         const sorted = [...res.data].sort(
//           (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
//         );
//         set({ messages: sorted });
//       } else {
//         set({ messages: [] });
//       }
//     } catch (err) {
//       console.error("fetchMessages failed:", err);
//       set({ messages: [] });
//     } finally {
//       set({ isLoading: false });
//     }
//   },

//   // ─── Existing fetchBookings, fetchBooking, etc. remain mostly unchanged ──
//   // ... (keep your original fetchBookings, proposeReschedule, confirmBooking, etc.)


//   // ─── Send message (Socket.IO + optimistic UI + fallback) ─────
//     sendMessage: async (bookingId, content, messageType = "TEXT") => {
//       const tutor = useTutorAuthStore.getState().tutor;
//       if (!tutor?.id) throw new Error("Not authenticated as tutor");

//       const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

//       const optimistic = {
//         id: tempId,
//         content: content.trim(),
//         messageType,
//         sender: {
//           id: tutor.id,
//           name: tutor.name || "You",
//           avatar: tutor.avatar || null,
//         },
//         senderRole: "tutor",
//         bookingId,
//         createdAt: new Date().toISOString(),
//         status: "sending",
//         isOptimistic: true,
//       };

//       // Show message instantly (optimistic UI)
//       set((state) => ({
//         messages:
//           state.selectedBooking?.id === bookingId
//             ? [...state.messages, optimistic]
//             : state.messages,
//         isSending: true,
//       }));

//       try {
//         const socket = getSocket();

//         if (socket?.connected) {
//           console.log("[TutorSocket] → Emitting sendMessage", { bookingId, tempId, content });

//           socket.emit("sendMessage", {
//             bookingId,
//             content: content.trim(),
//             messageType,
//             tempId,
//           });

//           // No Promise / no timeout — we rely on "newMessage" to confirm own message
//           // The UI will update when "newMessage" arrives (including for our own message)
//         } else {
//           console.warn("[TutorSocket] Not connected → falling back to HTTP");

//           const { fetchWithAuth } = useTutorAuthStore.getState();
//           const res = await fetchWithAuth(
//             `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
//             {
//               method: "POST",
//               body: JSON.stringify({ content: content.trim(), messageType }),
//             }
//           );

//           if (!res.success || !res.data) {
//             throw new Error(res.message || "HTTP send failed");
//           }

//           const realMsg = res.data;

//           set((state) => ({
//             messages: state.messages.map((m) =>
//               m.id === tempId ? { ...realMsg, isOptimistic: false, status: "sent" } : m
//             ),
//           }));

//           return realMsg;
//         }
//       } catch (err) {
//         console.error("[sendMessage] Failed:", err);

//         // Remove failed optimistic message
//         set((state) => ({
//           messages: state.messages.filter((m) => m.id !== tempId),
//         }));

//         throw err;
//       } finally {
//         set({ isSending: false });
//       }
//     },

//   // ─── Fetch bookings (simplified, no timestamps) ──
//   fetchBookings: async (filter = "all", force = false) => {
//     if (!force && get().loadedFilters.has(filter)) {
//       console.log(`Using already loaded data for "${filter}"`);
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

//   // fetchMessages: async (bookingId) => {
//   //   try {
//   //     const { fetchWithAuth } = useTutorAuthStore.getState();
//   //     const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

//   //     if (res.success && Array.isArray(res.data)) {
//   //       set({ messages: res.data });
//   //       return res.data;
//   //     }
//   //     set({ messages: [] });
//   //     return [];
//   //   } catch (err) {
//   //     console.error("fetchMessages failed:", err);
//   //     set({ messages: [] });
//   //     return [];
//   //   }
//   // },

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

//   // Reset everything on logout
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











// src/store/tutorChatStore.js - HEAVILY LOGGED VERSION
import { create } from "zustand";
import useTutorAuthStore from "./tutorAuthStore";
import { connectSocket, getSocket } from "@/lib/socket";

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
});

export const useTutorChatStore = create((set, get) => ({
  // ─── Core States ────────────────────────────────────────────
  bookingsByFilter: {},
  loadedFilters: new Set(),
  activeFilter: "all",
  selectedBooking: null,
  messages: [],                    
  isLoading: false,
  isSending: false,
  socketConnected: false,
  isSomeoneTyping: false,
  typingTimer: null,
  socketInitialized: false,

  // ─── Socket Lifecycle ───────────────────────────────────────
  // initializeSocket: () => {
  //   console.log("%c [SOCKET INIT] START ", "background:#2196F3;color:white;padding:4px 12px;font-weight:bold;");

  //   if (get().socketInitialized) {
  //     console.log("%c [SOCKET INIT] ⚠️ Already initialized, skipping ", "background:#FF9800;color:white;padding:4px;");
  //     return;
  //   }

  //   const token = useTutorAuthStore.getState().accessToken;
  //   if (!token) {
  //     console.error("%c [SOCKET INIT] ❌ No token available ", "background:#F44336;color:white;padding:4px;");
  //     return;
  //   }
  //   console.log("%c [SOCKET INIT] ✅ Token found ", "background:#4CAF50;color:white;padding:4px;");

  //   let socket = getSocket();

  //   if (socket?.connected) {
  //     console.log("%c [SOCKET INIT] ✅ Socket already connected ", "background:#4CAF50;color:white;padding:4px;", socket.id);
  //     set({ socketConnected: true, socketInitialized: true });
  //     return;
  //   }

  //   if (!socket) {
  //     console.log("%c [SOCKET INIT] 🔌 Creating new socket connection ", "background:#9C27B0;color:white;padding:4px;");
  //     socket = connectSocket(token);
  //   }

  //   if (!socket) {
  //     console.error("%c [SOCKET INIT] ❌ connectSocket returned null ", "background:#F44336;color:white;padding:4px;");
  //     return;
  //   }

  //   // Remove old listeners
  //   console.log("%c [SOCKET INIT] 🧹 Removing old event listeners ", "background:#607D8B;color:white;padding:4px;");
  //   socket.off("connect");
  //   socket.off("connect_error");
  //   socket.off("disconnect");
  //   socket.off("newMessage");
  //   socket.off("typing");

  //   console.log("%c [SOCKET INIT] 🚀 Calling socket.connect() ", "background:#2196F3;color:white;padding:4px;");
  //   socket.connect();

  //   socket.on("connect", () => {
  //     console.log("%c ═══════════════════════════════════════════ ", "color:#4CAF50;font-weight:bold;");
  //     console.log("%c ✅ SOCKET CONNECTED SUCCESSFULLY ", "background:#4CAF50;color:white;padding:8px 16px;font-size:14px;font-weight:bold;");
  //     console.log("%c Socket ID: " + socket.id, "color:#4CAF50;font-weight:bold;");
  //     console.log("%c ═══════════════════════════════════════════ ", "color:#4CAF50;font-weight:bold;");
      
  //     set({ socketConnected: true, socketInitialized: true });

  //     // Re-join current booking room if we have one open
  //     const currentId = get().selectedBooking?.id;
  //     if (currentId) {
  //       console.log("%c [SOCKET RECONNECT] 🔄 Re-joining room: " + currentId, "background:#FF9800;color:white;padding:4px;");
  //       socket.emit("joinBooking", currentId);
  //       console.log("%c [SOCKET RECONNECT] ✅ Emitted joinBooking for: " + currentId, "background:#4CAF50;color:white;padding:4px;");
  //     } else {
  //       console.log("%c [SOCKET RECONNECT] ℹ️ No active booking to rejoin ", "background:#2196F3;color:white;padding:4px;");
  //     }
  //   });

  //   socket.on("connect_error", (err) => {
  //     console.error("%c ❌ SOCKET CONNECT ERROR ", "background:#F44336;color:white;padding:8px;font-weight:bold;");
  //     console.error("Error message:", err.message);
  //     console.error("Full error:", err);
  //     set({ socketConnected: false });
  //   });

  //   socket.on("disconnect", (reason) => {
  //     console.log("%c ⚠️ SOCKET DISCONNECTED ", "background:#FF9800;color:white;padding:8px;font-weight:bold;");
  //     console.log("Disconnect reason:", reason);
  //     set({ socketConnected: false });
  //   });

  //   // ─── Real-time message handler ───────────────────────────────
  //   socket.on("newMessage", (msg) => {
  //     console.log("%c ═══════════════════════════════════════════ ", "color:#9C27B0;font-weight:bold;");
  //     console.log("%c 📨 NEW MESSAGE RECEIVED FROM SERVER ", "background:#9C27B0;color:white;padding:8px;font-weight:bold;");
  //     console.log("%c Message ID: " + msg.id, "color:#9C27B0;");
  //     console.log("%c Booking ID: " + msg.bookingId, "color:#9C27B0;");
  //     console.log("%c TempID: " + (msg.tempId || "NONE"), "color:#9C27B0;font-weight:bold;");
  //     console.log("%c Content: " + msg.content, "color:#9C27B0;");
  //     console.log("%c Sender Role: " + msg.senderRole, "color:#9C27B0;");
  //     console.log("%c ═══════════════════════════════════════════ ", "color:#9C27B0;font-weight:bold;");

  //     const state = get();
  //     const currentBookingId = state.selectedBooking?.id;

  //     console.log("%c [NEW MSG] Current booking ID: " + currentBookingId, "color:#9C27B0;");
  //     console.log("%c [NEW MSG] Message booking ID: " + msg.bookingId, "color:#9C27B0;");

  //     if (msg.bookingId !== currentBookingId) {
  //       console.log("%c [NEW MSG] ⚠️ Message for different booking - updating sidebar only ", "background:#FF9800;color:white;padding:4px;");
        
  //       if (msg.senderRole === "student") {
  //         set((s) => ({
  //           bookingsByFilter: {
  //             ...s.bookingsByFilter,
  //             [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map((b) =>
  //               b.id === msg.bookingId
  //                 ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
  //                 : b
  //             ),
  //           },
  //         }));
  //         console.log("%c [NEW MSG] ✅ Updated unread count for booking: " + msg.bookingId, "background:#4CAF50;color:white;padding:4px;");
  //       }
  //       return;
  //     }

  //     console.log("%c [NEW MSG] ✅ Message is for current open chat ", "background:#4CAF50;color:white;padding:4px;");

  //     // Message belongs to current open chat
  //     set((s) => {
  //       console.log("%c [NEW MSG] 🔍 Checking for existing message... ", "color:#2196F3;");
  //       const alreadyExists = s.messages.some((m) => m.id === msg.id);
        
  //       if (alreadyExists) {
  //         console.log("%c [NEW MSG] ⚠️ Message already exists (ID: " + msg.id + "), skipping ", "background:#FF9800;color:white;padding:4px;");
  //         return s;
  //       }

  //       console.log("%c [NEW MSG] 🔍 Looking for optimistic message with tempId: " + msg.tempId, "color:#2196F3;");
        
  //       let updatedMessages = [...s.messages];
  //       const optimisticIndex = updatedMessages.findIndex(m => m.tempId === msg.tempId);
        
  //       if (optimisticIndex !== -1) {
  //         console.log("%c [NEW MSG] ✅ FOUND OPTIMISTIC MESSAGE at index " + optimisticIndex, "background:#4CAF50;color:white;padding:4px;font-weight:bold;");
  //         console.log("%c [NEW MSG] 🔄 Replacing optimistic with real message ", "background:#2196F3;color:white;padding:4px;");
          
  //         updatedMessages[optimisticIndex] = {
  //           ...msg,
  //           tempId: undefined,
  //           isOptimistic: false,
  //           status: "sent"
  //         };
  //       } else {
  //         console.log("%c [NEW MSG] ℹ️ No optimistic message found (new message from student) ", "background:#2196F3;color:white;padding:4px;");
  //         updatedMessages.push({ ...msg, status: "sent" });
  //       }

  //       // Keep sorted
  //       updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  //       console.log("%c [NEW MSG] ✅ Updated messages array. Total messages: " + updatedMessages.length, "background:#4CAF50;color:white;padding:4px;");
        
  //       return { messages: updatedMessages };
  //     });
  //   });

  //   // ─── Typing indicators ───────────────────────────────────────
  //   socket.on("typing", ({ bookingId, isTyping }) => {
  //     console.log("%c [TYPING] Event received - Booking: " + bookingId + ", isTyping: " + isTyping, "color:#00BCD4;");
      
  //     if (bookingId !== get().selectedBooking?.id) {
  //       console.log("%c [TYPING] ⚠️ Typing event for different booking, ignoring ", "color:#FF9800;");
  //       return;
  //     }
      
  //     set({ isSomeoneTyping: isTyping });

  //     if (isTyping) {
  //       clearTimeout(get().typingTimer);
  //       const timer = setTimeout(() => {
  //         console.log("%c [TYPING] ⏱️ Typing indicator timeout ", "color:#607D8B;");
  //         set({ isSomeoneTyping: false });
  //       }, 4000);
  //       set({ typingTimer: timer });
  //     }
  //   });

  //   console.log("%c [SOCKET INIT] ✅ All event listeners attached ", "background:#4CAF50;color:white;padding:4px;");
  // },
  initializeSocket: () => {
  console.log("[TutorChatStore] initializeSocket called");

  const token = useTutorAuthStore.getState().accessToken;
  if (!token) {
    console.warn("No token → cannot initialize socket");
    return;
  }

  let socket = getSocket();
  if (!socket) {
    console.log("Creating new socket...");
    socket = connectSocket(token);
  }

  if (socket.connected) {
    console.log("Socket already connected →", socket.id);
    set({ socketConnected: true });
    // Join current room if any
    const currentId = get().selectedBooking?.id;
    if (currentId) {
      console.log("Already connected → joining room:", currentId);
      socket.emit("joinBooking", currentId);
    }
    return;
  }

  socket.connect();

  socket.on("connect", () => {
    console.log("%c SOCKET CONNECTED ", "background:#28a745;color:white;padding:4px 12px;");
    console.log("Socket ID:", socket.id);
    set({ socketConnected: true });

    // Auto-rejoin current booking room on every connect/reconnect
    const currentId = get().selectedBooking?.id;
    if (currentId) {
      console.log("Re-joining booking room after connect:", currentId);
      socket.emit("joinBooking", currentId);
    }
  });
  socket.on("joinedRoom", (data) => {
  console.log("%c ✅ SERVER CONFIRMED JOINED ROOM ", "background:#4CAF50;color:white;padding:6px 12px;", data);
});

  socket.on("connect_error", (err) => {
    console.error("Socket connect_error:", err.message);
    set({ socketConnected: false });
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
    set({ socketConnected: false });
  });

  // ─── Message handler ───────────────────────────────────────
  socket.on("newMessage", (msg) => {
    console.log("%c ← newMessage ", "background:#673ab7;color:white;padding:4px 12px;", msg);

    const state = get();
    const isCurrentChat = msg.bookingId === state.selectedBooking?.id;

    if (!isCurrentChat) {
      // Background chat → only update unread + last message
      if (msg.senderRole === "student") {
        set((s) => ({
          bookingsByFilter: {
            ...s.bookingsByFilter,
            [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map((b) =>
              b.id === msg.bookingId
                ? { ...b, unread_count: (b.unread_count || 0) + 1, last_message: msg.content }
                : b
            ),
          },
        }));
      }
      return;
    }

    // Current chat → update messages list
    set((s) => {
      let updatedMessages = [...s.messages];

      // Replace optimistic message if tempId matches
      const optimisticIdx = updatedMessages.findIndex((m) => m.tempId === msg.tempId);
      if (optimisticIdx !== -1) {
        updatedMessages[optimisticIdx] = {
          ...msg,
          tempId: undefined,
          isOptimistic: false,
          status: "sent",
        };
      }
      // Add if completely new message
      else if (!updatedMessages.some((m) => m.id === msg.id)) {
        updatedMessages.push({ ...msg, status: "sent" });
      }

      // Sort by time
      updatedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

      return { messages: updatedMessages };
    });
  });

  // Debug: Catch any message-related event from server
  socket.onAny((eventName, payload) => {
    if (eventName.toLowerCase().includes("message") || 
        eventName.toLowerCase().includes("chat") || 
        eventName.toLowerCase().includes("msg") ||
        eventName.toLowerCase().includes("join")) {
      
      console.log(
        `%c ⚡ RECEIVED: "${eventName}" ⚡`,
        "background:#ff5722;color:white;padding:6px 12px;font-weight:bold;"
      );
      console.log("Payload:", payload);
    }
  });
  socket.onAny((event, ...args) => {
  if (event.includes('message') || 
      event.includes('chat') || 
      event.includes('msg') || 
      event.includes('join') || 
      event.includes('room')) {
    console.log(
      `%c🔥 SERVER → CLIENT: "${event}"`,
      'background:#d81e5b;color:white;padding:6px 10px;border-radius:4px;font-weight:bold;'
    );
    console.log('Payload:', ...args);
  }
});

// Also add this one specifically
socket.on('joinedRoom', (data) => {
  console.log(
    '%c✅ SERVER CONFIRMED: joined room',
    'background:#27ae60;color:white;padding:8px;border-radius:4px;',
    data
  );
});

// Room join confirmation
socket.on("joinedRoom", (data) => {
  console.log("%c ✅ SERVER CONFIRMED ROOM JOIN", "background:#4CAF50;color:white;padding:8px;", data);
});

  // Typing
  socket.on("typing", ({ bookingId, isTyping }) => {
    if (bookingId !== get().selectedBooking?.id) return;
    set({ isSomeoneTyping: isTyping });
    if (isTyping) {
      clearTimeout(get().typingTimer);
      const timer = setTimeout(() => set({ isSomeoneTyping: false }), 4000);
      set({ typingTimer: timer });
    }
  });
},

  disconnectSocket: () => {
    console.log("%c [SOCKET] 🔌 Disconnecting socket ", "background:#F44336;color:white;padding:4px;");
    const socket = getSocket();
    if (socket?.connected) {
      socket.disconnect();
      set({ socketConnected: false, socketInitialized: false });
      console.log("%c [SOCKET] ✅ Socket disconnected ", "background:#4CAF50;color:white;padding:4px;");
    }
  },

  // ─── Join / Leave room when changing active chat ─────────────
// 1. Better setSelectedBooking
// setSelectedBooking: (booking) => {
//   const prevId = get().selectedBooking?.id;
//   const newId = booking?.id;
//   const socket = getSocket();

//   if (prevId && prevId !== newId && socket?.connected) {
//     console.log("Leaving room:", prevId);
//     socket.emit("leaveBooking", prevId);
//   }

//   set({ selectedBooking: booking, messages: [] });

//   if (newId && socket?.connected) {
//     console.log("Joining room:", newId);
//     socket.emit("joinBooking", newId);

//     // Only fetch if we have no messages yet
//     if (get().messages.length === 0) {
//       get().fetchMessages(newId);
//     }
//     get().markMessagesAsRead(newId);
//   }
// },
setSelectedBooking: (booking) => {
  const prevId = get().selectedBooking?.id;
  const socket = getSocket();

  // 1. Leave old room first
  if (prevId && socket?.connected) {
    socket.emit("leaveBooking", prevId);
  }

  // 2. Clear messages & set new booking
  set({ 
    selectedBooking: booking, 
    messages: [], 
    isLoading: true 
  });

  if (!booking?.id) return;

  // 3. Join room BEFORE fetching messages
  if (socket?.connected) {
    console.log("→ Joining room immediately:", booking.id);
    socket.emit("joinBooking", booking.id);
  } else {
    console.warn("Socket not connected yet — will join on connect");
  }

  // 4. Fetch history (can run parallel to join)
  get().fetchMessages(booking.id);

  // 5. Mark read (after join succeeded is even better)
  get().markMessagesAsRead(booking.id);
},

// 2. Improved fetchMessages (add this log)
fetchMessages: async (bookingId) => {
  console.log("[FETCH MSGS] 📥 Fetching messages for booking:", bookingId);
  set({ isLoading: true });

  try {
    const { fetchWithAuth } = useTutorAuthStore.getState();
    const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

    if (res.success && Array.isArray(res.data)) {
      const sorted = [...res.data].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      console.log(`[FETCH MSGS] ✅ Loaded ${sorted.length} messages`);
      set({ messages: sorted });
    } else {
      console.log("[FETCH MSGS] ⚠️ No messages returned");
      set({ messages: [] });
    }
  } catch (err) {
    console.error("[FETCH MSGS] ❌ Error:", err);
    set({ messages: [] });
  } finally {
    set({ isLoading: false });
  }
},
  // ─── Send message ─────────────────────────────────────────────
  // sendMessage: async (bookingId, content, messageType = "TEXT") => {
  //   console.log("%c ═══════════════════════════════════════════ ", "color:#00BCD4;font-weight:bold;");
  //   console.log("%c 📤 SENDING MESSAGE ", "background:#00BCD4;color:white;padding:8px;font-weight:bold;");
  //   console.log("%c ═══════════════════════════════════════════ ", "color:#00BCD4;font-weight:bold;");
    
  //   const tutor = useTutorAuthStore.getState().tutor;
  //   if (!tutor?.id) {
  //     console.error("%c [SEND MSG] ❌ Not authenticated ", "background:#F44336;color:white;padding:4px;");
  //     throw new Error("Not authenticated as tutor");
  //   }
  //   console.log("%c [SEND MSG] ✅ Tutor authenticated: " + tutor.id, "background:#4CAF50;color:white;padding:4px;");

  //   if (!content?.trim()) {
  //     console.warn("%c [SEND MSG] ⚠️ Empty message, aborting ", "background:#FF9800;color:white;padding:4px;");
  //     return;
  //   }

  //   const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  //   console.log("%c [SEND MSG] 🎫 Generated tempId: " + tempId, "background:#9C27B0;color:white;padding:4px;font-weight:bold;");

  //   const optimisticMsg = {
  //     id: tempId,
  //     tempId: tempId, // ← CRITICAL
  //     content: content.trim(),
  //     messageType,
  //     sender: {
  //       id: tutor.id,
  //       name: tutor.name || "You",
  //       avatar: tutor.avatar || null,
  //     },
  //     senderRole: "tutor",
  //     bookingId,
  //     createdAt: new Date().toISOString(),
  //     status: "sending",
  //     isOptimistic: true,
  //   };

  //   console.log("%c [SEND MSG] 📦 Optimistic message created: ", "color:#00BCD4;", optimisticMsg);

  //   // Show message instantly (optimistic UI)
  //   set((state) => ({
  //     messages:
  //       state.selectedBooking?.id === bookingId
  //         ? [...state.messages, optimisticMsg]
  //         : state.messages,
  //     isSending: true,
  //   }));
  //   console.log("%c [SEND MSG] ✅ Optimistic message added to UI ", "background:#4CAF50;color:white;padding:4px;");

  //   try {
  //     const socket = getSocket();
  //     const isConnected = socket?.connected;

  //     console.log("%c [SEND MSG] Socket connected: " + isConnected, "color:#00BCD4;font-weight:bold;");

  //     if (isConnected) {
  //       console.log("%c [SEND MSG] 🚀 Emitting via SOCKET ", "background:#9C27B0;color:white;padding:8px;font-weight:bold;");
        
  //       const payload = {
  //         bookingId,
  //         content: content.trim(),
  //         messageType,
  //         tempId, // ← CRITICAL: Server must echo this back
  //       };

  //       console.log("%c [SEND MSG] 📨 Socket payload: ", "color:#9C27B0;", payload);
        
  //       socket.emit("sendMessage", payload);
        
  //       console.log("%c [SEND MSG] ✅ Socket emit complete - waiting for server response... ", "background:#4CAF50;color:white;padding:4px;");

  //       // Also emit typing stop
  //       socket.emit("typing", { bookingId, isTyping: false });
  //       console.log("%c [SEND MSG] ✅ Sent typing=false ", "color:#00BCD4;");

  //     } else {
  //       console.warn("%c [SEND MSG] ⚠️ Socket NOT connected - using HTTP fallback ", "background:#FF9800;color:white;padding:8px;font-weight:bold;");

  //       const { fetchWithAuth } = useTutorAuthStore.getState();
  //       const res = await fetchWithAuth(
  //         `${API_BASE}/api/tutor/bookings/${bookingId}/messages`,
  //         {
  //           method: "POST",
  //           body: JSON.stringify({ content: content.trim(), messageType }),
  //         }
  //       );

  //       console.log("%c [SEND MSG] HTTP response: ", "color:#00BCD4;", res);

  //       if (!res.success || !res.data) {
  //         throw new Error(res.message || "HTTP send failed");
  //       }

  //       const realMsg = res.data;
  //       console.log("%c [SEND MSG] ✅ HTTP success - updating optimistic message ", "background:#4CAF50;color:white;padding:4px;");

  //       set((state) => ({
  //         messages: state.messages.map((m) =>
  //           m.tempId === tempId 
  //             ? { ...realMsg, isOptimistic: false, status: "sent" } 
  //             : m
  //         ),
  //       }));
  //     }
  //   } catch (err) {
  //     console.error("%c ❌ SEND MESSAGE FAILED ", "background:#F44336;color:white;padding:8px;font-weight:bold;");
  //     console.error("Error:", err);

  //     // Remove failed optimistic message
  //     set((state) => ({
  //       messages: state.messages.filter((m) => m.tempId !== tempId),
  //     }));
      
  //     console.log("%c [SEND MSG] ❌ Removed failed optimistic message ", "background:#F44336;color:white;padding:4px;");

  //     throw err;
  //   } finally {
  //     set({ isSending: false });
  //     console.log("%c [SEND MSG] ✅ Send operation complete ", "background:#4CAF50;color:white;padding:4px;");
  //   }
  // },
  sendMessage: async (bookingId, content, messageType = "TEXT") => {
  const tutor = useTutorAuthStore.getState().tutor;
  if (!tutor?.id) throw new Error("Not authenticated");

  const trimmed = content.trim();
  if (!trimmed) return;

  const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

  const optimisticMsg = {
    id: tempId,
    tempId,
    content: trimmed,
    messageType,
    sender: { id: tutor.id, name: tutor.name || "You", avatar: tutor.avatar },
    senderRole: "tutor",
    bookingId,
    createdAt: new Date().toISOString(),
    status: "sending",
    isOptimistic: true,
  };

  set((state) => ({
    messages:
      state.selectedBooking?.id === bookingId
        ? [...state.messages, optimisticMsg]
        : state.messages,
    isSending: true,
  }));

  const socket = getSocket();

  try {
    // Wait for connection with timeout
    if (!socket?.connected) {
      console.warn("[sendMessage] Socket not connected → waiting...");
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error("Socket connection timeout (4s)")), 4000);

        const onConnect = () => {
          socket.off("connect", onConnect);
          clearTimeout(timeout);
          resolve();
        };

        socket.on("connect", onConnect);
        if (!socket.connecting) socket.connect();
      });
    }

    console.log("[sendMessage] → emitting", { bookingId, tempId, content: trimmed });

    socket.emit("sendMessage", {
      bookingId,
      content: trimmed,
      messageType,
      tempId,
    });

    // Also stop typing
    socket.emit("typing", { bookingId, isTyping: false });
  } catch (err) {
    console.error("[sendMessage] failed:", err);

    // Remove optimistic message on failure
    set((state) => ({
      messages: state.messages.filter((m) => m.id !== tempId),
    }));

    // Optional: you can add HTTP fallback here as last resort
    throw err;
  } finally {
    set({ isSending: false });
  }
},

  // ─── Typing ───────────────────────────────────────────────────
  sendTyping: (isTyping = true) => {
    const { selectedBooking, socketConnected } = get();
    
    console.log("%c [TYPING EMIT] isTyping: " + isTyping, "color:#00BCD4;");
    console.log("%c [TYPING EMIT] Has booking: " + !!selectedBooking?.id, "color:#00BCD4;");
    console.log("%c [TYPING EMIT] Socket connected: " + socketConnected, "color:#00BCD4;");
    
    if (!selectedBooking?.id || !socketConnected) {
      console.warn("%c [TYPING EMIT] ⚠️ Cannot send typing - missing booking or socket ", "background:#FF9800;color:white;padding:4px;");
      return;
    }

    const socket = getSocket();
    if (socket?.connected) {
      socket.emit("typing", {
        bookingId: selectedBooking.id,
        isTyping,
      });
      console.log("%c [TYPING EMIT] ✅ Emitted typing event ", "background:#4CAF50;color:white;padding:4px;");
    }
  },

  // ─── Mark as read ─────────────────────────────────────────────
  markMessagesAsRead: async (bookingId) => {
    console.log("%c [MARK READ] Booking: " + bookingId, "color:#607D8B;");
    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      await fetchWithAuth(
        `${API_BASE}/api/tutor/bookings/${bookingId}/messages/read`,
        { method: "POST" }
      );

      // Optimistic update
      set((s) => ({
        bookingsByFilter: {
          ...s.bookingsByFilter,
          [s.activeFilter]: s.bookingsByFilter[s.activeFilter]?.map((b) =>
            b.id === bookingId ? { ...b, unread_count: 0 } : b
          ),
        },
      }));
      console.log("%c [MARK READ] ✅ Success ", "background:#4CAF50;color:white;padding:4px;");
    } catch (err) {
      console.warn("%c [MARK READ] ⚠️ Failed: " + err.message, "background:#FF9800;color:white;padding:4px;");
    }
  },

  // // ─── Fetch messages ─────────────────────────────────────────
  // fetchMessages: async (bookingId) => {
  //   console.log("%c [FETCH MSGS] 📥 Fetching messages for booking: " + bookingId, "background:#2196F3;color:white;padding:4px;");
  //   set({ isLoading: true });
    
  //   try {
  //     const { fetchWithAuth } = useTutorAuthStore.getState();
  //     const res = await fetchWithAuth(`${API_BASE}/api/tutor/bookings/${bookingId}/messages`);

  //     if (res.success && Array.isArray(res.data)) {
  //       const sorted = [...res.data].sort(
  //         (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
  //       );
  //       set({ messages: sorted });
  //       console.log("%c [FETCH MSGS] ✅ Loaded " + sorted.length + " messages ", "background:#4CAF50;color:white;padding:4px;");
  //     } else {
  //       set({ messages: [] });
  //       console.log("%c [FETCH MSGS] ⚠️ No messages found ", "background:#FF9800;color:white;padding:4px;");
  //     }
  //   } catch (err) {
  //     console.error("%c [FETCH MSGS] ❌ Failed: " + err.message, "background:#F44336;color:white;padding:4px;");
  //     set({ messages: [] });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  // ... (keep all other methods: fetchBookings, fetchBooking, confirmMessage, etc. - unchanged)
  // I'll include the essential ones below:

  fetchBookings: async (filter = "all", force = false) => {
    if (!force && get().loadedFilters.has(filter)) {
      console.log(`[fetchBookings] Using already loaded data for "${filter}"`);
      return;
    }

    console.log("[fetchBookings] START", { filter, forced: force });
    set({ isLoading: true });

    try {
      const { fetchWithAuth } = useTutorAuthStore.getState();
      const shouldPaginate = filter === "all" || filter === "completed";

      let allBookings = [];

      if (shouldPaginate) {
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

          const res = await fetchWithAuth(url);

          if (res.success && Array.isArray(res.data) && res.data.length > 0) {
            allBookings = [...allBookings, ...res.data];
            hasMore = res.data.length === 10;
            page++;
            if (page > 50) hasMore = false;
          } else {
            hasMore = false;
          }
        }

        allBookings.sort((a, b) => {
          const dateA = new Date(a.scheduledAt || a.createdAt || a.updatedAt || 0);
          const dateB = new Date(b.scheduledAt || b.createdAt || b.updatedAt || 0);
          return dateB - dateA;
        });
      } else {
        let url = `${API_BASE}/api/tutor/bookings`;
        if (filter !== "all") {
          const backendStatus = filter === "cancelled" ? "cancelled_by_user" : filter;
          url += `?status=${backendStatus}`;
        }
        url += (url.includes("?") ? "&" : "?") + "limit=100";

        const res = await fetchWithAuth(url);
        if (res.success && Array.isArray(res.data)) {
          allBookings = res.data;
        }
      }

      const mapped = allBookings.map(mapBookingToUI);

      set((state) => ({
        bookingsByFilter: {
          ...state.bookingsByFilter,
          [filter]: mapped,
        },
        loadedFilters: new Set([...state.loadedFilters, filter]),
      }));
    } catch (err) {
      console.error("[fetchBookings] FAILED:", err);
      set((state) => ({
        bookingsByFilter: { ...state.bookingsByFilter, [filter]: [] },
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
        console.warn("[fetchBooking] No data or failed for ID:", bookingId);
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

      console.log("[proposeReschedule] Proposing:", { bookingId, proposedAt });

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

      console.log("[proposeReschedule] Response:", res);

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

      console.log("[cancelBooking] Cancelling:", { bookingId, reason });

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
          method: "PATCH",
          body: JSON.stringify({ reason: reason.trim() }),
        }
      );

      console.log("[cancelBooking] Response:", res);

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

  // Reset everything on logout
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
    });
  },

  setActiveFilter: (filter) => set({ activeFilter: filter }),

  getCurrentBookings: () => {
    const { bookingsByFilter, activeFilter } = get();
    return bookingsByFilter[activeFilter] || [];
  },
}));