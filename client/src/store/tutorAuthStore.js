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
   
  
  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;
  
  let refreshPromise = null;

  // Helper: decode JWT payload
  const getJwtPayload = (token) => {
    try {
      const payload = token.split(".")[1];
      if (!payload) return null;
      const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
      const padded = normalized.padEnd(
        normalized.length + ((4 - (normalized.length % 4)) % 4),
        "="
      );
      return JSON.parse(atob(padded));
    } catch {
      return null;
    }
  };

  // Helper: check if token is within 30 seconds of expiring
  const isAccessTokenExpired = (token) => {
    const payload = getJwtPayload(token);
    if (!payload?.exp) return false;
    const expiryBufferMs = 30 * 1000;
    return Date.now() >= payload.exp * 1000 - expiryBufferMs;
  };

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
        if (refreshPromise) return refreshPromise;
      
        refreshPromise = (async () => {
          try {
            const res = await apiRefreshAccessToken();
          
            if (!res.success) {
              refreshPromise = null;
              return false;
            }
          
            const { accessToken, tutor } = res.data;
          
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
            refreshPromise = null; 
          }
        })();
      
        return refreshPromise;
      },

      // 🔹 PROACTIVE REFRESH (checks JWT expiry before request)
      ensureFreshToken: async () => {
        const { accessToken } = get();
        if (!accessToken) return false;
      
        if (isAccessTokenExpired(accessToken)) {
          console.log("🕐 Token expiring soon → refreshing proactively");
          const refreshed = await get().refreshAccessToken();
          if (!refreshed) {
            console.warn("❌ Proactive refresh failed");
          }
          return refreshed;
        }
      
        return true;
      },

     
      checkTutorAuth: async () => {
  // 🔹 STEP 1: Get token from state (no sessionStorage fallback)
  let token = get().accessToken;

  if (token) {
    try {
      const res = await getProfile();
      
      if (res.success) {
        set({ 
          tutor: res.data, 
          isAuthenticated: true, 
          accessToken: token 
        });
        console.log("✅ Auth check successful with existing token");
        return true;
      }
    } catch (err) {
      console.warn("⚠️ Profile fetch failed, will try refresh:", err);
    }
  }

  // 🔹 STEP 2: Token invalid/missing, try refresh
  console.log("🔄 Attempting token refresh...");
  const refreshed = await get().refreshAccessToken();
  
  if (refreshed) {
    try {
      const res = await getProfile();
      
      if (res.success) {
        set({ 
          tutor: res.data, 
          isAuthenticated: true 
        });
        console.log("✅ Auth check successful after refresh");
        return true;
      }
    } catch (err) {
      console.warn("⚠️ Profile fetch failed after refresh:", err);
    }
  }

  // 🔹 STEP 3: Everything failed - clear auth
  console.log("❌ Auth check failed - logging out");
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


      uploadAvatar: async (formData) => {
        set({ loading: true, error: "" });

        try {
          let token = get().accessToken;

          const doUpload = (t) =>
            fetch(`${API_BASE}/tutor/profile/avatar`, {
              method: "POST",
              headers: t ? { Authorization: `Bearer ${t}` } : {},
              credentials: "include",
              body: formData,
            });

          let response = await doUpload(token);

          if (response.status === 401 || response.status === 403) {
            const refreshed = await get().refreshAccessToken();
            if (!refreshed) throw new Error("Session expired");
            token = get().accessToken;
            response = await doUpload(token);
          }

          const result = await response.json();

          console.log("📥 Avatar upload response:", result);

          if (result.success) {
            console.log("✅ Avatar uploaded:", result.data);
            
            // Update tutor data in store
            const currentTutor = get().tutor;
            if (currentTutor) {
              set({
                tutor: {
                  ...currentTutor,
                  avatar: result.data.avatar || result.data.avatarUrl || result.data.url
                }
              });
            }
            
            set({ success: "Avatar uploaded successfully" });
          } else {
            set({ error: result.message || "Failed to upload avatar" });
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
          let token = get().accessToken;

          const doDelete = (t) =>
            fetch(`${API_BASE}/tutor/profile/avatar`, {
              method: "DELETE",
              headers: {
                ...(t ? { Authorization: `Bearer ${t}` } : {}),
                "Content-Type": "application/json",
              },
              credentials: "include",
            });

          let response = await doDelete(token);

          if (response.status === 401 || response.status === 403) {
            const refreshed = await get().refreshAccessToken();
            if (!refreshed) throw new Error("Session expired");
            token = get().accessToken;
            response = await doDelete(token);
          }

          const result = await response.json();

          console.log("📥 Avatar delete response:", result);

          if (result.success) {
            console.log("✅ Avatar deleted");
            
            // Update tutor data in store
            const currentTutor = get().tutor;
            if (currentTutor) {
              set({
                tutor: {
                  ...currentTutor,
                  avatar: null
                }
              });
            }
            
            set({ success: "Avatar deleted successfully" });
          } else {
            set({ error: result.message || "Failed to delete avatar" });
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

      // 🔹 ADD SET TUTOR METHOD (if not already present)
      setTutor: (tutorData) => {
        set({ tutor: tutorData });
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

        // 🔹 Proactively refresh if token is about to expire
        await get().ensureFreshToken();
        token = get().accessToken;

        let res = await request();

        // 🔹 If 401 or 403, try to refresh and retry
        if (res.status === 401 || res.status === 403) {
          console.log(`🔄 Got ${res.status}, attempting refresh...`);
          
          const refreshed = await get().refreshAccessToken();
          
          if (!refreshed) {
            console.error("❌ Refresh failed - session expired");
            
            // Clear auth state
            set({ tutor: null, accessToken: null, isAuthenticated: false });
            
            throw new Error("Session expired");
          }

          // Get the new token and retry
          token = get().accessToken;
          console.log("✅ Token refreshed, retrying request...");
          res = await request();
        }

        return res.json();
      },
      }),
      {
        name: "tutor-auth-store",
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