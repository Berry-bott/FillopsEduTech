import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  loginUser,
  registerUser,
  getProfile,
  logoutUser,
  refreshAccessToken as apiRefreshAccessToken,
} from "../api/auth";


let refreshPromise = null;

const useAuthStore = create(
  
  persist(
    (set, get) => ({
      // 🔐 STATE
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

          set({
            user,
            accessToken,
            isAuthenticated: true,
          });

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
            refreshPromise = null; // 🔓 unlock
          }
        })();
      
        return refreshPromise;
      },
      

      // 🔹 CHECK AUTH (on app load)
      checkAuth: async () => {
        const token = get().accessToken;

        // Try existing access token
        if (token) {
          const res = await getProfile(token);

          if (res.success) {
            set({ user: res.data, isAuthenticated: true });
            return true;
          }
        }

        // Try refresh
        const refreshed = await get().refreshAccessToken();
        if (refreshed) return true;

        // Logout fallback
        sessionStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isAuthenticated: false });
        return false;
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
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;





// import { create } from "zustand";
// import { persist } from "zustand/middleware";
// import { loginUser, registerUser, getProfile, logoutUser } from "../api/auth";

// // ✅ Zustand auth store
// const useAuthStore = create(
//   persist(
//     (set, get) => ({
//       user: null,             
//       accessToken: null,      
//       isAuthenticated: false,  
//       loading: false,          

//       // 🔹 Login function
//       login: async (formData) => {
//         set({ loading: true });
//         try {
//           const res = await loginUser(formData); // Call API
//           if (res.success) {
//             const token = res.data.accessToken; // Get access token
//             sessionStorage.setItem("accessToken", token); // Save locally
//             set({
//               user: res.data.user,       // Store user data
//               accessToken: token,        // Store access token
//               isAuthenticated: true,     // Set auth flag
//             });
//           }
//           return res;
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // 🔹 Register function
//       register: async (formData) => {
//         set({ loading: true });
//         try {
//           const res = await registerUser(formData);
//           if (res.success) {
//             const token = res.data.accessToken;
//             sessionStorage.setItem("accessToken", token);
//             set({
//               user: res.data.user || res.data, // Some backends may return user under `data`
//               accessToken: token,
//               isAuthenticated: true,
//             });
//           }
//           return res;
//         } finally {
//           set({ loading: false });
//         }
//       },

//       // 🔹 Silent refresh function
//       silentRefresh: async () => {
//         try {
//           // Send request to refresh endpoint with HttpOnly cookie
//           const res = await fetch("https://fillops-server-5fuf.onrender.com/api/auth/refresh", {
//             method: "POST",
//             credentials: "include", // crucial for sending HTTP-only cookie
//           });

//           if (res.ok) {
//             const data = await res.json();
//             const newToken = data.accessToken;
//             sessionStorage.setItem("accessToken", newToken);
//             set({
//               accessToken: newToken,
//               isAuthenticated: true,
//               user: data.user || get().user, // Update user if returned
//             });
//             return true;
//           }
//         } catch (err) {
//           console.warn("Silent refresh failed:", err);
//         }
//         return false;
//       },

//       // 🔹 Check auth function
//       checkAuth: async () => {
//         const token = get().accessToken;
      
//         // 1️⃣ Try access token first
//         if (token) {
//           try {
//             const data = await getProfile(token); // use existing API function
//             if (data.success) {
//               set({
//                 user: data.data,
//                 isAuthenticated: true,
//               });
//               return true;
//             }
//           } catch (err) {
//             console.warn("Access token profile fetch failed:", err);
//           }
//         }
      
//         // 2️⃣ If failed or no token, attempt silent refresh
//         const refreshed = await get().silentRefresh();
//         if (refreshed) return true;
      
//         // 3️⃣ If both fail, clear auth
//         sessionStorage.removeItem("accessToken");
//         set({ user: null, accessToken: null, isAuthenticated: false });
//         return false;
//       },
      

//       // 🔹 Logout function
//       logout: async () => {
//         try {
//           await logoutUser(); // Call API to clear HttpOnly cookie
//         } catch (err) {
//           console.error("Logout error:", err);
//         } finally {
//           sessionStorage.removeItem("accessToken");
//           set({ user: null, accessToken: null, isAuthenticated: false });
//         }
//       },
//     }),
//     {
//       name: "auth-store",
//       getStorage: () => sessionStorage, // persist access token in sessionStorage
//     }
//   )
// );

// export default useAuthStore;
