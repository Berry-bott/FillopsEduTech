
// import { create } from "zustand";
// import useAdminAuthStore from "@/store/adminAuthStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// const useAdminStore = create((set, get) => ({
//   // ========== STATE ==========
//   dashboard: null,
//   users: [],
//   tutors: [],
//   subjects: [],
//   topics: [],
//   pricing: null,
//   subscriptionStats: null,
//   communityGroups: [],
//   communityStats: null,
//   loading: false,
//   error: null,

//   // ========== HELPER WITH LOGGING ==========
//   _fetch: async (url, options = {}) => {
//     const method = options.method || "GET";
//     const timestamp = new Date().toISOString();

//     console.log(`[API ${timestamp}] → ${method} ${url}`, {
//       hasBody: !!options.body,
//       bodyPreview: options.body ? options.body.substring(0, 200) + "..." : null,
//     });

//     try {
//       const data = await useAdminAuthStore.getState().fetchWithAuth(url, options);

//       console.log(`[API ${timestamp}] ← ${method} ${url} SUCCESS`, {
//         success: data?.success,
//         hasData: !!data?.data,
//         message: data?.message || "no message",
//         dataKeys: data?.data ? Object.keys(data.data) : null,
//         dataPreview: data?.data ? JSON.stringify(data.data).substring(0, 300) + "..." : null,
//       });

//       return data;
//     } catch (err) {
//       console.error(`[API ${timestamp}] ← ${method} ${url} ERROR`, {
//         message: err.message,
//         stack: err.stack?.substring(0, 300),
//         response: err.response ? {
//           status: err.response?.status,
//           data: err.response?.data,
//         } : null,
//       });
//       throw err;
//     }
//   },

//   // ========== DASHBOARD ==========
//   fetchDashboard: async () => {
//     console.log("[fetchDashboard] Initiating request...");
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/dashboard`);
//       if (data.success) {
//         set({ dashboard: data.data });
//         console.log("[fetchDashboard] Success - keys:", Object.keys(data.data));
//       } else {
//         set({ error: data.message || "API returned failure" });
//         console.warn("[fetchDashboard] API returned !success:", data.message);
//       }
//     } catch (err) {
//       set({ error: err.message || "Failed to fetch dashboard" });
//       console.error("[fetchDashboard] Critical error:", err);
//     } finally {
//       set({ loading: false });
//       console.log("[fetchDashboard] Request completed");
//     }
//   },

//   // ========== USERS ==========
//   fetchUsers: async (params = {}) => {
//     const query = new URLSearchParams(params).toString();
//     console.log("[fetchUsers] Fetching with params:", params);
//     set({ loading: true, error: null });
//     try {
//       const res = await get()._fetch(`${API_BASE}/admin/users?${query}`);
//       if (res.success) {
//         let userList = [];
//         if (Array.isArray(res.data?.users)) {
//           userList = res.data.users;
//         } else if (Array.isArray(res.data)) {
//           userList = res.data;
//         }
//         console.log("[fetchUsers] Loaded", userList.length, "users");
//         set({ users: userList });
//       } else {
//         console.warn("[fetchUsers] API returned !success:", res.message);
//         set({ error: res.message || "Failed to load users" });
//       }
//     } catch (err) {
//       console.error("[fetchUsers] Network/auth error:", err);
//       set({ error: err.message || "Could not fetch users" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchUser: async (id) => {
//     console.log("[fetchUser] Fetching ID:", id);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/users/${id}`);
//       console.log("[fetchUser] Result:", data?.success ? "OK" : "Failed", data?.message);
//       return data;
//     } catch (err) {
//       console.error("[fetchUser] Error:", err.message);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== TUTORS ==========
//   fetchTutors: async (params = {}) => {
//     const query = new URLSearchParams(params).toString();
//     console.log("[fetchTutors] params:", params, "query:", query);
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors?${query}`);
//       if (data.success) {
//         set({ tutors: data.data.tutors || [] });
//         console.log("[fetchTutors] Loaded tutors:", data.data.tutors?.length || 0);
//       } else {
//         set({ error: data.message });
//         console.warn("[fetchTutors] !success:", data.message);
//       }
//     } catch (err) {
//       set({ error: err.message });
//       console.error("[fetchTutors] Error:", err);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchTutor: async (id) => {
//     console.log("[fetchTutor] ID:", id);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`);
//       console.log("[fetchTutor] Result:", data?.success ? "OK" : "Failed");
//       return data;
//     } catch (err) {
//       console.error("[fetchTutor] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   createTutor: async (tutorData) => {
//     console.log("[createTutor] Creating tutor:", {
//       email: tutorData.email,
//       firstName: tutorData.firstName,
//       lastName: tutorData.lastName,
//     });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors`, {
//         method: "POST",
//         body: JSON.stringify(tutorData),
//       });
//       if (data.success) {
//         console.log("[createTutor] Created successfully - ID:", data.data?.id);
//         set((state) => ({ tutors: [...state.tutors, data.data] }));
//       } else {
//         console.warn("[createTutor] !success:", data.message);
//       }
//       return data;
//     } catch (err) {
//       console.error("[createTutor] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   updateTutor: async (id, updates) => {
//     console.log("[updateTutor] ID:", id, "updates keys:", Object.keys(updates));
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`, {
//         method: "PUT",
//         body: JSON.stringify(updates),
//       });
//       if (data.success) {
//         console.log("[updateTutor] Updated successfully");
//         set((state) => ({
//           tutors: state.tutors.map((t) => (t.id === id ? { ...t, ...data.data } : t)),
//         }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[updateTutor] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   toggleTutorStatus: async (id) => {
//     console.log("[toggleTutorStatus] Toggling tutor ID:", id);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}/toggle-status`, {
//         method: "PATCH",
//       });
//       if (data.success) {
//         console.log("[toggleTutorStatus] Toggled successfully");
//         set((state) => ({
//           tutors: state.tutors.map((t) =>
//             t.id === id ? { ...t, isActive: !t.isActive } : t
//           ),
//         }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[toggleTutorStatus] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   deleteTutor: async (id) => {
//     console.log("[deleteTutor] Deleting ID:", id);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`, {
//         method: "DELETE",
//       });
//       if (data.success) {
//         console.log("[deleteTutor] Deleted successfully");
//         set((state) => ({ tutors: state.tutors.filter((t) => t.id !== id) }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[deleteTutor] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== PRICING ==========
//   fetchPricing: async () => {
//     console.log("[fetchPricing] Fetching current pricing...");
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/pricing`);
//       if (data.success) {
//         console.log("[fetchPricing] Success:", data.data);
//         set({
//           pricing: {
//             raw: data.data,
//             monthlyPrice: data.data.monthly?.priceNaira ?? 0,
//             yearlyPrice: data.data.yearly?.priceNaira ?? 0,
//             premiumPrice: data.data.premium?.priceNaira ?? 0,
//             updatedAt: data.data.updatedAt,
//             isDefault: data.data.isDefault ?? false,
//           },
//         });
//       } else {
//         set({ error: data.message });
//         console.warn("[fetchPricing] !success:", data.message);
//       }
//     } catch (err) {
//       set({ error: err.message });
//       console.error("[fetchPricing] Error:", err);
//     } finally {
//       set({ loading: false });
//     }
//   },


//  updatePricing: async (pricingData) => {
//     console.log("[updatePricing] Raw input received:", pricingData);
 
//     const toValidPrice = (val) => {
//       const n = Number(val);
//       return !isNaN(n) && n > 0 ? n : null;
//     };
 
//     const payload = {};
 
//     const monthly = toValidPrice(pricingData.monthly?.priceNaira);
//     const yearly  = toValidPrice(pricingData.yearly?.priceNaira);
//     const premium = toValidPrice(pricingData.premium?.priceNaira);
 
//     if (monthly !== null) payload.monthlyPrice = monthly;
//     if (yearly  !== null) payload.yearlyPrice  = yearly;
//     if (premium !== null) payload.premiumPrice  = premium;
 
//     if (Object.keys(payload).length === 0) {
//       console.warn("[updatePricing] No valid prices to update — aborting");
//       return { success: false, message: "Please enter a valid price greater than 0" };
//     }
 
//     console.log("[updatePricing] Payload being sent to backend:", JSON.stringify(payload));
 
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/pricing`, {
//         method: "PUT",
//         body: JSON.stringify(payload),
//       });
 
//       if (data.success) {
//         console.log("[updatePricing] Updated successfully:", data.data);
 
//         // Capture previous state before set() runs
//         const prevPricing = get().pricing;
//         const prev = prevPricing?.raw ?? {};
 
//         set({
//           pricing: {
//             raw: {
//               ...prev,
//               ...data.data,
//             },
//             monthlyPrice: data.data.monthly?.priceNaira ?? prevPricing?.monthlyPrice ?? 0,
//             yearlyPrice:  data.data.yearly?.priceNaira  ?? prevPricing?.yearlyPrice  ?? 0,
//             premiumPrice: data.data.premium?.priceNaira ?? prevPricing?.premiumPrice ?? 0,
//             updatedAt:    data.data.updatedAt,
//             isDefault:    prev.isDefault ?? false,
//           },
//         });
//       } else {
//         console.warn("[updatePricing] !success:", data.message);
//       }
//       return data;
//     } catch (err) {
//       console.error("[updatePricing] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== SUBSCRIPTION STATS ==========
//   fetchSubscriptionStats: async () => {
//     console.log("[fetchSubscriptionStats] Fetching stats...");
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/subscriptions-stats`);
//       if (data.success) {
//         console.log("[fetchSubscriptionStats] Success:", data.data);
//         set({ subscriptionStats: data.data });
//       } else {
//         set({ error: data.message });
//       }
//     } catch (err) {
//       console.error("[fetchSubscriptionStats] Error:", err);
//       set({ error: err.message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // ========== SUBJECTS ==========
//   fetchSubjects: async (params = {}) => {
//     console.log("[fetchSubjects] params:", params);
//     set({ loading: true, error: null });
//     try {
//       const first = await get()._fetch(
//         `${API_BASE}/admin/subjects?${new URLSearchParams({ page: 1, limit: 50, ...params }).toString()}`
//       );
//       if (!first.success) { set({ error: first.message }); return; }

//       const { subjects = [], pagination } = first.data;
//       let allSubjects = [...subjects];

//       if (pagination && pagination.pages > 1) {
//         const rest = await Promise.all(
//           Array.from({ length: pagination.pages - 1 }, (_, i) =>
//             get()._fetch(
//               `${API_BASE}/admin/subjects?${new URLSearchParams({ page: i + 2, limit: 50, ...params }).toString()}`
//             )
//           )
//         );
//         rest.forEach((r) => { if (r.success) allSubjects.push(...(r.data.subjects ?? [])); });
//       }

//       console.log("[fetchSubjects] Loaded:", allSubjects.length, "subjects (total:", pagination?.total, ")");
//       set({ subjects: allSubjects });
//     } catch (err) {
//       console.error("[fetchSubjects] Error:", err);
//       set({ error: err.message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchSubject: async (id) => {
//     console.log("[fetchSubject] ID:", id);
//     try {
//       return await get()._fetch(`${API_BASE}/admin/subjects/${id}`);
//     } catch (err) {
//       console.error("[fetchSubject] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== TOPICS ==========
//   fetchTopics: async (params = {}) => {
//     console.log("[fetchTopics] params:", params);
//     set({ loading: true, error: null });
//     try {
//       const first = await get()._fetch(
//         `${API_BASE}/admin/topics?${new URLSearchParams({ page: 1, limit: 50, ...params }).toString()}`
//       );
//       if (!first.success) { set({ error: first.message }); return; }

//       const { topics = [], pagination } = first.data;
//       let allTopics = [...topics];

//       if (pagination && pagination.pages > 1) {
//         const rest = await Promise.all(
//           Array.from({ length: pagination.pages - 1 }, (_, i) =>
//             get()._fetch(
//               `${API_BASE}/admin/topics?${new URLSearchParams({ page: i + 2, limit: 50, ...params }).toString()}`
//             )
//           )
//         );
//         rest.forEach((r) => { if (r.success) allTopics.push(...(r.data.topics ?? [])); });
//       }

//       console.log("[fetchTopics] Loaded:", allTopics.length, "topics (total:", pagination?.total, ")");
//       set({ topics: allTopics });
//     } catch (err) {
//       console.error("[fetchTopics] Error:", err);
//       set({ error: err.message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchTopic: async (id) => {
//     console.log("[fetchTopic] ID:", id);
//     try {
//       return await get()._fetch(`${API_BASE}/admin/topics/${id}`);
//     } catch (err) {
//       console.error("[fetchTopic] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== COMMUNITY GROUPS ==========
//   fetchCommunityGroups: async () => {
//     console.log("[fetchCommunityGroups] Fetching all groups...");
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/community/groups`);
//       if (data.success) {
//         console.log("[fetchCommunityGroups] Loaded:", data.data?.length || 0, "groups");
//         set({ communityGroups: data.data });
//       } else {
//         set({ error: data.message });
//       }
//     } catch (err) {
//       console.error("[fetchCommunityGroups] Error:", err);
//       set({ error: err.message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchCommunityGroup: async (groupId) => {
//     console.log("[fetchCommunityGroup] Group ID:", groupId);
//     try {
//       return await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}`);
//     } catch (err) {
//       console.error("[fetchCommunityGroup] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   createCommunityGroup: async (groupData) => {
//     console.log("[createCommunityGroup] Creating:", groupData.name);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/community/groups`, {
//         method: "POST",
//         body: JSON.stringify(groupData),
//       });
//       if (data.success) {
//         console.log("[createCommunityGroup] Created - ID:", data.data?.id);
//         set((state) => ({ communityGroups: [...state.communityGroups, data.data] }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[createCommunityGroup] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   bulkCreateCommunityGroups: async (payload) => {
//     console.log("[bulkCreateCommunityGroups] Bulk payload:", payload);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/community/groups/bulk`, {
//         method: "POST",
//         body: JSON.stringify(payload),
//       });
//       if (data.success) {
//         console.log("[bulkCreateCommunityGroups] Bulk success");
//         await get().fetchCommunityGroups();
//       }
//       return data;
//     } catch (err) {
//       console.error("[bulkCreateCommunityGroups] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   updateCommunityGroup: async (groupId, updates) => {
//     console.log("[updateCommunityGroup] Group ID:", groupId, "updates:", updates);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}`, {
//         method: "PUT",
//         body: JSON.stringify(updates),
//       });
//       if (data.success) {
//         console.log("[updateCommunityGroup] Updated successfully");
//         set((state) => ({
//           communityGroups: state.communityGroups.map((g) =>
//             g.id === groupId ? { ...g, ...data.data } : g
//           ),
//         }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[updateCommunityGroup] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   deleteCommunityGroup: async (groupId, hardDelete = false) => {
//     console.log("[deleteCommunityGroup] Deleting ID:", groupId, "hardDelete:", hardDelete);
//     try {
//       const data = await get()._fetch(
//         `${API_BASE}/admin/community/groups/${groupId}?hardDelete=${hardDelete}`,
//         { method: "DELETE" }
//       );
//       if (data.success) {
//         console.log("[deleteCommunityGroup] Deleted successfully");
//         set((state) => ({
//           communityGroups: state.communityGroups.filter((g) => g.id !== groupId),
//         }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[deleteCommunityGroup] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   reactivateCommunityGroup: async (groupId) => {
//     console.log("[reactivateCommunityGroup] Reactivating ID:", groupId);
//     try {
//       const data = await get()._fetch(
//         `${API_BASE}/admin/community/groups/${groupId}/reactivate`,
//         { method: "POST" }
//       );
//       if (data.success) {
//         console.log("[reactivateCommunityGroup] Reactivated successfully");
//         await get().fetchCommunityGroups();
//       }
//       return data;
//     } catch (err) {
//       console.error("[reactivateCommunityGroup] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   fetchCommunityStats: async () => {
//     console.log("[fetchCommunityStats] Fetching stats...");
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/community/stats`);
//       if (data.success) {
//         console.log("[fetchCommunityStats] Success:", data.data);
//         set({ communityStats: data.data });
//       } else {
//         set({ error: data.message });
//       }
//     } catch (err) {
//       console.error("[fetchCommunityStats] Error:", err);
//       set({ error: err.message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchGroupMessages: async (groupId) => {
//     console.log("[fetchGroupMessages] Group ID:", groupId);
//     try {
//       return await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}/messages`);
//     } catch (err) {
//       console.error("[fetchGroupMessages] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   deleteGroupMessage: async (groupId, messageId) => {
//     console.log("[deleteGroupMessage] Group:", groupId, "Message:", messageId);
//     try {
//       return await get()._fetch(
//         `${API_BASE}/admin/community/groups/${groupId}/messages/${messageId}`,
//         { method: "DELETE" }
//       );
//     } catch (err) {
//       console.error("[deleteGroupMessage] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   fetchAvailableSubjects: async () => {
//     console.log("[fetchAvailableSubjects] Fetching subjects without groups...");
//     try {
//       return await get()._fetch(`${API_BASE}/admin/community/subjects`);
//     } catch (err) {
//       console.error("[fetchAvailableSubjects] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },
// }));

// export { useAdminStore };
// export default useAdminStore;








// import { create } from "zustand";
// import useAdminAuthStore from "@/store/adminAuthStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// const useAdminStore = create((set, get) => ({
//   // ========== STATE ==========
//   dashboard: null,
//   users: [],
//   tutors: [],
//   subjects: [],
//   topics: [],
//   pricing: null,
//   subscriptionStats: null,
//   communityGroups: [],
//   communityStats: null,
//   loading: false,
//   error: null,

//   // ========== HELPER WITH LOGGING ==========
//   _fetch: async (url, options = {}) => {
//     const method = options.method || "GET";
//     const timestamp = new Date().toISOString();

//     console.log(`[API ${timestamp}] → ${method} ${url}`, {
//       hasBody: !!options.body,
//       bodyPreview: options.body ? options.body.substring(0, 200) + "..." : null,
//     });

//     try {
//       const data = await useAdminAuthStore.getState().fetchWithAuth(url, options);

//       console.log(`[API ${timestamp}] ← ${method} ${url} SUCCESS`, {
//         success: data?.success,
//         hasData: !!data?.data,
//         message: data?.message || "no message",
//         dataKeys: data?.data ? Object.keys(data.data) : null,
//         dataPreview: data?.data ? JSON.stringify(data.data).substring(0, 300) + "..." : null,
//       });

//       return data;
//     } catch (err) {
//       console.error(`[API ${timestamp}] ← ${method} ${url} ERROR`, {
//         message: err.message,
//         stack: err.stack?.substring(0, 300),
//         response: err.response ? {
//           status: err.response?.status,
//           data: err.response?.data,
//         } : null,
//       });
//       throw err;
//     }
//   },

//   // ========== DASHBOARD ==========
//   fetchDashboard: async () => {
//     console.log("[fetchDashboard] Initiating request...");
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/dashboard`);
//       if (data.success) {
//         set({ dashboard: data.data });
//         console.log("[fetchDashboard] Success - keys:", Object.keys(data.data));
//       } else {
//         set({ error: data.message || "API returned failure" });
//         console.warn("[fetchDashboard] API returned !success:", data.message);
//       }
//     } catch (err) {
//       set({ error: err.message || "Failed to fetch dashboard" });
//       console.error("[fetchDashboard] Critical error:", err);
//     } finally {
//       set({ loading: false });
//       console.log("[fetchDashboard] Request completed");
//     }
//   },

//   // ========== USERS ==========
//   fetchUsers: async (params = {}) => {
//     const query = new URLSearchParams(params).toString();
//     console.log("[fetchUsers] Fetching with params:", params);
//     set({ loading: true, error: null });
//     try {
//       const res = await get()._fetch(`${API_BASE}/admin/users?${query}`);
//       if (res.success) {
//         let userList = [];
//         if (Array.isArray(res.data?.users)) {
//           userList = res.data.users;
//         } else if (Array.isArray(res.data)) {
//           userList = res.data;
//         }
//         console.log("[fetchUsers] Loaded", userList.length, "users");
//         set({ users: userList });
//       } else {
//         console.warn("[fetchUsers] API returned !success:", res.message);
//         set({ error: res.message || "Failed to load users" });
//       }
//     } catch (err) {
//       console.error("[fetchUsers] Network/auth error:", err);
//       set({ error: err.message || "Could not fetch users" });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchUser: async (id) => {
//     console.log("[fetchUser] Fetching ID:", id);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/users/${id}`);
//       console.log("[fetchUser] Result:", data?.success ? "OK" : "Failed", data?.message);
//       return data;
//     } catch (err) {
//       console.error("[fetchUser] Error:", err.message);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== TUTORS ==========
//   fetchTutors: async (params = {}) => {
//     const query = new URLSearchParams(params).toString();
//     console.log("[fetchTutors] params:", params, "query:", query);
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors?${query}`);
//       if (data.success) {
//         set({ tutors: data.data.tutors || [] });
//         console.log("[fetchTutors] Loaded tutors:", data.data.tutors?.length || 0);
//       } else {
//         set({ error: data.message });
//         console.warn("[fetchTutors] !success:", data.message);
//       }
//     } catch (err) {
//       set({ error: err.message });
//       console.error("[fetchTutors] Error:", err);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchTutor: async (id) => {
//     console.log("[fetchTutor] ID:", id);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`);
//       console.log("[fetchTutor] Result:", data?.success ? "OK" : "Failed");
//       return data;
//     } catch (err) {
//       console.error("[fetchTutor] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   createTutor: async (tutorData) => {
//     console.log("[createTutor] Creating tutor:", {
//       email: tutorData.email,
//       firstName: tutorData.firstName,
//       lastName: tutorData.lastName,
//     });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors`, {
//         method: "POST",
//         body: JSON.stringify(tutorData),
//       });
//       if (data.success) {
//         console.log("[createTutor] Created successfully - ID:", data.data?.id);
//         set((state) => ({ tutors: [...state.tutors, data.data] }));
//       } else {
//         console.warn("[createTutor] !success:", data.message);
//       }
//       return data;
//     } catch (err) {
//       console.error("[createTutor] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   updateTutor: async (id, updates) => {
//     console.log("[updateTutor] ID:", id, "updates keys:", Object.keys(updates));
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`, {
//         method: "PUT",
//         body: JSON.stringify(updates),
//       });
//       if (data.success) {
//         console.log("[updateTutor] Updated successfully");
//         set((state) => ({
//           tutors: state.tutors.map((t) => (t.id === id ? { ...t, ...data.data } : t)),
//         }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[updateTutor] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   toggleTutorStatus: async (id) => {
//     console.log("[toggleTutorStatus] Toggling tutor ID:", id);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}/toggle-status`, {
//         method: "PATCH",
//       });
//       if (data.success) {
//         console.log("[toggleTutorStatus] Toggled successfully");
//         set((state) => ({
//           tutors: state.tutors.map((t) =>
//             t.id === id ? { ...t, isActive: !t.isActive } : t
//           ),
//         }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[toggleTutorStatus] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   deleteTutor: async (id) => {
//     console.log("[deleteTutor] Deleting ID:", id);
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`, {
//         method: "DELETE",
//       });
//       if (data.success) {
//         console.log("[deleteTutor] Deleted successfully");
//         set((state) => ({ tutors: state.tutors.filter((t) => t.id !== id) }));
//       }
//       return data;
//     } catch (err) {
//       console.error("[deleteTutor] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== PRICING ==========
//   fetchPricing: async () => {
//     console.log("[fetchPricing] Fetching current pricing...");
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/pricing`);
//       if (data.success) {
//         console.log("[fetchPricing] Success:", data.data);
//         set({
//           pricing: {
//             raw: data.data,
//             monthlyPrice: data.data.monthly?.priceNaira ?? 0,
//             yearlyPrice: data.data.yearly?.priceNaira ?? 0,
//             premiumPrice: data.data.premium?.priceNaira ?? 0,
//             updatedAt: data.data.updatedAt,
//             isDefault: data.data.isDefault ?? false,
//           },
//         });
//       } else {
//         set({ error: data.message });
//         console.warn("[fetchPricing] !success:", data.message);
//       }
//     } catch (err) {
//       set({ error: err.message });
//       console.error("[fetchPricing] Error:", err);
//     } finally {
//       set({ loading: false });
//     }
//   },

//   updatePricing: async (pricingData) => {
//     console.log("[updatePricing] Raw input received:", pricingData);

//     const toValidPrice = (val) => {
//       const n = Number(val);
//       return !isNaN(n) && n > 0 ? n : null;
//     };

//     const payload = {};

//     const monthly = toValidPrice(pricingData.monthly?.priceNaira);
//     const yearly  = toValidPrice(pricingData.yearly?.priceNaira);
//     const premium = toValidPrice(pricingData.premium?.priceNaira);

//     if (monthly !== null) payload.monthlyPrice = monthly;
//     if (yearly  !== null) payload.yearlyPrice  = yearly;
//     if (premium !== null) payload.premiumPrice  = premium;

//     if (Object.keys(payload).length === 0) {
//       console.warn("[updatePricing] No valid prices to update — aborting");
//       return { success: false, message: "Please enter a valid price greater than 0" };
//     }

//     console.log("[updatePricing] Payload being sent to backend:", JSON.stringify(payload));

//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/pricing`, {
//         method: "PUT",
//         body: JSON.stringify(payload),
//       });

//       if (data.success) {
//         console.log("[updatePricing] Updated successfully:", data.data);

//         const prevPricing = get().pricing;
//         const prev = prevPricing?.raw ?? {};

//         set({
//           pricing: {
//             raw: {
//               ...prev,
//               ...data.data,
//             },
//             monthlyPrice: data.data.monthly?.priceNaira ?? prevPricing?.monthlyPrice ?? 0,
//             yearlyPrice:  data.data.yearly?.priceNaira  ?? prevPricing?.yearlyPrice  ?? 0,
//             premiumPrice: data.data.premium?.priceNaira ?? prevPricing?.premiumPrice ?? 0,
//             updatedAt:    data.data.updatedAt,
//             isDefault:    prev.isDefault ?? false,
//           },
//         });
//       } else {
//         console.warn("[updatePricing] !success:", data.message);
//       }
//       return data;
//     } catch (err) {
//       console.error("[updatePricing] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== SUBSCRIPTION STATS ==========
//   fetchSubscriptionStats: async () => {
//     console.log("[fetchSubscriptionStats] Fetching stats...");
//     set({ loading: true, error: null });
//     try {
//       const data = await get()._fetch(`${API_BASE}/admin/subscriptions-stats`);
//       if (data.success) {
//         console.log("[fetchSubscriptionStats] Success:", data.data);
//         set({ subscriptionStats: data.data });
//       } else {
//         set({ error: data.message });
//       }
//     } catch (err) {
//       console.error("[fetchSubscriptionStats] Error:", err);
//       set({ error: err.message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   // ========== SUBJECTS ==========
//   fetchSubjects: async (params = {}) => {
//     console.log("[fetchSubjects] params:", params);
//     set({ loading: true, error: null });
//     try {
//       const first = await get()._fetch(
//         `${API_BASE}/admin/subjects?${new URLSearchParams({ page: 1, limit: 50, ...params }).toString()}`
//       );
//       if (!first.success) { set({ error: first.message }); return; }

//       const { subjects = [], pagination } = first.data;
//       let allSubjects = [...subjects];

//       if (pagination && pagination.pages > 1) {
//         const rest = await Promise.all(
//           Array.from({ length: pagination.pages - 1 }, (_, i) =>
//             get()._fetch(
//               `${API_BASE}/admin/subjects?${new URLSearchParams({ page: i + 2, limit: 50, ...params }).toString()}`
//             )
//           )
//         );
//         rest.forEach((r) => { if (r.success) allSubjects.push(...(r.data.subjects ?? [])); });
//       }

//       console.log("[fetchSubjects] Loaded:", allSubjects.length, "subjects (total:", pagination?.total, ")");
//       set({ subjects: allSubjects });
//     } catch (err) {
//       console.error("[fetchSubjects] Error:", err);
//       set({ error: err.message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchSubject: async (id) => {
//     console.log("[fetchSubject] ID:", id);
//     try {
//       return await get()._fetch(`${API_BASE}/admin/subjects/${id}`);
//     } catch (err) {
//       console.error("[fetchSubject] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== REASSIGN SUBJECT ==========
//   reassignSubject: async (subjectId, oldTutorId, newTutorId) => {
//     console.log("[reassignSubject] Subject:", subjectId, "From:", oldTutorId, "To:", newTutorId);
//     try {
//       const data = await get()._fetch(
//         `${API_BASE}/admin/subjects/${subjectId}/reassign`,
//         {
//           method: "PATCH",
//           body: JSON.stringify({ oldTutorId, newTutorId }),
//         }
//       );

//       if (data.success) {
//         console.log("[reassignSubject] Reassigned successfully:", data.data);
//         // Update the subject in local state to reflect the new tutor
//         set((state) => ({
//           subjects: state.subjects.map((s) =>
//             s.id === subjectId
//               ? { ...s, tutorId: newTutorId, ...(data.data ?? {}) }
//               : s
//           ),
//         }));
//       } else {
//         console.warn("[reassignSubject] !success:", data.message);
//       }

//       return data;
//     } catch (err) {
//       console.error("[reassignSubject] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

//   // ========== TOPICS ==========
//   fetchTopics: async (params = {}) => {
//     console.log("[fetchTopics] params:", params);
//     set({ loading: true, error: null });
//     try {
//       const first = await get()._fetch(
//         `${API_BASE}/admin/topics?${new URLSearchParams({ page: 1, limit: 50, ...params }).toString()}`
//       );
//       if (!first.success) { set({ error: first.message }); return; }

//       const { topics = [], pagination } = first.data;
//       let allTopics = [...topics];

//       if (pagination && pagination.pages > 1) {
//         const rest = await Promise.all(
//           Array.from({ length: pagination.pages - 1 }, (_, i) =>
//             get()._fetch(
//               `${API_BASE}/admin/topics?${new URLSearchParams({ page: i + 2, limit: 50, ...params }).toString()}`
//             )
//           )
//         );
//         rest.forEach((r) => { if (r.success) allTopics.push(...(r.data.topics ?? [])); });
//       }

//       console.log("[fetchTopics] Loaded:", allTopics.length, "topics (total:", pagination?.total, ")");
//       set({ topics: allTopics });
//     } catch (err) {
//       console.error("[fetchTopics] Error:", err);
//       set({ error: err.message });
//     } finally {
//       set({ loading: false });
//     }
//   },

//   fetchTopic: async (id) => {
//     console.log("[fetchTopic] ID:", id);
//     try {
//       return await get()._fetch(`${API_BASE}/admin/topics/${id}`);
//     } catch (err) {
//       console.error("[fetchTopic] Error:", err);
//       return { success: false, message: err.message };
//     }
//   },

// }));

// export { useAdminStore };
// export default useAdminStore;





import { create } from "zustand";
import useAdminAuthStore from "@/store/adminAuthStore";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

const useAdminStore = create((set, get) => ({
  // ========== STATE ==========
  dashboard: null,
  users: [],
  tutors: [],
  subjects: [],
  topics: [],
  pricing: null,
  subscriptionStats: null,
  communityGroups: [],
  communityStats: null,
  promoCodes: [],
  promoStats: null,
  userStats: null,
  loading: false,
  error: null,

  // ========== HELPER WITH LOGGING ==========
  _fetch: async (url, options = {}) => {
    const method = options.method || "GET";
    const timestamp = new Date().toISOString();
    console.log(`[API ${timestamp}] → ${method} ${url}`, {
      hasBody: !!options.body,
      bodyPreview: options.body ? options.body.substring(0, 200) + "..." : null,
    });
    try {
      const data = await useAdminAuthStore.getState().fetchWithAuth(url, options);
      console.log(`[API ${timestamp}] ← ${method} ${url} SUCCESS`, {
        success: data?.success,
        hasData: !!data?.data,
        message: data?.message || "no message",
        dataKeys: data?.data ? Object.keys(data.data) : null,
        dataPreview: data?.data ? JSON.stringify(data.data).substring(0, 300) + "..." : null,
      });
      return data;
    } catch (err) {
      console.error(`[API ${timestamp}] ← ${method} ${url} ERROR`, {
        message: err.message,
        stack: err.stack?.substring(0, 300),
        response: err.response ? { status: err.response?.status, data: err.response?.data } : null,
      });
      throw err;
    }
  },

  // ========== DASHBOARD ==========
  fetchDashboard: async () => {
    console.log("[fetchDashboard] Initiating request...");
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/dashboard`);
      if (data.success) {
        set({ dashboard: data.data });
        console.log("[fetchDashboard] Success - keys:", Object.keys(data.data));
      } else {
        set({ error: data.message || "API returned failure" });
        console.warn("[fetchDashboard] API returned !success:", data.message);
      }
    } catch (err) {
      set({ error: err.message || "Failed to fetch dashboard" });
      console.error("[fetchDashboard] Critical error:", err);
    } finally {
      set({ loading: false });
    }
  },

  // ========== USERS ==========
  // Supported params: page, limit, search, emailVerified, subscriptionPlan, examCategory
  fetchUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    console.log("[fetchUsers] Fetching with params:", params);
    set({ loading: true, error: null });
    try {
      const res = await get()._fetch(`${API_BASE}/admin/users?${query}`);
      if (res.success) {
        let userList = [];
        if (Array.isArray(res.data?.users)) userList = res.data.users;
        else if (Array.isArray(res.data)) userList = res.data;
        console.log("[fetchUsers] Loaded", userList.length, "users");
        set({ users: userList });
        return res;
      } else {
        console.warn("[fetchUsers] API returned !success:", res.message);
        set({ error: res.message || "Failed to load users" });
        return res;
      }
    } catch (err) {
      console.error("[fetchUsers] Network/auth error:", err);
      set({ error: err.message || "Could not fetch users" });
      return { success: false, message: err.message };
    } finally {
      set({ loading: false });
    }
  },

  fetchUser: async (id) => {
    console.log("[fetchUser] Fetching ID:", id);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/users/${id}`);
      console.log("[fetchUser] Result:", data?.success ? "OK" : "Failed", data?.message);
      return data;
    } catch (err) {
      console.error("[fetchUser] Error:", err.message);
      return { success: false, message: err.message };
    }
  },

  // ========== USER ACQUISITION STATS ==========
  // period: "daily" (default) | "weekly" | "monthly" | "yearly"
  fetchUserStats: async (period = "daily") => {
    console.log("[fetchUserStats] period:", period);
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/users/stats?period=${period}`);
      if (data.success) {
        console.log("[fetchUserStats] Success:", data.data);
        set({ userStats: data.data });
      } else {
        set({ error: data.message });
        console.warn("[fetchUserStats] !success:", data.message);
      }
      return data;
    } catch (err) {
      console.error("[fetchUserStats] Error:", err);
      set({ error: err.message });
      return { success: false, message: err.message };
    } finally {
      set({ loading: false });
    }
  },

  // ========== TUTORS ==========
  fetchTutors: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    console.log("[fetchTutors] params:", params, "query:", query);
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tutors?${query}`);
      if (data.success) {
        set({ tutors: data.data.tutors || [] });
        console.log("[fetchTutors] Loaded tutors:", data.data.tutors?.length || 0);
      } else {
        set({ error: data.message });
        console.warn("[fetchTutors] !success:", data.message);
      }
    } catch (err) {
      set({ error: err.message });
      console.error("[fetchTutors] Error:", err);
    } finally {
      set({ loading: false });
    }
  },

  fetchTutor: async (id) => {
    console.log("[fetchTutor] ID:", id);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`);
      console.log("[fetchTutor] Result:", data?.success ? "OK" : "Failed");
      return data;
    } catch (err) {
      console.error("[fetchTutor] Error:", err);
      return { success: false, message: err.message };
    }
  },

  createTutor: async (tutorData) => {
    console.log("[createTutor] Creating tutor:", { email: tutorData.email, firstName: tutorData.firstName, lastName: tutorData.lastName });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tutors`, {
        method: "POST",
        body: JSON.stringify(tutorData),
      });
      if (data.success) {
        console.log("[createTutor] Created successfully - ID:", data.data?.id);
        set((state) => ({ tutors: [...state.tutors, data.data] }));
      } else {
        console.warn("[createTutor] !success:", data.message);
      }
      return data;
    } catch (err) {
      console.error("[createTutor] Error:", err);
      return { success: false, message: err.message };
    }
  },

  updateTutor: async (id, updates) => {
    console.log("[updateTutor] ID:", id, "updates keys:", Object.keys(updates));
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      if (data.success) {
        console.log("[updateTutor] Updated successfully");
        set((state) => ({ tutors: state.tutors.map((t) => (t.id === id ? { ...t, ...data.data } : t)) }));
      }
      return data;
    } catch (err) {
      console.error("[updateTutor] Error:", err);
      return { success: false, message: err.message };
    }
  },

  toggleTutorStatus: async (id) => {
    console.log("[toggleTutorStatus] Toggling tutor ID:", id);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}/toggle-status`, { method: "PATCH" });
      if (data.success) {
        console.log("[toggleTutorStatus] Toggled successfully");
        set((state) => ({ tutors: state.tutors.map((t) => t.id === id ? { ...t, isActive: !t.isActive } : t) }));
      }
      return data;
    } catch (err) {
      console.error("[toggleTutorStatus] Error:", err);
      return { success: false, message: err.message };
    }
  },

  deleteTutor: async (id) => {
    console.log("[deleteTutor] Deleting ID:", id);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`, { method: "DELETE" });
      if (data.success) {
        console.log("[deleteTutor] Deleted successfully");
        set((state) => ({ tutors: state.tutors.filter((t) => t.id !== id) }));
      }
      return data;
    } catch (err) {
      console.error("[deleteTutor] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== PRICING ==========
  fetchPricing: async () => {
    console.log("[fetchPricing] Fetching current pricing...");
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/pricing`);
      if (data.success) {
        console.log("[fetchPricing] Success:", data.data);
        set({
          pricing: {
            raw: data.data,
            monthlyPrice: data.data.monthly?.priceNaira ?? 0,
            yearlyPrice: data.data.yearly?.priceNaira ?? 0,
            premiumPrice: data.data.premium?.priceNaira ?? 0,
            updatedAt: data.data.updatedAt,
            isDefault: data.data.isDefault ?? false,
          },
        });
      } else {
        set({ error: data.message });
        console.warn("[fetchPricing] !success:", data.message);
      }
    } catch (err) {
      set({ error: err.message });
      console.error("[fetchPricing] Error:", err);
    } finally {
      set({ loading: false });
    }
  },

  updatePricing: async (pricingData) => {
    console.log("[updatePricing] Raw input received:", pricingData);
    const toValidPrice = (val) => { const n = Number(val); return !isNaN(n) && n > 0 ? n : null; };
    const payload = {};
    const monthly = toValidPrice(pricingData.monthly?.priceNaira);
    const yearly  = toValidPrice(pricingData.yearly?.priceNaira);
    const premium = toValidPrice(pricingData.premium?.priceNaira);
    if (monthly !== null) payload.monthlyPrice = monthly;
    if (yearly  !== null) payload.yearlyPrice  = yearly;
    if (premium !== null) payload.premiumPrice  = premium;
    if (Object.keys(payload).length === 0) {
      console.warn("[updatePricing] No valid prices to update — aborting");
      return { success: false, message: "Please enter a valid price greater than 0" };
    }
    console.log("[updatePricing] Payload being sent to backend:", JSON.stringify(payload));
    try {
      const data = await get()._fetch(`${API_BASE}/admin/pricing`, { method: "PUT", body: JSON.stringify(payload) });
      if (data.success) {
        console.log("[updatePricing] Updated successfully:", data.data);
        const prevPricing = get().pricing;
        const prev = prevPricing?.raw ?? {};
        set({
          pricing: {
            raw: { ...prev, ...data.data },
            monthlyPrice: data.data.monthly?.priceNaira ?? prevPricing?.monthlyPrice ?? 0,
            yearlyPrice:  data.data.yearly?.priceNaira  ?? prevPricing?.yearlyPrice  ?? 0,
            premiumPrice: data.data.premium?.priceNaira ?? prevPricing?.premiumPrice ?? 0,
            updatedAt:    data.data.updatedAt,
            isDefault:    prev.isDefault ?? false,
          },
        });
      } else { console.warn("[updatePricing] !success:", data.message); }
      return data;
    } catch (err) {
      console.error("[updatePricing] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== SUBSCRIPTION STATS ==========
  fetchSubscriptionStats: async () => {
    console.log("[fetchSubscriptionStats] Fetching stats...");
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/subscriptions-stats`);
      if (data.success) { console.log("[fetchSubscriptionStats] Success:", data.data); set({ subscriptionStats: data.data }); }
      else { set({ error: data.message }); }
    } catch (err) { console.error("[fetchSubscriptionStats] Error:", err); set({ error: err.message }); }
    finally { set({ loading: false }); }
  },

  // ========== SUBJECTS ==========
  fetchSubjects: async (params = {}) => {
    console.log("[fetchSubjects] params:", params);
    set({ loading: true, error: null });
    try {
      const first = await get()._fetch(`${API_BASE}/admin/subjects?${new URLSearchParams({ page: 1, limit: 50, ...params }).toString()}`);
      if (!first.success) { set({ error: first.message }); return; }
      const { subjects = [], pagination } = first.data;
      let allSubjects = [...subjects];
      if (pagination && pagination.pages > 1) {
        const rest = await Promise.all(Array.from({ length: pagination.pages - 1 }, (_, i) =>
          get()._fetch(`${API_BASE}/admin/subjects?${new URLSearchParams({ page: i + 2, limit: 50, ...params }).toString()}`)
        ));
        rest.forEach((r) => { if (r.success) allSubjects.push(...(r.data.subjects ?? [])); });
      }
      console.log("[fetchSubjects] Loaded:", allSubjects.length, "subjects (total:", pagination?.total, ")");
      set({ subjects: allSubjects });
    } catch (err) { console.error("[fetchSubjects] Error:", err); set({ error: err.message }); }
    finally { set({ loading: false }); }
  },

  fetchSubject: async (id) => {
    console.log("[fetchSubject] ID:", id);
    try { return await get()._fetch(`${API_BASE}/admin/subjects/${id}`); }
    catch (err) { console.error("[fetchSubject] Error:", err); return { success: false, message: err.message }; }
  },

  // ========== REASSIGN SUBJECT ==========
  reassignSubject: async (subjectId, oldTutorId, newTutorId) => {
    console.log("[reassignSubject] Subject:", subjectId, "From:", oldTutorId, "To:", newTutorId);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/subjects/${subjectId}/reassign`, {
        method: "PATCH",
        body: JSON.stringify({ oldTutorId, newTutorId }),
      });
      if (data.success) {
        console.log("[reassignSubject] Reassigned successfully:", data.data);
        set((state) => ({ subjects: state.subjects.map((s) => s.id === subjectId ? { ...s, tutorId: newTutorId, ...(data.data ?? {}) } : s) }));
      } else { console.warn("[reassignSubject] !success:", data.message); }
      return data;
    } catch (err) { console.error("[reassignSubject] Error:", err); return { success: false, message: err.message }; }
  },

  // ========== TOPICS ==========
  fetchTopics: async (params = {}) => {
    console.log("[fetchTopics] params:", params);
    set({ loading: true, error: null });
    try {
      const first = await get()._fetch(`${API_BASE}/admin/topics?${new URLSearchParams({ page: 1, limit: 50, ...params }).toString()}`);
      if (!first.success) { set({ error: first.message }); return; }
      const { topics = [], pagination } = first.data;
      let allTopics = [...topics];
      if (pagination && pagination.pages > 1) {
        const rest = await Promise.all(Array.from({ length: pagination.pages - 1 }, (_, i) =>
          get()._fetch(`${API_BASE}/admin/topics?${new URLSearchParams({ page: i + 2, limit: 50, ...params }).toString()}`)
        ));
        rest.forEach((r) => { if (r.success) allTopics.push(...(r.data.topics ?? [])); });
      }
      console.log("[fetchTopics] Loaded:", allTopics.length, "topics (total:", pagination?.total, ")");
      set({ topics: allTopics });
    } catch (err) { console.error("[fetchTopics] Error:", err); set({ error: err.message }); }
    finally { set({ loading: false }); }
  },

  fetchTopic: async (id) => {
    console.log("[fetchTopic] ID:", id);
    try { return await get()._fetch(`${API_BASE}/admin/topics/${id}`); }
    catch (err) { console.error("[fetchTopic] Error:", err); return { success: false, message: err.message }; }
  },

  // ========== COMMUNITY GROUPS ==========
  fetchCommunityGroups: async () => {
    console.log("[fetchCommunityGroups] Fetching all groups...");
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups`);
      if (data.success) { console.log("[fetchCommunityGroups] Loaded:", data.data?.length || 0, "groups"); set({ communityGroups: data.data }); }
      else { set({ error: data.message }); }
    } catch (err) { console.error("[fetchCommunityGroups] Error:", err); set({ error: err.message }); }
    finally { set({ loading: false }); }
  },

  fetchCommunityGroup: async (groupId) => {
    try { return await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}`); }
    catch (err) { return { success: false, message: err.message }; }
  },

  createCommunityGroup: async (groupData) => {
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups`, { method: "POST", body: JSON.stringify(groupData) });
      if (data.success) set((state) => ({ communityGroups: [...state.communityGroups, data.data] }));
      return data;
    } catch (err) { return { success: false, message: err.message }; }
  },

  bulkCreateCommunityGroups: async (payload) => {
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups/bulk`, { method: "POST", body: JSON.stringify(payload) });
      if (data.success) await get().fetchCommunityGroups();
      return data;
    } catch (err) { return { success: false, message: err.message }; }
  },

  updateCommunityGroup: async (groupId, updates) => {
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}`, { method: "PUT", body: JSON.stringify(updates) });
      if (data.success) set((state) => ({ communityGroups: state.communityGroups.map((g) => g.id === groupId ? { ...g, ...data.data } : g) }));
      return data;
    } catch (err) { return { success: false, message: err.message }; }
  },

  deleteCommunityGroup: async (groupId, hardDelete = false) => {
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}?hardDelete=${hardDelete}`, { method: "DELETE" });
      if (data.success) set((state) => ({ communityGroups: state.communityGroups.filter((g) => g.id !== groupId) }));
      return data;
    } catch (err) { return { success: false, message: err.message }; }
  },

  reactivateCommunityGroup: async (groupId) => {
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}/reactivate`, { method: "POST" });
      if (data.success) await get().fetchCommunityGroups();
      return data;
    } catch (err) { return { success: false, message: err.message }; }
  },

  fetchCommunityStats: async () => {
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/stats`);
      if (data.success) set({ communityStats: data.data });
      else set({ error: data.message });
    } catch (err) { set({ error: err.message }); }
    finally { set({ loading: false }); }
  },

  fetchGroupMessages: async (groupId) => {
    try { return await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}/messages`); }
    catch (err) { return { success: false, message: err.message }; }
  },

  deleteGroupMessage: async (groupId, messageId) => {
    try { return await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}/messages/${messageId}`, { method: "DELETE" }); }
    catch (err) { return { success: false, message: err.message }; }
  },

  fetchAvailableSubjects: async () => {
    try { return await get()._fetch(`${API_BASE}/admin/community/subjects`); }
    catch (err) { return { success: false, message: err.message }; }
  },

  // ========== PROMO CODES ==========

  // params: page, limit, isActive, search
  fetchPromoCodes: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    console.log("[fetchPromoCodes] params:", params);
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/promo-codes?${query}`);
      if (data.success) {
        const list = data.data?.promoCodes ?? data.data ?? [];
        console.log("[fetchPromoCodes] Loaded:", list.length, "promo codes");
        set({ promoCodes: Array.isArray(list) ? list : [] });
      } else {
        set({ error: data.message });
        console.warn("[fetchPromoCodes] !success:", data.message);
      }
      return data;
    } catch (err) {
      console.error("[fetchPromoCodes] Error:", err);
      set({ error: err.message });
      return { success: false, message: err.message };
    } finally {
      set({ loading: false });
    }
  },

  fetchPromoStats: async () => {
    console.log("[fetchPromoStats] Fetching promo analytics...");
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/promo-codes/stats`);
      if (data.success) {
        console.log("[fetchPromoStats] Success:", data.data);
        set({ promoStats: data.data });
      } else {
        set({ error: data.message });
        console.warn("[fetchPromoStats] !success:", data.message);
      }
      return data;
    } catch (err) {
      console.error("[fetchPromoStats] Error:", err);
      set({ error: err.message });
      return { success: false, message: err.message };
    } finally {
      set({ loading: false });
    }
  },

  // promoData: { code, discountType, value, validForPlan, expiresAt, maxUses? }
  createPromoCode: async (promoData) => {
    console.log("[createPromoCode] Creating:", promoData.code);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/promo-codes`, {
        method: "POST",
        body: JSON.stringify(promoData),
      });
      if (data.success) {
        console.log("[createPromoCode] Created - ID:", data.data?.id);
        set((state) => ({ promoCodes: [data.data, ...state.promoCodes] }));
      } else {
        console.warn("[createPromoCode] !success:", data.message);
      }
      return data;
    } catch (err) {
      console.error("[createPromoCode] Error:", err);
      return { success: false, message: err.message };
    }
  },

  togglePromoCode: async (promoCodeId) => {
    console.log("[togglePromoCode] Toggling ID:", promoCodeId);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/promo-codes/${promoCodeId}/toggle`, { method: "PATCH" });
      if (data.success) {
        console.log("[togglePromoCode] Toggled successfully");
        set((state) => ({
          promoCodes: state.promoCodes.map((p) =>
            p.id === promoCodeId ? { ...p, isActive: !p.isActive } : p
          ),
        }));
      } else {
        console.warn("[togglePromoCode] !success:", data.message);
      }
      return data;
    } catch (err) {
      console.error("[togglePromoCode] Error:", err);
      return { success: false, message: err.message };
    }
  },
}));

export { useAdminStore };
export default useAdminStore;