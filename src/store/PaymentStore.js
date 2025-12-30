// import { create } from "zustand";
// import useAuthStore from "./authStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// export const usePaymentStore = create((set, get) => ({
//   plans: [],
//   history: [],
//   paid: false,
//   expiresAt: null,
//   loading: false,
//   error: null,

//   // ---------------- GET PLANS ----------------
//   fetchPlans: async () => {
//     try {
//       console.log("📥 Fetching plans...");
//       set({ loading: true, error: null });
      
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/payments/plans`);
      
//       console.log("✅ Full API response:", res);
//       console.log("✅ Plans data:", res?.data?.plans);

//       set({
//         plans: res?.data || res,
//         loading: false,
//       });
//     } catch (err) {
//       console.error("❌ Failed to fetch plans:", err);
//       set({ loading: false, error: err.message });
//     }
//   },

//   // ---------------- CHECK STATUS ----------------
//   checkStatus: async () => {
//     try {
//       console.log("📞 Calling payment status endpoint...");
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/payments/status`);

//       console.log("✅ Payment status response:", res);
//       console.log("📊 Status data:", res?.data);

//       const isPaid = !!res?.data?.paid;
//       const expiry = res?.data?.expiresAt || null;

//       console.log("💾 Setting payment state:", { paid: isPaid, expiresAt: expiry });

//       set({
//         paid: isPaid,
//         expiresAt: expiry,
//       });
//     } catch (error) {
//       console.error("❌ Payment status check failed:", error);
//       console.log("Setting to unpaid due to error");
//       set({ paid: false, expiresAt: null });
//     }
//   },

//   // ---------------- INITIALIZE PAYMENT ----------------
//   initializePayment: async ({ plan, subjects, amount }) => {
//     try {
//       console.log("💳 Initializing payment...", { plan, subjects, amount });
//       set({ loading: true, error: null });
      
//       const { fetchWithAuth } = useAuthStore.getState();

//       const res = await fetchWithAuth(
//         `${API_BASE}/payments/initialize`,
//         {
//           method: "POST",
//           body: JSON.stringify({ plan, subjects, amount }),
//         }
//       );

//       console.log("✅ Payment response:", res);

//       // ✅ FIX #2: Check if user already paid
//       if (res.message?.includes('previous payment was successful') || 
//           res.message?.includes('already paid') ||
//           res.data?.alreadyPaid) {
        
//         console.log("✅ User already has active subscription");
//         set({ loading: false });
        
//         return { 
//           alreadyPaid: true, 
//           message: res.message,
//           data: res.data 
//         };
//       }

//       // Handle authorization URL for NEW payments
//       const authUrl = res?.data?.authorizationUrl || res?.authorizationUrl;

//       if (!authUrl) {
//         console.error("❌ No authorization URL in response:", res);
//         throw new Error("No authorization URL received from server");
//       }

//       console.log("🔄 Redirecting to:", authUrl);
//       window.location.href = authUrl;
      
//       return { alreadyPaid: false };
      
//     } catch (err) {
//       console.error("❌ Payment initialization failed:", err);
//       set({ loading: false, error: err.message || "Payment failed" });
//       throw err;
//     }
//   },

//   // ---------------- VERIFY PAYMENT ----------------
//   verifyPayment: async (reference) => {
//     try {
//       set({ loading: true, error: null });
//       const { fetchWithAuth } = useAuthStore.getState();

//       await fetchWithAuth(`${API_BASE}/payments/verify/${reference}`);
//       await get().checkStatus();

//       set({ loading: false });
//     } catch (err) {
//       set({ loading: false, error: err.message });
//       throw err; // ✅ FIX #1: Re-throw error so component can catch it
//     }
//   },

//   // ---------------- HISTORY ----------------
//   fetchHistory: async () => {
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/payments/history`);

//       set({ history: res?.data || [] });
//     } catch (err) {
//       console.error("Failed to fetch history:", err);
//     }
//   },
// }));






import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

export const usePaymentStore = create((set, get) => ({
  plans: [],
  history: [],
  paid: false,
  expiresAt: null,
  loading: false,
  error: null,

  // ---------------- GET PLANS ----------------
  fetchPlans: async () => {
    try {
      console.log("📥 Fetching plans...");
      set({ loading: true, error: null });
      
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/payments/plans`);
      
      console.log("✅ Full API response:", res);
      console.log("✅ Plans data:", res?.data?.plans);

      set({
        plans: res?.data || res,
        loading: false,
      });
    } catch (err) {
      console.error("❌ Failed to fetch plans:", err);
      set({ loading: false, error: err.message });
    }
  },

  // ---------------- CHECK STATUS ----------------
  checkStatus: async () => {
    try {
      console.log("📞 Calling payment status endpoint...");
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/payments/status`);

      console.log("✅ Payment status response:", res);
      console.log("📊 Status data:", res?.data);

      const isPaid = !!res?.data?.paid;
      const expiry = res?.data?.expiresAt || null;

      console.log("💾 Setting payment state:", { paid: isPaid, expiresAt: expiry });

      set({
        paid: isPaid,
        expiresAt: expiry,
      });
    } catch (error) {
      console.error("❌ Payment status check failed:", error);
      console.log("Setting to unpaid due to error");
      set({ paid: false, expiresAt: null });
    }
  },

  // ---------------- INITIALIZE PAYMENT ----------------
  initializePayment: async ({ plan, subjects, amount }) => {
    try {
      console.log("💳 Initializing payment...", { plan, subjects, amount });
      set({ loading: true, error: null });
      
      const { fetchWithAuth } = useAuthStore.getState();

      // Try different field names the backend might expect
      const payload = {
        planId: plan,
        plan: plan,
        subjects: subjects,
        subjectIds: subjects,
        amount: amount,
      };

      console.log("📤 Sending payload:", payload);

      const res = await fetchWithAuth(
        `${API_BASE}/payments/initialize`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      console.log("✅ Payment response:", res);
      console.log("✅ Response data:", res?.data);

      // Check if user already paid
      if (res.message?.includes('previous payment was successful') || 
          res.message?.includes('already paid') ||
          res.data?.alreadyPaid) {
        
        console.log("✅ User already has active subscription");
        set({ loading: false });
        
        return { 
          alreadyPaid: true, 
          message: res.message,
          data: res.data 
        };
      }

      // Handle error response
      if (!res.success && res.message) {
        console.error("❌ Backend error:", res.message);
        throw new Error(res.message);
      }

      // Get authorization URL from different possible paths
      const authUrl = res?.data?.authorization_url || 
                     res?.data?.authorizationUrl || 
                     res?.authorization_url ||
                     res?.authorizationUrl ||
                     res?.data?.url;

      console.log("🔍 Looking for auth URL in response:", {
        'res.data.authorization_url': res?.data?.authorization_url,
        'res.data.authorizationUrl': res?.data?.authorizationUrl,
        'res.authorization_url': res?.authorization_url,
        'res.authorizationUrl': res?.authorizationUrl,
        'res.data.url': res?.data?.url,
      });

      if (!authUrl) {
        console.error("❌ No authorization URL in response:", res);
        throw new Error(res.message || "No authorization URL received from server");
      }

      console.log("🔄 Redirecting to:", authUrl);
      set({ loading: false });
      window.location.href = authUrl;
      
      return { alreadyPaid: false };
      
    } catch (err) {
      console.error("❌ Payment initialization failed:", err);
      set({ loading: false, error: err.message || "Payment failed" });
      throw err;
    }
  },

  // ---------------- VERIFY PAYMENT ----------------
  verifyPayment: async (reference) => {
    try {
      console.log("🔍 Verifying payment with reference:", reference);
      set({ loading: true, error: null });
      
      const { fetchWithAuth } = useAuthStore.getState();

      const res = await fetchWithAuth(`${API_BASE}/payments/verify/${reference}`);
      
      console.log("✅ Verification response:", res);

      if (!res.success) {
        throw new Error(res.message || "Verification failed");
      }

      await get().checkStatus();

      set({ loading: false });
      return res;
    } catch (err) {
      console.error("❌ Verification failed:", err);
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // ---------------- HISTORY ----------------
  fetchHistory: async () => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/payments/history`);

      set({ history: res?.data || [] });
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  },
}));