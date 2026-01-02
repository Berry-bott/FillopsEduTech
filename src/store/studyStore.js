import { create } from "zustand";
import useAuthStore from "./authStore";
import { usePaymentStore } from "./PaymentStore"; // ✅ IMPORT PAYMENT STORE

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
const REQUEST_LIMIT = 20;

// ✅ SIMPLIFIED: Check if user paid using paymentStore
function checkIfUserPaidForSubject(subjectInfo) {
  const paymentState = usePaymentStore.getState();
  
  // Handle both old format (string) and new format (object)
  const subjectId = typeof subjectInfo === 'string' ? subjectInfo : subjectInfo?.id;
  
  console.log("💰 Checking payment for subject:", subjectId);
  
  // Try MULTIPLE possible locations where active subscriptions might be stored
  let activeSubscriptions = [];
  
  if (paymentState.activeSubscriptions) {
    activeSubscriptions = paymentState.activeSubscriptions;
  } else if (paymentState.subscriptions?.active) {
    activeSubscriptions = paymentState.subscriptions.active;
  } else if (paymentState.active) {
    activeSubscriptions = paymentState.active;
  }
  
  console.log("📋 Found active subscriptions:", activeSubscriptions);
  console.log("📋 Subscription count:", activeSubscriptions?.length || 0);
  
  if (!activeSubscriptions || activeSubscriptions.length === 0) {
    console.log("❌ No active subscriptions found");
    return false;
  }
  
  // Check if subjectId matches (strict ID check only)
  const hasPaid = activeSubscriptions.some(
    (sub) => {
      const matches = sub.subjectId === subjectId || 
                     sub.id === subjectId || 
                     sub._id === subjectId;
      
      if (matches) {
        console.log("✅ Found matching subscription:", {
          subjectName: sub.subjectName,
          subjectId: sub.subjectId,
          category: sub.category
        });
      }
      
      return matches;
    }
  );
  
  if (!hasPaid) {
    console.log("🔒 Subject not in paid list. Paid subjects:", activeSubscriptions.map(s => ({
      name: s.subjectName,
      id: s.subjectId,
      category: s.category
    })));
  }
  
  console.log("💰 Payment check result:", { subjectId, hasPaid });
  return hasPaid;
}

// ✅ Get subjectId AND subjectName from topicId
async function getSubjectIdForTopic(topicId) {
  const { accessToken } = useAuthStore.getState();
  
  if (!accessToken || !topicId) {
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/users/my-topics`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const subjects = data.data || [];

    // Find which subject this topic belongs to
    for (const subject of subjects) {
      for (const module of subject.modules || []) {
        for (const topic of module.topics || []) {
          if (topic.topicId === topicId || topic.id === topicId || topic._id === topicId) {
            console.log("📌 Found subject for topic:", { 
              topicId, 
              subjectId: subject.subjectId,
              subjectName: subject.subjectName // ✅ Also return name
            });
            return {
              id: subject.subjectId,
              name: subject.subjectName
            };
          }
        }
      }
    }

    return null;
  } catch (error) {
    console.error("❌ Error finding subject for topic:", error);
    return null;
  }
}

export const useStudyStore = create((set, get) => ({
  // ---------------- STATE ----------------
  saved: null,
  activeId: null,
  units: {},
  currentIndex: 0,
  selectedOptions: {},
  subjectNames: {},
  topicNames: {},
  loading: false,
  paymentLocked: false,
  paymentLoading: false,
  initialized: false,
  sessionId: null,
  sessionActive: false,

  // ---------------- RESET ----------------
  reset: () => {
    const state = get();
    console.log("🧹 Resetting store, initialized was:", state.initialized);
    
    set({
      saved: null,
      activeId: null,
      units: {},
      currentIndex: 0,
      selectedOptions: {},
      subjectNames: {},
      topicNames: {},
      paymentLocked: false,
      initialized: false,
      sessionId: null,
      sessionActive: false,
      loading: false,
    });
  },

  // ---------------- LOAD SAVED ----------------
  syncSaved: async () => {
    const state = get();
    
    if (state.loading && state.initialized) {
      console.log("⏭️ Currently loading, skipping duplicate call");
      return null;
    }
    
    if (state.initialized && !state.loading) {
      console.log("🔄 Re-initializing after reset");
      set({ initialized: false });
    }

    console.log("🔄 Starting syncSaved...");

    const saved = JSON.parse(localStorage.getItem("studySelections"));
    console.log("📦 Loaded from localStorage:", saved);
    
    if (!saved) {
      console.warn("⚠️ No saved data in localStorage");
      set({ loading: false });
      return null;
    }

    set({ saved, initialized: true, loading: true });

    try {
      console.log("📘 Fetching names for mode:", saved.mode);
      
      if (saved.mode === "subject") {
        await get().fetchSubjectNames();
      } else {
        await get().fetchTopicNames();
      }

      const firstId =
        saved.mode === "subject"
          ? saved.subjects?.[0]
          : Object.values(saved.topics || {})[0]?.[0];

      console.log("🎯 First active ID:", firstId);

      if (firstId) {
        await get().changeActive(firstId);
        setTimeout(() => {
          const currentState = get();
          if (currentState.loading) {
            console.log("⚠️ Force setting loading to false");
            set({ loading: false });
          }
        }, 200);
      } else {
        console.warn("⚠️ No first ID found");
        set({ loading: false });
      }
      
      return saved;
    } catch (error) {
      console.error("❌ Error in syncSaved:", error);
      set({ loading: false });
      return null;
    }
  },

  // ---------------- HELPERS ----------------
  getOrderedIds: () => {
    const { saved } = get();
    if (!saved) return [];

    if (saved.mode === "subject") {
      return saved.subjects || [];
    }

    return Object.values(saved.topics || {}).flat();
  },

  getUnit: () => {
    const { activeId, units } = get();
    return (
      units[activeId] || {
        items: [],
        skip: 0,
        exhausted: false,
      }
    );
  },

  getQuestions: () => get().getUnit().items,

  // ---------------- SELECTION ----------------
  setSelectedOption: (questionId, optionId) =>
    set((s) => ({
      selectedOptions: {
        ...s.selectedOptions,
        [questionId]: optionId,
      },
    })),

  // ---------------- FETCH QUESTIONS (WITH ACCESS CHECK) ----------------
  fetchMoreQuestions: async () => {
    const state = get();
    const { saved, activeId, units } = state;
    
    console.log("🔍 fetchMoreQuestions called - saved:", !!saved, "activeId:", activeId);
    
    if (!saved || !activeId) {
      console.log("⏹️ No saved or activeId, cannot fetch", { saved: !!saved, activeId });
      set({ loading: false });
      return;
    }

    // ✅ CHECK ACCESS BEFORE FETCHING
    let subjectToCheck = null;
    
    if (saved.mode === "subject") {
      // Direct subject mode - check this subject
      subjectToCheck = activeId;
      console.log("📚 Subject mode - checking subject:", subjectToCheck);
    } else if (saved.mode === "topic") {
      // Topic mode - find which subject this topic belongs to
      console.log("📖 Topic mode - finding subject for topic:", activeId);
      subjectToCheck = await getSubjectIdForTopic(activeId); // Returns {id, name}
      console.log("📌 Found subject for topic:", subjectToCheck);
    }

    // Check if user has paid for the subject
    if (subjectToCheck) {
      console.log("🔐 Checking payment for subject:", subjectToCheck);
      const hasPaid = checkIfUserPaidForSubject(subjectToCheck); // Pass whole object or string
      
      if (!hasPaid) {
        const subjectId = typeof subjectToCheck === 'string' ? subjectToCheck : subjectToCheck.id;
        console.log("🔒 User has NOT paid for subject:", subjectId);
        set({ 
          paymentLocked: true, 
          loading: false,
          units: {
            ...get().units,
            [activeId]: {
              items: [],
              skip: 0,
              exhausted: true,
            },
          },
        });
        return;
      }
      
      const subjectId = typeof subjectToCheck === 'string' ? subjectToCheck : subjectToCheck.id;
      console.log("✅ User HAS paid for subject:", subjectId);
    } else {
      console.warn("⚠️ Could not determine subject to check");
    }

    const unit = units[activeId] || {
      items: [],
      skip: 0,
      exhausted: false,
    };

    if (unit.exhausted || state.paymentLocked) {
      console.log("⏹️ Skipping fetch - exhausted or payment locked");
      set({ loading: false });
      return;
    }

    console.log(`📥 Fetching more questions (skip: ${unit.skip}, current: ${unit.items.length})`);
    console.log(`📋 Using exam: ${saved.exam}, mode: ${saved.mode}`);
    set({ loading: true });

    try {
      const { fetchWithAuth } = useAuthStore.getState();

      const params = new URLSearchParams();
      params.append('category', saved.exam);
      params.append('limit', REQUEST_LIMIT);
      params.append('skip', unit.skip);

      if (saved.mode === "subject") {
        params.append('subjectId', activeId);
        
        const year = saved.subjectYears?.[activeId];
        if (year && year !== 'random') {
          params.append('year', year);
        } else if (year === 'random') {
          params.append('random', 'true');
        }
      } else if (saved.mode === "topic") {
        params.append('topicId', activeId);
        
        const year = saved.topicYears?.[activeId];
        if (year && year !== 'random') {
          params.append('year', year);
        } else if (year === 'random') {
          params.append('random', 'true');
        }
      }

      const url = `${API_BASE}/users/study-questions?${params.toString()}`;
      
      console.log("🌐 API URL:", url);

      const res = await fetchWithAuth(url);

      console.log("📦 API Response:", res);

      if (res?.status === 403 || res?.code === "PAYMENT_REQUIRED") {
        set({ paymentLocked: true, loading: false });
        console.log("🔥 Payment required detected (403 or PAYMENT_REQUIRED)");
        return;
      }

      const data = Array.isArray(res?.data) ? res.data : [];
      console.log(`✅ Received ${data.length} questions`);

      if (data.length === 0 && res?.accessInfo?.requiresUpgrade === true) {
        set({ 
          paymentLocked: true, 
          loading: false,
          units: {
            ...get().units,
            [activeId]: {
              ...unit,
              exhausted: true,
            },
          },
        });
        console.log("🔥 Free limit reached, upgrade required");
        return;
      }

      set((s) => ({
        units: {
          ...s.units,
          [activeId]: {
            items: [...unit.items, ...data],
            skip: unit.skip + data.length,
            exhausted: data.length < REQUEST_LIMIT,
          },
        },
        loading: false,
      }));
      
      console.log(`💾 Stored ${data.length} questions. Total now: ${unit.items.length + data.length}`);
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      
      if (
        err?.status === 403 ||
        err?.response?.status === 403 ||
        err?.message?.includes("403")
      ) {
        set({ paymentLocked: true, loading: false });
        return;
      }
      
      set({ loading: false });
    }
  },

  // ---------------- CHANGE ACTIVE ----------------
  changeActive: async (id) => {
    console.log("🔁 Changing active to:", id);
    
    set({
      activeId: id,
      currentIndex: 0,
      selectedOptions: {},
      paymentLocked: false,
    });

    const state = get();
    if (state.units[id] && state.units[id].items.length > 0) {
      console.log("✅ Already have questions for this ID, skipping fetch");
      set({ loading: false });
      return;
    }

    if (!state.units[id]) {
      set((s) => ({
        units: {
          ...s.units,
          [id]: {
            items: [],
            skip: 0,
            exhausted: false,
          },
        },
      }));
    }

    await new Promise(resolve => setTimeout(resolve, 50));
    
    await get().fetchMoreQuestions();
  },

  // ---------------- NAVIGATION ----------------
  next: async () => {
    const { currentIndex, paymentLocked } = get();
    if (paymentLocked) return;

    const unit = get().getUnit();

    if (currentIndex < unit.items.length - 1) {
      set({ currentIndex: currentIndex + 1 });
      return;
    }

    if (!unit.exhausted) {
      const before = unit.items.length;
      await get().fetchMoreQuestions();
      const after = get().getUnit().items.length;

      if (after > before) {
        set({ currentIndex: currentIndex + 1 });
        return;
      }
      
      const { paymentLocked: nowLocked } = get();
      if (nowLocked) {
        console.log("💳 Payment required to continue");
        return;
      }
    }

    if (unit.exhausted) {
      await get().goToNextUnit();
    }
  },

  prev: () =>
    set((s) => ({
      currentIndex: Math.max(0, s.currentIndex - 1),
    })),

  // ---------------- NEXT SUBJECT/TOPIC ----------------
  goToNextUnit: async () => {
    const ids = get().getOrderedIds();
    const { activeId } = get();

    const idx = ids.indexOf(activeId);
    if (idx === -1) return;

    const nextId = ids[idx + 1];
    if (!nextId) {
      console.log("✅ Study completed");
      alert('🎉 You have finished all!');
      return;
    }

    await get().changeActive(nextId);
  },

  // ---------------- FETCH SUBJECT NAMES ----------------
  fetchSubjectNames: async () => {
    const { saved } = get();
    if (!saved?.subjects?.length) return;

    console.log("📘 Fetching subject names");

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/users/my-topics`);
      
      if (!res?.data) return;

      const subjects = res.data;
      const names = {};

      subjects.forEach(subject => {
        if (saved.subjects.includes(subject.subjectId)) {
          names[subject.subjectId] = subject.subjectName;
        }
      });

      saved.subjects.forEach(id => {
        if (!names[id]) {
          names[id] = id;
        }
      });

      console.log("📗 Subject names:", names);
      set({ subjectNames: names });

    } catch (err) {
      console.error("❌ Failed to fetch subject names:", err);
      
      const names = {};
      saved.subjects.forEach(id => {
        names[id] = id;
      });
      set({ subjectNames: names });
    }
  },

  // ---------------- FETCH TOPIC NAMES ----------------
  fetchTopicNames: async () => {
    const { saved } = get();
    if (!saved?.topics) return;

    console.log("📙 Fetching topic names");

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/users/my-topics`);
      
      if (!res?.data) return;

      const subjects = res.data;
      const topicNames = {};
      const subjectNames = {};

      const savedTopicIds = Object.values(saved.topics).flat();

      subjects.forEach(subject => {
        subject.modules?.forEach(module => {
          module.topics?.forEach(topic => {
            if (savedTopicIds.includes(topic.topicId)) {
              topicNames[topic.topicId] = topic.topicName;
              
              Object.keys(saved.topics).forEach(subjectId => {
                if (saved.topics[subjectId].includes(topic.topicId)) {
                  subjectNames[subjectId] = subject.subjectName;
                }
              });
            }
          });
        });
      });

      savedTopicIds.forEach(id => {
        if (!topicNames[id]) {
          topicNames[id] = id;
        }
      });

      console.log("📕 Topic names:", topicNames);
      console.log("📗 Subject names from topics:", subjectNames);

      set((s) => ({
        topicNames,
        subjectNames: { ...s.subjectNames, ...subjectNames },
      }));

    } catch (err) {
      console.error("❌ Failed to fetch topic names:", err);
      
      const topicNames = {};
      const savedTopicIds = Object.values(saved.topics).flat();
      savedTopicIds.forEach(id => {
        topicNames[id] = id;
      });
      set({ topicNames });
    }
  },

  // ---------------- PAYMENT ----------------
  initializePayment: async () => {
    set({ paymentLoading: true });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(
        `${API_BASE}/payments/initialize`,
        { method: "POST" }
      );

      set({ paymentLoading: false });
      console.log("💳 Payment URL:", res.data.authorizationUrl);
      window.location.href = res.data.authorizationUrl;
    } catch (err) {
      console.error("❌ Payment init failed", err);
      set({ paymentLoading: false });
    }
  },

  // ---------------- STUDY SESSION ----------------
  startStudySession: async (savedData = null) => {
    const { saved: storeSaved, sessionActive } = get();
    const saved = savedData || storeSaved;
    
    if (!saved || sessionActive) {
      console.log("⏭️ No saved config or session already active", { saved, sessionActive });
      return null;
    }

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      
      let payload = {};

      if (saved.mode === "subject") {
        if (saved.subjects.length === 1) {
          payload.subjectId = saved.subjects[0];
        } else {
          payload.subjectId = saved.subjects;
        }
      } else if (saved.mode === "topic") {
        const allTopicIds = Object.values(saved.topics).flat();
        const subjectIds = Object.keys(saved.topics);

        if (subjectIds.length === 1 && allTopicIds.length === 1) {
          payload.subjectId = subjectIds[0];
          payload.topicIds = allTopicIds;
        } else {
          payload.subjectId = subjectIds;
          payload.topicIds = allTopicIds;
        }
      }

      console.log("🚀 Starting study session with payload:", payload);

      const res = await fetchWithAuth(`${API_BASE}/study/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res?.data?.sessionId) {
        set({ 
          sessionId: res.data.sessionId, 
          sessionActive: true 
        });
        console.log("✅ Study session started:", res.data.sessionId);
        return res.data.sessionId;
      }

      return null;
    } catch (err) {
      console.error("❌ Failed to start study session:", err);
      return null;
    }
  },

  submitAnswer: async (questionId, userChoice) => {
    const { sessionId, sessionActive } = get();
    
    if (!sessionActive || !sessionId) {
      console.warn("⚠️ No active session, cannot submit answer");
      return false;
    }

    try {
      const { fetchWithAuth } = useAuthStore.getState();

      const payload = {
        sessionId,
        questionId,
        userChoice,
      };

      console.log("📤 Submitting answer:", payload);

      const res = await fetchWithAuth(`${API_BASE}/study/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("✅ Answer submitted:", res);
      return true;
    } catch (err) {
      console.error("❌ Failed to submit answer:", err);
      return false;
    }
  },

  endStudySession: async () => {
    const { sessionId, sessionActive } = get();
    
    if (!sessionActive || !sessionId) {
      console.log("⏭️ No active session to end");
      return;
    }

    try {
      const { fetchWithAuth } = useAuthStore.getState();

      const payload = { sessionId };

      console.log("🛑 Ending study session:", sessionId);

      await fetchWithAuth(`${API_BASE}/study/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      set({ 
        sessionId: null, 
        sessionActive: false 
      });

      console.log("✅ Study session ended");
    } catch (err) {
      console.error("❌ Failed to end study session:", err);
    }
  },
}));






// import { create } from "zustand";
// import useAuthStore from "./authStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
// const REQUEST_LIMIT = 20;

// export const useStudyStore = create((set, get) => ({
//   // ---------------- STATE ----------------
//   saved: null,
//   activeId: null,
//   units: {},
//   currentIndex: 0,
//   selectedOptions: {},
//   subjectNames: {},
//   topicNames: {},
//   loading: false,
//   paymentLocked: false,
//   paymentLoading: false,
//   initialized: false, // Track if already initialized
//   sessionId: null, // Track active study session
//   sessionActive: false, // Is session running

//   // ---------------- RESET ----------------
//   reset: () => {
//     const state = get();
//     console.log("🧹 Resetting store, initialized was:", state.initialized);
    
//     set({
//       saved: null,
//       activeId: null,
//       units: {},
//       currentIndex: 0,
//       selectedOptions: {},
//       subjectNames: {},
//       topicNames: {},
//       paymentLocked: false,
//       initialized: false,
//       sessionId: null,
//       sessionActive: false,
//       loading: false, // Important: reset loading too
//     });
//   },

//   // ---------------- LOAD SAVED ----------------
//   syncSaved: async () => {
//     const state = get();
    
//     // More lenient check - only skip if currently in the middle of loading
//     if (state.loading && state.initialized) {
//       console.log("⏭️ Currently loading, skipping duplicate call");
//       return null;
//     }
    
//     // If initialized but not loading, allow re-init (handles StrictMode remount)
//     if (state.initialized && !state.loading) {
//       console.log("🔄 Re-initializing after reset");
//       set({ initialized: false }); // Reset the flag
//     }

//     console.log("🔄 Starting syncSaved...");

//     const saved = JSON.parse(localStorage.getItem("studySelections"));
//     console.log("📦 Loaded from localStorage:", saved);
    
//     if (!saved) {
//       console.warn("⚠️ No saved data in localStorage");
//       set({ loading: false });
//       return null;
//     }

//     set({ saved, initialized: true, loading: true });

//     try {
//       console.log("📘 Fetching names for mode:", saved.mode);
      
//       // Fetch names based on mode
//       if (saved.mode === "subject") {
//         await get().fetchSubjectNames();
//       } else {
//         await get().fetchTopicNames();
//       }

//       // Set first active item
//       const firstId =
//         saved.mode === "subject"
//           ? saved.subjects?.[0]
//           : Object.values(saved.topics || {})[0]?.[0];

//       console.log("🎯 First active ID:", firstId);

//       if (firstId) {
//         await get().changeActive(firstId);
//         // Ensure loading is set to false after changeActive completes
//         setTimeout(() => {
//           const currentState = get();
//           if (currentState.loading) {
//             console.log("⚠️ Force setting loading to false");
//             set({ loading: false });
//           }
//         }, 200); // Increased delay
//       } else {
//         console.warn("⚠️ No first ID found");
//         set({ loading: false });
//       }
      
//       return saved; // Return saved data
//     } catch (error) {
//       console.error("❌ Error in syncSaved:", error);
//       set({ loading: false });
//       return null;
//     }
//   },

//   // ---------------- HELPERS ----------------
//   getOrderedIds: () => {
//     const { saved } = get();
//     if (!saved) return [];

//     if (saved.mode === "subject") {
//       return saved.subjects || [];
//     }

//     return Object.values(saved.topics || {}).flat();
//   },

//   getUnit: () => {
//     const { activeId, units } = get();
//     return (
//       units[activeId] || {
//         items: [],
//         skip: 0,
//         exhausted: false,
//       }
//     );
//   },

//   getQuestions: () => get().getUnit().items,

//   // ---------------- SELECTION ----------------
//   setSelectedOption: (questionId, optionId) =>
//     set((s) => ({
//       selectedOptions: {
//         ...s.selectedOptions,
//         [questionId]: optionId,
//       },
//     })),

//   // ---------------- FETCH QUESTIONS (NEW ENDPOINT) ----------------
//   fetchMoreQuestions: async () => {
//     const state = get();
//     const { saved, activeId, units } = state;
    
//     console.log("🔍 fetchMoreQuestions called - saved:", !!saved, "activeId:", activeId);
    
//     if (!saved || !activeId) {
//       console.log("⏹️ No saved or activeId, cannot fetch", { saved: !!saved, activeId });
//       set({ loading: false });
//       return;
//     }

//     const unit = units[activeId] || {
//       items: [],
//       skip: 0,
//       exhausted: false,
//     };

//     if (unit.exhausted || state.paymentLocked) {
//       console.log("⏹️ Skipping fetch - exhausted or payment locked");
//       set({ loading: false });
//       return;
//     }

//     console.log(`📥 Fetching more questions (skip: ${unit.skip}, current: ${unit.items.length})`);
//     console.log(`📋 Using exam: ${saved.exam}, mode: ${saved.mode}`);
//     set({ loading: true });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       // Build query parameters
//       const params = new URLSearchParams();
//       params.append('category', saved.exam);
//       params.append('limit', REQUEST_LIMIT);
//       params.append('skip', unit.skip);

//       // Handle subject mode vs topic mode
//       if (saved.mode === "subject") {
//         // Add subject ID
//         params.append('subjectId', activeId);
        
//         // Add year if specified
//         const year = saved.subjectYears?.[activeId];
//         if (year && year !== 'random') {
//           params.append('year', year);
//         } else if (year === 'random') {
//           params.append('random', 'true');
//         }
//       } else if (saved.mode === "topic") {
//         // Add topic ID
//         params.append('topicId', activeId);
        
//         // Add year if specified
//         const year = saved.topicYears?.[activeId];
//         if (year && year !== 'random') {
//           params.append('year', year);
//         } else if (year === 'random') {
//           params.append('random', 'true');
//         }
//       }

//       const url = `${API_BASE}/users/study-questions?${params.toString()}`;
      
//       console.log("🌐 API URL:", url);

//       const res = await fetchWithAuth(url);

//       console.log("📦 API Response:", res);

//       // ---- PAYMENT LOCK ----
//       if (res?.status === 403 || res?.code === "PAYMENT_REQUIRED") {
//         set({ paymentLocked: true, loading: false });
//         console.log("🔥 Payment required detected (403 or PAYMENT_REQUIRED)");
//         return;
//       }

//       const data = Array.isArray(res?.data) ? res.data : [];
//       console.log(`✅ Received ${data.length} questions`);

//       // If no data returned AND requires upgrade, then lock payment
//       if (data.length === 0 && res?.accessInfo?.requiresUpgrade === true) {
//         set({ 
//           paymentLocked: true, 
//           loading: false,
//           units: {
//             ...get().units,
//             [activeId]: {
//               ...unit,
//               exhausted: true,
//             },
//           },
//         });
//         console.log("🔥 Free limit reached, upgrade required");
//         return;
//       }

//       // If we got questions, store them
//       set((s) => ({
//         units: {
//           ...s.units,
//           [activeId]: {
//             items: [...unit.items, ...data],
//             skip: unit.skip + data.length,
//             exhausted: data.length < REQUEST_LIMIT,
//           },
//         },
//         loading: false,
//       }));
      
//       console.log(`💾 Stored ${data.length} questions. Total now: ${unit.items.length + data.length}`);
//     } catch (err) {
//       console.error("❌ Fetch failed:", err);
      
//       if (
//         err?.status === 403 ||
//         err?.response?.status === 403 ||
//         err?.message?.includes("403")
//       ) {
//         set({ paymentLocked: true, loading: false });
//         return;
//       }
      
//       set({ loading: false });
//     }
//   },

//   // ---------------- CHANGE ACTIVE ----------------
//   changeActive: async (id) => {
//     console.log("🔁 Changing active to:", id);
    
//     set({
//       activeId: id,
//       currentIndex: 0,
//       selectedOptions: {},
//       paymentLocked: false,
//     });

//     // Check if we already have questions for this ID
//     const state = get();
//     if (state.units[id] && state.units[id].items.length > 0) {
//       console.log("✅ Already have questions for this ID, skipping fetch");
//       set({ loading: false }); // Make sure loading is false
//       return;
//     }

//     // Initialize unit if doesn't exist
//     if (!state.units[id]) {
//       set((s) => ({
//         units: {
//           ...s.units,
//           [id]: {
//             items: [],
//             skip: 0,
//             exhausted: false,
//           },
//         },
//       }));
//     }

//     // Small delay to ensure Zustand state has propagated
//     await new Promise(resolve => setTimeout(resolve, 50));
    
//     await get().fetchMoreQuestions();
//   },

//   // ---------------- NAVIGATION ----------------
//   next: async () => {
//     const { currentIndex, paymentLocked } = get();
//     if (paymentLocked) return;

//     const unit = get().getUnit();

//     // Move within fetched questions
//     if (currentIndex < unit.items.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//       return;
//     }

//     // We're at the last question, try to fetch more
//     if (!unit.exhausted) {
//       const before = unit.items.length;
//       await get().fetchMoreQuestions();
//       const after = get().getUnit().items.length;

//       // Check if we got new questions
//       if (after > before) {
//         // Got new questions, move to next
//         set({ currentIndex: currentIndex + 1 });
//         return;
//       }
      
//       // No new questions came, but check if payment is now locked
//       const { paymentLocked: nowLocked } = get();
//       if (nowLocked) {
//         // Payment required, stay on current question
//         console.log("💳 Payment required to continue");
//         return;
//       }
//     }

//     // Try moving to next subject/topic only if not exhausted
//     if (unit.exhausted) {
//       await get().goToNextUnit();
//     }
//   },

//   prev: () =>
//     set((s) => ({
//       currentIndex: Math.max(0, s.currentIndex - 1),
//     })),

//   // ---------------- NEXT SUBJECT/TOPIC ----------------
//   goToNextUnit: async () => {
//     const ids = get().getOrderedIds();
//     const { activeId } = get();

//     const idx = ids.indexOf(activeId);
//     if (idx === -1) return;

//     const nextId = ids[idx + 1];
//     if (!nextId) {
//       console.log("✅ Study completed");
//       alert('🎉 You have finished all!');
//       return;
//     }

//     await get().changeActive(nextId);
//   },

//   // ---------------- FETCH SUBJECT NAMES (FROM API) ----------------
//   fetchSubjectNames: async () => {
//     const { saved } = get();
//     if (!saved?.subjects?.length) return;

//     console.log("📘 Fetching subject names");

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
      
//       // Fetch user's topics which contains subject info
//       const res = await fetchWithAuth(`${API_BASE}/users/my-topics`);
      
//       if (!res?.data) return;

//       const subjects = res.data;
//       const names = {};

//       // Map subject IDs to names from API response
//       subjects.forEach(subject => {
//         if (saved.subjects.includes(subject.subjectId)) {
//           names[subject.subjectId] = subject.subjectName;
//         }
//       });

//       // Fallback for IDs not found in API
//       saved.subjects.forEach(id => {
//         if (!names[id]) {
//           names[id] = id;
//         }
//       });

//       console.log("📗 Subject names:", names);
//       set({ subjectNames: names });

//     } catch (err) {
//       console.error("❌ Failed to fetch subject names:", err);
      
//       // Fallback: use IDs as names
//       const names = {};
//       saved.subjects.forEach(id => {
//         names[id] = id;
//       });
//       set({ subjectNames: names });
//     }
//   },

//   // ---------------- FETCH TOPIC NAMES (FROM API) ----------------
//   fetchTopicNames: async () => {
//     const { saved } = get();
//     if (!saved?.topics) return;

//     console.log("📙 Fetching topic names");

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
      
//       // Fetch user's topics
//       const res = await fetchWithAuth(`${API_BASE}/users/my-topics`);
      
//       if (!res?.data) return;

//       const subjects = res.data;
//       const topicNames = {};
//       const subjectNames = {};

//       // Get all topic IDs from saved
//       const savedTopicIds = Object.values(saved.topics).flat();

//       // Map topic IDs to names from API response
//       subjects.forEach(subject => {
//         subject.modules?.forEach(module => {
//           module.topics?.forEach(topic => {
//             if (savedTopicIds.includes(topic.topicId)) {
//               topicNames[topic.topicId] = topic.topicName;
              
//               // Also get subject name for this topic
//               Object.keys(saved.topics).forEach(subjectId => {
//                 if (saved.topics[subjectId].includes(topic.topicId)) {
//                   subjectNames[subjectId] = subject.subjectName;
//                 }
//               });
//             }
//           });
//         });
//       });

//       // Fallback for IDs not found in API
//       savedTopicIds.forEach(id => {
//         if (!topicNames[id]) {
//           topicNames[id] = id;
//         }
//       });

//       console.log("📕 Topic names:", topicNames);
//       console.log("📗 Subject names from topics:", subjectNames);

//       set((s) => ({
//         topicNames,
//         subjectNames: { ...s.subjectNames, ...subjectNames },
//       }));

//     } catch (err) {
//       console.error("❌ Failed to fetch topic names:", err);
      
//       // Fallback: use IDs as names
//       const topicNames = {};
//       const savedTopicIds = Object.values(saved.topics).flat();
//       savedTopicIds.forEach(id => {
//         topicNames[id] = id;
//       });
//       set({ topicNames });
//     }
//   },

//   // ---------------- PAYMENT ----------------
//   initializePayment: async () => {
//     set({ paymentLoading: true });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(
//         `${API_BASE}/payments/initialize`,
//         { method: "POST" }
//       );

//       set({ paymentLoading: false });
//       console.log("💳 Payment URL:", res.data.authorizationUrl);
//       window.location.href = res.data.authorizationUrl;
//     } catch (err) {
//       console.error("❌ Payment init failed", err);
//       set({ paymentLoading: false });
//     }
//   },

//   // ---------------- STUDY SESSION ----------------
//   // Start a study session
//   startStudySession: async (savedData = null) => {
//     const { saved: storeSaved, sessionActive } = get();
//     const saved = savedData || storeSaved; // Use parameter or store state
    
//     if (!saved || sessionActive) {
//       console.log("⏭️ No saved config or session already active", { saved, sessionActive });
//       return null;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
      
//       let payload = {};

//       if (saved.mode === "subject") {
//         // Subject mode
//         if (saved.subjects.length === 1) {
//           // Single subject
//           payload.subjectId = saved.subjects[0];
//         } else {
//           // Multiple subjects
//           payload.subjectId = saved.subjects;
//         }
//       } else if (saved.mode === "topic") {
//         // Topic mode
//         const allTopicIds = Object.values(saved.topics).flat();
//         const subjectIds = Object.keys(saved.topics);

//         if (subjectIds.length === 1 && allTopicIds.length === 1) {
//           // Single topic
//           payload.subjectId = subjectIds[0];
//           payload.topicIds = allTopicIds;
//         } else {
//           // Multiple topics
//           payload.subjectId = subjectIds;
//           payload.topicIds = allTopicIds;
//         }
//       }

//       console.log("🚀 Starting study session with payload:", payload);

//       const res = await fetchWithAuth(`${API_BASE}/study/start`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (res?.data?.sessionId) {
//         set({ 
//           sessionId: res.data.sessionId, 
//           sessionActive: true 
//         });
//         console.log("✅ Study session started:", res.data.sessionId);
//         return res.data.sessionId;
//       }

//       return null;
//     } catch (err) {
//       console.error("❌ Failed to start study session:", err);
//       return null;
//     }
//   },

//   // Submit an answer
//   submitAnswer: async (questionId, userChoice) => {
//     const { sessionId, sessionActive } = get();
    
//     if (!sessionActive || !sessionId) {
//       console.warn("⚠️ No active session, cannot submit answer");
//       return false;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const payload = {
//         sessionId,
//         questionId,
//         userChoice,
//       };

//       console.log("📤 Submitting answer:", payload);

//       const res = await fetchWithAuth(`${API_BASE}/study/answer`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       console.log("✅ Answer submitted:", res);
//       return true;
//     } catch (err) {
//       console.error("❌ Failed to submit answer:", err);
//       return false;
//     }
//   },

//   // End study session
//   endStudySession: async () => {
//     const { sessionId, sessionActive } = get();
    
//     if (!sessionActive || !sessionId) {
//       console.log("⏭️ No active session to end");
//       return;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const payload = { sessionId };

//       console.log("🛑 Ending study session:", sessionId);

//       await fetchWithAuth(`${API_BASE}/study/end`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       set({ 
//         sessionId: null, 
//         sessionActive: false 
//       });

//       console.log("✅ Study session ended");
//     } catch (err) {
//       console.error("❌ Failed to end study session:", err);
//     }
//   },
// }));








