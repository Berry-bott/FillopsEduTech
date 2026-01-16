
// import { create } from "zustand";
// import useAuthStore from "./authStore";
// import { usePaymentStore } from "./paymentStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
// const REQUEST_LIMIT = 40;
// const FREE_QUESTIONS_LIMIT = 5; // Free trial limit for exams

// // ✅ Check if user has used their free exam questions
// function hasUsedFreeExamQuestions() {
//   const freeQuestionsUsed = localStorage.getItem('freeExamQuestionsUsed');
//   const count = parseInt(freeQuestionsUsed || '0', 10);
//   console.log(`📊 Free exam questions used: ${count}/${FREE_QUESTIONS_LIMIT}`);
//   return count >= FREE_QUESTIONS_LIMIT;
// }

// // ✅ Increment free exam questions counter
// function incrementFreeExamQuestionsCount(questionsCount) {
//   const current = parseInt(localStorage.getItem('freeExamQuestionsUsed') || '0', 10);
//   const newCount = current + questionsCount;
//   localStorage.setItem('freeExamQuestionsUsed', newCount.toString());
//   console.log(`📈 Free exam questions count: ${current} → ${newCount}`);
//   return newCount;
// }

// // ✅ STRICT CHECK: Must match EXACT subject ID + category
// function checkIfUserPaidForSubject(subjectInfo, category) {
//   const paymentState = usePaymentStore.getState();
  
//   console.log("\n================================");
//   console.log("🔍 STRICT PAYMENT CHECK (EXAM)");
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
    
//     console.log(`    - ID Match: ${idMatches}`);
//     console.log(`    - Category Match: ${categoryMatches}`);
//     console.log(`    - Result: ${matches ? '✅ MATCH!' : '❌ No match'}`);
    
//     if (matches) {
//       console.log("\n🎉 EXACT MATCH FOUND!");
//       console.log(`   User HAS paid for: ${sub.subjectName}`);
//     }
    
//     return matches;
//   });
  
//   if (!hasPaid) {
//     console.log("\n❌ ACCESS DENIED - NO MATCHING SUBSCRIPTION");
//   }
  
//   console.log("\n================================");
//   console.log(`FINAL RESULT: ${hasPaid ? '✅ ACCESS GRANTED' : '❌ ACCESS DENIED'}`);
//   console.log("================================\n");
  
//   return hasPaid;
// }

// async function getSubjectInfoForTopic(topicId, userSelectedCategory) {
//   console.log("\n🔍 GET SUBJECT INFO FOR TOPIC (EXAM)");
//   console.log("Topic ID:", topicId);
//   console.log("Category:", userSelectedCategory);
  
//   const { accessToken } = useAuthStore.getState();
  
//   if (!accessToken || !topicId) {
//     console.error("❌ No access token or topic ID!");
//     return null;
//   }

//   try {
//     const response = await fetch(`${API_BASE}/users/my-subjects`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     });

//     if (!response.ok) {
//       console.error("❌ Failed to fetch subjects:", response.status);
//       return null;
//     }

//     const data = await response.json();
//     const subjectsByCategory = data.data?.subjectsByCategory || {};
//     const examKey = userSelectedCategory?.toUpperCase();
//     const subjects = subjectsByCategory[examKey] || [];
    
//     console.log(`📚 Found ${subjects.length} subjects for ${examKey}`);

//     if (subjects.length === 0) {
//       console.warn(`⚠️ No subjects found for category: ${examKey}`);
//       return null;
//     }

//     for (let i = 0; i < subjects.length; i++) {
//       const subject = subjects[i];
      
//       try {
//         const topicsRes = await fetch(
//           `${API_BASE}/users/my-topics?subjectId=${subject.id}`,
//           { headers: { Authorization: `Bearer ${accessToken}` } }
//         );
        
//         if (!topicsRes.ok) continue;
        
//         const topicsData = await topicsRes.json();
//         const subjectData = topicsData.data?.[0];
        
//         if (!subjectData || !subjectData.modules) continue;
        
//         for (const module of subjectData.modules) {
//           if (!module.topics || module.topics.length === 0) continue;
          
//           for (const topic of module.topics) {
//             const topicIdMatch = topic.topicId === topicId || 
//                                 topic.id === topicId || 
//                                 topic._id === topicId;
            
//             if (topicIdMatch) {
//               console.log("\n🎉 TOPIC FOUND!");
//               console.log("Topic Name:", topic.topicName);
//               console.log("Subject Name:", subject.subjectName);
//               console.log("Subject ID:", subject.id);
              
//               return {
//                 id: subject.id,
//                 subjectName: subject.subjectName,
//                 category: userSelectedCategory
//               };
//             }
//           }
//         }
//       } catch (err) {
//         console.error(`❌ Error fetching topics for subject ${subject.id}:`, err);
//         continue;
//       }
//     }

//     console.log("\n❌ TOPIC NOT FOUND IN ANY SUBJECT");
//     return null;
//   } catch (error) {
//     console.error("\n❌ ERROR IN getSubjectInfoForTopic:", error);
//     return null;
//   }
// }

// export const useExamStore = create((set, get) => ({
//   // ---------------- STATE ----------------
//   saved: null,
//   activeId: null,
//   units: {},
//   currentIndex: 0,
//   selectedAnswers: {}, // Store all user answers during exam
//   subjectNames: {},
//   topicNames: {},
//   loading: false,
//   paymentLocked: false,
//   paymentLoading: false,
//   initialized: false,
//   examId: null, // Active exam session ID
//   examActive: false,
//   examStartTime: null,
//   examDuration: null, // in minutes
//   timeRemaining: null, // in seconds
//   freeTrialActive: !hasUsedFreeExamQuestions(),
//   examCompleted: false,
//   examResults: null,

//   // ---------------- RESET ----------------
//   reset: () => {
//     console.log("🧹 Resetting exam store");
    
//     set({
//       saved: null,
//       activeId: null,
//       units: {},
//       currentIndex: 0,
//       selectedAnswers: {},
//       subjectNames: {},
//       topicNames: {},
//       paymentLocked: false,
//       initialized: false,
//       examId: null,
//       examActive: false,
//       examStartTime: null,
//       examDuration: null,
//       timeRemaining: null,
//       loading: false,
//       freeTrialActive: !hasUsedFreeExamQuestions(),
//       examCompleted: false,
//       examResults: null,
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

//     console.log("🔄 Starting syncSaved for EXAM...");

//     // const saved = JSON.parse(localStorage.getItem("examSelections"));
//     const saved = JSON.parse(localStorage.getItem("studySelections"));
//     console.log(saved);
    
    
//     if (!saved) {
//       console.warn("⚠️ No saved exam data");
//       set({ loading: false });
//       return null;
//     }

//     console.log("📦 Exam Selection:");
//     console.log("  Mode:", saved.mode);
//     console.log("  Category:", saved.exam);
//     console.log("  Duration:", saved.duration, "minutes");

//     set({ 
//       saved, 
//       initialized: true, 
//       loading: true,
//       examDuration: saved.duration,
//       freeTrialActive: !hasUsedFreeExamQuestions() 
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

//   // ---------------- ANSWER SELECTION ----------------
//   setSelectedAnswer: (questionId, optionId) =>
//     set((s) => ({
//       selectedAnswers: {
//         ...s.selectedAnswers,
//         [questionId]: optionId,
//       },
//     })),

//   // Get all questions across all units
//   getAllQuestions: () => {
//     const { units } = get();
//     return Object.values(units).flatMap(unit => unit.items);
//   },

//   // Get answered count
//   getAnsweredCount: () => {
//     const { selectedAnswers } = get();
//     return Object.keys(selectedAnswers).length;
//   },

//   // ---------------- FETCH QUESTIONS (WITH FREE TRIAL) ----------------
//   fetchMoreQuestions: async () => {
//     const state = get();
//     const { saved, activeId, units, freeTrialActive } = state;
    
//     console.log("\n🔍 FETCH MORE EXAM QUESTIONS");
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
//     }

//     // ✅ Check free trial first, only check payment if trial exhausted
//     if (freeTrialActive) {
//       const usedCount = parseInt(localStorage.getItem('freeExamQuestionsUsed') || '0', 10);
//       console.log(`\n🎁 FREE TRIAL MODE - ${usedCount}/${FREE_QUESTIONS_LIMIT} questions used`);
//       console.log("Skipping payment check - user still has free questions");
//     } else {
//       // ✅ Free trial exhausted - now check payment
//       console.log(`\n💳 Free trial exhausted - checking payment...`);
      
//       if (subjectInfo) {
//         const hasPaid = checkIfUserPaidForSubject(subjectInfo, category);
        
//         if (!hasPaid) {
//           console.log("\n🚫 PAYMENT LOCKED - ACCESS DENIED");
          
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
        
//         console.log("\n✅ ACCESS GRANTED - PAYMENT VERIFIED");
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

//     console.log(`📥 Fetching exam questions (skip: ${unit.skip})`);
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
//         const newCount = incrementFreeExamQuestionsCount(data.length);
        
//         if (newCount >= FREE_QUESTIONS_LIMIT) {
//           console.log(`\n🎁 FREE TRIAL EXHAUSTED!`);
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
//   next: () => {
//     const { currentIndex } = get();
//     const allQuestions = get().getAllQuestions();
    
//     if (currentIndex < allQuestions.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//     }
//   },

//   prev: () =>
//     set((s) => ({
//       currentIndex: Math.max(0, s.currentIndex - 1),
//     })),

//   goToQuestion: (index) => {
//     const allQuestions = get().getAllQuestions();
//     if (index >= 0 && index < allQuestions.length) {
//       set({ currentIndex: index });
//     }
//   },

//   // ---------------- FETCH NAMES ----------------
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
//         subject.modules?.forEach(module => {
//           module.topics?.forEach(topic => {
//             if (savedTopicIds.includes(topic.topicId)) {
//               topicNames[topic.topicId] = topic.topicName;
              
//               Object.keys(saved.topics).forEach(subjectId => {
//                 if (saved.topics[subjectId].includes(topic.topicId)) {
//                   subjectNames[subjectId] = subject.subjectName;
//                 }
//               });
//             }
//           });
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

//   // ---------------- EXAM SESSION ----------------
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

//       if (res?.data?.examId) {
//         const startTime = Date.now();
//         const duration = saved.duration || 60; // default 60 minutes
        
//         set({ 
//           examId: res.data.examId, 
//           examActive: true,
//           examStartTime: startTime,
//           examDuration: duration,
//           timeRemaining: duration * 60, // convert to seconds
//         });
        
//         console.log("✅ Exam started:", res.data.examId);
        
//         // Start timer
//         get().startTimer();
        
//         return res.data.examId;
//       }

//       return null;
//     } catch (err) {
//       console.error("❌ Failed to start exam:", err);
//       return null;
//     }
//   },

//   submitAnswer: async (questionId, userChoice) => {
//     const { examId, examActive } = get();
    
//     if (!examActive || !examId) {
//       console.warn("⚠️ No active exam");
//       return false;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       const payload = {
//         examId,
//         questionId,
//         userChoice,
//       };

//       console.log("📤 Submitting answer:", payload);

//       await fetchWithAuth(`${API_BASE}/exams/submit-answer`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       console.log("✅ Answer submitted");
//       return true;
//     } catch (err) {
//       console.error("❌ Failed to submit answer:", err);
//       return false;
//     }
//   },

//   endExam: async () => {
//     const { examId, examActive } = get();
    
//     if (!examActive || !examId) {
//       console.log("⏭️ No active exam");
//       return null;
//     }

//     try {
//       const { fetchWithAuth } = useAuthStore.getState();

//       console.log("🛑 Ending exam:", examId);

//       const res = await fetchWithAuth(`${API_BASE}/exams/end`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ examId }),
//       });

//       set({ 
//         examId: null, 
//         examActive: false,
//         examCompleted: true,
//         examResults: res?.data,
//         timeRemaining: null,
//       });

//       console.log("✅ Exam ended");
//       return res?.data;
//     } catch (err) {
//       console.error("❌ Failed to end exam:", err);
//       return null;
//     }
//   },

//   // ---------------- TIMER ----------------
//   startTimer: () => {
//     const interval = setInterval(() => {
//       const state = get();
      
//       if (!state.examActive || state.timeRemaining === null) {
//         clearInterval(interval);
//         return;
//       }

//       if (state.timeRemaining <= 0) {
//         clearInterval(interval);
//         console.log("⏰ Time's up! Auto-submitting exam...");
//         get().endExam();
//         return;
//       }

//       set({ timeRemaining: state.timeRemaining - 1 });
//     }, 1000);
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
// }));







import { create } from "zustand";
import useAuthStore from "./authStore";
import { usePaymentStore } from "./paymentStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
const REQUEST_LIMIT = 40;
const FREE_QUESTIONS_LIMIT = 5; // Free trial limit for exams

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
  console.log("\n🔍 GET SUBJECT INFO FOR TOPIC (EXAM)");
  console.log("Topic ID:", topicId);
  console.log("Category:", userSelectedCategory);
  
  const { accessToken } = useAuthStore.getState();
  
  if (!accessToken || !topicId) {
    console.error("❌ No access token or topic ID!");
    return null;
  }

  try {
    const response = await fetch(`${API_BASE}/users/my-subjects`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!response.ok) {
      console.error("❌ Failed to fetch subjects:", response.status);
      return null;
    }

    const data = await response.json();
    const subjectsByCategory = data.data?.subjectsByCategory || {};
    const examKey = userSelectedCategory?.toUpperCase();
    const subjects = subjectsByCategory[examKey] || [];
    
    console.log(`📚 Found ${subjects.length} subjects for ${examKey}`);

    if (subjects.length === 0) {
      console.warn(`⚠️ No subjects found for category: ${examKey}`);
      return null;
    }

    for (let i = 0; i < subjects.length; i++) {
      const subject = subjects[i];
      
      try {
        const topicsRes = await fetch(
          `${API_BASE}/users/my-topics?subjectId=${subject.id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        
        if (!topicsRes.ok) continue;
        
        const topicsData = await topicsRes.json();
        const subjectData = topicsData.data?.[0];
        
        if (!subjectData || !subjectData.modules) continue;
        
        for (const module of subjectData.modules) {
          if (!module.topics || module.topics.length === 0) continue;
          
          for (const topic of module.topics) {
            const topicIdMatch = topic.topicId === topicId || 
                                topic.id === topicId || 
                                topic._id === topicId;
            
            if (topicIdMatch) {
              console.log("\n🎉 TOPIC FOUND!");
              console.log("Topic Name:", topic.topicName);
              console.log("Subject Name:", subject.subjectName);
              console.log("Subject ID:", subject.id);
              
              return {
                id: subject.id,
                subjectName: subject.subjectName,
                category: userSelectedCategory
              };
            }
          }
        }
      } catch (err) {
        console.error(`❌ Error fetching topics for subject ${subject.id}:`, err);
        continue;
      }
    }

    console.log("\n❌ TOPIC NOT FOUND IN ANY SUBJECT");
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

      const firstId =
        saved.mode === "subject"
          ? saved.subjects?.[0]
          : Object.values(saved.topics || {})[0]?.[0];

      console.log("🎯 First ID to load:", firstId);

      if (firstId) {
        console.log("🔄 Changing to first active ID and fetching questions...");
        await get().changeActive(firstId);
        
        setTimeout(() => {
          const currentState = get();
          if (currentState.loading) {
            console.log("✅ Loading complete");
            set({ loading: false });
          }
        }, 100);
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

  // ---------------- ANSWER SELECTION ----------------
  setSelectedAnswer: (questionId, optionId) =>
    set((s) => ({
      selectedAnswers: {
        ...s.selectedAnswers,
        [questionId]: optionId,
      },
    })),

  // Get all questions across all units
  getAllQuestions: () => {
    const { units } = get();
    return Object.values(units).flatMap(unit => unit.items);
  },

  // Get answered count
  getAnsweredCount: () => {
    const { selectedAnswers } = get();
    return Object.keys(selectedAnswers).length;
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

  // ---------------- NAVIGATION ----------------
  next: () => {
    const { currentIndex } = get();
    const allQuestions = get().getAllQuestions();
    
    if (currentIndex < allQuestions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prev: () =>
    set((s) => ({
      currentIndex: Math.max(0, s.currentIndex - 1),
    })),

  goToQuestion: (index) => {
    const allQuestions = get().getAllQuestions();
    if (index >= 0 && index < allQuestions.length) {
      set({ currentIndex: index });
    }
  },

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
        
        // ✅ Use durationSeconds from API response (PRIMARY)
        // Fallback to durationMinutes * 60, then saved duration, then default
        let timeInSeconds;
        
        if (res.data.durationSeconds) {
          // API provided duration in seconds - use directly
          timeInSeconds = res.data.durationSeconds;
          console.log("⏰ Using durationSeconds from API:", timeInSeconds, "seconds");
        } else if (res.data.durationMinutes) {
          // API provided duration in minutes - convert to seconds
          timeInSeconds = res.data.durationMinutes * 60;
          console.log("⏰ Using durationMinutes from API:", res.data.durationMinutes, "minutes →", timeInSeconds, "seconds");
        } else if (saved.duration) {
          // Fallback to saved duration
          timeInSeconds = saved.duration * 60;
          console.log("⏰ Using saved duration:", saved.duration, "minutes →", timeInSeconds, "seconds");
        } else {
          // Default 60 minutes
          timeInSeconds = 60 * 60;
          console.log("⏰ Using default duration: 60 minutes →", timeInSeconds, "seconds");
        }
        
        const durationInMinutes = Math.ceil(timeInSeconds / 60);
        
        console.log("⏰ ========================================");
        console.log("⏰ TIMER SETUP COMPLETE");
        console.log("⏰ ========================================");
        console.log("⏰ Final duration:", timeInSeconds, "seconds (", durationInMinutes, "minutes )");
        console.log("⏰ Start time:", new Date(startTime).toISOString());
        console.log("⏰ Expected end:", new Date(startTime + timeInSeconds * 1000).toISOString());
        console.log("⏰ ========================================");
        
        set({ 
          examId: res.data.examId, 
          examActive: true,
          examStartTime: startTime,
          examDuration: durationInMinutes,
          timeRemaining: timeInSeconds,
        });
        
        console.log("✅ Exam started:", res.data.examId);
        console.log("✅ Timer initialized with:", timeInSeconds, "seconds");
        
        // Start timer immediately
        const startTimerResult = get().startTimer();
        console.log("✅ Timer started:", startTimerResult);
        
        return res.data.examId;
      }

      console.warn("⚠️ No examId in response");
      return null;
    } catch (err) {
      console.error("❌ Failed to start exam:", err);
      return null;
    }
  },

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

  endExam: async () => {
    const { examId, examActive } = get();
    
    if (!examActive || !examId) {
      console.log("⏭️ No active exam to end");
      return null;
    }

    try {
      const { fetchWithAuth } = useAuthStore.getState();

      console.log("🛑 Ending exam session:", examId);
      console.log("📤 Calling /exams/end endpoint...");

      const res = await fetchWithAuth(`${API_BASE}/exams/end`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ examId }),
      });

      console.log("✅ End exam response received");
      console.log("📦 FULL END EXAM RESPONSE:", JSON.stringify(res, null, 2));
      console.log("📊 Results data:", res?.data);

      // Clear timer
      const { timerId } = get();
      if (timerId) {
        console.log("⏰ Clearing timer:", timerId);
        clearInterval(timerId);
      }

      set({ 
        examId: null, 
        examActive: false,
        examCompleted: true,
        examResults: res?.data,
        timeRemaining: null,
        timerId: null,
      });

      console.log("✅ Exam session ended successfully");
      console.log("📊 Final results stored:", res?.data);
      
      return res?.data;
    } catch (err) {
      console.error("❌ Failed to end exam:", err);
      console.error("❌ Error details:", err.message);
      return null;
    }
  },

  // ---------------- TIMER ----------------
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
        console.log("⏰ Time's up! Auto-submitting exam...");
        clearInterval(interval);
        set({ timerId: null });
        get().endExam();
        return;
      }

      set({ timeRemaining: state.timeRemaining - 1 });
    }, 1000);
    
    // Store interval ID so we can clear it later
    set({ timerId: interval });
    
    console.log("⏰ Timer started with interval ID:", interval);
    return interval;
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
}));