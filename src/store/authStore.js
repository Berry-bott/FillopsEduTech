import { create } from "zustand";
import { persist } from "zustand/middleware";
import { loginUser, registerUser, getProfile, logoutUser } from "../api/auth";

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
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
              user: res.data,
              accessToken: token,
              isAuthenticated: true,
            });
          }
          return res;
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 Check Auth — silently refreshed by backend via cookie
      checkAuth: async () => {
        const token = get().accessToken;
        if (!token) {
          set({ isAuthenticated: false, user: null });
          return false;
        }

        try {
          const data = await getProfile(token);

          if (data.success) {
            // if backend refreshed token, save new one
            const newToken = data.data.accessToken || token;
            sessionStorage.setItem("accessToken", newToken);
            set({
              user: data.data,
              accessToken: newToken,
              isAuthenticated: true,
            });
            return true;
          } else {
            throw new Error("Invalid token");
          }
        } catch {
          // ❌ Token or cookie expired — logout
          sessionStorage.removeItem("accessToken");
          set({ user: null, accessToken: null, isAuthenticated: false });
          return false;
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
