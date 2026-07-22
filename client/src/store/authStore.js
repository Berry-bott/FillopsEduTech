import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginUser,
  registerUser,
  getProfile,
  logoutUser,
  updateProfile as apiUpdateProfile,
  uploadAvatar as apiUploadAvatar,
  deleteAvatar as apiDeleteAvatar,
  refreshAccessToken as apiRefreshAccessToken,
  googleLogin as apiGoogleLogin,
} from "../api/auth";

let refreshPromise = null;

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: "",
      success: "",

      verificationPending: false,
      emailToVerify: "",

      clearMessages: () => set({ error: "", success: "" }),

      // 🔹 LOGIN
      login: async (formData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const res = await loginUser(formData);

          if (!res.success) {
            set({ error: res.message });
            return res;
          }

          const { accessToken, user } = res.data;

          set({ user, accessToken, isAuthenticated: true });

          return res;
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 GOOGLE LOGIN
      googleLogin: async (idToken) => {
        set({ loading: true, error: "", success: "" });

        try {
          const res = await apiGoogleLogin(idToken);

          if (!res.success) {
            set({ error: res.message || "Google sign-in failed" });
            return res;
          }

          const { accessToken, user } = res.data;

          set({ user, accessToken, isAuthenticated: true });

          return res;
        } catch (err) {
          const msg = err.message || "Google sign-in failed";
          set({ error: msg });
          return { success: false, message: msg };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 REGISTER
      register: async (formData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const res = await registerUser(formData);

          if (!res.success) {
            set({ error: res.message || "Registration failed" });
            return res;
          }

          set({
            success: "Registration successful! Please verify your email.",
            verificationPending: true,
            emailToVerify: res.data.email,
          });

          return res;
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 REFRESH ACCESS TOKEN
      refreshAccessToken: async () => {
        if (refreshPromise) return refreshPromise;

        refreshPromise = (async () => {
          try {
            const res = await apiRefreshAccessToken();

            if (!res.success) return false;

            const { accessToken, user } = res.data;

            set({
              accessToken,
              user: user || get().user,
              isAuthenticated: true,
            });

            return true;
          } catch (err) {
            console.warn("Refresh failed:", err);
            return false;
          } finally {
            refreshPromise = null;
          }
        })();

        return refreshPromise;
      },

      // 🔹 CHECK AUTH (on app load)
      checkAuth: async () => {
        // First try to refresh — this uses the HTTP-only cookie
        // and works even if the page was hard-reloaded (Zustand persist restores state)
        const refreshed = await get().refreshAccessToken();
        if (refreshed) return true;

        // If refresh failed and we have a stored access token, try profile as fallback
        const token = get().accessToken;
        if (token) {
          const res = await getProfile(token);
          if (res.success) {
            set({ user: res.data, isAuthenticated: true });
            return true;
          }
        }

        set({ user: null, accessToken: null, isAuthenticated: false });
        return false;
      },

      // 🔹 UPDATE PROFILE
      updateProfile: async (profileData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/profile`,
            {
              method: "PUT",
              body: JSON.stringify(profileData),
            }
          );

          if (result.success) {
            const currentUser = get().user;
            set({
              user: currentUser ? { ...currentUser, ...result.data } : result.data,
              success: result.message || "Profile updated successfully",
            });
            return result;
          }

          const errMsg = result.message || "Failed to update profile";
          set({ error: errMsg });
          return { success: false, message: errMsg };
        } catch (err) {
          console.error("❌ Profile update error:", err);
          const errorMessage = err.message || "Network error. Please try again.";
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 UPLOAD AVATAR
      uploadAvatar: async (formData) => {
        set({ loading: true, error: "" });

        try {
          // Multipart upload — need to handle 401 manually since fetchWithAuth forces JSON headers
          let token = get().accessToken;

          const doUpload = (t) =>
            fetch(`${import.meta.env.VITE_BACKEND_URL}/api/users/profile/passport`, {
              method: "POST",
              headers: t ? { Authorization: `Bearer ${t}` } : {},
              credentials: "include",
              body: formData,
            });

          let res = await doUpload(token);

          if (res.status === 401 || res.status === 403) {
            const refreshed = await get().refreshAccessToken();
            if (!refreshed) throw new Error("Session expired");
            token = get().accessToken;
            res = await doUpload(token);
          }

          const result = await res.json();

          if (result.success) {
            const currentUser = get().user;
            if (currentUser) {
              set({
                user: {
                  ...currentUser,
                  passport: result.data.passport || result.data.url,
                },
                success: "Passport uploaded successfully",
              });
            }
          } else {
            set({ error: result.message || "Failed to upload passport" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error uploading avatar:", error);
          const errorMessage = error.message || "Network error. Please check your connection.";
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 DELETE AVATAR
      deleteAvatar: async () => {
        set({ loading: true, error: "" });

        try {
          const result = await get().fetchWithAuth(
            `${import.meta.env.VITE_BACKEND_URL}/api/users/profile/passport`,
            { method: "DELETE" }
          );

          if (result.success) {
            const currentUser = get().user;
            if (currentUser) {
              set({
                user: { ...currentUser, passport: null },
                success: "Passport deleted successfully",
              });
            }
          } else {
            set({ error: result.message || "Failed to delete passport" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error deleting avatar:", error);
          const errorMessage = error.message || "Network error. Please check your connection.";
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 LOGOUT
      logout: async () => {
        try {
          await logoutUser();
        } catch (err) {
          console.error(err);
        } finally {
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
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

        if (res.status === 401 || res.status === 403) {
          const refreshed = await get().refreshAccessToken();
          if (!refreshed) throw new Error("Session expired");

          token = get().accessToken;
          res = await request();
        }

        return res.json();
      },
    }),
    {
      name: "auth-store",
      storage: {
        getItem: (key) => sessionStorage.getItem(key),
        setItem: (key, value) => sessionStorage.setItem(key, value),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;