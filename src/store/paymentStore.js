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
  // fetchHistory: async () => {
  //   try {
  //     logDebug('FETCH HISTORY', 'Loading...');
      
  //     const { fetchWithAuth } = useAuthStore.getState();
  //     const res = await fetchWithAuth(`${API_BASE}/payments/history`);

  //     logSuccess(`Loaded ${res?.data?.length || 0} payment records`);
      
  //     set({ history: res?.data || [] });
  //   } catch (err) {
  //     logError('Failed to fetch history', err);
  //   }
  // },
  fetchHistory: async () => {
  try {
    set({ loading: true });

    const { fetchWithAuth } = useAuthStore.getState();
    const res = await fetchWithAuth(`${API_BASE}/payments/history`);

    // API returns { success: true, data: [...] }
    set({ history: res?.data || [] });
  } catch (err) {
    console.error('Failed to fetch history', err);
    set({ history: [] });
  } finally {
    set({ loading: false });
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
