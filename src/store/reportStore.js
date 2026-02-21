// src/store/financialReportStore.js
import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

const useReportStore = create((set, get) => ({
  // ── State ────────────────────────────────────────────────────
  summary: null,          // { totalSpent, totalFailed, activeSubscriptions }
  subscriptions: [],      // [{ subject, plan, startDate, expiryDate, status }]
  paymentHistory: [],     // [{ date, amount, currency, status, reference, method, items }]
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
        const { summary, subscriptions, paymentHistory } = result.data;
        set({ summary, subscriptions, paymentHistory });
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