
import { create } from "zustand";
import useAdminAuthStore from "@/store/adminAuthStore";

const ADMIN_BASE = `${import.meta.env.VITE_BACKEND_URL}/api/admin/news`;

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