
// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { usePaymentStore } from "./paymentStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
// const REQUEST_LIMIT = 40;
// const FREE_QUESTIONS_LIMIT = 50;

// // ✅ Check if user has used their free questions
// function hasUsedFreeQuestions() {
//   const freeQuestionsUsed = localStorage.getItem('freeQuestionsUsed');
//   const count = parseInt(freeQuestionsUsed || '0', 10);
//   console.log(`📊 Free questions used: ${count}/${FREE_QUESTIONS_LIMIT}`);
//   return count >= FREE_QUESTIONS_LIMIT;
// }

// // ✅ Increment free questions counter
// function incrementFreeQuestionsCount(questionsCount) {
//   const current = parseInt(localStorage.getItem('freeQuestionsUsed') || '0', 10);
//   const newCount = current + questionsCount;
//   localStorage.setItem('freeQuestionsUsed', newCount.toString());
//   console.log(`📈 Free questions count: ${current} → ${newCount}`);
//   return newCount;
// }

// // ✅ STRICT CHECK: Must match EXACT subject ID + category
// function checkIfUserPaidForSubject(subjectInfo, category) {
//   const paymentState = usePaymentStore.getState();
  
//   console.log("\n================================");
//   console.log("🔍 STRICT PAYMENT CHECK");
//   console.log("================================");
  
//   const subjectId = typeof subjectInfo === 'string' ? subjectInfo : subjectInfo?.id;
//   const subjectName = typeof subjectInfo === "string" ? null : subjectInfo?.subjectName;

//   console.log("Looking for EXACT match:");
//   console.log("  - Required Subject ID:", subjectId);
//   console.log("  - Subject Name:", subjectName);
//   console.log("  - Required Category:", category);
  
//   let activeSubscriptions = [];
  
//   if (paymentState.activeSubscriptions) {
//     activeSubscriptions = paymentState.activeSubscriptions;
//   } else if (paymentState.subscriptions?.active) {
//     activeSubscriptions = paymentState.subscriptions.active;
//   } else if (paymentState.active) {
//     activeSubscriptions = paymentState.active;
//   }
  
//   console.log("\n📋 Active Subscriptions:", activeSubscriptions.length);
  
//   if (!activeSubscriptions || activeSubscriptions.length === 0) {
//     console.log("❌ No active subscriptions found");
//     console.log("================================\n");
//     return false;
//   }
  
//   console.log("\n🔍 Checking each subscription:");
  
//   const hasPaid = activeSubscriptions.some((sub, index) => {
//     console.log(`\n  Subscription ${index + 1}: ${sub.subjectName}`);
//     console.log(`    - Subscription Subject ID: ${sub.subjectId}`);
//     console.log(`    - Subscription Category: ${sub.category}`);
    
//     const idMatches = sub.subjectId === subjectId || 
//                      sub.id === subjectId || 
//                      sub._id === subjectId;
    
//     const categoryMatches = !category || sub.category === category;
//     const matches = idMatches && categoryMatches;
    
//     console.log(`    - ID Match: ${idMatches} (${sub.subjectId} === ${subjectId})`);
//     console.log(`    - Category Match: ${categoryMatches} (${sub.category} === ${category})`);
//     console.log(`    - Result: ${matches ? '✅ MATCH!' : '❌ No match'}`);
    
//     if (matches) {
//       console.log("\n🎉 EXACT MATCH FOUND!");
//       console.log(`   User HAS paid for: ${sub.subjectName}`);
//       console.log(`   Subject ID: ${sub.subjectId}`);
//       console.log(`   Category: ${sub.category}`);
//     }
    
//     return matches;
//   });
  
//   if (!hasPaid) {
//     console.log("\n❌ ========================================");
//     console.log("❌ ACCESS DENIED - NO MATCHING SUBSCRIPTION");
//     console.log("❌ ========================================");
//     console.log("\n📋 User's paid subscriptions:");
//     activeSubscriptions.forEach((sub, i) => {
//       console.log(`  ${i + 1}. ${sub.subjectName}`);
//       console.log(`     - ID: ${sub.subjectId}`);
//       console.log(`     - Category: ${sub.category}`);
//     });
//     console.log("\n🔒 User tried to access:");
//     console.log(`   - Subject: ${subjectName}`);
//     console.log(`   - ID: ${subjectId}`);
//     console.log(`   - Category: ${category}`);
//     console.log("\n💡 REASON: The subject ID doesn't match any paid subscription.");
//     console.log("========================================\n");
//   }
  
//   console.log("\n================================");
//   console.log(`FINAL RESULT: ${hasPaid ? '✅ ACCESS GRANTED' : '❌ ACCESS DENIED'}`);
//   console.log("================================\n");
  
//   return hasPaid;
// }

// // ✅ UPDATED: No more modules - topics are directly under subjects
// async function getSubjectInfoForTopic(topicId, userSelectedCategory) {
//   console.log("\n🔍 ========================================");
//   console.log("🔍 GET SUBJECT INFO FOR TOPIC");
//   console.log("🔍 ========================================");
//   console.log("Looking for Topic ID:", topicId);
//   console.log("User Selected Category:", userSelectedCategory);
  
//   const { accessToken } = useAuthStore.getState();
  
//   if (!accessToken) {
//     console.error("❌ No access token!");
//     return null;
//   }
  
//   if (!topicId) {
//     console.error("❌ No topic ID provided!");
//     return null;
//   }

//   try {
//     console.log("\n📡 Fetching topics...");
//     const response = await fetch(`${API_BASE}/users/my-topics`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     if (!response.ok) {
//       console.error("❌ Failed to fetch topics:", response.status);
//       return null;
//     }

//     const data = await response.json();
//     const subjects = data.data || [];
    
//     console.log(`📚 Found ${subjects.length} subjects with topics`);

//     // Filter by category if provided
//     const filteredSubjects = userSelectedCategory 
//       ? subjects.filter(s => s.category === userSelectedCategory.toUpperCase())
//       : subjects;

//     console.log(`🔍 Searching ${filteredSubjects.length} subjects for ${userSelectedCategory}...`);

//     // ✅ NEW: Search topics directly under subjects (no modules)
//     for (let i = 0; i < filteredSubjects.length; i++) {
//       const subject = filteredSubjects[i];
//       console.log(`\n  Checking subject ${i + 1}/${filteredSubjects.length}: ${subject.subjectName} (ID: ${subject.subjectId})`);
      
//       if (!subject.topics || subject.topics.length === 0) {
//         console.warn(`  ⚠️ No topics in subject`);
//         continue;
//       }
      
//       console.log(`  🔍 Searching through ${subject.topics.length} topics...`);
      
//       // ✅ Topics are now directly in subject.topics array
//       for (const topic of subject.topics) {
//         const topicIdMatch = topic.topicId === topicId || 
//                             topic.id === topicId || 
//                             topic._id === topicId;
        
//         if (topicIdMatch) {
//           console.log("\n🎉 ========================================");
//           console.log("🎉 TOPIC FOUND!");
//           console.log("🎉 ========================================");
//           console.log("Topic Name:", topic.topicName);
//           console.log("Subject Name:", subject.subjectName);
//           console.log("Subject ID:", subject.subjectId);
//           console.log("Category:", subject.category);
//           console.log("========================================\n");
          
//           return {
//             id: subject.subjectId,
//             subjectName: subject.subjectName,
//             category: subject.category || userSelectedCategory
//           };
//         }
//       }
//     }

//     console.log("\n❌ TOPIC NOT FOUND IN ANY SUBJECT");
//     console.log("Searched through subjects in category:", userSelectedCategory);
//     console.log("Looking for topic ID:", topicId);
//     console.log("========================================\n");
    
//     return null;
//   } catch (error) {
//     console.error("\n❌ ERROR IN getSubjectInfoForTopic:", error);
//     return null;
//   }
// }

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
//   initialized: false,
//   sessionId: null,
//   sessionActive: false,
//   freeTrialActive: !hasUsedFreeQuestions(),

//   // ---------------- RESET ----------------
//   reset: () => {
//     console.log("🧹 Resetting store");
    
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
//       loading: false,
//       freeTrialActive: !hasUsedFreeQuestions(),
//     });
//   },

//   // ---------------- LOAD SAVED ----------------
//   syncSaved: async () => {
//     const state = get();
    
//     if (state.loading && state.initialized) {
//       console.log("⏭️ Already loading");
//       return null;
//     }
    
//     if (state.initialized && !state.loading) {
//       console.log("🔄 Re-initializing");
//       set({ initialized: false });
//     }

//     const saved = JSON.parse(localStorage.getItem("studySelections"));
    
//     if (!saved) {
//       console.warn("⚠️ No saved data");
//       set({ loading: false });
//       return null;
//     }

//     console.log("📦 User Selection:");
//     console.log("  Mode:", saved.mode);
//     console.log("  Category:", saved.exam);
//     if (saved.mode === "topic") {
//       console.log("  Topics:", saved.topics);
//     }

//     set({ 
//       saved, 
//       initialized: true, 
//       loading: true,
//       freeTrialActive: !hasUsedFreeQuestions() 
//     });

//     try {
//       if (saved.mode === "subject") {
//         await get().fetchSubjectNames();
//       } else {
//         await get().fetchTopicNames();
//       }

//       const firstId =
//         saved.mode === "subject"
//           ? saved.subjects?.[0]
//           : Object.values(saved.topics || {})[0]?.[0];

//       console.log("🎯 First ID:", firstId);

//       if (firstId) {
//         await get().changeActive(firstId);
//         setTimeout(() => {
//           const currentState = get();
//           if (currentState.loading) {
//             set({ loading: false });
//           }
//         }, 100);
//       } else {
//         set({ loading: false });
//       }
      
//       return saved;
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

//   // ---------------- FETCH QUESTIONS (WITH FREE TRIAL) ----------------
//   fetchMoreQuestions: async () => {
//     const state = get();
//     const { saved, activeId, units, freeTrialActive } = state;
    
//     console.log("\n🔍 ========================================");
//     console.log("🔍 FETCH MORE QUESTIONS");
//     console.log("🔍 ========================================");
//     console.log("Active ID:", activeId);
//     console.log("Mode:", saved?.mode);
//     console.log("🎁 Free Trial Active:", freeTrialActive);
    
//     if (!saved || !activeId) {
//       console.log("❌ No saved or activeId");
//       set({ loading: false });
//       return;
//     }

//     const category = saved.exam;
//     console.log("Category:", category);

//     let subjectInfo = null;
    
//     if (saved.mode === "subject") {
//       subjectInfo = {
//         id: activeId,
//         category: category
//       };
//       console.log("📚 Subject mode - checking subject:", activeId);
//     } else if (saved.mode === "topic") {
//       console.log("📖 Topic mode - finding parent subject...");
      
//       subjectInfo = await getSubjectInfoForTopic(activeId, category);
      
//       if (!subjectInfo) {
//         console.error("❌ Could not find subject for topic:", activeId);
//         set({ 
//           paymentLocked: true, 
//           loading: false,
//           units: {
//             ...get().units,
//             [activeId]: {
//               items: [],
//               skip: 0,
//               exhausted: true,
//             },
//           },
//         });
//         return;
//       }
      
//       console.log("✅ Found parent subject:", subjectInfo.subjectName);
//       console.log("   Subject ID:", subjectInfo.id);
//     }

//     // ✅ Check free trial first, only check payment if trial exhausted
//     if (freeTrialActive) {
//       const usedCount = parseInt(localStorage.getItem('freeQuestionsUsed') || '0', 10);
//       console.log(`\n🎁 ========================================`);
//       console.log(`🎁 FREE TRIAL MODE - ${usedCount}/${FREE_QUESTIONS_LIMIT} questions used`);
//       console.log(`🎁 ========================================`);
//       console.log("Skipping payment check - user still has free questions");
//       console.log("========================================\n");
//     } else {
//       console.log(`\n💳 Free trial exhausted - checking payment...`);
      
//       if (subjectInfo) {
//         const hasPaid = checkIfUserPaidForSubject(subjectInfo, category);
        
//         if (!hasPaid) {
//           console.log("\n🚫 ========================================");
//           console.log("🚫 PAYMENT LOCKED - ACCESS DENIED");
//           console.log("🚫 ========================================");
//           console.log("User has exhausted free questions and not paid.");
//           console.log("========================================\n");
          
//           set({ 
//             paymentLocked: true, 
//             loading: false,
//             freeTrialActive: false,
//             units: {
//               ...get().units,
//               [activeId]: {
//                 items: [],
//                 skip: 0,
//                 exhausted: true,
//               },
//             },
//           });
//           return;
//         }
        
//         console.log("\n✅ ========================================");
//         console.log("✅ ACCESS GRANTED - PAYMENT VERIFIED");
//         console.log("✅ ========================================");
//         console.log("Proceeding to fetch questions...");
//         console.log("========================================\n");
//       }
//     }

//     const unit = units[activeId] || {
//       items: [],
//       skip: 0,
//       exhausted: false,
//     };

//     if (unit.exhausted || state.paymentLocked) {
//       console.log("⏹️ Already exhausted or locked");
//       set({ loading: false });
//       return;
//     }

//     console.log(`📥 Fetching questions (skip: ${unit.skip})`);
//     set({ loading: true });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const params = new URLSearchParams();
//       params.append('category', saved.exam);
//       params.append('limit', REQUEST_LIMIT);
//       params.append('skip', unit.skip);

//       if (saved.mode === "subject") {
//         params.append('subjectId', activeId);
        
//         const year = saved.subjectYears?.[activeId];
//         if (year && year !== 'random') {
//           params.append('year', year);
//         } else if (year === 'random') {
//           params.append('random', 'true');
//         }
//       } else if (saved.mode === "topic") {
//         params.append('topicId', activeId);
        
//         if (subjectInfo?.id) {
//           params.append('subjectId', subjectInfo.id);
//           console.log("📤 Sending parent subjectId:", subjectInfo.id);
//         }
        
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

//       if (res?.status === 403 || res?.code === "PAYMENT_REQUIRED") {
//         console.log("\n🔥 API RETURNED 403 FORBIDDEN");
//         set({ paymentLocked: true, loading: false, freeTrialActive: false });
//         return;
//       }

//       const data = Array.isArray(res?.data) ? res.data : [];
//       console.log(`✅ Received ${data.length} questions`);

//       // ✅ Update free questions counter if in trial mode
//       if (freeTrialActive && data.length > 0) {
//         const newCount = incrementFreeQuestionsCount(data.length);
        
//         if (newCount >= FREE_QUESTIONS_LIMIT) {
//           console.log(`\n🎁 ========================================`);
//           console.log(`🎁 FREE TRIAL EXHAUSTED!`);
//           console.log(`🎁 Used ${newCount}/${FREE_QUESTIONS_LIMIT} questions`);
//           console.log(`🎁 ========================================\n`);
//           set({ freeTrialActive: false });
//         }
//       }

//       if (data.length === 0 && res?.accessInfo?.requiresUpgrade === true) {
//         set({ 
//           paymentLocked: true, 
//           loading: false,
//           freeTrialActive: false,
//           units: {
//             ...get().units,
//             [activeId]: {
//               ...unit,
//               exhausted: true,
//             },
//           },
//         });
//         console.log("🔥 Free limit reached");
//         return;
//       }

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
      
//       console.log(`💾 Total questions: ${unit.items.length + data.length}`);
//     } catch (err) {
//       console.error("❌ Fetch failed:", err);
      
//       if (
//         err?.status === 403 ||
//         err?.response?.status === 403 ||
//         err?.message?.includes("403")
//       ) {
//         set({ paymentLocked: true, loading: false, freeTrialActive: false });
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

//     const state = get();
//     if (state.units[id] && state.units[id].items.length > 0) {
//       console.log("✅ Already have questions");
//       set({ loading: false });
//       return;
//     }

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

//     await new Promise(resolve => setTimeout(resolve, 50));
//     await get().fetchMoreQuestions();
//   },

//   // ---------------- NAVIGATION ----------------
//   next: async () => {
//     const { currentIndex, paymentLocked } = get();
//     if (paymentLocked) return;

//     const unit = get().getUnit();

//     if (currentIndex < unit.items.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//       return;
//     }

//     if (!unit.exhausted) {
//       const before = unit.items.length;
//       await get().fetchMoreQuestions();
//       const after = get().getUnit().items.length;

//       if (after > before) {
//         set({ currentIndex: currentIndex + 1 });
//         return;
//       }
      
//       if (get().paymentLocked) {
//         console.log("💳 Payment required");
//         return;
//       }
//     }

//     if (unit.exhausted) {
//       await get().goToNextUnit();
//     }
//   },

//   prev: () =>
//     set((s) => ({
//       currentIndex: Math.max(0, s.currentIndex - 1),
//     })),

//   goToNextUnit: async () => {
//     const ids = get().getOrderedIds();
//     const { activeId } = get();

//     const idx = ids.indexOf(activeId);
//     if (idx === -1) return;

//     const nextId = ids[idx + 1];
//     if (!nextId) {
//       console.log("✅ Completed");
//       alert('🎉 You have finished all!');
//       return;
//     }

//     await get().changeActive(nextId);
//   },

//   fetchSubjectNames: async () => {
//     const { saved } = get();
//     if (!saved?.subjects?.length) return;
  
//     console.log("📘 Fetching subject names");
  
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/users/my-subjects`);
      
//       if (!res?.data) return;
  
//       let subjects = [];
      
//       if (res.data.subjectsByCategory) {
//         subjects = Object.values(res.data.subjectsByCategory).flat();
//       } else if (Array.isArray(res.data)) {
//         subjects = res.data;
//       }
  
//       const names = {};
  
//       subjects.forEach(subject => {
//         const subjectId = subject.id || subject.subjectId || subject._id;
//         if (saved.subjects.includes(subjectId)) {
//           names[subjectId] = subject.subjectName;
//         }
//       });
  
//       saved.subjects.forEach(id => {
//         if (!names[id]) {
//           console.warn(`⚠️ Subject name not found for ID: ${id}`);
//           names[id] = id;
//         }
//       });
  
//       set({ subjectNames: names });
  
//     } catch (err) {
//       console.error("❌ Failed to fetch subject names:", err);
      
//       const names = {};
//       saved.subjects.forEach(id => {
//         names[id] = id;
//       });
//       set({ subjectNames: names });
//     }
//   },

//   // ✅ UPDATED: fetchTopicNames - no more modules
//   fetchTopicNames: async () => {
//     const { saved } = get();
//     if (!saved?.topics) return;

//     console.log("📙 Fetching topic names");

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/users/my-topics`);
      
//       if (!res?.data) return;

//       const subjects = res.data;
//       const topicNames = {};
//       const subjectNames = {};

//       const savedTopicIds = Object.values(saved.topics).flat();

//       // ✅ NEW: Topics are directly under subjects (no modules)
//       subjects.forEach(subject => {
//         subject.topics?.forEach(topic => {
//           if (savedTopicIds.includes(topic.topicId)) {
//             topicNames[topic.topicId] = topic.topicName;
            
//             Object.keys(saved.topics).forEach(subjectId => {
//               if (saved.topics[subjectId].includes(topic.topicId)) {
//                 subjectNames[subjectId] = subject.subjectName;
//               }
//             });
//           }
//         });
//       });

//       savedTopicIds.forEach(id => {
//         if (!topicNames[id]) topicNames[id] = id;
//       });

//       set((s) => ({
//         topicNames,
//         subjectNames: { ...s.subjectNames, ...subjectNames },
//       }));

//     } catch (err) {
//       console.error("❌ Failed to fetch topic names:", err);
      
//       const topicNames = {};
//       const savedTopicIds = Object.values(saved.topics).flat();
//       savedTopicIds.forEach(id => {
//         topicNames[id] = id;
//       });
//       set({ topicNames });
//     }
//   },

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

//   startStudySession: async (savedData = null) => {
//     const { saved: storeSaved, sessionActive } = get();
//     const saved = savedData || storeSaved;
    
//     if (!saved || sessionActive) {
//       return null;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
      
//       let payload = {};

//       if (saved.mode === "subject") {
//         payload.subjectId = saved.subjects.length === 1 ? saved.subjects[0] : saved.subjects;
//       } else if (saved.mode === "topic") {
//         const allTopicIds = Object.values(saved.topics).flat();
//         const subjectIds = Object.keys(saved.topics);

//         if (subjectIds.length === 1 && allTopicIds.length === 1) {
//           payload.subjectId = subjectIds[0];
//           payload.topicIds = allTopicIds;
//         } else {
//           payload.subjectId = subjectIds;
//           payload.topicIds = allTopicIds;
//         }
//       }

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
//         return res.data.sessionId;
//       }

//       return null;
//     } catch (err) {
//       console.error("❌ Failed to start study session:", err);
//       return null;
//     }
//   },

//   submitAnswer: async (questionId, userChoice) => {
//     const { sessionId, sessionActive } = get();
    
//     if (!sessionActive || !sessionId) {
//       return false;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const payload = {
//         sessionId,
//         questionId,
//         userChoice,
//       };

//       await fetchWithAuth(`${API_BASE}/study/answer`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       return true;
//     } catch (err) {
//       console.error("❌ Failed to submit answer:", err);
//       return false;
//     }
//   },

//   endStudySession: async () => {
//     const { sessionId, sessionActive } = get();
    
//     if (!sessionActive || !sessionId) {
//       return;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       await fetchWithAuth(`${API_BASE}/study/end`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionId }),
//       });

//       set({ 
//         sessionId: null, 
//         sessionActive: false 
//       });

//     } catch (err) {
//       console.error("❌ Failed to end study session:", err);
//     }
//   },
// }));


































// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { usePaymentStore } from "./paymentStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
// const REQUEST_LIMIT = 40;

// // ✅ Simplified: Only need this for topic → subject lookup
// async function getSubjectInfoForTopic(topicId, userSelectedCategory) {
//   const { accessToken } = useAuthStore.getState();

//   if (!accessToken || !topicId) return null;

//   try {
//     const response = await fetch(`${API_BASE}/users/my-topics`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     if (!response.ok) return null;

//     const data = await response.json();
//     const subjects = data.data || [];

//     const filteredSubjects = userSelectedCategory
//       ? subjects.filter(s => s.category === userSelectedCategory.toUpperCase())
//       : subjects;

//     for (const subject of filteredSubjects) {
//       if (!subject.topics || subject.topics.length === 0) continue;

//       for (const topic of subject.topics) {
//         const match =
//           topic.topicId === topicId ||
//           topic.id === topicId ||
//           topic._id === topicId;

//         if (match) {
//           return {
//             id: subject.subjectId || subject.id || subject._id,
//             subjectName: subject.subjectName,
//             category: subject.category || userSelectedCategory
//           };
//         }
//       }
//     }

//     return null;
//   } catch (err) {
//     console.error("❌ getSubjectInfoForTopic error:", err);
//     return null;
//   }
// }

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
//   initialized: false,
//   sessionId: null,
//   sessionActive: false,
//   // ✅ NEW STATE FOR SUMMARY
//   showSummary: false,
//   studyResults: null,
//   sessionStartTime: null,

//   // ---------------- RESET ----------------
//   reset: () => {
//     console.log("🧹 Resetting store");
    
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
//       loading: false,
//       showSummary: false,
//       studyResults: null,
//       sessionStartTime: null,
//     });
//   },

//   // ---------------- LOAD SAVED ----------------
//   syncSaved: async () => {
//     const state = get();
    
//     if (state.loading && state.initialized) {
//       console.log("⏭️ Already loading");
//       return null;
//     }
    
//     if (state.initialized && !state.loading) {
//       console.log("🔄 Re-initializing");
//       set({ initialized: false });
//     }

//     const saved = JSON.parse(localStorage.getItem("studySelections"));
    
//     if (!saved) {
//       console.warn("⚠️ No saved data");
//       set({ loading: false });
//       return null;
//     }

//     console.log("📦 User Selection:");
//     console.log("  Mode:", saved.mode);
//     console.log("  Category:", saved.exam);

//     set({ 
//       saved, 
//       initialized: true, 
//       loading: true,
//     });

//     try {
//       if (saved.mode === "subject") {
//         await get().fetchSubjectNames();
//       } else {
//         await get().fetchTopicNames();
//       }

//       const firstId =
//         saved.mode === "subject"
//           ? saved.subjects?.[0]
//           : Object.values(saved.topics || {})[0]?.[0];

//       console.log("🎯 First ID:", firstId);

//       if (firstId) {
//         await get().changeActive(firstId);
//         setTimeout(() => {
//           const currentState = get();
//           if (currentState.loading) {
//             set({ loading: false });
//           }
//         }, 100);
//       } else {
//         set({ loading: false });
//       }
      
//       return saved;
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

//   // ✅ SIMPLIFIED: Backend handles ALL access control
//   fetchMoreQuestions: async () => {
//     const state = get();
//     const { saved, activeId, units } = state;
    
//     console.log("\n🔍 Fetching more questions for:", activeId);
    
//     if (!saved || !activeId) {
//       console.log("❌ No saved or activeId");
//       set({ loading: false });
//       return;
//     }

//     const unit = units[activeId] || {
//       items: [],
//       skip: 0,
//       exhausted: false,
//     };

//     if (unit.exhausted || state.paymentLocked) {
//       console.log("⏹️ Already exhausted or locked");
//       set({ loading: false });
//       return;
//     }

//     console.log(`📥 Fetching questions (skip: ${unit.skip})`);
//     set({ loading: true });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const params = new URLSearchParams();
//       params.append('category', saved.exam);
//       params.append('limit', REQUEST_LIMIT);
//       params.append('skip', unit.skip);

//       if (saved.mode === "subject") {
//         params.append('subjectId', activeId);
        
//         const year = saved.subjectYears?.[activeId];
//         if (year && year !== 'random') {
//           params.append('year', year);
//         } else if (year === 'random') {
//           params.append('random', 'true');
//         }
//       } else if (saved.mode === "topic") {
//         params.append('topicId', activeId);
        
//         // Get parent subject info for topic mode
//         const subjectInfo = await getSubjectInfoForTopic(activeId, saved.exam);
//         if (subjectInfo?.id) {
//           params.append('subjectId', subjectInfo.id);
//           console.log("📤 Sending parent subjectId:", subjectInfo.id);
//         }
        
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

//       // ✅ BACKEND DECIDES: Free limit exhausted OR payment required
//       if (res?.status === 403 || res?.code === "PAYMENT_REQUIRED") {
//         console.log("🔒 Backend says: Payment required (free trial exhausted or not paid)");
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
//         return;
//       }

//       const data = Array.isArray(res?.data) ? res.data : [];
//       console.log(`✅ Received ${data.length} questions from backend`);

//       // ✅ No questions but no 403? End of content
//       if (data.length === 0) {
//         console.log("📭 No more questions available");
//         set({ 
//           loading: false,
//           units: {
//             ...get().units,
//             [activeId]: {
//               ...unit,
//               exhausted: true,
//             },
//           },
//         });
//         return;
//       }

//       // ✅ Store questions
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
      
//       console.log(`💾 Total questions: ${unit.items.length + data.length}`);
//     } catch (err) {
//       console.error("❌ Fetch failed:", err);
      
//       // ✅ Check if error is 403
//       if (
//         err?.status === 403 ||
//         err?.response?.status === 403 ||
//         err?.message?.includes("403")
//       ) {
//         console.log("🔒 403 Error - Payment required");
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

//     const state = get();
//     if (state.units[id] && state.units[id].items.length > 0) {
//       console.log("✅ Already have questions");
//       set({ loading: false });
//       return;
//     }

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

//     await new Promise(resolve => setTimeout(resolve, 50));
//     await get().fetchMoreQuestions();
//   },

//   // ---------------- NAVIGATION ----------------
//   next: async () => {
//     const { currentIndex, paymentLocked } = get();
//     if (paymentLocked) return;

//     const unit = get().getUnit();

//     if (currentIndex < unit.items.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//       return;
//     }

//     if (!unit.exhausted) {
//       const before = unit.items.length;
//       await get().fetchMoreQuestions();
//       const after = get().getUnit().items.length;

//       if (after > before) {
//         set({ currentIndex: currentIndex + 1 });
//         return;
//       }
      
//       if (get().paymentLocked) {
//         console.log("💳 Payment required");
//         return;
//       }
//     }

//     if (unit.exhausted) {
//       await get().goToNextUnit();
//     }
//   },

//   prev: () =>
//     set((s) => ({
//       currentIndex: Math.max(0, s.currentIndex - 1),
//     })),

//   goToNextUnit: async () => {
//     const ids = get().getOrderedIds();
//     const { activeId } = get();

//     const idx = ids.indexOf(activeId);
//     if (idx === -1) return;

//     const nextId = ids[idx + 1];
//     if (!nextId) {
//       console.log("✅ Completed");
//       alert('🎉 You have finished all!');
//       return;
//     }

//     await get().changeActive(nextId);
//   },

//   fetchSubjectNames: async () => {
//     const { saved } = get();
//     if (!saved?.subjects?.length) return;
  
//     console.log("📘 Fetching subject names");
  
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/users/my-subjects`);
      
//       if (!res?.data) return;
  
//       let subjects = [];
      
//       if (res.data.subjectsByCategory) {
//         subjects = Object.values(res.data.subjectsByCategory).flat();
//       } else if (Array.isArray(res.data)) {
//         subjects = res.data;
//       }
  
//       const names = {};
  
//       subjects.forEach(subject => {
//         const subjectId = subject.id || subject.subjectId || subject._id;
//         if (saved.subjects.includes(subjectId)) {
//           names[subjectId] = subject.subjectName;
//         }
//       });
  
//       saved.subjects.forEach(id => {
//         if (!names[id]) {
//           console.warn(`⚠️ Subject name not found for ID: ${id}`);
//           names[id] = id;
//         }
//       });
  
//       set({ subjectNames: names });
  
//     } catch (err) {
//       console.error("❌ Failed to fetch subject names:", err);
      
//       const names = {};
//       saved.subjects.forEach(id => {
//         names[id] = id;
//       });
//       set({ subjectNames: names });
//     }
//   },

//   fetchTopicNames: async () => {
//     const { saved } = get();
//     if (!saved?.topics) return;

//     console.log("📙 Fetching topic names");

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/users/my-topics`);
      
//       if (!res?.data) return;

//       const subjects = res.data;
//       const topicNames = {};
//       const subjectNames = {};

//       const savedTopicIds = Object.values(saved.topics).flat();

//       subjects.forEach(subject => {
//         subject.topics?.forEach(topic => {
//           if (savedTopicIds.includes(topic.topicId)) {
//             topicNames[topic.topicId] = topic.topicName;
            
//             Object.keys(saved.topics).forEach(subjectId => {
//               if (saved.topics[subjectId].includes(topic.topicId)) {
//                 subjectNames[subjectId] = subject.subjectName;
//               }
//             });
//           }
//         });
//       });

//       savedTopicIds.forEach(id => {
//         if (!topicNames[id]) topicNames[id] = id;
//       });

//       set((s) => ({
//         topicNames,
//         subjectNames: { ...s.subjectNames, ...subjectNames },
//       }));

//     } catch (err) {
//       console.error("❌ Failed to fetch topic names:", err);
      
//       const topicNames = {};
//       const savedTopicIds = Object.values(saved.topics).flat();
//       savedTopicIds.forEach(id => {
//         topicNames[id] = id;
//       });
//       set({ topicNames });
//     }
//   },

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

//   startStudySession: async (savedData = null) => {
//     const { saved: storeSaved, sessionActive } = get();
//     const saved = savedData || storeSaved;
    
//     if (!saved || sessionActive) {
//       return null;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
      
//       let payload = {};

//       if (saved.mode === "subject") {
//         payload.subjectId = saved.subjects.length === 1 ? saved.subjects[0] : saved.subjects;
//       } else if (saved.mode === "topic") {
//         const allTopicIds = Object.values(saved.topics).flat();
//         const subjectIds = Object.keys(saved.topics);

//         if (subjectIds.length === 1 && allTopicIds.length === 1) {
//           payload.subjectId = subjectIds[0];
//           payload.topicIds = allTopicIds;
//         } else {
//           payload.subjectId = subjectIds;
//           payload.topicIds = allTopicIds;
//         }
//       }

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
//         return res.data.sessionId;
//       }

//       return null;
//     } catch (err) {
//       console.error("❌ Failed to start study session:", err);
//       return null;
//     }
//   },

//   submitAnswer: async (questionId, userChoice) => {
//     const { sessionId, sessionActive } = get();
    
//     if (!sessionActive || !sessionId) {
//       return false;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const payload = {
//         sessionId,
//         questionId,
//         userChoice,
//       };

//       await fetchWithAuth(`${API_BASE}/study/answer`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       return true;
//     } catch (err) {
//       console.error("❌ Failed to submit answer:", err);
//       return false;
//     }
//   },

//   endStudySession: async () => {
//     const { sessionId, sessionActive } = get();
    
//     if (!sessionActive || !sessionId) {
//       return;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       await fetchWithAuth(`${API_BASE}/study/end`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionId }),
//       });

//       set({ 
//         sessionId: null, 
//         sessionActive: false 
//       });

//     } catch (err) {
//       console.error("❌ Failed to end study session:", err);
//     }
//   },
  

//   // ✅ NEW: Set show summary flag
//   setShowSummary: (show) => set({ showSummary: show }),

//   // ✅ NEW: Generate study results
//   generateStudyResults: () => {
//     const state = get();
//     const { saved, units, selectedOptions, subjectNames, topicNames, sessionStartTime } = state;
    
//     console.log("📊 Generating study results...");

//     // Collect all questions from all units
//     const allQuestions = [];
//     const orderedIds = state.getOrderedIds();
    
//     orderedIds.forEach(id => {
//       const unit = units[id];
//       if (unit?.items) {
//         allQuestions.push(...unit.items.map(q => ({
//           ...q,
//           unitId: id,
//           unitName: saved.mode === "subject" 
//             ? subjectNames[id] 
//             : topicNames[id]
//         })));
//       }
//     });

//     // Calculate statistics
//     const totalQuestions = allQuestions.length;
//     const answeredQuestions = Object.keys(selectedOptions).length;
    
//     let correctAnswers = 0;
//     let incorrectAnswers = 0;
    
//     allQuestions.forEach(q => {
//       const userAnswer = selectedOptions[q.id];
//       if (userAnswer) {
//         if (userAnswer === q.correctAnswer) {
//           correctAnswers++;
//         } else {
//           incorrectAnswers++;
//         }
//       }
//     });

//     const skippedQuestions = totalQuestions - answeredQuestions;
//     const accuracy = answeredQuestions > 0 
//       ? Math.round((correctAnswers / answeredQuestions) * 100) 
//       : 0;

//     // Calculate time spent
//     let timeSpent = "00:00";
//     if (sessionStartTime) {
//       const endTime = Date.now();
//       const diffMs = endTime - sessionStartTime;
//       const minutes = Math.floor(diffMs / 60000);
//       const seconds = Math.floor((diffMs % 60000) / 1000);
//       timeSpent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//     }

//     // Group by subject/topic
//     const subjectMap = {};
    
//     allQuestions.forEach(q => {
//       const subjectKey = q.unitId;
//       const subjectName = q.unitName || subjectKey;
      
//       if (!subjectMap[subjectKey]) {
//         subjectMap[subjectKey] = {
//           name: subjectName,
//           totalQuestions: 0,
//           correct: 0,
//           incorrect: 0,
//           skipped: 0,
//         };
//       }
      
//       subjectMap[subjectKey].totalQuestions++;
      
//       const userAnswer = selectedOptions[q.id];
//       if (!userAnswer) {
//         subjectMap[subjectKey].skipped++;
//       } else if (userAnswer === q.correctAnswer) {
//         subjectMap[subjectKey].correct++;
//       } else {
//         subjectMap[subjectKey].incorrect++;
//       }
//     });

//     // Prepare questions for summary (with status but no answers)
//     const questionsForSummary = allQuestions.map((q, idx) => ({
//       id: q.id,
//       questionNumber: idx + 1,
//       subject: q.unitName || "Unknown",
//       text: q.text,
//       userAnswer: selectedOptions[q.id] || null,
//       isCorrect: selectedOptions[q.id] 
//         ? selectedOptions[q.id] === q.correctAnswer 
//         : null,
//       difficulty: q.difficulty,
//       category: q.category,
//       year: q.year,
//     }));

//     const studyResults = {
//       sessionId: state.sessionId,
//       totalQuestions,
//       answeredQuestions,
//       correctAnswers,
//       incorrectAnswers,
//       skippedQuestions,
//       accuracy,
//       timeSpent,
//       completedAt: new Date().toISOString(),
//       subjects: Object.values(subjectMap),
//       questions: questionsForSummary,
//     };

//     console.log("✅ Study results generated:", studyResults);
//     set({ studyResults });
//     return studyResults;
//   },

//   // ✅ MODIFIED: Start session with timestamp
//   startStudySession: async (savedData = null) => {
//     const { saved: storeSaved, sessionActive } = get();
//     const saved = savedData || storeSaved;
    
//     if (!saved || sessionActive) {
//       return null;
//     }

//     // ✅ Record start time
//     set({ sessionStartTime: Date.now() });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
      
//       let payload = {};

//       if (saved.mode === "subject") {
//         payload.subjectId = saved.subjects.length === 1 ? saved.subjects[0] : saved.subjects;
//       } else if (saved.mode === "topic") {
//         const allTopicIds = Object.values(saved.topics).flat();
//         const subjectIds = Object.keys(saved.topics);

//         if (subjectIds.length === 1 && allTopicIds.length === 1) {
//           payload.subjectId = subjectIds[0];
//           payload.topicIds = allTopicIds;
//         } else {
//           payload.subjectId = subjectIds;
//           payload.topicIds = allTopicIds;
//         }
//       }

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
//         return res.data.sessionId;
//       }

//       return null;
//     } catch (err) {
//       console.error("❌ Failed to start study session:", err);
//       return null;
//     }
//   },

// }));










// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { usePaymentStore } from "./paymentStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
// const REQUEST_LIMIT = 40;

// // ✅ Simplified: Only need this for topic → subject lookup
// async function getSubjectInfoForTopic(topicId, userSelectedCategory) {
//   const { accessToken } = useAuthStore.getState();

//   if (!accessToken || !topicId) return null;

//   try {
//     const response = await fetch(`${API_BASE}/users/my-topics`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     if (!response.ok) return null;

//     const data = await response.json();
//     const subjects = data.data || [];

//     const filteredSubjects = userSelectedCategory
//       ? subjects.filter(s => s.category === userSelectedCategory.toUpperCase())
//       : subjects;

//     for (const subject of filteredSubjects) {
//       if (!subject.topics || subject.topics.length === 0) continue;

//       for (const topic of subject.topics) {
//         const match =
//           topic.topicId === topicId ||
//           topic.id === topicId ||
//           topic._id === topicId;

//         if (match) {
//           return {
//             id: subject.subjectId || subject.id || subject._id,
//             subjectName: subject.subjectName,
//             category: subject.category || userSelectedCategory
//           };
//         }
//       }
//     }

//     return null;
//   } catch (err) {
//     console.error("❌ getSubjectInfoForTopic error:", err);
//     return null;
//   }
// }

// export const useStudyStore = create((set, get) => ({
//   // ---------------- STATE ----------------
//   saved: null,
//   activeId: null,
//   units: {},
//   currentIndex: 0,
//   selectedOptions: {}, // ✅ Persists across subject changes
//   lockedQuestions: {}, // ✅ NEW: Track permanently locked questions
//   subjectNames: {},
//   topicNames: {},
//   loading: false,
//   paymentLocked: false,
//   paymentLoading: false,
//   initialized: false,
//   sessionId: null,
//   sessionActive: false,
//   showSummary: false,
//   studyResults: null,
//   sessionStartTime: null,

//   // ---------------- RESET ----------------
//   reset: () => {
//     console.log("🧹 Resetting store");
    
//     set({
//       saved: null,
//       activeId: null,
//       units: {},
//       currentIndex: 0,
//       selectedOptions: {},
//       lockedQuestions: {},
//       subjectNames: {},
//       topicNames: {},
//       paymentLocked: false,
//       initialized: false,
//       sessionId: null,
//       sessionActive: false,
//       loading: false,
//       showSummary: false,
//       studyResults: null,
//       sessionStartTime: null,
//     });
//   },

//   // ✅ NEW: Lock a question permanently (Study button)
//   setQuestionLocked: (questionId, isLocked) => {
//     console.log(`🔒 Locking question ${questionId}:`, isLocked);
//     set((state) => ({
//       lockedQuestions: {
//         ...state.lockedQuestions,
//         [questionId]: isLocked,
//       },
//     }));
//   },

//   // ---------------- LOAD SAVED ----------------
//   syncSaved: async () => {
//     const state = get();
    
//     if (state.loading && state.initialized) {
//       console.log("⏭️ Already loading");
//       return null;
//     }
    
//     if (state.initialized && !state.loading) {
//       console.log("🔄 Re-initializing");
//       set({ initialized: false });
//     }

//     const saved = JSON.parse(localStorage.getItem("studySelections"));
    
//     if (!saved) {
//       console.warn("⚠️ No saved data");
//       set({ loading: false });
//       return null;
//     }

//     console.log("📦 User Selection:");
//     console.log("  Mode:", saved.mode);
//     console.log("  Category:", saved.exam);

//     set({ 
//       saved, 
//       initialized: true, 
//       loading: true,
//     });

//     try {
//       if (saved.mode === "subject") {
//         await get().fetchSubjectNames();
//       } else {
//         await get().fetchTopicNames();
//       }

//       const firstId =
//         saved.mode === "subject"
//           ? saved.subjects?.[0]
//           : Object.values(saved.topics || {})[0]?.[0];

//       console.log("🎯 First ID:", firstId);

//       if (firstId) {
//         await get().changeActive(firstId);
//         setTimeout(() => {
//           const currentState = get();
//           if (currentState.loading) {
//             set({ loading: false });
//           }
//         }, 100);
//       } else {
//         set({ loading: false });
//       }
      
//       return saved;
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
//   // ✅ MODIFIED: Selections persist across subject changes
//   setSelectedOption: (questionId, optionId) => {
//     console.log(`✏️ Setting answer for question ${questionId}:`, optionId);
//     set((s) => ({
//       selectedOptions: {
//         ...s.selectedOptions,
//         [questionId]: optionId,
//       },
//     }));
//   },

//   // ✅ SIMPLIFIED: Backend handles ALL access control
//   fetchMoreQuestions: async () => {
//     const state = get();
//     const { saved, activeId, units } = state;
    
//     console.log("\n🔍 Fetching more questions for:", activeId);
    
//     if (!saved || !activeId) {
//       console.log("❌ No saved or activeId");
//       set({ loading: false });
//       return;
//     }

//     const unit = units[activeId] || {
//       items: [],
//       skip: 0,
//       exhausted: false,
//     };

//     if (unit.exhausted || state.paymentLocked) {
//       console.log("⏹️ Already exhausted or locked");
//       set({ loading: false });
//       return;
//     }

//     console.log(`📥 Fetching questions (skip: ${unit.skip})`);
//     set({ loading: true });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const params = new URLSearchParams();
//       params.append('category', saved.exam);
//       params.append('limit', REQUEST_LIMIT);
//       params.append('skip', unit.skip);

//       if (saved.mode === "subject") {
//         params.append('subjectId', activeId);
        
//         const year = saved.subjectYears?.[activeId];
//         if (year && year !== 'random') {
//           params.append('year', year);
//         } else if (year === 'random') {
//           params.append('random', 'true');
//         }
//       } else if (saved.mode === "topic") {
//         params.append('topicId', activeId);
        
//         // Get parent subject info for topic mode
//         const subjectInfo = await getSubjectInfoForTopic(activeId, saved.exam);
//         if (subjectInfo?.id) {
//           params.append('subjectId', subjectInfo.id);
//           console.log("📤 Sending parent subjectId:", subjectInfo.id);
//         }
        
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

//       // ✅ BACKEND DECIDES: Free limit exhausted OR payment required
//       if (res?.status === 403 || res?.code === "PAYMENT_REQUIRED") {
//         console.log("🔒 Backend says: Payment required (free trial exhausted or not paid)");
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
//         return;
//       }

//       const data = Array.isArray(res?.data) ? res.data : [];
//       console.log(`✅ Received ${data.length} questions from backend`);

//       // ✅ No questions but no 403? End of content
//       if (data.length === 0) {
//         console.log("📭 No more questions available");
//         set({ 
//           loading: false,
//           units: {
//             ...get().units,
//             [activeId]: {
//               ...unit,
//               exhausted: true,
//             },
//           },
//         });
//         return;
//       }

//       // ✅ Store questions
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
      
//       console.log(`💾 Total questions: ${unit.items.length + data.length}`);
//     } catch (err) {
//       console.error("❌ Fetch failed:", err);
      
//       // ✅ Check if error is 403
//       if (
//         err?.status === 403 ||
//         err?.response?.status === 403 ||
//         err?.message?.includes("403")
//       ) {
//         console.log("🔒 403 Error - Payment required");
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
//         return;
//       }
      
//       set({ loading: false });
//     }
//   },

//   // ---------------- CHANGE ACTIVE ----------------
//   // ✅ MODIFIED: Does NOT clear selectedOptions or lockedQuestions
//   changeActive: async (id) => {
//     console.log("🔁 Changing active to:", id);
    
//     set({
//       activeId: id,
//       currentIndex: 0,
//       paymentLocked: false,
//       // ✅ selectedOptions and lockedQuestions are NOT reset
//     });

//     const state = get();
//     if (state.units[id] && state.units[id].items.length > 0) {
//       console.log("✅ Already have questions");
//       set({ loading: false });
//       return;
//     }

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

//     await new Promise(resolve => setTimeout(resolve, 50));
//     await get().fetchMoreQuestions();
//   },

//   // ---------------- NAVIGATION ----------------
//   next: async () => {
//     const { currentIndex, paymentLocked } = get();
//     if (paymentLocked) return;

//     const unit = get().getUnit();

//     if (currentIndex < unit.items.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//       return;
//     }

//     if (!unit.exhausted) {
//       const before = unit.items.length;
//       await get().fetchMoreQuestions();
//       const after = get().getUnit().items.length;

//       if (after > before) {
//         set({ currentIndex: currentIndex + 1 });
//         return;
//       }
      
//       if (get().paymentLocked) {
//         console.log("💳 Payment required");
//         return;
//       }
//     }

//     if (unit.exhausted) {
//       await get().goToNextUnit();
//     }
//   },

//   prev: () =>
//     set((s) => ({
//       currentIndex: Math.max(0, s.currentIndex - 1),
//     })),

//   goToNextUnit: async () => {
//     const ids = get().getOrderedIds();
//     const { activeId } = get();

//     const idx = ids.indexOf(activeId);
//     if (idx === -1) return;

//     const nextId = ids[idx + 1];
//     if (!nextId) {
//       console.log("✅ Completed");
//       alert('🎉 You have finished all!');
//       return;
//     }

//     await get().changeActive(nextId);
//   },

//   fetchSubjectNames: async () => {
//     const { saved } = get();
//     if (!saved?.subjects?.length) return;
  
//     console.log("📘 Fetching subject names");
  
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/users/my-subjects`);
      
//       if (!res?.data) return;
  
//       let subjects = [];
      
//       if (res.data.subjectsByCategory) {
//         subjects = Object.values(res.data.subjectsByCategory).flat();
//       } else if (Array.isArray(res.data)) {
//         subjects = res.data;
//       }
  
//       const names = {};
  
//       subjects.forEach(subject => {
//         const subjectId = subject.id || subject.subjectId || subject._id;
//         if (saved.subjects.includes(subjectId)) {
//           names[subjectId] = subject.subjectName;
//         }
//       });
  
//       saved.subjects.forEach(id => {
//         if (!names[id]) {
//           console.warn(`⚠️ Subject name not found for ID: ${id}`);
//           names[id] = id;
//         }
//       });
  
//       set({ subjectNames: names });
  
//     } catch (err) {
//       console.error("❌ Failed to fetch subject names:", err);
      
//       const names = {};
//       saved.subjects.forEach(id => {
//         names[id] = id;
//       });
//       set({ subjectNames: names });
//     }
//   },

//   fetchTopicNames: async () => {
//     const { saved } = get();
//     if (!saved?.topics) return;

//     console.log("📙 Fetching topic names");

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/users/my-topics`);
      
//       if (!res?.data) return;

//       const subjects = res.data;
//       const topicNames = {};
//       const subjectNames = {};

//       const savedTopicIds = Object.values(saved.topics).flat();

//       subjects.forEach(subject => {
//         subject.topics?.forEach(topic => {
//           if (savedTopicIds.includes(topic.topicId)) {
//             topicNames[topic.topicId] = topic.topicName;
            
//             Object.keys(saved.topics).forEach(subjectId => {
//               if (saved.topics[subjectId].includes(topic.topicId)) {
//                 subjectNames[subjectId] = subject.subjectName;
//               }
//             });
//           }
//         });
//       });

//       savedTopicIds.forEach(id => {
//         if (!topicNames[id]) topicNames[id] = id;
//       });

//       set((s) => ({
//         topicNames,
//         subjectNames: { ...s.subjectNames, ...subjectNames },
//       }));

//     } catch (err) {
//       console.error("❌ Failed to fetch topic names:", err);
      
//       const topicNames = {};
//       const savedTopicIds = Object.values(saved.topics).flat();
//       savedTopicIds.forEach(id => {
//         topicNames[id] = id;
//       });
//       set({ topicNames });
//     }
//   },

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

//   startStudySession: async (savedData = null) => {
//     const { saved: storeSaved, sessionActive } = get();
//     const saved = savedData || storeSaved;
    
//     if (!saved || sessionActive) {
//       return null;
//     }

//     // ✅ Record start time
//     set({ sessionStartTime: Date.now() });

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
      
//       let payload = {};

//       if (saved.mode === "subject") {
//         payload.subjectId = saved.subjects.length === 1 ? saved.subjects[0] : saved.subjects;
//       } else if (saved.mode === "topic") {
//         const allTopicIds = Object.values(saved.topics).flat();
//         const subjectIds = Object.keys(saved.topics);

//         if (subjectIds.length === 1 && allTopicIds.length === 1) {
//           payload.subjectId = subjectIds[0];
//           payload.topicIds = allTopicIds;
//         } else {
//           payload.subjectId = subjectIds;
//           payload.topicIds = allTopicIds;
//         }
//       }

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
//         return res.data.sessionId;
//       }

//       return null;
//     } catch (err) {
//       console.error("❌ Failed to start study session:", err);
//       return null;
//     }
//   },

//   submitAnswer: async (questionId, userChoice) => {
//     const { sessionId, sessionActive } = get();
    
//     if (!sessionActive || !sessionId) {
//       return false;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const payload = {
//         sessionId,
//         questionId,
//         userChoice,
//       };

//       await fetchWithAuth(`${API_BASE}/study/answer`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       return true;
//     } catch (err) {
//       console.error("❌ Failed to submit answer:", err);
//       return false;
//     }
//   },

//   endStudySession: async () => {
//     const { sessionId, sessionActive } = get();
    
//     if (!sessionActive || !sessionId) {
//       console.log("⚠️ No active session to end");
//       return;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       await fetchWithAuth(`${API_BASE}/study/end`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ sessionId }),
//       });

//       console.log("✅ Study session ended");
//       set({ 
//         sessionId: null, 
//         sessionActive: false 
//       });

//     } catch (err) {
//       console.error("❌ Failed to end study session:", err);
//     }
//   },
  

//   // ✅ Set show summary flag
//   setShowSummary: (show) => {
//     console.log("📊 Setting showSummary:", show);
//     set({ showSummary: show });
//   },

//   // ✅ Generate study results
//   generateStudyResults: () => {
//     const state = get();
//     const { saved, units, selectedOptions, subjectNames, topicNames, sessionStartTime } = state;
    
//     console.log("📊 Generating study results...");

//     // Collect all questions from all units
//     const allQuestions = [];
//     const orderedIds = state.getOrderedIds();
    
//     orderedIds.forEach(id => {
//       const unit = units[id];
//       if (unit?.items) {
//         allQuestions.push(...unit.items.map(q => ({
//           ...q,
//           unitId: id,
//           unitName: saved.mode === "subject" 
//             ? subjectNames[id] 
//             : topicNames[id]
//         })));
//       }
//     });

//     // Calculate statistics
//     const totalQuestions = allQuestions.length;
//     const answeredQuestions = Object.keys(selectedOptions).length;
    
//     let correctAnswers = 0;
//     let incorrectAnswers = 0;
    
//     allQuestions.forEach(q => {
//       const userAnswer = selectedOptions[q.id];
//       if (userAnswer) {
//         if (userAnswer === q.correctAnswer) {
//           correctAnswers++;
//         } else {
//           incorrectAnswers++;
//         }
//       }
//     });

//     const skippedQuestions = totalQuestions - answeredQuestions;
//     const accuracy = answeredQuestions > 0 
//       ? Math.round((correctAnswers / answeredQuestions) * 100) 
//       : 0;

//     // Calculate time spent
//     let timeSpent = "00:00";
//     if (sessionStartTime) {
//       const endTime = Date.now();
//       const diffMs = endTime - sessionStartTime;
//       const minutes = Math.floor(diffMs / 60000);
//       const seconds = Math.floor((diffMs % 60000) / 1000);
//       timeSpent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
//     }

//     // Group by subject/topic
//     const subjectMap = {};
    
//     allQuestions.forEach(q => {
//       const subjectKey = q.unitId;
//       const subjectName = q.unitName || subjectKey;
      
//       if (!subjectMap[subjectKey]) {
//         subjectMap[subjectKey] = {
//           name: subjectName,
//           totalQuestions: 0,
//           correct: 0,
//           incorrect: 0,
//           skipped: 0,
//         };
//       }
      
//       subjectMap[subjectKey].totalQuestions++;
      
//       const userAnswer = selectedOptions[q.id];
//       if (!userAnswer) {
//         subjectMap[subjectKey].skipped++;
//       } else if (userAnswer === q.correctAnswer) {
//         subjectMap[subjectKey].correct++;
//       } else {
//         subjectMap[subjectKey].incorrect++;
//       }
//     });

//     // Prepare questions for summary
//     const questionsForSummary = allQuestions.map((q, idx) => ({
//       id: q.id,
//       questionNumber: idx + 1,
//       subject: q.unitName || "Unknown",
//       text: q.text,
//       userAnswer: selectedOptions[q.id] || null,
//       isCorrect: selectedOptions[q.id] 
//         ? selectedOptions[q.id] === q.correctAnswer 
//         : null,
//       difficulty: q.difficulty,
//       category: q.category,
//       year: q.year,
//     }));

//     const studyResults = {
//       sessionId: state.sessionId,
//       totalQuestions,
//       answeredQuestions,
//       correctAnswers,
//       incorrectAnswers,
//       skippedQuestions,
//       accuracy,
//       timeSpent,
//       completedAt: new Date().toISOString(),
//       subjects: Object.values(subjectMap),
//       questions: questionsForSummary,
//     };

//     console.log("✅ Study results generated:", studyResults);
//     set({ studyResults });
//     return studyResults;
//   },

// }));









import { create } from "zustand";
import useAuthStore from "./authStore";
import { usePaymentStore } from "./paymentStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
const REQUEST_LIMIT = 40;

// ✅ Simplified: Only need this for topic → subject lookup
async function getSubjectInfoForTopic(topicId, userSelectedCategory) {
  const { accessToken } = useAuthStore.getState();

  if (!accessToken || !topicId) return null;

  try {
    const response = await fetch(`${API_BASE}/users/my-topics`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) return null;

    const data = await response.json();
    const subjects = data.data || [];

    const filteredSubjects = userSelectedCategory
      ? subjects.filter(s => s.category === userSelectedCategory.toUpperCase())
      : subjects;

    for (const subject of filteredSubjects) {
      if (!subject.topics || subject.topics.length === 0) continue;

      for (const topic of subject.topics) {
        const match =
          topic.topicId === topicId ||
          topic.id === topicId ||
          topic._id === topicId;

        if (match) {
          return {
            id: subject.subjectId || subject.id || subject._id,
            subjectName: subject.subjectName,
            category: subject.category || userSelectedCategory
          };
        }
      }
    }

    return null;
  } catch (err) {
    console.error("❌ getSubjectInfoForTopic error:", err);
    return null;
  }
}

export const useStudyStore = create((set, get) => ({
  // ---------------- STATE ----------------
  saved: null,
  activeId: null,
  units: {},
  currentIndex: 0,
  selectedOptions: {}, // ✅ Persists across subject changes
  lockedQuestions: {}, // ✅ NEW: Track permanently locked questions
  subjectNames: {},
  topicNames: {},
  loading: false,
  paymentLocked: false,
  paymentLoading: false,
  initialized: false,
  sessionId: null,
  sessionActive: false,
  showSummary: false,
  studyResults: null,
  sessionStartTime: null,

  // ---------------- RESET ----------------
  reset: () => {
    console.log("🧹 Resetting store");
    
    set({
      saved: null,
      activeId: null,
      units: {},
      currentIndex: 0,
      selectedOptions: {},
      lockedQuestions: {},
      subjectNames: {},
      topicNames: {},
      paymentLocked: false,
      initialized: false,
      sessionId: null,
      sessionActive: false,
      loading: false,
      showSummary: false,
      studyResults: null,
      sessionStartTime: null,
    });
  },

  // ✅ NEW: Lock a question permanently (Study button)
  setQuestionLocked: (questionId, isLocked) => {
    console.log(`🔒 Locking question ${questionId}:`, isLocked);
    set((state) => ({
      lockedQuestions: {
        ...state.lockedQuestions,
        [questionId]: isLocked,
      },
    }));
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

    const saved = JSON.parse(localStorage.getItem("studySelections"));
    
    if (!saved) {
      console.warn("⚠️ No saved data");
      set({ loading: false });
      return null;
    }

    console.log("📦 User Selection:");
    console.log("  Mode:", saved.mode);
    console.log("  Category:", saved.exam);

    set({ 
      saved, 
      initialized: true, 
      loading: true,
    });

    try {
      if (saved.mode === "subject") {
        await get().fetchSubjectNames();
      } else {
        await get().fetchTopicNames();
      }

      const firstId =
        saved.mode === "subject"
          ? saved.subjects?.[0]
          : Object.values(saved.topics || {})[0]?.[0];

      console.log("🎯 First ID:", firstId);

      if (firstId) {
        await get().changeActive(firstId);
        setTimeout(() => {
          const currentState = get();
          if (currentState.loading) {
            set({ loading: false });
          }
        }, 100);
      } else {
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
  // ✅ MODIFIED: Selections persist across subject changes
  setSelectedOption: (questionId, optionId) => {
    console.log(`✏️ Setting answer for question ${questionId}:`, optionId);
    set((s) => ({
      selectedOptions: {
        ...s.selectedOptions,
        [questionId]: optionId,
      },
    }));
  },

  // ✅ SIMPLIFIED: Backend handles ALL access control
  fetchMoreQuestions: async () => {
    const state = get();
    const { saved, activeId, units } = state;
    
    console.log("\n🔍 Fetching more questions for:", activeId);
    
    if (!saved || !activeId) {
      console.log("❌ No saved or activeId");
      set({ loading: false });
      return;
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

    console.log(`📥 Fetching questions (skip: ${unit.skip})`);
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
        
        // Get parent subject info for topic mode
        const subjectInfo = await getSubjectInfoForTopic(activeId, saved.exam);
        if (subjectInfo?.id) {
          params.append('subjectId', subjectInfo.id);
          console.log("📤 Sending parent subjectId:", subjectInfo.id);
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

      // ✅ BACKEND DECIDES: Free limit exhausted OR payment required
      if (res?.status === 403 || res?.code === "PAYMENT_REQUIRED") {
        console.log("🔒 Backend says: Payment required (free trial exhausted or not paid)");
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
        return;
      }

      const data = Array.isArray(res?.data) ? res.data : [];
      console.log(`✅ Received ${data.length} questions from backend`);

      // ✅ No questions but no 403? End of content
      if (data.length === 0) {
        console.log("📭 No more questions available");
        set({ 
          loading: false,
          units: {
            ...get().units,
            [activeId]: {
              ...unit,
              exhausted: true,
            },
          },
        });
        return;
      }

      // ✅ Store questions
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
      
      // ✅ Check if error is 403
      if (
        err?.status === 403 ||
        err?.response?.status === 403 ||
        err?.message?.includes("403")
      ) {
        console.log("🔒 403 Error - Payment required");
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
        return;
      }
      
      set({ loading: false });
    }
  },

  // ---------------- CHANGE ACTIVE ----------------
  // ✅ MODIFIED: Does NOT clear selectedOptions or lockedQuestions
  changeActive: async (id) => {
    console.log("🔁 Changing active to:", id);
    
    set({
      activeId: id,
      currentIndex: 0,
      paymentLocked: false,
      // ✅ selectedOptions and lockedQuestions are NOT reset
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

  // ✅ NEW: Prefetch next batch when approaching end
  prefetchIfNeeded: async () => {
    const { currentIndex, paymentLocked, loading } = get();
    const unit = get().getUnit();
    
    // Don't prefetch if already loading, payment locked, or exhausted
    if (loading || paymentLocked || unit.exhausted) return;
    
    // Prefetch when within 5 questions of the end
    const questionsRemaining = unit.items.length - currentIndex;
    const shouldPrefetch = questionsRemaining <= 5 && questionsRemaining > 0;
    
    if (shouldPrefetch) {
      console.log("🔮 Prefetching next batch...");
      await get().fetchMoreQuestions();
    }
  },

  // ---------------- NAVIGATION ----------------
  next: async () => {
    const { currentIndex, paymentLocked } = get();
    if (paymentLocked) return;

    const unit = get().getUnit();

    // ✅ FAST PATH: If next question already exists, just increment
    if (currentIndex < unit.items.length - 1) {
      set({ currentIndex: currentIndex + 1 });
      
      // ✅ Trigger prefetch in background (non-blocking)
      setTimeout(() => get().prefetchIfNeeded(), 0);
      return;
    }

    // ✅ At last question - check if we need to fetch more or move to next unit
    if (unit.exhausted) {
      // Already exhausted, move to next unit
      await get().goToNextUnit();
      return;
    }

    // Need to fetch more questions
    const before = unit.items.length;
    await get().fetchMoreQuestions();
    const after = get().getUnit().items.length;

    if (after > before) {
      // Successfully fetched more, move to next
      set({ currentIndex: currentIndex + 1 });
      return;
    }
    
    // No more questions available (exhausted or payment required)
    if (get().paymentLocked) {
      console.log("💳 Payment required");
      return;
    }

    // If exhausted after fetch attempt, move to next unit
    if (get().getUnit().exhausted) {
      await get().goToNextUnit();
    }
  },

  prev: () =>
    set((s) => ({
      currentIndex: Math.max(0, s.currentIndex - 1),
    })),

  goToNextUnit: async () => {
    const ids = get().getOrderedIds();
    const { activeId } = get();

    const idx = ids.indexOf(activeId);
    if (idx === -1) return;

    const nextId = ids[idx + 1];
    if (!nextId) {
      console.log("✅ Completed");
      alert('🎉 You have finished all!');
      return;
    }

    await get().changeActive(nextId);
  },

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
          console.warn(`⚠️ Subject name not found for ID: ${id}`);
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
        subject.topics?.forEach(topic => {
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

  startStudySession: async (savedData = null) => {
    const { saved: storeSaved, sessionActive } = get();
    const saved = savedData || storeSaved;
    
    if (!saved || sessionActive) {
      return null;
    }

    // ✅ Record start time
    set({ sessionStartTime: Date.now() });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      
      let payload = {};

      if (saved.mode === "subject") {
        payload.subjectId = saved.subjects.length === 1 ? saved.subjects[0] : saved.subjects;
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
      return false;
    }

    try {
      const { fetchWithAuth } = useAuthStore.getState();

      const payload = {
        sessionId,
        questionId,
        userChoice,
      };

      await fetchWithAuth(`${API_BASE}/study/answer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      return true;
    } catch (err) {
      console.error("❌ Failed to submit answer:", err);
      return false;
    }
  },

  endStudySession: async () => {
    const { sessionId, sessionActive } = get();
    
    if (!sessionActive || !sessionId) {
      console.log("⚠️ No active session to end");
      return;
    }

    try {
      const { fetchWithAuth } = useAuthStore.getState();

      await fetchWithAuth(`${API_BASE}/study/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      console.log("✅ Study session ended");
      set({ 
        sessionId: null, 
        sessionActive: false 
      });

    } catch (err) {
      console.error("❌ Failed to end study session:", err);
    }
  },
  

  // ✅ Set show summary flag
  setShowSummary: (show) => {
    console.log("📊 Setting showSummary:", show);
    set({ showSummary: show });
  },

  // ✅ Generate study results
  generateStudyResults: () => {
    const state = get();
    const { saved, units, selectedOptions, subjectNames, topicNames, sessionStartTime } = state;
    
    console.log("📊 Generating study results...");

    // Collect all questions from all units
    const allQuestions = [];
    const orderedIds = state.getOrderedIds();
    
    orderedIds.forEach(id => {
      const unit = units[id];
      if (unit?.items) {
        allQuestions.push(...unit.items.map(q => ({
          ...q,
          unitId: id,
          unitName: saved.mode === "subject" 
            ? subjectNames[id] 
            : topicNames[id]
        })));
      }
    });

    // Calculate statistics
    const totalQuestions = allQuestions.length;
    const answeredQuestions = Object.keys(selectedOptions).length;
    
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    
    allQuestions.forEach(q => {
      const userAnswer = selectedOptions[q.id];
      if (userAnswer) {
        if (userAnswer === q.correctAnswer) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    });

    const skippedQuestions = totalQuestions - answeredQuestions;
    const accuracy = answeredQuestions > 0 
      ? Math.round((correctAnswers / answeredQuestions) * 100) 
      : 0;

    // Calculate time spent
    let timeSpent = "00:00";
    if (sessionStartTime) {
      const endTime = Date.now();
      const diffMs = endTime - sessionStartTime;
      const minutes = Math.floor(diffMs / 60000);
      const seconds = Math.floor((diffMs % 60000) / 1000);
      timeSpent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Group by subject/topic
    const subjectMap = {};
    
    allQuestions.forEach(q => {
      const subjectKey = q.unitId;
      const subjectName = q.unitName || subjectKey;
      
      if (!subjectMap[subjectKey]) {
        subjectMap[subjectKey] = {
          name: subjectName,
          totalQuestions: 0,
          correct: 0,
          incorrect: 0,
          skipped: 0,
        };
      }
      
      subjectMap[subjectKey].totalQuestions++;
      
      const userAnswer = selectedOptions[q.id];
      if (!userAnswer) {
        subjectMap[subjectKey].skipped++;
      } else if (userAnswer === q.correctAnswer) {
        subjectMap[subjectKey].correct++;
      } else {
        subjectMap[subjectKey].incorrect++;
      }
    });

    // Prepare questions for summary
    const questionsForSummary = allQuestions.map((q, idx) => ({
      id: q.id,
      questionNumber: idx + 1,
      subject: q.unitName || "Unknown",
      text: q.text,
      userAnswer: selectedOptions[q.id] || null,
      isCorrect: selectedOptions[q.id] 
        ? selectedOptions[q.id] === q.correctAnswer 
        : null,
      difficulty: q.difficulty,
      category: q.category,
      year: q.year,
    }));

    const studyResults = {
      sessionId: state.sessionId,
      totalQuestions,
      answeredQuestions,
      correctAnswers,
      incorrectAnswers,
      skippedQuestions,
      accuracy,
      timeSpent,
      completedAt: new Date().toISOString(),
      subjects: Object.values(subjectMap),
      questions: questionsForSummary,
    };

    console.log("✅ Study results generated:", studyResults);
    set({ studyResults });
    return studyResults;
  },

}));