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

//             // 🔹 UPLOAD AVATAR
//     uploadAvatar: async (formData) => {
//       const token = get().accessToken; 
      
//       if (!token) {
//         return { success: false, message: "Not authenticated" };
//       }

//       set({ loading: true, error: "" });

//       try {
//         const response = await fetch(`${API_BASE}/users/profile/passport`, {
//           method: "POST",
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//           body: formData,
//         });

//         const result = await response.json();

//         console.log("📥 Avatar upload response:", result);

//       if (result.success) {
//         const currentUser = get().user;
//         if (currentUser) {
//           set({
//             user: {
//               ...currentUser,
//               passport: result.data.passportPhotoUrl,   
              
//             },
//           });
//         }

//         set({ success: "Passport uploaded successfully" });
//       }

//         return result;
//       } catch (error) {
//         console.error("❌ Error uploading avatar:", error);
//         const errorMessage = error.message || "Network error. Please check your connection.";
//         set({ error: errorMessage });
//         return { success: false, message: errorMessage };
//       } finally {
//         set({ loading: false });
//       }
//     },

//     // 🔹 DELETE AVATAR
//     deleteAvatar: async () => {
//       const token = get().accessToken; 
      
//       if (!token) {
//         return { success: false, message: "Not authenticated" };
//       }

//       set({ loading: true, error: "" });

//       try {
//         const response = await fetch(`${API_BASE}/users/profile/passport`, {
//           method: "DELETE",
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//           credentials: "include",
//         });

//         const result = await response.json();

//         console.log("📥 Avatar delete response:", result);

//         if (result.success) {
//           const currentUser = get().user; 
//           if (currentUser) {
//             set({
//               user: {
//                 ...currentUser,
//                 passport: null, 
//               },
//             });
//           }

//           set({ success: "Passport deleted successfully" });
//         } else {
//           set({ error: result.message || "Failed to delete passport" });
//         }


//         return result;
//       } catch (error) {
//         console.error("❌ Error deleting avatar:", error);
//         const errorMessage = error.message || "Network error. Please check your connection.";
//         set({ error: errorMessage });
//         return { success: false, message: errorMessage };
//       } finally {
//         set({ loading: false });
//       }
//     },

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










// // src/store/authStore.js
// import { create } from "zustand";
// import { persist, createJSONStorage } from "zustand/middleware";
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
//       // ── Core state ───────────────────────────────────────────────
//       user: null,
//       accessToken: null,
//       isAuthenticated: false,
//       isCheckingAuth: true,       // starts as true → UI can show loader
//       loading: false,
//       error: "",
//       success: "",

//       verificationPending: false,
//       emailToVerify: "",

//       // ── Helpers ──────────────────────────────────────────────────
//       clearMessages: () => set({ error: "", success: "" }),

//       // ── LOGIN ────────────────────────────────────────────────────
//       login: async (formData) => {
//         set({ loading: true, error: "", success: "" });
//         try {
//           const res = await loginUser(formData);
//           if (!res.success) {
//             set({ error: res.message || "Login failed" });
//             return res;
//           }

//           const { accessToken, user } = res.data;
//           sessionStorage.setItem("accessToken", accessToken);

//           set({
//             user,
//             accessToken,
//             isAuthenticated: true,
//             isCheckingAuth: false,
//           });

//           return res;
//         } catch (err) {
//           set({ error: err.message || "Network error during login" });
//           return { success: false, message: err.message };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // ── REGISTER ─────────────────────────────────────────────────
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

//       // ── REFRESH TOKEN ────────────────────────────────────────────
//       refreshAccessToken: async () => {
//         if (refreshPromise) return refreshPromise;

//         refreshPromise = (async () => {
//           try {
//             const res = await apiRefreshAccessToken();
//             if (!res.success) return false;

//             const { accessToken, user } = res.data;
//             sessionStorage.setItem("accessToken", accessToken);

//             set({
//               accessToken,
//               user: user || get().user,
//               isAuthenticated: true,
//             });

//             return true;
//           } catch (err) {
//             console.warn("Token refresh failed:", err);
//             return false;
//           } finally {
//             refreshPromise = null;
//           }
//         })();

//         return refreshPromise;
//       },

//       // ── CHECK AUTH (called once on app start / after login) ──────
//       checkAuth: async () => {
//         const state = get();

//         // Already checked and authenticated → skip
//         if (!state.isCheckingAuth && state.isAuthenticated && state.user) {
//           return true;
//         }

//         set({ isCheckingAuth: true });

//         try {
//           if (state.accessToken) {
//             const res = await getProfile(state.accessToken);

//             if (res.success) {
//               // Preserve photo URL even if server returns null/missing
//               const preservedPhoto =
//                 res.data.passportPhotoUrl ||
//                 state.user?.passportPhotoUrl ||
//                 state.user?.passport;

//               set({
//                 user: {
//                   ...state.user,           // client-side fields
//                   ...res.data,             // server fields win
//                   passportPhotoUrl: preservedPhoto, // explicit photo field
//                 },
//                 isAuthenticated: true,
//               });

//               return true;
//             }
//           }

//           // Try refresh if profile failed
//           const refreshed = await get().refreshAccessToken();
//           if (refreshed) return true;
//         } catch (err) {
//           console.warn("checkAuth error:", err);
//         } finally {
//           set({ isCheckingAuth: false });
//         }

//         // Final fallback: logged out
//         sessionStorage.removeItem("accessToken");
//         set({
//           user: null,
//           accessToken: null,
//           isAuthenticated: false,
//           isCheckingAuth: false,
//         });

//         return false;
//       },

//       // ── UPLOAD PASSPORT ──────────────────────────────────────────
//       uploadAvatar: async (formData) => {
//         const token = get().accessToken;
//         if (!token) return { success: false, message: "Not authenticated" };

//         set({ loading: true, error: "" });

//         try {
//           const response = await fetch(`${API_BASE}/users/profile/passport`, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//             credentials: "include",
//             body: formData,
//           });

//           const result = await response.json();

//           if (result.success) {
//             const currentUser = get().user;
//             set({
//               user: {
//                 ...currentUser,
//                 passportPhotoUrl: result.data.passportPhotoUrl,
//               },
//               success: result.message || "Passport uploaded successfully",
//             });
//           } else {
//             set({ error: result.message || "Upload failed" });
//           }

//           return result;
//         } catch (error) {
//           const msg = error.message || "Network error";
//           set({ error: msg });
//           return { success: false, message: msg };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // ── DELETE PASSPORT ──────────────────────────────────────────
//       deleteAvatar: async () => {
//         const token = get().accessToken;
//         if (!token) return { success: false, message: "Not authenticated" };

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

//           if (result.success) {
//             const currentUser = get().user;
//             set({
//               user: { ...currentUser, passportPhotoUrl: null },
//               success: "Passport removed successfully",
//             });
//           } else {
//             set({ error: result.message || "Delete failed" });
//           }

//           return result;
//         } catch (error) {
//           const msg = error.message || "Network error";
//           set({ error: msg });
//           return { success: false, message: msg };
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // ── LOGOUT ───────────────────────────────────────────────────
//       logout: async () => {
//         try {
//           await logoutUser();
//         } catch (err) {
//           console.error("Logout failed:", err);
//         } finally {
//           sessionStorage.removeItem("accessToken");
//           set({
//             user: null,
//             accessToken: null,
//             isAuthenticated: false,
//             isCheckingAuth: false,
//           });
//         }
//       },

//       // ── AUTHENTICATED FETCH HELPER ───────────────────────────────
//       fetchWithAuth: async (url, options = {}) => {
//         let token = get().accessToken;

//         const doFetch = () =>
//           fetch(url, {
//             ...options,
//             headers: {
//               "Content-Type": "application/json",
//               ...(token && { Authorization: `Bearer ${token}` }),
//               ...options.headers,
//             },
//             credentials: "include",
//           });

//         let res = await doFetch();

//         if (res.status === 401) {
//           const ok = await get().refreshAccessToken();
//           if (!ok) throw new Error("Session expired");

//           token = get().accessToken;
//           res = await doFetch();
//         }

//         return res.json();
//       },
//     }),

//     {
//       name: "auth-store",
//       storage: createJSONStorage(() => sessionStorage),
//       partialize: (state) => ({
//         user: state.user,
//         accessToken: state.accessToken,
//         isAuthenticated: state.isAuthenticated,
//         // passportPhotoUrl is inside user → automatically persisted
//       }),
//       // version: 1, // optional: increment when you change shape
//     }
//   )
// );

// export default useAuthStore;







// src/store/authStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import {
  loginUser,
  registerUser,
  getProfile,
  logoutUser,
  refreshAccessToken as apiRefreshAccessToken,
} from "../api/auth";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

let refreshPromise = null;

const useAuthStore = create(
  persist(
    (set, get) => ({
      // ── Core state ───────────────────────────────────────────────
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isCheckingAuth: true,
      loading: false,
      error: "",
      success: "",

      verificationPending: false,
      emailToVerify: "",

      // ── Helpers ──────────────────────────────────────────────────
      clearMessages: () => set({ error: "", success: "" }),

      // ── LOGIN ────────────────────────────────────────────────────
      login: async (formData) => {
        set({ loading: true, error: "", success: "" });
        try {
          const res = await loginUser(formData);
          if (!res.success) {
            set({ error: res.message || "Login failed" });
            return res;
          }

          const { accessToken, user } = res.data;
          sessionStorage.setItem("accessToken", accessToken);

          set({
            user,
            accessToken,
            isAuthenticated: true,
            isCheckingAuth: false,
          });

          return res;
        } catch (err) {
          set({ error: err.message || "Network error during login" });
          return { success: false, message: err.message };
        } finally {
          set({ loading: false });
        }
      },

      // ── REGISTER ─────────────────────────────────────────────────
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

      // ── REFRESH TOKEN ────────────────────────────────────────────
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
            console.warn("Token refresh failed:", err);
            return false;
          } finally {
            refreshPromise = null;
          }
        })();

        return refreshPromise;
      },

      // ── CHECK AUTH ───────────────────────────────────────────────
      checkAuth: async () => {
        const state = get();

        if (!state.isCheckingAuth && state.isAuthenticated && state.user) {
          return true;
        }

        set({ isCheckingAuth: true });

        try {
          if (state.accessToken) {
            const res = await getProfile(state.accessToken);

            if (res.success) {
              const preservedPhoto =
                res.data.passportPhotoUrl ||
                state.user?.passportPhotoUrl ||
                state.user?.passport;

              set({
                user: {
                  ...state.user,
                  ...res.data,
                  passportPhotoUrl: preservedPhoto,
                },
                isAuthenticated: true,
              });

              return true;
            }
          }

          const refreshed = await get().refreshAccessToken();
          if (refreshed) return true;
        } catch (err) {
          console.warn("checkAuth error:", err);
        } finally {
          set({ isCheckingAuth: false });
        }

        sessionStorage.removeItem("accessToken");
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isCheckingAuth: false,
        });

        return false;
      },

      // ── UPDATE PROFILE ───────────────────────────────────────────
      updateProfile: async (profileData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/users/profile`, {
            method: "PUT",
            body: JSON.stringify(profileData),
          });

          if (result.success) {
            const currentUser = get().user;
            set({
              user: {
                ...currentUser,
                ...(result.data || profileData), // merge server response or optimistic
              },
              success: result.message || "Profile updated successfully",
            });
          } else {
            set({ error: result.message || "Update failed" });
          }

          return result;
        } catch (err) {
          const msg = err.message || "Network error";
          set({ error: msg });
          return { success: false, message: msg };
        } finally {
          set({ loading: false });
        }
      },

      // ── UPLOAD PASSPORT ──────────────────────────────────────────
      uploadAvatar: async (formData) => {
        const token = get().accessToken;
        if (!token) return { success: false, message: "Not authenticated" };

        set({ loading: true, error: "" });

        try {
          const response = await fetch(`${API_BASE}/users/profile/passport`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include",
            body: formData,
          });

          const result = await response.json();

          if (result.success) {
            const currentUser = get().user;
            set({
              user: {
                ...currentUser,
                passportPhotoUrl: result.data.passportPhotoUrl,
              },
              success: result.message || "Passport uploaded successfully",
            });
          } else {
            set({ error: result.message || "Upload failed" });
          }

          return result;
        } catch (error) {
          const msg = error.message || "Network error";
          set({ error: msg });
          return { success: false, message: msg };
        } finally {
          set({ loading: false });
        }
      },

      // ── DELETE PASSPORT ──────────────────────────────────────────
      deleteAvatar: async () => {
        const token = get().accessToken;
        if (!token) return { success: false, message: "Not authenticated" };

        set({ loading: true, error: "" });

        try {
          const response = await fetch(`${API_BASE}/users/profile/passport`, {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            credentials: "include",
          });

          const result = await response.json();

          if (result.success) {
            const currentUser = get().user;
            set({
              user: { ...currentUser, passportPhotoUrl: null },
              success: "Passport removed successfully",
            });
          } else {
            set({ error: result.message || "Delete failed" });
          }

          return result;
        } catch (error) {
          const msg = error.message || "Network error";
          set({ error: msg });
          return { success: false, message: msg };
        } finally {
          set({ loading: false });
        }
      },

      // ── LOGOUT ───────────────────────────────────────────────────
      logout: async () => {
        try {
          await logoutUser();
        } catch (err) {
          console.error("Logout failed:", err);
        } finally {
          sessionStorage.removeItem("accessToken");
          set({
            user: null,
            accessToken: null,
            isAuthenticated: false,
            isCheckingAuth: false,
          });
        }
      },

      // ── AUTHENTICATED FETCH HELPER ───────────────────────────────
      fetchWithAuth: async (url, options = {}) => {
        let token = get().accessToken;

        const doFetch = () =>
          fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
              ...options.headers,
            },
            credentials: "include",
          });

        let res = await doFetch();

        if (res.status === 401) {
          const ok = await get().refreshAccessToken();
          if (!ok) throw new Error("Session expired");

          token = get().accessToken;
          res = await doFetch();
        }

        return res.json();
      },
    }),

    {
      name: "auth-store",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;