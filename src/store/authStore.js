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
      error: "",
      success: "",

      // Email verification state
      verificationPending: false,
      emailToVerify: "",

      // Clear previous messages
      clearMessages: () => set({ error: "", success: "" }),

      // 🔹 LOGIN ---------------------------------------------------------
      login: async (formData) => {
        set({ loading: true, error: "", success: "" });
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
          } else {
            set({ error: res.message });
          }

          return res;
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 REGISTER ------------------------------------------------------
      register: async (formData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const res = await registerUser(formData);

          if (!res.success) {
            set({ error: res.message || "Registration failed" });
            return res;
          }

          // Do NOT auto-login user (backend requires email verification)
          set({
            success: "Registration successful! Please verify your email.",
            verificationPending: true,
            emailToVerify: res.data.email, // store email to verify
          });

          return res;
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 CHECK EMAIL VERIFICATION --------------------------------------
      checkEmailVerification: async () => {
        const email = get().emailToVerify;
        if (!email) return false;

        try {
          const response = await fetch(
            `https://fillops-server-5fuf.onrender.com/api/auth/check-verification?email=${email}`
          );
          const res = await response.json();

          if (res.verified) {
            // Email verified
            set({
              verificationPending: false,
              success: "Email verified successfully! You can now login.",
            });

            return true;
          }
        } catch (err) {
          console.error("Error checking verification:", err);
        }

        return false;
      },

      // 🔹 Silent refresh (unchanged) --------------------------------------
      silentRefresh: async () => {
        try {
          const res = await fetch(
            "https://fillops-server-5fuf.onrender.com/api/auth/refresh",
            {
              method: "POST",
              credentials: "include",
            }
          );

          if (res.ok) {
            const data = await res.json();
            const newToken = data.accessToken;

            sessionStorage.setItem("accessToken", newToken);

            set({
              accessToken: newToken,
              isAuthenticated: true,
              user: data.user || get().user,
            });

            return true;
          }
        } catch (err) {
          console.warn("Silent refresh failed:", err);
        }
        return false;
      },

      // 🔹 CHECK AUTH -----------------------------------------------------
      checkAuth: async () => {
        const token = get().accessToken;

        // Try access token
        if (token) {
          try {
            const data = await getProfile(token);

            if (data.success) {
              set({
                user: data.data,
                isAuthenticated: true,
              });
              return true;
            }
          } catch (err) {
            console.warn("Access token invalid:", err);
          }
        }

        // Try silent refresh
        const refreshed = await get().silentRefresh();
        if (refreshed) return true;

        // Clear session
        sessionStorage.removeItem("accessToken");
        set({ user: null, accessToken: null, isAuthenticated: false });
        return false;
      },

      // 🔹 LOGOUT ---------------------------------------------------------
      logout: async () => {
        try {
          await logoutUser();
        } catch (err) {
          console.error("Logout error:", err);
        } finally {
          sessionStorage.removeItem("accessToken");
          set({ user: null, accessToken: null, isAuthenticated: false });
        }
      },
    }),

    {
      name: "auth-store",
      getStorage: () => sessionStorage,
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
