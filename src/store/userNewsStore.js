// import { create } from "zustand";
// import useAuthStore from "./authStore";

// const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/news";

// // ── Token from authStore (mirrors how userNotificationStore does it) ──────────
// const getAuthHeaders = () => {
//   const state = useAuthStore.getState();
//   const token =
//     state.accessToken ||
//     state.token       ||
//     state.user?.token ||
//     state.user?.accessToken ||
//     sessionStorage.getItem("accessToken") ||
//     null;

//   return {
//     "Content-Type": "application/json",
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// // ── Response normalisers ──────────────────────────────────────────────────────
// // List:   { success, data: { articles: [...], pagination } }
// // Single: { success, data: { ...article } }  or  { success, data: { article: {...} } }
// const extractList = (json) =>
//   json?.data?.articles ??
//   json?.data?.news     ??
//   (Array.isArray(json?.data) ? json.data : []);

// const extractItem = (json) => {
//   if (json?.data?.slug || json?.data?.id) return json.data;
//   if (json?.data?.article)               return json.data.article;
//   if (json?.data?.news)                  return json.data.news;
//   return json?.data ?? null;
// };

// // ─────────────────────────────────────────────────────────────────────────────
// const useUserNewsStore = create((set, get) => ({
//   articles:    [],
//   selected:    null,   // currently open article
//   pagination:  null,
//   currentPage: 1,
//   hasMore:     true,
//   loading:     false,
//   loadingMore: false,
//   error:       null,

//   clearError:   () => set({ error: null }),
//   clearSelected: () => set({ selected: null }),

//   // ── Fetch paginated list ────────────────────────────────────────────────────
//   // GET /api/news?page=&limit=
//   fetchArticles: async ({ page = 1, limit = 10 } = {}) => {
//     set({ loading: true, error: null });
//     try {
//       const params = new URLSearchParams({ page, limit });
//       const res    = await fetch(`${BASE_URL}?${params}`, {
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) throw new Error(`Failed to fetch news (${res.status})`);

//       const json       = await res.json();
//       const articles   = extractList(json);
//       const pagination = json?.data?.pagination ?? null;
//       const totalPages = pagination?.pages ?? pagination?.totalPages ?? 1;

//       set({
//         articles,
//         pagination,
//         currentPage: page,
//         hasMore:     page < totalPages,
//         loading:     false,
//       });
//     } catch (err) {
//       set({ error: err.message, loading: false });
//     }
//   },

//   // ── Load next page and append ───────────────────────────────────────────────
//   loadMore: async ({ limit = 10 } = {}) => {
//     const { currentPage, hasMore, loadingMore } = get();
//     if (!hasMore || loadingMore) return;

//     set({ loadingMore: true });
//     try {
//       const nextPage = currentPage + 1;
//       const params   = new URLSearchParams({ page: nextPage, limit });
//       const res      = await fetch(`${BASE_URL}?${params}`, {
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) throw new Error(`Failed to load more (${res.status})`);

//       const json       = await res.json();
//       const newItems   = extractList(json);
//       const pagination = json?.data?.pagination ?? null;
//       const totalPages = pagination?.pages ?? pagination?.totalPages ?? 1;

//       set((state) => ({
//         articles:    [...state.articles, ...newItems],
//         pagination,
//         currentPage: nextPage,
//         hasMore:     nextPage < totalPages,
//         loadingMore: false,
//       }));
//     } catch (err) {
//       set({ error: err.message, loadingMore: false });
//     }
//   },

//   // ── Fetch single article by slug ────────────────────────────────────────────
//   // GET /api/news/:slug
//   // Checks the already-loaded list first to avoid an extra round-trip.
//   fetchBySlug: async (slug) => {
//     set({ loading: true, error: null, selected: null });

//     // ① Try in-memory list first
//     const cached = get().articles.find(
//       (a) => a.slug === slug || a.id === slug
//     );
//     if (cached) {
//       set({ selected: cached, loading: false });
//       return cached;
//     }

//     // ② Fetch from API
//     try {
//       const res = await fetch(`${BASE_URL}/${slug}`, {
//         headers: getAuthHeaders(),
//       });

//       if (!res.ok) throw new Error(`Article not found (${res.status})`);

//       const json = await res.json();
//       const item = extractItem(json);

//       set({ selected: item, loading: false });
//       return item;
//     } catch (err) {
//       set({ error: err.message, loading: false });
//       return null;
//     }
//   },
// }));

// export default useUserNewsStore;












import { create } from "zustand";
import useAuthStore from "./authStore";

const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/news";

// ── Get Auth Headers ─────────────────────────────────────────────────────────
const getAuthHeaders = () => {
  const state = useAuthStore.getState();

  const token =
    state.accessToken ||
    state.token ||
    state.user?.token ||
    state.user?.accessToken ||
    sessionStorage.getItem("accessToken") ||
    null;

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// ── Helpers ──────────────────────────────────────────────────────────────────
const extractList = (json) =>
  json?.data?.articles ??
  json?.data?.news ??
  (Array.isArray(json?.data) ? json.data : []);

const extractItem = (json) => {
  if (json?.data?.id) return json.data;
  if (json?.data?.article) return json.data.article;
  if (json?.data?.news) return json.data.news;
  return json?.data ?? null;
};

// ─────────────────────────────────────────────────────────────────────────────
const useUserNewsStore = create((set, get) => ({
  articles: [],
  selected: null,
  pagination: null,

  currentPage: 1,
  hasMore: true,

  loading: false,
  loadingMore: false,
  error: null,

  // ── Utils ─────────────────────────────────────────────────────────────────
  clearError: () => set({ error: null }),
  clearSelected: () => set({ selected: null }),

  // ── Fetch Articles (Paginated) ────────────────────────────────────────────
  fetchArticles: async ({ page = 1, limit = 10 } = {}) => {
    set({ loading: true, error: null });

    try {
      const params = new URLSearchParams({ page, limit });

      const res = await fetch(`${BASE_URL}?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch news (${res.status})`);
      }

      const json = await res.json();

      const articles = extractList(json);
      const pagination = json?.data?.pagination ?? null;

      const totalPages =
        pagination?.pages || pagination?.totalPages || 1;

      set({
        articles,
        pagination,
        currentPage: page,
        hasMore: page < totalPages,
        loading: false,
      });
    } catch (err) {
      set({
        error: err.message || "Failed to fetch articles",
        loading: false,
      });
    }
  },

  // ── Load More (Append Pagination) ─────────────────────────────────────────
  loadMore: async ({ limit = 10 } = {}) => {
    const { currentPage, hasMore, loadingMore } = get();

    if (!hasMore || loadingMore) return;

    set({ loadingMore: true });

    try {
      const nextPage = currentPage + 1;

      const params = new URLSearchParams({
        page: nextPage,
        limit,
      });

      const res = await fetch(`${BASE_URL}?${params}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Failed to load more (${res.status})`);
      }

      const json = await res.json();

      const newArticles = extractList(json);
      const pagination = json?.data?.pagination ?? null;

      const totalPages =
        pagination?.pages || pagination?.totalPages || 1;

      set((state) => ({
        articles: [...state.articles, ...newArticles],
        pagination,
        currentPage: nextPage,
        hasMore: nextPage < totalPages,
        loadingMore: false,
      }));
    } catch (err) {
      set({
        error: err.message || "Failed to load more",
        loadingMore: false,
      });
    }
  },

  // ── Fetch Single Article by ID ────────────────────────────────────────────
  fetchById: async (id) => {
    set({ loading: true, error: null, selected: null });

    // ① Check cache first
    const cached = get().articles.find(
      (a) => a.id === id || a.slug === id
    );

    if (cached) {
      set({ selected: cached, loading: false });
      return cached;
    }

    // ② Fetch from API
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        throw new Error(`Article not found (${res.status})`);
      }

      const json = await res.json();
      const article = extractItem(json);

      set({ selected: article, loading: false });

      return article;
    } catch (err) {
      set({
        error: err.message || "Failed to fetch article",
        loading: false,
      });

      return null;
    }
  },
}));

export default useUserNewsStore;