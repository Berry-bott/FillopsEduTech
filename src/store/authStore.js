import { create } from "zustand";
import { login, logout, register } from "../api/auth";

const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  // REGISTER
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      const res = await register(data); // backend sets cookie automatically
      set({ user: res.user || null, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // LOGIN
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      const res = await login(credentials); // backend sets cookie automatically
      set({ user: res.user || null, loading: false });
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // LOGOUT
  logout: async () => {
    try {
      await logout(); // backend clears cookie
    } finally {
      set({ user: null });
    }
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
