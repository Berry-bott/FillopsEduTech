// import { create } from "zustand";

// const ADMIN_BASE = "https://fillops-server-5fuf.onrender.com/api/admin/news";

// // ── Token resolution — tries admin first, then user tokens ───────────────────
// const getToken = () =>
//   sessionStorage.getItem("adminAccessToken") ||
//   sessionStorage.getItem("accessToken")      ||
//   localStorage.getItem("accessToken")        ||
//   localStorage.getItem("token")              ||
//   "";

// const authHeaders = () => ({
//   "Content-Type": "application/json",
//   Authorization: `Bearer ${getToken()}`,
// });

// // ── Response shape: { success, data: { articles: [...], pagination } } ────────
// const extractArray = (data) => data?.data?.articles ?? [];
// const extractItem  = (data) => {
//   // single article may come back as { data: { ...article } } or { data: { article: {...} } }
//   if (data?.data?.id)      return data.data;
//   if (data?.data?.article) return data.data.article;
//   return data?.data ?? data;
// };

// const useNewsStore = create((set, get) => ({
//   newsList:     [],
//   selectedNews: null,
//   pagination:   null,
//   isLoading:    false,
//   isSubmitting: false,
//   error:        null,
//   filters: { isPublished: undefined, targetAudience: undefined, search: "" },

//   setFilters:      (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
//   clearError:      ()  => set({ error: null }),
//   setSelectedNews: (n) => set({ selectedNews: n }),

//   _buildQuery: () => {
//     const { filters } = get();
//     const p = new URLSearchParams();
//     if (filters.isPublished !== undefined) p.set("isPublished", String(filters.isPublished));
//     if (filters.targetAudience)            p.set("targetAudience", filters.targetAudience);
//     if (filters.search)                    p.set("search", filters.search);
//     const qs = p.toString();
//     return qs ? `?${qs}` : "";
//   },

//   // ── Fetch list (used by both public page and admin) ───────────────────────
//   fetchNews: async () => {
//     set({ isLoading: true, error: null });
//     try {
//       const res = await fetch(`${ADMIN_BASE}${get()._buildQuery()}`, {
//         headers: authHeaders(),
//       });
//       if (!res.ok) throw new Error(`Failed to fetch (${res.status})`);
//       const data = await res.json();
//       set({ newsList: extractArray(data), pagination: data?.data?.pagination ?? null, isLoading: false });
//     } catch (err) {
//       set({ error: err.message, isLoading: false, newsList: [] });
//     }
//   },

//   // ── Fetch single article ──────────────────────────────────────────────────
//   // First tries to find it in the already-loaded newsList (avoids extra request
//   // and the 403 problem for public users who have the list loaded already).
//   // Falls back to a direct API call only when necessary.
//   fetchNewsById: async (id) => {
//     set({ isLoading: true, error: null, selectedNews: null });

//     // ① Try to find in already-loaded list first
//     const existing = get().newsList.find((n) => n.id === id);
//     if (existing) {
//       set({ selectedNews: existing, isLoading: false });
//       return;
//     }

//     // ② Otherwise fetch from API
//     try {
//       const res = await fetch(`${ADMIN_BASE}/${id}`, { headers: authHeaders() });
//       if (!res.ok) throw new Error(`Not found (${res.status})`);
//       const data = await res.json();
//       set({ selectedNews: extractItem(data), isLoading: false });
//     } catch (err) {
//       set({ error: err.message, isLoading: false });
//     }
//   },

//   createNews: async (payload) => {
//     set({ isSubmitting: true, error: null });
//     try {
//       const res = await fetch(ADMIN_BASE, {
//         method: "POST", headers: authHeaders(), body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error(`Failed to create (${res.status})`);
//       const data = await res.json();
//       const created = extractItem(data);
//       set((s) => ({ newsList: [created, ...s.newsList], isSubmitting: false }));
//       return created;
//     } catch (err) {
//       set({ error: err.message, isSubmitting: false });
//       return null;
//     }
//   },

//   updateNews: async (id, payload) => {
//     set({ isSubmitting: true, error: null });
//     try {
//       const res = await fetch(`${ADMIN_BASE}/${id}`, {
//         method: "PUT", headers: authHeaders(), body: JSON.stringify(payload),
//       });
//       if (!res.ok) throw new Error(`Failed to update (${res.status})`);
//       const data = await res.json();
//       const updated = extractItem(data);
//       set((s) => ({
//         newsList:     s.newsList.map((n) => (n.id === id ? updated : n)),
//         selectedNews: s.selectedNews?.id === id ? updated : s.selectedNews,
//         isSubmitting: false,
//       }));
//       return updated;
//     } catch (err) {
//       set({ error: err.message, isSubmitting: false });
//       return null;
//     }
//   },

//   deleteNews: async (id) => {
//     set({ isSubmitting: true, error: null });
//     try {
//       const res = await fetch(`${ADMIN_BASE}/${id}`, {
//         method: "DELETE", headers: authHeaders(),
//       });
//       if (!res.ok) throw new Error(`Failed to delete (${res.status})`);
//       set((s) => ({
//         newsList:     s.newsList.filter((n) => n.id !== id),
//         selectedNews: s.selectedNews?.id === id ? null : s.selectedNews,
//         isSubmitting: false,
//       }));
//       return true;
//     } catch (err) {
//       set({ error: err.message, isSubmitting: false });
//       return false;
//     }
//   },
// }));

// export default useNewsStore;









import { create } from "zustand";
import useAdminAuthStore from "@/store/adminAuthStore";

const ADMIN_BASE = "https://fillops-server-5fuf.onrender.com/api/admin/news";

const extractArray = (data) => data?.data?.articles ?? [];
const extractItem  = (data) => {
  if (data?.data?.id)      return data.data;
  if (data?.data?.article) return data.data.article;
  return data?.data ?? data;
};

const useNewsStore = create((set, get) => ({
  newsList:     [],
  selectedNews: null,
  pagination:   null,
  isLoading:    false,
  isSubmitting: false,
  error:        null,
  filters: { isPublished: undefined, targetAudience: undefined, search: "" },

  setFilters:      (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  clearError:      ()  => set({ error: null }),
  setSelectedNews: (n) => set({ selectedNews: n }),

  _fetch: (url, options = {}) =>
    useAdminAuthStore.getState().fetchWithAuth(url, options),

  _buildQuery: () => {
    const { filters } = get();
    const p = new URLSearchParams();
    if (filters.isPublished !== undefined) p.set("isPublished", String(filters.isPublished));
    if (filters.targetAudience)            p.set("targetAudience", filters.targetAudience);
    if (filters.search)                    p.set("search", filters.search);
    const qs = p.toString();
    return qs ? `?${qs}` : "";
  },

  fetchNews: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await get()._fetch(`${ADMIN_BASE}${get()._buildQuery()}`);
      set({
        newsList:   extractArray(data),
        pagination: data?.data?.pagination ?? null,
        isLoading:  false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false, newsList: [] });
    }
  },

  fetchNewsById: async (id) => {
    set({ isLoading: true, error: null, selectedNews: null });

    const existing = get().newsList.find((n) => n.id === id);
    if (existing) {
      set({ selectedNews: existing, isLoading: false });
      return;
    }

    try {
      const data = await get()._fetch(`${ADMIN_BASE}/${id}`);
      set({ selectedNews: extractItem(data), isLoading: false });
    } catch (err) {
      set({ error: err.message, isLoading: false });
    }
  },

  createNews: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await get()._fetch(ADMIN_BASE, {
        method: "POST",
        body: JSON.stringify(payload),
      });
      const created = extractItem(data);
      set((s) => ({ newsList: [created, ...s.newsList], isSubmitting: false }));
      return created;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      return null;
    }
  },

  updateNews: async (id, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await get()._fetch(`${ADMIN_BASE}/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const updated = extractItem(data);
      set((s) => ({
        newsList:     s.newsList.map((n) => (n.id === id ? updated : n)),
        selectedNews: s.selectedNews?.id === id ? updated : s.selectedNews,
        isSubmitting: false,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      return null;
    }
  },

  deleteNews: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await get()._fetch(`${ADMIN_BASE}/${id}`, { method: "DELETE" });
      set((s) => ({
        newsList:     s.newsList.filter((n) => n.id !== id),
        selectedNews: s.selectedNews?.id === id ? null : s.selectedNews,
        isSubmitting: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      return false;
    }
  },
}));

export default useNewsStore;