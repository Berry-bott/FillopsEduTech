

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
    tutorLogin,
    getProfile,
    updateProfile, 
    changePassword,
    tutorLogout,
    refreshAccessToken as apiRefreshAccessToken,
  } from "../api/tutorAuth";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

let refreshPromise = null;

const useTutorAuthStore = create(
  persist(
    (set, get) => ({
      // 🔐 STATE
      tutor: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: "",
      success: "",

      verificationPending: false,
      emailToVerify: "",

      clearMessages: () => set({ error: "", success: "" }),
        
      // 🔹 LOGIN (Student/Default)
      login: async (formData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const res = await tutorLogin(formData);

          if (!res.success) {
            set({ error: res.message });
            return res;
          }

          const { accessToken, tutor } = res.data;

          sessionStorage.setItem("accessToken", accessToken);
          console.log("🍪 All cookies after login:", document.cookie);
          console.log("📦 Login response:", res);

          set({
            tutor,
            accessToken,
            isAuthenticated: true,
          });

          return res;
        } finally {
          set({ loading: false });
        }
      },


      // 🔹 REFRESH ACCESS TOKEN
      refreshAccessToken: async () => {
        // 👇 if refresh already running, wait for it
        if (refreshPromise) {
          return refreshPromise;
        }
      
        refreshPromise = (async () => {
          try {
            const res = await apiRefreshAccessToken();
      
            if (!res.success) {
              refreshPromise = null;
              return false;
            }
      
            const { accessToken, tutor } = res.data;
      
            sessionStorage.setItem("accessToken", accessToken);
      
            set({
              accessToken,
              tutor: tutor || get().tutor,
              isAuthenticated: true,
            });
      
            return true;
          } catch (err) {
            console.warn("Refresh failed:", err);
            return false;
          } finally {
            refreshPromise = null; // 🔓 unlock
          }
        })();
      
        return refreshPromise;
      },

      // 🔹 CHECK AUTH (on app load)
      checkTutorAuth: async () => {
        const token = get().accessToken;

        // Try existing access token
        if (token) {
          const res = await getProfile(token);

          if (res.success) {
            set({ tutor: res.data, isAuthenticated: true });
            return true;
          }
        }

        // Try refresh
        const refreshed = await get().refreshAccessToken();
        console.log("🔄 Refresh result:", refreshed);
        if (refreshed) return true;

        // Logout fallback
        sessionStorage.removeItem("accessToken");
        set({ tutor: null, accessToken: null, isAuthenticated: false });
        return false;
      },

      // 🔹 UPDATE PROFILE
updateProfile: async (profileData) => {
    const token = get().accessToken;
    
    if (!token) {
      set({ error: "Not authenticated" });
      return { success: false, message: "Not authenticated" };
    }
  
    set({ loading: true, error: "", success: "" });
  
    try {
      const res = await updateProfile(token, profileData);
  
      if (!res.success) {
        set({ error: res.message || "Failed to update profile" });
        return res;
      }
  
      // Update tutor data in store
      set({
        tutor: res.data,
        success: "Profile updated successfully",
      });
  
      console.log("✅ Profile updated:", res.data);
      return res;
    } catch (error) {
      console.error("❌ Error updating profile:", error);
      const errorMessage = "Network error. Please check your connection.";
      set({ error: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      set({ loading: false });
    }
  },
  
  // 🔹 CHANGE PASSWORD
  changePassword: async (passwordData) => {
    const token = get().accessToken;
    
    if (!token) {
      set({ error: "Not authenticated" });
      return { success: false, message: "Not authenticated" };
    }
  
    // Validate passwords match
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      set({ error: "New passwords do not match" });
      return { success: false, message: "New passwords do not match" };
    }
  
    set({ loading: true, error: "", success: "" });
  
    try {
      const res = await changePassword(token, passwordData);
  
      if (!res.success) {
        set({ error: res.message || "Failed to change password" });
        return res;
      }
  
      set({ success: "Password changed successfully" });
  
      console.log("✅ Password changed successfully");
      return res;
    } catch (error) {
      console.error("❌ Error changing password:", error);
      const errorMessage = "Network error. Please check your connection.";
      set({ error: errorMessage });
      return { success: false, message: errorMessage };
    } finally {
      set({ loading: false });
    }
  },

      // 🔹 LOGOUT
      logout: async () => {
        try {
          await tutorLogout();
        } catch (err) {
          console.error(err);
        } finally {
          sessionStorage.removeItem("accessToken");
          set({ tutor: null, accessToken: null, isAuthenticated: false });
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
      
        if (res.status === 401) {
          const refreshed = await get().refreshAccessToken();
          if (!refreshed) throw new Error("Session expired");
      
          token = get().accessToken;
          res = await request(); // ✅ retry AFTER refresh
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
        tutor: state.tutor,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useTutorAuthStore;