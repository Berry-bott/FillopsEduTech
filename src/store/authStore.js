import { create } from "zustand";
import { login, logout, register, getCurrentUser } from "../api/auth";

const useAuthStore = create((set, get) => ({
  user: null,
  loading: false,
  error: null,

  // Register + Auto-login
  
  register: async (data) => {
    set({ loading: true, error: null });
    try {
      await register(data); // create user + cookie
      const user = await getCurrentUser(); // fetch user details
      set({ user, loading: false });
      return user;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Login
  login: async (credentials) => {
    set({ loading: true, error: null });
    try {
      await login(credentials);
      const user = await getCurrentUser();
      set({ user, loading: false });
      return user;
    } catch (err) {
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // Fetch current user
  fetchUser: async () => {
    try {
      // const user = await getCurrentUser();
      set({ user });
    } catch {
      set({ user: null });
    }
  },

  // Auto-login on reload
  initialize: async () => {
    set({ loading: true });
    try {
      const user = await getCurrentUser();
      set({ user, loading: false });
    } catch {
      set({ user: null, loading: false });
    }
  },

  // Logout
  logout: async () => {
    await logout();
    set({ user: null });
  },
}));

export default useAuthStore;
