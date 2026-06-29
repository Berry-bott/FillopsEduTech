// src/store/reportStore.js
import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

const useReportStore = create((set) => ({
  // ── State ────────────────────────────────────────────────────
  summary: null,
  subscriptionsByCategory: {},  // { JAMB: [...], WAEC: [...], ... }
  paymentHistory: [],
  loading: false,
  error: "",

  // ── Helpers ──────────────────────────────────────────────────
  clearError: () => set({ error: "" }),

  // ── FETCH FINANCIAL REPORT ───────────────────────────────────
  fetchFinancialReport: async () => {
    set({ loading: true, error: "" });

    try {
      const result = await useAuthStore.getState().fetchWithAuth(
        `${API_BASE}/users/reports/financial`
      );

      if (result.success) {
        const { summary, subscriptionsByCategory, paymentHistory } = result.data;
        set({
          summary,
          subscriptionsByCategory: subscriptionsByCategory ?? {},
          paymentHistory: paymentHistory ?? [],
        });
      } else {
        set({ error: result.message || "Failed to load financial report" });
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
}));

export default useReportStore;