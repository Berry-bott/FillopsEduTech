import { create } from "zustand";
import useAuthStore from "./authStore";

const BASE_URL = "https://fillops-server-5fuf.onrender.com/api/users";

const getAuthHeaders = () => {
  const state = useAuthStore.getState();
  const token =
    state.token ||
    state.accessToken ||
    state.user?.token ||
    state.user?.accessToken ||
    state.authToken ||
    null;

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// Unwrap { success, data: { notifications, pagination } }
const parseNotificationsResponse = (json) => {
  const notifications = json?.data?.notifications ?? json?.notifications ?? [];
  const pagination = json?.data?.pagination ?? {};
  const total = pagination.total ?? json?.data?.total ?? notifications.length;
  const totalPages = pagination.pages ?? 1;
  return { notifications, total, totalPages };
};

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  totalNotifications: 0,
  totalPages: 1,
  currentPage: 1,
  limit: 10,
  hasMore: true,
  loading: false,
  loadingMore: false,
  error: null,

  fetchUnreadCount: async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/unread-count`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch unread count");
      const json = await res.json();
      // Response: { success, data: { unreadCount } }
      const unreadCount = json?.data?.unreadCount ?? json?.unreadCount ?? json?.count ?? 0;
      set({ unreadCount });
    } catch (err) {
      set({ error: err.message });
    }
  },

  fetchNotifications: async ({ page = 1, limit = 10, unreadOnly = false } = {}) => {
    set({ loading: true, error: null });
    try {
      const params = new URLSearchParams({
        page,
        limit,
        ...(unreadOnly ? { unreadOnly: true } : {}),
      });
      const res = await fetch(`${BASE_URL}/notifications?${params}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");
      const json = await res.json();

      const { notifications, total, totalPages } = parseNotificationsResponse(json);

      set({
        notifications,
        totalNotifications: total,
        totalPages,
        currentPage: page,
        limit,
        hasMore: page < totalPages,
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  loadMoreNotifications: async ({ unreadOnly = false } = {}) => {
    const { currentPage, totalPages, limit, hasMore, loadingMore } = get();
    if (!hasMore || loadingMore) return;

    set({ loadingMore: true });
    try {
      const nextPage = currentPage + 1;
      const params = new URLSearchParams({
        page: nextPage,
        limit,
        ...(unreadOnly ? { unreadOnly: true } : {}),
      });
      const res = await fetch(`${BASE_URL}/notifications?${params}`, {
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to load more notifications");
      const json = await res.json();

      const { notifications: newNotifications, totalPages: newTotalPages } =
        parseNotificationsResponse(json);

      set((state) => ({
        notifications: [...state.notifications, ...newNotifications],
        currentPage: nextPage,
        totalPages: newTotalPages,
        hasMore: nextPage < newTotalPages,
        loadingMore: false,
      }));
    } catch (err) {
      set({ error: err.message, loadingMore: false });
    }
  },

  markOneAsRead: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${id}/read`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to mark notification as read");

      set((state) => ({
        notifications: state.notifications.map((n) =>
          n._id === id || n.id === id ? { ...n, read: true, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  markAllAsRead: async () => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/read-all`, {
        method: "PATCH",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to mark all as read");

      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, read: true, isRead: true })),
        unreadCount: 0,
      }));
    } catch (err) {
      set({ error: err.message });
    }
  },

  deleteNotification: async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/notifications/${id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });
      if (!res.ok) throw new Error("Failed to delete notification");

      set((state) => {
        const removed = state.notifications.find((n) => n._id === id || n.id === id);
        const wasUnread = removed && !(removed.read || removed.isRead);
        return {
          notifications: state.notifications.filter((n) => n._id !== id && n.id !== id),
          unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount,
          totalNotifications: Math.max(0, state.totalNotifications - 1),
        };
      });
    } catch (err) {
      set({ error: err.message });
    }
  },

  clearError: () => set({ error: null }),
}));

export default useNotificationStore;