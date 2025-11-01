import { create } from "zustand";
import { login as apiLogin, register as apiRegister, logout as apiLogout } from "../api/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // Register
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await apiRegister(data);
      set({ loading: false });
      return res; // ✅ Return backend response
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await apiLogin(credentials);
      set({ user: res.data, loading: false });
      return res; // ✅ Return backend response
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Logout
  logout: async () => {
    await apiLogout();
    set({ user: null });
  },
}));

export default useAuthStore;



















// import { create } from "zustand";
// import { login, logout, register } from "../api/auth";

// const useAuthStore = create((set, get) => ({
//   user: null,
//   loading: false,
//   error: null,

//   // Register + Auto-login
  
//   register: async (data) => {
//     set({ loading: true, error: null });
//     try {
//       await register(data); // create user + cookie
//       // const user = await getCurrentUser(); // fetch user details
//       set({ user, loading: false });
//       return user;
//     } catch (err) {
//       set({ loading: false, error: err.message });
//       throw err;
//     }
//   },

//   // Login
//   login: async (credentials) => {
//     set({ loading: true, error: null });
//     try {
//       await login(credentials);
//       const user = await getCurrentUser();
//       set({ user, loading: false });
//       return user;
//     } catch (err) {
//       set({ loading: false, error: err.message });
//       throw err;
//     }
//   },

//   // Fetch current user
//   fetchUser: async (credentials) => {
//     try {
//       const user = await getCurrentUser();
//       set({ user });
//     } catch {
//       set({ user: null });
//     }
//   },

//   // Auto-login on reload
//   // initialize: async (credentials) => {
//   //   set({ loading: true });
//   //   try {
//   //     const user = await getCurrentUser();
//   //     set({ user, loading: false });
//   //   } catch {
//   //     set({ user: null, loading: false });
//   //   }
//   // },

//   // Logout
//   logout: async (credentials) => {
//     await logout();
//     set({ user: null });
//   },
// }));

// export default useAuthStore;
