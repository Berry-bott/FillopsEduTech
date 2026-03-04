

import { create } from "zustand";
import useAdminAuthStore from "@/store/adminAuthStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

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
        response: err.response ? {
          status: err.response?.status,
          data: err.response?.data,
        } : null,
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
      console.log("[fetchDashboard] Request completed");
    }
  },

  // ========== USERS ==========
    fetchUsers: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    console.log("[fetchUsers] Fetching with params:", params);

    set({ loading: true, error: null });

    try {
        const res = await get()._fetch(`${API_BASE}/admin/users?${query}`);

        if (res.success) {
        // Extract only the array — safely handle different possible shapes
        let userList = [];

        if (Array.isArray(res.data?.users)) {
            userList = res.data.users;                // ← most common case
        } else if (Array.isArray(res.data)) {
            userList = res.data;                      // fallback if backend returns plain array
        }

        console.log("[fetchUsers] Loaded", userList.length, "users");

        set({ users: userList });
        } else {
        console.warn("[fetchUsers] API returned !success:", res.message);
        set({ error: res.message || "Failed to load users" });
        }
    } catch (err) {
        console.error("[fetchUsers] Network/auth error:", err);
        set({ error: err.message || "Could not fetch users" });
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

  // ========== TUTORS ==========
  fetchTutors: async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  console.log("[fetchTutors] params:", params, "query:", query);
  set({ loading: true, error: null });
  try {
      const data = await get()._fetch(`${API_BASE}/admin/tutors?${query}`);
      if (data.success) {
      // FIXED: use data.data.tutors instead of data.data
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
    console.log("[createTutor] Creating tutor:", {
      email: tutorData.email,
      firstName: tutorData.firstName,
      lastName: tutorData.lastName,
    });
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
        set((state) => ({
          tutors: state.tutors.map((t) => (t.id === id ? { ...t, ...data.data } : t)),
        }));
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
      const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}/toggle-status`, {
        method: "PATCH",
      });
      if (data.success) {
        console.log("[toggleTutorStatus] Toggled successfully");
        set((state) => ({
          tutors: state.tutors.map((t) =>
            t.id === id ? { ...t, isActive: !t.isActive } : t
          ),
        }));
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
      const data = await get()._fetch(`${API_BASE}/admin/tutors/${id}`, {
        method: "DELETE",
      });
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
            raw: data.data,                    // full original object
            monthlyPrice: data.data.monthly?.priceNaira ?? 0,
            yearlyPrice: data.data.yearly?.priceNaira ?? 0,
            premiumPrice: data.data.premium?.priceNaira ?? 0,
            updatedAt: data.data.updatedAt,
            isDefault: data.data.isDefault ?? false
          }
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
    console.log("[updatePricing] Updating with:", pricingData);
    try {
      // Backend expects nested structure
      const payload = {
        monthly:  pricingData.monthly  ? { priceNaira: pricingData.monthly.priceNaira }  : undefined,
        yearly:   pricingData.yearly   ? { priceNaira: pricingData.yearly.priceNaira }   : undefined,
        premium:  pricingData.premium  ? { priceNaira: pricingData.premium.priceNaira }  : undefined,
      };

      const data = await get()._fetch(`${API_BASE}/admin/pricing`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      if (data.success) {
        console.log("[updatePricing] Updated successfully:", data.data);
        set({ 
          pricing: {
            raw: data.data,
            monthlyPrice: data.data.monthly?.priceNaira ?? 0,
            yearlyPrice: data.data.yearly?.priceNaira ?? 0,
            premiumPrice: data.data.premium?.priceNaira ?? 0,
            updatedAt: data.data.updatedAt,
            isDefault: data.data.isDefault ?? false
          }
        });
      }
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
      if (data.success) {
        console.log("[fetchSubscriptionStats] Success:", data.data);
        set({ subscriptionStats: data.data });
      } else {
        set({ error: data.message });
      }
    } catch (err) {
      console.error("[fetchSubscriptionStats] Error:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  // ========== SUBJECTS ==========
  fetchSubjects: async (params = {}) => {
    console.log("[fetchSubjects] params:", params);
    set({ loading: true, error: null });
    try {
      // First page to get total
      const first = await get()._fetch(
        `${API_BASE}/admin/subjects?${new URLSearchParams({ page: 1, limit: 50, ...params }).toString()}`
      );
      if (!first.success) { set({ error: first.message }); return; }

      const { subjects = [], pagination } = first.data;
      let allSubjects = [...subjects];

      // Fetch remaining pages if any
      if (pagination && pagination.pages > 1) {
        const rest = await Promise.all(
          Array.from({ length: pagination.pages - 1 }, (_, i) =>
            get()._fetch(
              `${API_BASE}/admin/subjects?${new URLSearchParams({ page: i + 2, limit: 50, ...params }).toString()}`
            )
          )
        );
        rest.forEach((r) => { if (r.success) allSubjects.push(...(r.data.subjects ?? [])); });
      }

      console.log("[fetchSubjects] Loaded:", allSubjects.length, "subjects (total:", pagination?.total, ")");
      set({ subjects: allSubjects });
    } catch (err) {
      console.error("[fetchSubjects] Error:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchSubject: async (id) => {
    console.log("[fetchSubject] ID:", id);
    try {
      return await get()._fetch(`${API_BASE}/admin/subjects/${id}`);
    } catch (err) {
      console.error("[fetchSubject] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== TOPICS ==========
  fetchTopics: async (params = {}) => {
    console.log("[fetchTopics] params:", params);
    set({ loading: true, error: null });
    try {
      const first = await get()._fetch(
        `${API_BASE}/admin/topics?${new URLSearchParams({ page: 1, limit: 50, ...params }).toString()}`
      );
      if (!first.success) { set({ error: first.message }); return; }

      const { topics = [], pagination } = first.data;
      let allTopics = [...topics];

      if (pagination && pagination.pages > 1) {
        const rest = await Promise.all(
          Array.from({ length: pagination.pages - 1 }, (_, i) =>
            get()._fetch(
              `${API_BASE}/admin/topics?${new URLSearchParams({ page: i + 2, limit: 50, ...params }).toString()}`
            )
          )
        );
        rest.forEach((r) => { if (r.success) allTopics.push(...(r.data.topics ?? [])); });
      }

      console.log("[fetchTopics] Loaded:", allTopics.length, "topics (total:", pagination?.total, ")");
      set({ topics: allTopics });
    } catch (err) {
      console.error("[fetchTopics] Error:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchTopic: async (id) => {
    console.log("[fetchTopic] ID:", id);
    try {
      return await get()._fetch(`${API_BASE}/admin/topics/${id}`);
    } catch (err) {
      console.error("[fetchTopic] Error:", err);
      return { success: false, message: err.message };
    }
  },

  // ========== COMMUNITY GROUPS ==========
  fetchCommunityGroups: async () => {
    console.log("[fetchCommunityGroups] Fetching all groups...");
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups`);
      if (data.success) {
        console.log("[fetchCommunityGroups] Loaded:", data.data?.length || 0, "groups");
        set({ communityGroups: data.data });
      } else {
        set({ error: data.message });
      }
    } catch (err) {
      console.error("[fetchCommunityGroups] Error:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchCommunityGroup: async (groupId) => {
    console.log("[fetchCommunityGroup] Group ID:", groupId);
    try {
      return await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}`);
    } catch (err) {
      console.error("[fetchCommunityGroup] Error:", err);
      return { success: false, message: err.message };
    }
  },

  createCommunityGroup: async (groupData) => {
    console.log("[createCommunityGroup] Creating:", groupData.name);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups`, {
        method: "POST",
        body: JSON.stringify(groupData),
      });
      if (data.success) {
        console.log("[createCommunityGroup] Created - ID:", data.data?.id);
        set((state) => ({ communityGroups: [...state.communityGroups, data.data] }));
      }
      return data;
    } catch (err) {
      console.error("[createCommunityGroup] Error:", err);
      return { success: false, message: err.message };
    }
  },

  bulkCreateCommunityGroups: async (payload) => {
    console.log("[bulkCreateCommunityGroups] Bulk payload:", payload);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups/bulk`, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      if (data.success) {
        console.log("[bulkCreateCommunityGroups] Bulk success");
        await get().fetchCommunityGroups();
      }
      return data;
    } catch (err) {
      console.error("[bulkCreateCommunityGroups] Error:", err);
      return { success: false, message: err.message };
    }
  },

  updateCommunityGroup: async (groupId, updates) => {
    console.log("[updateCommunityGroup] Group ID:", groupId, "updates:", updates);
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}`, {
        method: "PUT",
        body: JSON.stringify(updates),
      });
      if (data.success) {
        console.log("[updateCommunityGroup] Updated successfully");
        set((state) => ({
          communityGroups: state.communityGroups.map((g) =>
            g.id === groupId ? { ...g, ...data.data } : g
          ),
        }));
      }
      return data;
    } catch (err) {
      console.error("[updateCommunityGroup] Error:", err);
      return { success: false, message: err.message };
    }
  },

  deleteCommunityGroup: async (groupId, hardDelete = false) => {
    console.log("[deleteCommunityGroup] Deleting ID:", groupId, "hardDelete:", hardDelete);
    try {
      const data = await get()._fetch(
        `${API_BASE}/admin/community/groups/${groupId}?hardDelete=${hardDelete}`,
        { method: "DELETE" }
      );
      if (data.success) {
        console.log("[deleteCommunityGroup] Deleted successfully");
        set((state) => ({
          communityGroups: state.communityGroups.filter((g) => g.id !== groupId),
        }));
      }
      return data;
    } catch (err) {
      console.error("[deleteCommunityGroup] Error:", err);
      return { success: false, message: err.message };
    }
  },

  reactivateCommunityGroup: async (groupId) => {
    console.log("[reactivateCommunityGroup] Reactivating ID:", groupId);
    try {
      const data = await get()._fetch(
        `${API_BASE}/admin/community/groups/${groupId}/reactivate`,
        { method: "POST" }
      );
      if (data.success) {
        console.log("[reactivateCommunityGroup] Reactivated successfully");
        await get().fetchCommunityGroups();
      }
      return data;
    } catch (err) {
      console.error("[reactivateCommunityGroup] Error:", err);
      return { success: false, message: err.message };
    }
  },

  fetchCommunityStats: async () => {
    console.log("[fetchCommunityStats] Fetching stats...");
    set({ loading: true, error: null });
    try {
      const data = await get()._fetch(`${API_BASE}/admin/community/stats`);
      if (data.success) {
        console.log("[fetchCommunityStats] Success:", data.data);
        set({ communityStats: data.data });
      } else {
        set({ error: data.message });
      }
    } catch (err) {
      console.error("[fetchCommunityStats] Error:", err);
      set({ error: err.message });
    } finally {
      set({ loading: false });
    }
  },

  fetchGroupMessages: async (groupId) => {
    console.log("[fetchGroupMessages] Group ID:", groupId);
    try {
      return await get()._fetch(`${API_BASE}/admin/community/groups/${groupId}/messages`);
    } catch (err) {
      console.error("[fetchGroupMessages] Error:", err);
      return { success: false, message: err.message };
    }
  },

  deleteGroupMessage: async (groupId, messageId) => {
    console.log("[deleteGroupMessage] Group:", groupId, "Message:", messageId);
    try {
      return await get()._fetch(
        `${API_BASE}/admin/community/groups/${groupId}/messages/${messageId}`,
        { method: "DELETE" }
      );
    } catch (err) {
      console.error("[deleteGroupMessage] Error:", err);
      return { success: false, message: err.message };
    }
  },

  fetchAvailableSubjects: async () => {
    console.log("[fetchAvailableSubjects] Fetching subjects without groups...");
    try {
      return await get()._fetch(`${API_BASE}/admin/community/subjects`);
    } catch (err) {
      console.error("[fetchAvailableSubjects] Error:", err);
      return { success: false, message: err.message };
    }
  },
}));

export { useAdminStore };
export default useAdminStore;