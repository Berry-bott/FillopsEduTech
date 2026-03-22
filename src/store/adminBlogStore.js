import { create } from "zustand";
import useAdminAuthStore from "@/store/adminAuthStore";

const ADMIN_BASE  = "https://fillops-server-5fuf.onrender.com/api/admin/blogs";
const PUBLIC_BASE = "https://fillops-server-5fuf.onrender.com/api/blog";

// ── Response extractors ───────────────────────────────────────────────────────
const extractList = (data) =>
  data?.data?.blogs ?? data?.data?.items ?? data?.data ?? [];

const extractItem = (data) => {
  if (data?.data?.id)   return data.data;
  if (data?.data?.blog) return data.data.blog;
  return data?.data ?? data;
};

const extractPagination = (data) => data?.data?.pagination ?? null;

const useBlogStore = create((set, get) => ({
  // ── State ───────────────────────────────────────────────────────────────────
  blogList:     [],
  selectedBlog: null,
  pagination:   null,
  isLoading:    false,
  isSubmitting: false,
  error:        null,
  filters: {
    page:        1,
    limit:       20,
    isPublished: undefined,
    category:    undefined,
    search:      "",
  },

  // ── Helpers ─────────────────────────────────────────────────────────────────
  setFilters:      (f) => set((s) => ({ filters: { ...s.filters, ...f } })),
  clearError:      ()  => set({ error: null }),
  setSelectedBlog: (b) => set({ selectedBlog: b }),
  reset:           ()  => set({ blogList: [], selectedBlog: null, pagination: null, error: null }),

  _fetch: (url, options = {}) =>
    useAdminAuthStore.getState().fetchWithAuth(url, options),

  _buildAdminQuery: (overrides = {}) => {
    const { filters } = get();
    const merged = { ...filters, ...overrides };
    const p = new URLSearchParams();

    if (merged.page)                        p.set("page",        String(merged.page));
    if (merged.limit)                       p.set("limit",       String(merged.limit));
    if (merged.isPublished !== undefined)   p.set("isPublished", String(merged.isPublished));
    if (merged.category)                    p.set("category",    merged.category);
    if (merged.search)                      p.set("search",      merged.search);

    const qs = p.toString();
    return qs ? `?${qs}` : "";
  },

  _buildPublicQuery: (params = {}) => {
    const p = new URLSearchParams();
    if (params.page)     p.set("page",     String(params.page));
    if (params.limit)    p.set("limit",    String(params.limit));
    if (params.category) p.set("category", params.category);
    const qs = p.toString();
    return qs ? `?${qs}` : "";
  },

  // ── ADMIN: Get all blogs (drafts + published) ────────────────────────────────
  fetchAdminBlogs: async (overrides = {}) => {
    set({ isLoading: true, error: null });
    try {
      const data = await get()._fetch(
        `${ADMIN_BASE}${get()._buildAdminQuery(overrides)}`
      );
      set({
        blogList:   extractList(data),
        pagination: extractPagination(data),
        isLoading:  false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false, blogList: [] });
    }
  },

  // ── ADMIN: Get single blog by ID ─────────────────────────────────────────────
  fetchAdminBlogById: async (id) => {
    set({ isLoading: true, error: null, selectedBlog: null });

    const existing = get().blogList.find((b) => b.id === id);
    if (existing) {
      set({ selectedBlog: existing, isLoading: false });
      return existing;
    }

    try {
      const data = await get()._fetch(`${ADMIN_BASE}/${id}`);
      const blog = extractItem(data);
      set({ selectedBlog: blog, isLoading: false });
      return blog;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },

  // ── ADMIN: Create blog (published or draft via publishNow flag) ───────────────
  createBlog: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await get()._fetch(ADMIN_BASE, {
        method: "POST",
        body:   JSON.stringify(payload),
      });
      const created = extractItem(data);
      set((s) => ({
        blogList:     [created, ...s.blogList],
        isSubmitting: false,
      }));
      return created;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      return null;
    }
  },

  // ── ADMIN: Save as draft (publishNow: false) ──────────────────────────────────
  saveDraft: async (payload) => {
    return get().createBlog({ ...payload, publishNow: false });
  },

  // ── ADMIN: Update blog (title, content, meta, etc.) ──────────────────────────
  updateBlog: async (id, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const data = await get()._fetch(`${ADMIN_BASE}/${id}`, {
        method: "PUT",
        body:   JSON.stringify(payload),
      });
      const updated = extractItem(data);
      set((s) => ({
        blogList:     s.blogList.map((b) => (b.id === id ? updated : b)),
        selectedBlog: s.selectedBlog?.id === id ? updated : s.selectedBlog,
        isSubmitting: false,
      }));
      return updated;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      return null;
    }
  },

  // ── ADMIN: Publish a draft ────────────────────────────────────────────────────
  publishBlog: async (id) => {
    return get().updateBlog(id, { isPublished: true });
  },

  // ── ADMIN: Unpublish a blog ───────────────────────────────────────────────────
  unpublishBlog: async (id) => {
    return get().updateBlog(id, { isPublished: false });
  },

  // ── ADMIN: Delete a blog ──────────────────────────────────────────────────────
  deleteBlog: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await get()._fetch(`${ADMIN_BASE}/${id}`, { method: "DELETE" });
      set((s) => ({
        blogList:     s.blogList.filter((b) => b.id !== id),
        selectedBlog: s.selectedBlog?.id === id ? null : s.selectedBlog,
        isSubmitting: false,
      }));
      return true;
    } catch (err) {
      set({ error: err.message, isSubmitting: false });
      return false;
    }
  },

  // ── PUBLIC: Get published blogs (with optional category / pagination) ─────────
  // Does NOT require auth — uses plain fetch
  fetchPublicBlogs: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const res  = await fetch(`${PUBLIC_BASE}${get()._buildPublicQuery(params)}`);
      if (!res.ok) throw new Error(`Failed to fetch blogs (${res.status})`);
      const data = await res.json();
      set({
        blogList:   extractList(data),
        pagination: extractPagination(data),
        isLoading:  false,
      });
    } catch (err) {
      set({ error: err.message, isLoading: false, blogList: [] });
    }
  },

  // ── PUBLIC: Read single blog by slug (SEO page) ───────────────────────────────
  fetchBlogBySlug: async (slug) => {
    set({ isLoading: true, error: null, selectedBlog: null });
    try {
      const res  = await fetch(`${PUBLIC_BASE}/${slug}`);
      if (!res.ok) throw new Error(`Blog not found (${res.status})`);
      const data = await res.json();
      const blog = extractItem(data);
      set({ selectedBlog: blog, isLoading: false });
      return blog;
    } catch (err) {
      set({ error: err.message, isLoading: false });
      return null;
    }
  },
}));

export default useBlogStore;