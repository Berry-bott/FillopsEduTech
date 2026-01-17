import { create } from "zustand";
import useAuthStore from "./authStore";
import { usePaymentStore } from "./paymentStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
const REQUEST_LIMIT = 40;
const FREE_QUESTIONS_LIMIT = 5; // Free trial limit for exams
let navigationCallback = null;



// Add this function to set navigation callback
export const setExamNavigationCallback = (callback) => {
  navigationCallback = callback;
  console.log("✅ Navigation callback registered");
};
// ✅ Check if user has used their free exam questions
function hasUsedFreeExamQuestions() {
  const freeQuestionsUsed = localStorage.getItem('freeExamQuestionsUsed');
  const count = parseInt(freeQuestionsUsed || '0', 10);
  console.log(`📊 Free exam questions used: ${count}/${FREE_QUESTIONS_LIMIT}`);
  return count >= FREE_QUESTIONS_LIMIT;
}

// ✅ Increment free exam questions counter
function incrementFreeExamQuestionsCount(questionsCount) {
  const current = parseInt(localStorage.getItem('freeExamQuestionsUsed') || '0', 10);
  const newCount = current + questionsCount;
  localStorage.setItem('freeExamQuestionsUsed', newCount.toString());
  console.log(`📈 Free exam questions count: ${current} → ${newCount}`);
  return newCount;
}

// ✅ STRICT CHECK: Must match EXACT subject ID + category
function checkIfUserPaidForSubject(subjectInfo, category) {
  const paymentState = usePaymentStore.getState();
  
  console.log("\n================================");
  console.log("🔍 STRICT PAYMENT CHECK (EXAM)");
  console.log("================================");
  
  const subjectId = typeof subjectInfo === 'string' ? subjectInfo : subjectInfo?.id;
  const subjectName = typeof subjectInfo === "string" ? null : subjectInfo?.subjectName;

  console.log("Looking for EXACT match:");
  console.log("  - Required Subject ID:", subjectId);
  console.log("  - Subject Name:", subjectName);
  console.log("  - Required Category:", category);
  
  let activeSubscriptions = [];
  
  if (paymentState.activeSubscriptions) {
    activeSubscriptions = paymentState.activeSubscriptions;
  } else if (paymentState.subscriptions?.active) {
    activeSubscriptions = paymentState.subscriptions.active;
  } else if (paymentState.active) {
    activeSubscriptions = paymentState.active;
  }
  
  console.log("\n📋 Active Subscriptions:", activeSubscriptions.length);
  
  if (!activeSubscriptions || activeSubscriptions.length === 0) {
    console.log("❌ No active subscriptions found");
    console.log("================================\n");
    return false;
  }
  
  console.log("\n🔍 Checking each subscription:");
  
  const hasPaid = activeSubscriptions.some((sub, index) => {
    console.log(`\n  Subscription ${index + 1}: ${sub.subjectName}`);
    console.log(`    - Subscription Subject ID: ${sub.subjectId}`);
    console.log(`    - Subscription Category: ${sub.category}`);
    
    const idMatches = sub.subjectId === subjectId || 
                     sub.id === subjectId || 
                     sub._id === subjectId;
    
    const categoryMatches = !category || sub.category === category;
    const matches = idMatches && categoryMatches;
    
    console.log(`    - ID Match: ${idMatches}`);
    console.log(`    - Category Match: ${categoryMatches}`);
    console.log(`    - Result: ${matches ? '✅ MATCH!' : '❌ No match'}`);
    
    if (matches) {
      console.log("\n🎉 EXACT MATCH FOUND!");
      console.log(`   User HAS paid for: ${sub.subjectName}`);
    }
    
    return matches;
  });
  
  if (!hasPaid) {
    console.log("\n❌ ACCESS DENIED - NO MATCHING SUBSCRIPTION");
  }
  
  console.log("\n================================");
  console.log(`FINAL RESULT: ${hasPaid ? '✅ ACCESS GRANTED' : '❌ ACCESS DENIED'}`);
  console.log("================================\n");
  
  return hasPaid;
}

async function getSubjectInfoForTopic(topicId, userSelectedCategory) {
  console.log("\n🔍 ========================================");
  console.log("🔍 GET SUBJECT INFO FOR TOPIC");
  console.log("🔍 ========================================");
  console.log("Looking for Topic ID:", topicId);
  console.log("User Selected Category:", userSelectedCategory);
  
  const { accessToken } = useAuthStore.getState();
  
  if (!accessToken) {
    console.error("❌ No access token!");
    return null;
  }
  
  if (!topicId) {
    console.error("❌ No topic ID provided!");
    return null;
  }

  try {
    // ✅ FIX: Use /my-topics instead of /my-subjects
    console.log("\n📡 Fetching topics with modules...");
    const response = await fetch(`${API_BASE}/users/my-topics`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      console.error("❌ Failed to fetch topics:", response.status);
      return null;
    }

    const data = await response.json();
    const subjects = data.data || [];
    
    console.log(`📚 Found ${subjects.length} subjects with topics`);

    // Filter by category if provided
    const filteredSubjects = userSelectedCategory 
      ? subjects.filter(s => s.category === userSelectedCategory.toUpperCase())
      : subjects;

    console.log(`🔍 Searching ${filteredSubjects.length} subjects for ${userSelectedCategory}...`);

    // Search for the topic
    for (let i = 0; i < filteredSubjects.length; i++) {
      const subject = filteredSubjects[i];
      console.log(`\n  Checking subject ${i + 1}/${filteredSubjects.length}: ${subject.subjectName} (ID: ${subject.subjectId})`);
      
      if (!subject.modules) {
        console.warn(`  ⚠️ No modules in subject`);
        continue;
      }
      
      console.log(`  🔍 Searching through ${subject.modules.length} modules...`);
      
      for (const module of subject.modules) {
        if (!module.topics || module.topics.length === 0) continue;
        
        for (const topic of module.topics) {
          const topicIdMatch = topic.topicId === topicId || 
                              topic.id === topicId || 
                              topic._id === topicId;
          
          if (topicIdMatch) {
            console.log("\n🎉 ========================================");
            console.log("🎉 TOPIC FOUND!");
            console.log("🎉 ========================================");
            console.log("Topic Name:", topic.topicName);
            console.log("Module Name:", module.moduleName);
            console.log("Subject Name:", subject.subjectName);
            console.log("Subject ID:", subject.subjectId);
            console.log("Category:", subject.category);
            console.log("========================================\n");
            
            return {
              id: subject.subjectId,
              subjectName: subject.subjectName,
              category: subject.category || userSelectedCategory
            };
          }
        }
      }
    }

    console.log("\n❌ TOPIC NOT FOUND IN ANY SUBJECT");
    console.log("Searched through subjects in category:", userSelectedCategory);
    console.log("Looking for topic ID:", topicId);
    console.log("========================================\n");
    
    return null;
  } catch (error) {
    console.error("\n❌ ERROR IN getSubjectInfoForTopic:", error);
    return null;
  }
}

export const useExamStore = create((set, get) => ({
  // ---------------- STATE ----------------
  saved: null,
  activeId: null,
  units: {},
  currentIndex: 0,
  selectedAnswers: {}, // Store all user answers during exam
  subjectNames: {},
  topicNames: {},
  loading: false,
  paymentLocked: false,
  paymentLoading: false,
  initialized: false,
  examId: null, // Active exam session ID
  examActive: false,
  examStartTime: null,
  examDuration: null, // in minutes
  timeRemaining: null, // in seconds
  timerId: null, // Store interval ID for cleanup
  freeTrialActive: !hasUsedFreeExamQuestions(),
  examCompleted: false,
  examResults: null,

  // ---------------- RESET ----------------
  reset: () => {
    console.log("🧹 Resetting exam store");
    
    set({
      saved: null,
      activeId: null,
      units: {},
      currentIndex: 0,
      selectedAnswers: {},
      subjectNames: {},
      topicNames: {},
      paymentLocked: false,
      initialized: false,
      examId: null,
      examActive: false,
      examStartTime: null,
      examDuration: null,
      timeRemaining: null,
      loading: false,
      freeTrialActive: !hasUsedFreeExamQuestions(),
      examCompleted: false,
      examResults: null,
    });
  },

  // ---------------- LOAD SAVED ----------------
  syncSaved: async () => {
  const state = get();
  
  if (state.loading && state.initialized) {
    console.log("⏭️ Already loading");
    return null;
  }
  
  if (state.initialized && !state.loading) {
    console.log("🔄 Re-initializing");
    set({ initialized: false });
  }

  console.log("\n📝 ========================================");
  console.log("📝 SYNCING EXAM CONFIGURATION");
  console.log("📝 ========================================");

  const saved = JSON.parse(localStorage.getItem("studySelections"));
  
  if (!saved) {
    console.warn("⚠️ ========================================");
    console.warn("⚠️ NO SAVED EXAM DATA FOUND");
    console.warn("⚠️ ========================================");
    console.warn("⚠️ localStorage key 'examSelections' is empty");
    console.warn("⚠️ User needs to configure exam first");
    console.warn("⚠️ ========================================\n");
    set({ loading: false });
    return null;
  }

  console.log("📦 Exam Configuration Loaded:");
  console.log("  - Mode:", saved.mode);
  console.log("  - Category:", saved.exam);
  console.log("  - Duration:", saved.duration, "minutes");
  if (saved.mode === "subject") {
    console.log("  - Subjects:", saved.subjects);
  } else {
    console.log("  - Topics:", Object.keys(saved.topics || {}).length, "subjects with topics");
  }

  set({ 
    saved, 
    initialized: true, 
    loading: true,
    examDuration: saved.duration,
    freeTrialActive: !hasUsedFreeExamQuestions() 
  });

  try {
    console.log("\n📚 Fetching subject/topic names...");
    
    if (saved.mode === "subject") {
      await get().fetchSubjectNames();
    } else {
      await get().fetchTopicNames();
    }

    // ✅ DECLARE firstId HERE
    const firstId = saved.mode === "subject"
      ? saved.subjects?.[0]
      : Object.values(saved.topics || {})[0]?.[0];

    console.log("🎯 First ID to load:", firstId);

    if (firstId) {
      console.log("🔄 Setting first active ID (not fetching questions yet)...");
      
      // ✅ Just set the activeId, don't fetch questions
      set({ 
        activeId: firstId,
        currentIndex: 0,
        loading: false,
        paymentLocked: false // ✅ Don't lock yet
      });
      
      // Don't call changeActive() or fetchMoreQuestions()
      // Let startExam() handle loading the questions
    } else {
      console.warn("⚠️ No first ID found");
      set({ loading: false });
    }
    
    console.log("✅ ========================================");
    console.log("✅ SYNC COMPLETE");
    console.log("✅ ========================================\n");
    
    return saved;
  } catch (error) {
    console.error("❌ ========================================");
    console.error("❌ ERROR IN SYNC");
    console.error("❌ ========================================");
    console.error("❌ Error:", error);
    console.error("❌ ========================================\n");
    set({ loading: false });
    return null;
  }
},

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

  // ---------------- ANSWER SELECTION ----------------
  setSelectedAnswer: (questionId, optionId) =>
    set((s) => ({
      selectedAnswers: {
        ...s.selectedAnswers,
        [questionId]: optionId,
      },
    })),

  // Get all questions across all units

  // ✅ NEW: Get questions for CURRENT active ID only
    getActiveQuestions: () => {
    const { activeId, units } = get();
    if (!activeId || !units[activeId]) {
        return [];
    }
    return units[activeId].items || [];
    },

  getAllQuestions: () => {
    const { units } = get();
    return Object.values(units).flatMap(unit => unit.items);
  },

getAnsweredCount: () => {
  const { selectedAnswers, activeId, units } = get();
  if (!activeId || !units[activeId]) return 0;
  
  const activeQuestions = units[activeId].items || [];
  const activeQuestionIds = activeQuestions.map(q => q.id);
  
  return Object.keys(selectedAnswers).filter(id => 
    activeQuestionIds.includes(id)
  ).length;
},

  // ---------------- FETCH QUESTIONS (WITH FREE TRIAL) ----------------
  fetchMoreQuestions: async () => {
    const state = get();
    const { saved, activeId, units, freeTrialActive, examActive } = state;
    
    console.log("\n🔍 ========================================");
    console.log("🔍 FETCH MORE EXAM QUESTIONS");
    console.log("🔍 ========================================");
    console.log("Active ID:", activeId);
    console.log("Mode:", saved?.mode);
    console.log("🎁 Free Trial Active:", freeTrialActive);
    console.log("📝 Exam Active:", examActive);
    
    if (!saved || !activeId) {
      console.log("❌ No saved or activeId");
      set({ loading: false });
      return;
    }

    const category = saved.exam;
    console.log("Category:", category);

    let subjectInfo = null;
    
    if (saved.mode === "subject") {
      subjectInfo = {
        id: activeId,
        category: category
      };
      console.log("📚 Subject mode - checking subject:", activeId);
    } else if (saved.mode === "topic") {
      console.log("📖 Topic mode - finding parent subject...");
      
      subjectInfo = await getSubjectInfoForTopic(activeId, category);
      
      if (!subjectInfo) {
        console.error("❌ Could not find subject for topic:", activeId);
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
      
      console.log("✅ Found parent subject:", subjectInfo.subjectName);
      console.log("   Subject ID:", subjectInfo.id);
    }

    // ✅ PAYMENT CHECK: Check free trial FIRST
    const usedCount = parseInt(localStorage.getItem('freeExamQuestionsUsed') || '0', 10);
    const hasFreeTrial = usedCount < FREE_QUESTIONS_LIMIT;
    
    console.log(`\n📊 ========================================`);
    console.log(`📊 FREE TRIAL CHECK`);
    console.log(`📊 ========================================`);
    console.log(`📊 Free questions used: ${usedCount}/${FREE_QUESTIONS_LIMIT}`);
    console.log(`📊 Has free trial: ${hasFreeTrial}`);
    console.log(`📊 ========================================\n`);
    
    if (hasFreeTrial) {
      console.log(`🎁 ========================================`);
      console.log(`🎁 FREE TRIAL ACTIVE`);
      console.log(`🎁 ========================================`);
      console.log(`🎁 User still has free questions remaining`);
      console.log(`🎁 Skipping payment check`);
      console.log(`🎁 Proceeding to fetch questions...`);
      console.log(`🎁 ========================================\n`);
      
      // Update freeTrialActive if it changed
      if (!freeTrialActive) {
        set({ freeTrialActive: true });
      }
    } else {
      // ✅ Free trial exhausted - Check payment status
      console.log(`\n💳 ========================================`);
      console.log(`💳 FREE TRIAL EXHAUSTED`);
      console.log(`💳 ========================================`);
      
      // Get current payment state (subscriptions should already be loaded by paymentStore)
      const paymentStore = usePaymentStore.getState();
      
      console.log("💳 Checking current payment state...");
      console.log("💳 Active subscriptions count:", paymentStore.activeSubscriptions?.length || 0);
      
      // If no subscriptions loaded yet, wait a moment for them to load
      if (!paymentStore.activeSubscriptions || paymentStore.activeSubscriptions.length === 0) {
        console.log("💳 No subscriptions in state yet, waiting 500ms...");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Check again after waiting
        const updatedState = usePaymentStore.getState();
        console.log("💳 After wait, subscriptions count:", updatedState.activeSubscriptions?.length || 0);
      }
      
      console.log("💳 Now checking access with current subscription data...");
      
      if (subjectInfo) {
        const hasPaid = checkIfUserPaidForSubject(subjectInfo, category);
        
        if (!hasPaid) {
          console.log("\n🚫 ========================================");
          console.log("🚫 PAYMENT REQUIRED - ACCESS DENIED");
          console.log("🚫 ========================================");
          console.log("🚫 User has not paid for this subject/topic");
          console.log("🚫 Locking questions and showing payment screen");
          console.log("🚫 ========================================\n");
          
          set({ 
            paymentLocked: true, 
            loading: false,
            freeTrialActive: false,
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
        
        console.log("\n✅ ========================================");
        console.log("✅ ACCESS GRANTED - PAYMENT VERIFIED");
        console.log("✅ ========================================");
        console.log("✅ User has valid subscription");
        console.log("✅ Proceeding to fetch questions...");
        console.log("✅ ========================================\n");
      }
      
      // Update freeTrialActive
      if (freeTrialActive) {
        set({ freeTrialActive: false });
      }
    }

    const unit = units[activeId] || {
      items: [],
      skip: 0,
      exhausted: false,
    };

    if (unit.exhausted || state.paymentLocked) {
      console.log("⏹️ Already exhausted or locked");
      set({ loading: false });
      return;
    }

    console.log(`📥 Fetching exam questions (skip: ${unit.skip})`);
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
        
        if (subjectInfo?.id) {
          params.append('subjectId', subjectInfo.id);
        }
        
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

      if (res?.status === 403 || res?.code === "PAYMENT_REQUIRED") {
        console.log("\n🔥 API RETURNED 403 FORBIDDEN");
        set({ paymentLocked: true, loading: false, freeTrialActive: false });
        return;
      }

      const data = Array.isArray(res?.data) ? res.data : [];
      console.log(`✅ Received ${data.length} questions`);

      // ✅ Update free questions counter if still in trial mode
      const stillHasFreeTrial = parseInt(localStorage.getItem('freeExamQuestionsUsed') || '0', 10) < FREE_QUESTIONS_LIMIT;
      
      if (stillHasFreeTrial && data.length > 0) {
        const newCount = incrementFreeExamQuestionsCount(data.length);
        
        console.log(`\n🎁 ========================================`);
        console.log(`🎁 FREE TRIAL USAGE UPDATE`);
        console.log(`🎁 ========================================`);
        console.log(`🎁 Questions fetched: ${data.length}`);
        console.log(`🎁 Total used now: ${newCount}/${FREE_QUESTIONS_LIMIT}`);
        
        if (newCount >= FREE_QUESTIONS_LIMIT) {
          console.log(`🎁 FREE TRIAL NOW EXHAUSTED!`);
          console.log(`🎁 Future fetches will require payment`);
          set({ freeTrialActive: false });
        } else {
          console.log(`🎁 Still have ${FREE_QUESTIONS_LIMIT - newCount} free questions`);
        }
        
        console.log(`🎁 ========================================\n`);
      }

      if (data.length === 0 && res?.accessInfo?.requiresUpgrade === true) {
        set({ 
          paymentLocked: true, 
          loading: false,
          freeTrialActive: false,
          units: {
            ...get().units,
            [activeId]: {
              ...unit,
              exhausted: true,
            },
          },
        });
        console.log("🔥 Free limit reached");
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
      
      console.log(`💾 Total questions: ${unit.items.length + data.length}`);
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      
      if (
        err?.status === 403 ||
        err?.response?.status === 403 ||
        err?.message?.includes("403")
      ) {
        set({ paymentLocked: true, loading: false, freeTrialActive: false });
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
      paymentLocked: false,
    });

    const state = get();
    if (state.units[id] && state.units[id].items.length > 0) {
      console.log("✅ Already have questions");
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

  // Add these methods to your examStore.js

// ✅ Check if there are more subjects/topics to navigate to
hasNextSubjectOrTopic: () => {
  const { saved, activeId } = get();
  if (!saved) return false;

  const orderedIds = get().getOrderedIds();
  const currentIdx = orderedIds.indexOf(activeId);
  
  console.log("📊 Checking for next subject/topic:");
  console.log("  Current ID:", activeId);
  console.log("  Current Index:", currentIdx);
  console.log("  Total IDs:", orderedIds.length);
  console.log("  Has Next:", currentIdx < orderedIds.length - 1);
  
  return currentIdx >= 0 && currentIdx < orderedIds.length - 1;
},

// ✅ Move to the next subject/topic
moveToNextSubjectOrTopic: async () => {
  const { saved, activeId } = get();
  if (!saved) return false;

  const orderedIds = get().getOrderedIds();
  const currentIdx = orderedIds.indexOf(activeId);

  if (currentIdx >= 0 && currentIdx < orderedIds.length - 1) {
    const nextId = orderedIds[currentIdx + 1];
    
    console.log("🔄 ========================================");
    console.log("🔄 MOVING TO NEXT SUBJECT/TOPIC");
    console.log("🔄 ========================================");
    console.log("🔄 From:", activeId);
    console.log("🔄 To:", nextId);
    console.log("🔄 Progress:", `${currentIdx + 2}/${orderedIds.length}`);
    console.log("🔄 ========================================");
    
    await get().changeActive(nextId);
    return true;
  }

  console.log("✅ No more subjects/topics - this was the last one");
  return false;
},

// ✅ Check if this is the last subject/topic
isLastSubjectOrTopic: () => {
  const { saved, activeId } = get();
  if (!saved) return true;

  const orderedIds = get().getOrderedIds();
  const currentIdx = orderedIds.indexOf(activeId);
  
  return currentIdx === orderedIds.length - 1;
},

// ✅ Get progress info
getSubjectProgress: () => {
  const { saved, activeId } = get();
  if (!saved) return { current: 0, total: 0, isLast: true };

  const orderedIds = get().getOrderedIds();
  const currentIdx = orderedIds.indexOf(activeId);
  
  return {
    current: currentIdx + 1,
    total: orderedIds.length,
    isLast: currentIdx === orderedIds.length - 1,
    hasNext: currentIdx < orderedIds.length - 1
  };
},

  // ---------------- NAVIGATION ----------------
  next: () => {
  const { currentIndex } = get();
  const activeQuestions = get().getActiveQuestions();
  
  if (currentIndex < activeQuestions.length - 1) {
    set({ currentIndex: currentIndex + 1 });
  }
},
//   next: () => {
//     const { currentIndex } = get();
//     const allQuestions = get().getAllQuestions();
    
//     if (currentIndex < allQuestions.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//     }
//   },

  prev: () =>
    set((s) => ({
      currentIndex: Math.max(0, s.currentIndex - 1),
    })),


    goToQuestion: (index) => {
  const activeQuestions = get().getActiveQuestions();
  if (index >= 0 && index < activeQuestions.length) {
    set({ currentIndex: index });
  }
},
//   goToQuestion: (index) => {
//     const allQuestions = get().getAllQuestions();
//     if (index >= 0 && index < allQuestions.length) {
//       set({ currentIndex: index });
//     }
//   },

  // ---------------- FETCH NAMES ----------------
  fetchSubjectNames: async () => {
    const { saved } = get();
    if (!saved?.subjects?.length) return;
  
    console.log("📘 Fetching subject names");
  
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/users/my-subjects`);
      
      if (!res?.data) return;
  
      let subjects = [];
      
      if (res.data.subjectsByCategory) {
        subjects = Object.values(res.data.subjectsByCategory).flat();
      } else if (Array.isArray(res.data)) {
        subjects = res.data;
      }
  
      const names = {};
  
      subjects.forEach(subject => {
        const subjectId = subject.id || subject.subjectId || subject._id;
        if (saved.subjects.includes(subjectId)) {
          names[subjectId] = subject.subjectName;
        }
      });
  
      saved.subjects.forEach(id => {
        if (!names[id]) {
          names[id] = id;
        }
      });
  
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
        if (!topicNames[id]) topicNames[id] = id;
      });

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

  // ---------------- EXAM SESSION ----------------

  // ---------------- EXAM SESSION ----------------
startExam: async () => {
  const { saved, examActive } = get();
  
  if (!saved || examActive) {
    console.log("⏭️ No saved config or exam already active");
    return null;
  }

  try {
    const { fetchWithAuth } = useAuthStore.getState();
    
    let payload = {
      category: saved.exam,
      mode: saved.mode === "subject" ? "SUBJECT" : "TOPIC"
    };

    if (saved.mode === "subject") {
      payload.subjectIds = saved.subjects;
    } else if (saved.mode === "topic") {
      payload.topicIds = Object.values(saved.topics).flat();
    }

    console.log("🚀 Starting exam with payload:", payload);

    const res = await fetchWithAuth(`${API_BASE}/exams/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // ✅ LOG ENTIRE RESPONSE
    console.log("📦 FULL START EXAM RESPONSE:", JSON.stringify(res, null, 2));
    console.log("📦 Response data:", res?.data);
    console.log("📦 Response structure:", Object.keys(res || {}));
    
    if (res?.data) {
      console.log("📦 Data structure:", Object.keys(res.data));
      console.log("📦 Exam ID:", res.data.examId);
      console.log("📦 Duration seconds:", res.data.durationSeconds);
      console.log("📦 Duration minutes:", res.data.durationMinutes);
      console.log("📦 Start time:", res.data.startTime);
      console.log("📦 Auto submit time:", res.data.autoSubmitTime);
    }

    if (res?.data?.examId) {
      const startTime = Date.now();
      
      // ✅ EXTRACT QUESTIONS FROM RESPONSE
      const questionsData = res.data.questions || {};
      
      console.log("\n📦 ========================================");
      console.log("📦 EXTRACTING QUESTIONS FROM API");
      console.log("📦 ========================================");
      console.log("📦 Question groups received:", Object.keys(questionsData));
      
      // ✅ BUILD UNITS FROM QUESTIONS
      const newUnits = {};
      
      if (saved.mode === "subject") {
        console.log("📚 Processing SUBJECT mode questions...");
        
        // For subject mode, questions are grouped by subject name
        saved.subjects.forEach(subjectId => {
          console.log(`\n🔍 Looking for questions for subject: ${subjectId}`);
          
          // Find the subject name from the questions
          let foundQuestions = false;
          
          Object.entries(questionsData).forEach(([groupName, questions]) => {
            if (questions.length > 0 && questions[0].subjectId === subjectId) {
              newUnits[subjectId] = {
                items: questions,
                skip: questions.length,
                exhausted: true // All questions loaded at once
              };
              console.log(`✅ Found ${questions.length} questions in group "${groupName}"`);
              foundQuestions = true;
            }
          });
          
          if (!foundQuestions) {
            newUnits[subjectId] = {
              items: [],
              skip: 0,
              exhausted: true
            };
            console.log(`⚠️ No questions found for subject ${subjectId}`);
          }
        });
        
      } else if (saved.mode === "topic") {
        console.log("📖 Processing TOPIC mode questions...");
        
        // For topic mode, questions are grouped by topic name
        const topicIds = Object.values(saved.topics).flat();
        
        console.log("🔍 Looking for topics:", topicIds);
        console.log("🔍 Available question groups:", Object.keys(questionsData));
        
        topicIds.forEach(topicId => {
          console.log(`\n🔍 Looking for questions for topic: ${topicId}`);
          
          let foundQuestions = false;
          
          // Search through all question groups to find questions for this topic
          Object.entries(questionsData).forEach(([topicName, questions]) => {
            const topicQuestions = questions.filter(q => q.topicId === topicId);
            
            if (topicQuestions.length > 0) {
              newUnits[topicId] = {
                items: topicQuestions,
                skip: topicQuestions.length,
                exhausted: true
              };
              console.log(`✅ Found ${topicQuestions.length} questions in group "${topicName}"`);
              foundQuestions = true;
            }
          });
          
          if (!foundQuestions) {
            newUnits[topicId] = {
              items: [],
              skip: 0,
              exhausted: true
            };
            console.log(`⚠️ No questions found for topic ${topicId}`);
          }
        });
      }
      
      console.log("\n📊 ========================================");
      console.log("📊 UNITS CREATION SUMMARY");
      console.log("📊 ========================================");
      console.log("📊 Total units created:", Object.keys(newUnits).length);
      Object.entries(newUnits).forEach(([id, unit]) => {
        console.log(`   ${id}: ${unit.items.length} questions`);
      });
      console.log("📊 ========================================\n");
      
      // ✅ Calculate duration
      let timeInSeconds;
      
      if (res.data.durationSeconds) {
        timeInSeconds = res.data.durationSeconds;
        console.log("⏰ Using durationSeconds from API:", timeInSeconds, "seconds");
      } else if (res.data.durationMinutes) {
        timeInSeconds = res.data.durationMinutes * 60;
        console.log("⏰ Using durationMinutes from API:", res.data.durationMinutes, "minutes →", timeInSeconds, "seconds");
      } else if (saved.duration) {
        timeInSeconds = saved.duration * 60;
        console.log("⏰ Using saved duration:", saved.duration, "minutes →", timeInSeconds, "seconds");
      } else {
        timeInSeconds = 60 * 60;
        console.log("⏰ Using default duration: 60 minutes →", timeInSeconds, "seconds");
      }
      
      const durationInMinutes = Math.ceil(timeInSeconds / 60);
      
      console.log("\n⏰ ========================================");
      console.log("⏰ TIMER SETUP COMPLETE");
      console.log("⏰ ========================================");
      console.log("⏰ Final duration:", timeInSeconds, "seconds (", durationInMinutes, "minutes )");
      console.log("⏰ Start time:", new Date(startTime).toISOString());
      console.log("⏰ Expected end:", new Date(startTime + timeInSeconds * 1000).toISOString());
      console.log("⏰ ========================================\n");
      
      // ✅ UPDATE STATE WITH QUESTIONS AND EXAM INFO
      set({ 
        examId: res.data.examId, 
        examActive: true,
        examStartTime: startTime,
        examDuration: durationInMinutes,
        timeRemaining: timeInSeconds,
        units: newUnits,  // ✅ CRITICAL: Store the questions!
        paymentLocked: false, // ✅ Unlock since exam started successfully
        loading: false, // ✅ Stop loading
      });
      
      console.log("✅ ========================================");
      console.log("✅ EXAM INITIALIZATION COMPLETE");
      console.log("✅ ========================================");
      console.log("✅ Exam ID:", res.data.examId);
      console.log("✅ Timer initialized:", timeInSeconds, "seconds");
      console.log("✅ Questions loaded:", Object.keys(newUnits).length, "units");
      console.log("✅ Total questions:", Object.values(newUnits).reduce((sum, u) => sum + u.items.length, 0));
      console.log("✅ Payment locked:", false);
      console.log("✅ Loading:", false);
      console.log("✅ ========================================\n");
      
      // Start timer immediately
      const startTimerResult = get().startTimer();
      console.log("✅ Timer started with interval ID:", startTimerResult);
      
      return res.data.examId;
    }

    console.warn("⚠️ No examId in response");
    return null;
  } catch (err) {
    console.error("❌ Failed to start exam:", err);
    return null;
  }
},
//   startExam: async () => {
//     const { saved, examActive } = get();
    
//     if (!saved || examActive) {
//       console.log("⏭️ No saved config or exam already active");
//       return null;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
      
//       let payload = {
//         category: saved.exam,
//         mode: saved.mode === "subject" ? "SUBJECT" : "TOPIC"
//       };

//       if (saved.mode === "subject") {
//         payload.subjectIds = saved.subjects;
//       } else if (saved.mode === "topic") {
//         payload.topicIds = Object.values(saved.topics).flat();
//       }

//       console.log("🚀 Starting exam with payload:", payload);

//       const res = await fetchWithAuth(`${API_BASE}/exams/start`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       // ✅ LOG ENTIRE RESPONSE
//       console.log("📦 FULL START EXAM RESPONSE:", JSON.stringify(res, null, 2));
//       console.log("📦 Response data:", res?.data);
//       console.log("📦 Response structure:", Object.keys(res || {}));
      
//       if (res?.data) {
//         console.log("📦 Data structure:", Object.keys(res.data));
//         console.log("📦 Exam ID:", res.data.examId);
//         console.log("📦 Duration seconds:", res.data.durationSeconds);
//         console.log("📦 Duration minutes:", res.data.durationMinutes);
//         console.log("📦 Start time:", res.data.startTime);
//         console.log("📦 Auto submit time:", res.data.autoSubmitTime);
//       }

//       if (res?.data?.examId) {
//         const startTime = Date.now();
        
//         // ✅ Use durationSeconds from API response (PRIMARY)
//         // Fallback to durationMinutes * 60, then saved duration, then default
//         let timeInSeconds;
        
//         if (res.data.durationSeconds) {
//           // API provided duration in seconds - use directly
//           timeInSeconds = res.data.durationSeconds;
//           console.log("⏰ Using durationSeconds from API:", timeInSeconds, "seconds");
//         } else if (res.data.durationMinutes) {
//           // API provided duration in minutes - convert to seconds
//           timeInSeconds = res.data.durationMinutes * 60;
//           console.log("⏰ Using durationMinutes from API:", res.data.durationMinutes, "minutes →", timeInSeconds, "seconds");
//         } else if (saved.duration) {
//           // Fallback to saved duration
//           timeInSeconds = saved.duration * 60;
//           console.log("⏰ Using saved duration:", saved.duration, "minutes →", timeInSeconds, "seconds");
//         } else {
//           // Default 60 minutes
//           timeInSeconds = 60 * 60;
//           console.log("⏰ Using default duration: 60 minutes →", timeInSeconds, "seconds");
//         }
        
//         const durationInMinutes = Math.ceil(timeInSeconds / 60);
        
//         console.log("⏰ ========================================");
//         console.log("⏰ TIMER SETUP COMPLETE");
//         console.log("⏰ ========================================");
//         console.log("⏰ Final duration:", timeInSeconds, "seconds (", durationInMinutes, "minutes )");
//         console.log("⏰ Start time:", new Date(startTime).toISOString());
//         console.log("⏰ Expected end:", new Date(startTime + timeInSeconds * 1000).toISOString());
//         console.log("⏰ ========================================");
        
//         set({ 
//           examId: res.data.examId, 
//           examActive: true,
//           examStartTime: startTime,
//           examDuration: durationInMinutes,
//           timeRemaining: timeInSeconds,
//         });
        
//         console.log("✅ Exam started:", res.data.examId);
//         console.log("✅ Timer initialized with:", timeInSeconds, "seconds");
        
//         // Start timer immediately
//         const startTimerResult = get().startTimer();
//         console.log("✅ Timer started:", startTimerResult);
        
//         return res.data.examId;
//       }

//       console.warn("⚠️ No examId in response");
//       return null;
//     } catch (err) {
//       console.error("❌ Failed to start exam:", err);
//       return null;
//     }
//   },

  submitAnswer: async (questionId, userChoice) => {
    const { examId, examActive } = get();
    
    if (!examActive || !examId) {
      console.warn("⚠️ No active exam");
      return false;
    }

    try {
      const { fetchWithAuth } = useAuthStore.getState();

      const payload = {
        examId,
        questionId,
        userChoice,
      };

      console.log("📤 Submitting answer:", payload);

      await fetchWithAuth(`${API_BASE}/exams/submit-answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("✅ Answer submitted");
      return true;
    } catch (err) {
      console.error("❌ Failed to submit answer:", err);
      return false;
    }
  },
 
  
// ✅ COMPLETE endExam IMPLEMENTATION
endExam: async (options = {}) => {
  const { examId, examActive, timerId } = get();
  const { autoSubmit = false } = options;

  if (!examActive || !examId) {
    console.log("⏭️ No active exam to end");
    return null;
  }

  try {
    const { fetchWithAuth } = useAuthStore.getState();

    console.log(`🛑 Ending exam session: ${examId} ${autoSubmit ? '(AUTO-SUBMIT)' : '(MANUAL)'}`);

    const res = await fetchWithAuth(`${API_BASE}/exams/end`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ examId }),
    });
    
    // Set examActive to false immediately after API call
    set({ examActive: false });

    console.log("📦 End exam response:", res);

    const results = res?.data || null;

    // ✅ Clear timer safely
    if (timerId) {
      console.log("⏰ Clearing timer:", timerId);
      clearInterval(timerId);
    }

    // ✅ Store final exam state
    set({
      examId: null,
      examActive: false,
      examCompleted: true,
      examResults: results,
      timeRemaining: null,
      timerId: null,
    });

    console.log("✅ Exam ended successfully");
    console.log("📊 Final results stored:", results);

    // ✅ Navigate to results page if auto-submit or results available
    if (autoSubmit && navigationCallback && results?.examId) {
      console.log("🔀 Auto-navigating to results page:", results.examId);
      navigationCallback(`/exam-results/${results.examId}`);
    }

    return results;
  } catch (err) {
    console.error("❌ Failed to end exam:", err);
    return null;
  }
},

// Update startTimer to pass autoSubmit flag
startTimer: () => {
  console.log("⏰ startTimer() called");
  
  // Clear any existing timer
  if (get().timerId) {
    console.log("⏰ Clearing existing timer:", get().timerId);
    clearInterval(get().timerId);
  }
  
  const interval = setInterval(() => {
    const state = get();
    
    if (!state.examActive || state.timeRemaining === null) {
      console.log("⏰ Stopping timer - exam not active or time null");
      clearInterval(interval);
      set({ timerId: null });
      return;
    }

    if (state.timeRemaining <= 0) {
      console.log("⏰ ========================================");
      console.log("⏰ TIME'S UP! AUTO-SUBMITTING EXAM...");
      console.log("⏰ ========================================");
      clearInterval(interval);
      set({ timerId: null });
      
      // ✅ Pass autoSubmit flag
      get().endExam({ autoSubmit: true });
      return;
    }

    set({ timeRemaining: state.timeRemaining - 1 });
  }, 1000);
  
  // Store interval ID so we can clear it later
  set({ timerId: interval });
  
  console.log("⏰ Timer started with interval ID:", interval);
  return interval;
},

fetchExamResults: async (examId) => {
  try {
    const { fetchWithAuth } = useAuthStore.getState();
    
    const response = await fetchWithAuth(
      `${API_BASE}/exams/${examId}/results`
    );
    
    if (response?.data) {
      set({ examResults: response.data });
      return response.data;
    }
    
    return null;
  } catch (error) {
    console.error("❌ Failed to fetch exam results:", error);
    throw error;
  }
},
 
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
}));