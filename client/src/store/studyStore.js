// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { usePaymentStore } from "./paymentStore";

// const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;
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
//   namesReady: false,
//   loading: false,
//   paymentLocked: false,
//   paymentLoading: false,
//   initialized: false,
//   sessionId: null,
//   sessionActive: false,
//   showSummary: false,
//   studyResults: null,
//   sessionStartTime: null,
//    sessionKey: 0,


//  triggerRestart: () => {   // ← ADD THIS ACTION
//     set((s) => ({ sessionKey: s.sessionKey + 1 }));
//   },

//   // ---------------- RESET ----------------
//   reset: () => {
//         console.log("🧹 Resetting store");
    
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
//       // sessionKey is intentionally NOT reset here — it is a monotonically
//       // increasing trigger for the StudyPage init effect. Resetting it to 0
//       // causes a collision with triggerRestart() (0→1) which means the effect
//       // dependency doesn't change on the 2nd+ "New Session" click and the
//       // session never re-initialises.
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

//   // ✅ NEW: Prefetch next batch when approaching end
//   prefetchIfNeeded: async () => {
//     const { currentIndex, paymentLocked, loading } = get();
//     const unit = get().getUnit();
    
//     // Don't prefetch if already loading, payment locked, or exhausted
//     if (loading || paymentLocked || unit.exhausted) return;
    
//     // Prefetch when within 5 questions of the end
//     const questionsRemaining = unit.items.length - currentIndex;
//     const shouldPrefetch = questionsRemaining <= 5 && questionsRemaining > 0;
    
//     if (shouldPrefetch) {
//       console.log("🔮 Prefetching next batch...");
//       await get().fetchMoreQuestions();
//     }
//   },

//   // ---------------- NAVIGATION ----------------
//   next: async () => {
//     const { currentIndex, paymentLocked } = get();
//     if (paymentLocked) return;

//     const unit = get().getUnit();

//     // ✅ FAST PATH: If next question already exists, just increment
//     if (currentIndex < unit.items.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
      
//       // ✅ Trigger prefetch in background (non-blocking)
//       setTimeout(() => get().prefetchIfNeeded(), 0);
//       return;
//     }

//     // ✅ At last question - check if we need to fetch more or move to next unit
//     if (unit.exhausted) {
//       // Already exhausted, move to next unit
//       await get().goToNextUnit();
//       return;
//     }

//     // Need to fetch more questions
//     const before = unit.items.length;
//     await get().fetchMoreQuestions();
//     const after = get().getUnit().items.length;

//     if (after > before) {
//       // Successfully fetched more, move to next
//       set({ currentIndex: currentIndex + 1 });
//       return;
//     }
    
//     // No more questions available (exhausted or payment required)
//     if (get().paymentLocked) {
//       console.log("💳 Payment required");
//       return;
//     }

//     // If exhausted after fetch attempt, move to next unit
//     if (get().getUnit().exhausted) {
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
//       set({ namesReady: true });
  
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
//     // const questionsForSummary = allQuestions.map((q, idx) => ({
//     //   id: q.id,
//     //   questionNumber: idx + 1,
//     //   subject: q.unitName || "Unknown",
//     //   text: q.text,
//     //   userAnswer: selectedOptions[q.id] || null,
//     //   isCorrect: selectedOptions[q.id] 
//     //     ? selectedOptions[q.id] === q.correctAnswer 
//     //     : null,
//     //   difficulty: q.difficulty,
//     //   category: q.category,
//     //   year: q.year,
//     // }));

//     const questionsForSummary = allQuestions.map((q, idx) => ({
//       id: q.id,
//       questionNumber: idx + 1,
//       subject: q.unitName || "Unknown",
//       text: q.text,

//       // ✅ Carry through correct answer using every possible field name
//       correctAnswer:
//         q.correctAnswer ??
//         q.correct_answer ??
//         q.answer ??
//         q.answerKey ??
//         q.correctOption ??
//         null,

//       userAnswer: selectedOptions[q.id] || null,

//       isCorrect: selectedOptions[q.id]
//         ? selectedOptions[q.id] ===
//           (q.correctAnswer ?? q.correct_answer ?? q.answer ?? q.answerKey ?? q.correctOption)
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




// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { usePaymentStore } from "./paymentStore";

// const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;
// const REQUEST_LIMIT = 40;

// // ✅ Helper: does the current (paid) user have an active subscription for this
// // subject/topic? Reads the payment store's `activeSubscriptions`, which is
// // populated from the `/payments/status` payload's `data.subscriptions.active`.
// // Returns true only when there is an exact subject id + category match.
// function checkIfUserPaidForSubject(subjectInfo, category) {
//   try {
//     const paymentState = usePaymentStore.getState();

//     let activeSubscriptions =
//       paymentState.activeSubscriptions ||
//       paymentState.subscriptions?.active ||
//       paymentState.active ||
//       [];

//     if (!Array.isArray(activeSubscriptions) || activeSubscriptions.length === 0) {
//       return false;
//     }

//     const subjectId =
//       typeof subjectInfo === "string" ? subjectInfo : subjectInfo?.id || subjectInfo?.subjectId;
//     const subjectName = typeof subjectInfo === "string" ? null : subjectInfo?.subjectName;

//     return activeSubscriptions.some((sub) => {
//       const idMatches =
//         sub.subjectId === subjectId || sub.id === subjectId || sub._id === subjectId;
//       const categoryMatches = !category || sub.category === category;
//       return idMatches && categoryMatches;
//     });
//   } catch (err) {
//     console.error("❌ checkIfUserPaidForSubject error:", err);
//     return false;
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
//   namesReady: false,
//   loading: false,
//   paymentLocked: false,
//   paymentLoading: false,
//   initialized: false,
//   sessionId: null,
//   sessionActive: false,
//   showSummary: false,
//   studyResults: null,
//   sessionStartTime: null,
//    sessionKey: 0,


//   triggerRestart: () => {   // ← ADD THIS ACTION
//     set((s) => ({ sessionKey: s.sessionKey + 1 }));
//   },

//   // ---------------- RESET ----------------
//   reset: () => {
//         console.log("🧹 Resetting store");
    
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
//       // sessionKey is intentionally NOT reset here — it is a monotonically
//       // increasing trigger for the StudyPage init effect. Resetting it to 0
//       // causes a collision with triggerRestart() (0→1) which means the effect
//       // dependency doesn't change on the 2nd+ "New Session" click and the
//       // session never re-initialises.
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
//     // ✅ Persist locked questions immediately
//     if (typeof get().saveSelections === "function") get().saveSelections();
//   },

//   // ✅ Persist the current selections back to localStorage so a reload /
//   // re-mount can restore the session. Without this, StudyPage's init flow
//   // called saveSelections() on a non-existent method, which THREW a TypeError
//   // and prevented startStudySession() from ever running (so "Session Active"
//   // and "End Session" never appeared and answers were never submitted).
//   saveSelections: () => {
//     const state = get();
//     const saved = state.saved;
//     if (!saved) return;

//     const stored = localStorage.getItem("studySelections");
//     let existing = {};
//     try {
//       existing = stored ? JSON.parse(stored) : {};
//     } catch (err) {
//       console.error("❌ Failed to parse studySelections:", err);
//     }

//     const merged = {
//       ...existing,
//       ...saved,
//       // Keep latest selections from the running session
//       selectedOptions: state.selectedOptions || existing.selectedOptions || {},
//       lockedQuestions: state.lockedQuestions || existing.lockedQuestions || {},
//     };

//     try {
//       localStorage.setItem("studySelections", JSON.stringify(merged));
//     } catch (err) {
//       console.error("❌ Failed to save studySelections:", err);
//     }
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
//     // ✅ Persist user selections immediately
//     if (typeof get().saveSelections === "function") get().saveSelections();
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
//     // 🚦 Only turn on the page-level loader when the active unit has NO questions
//     // yet. Appending more questions (prefetch / pagination) must NOT blank the
//     // whole page — that's what caused the "field reloads" feel when switching
//     // between subjects/topics.
//     if ((unit.items?.length || 0) === 0) {
//       set({ loading: true });
//     }

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
//         } else {
//           // No year selected (or "random" chosen) → random by default.
//           // A user only gets a specific year when they explicitly pick one.
//           params.append('random', 'true');
//         }
//       } else if (saved.mode === "topic") {
//         params.append('topicId', activeId);
        
//         // ✅ Derive the parent subjectId directly from saved.topics
//         // ({ [subjectId]: [topicId, ...] }) — a pure local lookup with NO extra
//         // network call. This fixes topic mode never loading questions: the old
//         // getSubjectInfoForTopic() resolved the parent subject via a separate
//         // (unreliable, slow) API fetch that often returned null, so no subjectId
//         // was sent and the backend returned zero questions.
//         const subjectId = Object.keys(saved.topics || {}).find((sid) =>
//           Array.isArray(saved.topics[sid]) && saved.topics[sid].includes(activeId)
//         );
//         if (subjectId) {
//           params.append('subjectId', subjectId);
//           console.log("📤 Sending parent subjectId:", subjectId);
//         }
        
//         const year = saved.topicYears?.[activeId];
//         if (year && year !== 'random') {
//           params.append('year', year);
//         } else {
//           // No year selected (or "random" chosen) → random by default.
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
//       // ✅ Persist selections after navigation
//       if (typeof get().saveSelections === "function") get().saveSelections();
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

//   // ✅ NEW: Prefetch next batch when approaching end
//   prefetchIfNeeded: async () => {
//     const { currentIndex, paymentLocked, loading } = get();
//     const unit = get().getUnit();
    
//     // Don't prefetch if already loading, payment locked, or exhausted
//     if (loading || paymentLocked || unit.exhausted) return;
    
//     // Prefetch when within 5 questions of the end
//     const questionsRemaining = unit.items.length - currentIndex;
//     const shouldPrefetch = questionsRemaining <= 5 && questionsRemaining > 0;
    
//     if (shouldPrefetch) {
//       console.log("🔮 Prefetching next batch...");
//       await get().fetchMoreQuestions();
//     }
//   },

//   // ---------------- NAVIGATION ----------------
//   next: async () => {
//     const { currentIndex, paymentLocked } = get();
//     if (paymentLocked) return;

//     const unit = get().getUnit();

//     // ✅ FAST PATH: If next question already exists, just increment
//     if (currentIndex < unit.items.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
      
//       // ✅ Trigger prefetch in background (non-blocking)
//       setTimeout(() => get().prefetchIfNeeded(), 0);
//       return;
//     }

//     // ✅ At last question - check if we need to fetch more or move to next unit
//     if (unit.exhausted) {
//       // Already exhausted, move to next unit
//       await get().goToNextUnit();
//       return;
//     }

//     // Need to fetch more questions
//     const before = unit.items.length;
//     await get().fetchMoreQuestions();
//     const after = get().getUnit().items.length;

//     if (after > before) {
//       // Successfully fetched more, move to next
//       set({ currentIndex: currentIndex + 1 });
//       return;
//     }
    
//     // No more questions available (exhausted or payment required)
//     if (get().paymentLocked) {
//       console.log("💳 Payment required");
//       return;
//     }

//     // If exhausted after fetch attempt, move to next unit
//     if (get().getUnit().exhausted) {
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
//       set({ namesReady: true });
  
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

//     // ✅ Build the payload
//     let payload = {};
//     if (saved.mode === "subject") {
//       payload.subjectId = saved.subjects.length === 1 ? saved.subjects[0] : saved.subjects;
//     } else if (saved.mode === "topic") {
//       const allTopicIds = Object.values(saved.topics).flat();
//       const subjectIds = Object.keys(saved.topics);
//       if (subjectIds.length === 1 && allTopicIds.length === 1) {
//         payload.subjectId = subjectIds[0];
//         payload.topicIds = allTopicIds;
//       } else {
//         payload.subjectId = subjectIds;
//         payload.topicIds = allTopicIds;
//       }
//     }

//     let serverSessionId = null;

//     // ✅ Try the backend /study/start endpoint, but NEVER let its absence or
//     // failure block the session. The frontend session is what drives the UI
//     // ("Session Active" / "End Session") and the local summary. If the backend
//     // endpoint is present it returns a real id; otherwise we fall back to a
//     // local id so the study flow still works end-to-end.
//     try {
//       const { fetchWithAuth } = useAuthStore.getState();
//       const res = await fetchWithAuth(`${API_BASE}/study/start`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });
//       if (res?.data?.sessionId) {
//         serverSessionId = res.data.sessionId;
//       }
//     } catch (err) {
//       console.warn("⚠️ /study/start unavailable — continuing with a local session:", err);
//     }

//     const sessionId =
//       serverSessionId ||
//       `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

//     set({
//       sessionId,
//       sessionActive: true,
//     });

//     if (!serverSessionId) {
//       console.warn("🗒️ Session is LOCAL-only (no server sessionId). Answers are tracked for the on-screen summary but may not persist to the backend.");
//     }

//     return sessionId;
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
//     // const questionsForSummary = allQuestions.map((q, idx) => ({
//     //   id: q.id,
//     //   questionNumber: idx + 1,
//     //   subject: q.unitName || "Unknown",
//     //   text: q.text,
//     //   userAnswer: selectedOptions[q.id] || null,
//     //   isCorrect: selectedOptions[q.id] 
//     //     ? selectedOptions[q.id] === q.correctAnswer 
//     //     : null,
//     //   difficulty: q.difficulty,
//     //   category: q.category,
//     //   year: q.year,
//     // }));

//     const questionsForSummary = allQuestions.map((q, idx) => ({
//       id: q.id,
//       questionNumber: idx + 1,
//       subject: q.unitName || "Unknown",
//       text: q.text,

//       // ✅ Carry through correct answer using every possible field name
//       correctAnswer:
//         q.correctAnswer ??
//         q.correct_answer ??
//         q.answer ??
//         q.answerKey ??
//         q.correctOption ??
//         null,

//       userAnswer: selectedOptions[q.id] || null,

//       isCorrect: selectedOptions[q.id]
//         ? selectedOptions[q.id] ===
//           (q.correctAnswer ?? q.correct_answer ?? q.answer ?? q.answerKey ?? q.correctOption)
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

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;
const REQUEST_LIMIT = 40;

// ✅ Helper: does the current (paid) user have an active subscription for this
// subject/topic? Reads the payment store's `activeSubscriptions`, which is
// populated from the `/payments/status` payload's `data.subscriptions.active`.
// Returns true only when there is an exact subject id + category match.
function checkIfUserPaidForSubject(subjectInfo, category) {
  try {
    const paymentState = usePaymentStore.getState();

    let activeSubscriptions =
      paymentState.activeSubscriptions ||
      paymentState.subscriptions?.active ||
      paymentState.active ||
      [];

    if (!Array.isArray(activeSubscriptions) || activeSubscriptions.length === 0) {
      return false;
    }

    const subjectId =
      typeof subjectInfo === "string" ? subjectInfo : subjectInfo?.id || subjectInfo?.subjectId;
    const subjectName = typeof subjectInfo === "string" ? null : subjectInfo?.subjectName;

    return activeSubscriptions.some((sub) => {
      const idMatches =
        sub.subjectId === subjectId || sub.id === subjectId || sub._id === subjectId;
      const categoryMatches = !category || sub.category === category;
      return idMatches && categoryMatches;
    });
  } catch (err) {
    console.error("❌ checkIfUserPaidForSubject error:", err);
    return false;
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
  namesReady: false,
  loading: false,
  paymentLocked: false,
  paymentLoading: false,
  initialized: false,
  sessionId: null,
  sessionActive: false,
  showSummary: false,
  studyResults: null,
  sessionStartTime: null,
   sessionKey: 0,


  triggerRestart: () => {   // ← ADD THIS ACTION
    set((s) => ({ sessionKey: s.sessionKey + 1 }));
  },

    // ---------------- RESET ----------------
  // ✅ Cache reset: clears BOTH the in-memory store AND the persisted
  // `studySelections` localStorage key. Invoked whenever the user leaves the
  // study flow (Back to Dashboard / New Session). Clearing localStorage
  // guarantees StudyPage.syncSaved() cannot resurrect the previous session's
  // config/units, so the GET /users/study-questions?... call fires again on
  // the next visit.
  reset: () => {
    console.log("🧹 Resetting study store + clearing localStorage");
    try {
      localStorage.removeItem("studySelections");
    } catch (err) {
      console.error("❌ Failed to clear studySelections:", err);
    }
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
      // sessionKey is intentionally NOT reset here — it is a monotonically
      // increasing trigger for the StudyPage init effect. Resetting it to 0
      // causes a collision with triggerRestart() (0→1) which means the effect
      // dependency doesn't change on the 2nd+ "New Session" click and the
      // session never re-initialises.
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
    // ✅ Persist locked questions immediately
    if (typeof get().saveSelections === "function") get().saveSelections();
  },

  // ✅ Persist the current selections back to localStorage so a reload /
  // re-mount can restore the session. Without this, StudyPage's init flow
  // called saveSelections() on a non-existent method, which THREW a TypeError
  // and prevented startStudySession() from ever running (so "Session Active"
  // and "End Session" never appeared and answers were never submitted).
  saveSelections: () => {
    const state = get();
    const saved = state.saved;
    if (!saved) return;

    const stored = localStorage.getItem("studySelections");
    let existing = {};
    try {
      existing = stored ? JSON.parse(stored) : {};
    } catch (err) {
      console.error("❌ Failed to parse studySelections:", err);
    }

    const merged = {
      ...existing,
      ...saved,
      // Keep latest selections from the running session
      selectedOptions: state.selectedOptions || existing.selectedOptions || {},
      lockedQuestions: state.lockedQuestions || existing.lockedQuestions || {},
    };

    try {
      localStorage.setItem("studySelections", JSON.stringify(merged));
    } catch (err) {
      console.error("❌ Failed to save studySelections:", err);
    }
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
    // ✅ Persist user selections immediately
    if (typeof get().saveSelections === "function") get().saveSelections();
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
    // 🚦 Only turn on the page-level loader when the active unit has NO questions
    // yet. Appending more questions (prefetch / pagination) must NOT blank the
    // whole page — that's what caused the "field reloads" feel when switching
    // between subjects/topics.
    if ((unit.items?.length || 0) === 0) {
      set({ loading: true });
    }

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
        } else {
          // No year selected (or "random" chosen) → random by default.
          // A user only gets a specific year when they explicitly pick one.
          params.append('random', 'true');
        }
      } else if (saved.mode === "topic") {
        params.append('topicId', activeId);
        
        // ✅ Derive the parent subjectId directly from saved.topics
        // ({ [subjectId]: [topicId, ...] }) — a pure local lookup with NO extra
        // network call. This fixes topic mode never loading questions: the old
        // getSubjectInfoForTopic() resolved the parent subject via a separate
        // (unreliable, slow) API fetch that often returned null, so no subjectId
        // was sent and the backend returned zero questions.
        const subjectId = Object.keys(saved.topics || {}).find((sid) =>
          Array.isArray(saved.topics[sid]) && saved.topics[sid].includes(activeId)
        );
        if (subjectId) {
          params.append('subjectId', subjectId);
          console.log("📤 Sending parent subjectId:", subjectId);
        }
        
        const year = saved.topicYears?.[activeId];
        if (year && year !== 'random') {
          params.append('year', year);
        } else {
          // No year selected (or "random" chosen) → random by default.
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
              needsPayment: true,
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
              needsPayment: true,
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
    // ✅ If this subject/topic was previously locked (required payment), keep
    //    showing the lock screen instead of falling into "No questions found".
    if (state.units[id]?.needsPayment) {
      console.log("🔒 Previously locked subject — restoring lock screen");
      set({ paymentLocked: true, loading: false });
      return;
    }

    if (state.units[id] && state.units[id].items.length > 0) {
      console.log("✅ Already have questions");
      set({ loading: false });
      // ✅ Persist selections after navigation
      if (typeof get().saveSelections === "function") get().saveSelections();
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
      set({ namesReady: true });
  
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

    // ✅ Build the payload
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

    let serverSessionId = null;

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/study/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res?.data?.sessionId) {
        serverSessionId = res.data.sessionId;
      }
    } catch (err) {
      console.warn("⚠️ /study/start unavailable — continuing with a local session:", err);
    }

    const sessionId =
      serverSessionId ||
      `local-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    set({
      sessionId,
      sessionActive: true,
    });

    if (!serverSessionId) {
      console.warn("🗒️ Session is LOCAL-only (no server sessionId). Answers are tracked for the on-screen summary but may not persist to the backend.");
    }

    return sessionId;
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
    // const questionsForSummary = allQuestions.map((q, idx) => ({
    //   id: q.id,
    //   questionNumber: idx + 1,
    //   subject: q.unitName || "Unknown",
    //   text: q.text,
    //   userAnswer: selectedOptions[q.id] || null,
    //   isCorrect: selectedOptions[q.id] 
    //     ? selectedOptions[q.id] === q.correctAnswer 
    //     : null,
    //   difficulty: q.difficulty,
    //   category: q.category,
    //   year: q.year,
    // }));

    const questionsForSummary = allQuestions.map((q, idx) => ({
      id: q.id,
      questionNumber: idx + 1,
      subject: q.unitName || "Unknown",
      text: q.text,

      // ✅ Carry through correct answer using every possible field name
      correctAnswer:
        q.correctAnswer ??
        q.correct_answer ??
        q.answer ??
        q.answerKey ??
        q.correctOption ??
        null,

      userAnswer: selectedOptions[q.id] || null,

      isCorrect: selectedOptions[q.id]
        ? selectedOptions[q.id] ===
          (q.correctAnswer ?? q.correct_answer ?? q.answer ?? q.answerKey ?? q.correctOption)
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