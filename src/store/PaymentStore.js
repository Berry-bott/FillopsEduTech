import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// ✅ BUILT-IN DEBUG HELPER
function logDebug(title, data) {
  console.log(`%c🔍 ${title}`, 'color: #8B5CF6; font-weight: bold; font-size: 14px;');
  // console.log(data.subscriptions);
}

function logSuccess(message) {
  console.log(`%c✅ ${message}`, 'color: #10B981; font-weight: bold;');
}

function logError(message, error) {
  console.log(`%c❌ ${message}`, 'color: #EF4444; font-weight: bold;');
  if (error) console.error(error);
}

function logWarning(message) {
  console.log(`%c⚠️ ${message}`, 'color: #F59E0B; font-weight: bold;');
}

export const usePaymentStore = create((set, get) => ({
  plans: [],
  history: [],
  paid: false,
  expiresAt: null,
  activeSubscriptions: [],
  loading: false,
  error: null,

  // ✅ NEW: DEBUG STATUS - Call this from console
  debugStatus: () => {
    const state = get();
    console.log('\n');
    console.log('%c═══════════════════════════════════════', 'color: #8B5CF6; font-weight: bold;');
    console.log('%c    💳 PAYMENT STORE DEBUG STATUS', 'color: #8B5CF6; font-weight: bold; font-size: 16px;');
    console.log('%c═══════════════════════════════════════', 'color: #8B5CF6; font-weight: bold;');
    console.log('\n');
    
    console.log('%c📊 Payment Status:', 'color: #3B82F6; font-weight: bold;');
    console.log('  Paid:', state.paid ? '✅ YES' : '❌ NO');
    console.log('  Expires:', state.expiresAt || 'N/A');
    console.log('\n');
    
    console.log('%c📋 Active Subscriptions:', 'color: #3B82F6; font-weight: bold;');
    console.log('  Count:', state.activeSubscriptions.length);
    if (state.activeSubscriptions.length > 0) {
      state.activeSubscriptions.forEach((sub, idx) => {
        console.log(`\n  ${idx + 1}. ${sub.subjectName || 'Unknown'}`);
        console.log('     Subject ID:', sub.subjectId || sub.id || 'N/A');
        console.log('     Category:', sub.category || 'N/A');
        console.log('     Expires:', sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'N/A');
      });
    } else {
      console.log('  ⚠️ No active subscriptions found!');
    }
    console.log('\n');
    
    console.log('%c💡 Quick Commands:', 'color: #3B82F6; font-weight: bold;');
    console.log('  usePaymentStore.getState().checkStatus()     - Refresh from server');
    console.log('  usePaymentStore.getState().debugStatus()     - Show this status');
    console.log('\n');
    console.log('%c═══════════════════════════════════════', 'color: #8B5CF6; font-weight: bold;');
    console.log('\n');
    
    return {
      paid: state.paid,
      activeSubscriptions: state.activeSubscriptions,
      expiresAt: state.expiresAt
    };
  },

  // ---------------- GET PLANS ----------------
  fetchPlans: async () => {
    try {
      logDebug('FETCH PLANS', 'Starting...');
      set({ loading: true, error: null });
      
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/payments/plans`);
      
      logSuccess('Plans fetched successfully');
      logDebug('Plans Data', res?.data || res);

      set({
        plans: res?.data || res,
        loading: false,
      });
    } catch (err) {
      logError('Failed to fetch plans', err);
      set({ loading: false, error: err.message });
    }
  },

  // ---------------- CHECK STATUS ----------------
  checkStatus: async () => {
    try {
      logDebug('PAYMENT STATUS CHECK', 'Calling API...');
      
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/payments/status`);

      logDebug('API Response', JSON.stringify(res, null, 2));

      const data = res?.data;
      
      if (!data) {
        logError('No data in API response!');
        set({ 
          paid: false, 
          expiresAt: null,
          activeSubscriptions: []
        });
        return { paid: false, expiresAt: null, activeSubscriptions: [] };
      }

      // Extract subscriptions
      const activeSubscriptions = data?.subscriptions?.active || [];
      const lifetimeSubscriptions = data?.subscriptions?.lifetime || [];
      const totalActive = data?.subscriptions?.totalActive || 0;
      
      logDebug('Subscriptions Found', {
        active: activeSubscriptions.length,
        lifetime: lifetimeSubscriptions.length,
        total: totalActive
      });

      // Combine all active subscriptions
      const allActiveSubscriptions = [...activeSubscriptions, ...lifetimeSubscriptions];


      console.log("subcribtions", allActiveSubscriptions);

      
      
      if (allActiveSubscriptions.length > 0) {
        console.log('\n%c📋 SUBSCRIPTION DETAILS:', 'color: #10B981; font-weight: bold; font-size: 14px;');
        allActiveSubscriptions.forEach((sub, idx) => {
          console.log(`  ${idx + 1}. ${sub.subjectName || 'Unknown Subject'}`);
          console.log(`     Subject ID: ${sub.subjectId || sub.id}`);
          console.log(`     Category: ${sub.category}`);
          console.log(`     Expires: ${sub.expiresAt ? new Date(sub.expiresAt).toLocaleDateString() : 'Lifetime'}`);
        });
        console.log('\n');
      } else {
        logWarning('No active subscriptions found in API response');
      }

      const hasActiveSubscription = allActiveSubscriptions.length > 0 || totalActive > 0;

      let isPaid = hasActiveSubscription;
      let expiry = null;

      if (hasActiveSubscription) {
        if (activeSubscriptions.length > 0) {
          const firstSub = activeSubscriptions[0];
          expiry = firstSub?.expiresAt || firstSub?.expiry || firstSub?.expiryDate || null;
        }
        
        if (!expiry && lifetimeSubscriptions.length > 0) {
          expiry = "2099-12-31T23:59:59.000Z";
          logDebug('Lifetime Subscription', 'Setting far future expiry');
        }
      }

      // Fallback check
      if (!isPaid && data?.paid !== undefined) {
        logDebug('Using Fallback', 'Checking data.paid field');
        isPaid = !!data.paid;
        expiry = data.expiresAt || null;
      }

      logSuccess(`Payment Status: ${isPaid ? 'PAID ✅' : 'UNPAID ❌'}`);
      logDebug('Final State', { 
        paid: isPaid, 
        expiresAt: expiry,
        activeSubscriptions: allActiveSubscriptions.length
      });

      set({
        paid: isPaid,
        expiresAt: expiry,
        activeSubscriptions: allActiveSubscriptions,
      });

      // Verify state was set
      const currentState = get();
      if (currentState.activeSubscriptions.length !== allActiveSubscriptions.length) {
        logWarning('State may not have updated correctly!');
      }

      return { 
        paid: isPaid, 
        expiresAt: expiry, 
        activeSubscriptions: allActiveSubscriptions 
      };
    } catch (error) {
      logError('Payment status check failed', error);
      set({ 
        paid: false, 
        expiresAt: null,
        activeSubscriptions: []
      });
      return { paid: false, expiresAt: null, activeSubscriptions: [] };
    }
  },

  // ---------------- INITIALIZE PAYMENT ----------------
  initializePayment: async ({ plan, subjects, amount }) => {
    try {
      logDebug('INITIALIZE PAYMENT', { plan, subjects, amount });
      set({ loading: true, error: null });
      
      const { fetchWithAuth } = useAuthStore.getState();

      const payload = {
        planId: plan,
        plan: plan,
        subjects: subjects,
        subjectIds: subjects,
        amount: amount,
      };

      logDebug('Payment Payload', payload);

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

      logDebug('Payment Response', res);

      // Check if user already paid
      if (res.message?.includes('previous payment was successful') || 
          res.message?.includes('already paid') ||
          res.data?.alreadyPaid) {
        
        logSuccess('User already has active subscription');
        set({ loading: false });
        
        await get().checkStatus();
        
        return { 
          alreadyPaid: true, 
          message: res.message,
          data: res.data 
        };
      }

      if (!res.success && res.message) {
        logError('Backend Error', res.message);
        throw new Error(res.message);
      }

      const authUrl = res?.data?.authorization_url || 
                     res?.data?.authorizationUrl || 
                     res?.authorization_url ||
                     res?.authorizationUrl ||
                     res?.data?.url;

      if (!authUrl) {
        logError('No authorization URL in response');
        logDebug('Response Structure', res);
        throw new Error(res.message || "No authorization URL received from server");
      }

      logSuccess('Redirecting to payment gateway');
      logDebug('Payment URL', authUrl);
      
      set({ loading: false });
      window.location.href = authUrl;
      
      return { alreadyPaid: false };
      
    } catch (err) {
      logError('Payment initialization failed', err);
      set({ loading: false, error: err.message || "Payment failed" });
      throw err;
    }
  },

  // ---------------- VERIFY PAYMENT ----------------
  verifyPayment: async (reference) => {
    try {
      logDebug('VERIFY PAYMENT', `Reference: ${reference}`);
      set({ loading: true, error: null });
      
      const { fetchWithAuth } = useAuthStore.getState();

      const res = await fetchWithAuth(`${API_BASE}/payments/verify/${reference}`);
      
      logDebug('Verification Response', res);

      if (!res.success && !res?.data?.success) {
        logError('Verification Failed', res.message);
        throw new Error(res.message || "Verification failed");
      }

      if (res?.data?.paid !== undefined) {
        logDebug('Updating Payment Status', `Paid: ${res.data.paid}`);
        set({
          paid: res.data.paid,
          expiresAt: res.data.expiresAt || null,
        });
      }

      logSuccess('Payment verified successfully');
      logDebug('Fetching Fresh Status', 'Getting subscription details...');
      
      const statusResult = await get().checkStatus();
      
      logSuccess('Verification Complete');
      logDebug('Final State', { 
        paid: get().paid, 
        expiresAt: get().expiresAt,
        activeSubscriptions: get().activeSubscriptions.length
      });

      set({ loading: false });
      return { ...res, statusResult };
    } catch (err) {
      logError('Verification Failed', err);
      set({ loading: false, error: err.message });
      throw err;
    }
  },

  // ---------------- HISTORY ----------------
  fetchHistory: async () => {
    try {
      logDebug('FETCH HISTORY', 'Loading...');
      
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/payments/history`);

      logSuccess(`Loaded ${res?.data?.length || 0} payment records`);
      
      set({ history: res?.data || [] });
    } catch (err) {
      logError('Failed to fetch history', err);
    }
  },

  // ---------------- MANUAL REFRESH ----------------
  refreshSubscriptions: async () => {
    logDebug('MANUAL REFRESH', 'Refreshing subscription status...');
    return await get().checkStatus();
  },
}));

// ✅ EXPORT DEBUG HELPER FOR CONSOLE USE
if (typeof window !== 'undefined') {
  window.debugPayment = () => {
    const store = usePaymentStore.getState();
    store.debugStatus();
  };
  
  console.log('%c💡 Payment Debug Helper Loaded!', 'color: #8B5CF6; font-weight: bold; font-size: 16px;');
  console.log('%cType "debugPayment()" in console to check payment status', 'color: #6B7280;');
}





// import { create } from "zustand";
// import useAuthStore from "./authStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// export const usePaymentStore = create((set, get) => ({
//   plans: [],
//   history: [],
//   paid: false,
//   expiresAt: null,
//   activeSubscriptions: [], // ✅ ADD THIS!
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

//       console.log("✅ Full Payment status response:", JSON.stringify(res, null, 2));
//       console.log("📊 Status data:", res?.data);

//       const data = res?.data;
      
//       if (!data) {
//         console.error("❌ No data in response!");
//         set({ 
//           paid: false, 
//           expiresAt: null,
//           activeSubscriptions: [] // ✅ CLEAR SUBSCRIPTIONS
//         });
//         return { paid: false, expiresAt: null, activeSubscriptions: [] };
//       }

//       console.log("🔍 Subscriptions object:", data.subscriptions);
//       console.log("🔍 Type of subscriptions:", typeof data.subscriptions);
//       console.log("🔍 Subscriptions keys:", Object.keys(data.subscriptions || {}));
      
//       // ✅ EXTRACT ACTIVE SUBSCRIPTIONS
//       const activeSubscriptions = data?.subscriptions?.active || [];
//       const lifetimeSubscriptions = data?.subscriptions?.lifetime || [];
//       const totalActive = data?.subscriptions?.totalActive || 0;
      
//       console.log("🔍 Active subscriptions array:", activeSubscriptions);
//       console.log("🔍 Active subscriptions length:", activeSubscriptions.length);
//       console.log("🔍 Lifetime subscriptions:", lifetimeSubscriptions);
//       console.log("🔍 Lifetime length:", lifetimeSubscriptions.length);
//       console.log("🔍 Total active count:", totalActive);

//       // ✅ COMBINE ACTIVE AND LIFETIME
//       const allActiveSubscriptions = [...activeSubscriptions, ...lifetimeSubscriptions];
      
//       console.log("📋 Total active + lifetime subscriptions:", allActiveSubscriptions.length);
//       console.log("📋 Subscription details:", allActiveSubscriptions.map(sub => ({
//         subjectId: sub.subjectId,
//         subjectName: sub.subjectName,
//         category: sub.category,
//         expiresAt: sub.expiresAt
//       })));

//       const hasActiveSubscription = allActiveSubscriptions.length > 0 || totalActive > 0;

//       console.log("✅ Has active subscription?", hasActiveSubscription);

//       let isPaid = hasActiveSubscription;
//       let expiry = null;

//       if (hasActiveSubscription) {
//         // Get expiry from first active subscription
//         if (activeSubscriptions.length > 0) {
//           const firstSub = activeSubscriptions[0];
//           console.log("📅 First subscription object:", firstSub);
//           expiry = firstSub?.expiresAt || firstSub?.expiry || firstSub?.expiryDate || null;
//           console.log("📅 Extracted expiry:", expiry);
//         }
        
//         // If no expiry and has lifetime, set to far future
//         if (!expiry && lifetimeSubscriptions.length > 0) {
//           expiry = "2099-12-31T23:59:59.000Z";
//           console.log("♾️ Lifetime subscription - setting far future expiry");
//         }
//       }

//       // Fallback: check if there's a direct paid field
//       if (!isPaid && data?.paid !== undefined) {
//         console.log("🔄 Checking fallback paid field:", data.paid);
//         isPaid = !!data.paid;
//         expiry = data.expiresAt || null;
//       }

//       console.log("💾 FINAL - Setting payment state:", { 
//         paid: isPaid, 
//         expiresAt: expiry,
//         activeCount: allActiveSubscriptions.length
//       });

//       // ✅ IMPORTANT: STORE THE SUBSCRIPTIONS ARRAY!
//       set({
//         paid: isPaid,
//         expiresAt: expiry,
//         activeSubscriptions: allActiveSubscriptions, // ✅ STORE THIS!
//       });

//       // Verify the state was set
//       const currentState = get();
//       console.log("✅ State after set:", { 
//         paid: currentState.paid, 
//         expiresAt: currentState.expiresAt,
//         activeSubscriptions: currentState.activeSubscriptions.length
//       });

//       return { 
//         paid: isPaid, 
//         expiresAt: expiry, 
//         activeSubscriptions: allActiveSubscriptions 
//       };
//     } catch (error) {
//       console.error("❌ Payment status check failed:", error);
//       console.error("❌ Error stack:", error.stack);
//       set({ 
//         paid: false, 
//         expiresAt: null,
//         activeSubscriptions: [] // ✅ CLEAR ON ERROR
//       });
//       return { paid: false, expiresAt: null, activeSubscriptions: [] };
//     }
//   },

//   // ---------------- INITIALIZE PAYMENT ----------------
//   initializePayment: async ({ plan, subjects, amount }) => {
//     try {
//       console.log("💳 Initializing payment...", { plan, subjects, amount });
//       set({ loading: true, error: null });
      
//       const { fetchWithAuth } = useAuthStore.getState();

//       const payload = {
//         planId: plan,
//         plan: plan,
//         subjects: subjects,
//         subjectIds: subjects,
//         amount: amount,
//       };

//       console.log("📤 Sending payload:", payload);

//       const res = await fetchWithAuth(
//         `${API_BASE}/payments/initialize`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       console.log("✅ Payment response:", res);
//       console.log("✅ Response data:", res?.data);

//       // Check if user already paid
//       if (res.message?.includes('previous payment was successful') || 
//           res.message?.includes('already paid') ||
//           res.data?.alreadyPaid) {
        
//         console.log("✅ User already has active subscription");
//         set({ loading: false });
        
//         // ✅ REFRESH STATUS AFTER DETECTING EXISTING PAYMENT
//         await get().checkStatus();
        
//         return { 
//           alreadyPaid: true, 
//           message: res.message,
//           data: res.data 
//         };
//       }

//       if (!res.success && res.message) {
//         console.error("❌ Backend error:", res.message);
//         throw new Error(res.message);
//       }

//       const authUrl = res?.data?.authorization_url || 
//                      res?.data?.authorizationUrl || 
//                      res?.authorization_url ||
//                      res?.authorizationUrl ||
//                      res?.data?.url;

//       console.log("🔍 Looking for auth URL in response:", {
//         'res.data.authorization_url': res?.data?.authorization_url,
//         'res.data.authorizationUrl': res?.data?.authorizationUrl,
//         'res.authorization_url': res?.authorization_url,
//         'res.authorizationUrl': res?.authorizationUrl,
//         'res.data.url': res?.data?.url,
//       });

//       if (!authUrl) {
//         console.error("❌ No authorization URL in response:", res);
//         throw new Error(res.message || "No authorization URL received from server");
//       }

//       console.log("🔄 Redirecting to:", authUrl);
//       set({ loading: false });
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
//       console.log("🔍 Verifying payment with reference:", reference);
//       set({ loading: true, error: null });
      
//       const { fetchWithAuth } = useAuthStore.getState();

//       const res = await fetchWithAuth(`${API_BASE}/payments/verify/${reference}`);
      
//       console.log("✅ Verification response:", res);
//       console.log("✅ Verification data:", res?.data);

//       if (!res.success && !res?.data?.success) {
//         throw new Error(res.message || "Verification failed");
//       }

//       // ✅ IMPORTANT: Update payment status immediately
//       if (res?.data?.paid !== undefined) {
//         console.log("💾 Updating payment status from verify response");
//         set({
//           paid: res.data.paid,
//           expiresAt: res.data.expiresAt || null,
//         });
//       }

//       // ✅ CRITICAL: Fetch fresh status to get subscriptions array
//       console.log("🔄 Fetching fresh payment status with subscriptions...");
//       const statusResult = await get().checkStatus();
      
//       console.log("✅ Final payment state after verification:", { 
//         paid: get().paid, 
//         expiresAt: get().expiresAt,
//         activeSubscriptions: get().activeSubscriptions.length
//       });

//       set({ loading: false });
//       return { ...res, statusResult };
//     } catch (err) {
//       console.error("❌ Verification failed:", err);
//       set({ loading: false, error: err.message });
//       throw err;
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

//   // ✅ ADD MANUAL REFRESH FUNCTION
//   refreshSubscriptions: async () => {
//     console.log("🔄 Manually refreshing subscriptions...");
//     return await get().checkStatus();
//   },
// }));






// // import { create } from "zustand";
// // import useAuthStore from "./authStore";

// // const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// // export const usePaymentStore = create((set, get) => ({
// //   plans: [],
// //   history: [],
// //   paid: false,
// //   expiresAt: null,
// //   loading: false,
// //   error: null,

// //   // ---------------- GET PLANS ----------------
// //   fetchPlans: async () => {
// //     try {
// //       console.log("📥 Fetching plans...");
// //       set({ loading: true, error: null });
      
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const res = await fetchWithAuth(`${API_BASE}/payments/plans`);
      
// //       console.log("✅ Full API response:", res);
// //       console.log("✅ Plans data:", res?.data?.plans);

// //       set({
// //         plans: res?.data || res,
// //         loading: false,
// //       });
// //     } catch (err) {
// //       console.error("❌ Failed to fetch plans:", err);
// //       set({ loading: false, error: err.message });
// //     }
// //   },

// //   // ---------------- CHECK STATUS ----------------
// //   checkStatus: async () => {
// //     try {
// //       console.log("📞 Calling payment status endpoint...");
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const res = await fetchWithAuth(`${API_BASE}/payments/status`);

// //       console.log("✅ Payment status response:", res);
// //       console.log("📊 Status data:", res?.data);

// //       const isPaid = !!res?.data?.paid;
// //       const expiry = res?.data?.expiresAt || null;

// //       console.log("💾 Setting payment state:", { paid: isPaid, expiresAt: expiry });

// //       set({
// //         paid: isPaid,
// //         expiresAt: expiry,
// //       });
// //     } catch (error) {
// //       console.error("❌ Payment status check failed:", error);
// //       console.log("Setting to unpaid due to error");
// //       set({ paid: false, expiresAt: null });
// //     }
// //   },

// //   // ---------------- INITIALIZE PAYMENT ----------------
// //   initializePayment: async ({ plan, subjects, amount }) => {
// //     try {
// //       console.log("💳 Initializing payment...", { plan, subjects, amount });
// //       set({ loading: true, error: null });
      
// //       const { fetchWithAuth } = useAuthStore.getState();

// //       const res = await fetchWithAuth(
// //         `${API_BASE}/payments/initialize`,
// //         {
// //           method: "POST",
// //           body: JSON.stringify({ plan, subjects, amount }),
// //         }
// //       );

// //       console.log("✅ Payment response:", res);

// //       // ✅ FIX #2: Check if user already paid
// //       if (res.message?.includes('previous payment was successful') || 
// //           res.message?.includes('already paid') ||
// //           res.data?.alreadyPaid) {
        
// //         console.log("✅ User already has active subscription");
// //         set({ loading: false });
        
// //         return { 
// //           alreadyPaid: true, 
// //           message: res.message,
// //           data: res.data 
// //         };
// //       }

// //       // Handle authorization URL for NEW payments
// //       const authUrl = res?.data?.authorizationUrl || res?.authorizationUrl;

// //       if (!authUrl) {
// //         console.error("❌ No authorization URL in response:", res);
// //         throw new Error("No authorization URL received from server");
// //       }

// //       console.log("🔄 Redirecting to:", authUrl);
// //       window.location.href = authUrl;
      
// //       return { alreadyPaid: false };
      
// //     } catch (err) {
// //       console.error("❌ Payment initialization failed:", err);
// //       set({ loading: false, error: err.message || "Payment failed" });
// //       throw err;
// //     }
// //   },

// //   // ---------------- VERIFY PAYMENT ----------------
// //   verifyPayment: async (reference) => {
// //     try {
// //       set({ loading: true, error: null });
// //       const { fetchWithAuth } = useAuthStore.getState();

// //       await fetchWithAuth(`${API_BASE}/payments/verify/${reference}`);
// //       await get().checkStatus();

// //       set({ loading: false });
// //     } catch (err) {
// //       set({ loading: false, error: err.message });
// //       throw err; // ✅ FIX #1: Re-throw error so component can catch it
// //     }
// //   },

// //   // ---------------- HISTORY ----------------
// //   fetchHistory: async () => {
// //     try {
// //       const { fetchWithAuth } = useAuthStore.getState();
// //       const res = await fetchWithAuth(`${API_BASE}/payments/history`);

// //       set({ history: res?.data || [] });
// //     } catch (err) {
// //       console.error("Failed to fetch history:", err);
// //     }
// //   },
// // }));






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

//       console.log("✅ Full Payment status response:", JSON.stringify(res, null, 2));
//       console.log("📊 Status data:", res?.data);

//       const data = res?.data;
      
//       if (!data) {
//         console.error("❌ No data in response!");
//         set({ paid: false, expiresAt: null });
//         return { paid: false, expiresAt: null };
//       }

//       console.log("🔍 Subscriptions object:", data.subscriptions);
//       console.log("🔍 Type of subscriptions:", typeof data.subscriptions);
//       console.log("🔍 Subscriptions keys:", Object.keys(data.subscriptions || {}));
      
//       // Check if user has any active subscriptions
//       const activeSubscriptions = data?.subscriptions?.active || [];
//       const lifetimeSubscriptions = data?.subscriptions?.lifetime || [];
//       const totalActive = data?.subscriptions?.totalActive || 0;
      
//       console.log("🔍 Active subscriptions array:", activeSubscriptions);
//       console.log("🔍 Active subscriptions length:", activeSubscriptions.length);
//       console.log("🔍 Lifetime subscriptions:", lifetimeSubscriptions);
//       console.log("🔍 Lifetime length:", lifetimeSubscriptions.length);
//       console.log("🔍 Total active count:", totalActive);

//       const hasActiveSubscription = activeSubscriptions.length > 0 || 
//                                      lifetimeSubscriptions.length > 0 || 
//                                      totalActive > 0;

//       console.log("✅ Has active subscription?", hasActiveSubscription);

//       let isPaid = hasActiveSubscription;
//       let expiry = null;

//       if (hasActiveSubscription) {
//         // Get expiry from first active subscription
//         if (activeSubscriptions.length > 0) {
//           const firstSub = activeSubscriptions[0];
//           console.log("📅 First subscription object:", firstSub);
//           expiry = firstSub?.expiresAt || firstSub?.expiry || firstSub?.expiryDate || null;
//           console.log("📅 Extracted expiry:", expiry);
//         }
        
//         // If no expiry and has lifetime, set to far future
//         if (!expiry && lifetimeSubscriptions.length > 0) {
//           expiry = "2099-12-31T23:59:59.000Z";
//           console.log("♾️ Lifetime subscription - setting far future expiry");
//         }
//       }

//       // Fallback: check if there's a direct paid field
//       if (!isPaid && data?.paid !== undefined) {
//         console.log("🔄 Checking fallback paid field:", data.paid);
//         isPaid = !!data.paid;
//         expiry = data.expiresAt || null;
//       }

//       console.log("💾 FINAL - Setting payment state:", { 
//         paid: isPaid, 
//         expiresAt: expiry,
//         activeCount: activeSubscriptions.length,
//         lifetimeCount: lifetimeSubscriptions.length
//       });

//       set({
//         paid: isPaid,
//         expiresAt: expiry,
//       });

//       // Verify the state was set
//       const currentState = get();
//       console.log("✅ State after set:", { paid: currentState.paid, expiresAt: currentState.expiresAt });

//       return { paid: isPaid, expiresAt: expiry };
//     } catch (error) {
//       console.error("❌ Payment status check failed:", error);
//       console.error("❌ Error stack:", error.stack);
//       set({ paid: false, expiresAt: null });
//       return { paid: false, expiresAt: null };
//     }
//   },

//   // ---------------- INITIALIZE PAYMENT ----------------
//   initializePayment: async ({ plan, subjects, amount }) => {
//     try {
//       console.log("💳 Initializing payment...", { plan, subjects, amount });
//       set({ loading: true, error: null });
      
//       const { fetchWithAuth } = useAuthStore.getState();

//       // Try different field names the backend might expect
//       const payload = {
//         planId: plan,
//         plan: plan,
//         subjects: subjects,
//         subjectIds: subjects,
//         amount: amount,
//       };

//       console.log("📤 Sending payload:", payload);

//       const res = await fetchWithAuth(
//         `${API_BASE}/payments/initialize`,
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       console.log("✅ Payment response:", res);
//       console.log("✅ Response data:", res?.data);

//       // Check if user already paid
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

//       // Handle error response
//       if (!res.success && res.message) {
//         console.error("❌ Backend error:", res.message);
//         throw new Error(res.message);
//       }

//       // Get authorization URL from different possible paths
//       const authUrl = res?.data?.authorization_url || 
//                      res?.data?.authorizationUrl || 
//                      res?.authorization_url ||
//                      res?.authorizationUrl ||
//                      res?.data?.url;

//       console.log("🔍 Looking for auth URL in response:", {
//         'res.data.authorization_url': res?.data?.authorization_url,
//         'res.data.authorizationUrl': res?.data?.authorizationUrl,
//         'res.authorization_url': res?.authorization_url,
//         'res.authorizationUrl': res?.authorizationUrl,
//         'res.data.url': res?.data?.url,
//       });

//       if (!authUrl) {
//         console.error("❌ No authorization URL in response:", res);
//         throw new Error(res.message || "No authorization URL received from server");
//       }

//       console.log("🔄 Redirecting to:", authUrl);
//       set({ loading: false });
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
//       console.log("🔍 Verifying payment with reference:", reference);
//       set({ loading: true, error: null });
      
//       const { fetchWithAuth } = useAuthStore.getState();

//       const res = await fetchWithAuth(`${API_BASE}/payments/verify/${reference}`);
      
//       console.log("✅ Verification response:", res);
//       console.log("✅ Verification data:", res?.data);

//       // Check if verification was successful
//       if (!res.success && !res?.data?.success) {
//         throw new Error(res.message || "Verification failed");
//       }

//       // IMPORTANT: Update payment status immediately
//       if (res?.data?.paid !== undefined) {
//         console.log("💾 Updating payment status from verify response");
//         set({
//           paid: res.data.paid,
//           expiresAt: res.data.expiresAt || null,
//         });
//       }

//       // Also fetch fresh status from backend
//       console.log("🔄 Fetching fresh payment status...");
//       await get().checkStatus();

//       console.log("✅ Final payment state:", { 
//         paid: get().paid, 
//         expiresAt: get().expiresAt 
//       });

//       set({ loading: false });
//       return res;
//     } catch (err) {
//       console.error("❌ Verification failed:", err);
//       set({ loading: false, error: err.message });
//       throw err;
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