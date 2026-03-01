import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginAdmin, refreshAdminAccessToken } from "../api/adminAuth";

let refreshPromise = null;

const useAdminAuthStore = create(
  persist(
    (set, get) => ({
      admin: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: "",
      success: "",

      clearMessages: () => set({ error: "", success: "" }),

      // 🔹 LOGIN
      login: async (formData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const data = await loginAdmin(formData);

          if (!data.success) {
            set({ error: data.message || "Login failed" });
            return data;
          }

          const { accessToken, user } = data.data;

          sessionStorage.setItem("adminAccessToken", accessToken);

          set({
            admin: user,
            accessToken,
            isAuthenticated: true,
          });

          return data;
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 REFRESH ACCESS TOKEN
      refreshAccessToken: async () => {
        if (refreshPromise) return refreshPromise;

        refreshPromise = (async () => {
          try {
            const data = await refreshAdminAccessToken();

            if (!data.success) return false;

            const { accessToken, user } = data.data;

            sessionStorage.setItem("adminAccessToken", accessToken);

            set({
              accessToken,
              admin: user || get().admin,
              isAuthenticated: true,
            });

            return true;
          } catch (err) {
            console.warn("Admin refresh failed:", err);
            return false;
          } finally {
            refreshPromise = null;
          }
        })();

        return refreshPromise;
      },

      // 🔹 CHECK AUTH (on app load)
      checkAuth: async () => {
        const refreshed = await get().refreshAccessToken();
        if (refreshed) return true;

        sessionStorage.removeItem("adminAccessToken");
        set({ admin: null, accessToken: null, isAuthenticated: false });
        return false;
      },

      // 🔹 LOGOUT
      logout: () => {
        sessionStorage.removeItem("adminAccessToken");
        set({ admin: null, accessToken: null, isAuthenticated: false });
      },

      // 🔹 FETCH WITH AUTO REFRESH
      fetchWithAuth: async (url, options = {}) => {
        let token = get().accessToken;

        const request = () =>
          fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...(token ? { Authorization: `Bearer ${token}` } : {}),
              ...options.headers,
            },
            credentials: "include",
          });

        let res = await request();

        if (res.status === 401) {
          const refreshed = await get().refreshAccessToken();
          if (!refreshed) throw new Error("Session expired");

          token = get().accessToken;
          res = await request();
        }

        return res.json();
      },
    }),
    {
      name: "admin-auth-store",
      storage: {
        getItem: (key) => sessionStorage.getItem(key),
        setItem: (key, value) => sessionStorage.setItem(key, value),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
      partialize: (state) => ({
        admin: state.admin,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAdminAuthStore;