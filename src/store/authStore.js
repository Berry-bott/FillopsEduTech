// src/store/authStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginUser,
  registerUser,
  getProfile,
  refreshAccessToken,
  logoutUser,
} from "../api/auth";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: sessionStorage.getItem("accessToken") || null,
      isAuthenticated: false,
      loading: false,

      // 🔹 Login
      login: async (formData) => {
        set({ loading: true });
        try {
          const res = await loginUser(formData);
          if (res.success) {
            const token = res.data.accessToken;
            sessionStorage.setItem("accessToken", token);
            set({
              user: res.data.user,
              accessToken: token,
              isAuthenticated: true,
            });
          }
          return res;
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 Register
      register: async (formData) => {
        set({ loading: true });
        try {
          const res = await registerUser(formData);
          if (res.success) {
            const token = res.data.accessToken;
            sessionStorage.setItem("accessToken", token);
            set({
              user: res.data.user,
              accessToken: token,
              isAuthenticated: true,
            });
          }
          return res;
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 Check and refresh token automatically
      checkAuth: async () => {
        const token = get().accessToken;
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        try {
          const res = await getProfile(token);
          if (!res.ok) throw new Error("Unauthorized");

          const data = await res.json();
          if (data.success) {
            set({ user: data.data, isAuthenticated: true });
            return true;
          }
        } catch {
          // 🟢 Try refreshing token using HTTP-only cookie
          const refresh = await refreshAccessToken(); // Calls /api/auth/refresh
          if (refresh.success) {
            const newToken = refresh.data.accessToken;
            sessionStorage.setItem("accessToken", newToken);
            set({ accessToken: newToken, isAuthenticated: true });
            return await get().checkAuth(); // Retry profile
          } else {
            // ❌ Refresh failed → logout
            sessionStorage.removeItem("accessToken");
            set({ user: null, accessToken: null, isAuthenticated: false });
            return false;
          }
        }
      },

      // 🔹 Logout
      logout: async () => {
        try {
          await logoutUser();
        } catch {}
        sessionStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-store",
      getStorage: () => sessionStorage,
    }
  )
);

export default useAuthStore;
