

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
  // 🔹 STEP 1: Get token from session storage OR state
  let token = sessionStorage.getItem("accessToken") || get().accessToken;

  if (token) {
    // Update state with token from sessionStorage
    set({ accessToken: token });
    
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
  sessionStorage.removeItem("accessToken");
  set({ tutor: null, accessToken: null, isAuthenticated: false });
  return false;
      },

    // checkTutorAuth: async () => {
    //   let token = get().accessToken || sessionStorage.getItem("accessToken");

    //   if (token) {
    //     try {
    //       const res = await getProfile(token);
    //       if (res.success) {
    //         set({ tutor: res.data, isAuthenticated: true, accessToken: token });
    //         return true;
    //       }
    //     } catch {}
    //   }

    //   const refreshed = await get().refreshAccessToken();
    //   console.log("🔄 Refresh result:", refreshed);
    //   if (refreshed) return true;

    //   sessionStorage.removeItem("accessToken");
    //   set({ tutor: null, accessToken: null, isAuthenticated: false });
    //   return false;
    // },


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

      // 🔹 UPLOAD AVATAR
      uploadAvatar: async (formData) => {
        const token = get().accessToken; // ✅ Direct access to state
        
        if (!token) {
          return { success: false, message: "Not authenticated" };
        }

        set({ loading: true, error: "" });

        try {
          const response = await fetch(`${API_BASE}/tutor/profile/avatar`, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              // Don't set Content-Type - let browser set it with boundary
            },
            credentials: "include",
            body: formData,
          });

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
        const token = get().accessToken; // ✅ Direct access to state
        
        if (!token) {
          return { success: false, message: "Not authenticated" };
        }

        set({ loading: true, error: "" });

        try {
          const response = await fetch(`${API_BASE}/tutor/profile/avatar`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

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

        // 🔹 If 401, try to refresh and retry
        if (res.status === 401) {
          console.log("🔄 Got 401, attempting refresh...");
          
          const refreshed = await get().refreshAccessToken();
          
          if (!refreshed) {
            console.error("❌ Refresh failed - session expired");
            
            // Clear auth state
            sessionStorage.removeItem("accessToken");
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
      // fetchWithAuth: async (url, options = {}) => {
      //   let token = get().accessToken;
      
      //   const request = () =>
      //     fetch(url, {
      //       ...options,
      //       headers: {
      //         "Content-Type": "application/json",
      //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
      //         ...options.headers,
      //       },
      //       credentials: "include",
      //     });
      
      //   let res = await request();
      
      //   if (res.status === 401) {
      //     const refreshed = await get().refreshAccessToken();
      //     if (!refreshed) throw new Error("Session expired");
      
      //     token = get().accessToken;
      //     res = await request(); // ✅ retry AFTER refresh
      //   }
      
      //   return res.json();
      // },      
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