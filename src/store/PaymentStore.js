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

      console.log("✅ Full Payment status response:", JSON.stringify(res, null, 2));
      console.log("📊 Status data:", res?.data);

      const data = res?.data;
      
      if (!data) {
        console.error("❌ No data in response!");
        set({ paid: false, expiresAt: null });
        return { paid: false, expiresAt: null };
      }

      console.log("🔍 Subscriptions object:", data.subscriptions);
      console.log("🔍 Type of subscriptions:", typeof data.subscriptions);
      console.log("🔍 Subscriptions keys:", Object.keys(data.subscriptions || {}));
      
      // Check if user has any active subscriptions
      const activeSubscriptions = data?.subscriptions?.active || [];
      const lifetimeSubscriptions = data?.subscriptions?.lifetime || [];
      const totalActive = data?.subscriptions?.totalActive || 0;
      
      console.log("🔍 Active subscriptions array:", activeSubscriptions);
      console.log("🔍 Active subscriptions length:", activeSubscriptions.length);
      console.log("🔍 Lifetime subscriptions:", lifetimeSubscriptions);
      console.log("🔍 Lifetime length:", lifetimeSubscriptions.length);
      console.log("🔍 Total active count:", totalActive);

      const hasActiveSubscription = activeSubscriptions.length > 0 || 
                                     lifetimeSubscriptions.length > 0 || 
                                     totalActive > 0;

      console.log("✅ Has active subscription?", hasActiveSubscription);

      let isPaid = hasActiveSubscription;
      let expiry = null;

      if (hasActiveSubscription) {
        // Get expiry from first active subscription
        if (activeSubscriptions.length > 0) {
          const firstSub = activeSubscriptions[0];
          console.log("📅 First subscription object:", firstSub);
          expiry = firstSub?.expiresAt || firstSub?.expiry || firstSub?.expiryDate || null;
          console.log("📅 Extracted expiry:", expiry);
        }
        
        // If no expiry and has lifetime, set to far future
        if (!expiry && lifetimeSubscriptions.length > 0) {
          expiry = "2099-12-31T23:59:59.000Z";
          console.log("♾️ Lifetime subscription - setting far future expiry");
        }
      }

      // Fallback: check if there's a direct paid field
      if (!isPaid && data?.paid !== undefined) {
        console.log("🔄 Checking fallback paid field:", data.paid);
        isPaid = !!data.paid;
        expiry = data.expiresAt || null;
      }

      console.log("💾 FINAL - Setting payment state:", { 
        paid: isPaid, 
        expiresAt: expiry,
        activeCount: activeSubscriptions.length,
        lifetimeCount: lifetimeSubscriptions.length
      });

      set({
        paid: isPaid,
        expiresAt: expiry,
      });

      // Verify the state was set
      const currentState = get();
      console.log("✅ State after set:", { paid: currentState.paid, expiresAt: currentState.expiresAt });

      return { paid: isPaid, expiresAt: expiry };
    } catch (error) {
      console.error("❌ Payment status check failed:", error);
      console.error("❌ Error stack:", error.stack);
      set({ paid: false, expiresAt: null });
      return { paid: false, expiresAt: null };
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
      console.log("✅ Verification data:", res?.data);

      // Check if verification was successful
      if (!res.success && !res?.data?.success) {
        throw new Error(res.message || "Verification failed");
      }

      // IMPORTANT: Update payment status immediately
      if (res?.data?.paid !== undefined) {
        console.log("💾 Updating payment status from verify response");
        set({
          paid: res.data.paid,
          expiresAt: res.data.expiresAt || null,
        });
      }

      // Also fetch fresh status from backend
      console.log("🔄 Fetching fresh payment status...");
      await get().checkStatus();

      console.log("✅ Final payment state:", { 
        paid: get().paid, 
        expiresAt: get().expiresAt 
      });

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