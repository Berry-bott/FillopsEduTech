// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import {
//   loginUser,
//   registerUser,
//   getProfile,
//   logoutUser,
//   refreshAccessToken as apiRefreshAccessToken,
// } from "../api/auth";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// let refreshPromise = null;

// const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,
//       accessToken: null,
//       isAuthenticated: false,
//       loading: false,
//       error: "",
//       success: "",
      
//       verificationPending: false,
//       emailToVerify: "",

//       clearMessages: () => set({ error: "", success: "" }),
        
//       // 🔹 LOGIN (Student/Default)
//       login: async (formData) => {
//         set({ loading: true, error: "", success: "" });

//         try {
//           const res = await loginUser(formData);

//           if (!res.success) {
//             set({ error: res.message });
//             return res;
//           }

//           const { accessToken, user } = res.data;

//           sessionStorage.setItem("accessToken", accessToken);
//           console.log("🍪 All cookies after login:", document.cookie);
//           console.log("📦 Login response:", res);

//           set({
//             user,
//             accessToken,
//             isAuthenticated: true,
//           });

//           return res;
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // 🔹 REGISTER
//       register: async (formData) => {
//         set({ loading: true, error: "", success: "" });

//         try {
//           const res = await registerUser(formData);

//           if (!res.success) {
//             set({ error: res.message || "Registration failed" });
//             return res;
//           }

//           set({
//             success: "Registration successful! Please verify your email.",
//             verificationPending: true,
//             emailToVerify: res.data.email,
//           });

//           return res;
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // 🔹 REFRESH ACCESS TOKEN
//       refreshAccessToken: async () => {
//         // 👇 if refresh already running, wait for it
//         if (refreshPromise) {
//           return refreshPromise;
//         }
      
//         refreshPromise = (async () => {
//           try {
//             const res = await apiRefreshAccessToken();
      
//             if (!res.success) {
//               refreshPromise = null;
//               return false;
//             }
      
//             const { accessToken, user } = res.data;
      
//             sessionStorage.setItem("accessToken", accessToken);
      
//             set({
//               accessToken,
//               user: user || get().user,
//               isAuthenticated: true,
//             });
      
//             return true;
//           } catch (err) {
//             console.warn("Refresh failed:", err);
//             return false;
//           } finally {
//             refreshPromise = null; // 🔓 unlock
//           }
//         })();
      
//         return refreshPromise;
//       },

//       // 🔹 CHECK AUTH (on app load)
//       checkAuth: async () => {
//         const token = get().accessToken;

//         // Try existing access token
//         if (token) {
//           const res = await getProfile(token);

//           if (res.success) {
//             set({ user: res.data, isAuthenticated: true });
//             return true;
//           }
//         }

//         // Try refresh
//         const refreshed = await get().refreshAccessToken();
//         console.log("🔄 Refresh result:", refreshed);
//         if (refreshed) return true;

//         // Logout fallback
//         sessionStorage.removeItem("accessToken");
//         set({ user: null, accessToken: null, isAuthenticated: false });
//         return false;
//       },

//         // 🔹 UPDATE PROFILE (text fields)
//       updateProfile: async (profileData) => {
//         const token = get().accessToken;

//         if (!token) {
//           set({ error: "Not authenticated" });
//           return { success: false, message: "Not authenticated" };
//         }

//         set({ loading: true, error: "", success: "" });

//         try {
//           const response = await fetch(`${API_BASE}/users/profile`, {
//             method: "PUT",                     // or PATCH — match your backend
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${token}`,
//             },
//             credentials: "include",
//             body: JSON.stringify(profileData),
//           });

//           const result = await response.json();

//           console.log("📥 Profile update response:", result);

//           if (result.success) {
//             // Merge updated fields into existing user object
//             const currentUser = get().user;
//             if (currentUser) {
//               set({
//                 user: {
//                   ...currentUser,
//                   ...result.data,   // backend should return updated user or changed fields
//                 },
//                 success: result.message || "Profile updated successfully",
//               });
//             } else {
//               // Rare case: user was null → set fully
//               set({ user: result.data });
//             }

//             return result;
//           } else {
//             const errMsg = result.message || "Failed to update profile";
//             set({ error: errMsg });
//             return { success: false, message: errMsg };
//           }
//         } catch (err) {
//           console.error("❌ Profile update error:", err);
//           const errorMessage = err.message || "Network error. Please try again.";
//           set({ error: errorMessage });
//           return { success: false, message: errorMessage };
//         } finally {
//           set({ loading: false });
//         }
//       },

//             // 🔹 UPLOAD AVATAR
//       uploadAvatar: async (formData) => {
//         const token = get().accessToken; 
        
//         if (!token) {
//           return { success: false, message: "Not authenticated" };
//         }

//         set({ loading: true, error: "" });

//         try {
//           const response = await fetch(`${API_BASE}/users/profile/passport`, {
//             method: "POST",
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//             credentials: "include",
//             body: formData,
//           });

//           const result = await response.json();

//           console.log("📥 Avatar upload response:", result);

//         if (result.success) {
//             const currentUser = get().user; // get the current user from state
//             if (currentUser) {
//               set({
//                 user: {
//                   ...currentUser,
//                   passport: result.data.passport || result.data.url, // store passport
//                 },
//               });
//             }

//             set({ success: "Passport uploaded successfully" });
//           } else {
//             set({ error: result.message || "Failed to upload passport" });
//           }


//           return result;
//         } catch (error) {
//           console.error("❌ Error uploading avatar:", error);
//           const errorMessage = error.message || "Network error. Please check your connection.";
//           set({ error: errorMessage });
//           return { success: false, message: errorMessage };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // 🔹 DELETE AVATAR
//       deleteAvatar: async () => { 
//         const token = get().accessToken; 
        
//         if (!token) {
//           return { success: false, message: "Not authenticated" };
//         }

//         set({ loading: true, error: "" });

//         try {
//           const response = await fetch(`${API_BASE}/users/profile/passport`, {
//             method: "DELETE",
//             headers: {
//               Authorization: `Bearer ${token}`,
//               "Content-Type": "application/json",
//             },
//             credentials: "include",
//           });

//           const result = await response.json();

//           console.log("📥 Avatar delete response:", result);

//           if (result.success) {
//             const currentUser = get().user; 
//             if (currentUser) {
//               set({
//                 user: {
//                   ...currentUser,
//                   passport: null, 
//                 },
//               });
//             }

//             set({ success: "Passport deleted successfully" });
//           } else {
//             set({ error: result.message || "Failed to delete passport" });
//           }


//           return result;
//         } catch (error) {
//           console.error("❌ Error deleting avatar:", error);
//           const errorMessage = error.message || "Network error. Please check your connection.";
//           set({ error: errorMessage });
//           return { success: false, message: errorMessage };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // 🔹 LOGOUT
//       logout: async () => {
//         try {
//           await logoutUser();
//         } catch (err) {
//           console.error(err);
//         } finally {
//           sessionStorage.removeItem("accessToken");
//           set({ user: null, accessToken: null, isAuthenticated: false });
//         }
//       },

//       // 🔹 FETCH WITH AUTO REFRESH
//       fetchWithAuth: async (url, options = {}) => {
//         let token = get().accessToken;
      
//         const request = () =>
//           fetch(url, {
//             ...options,
//             headers: {
//               "Content-Type": "application/json",
//               ...(token ? { Authorization: `Bearer ${token}` } : {}),
//               ...options.headers,
//             },
//             credentials: "include",
//           });
      
//         let res = await request();
      
//         if (res.status === 401) {
//           const refreshed = await get().refreshAccessToken();
//           if (!refreshed) throw new Error("Session expired");
      
//           token = get().accessToken;
//           res = await request(); // ✅ retry AFTER refresh
//         }
      
//         return res.json();
//       },      
//     }),
//     {
//       name: "auth-store",
//       storage: {
//         getItem: (key) => sessionStorage.getItem(key),
//         setItem: (key, value) => sessionStorage.setItem(key, value),
//         removeItem: (key) => sessionStorage.removeItem(key),
//       },
//       partialize: (state) => ({
//         user: state.user,
//         accessToken: state.accessToken,
//         isAuthenticated: state.isAuthenticated,
//       }),
//     }
//   )
// );

// export default useAuthStore;










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

          sessionStorage.setItem("accessToken", accessToken);

          set({ user, accessToken, isAuthenticated: true });

          return res;
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

            sessionStorage.setItem("accessToken", accessToken);

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
        const token = get().accessToken;

        if (token) {
          const res = await getProfile(token);
          if (res.success) {
            set({ user: res.data, isAuthenticated: true });
            return true;
          }
        }

        const refreshed = await get().refreshAccessToken();
        if (refreshed) return true;

        sessionStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isAuthenticated: false });
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
          const result = await apiUpdateProfile(token, profileData);

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
        const token = get().accessToken;

        if (!token) return { success: false, message: "Not authenticated" };

        set({ loading: true, error: "" });

        try {
          const result = await apiUploadAvatar(token, formData);

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
        const token = get().accessToken;

        if (!token) return { success: false, message: "Not authenticated" };

        set({ loading: true, error: "" });

        try {
          const result = await apiDeleteAvatar(token);

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
          sessionStorage.removeItem("accessToken");
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