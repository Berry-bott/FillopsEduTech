
// // ------------------------------
// // store/studyStore.js
// // ------------------------------
// import { create } from 'zustand';
// import useAuthStore from './authStore';


// const saved = JSON.parse(localStorage.getItem("studySelections"));
// //       console.log("📦 Local Storage Data:", saved);

// export const useStudyStore = create((set, get) => ({
//   // ------------------------------
//   // STATE
//   // ------------------------------
//   saved : JSON.parse(localStorage.getItem('studySelections')),
//   questions: [],
//   loading: true,
//   selectedOptions: {},
//   activeId: null,
//   currentIndex: 0,
//   subjectNames: {},
//   topicNames: {},

//   // ------------------------------
//   // MUTATORS / SETTERS
//   // ------------------------------
//   setLoading: (v) => set({ loading: v }),
//   setQuestions: (qs) => set({ questions: qs }),
//   setCurrentIndex: (i) => set({ currentIndex: i }),
//   setActiveId: (id) => set({ activeId: id }),
//   setSelectedOption: (qId, opt) =>
//     set((state) => ({ selectedOptions: { ...state.selectedOptions, [qId]: opt } })),
//   setSubjectNames: (objOrFn) =>
//     set((state) => ({
//       subjectNames:
//         typeof objOrFn === 'function' ? objOrFn(state.subjectNames) : { ...state.subjectNames, ...objOrFn },
//     })),
//   setTopicNames: (obj) =>
//     set((state) => ({ topicNames: { ...state.topicNames, ...obj } })),

//   // ------------------------------
//   // FETCH HELPERS
//   // ------------------------------
//   fetchQuestions: async (type, id, year) => {
//     const saved = get().saved;
//     if (!saved) return;

//     try {
//       get().setLoading(true);
//       const category = saved.exam;
//       const base = 'https://fillops-server-5fuf.onrender.com/api';
//       const url = year && year !== 'random'
//         ? `${base}/${type}/${id}/questions?category=${category}&year=${year}`
//         : `${base}/${type}/${id}/questions?random=true&category=${category}`;

//       const accessToken = useAuthStore.getState().accessToken;
//       const res = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
//       const data = await res.json();

//       const formatted = (data.data || []).map((q) => ({
//         id: q.id,
//         text: q.text,
//         options: q.options || [],
//         correctAnswer: q.correctAnswer,
//         explanation: q.explanation,
//         difficulty: q.difficulty,
//         year: q.year,
//         examType: q.category,
//       }));

//       set({ questions: formatted, currentIndex: 0, loading: false, selectedOptions: {} });
//     } catch (err) {
//       console.error('❌ Fetch question error:', err);
//       set({ questions: [], loading: false });
//     }
//   },

//   fetchSubjectNames: async () => {
//     const saved = get().saved;
//     if (!saved?.subjects) return;

//     const names = {};
//     await Promise.all(
//       saved.subjects.map(async (id) => {
//         try {
//           const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/subjects/${id}`, {
//             headers: { Authorization: `Bearer ${useAuthStore.getState().accessToken}` },
//           });
//           const data = await res.json();
//           names[id] = data.subjectName || data.data?.subjectName || id;
//         } catch {
//           names[id] = id;
//         }
//       })
//     );

//     get().setSubjectNames(names);
//   },

//   fetchTopicNames: async () => {
//     const saved = get().saved;
//     if (!saved?.topics) return;

//     const topicMap = {};
//     const subjectMap = {};

//     const topicEntries = Object.entries(saved.topics);

//     await Promise.all(
//       topicEntries.flatMap(([subjectId, topicIds]) =>
//         topicIds.map(async (topicId) => {
//           try {
//             const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/topics/${topicId}`, {
//               headers: { Authorization: `Bearer ${useAuthStore.getState().accessToken}` },
//             });
//             const raw = await res.json();
//             const topic = raw.data || raw;

//             topicMap[topicId] = topic.topicName || topicId;

//             if (topic.module?.subject?.subjectName) {
//               subjectMap[topicId] = topic.module.subject.subjectName;
//             }
//           } catch {
//             topicMap[topicId] = topicId;
//           }
//         })
//       )
//     );

//     get().setTopicNames(topicMap);
//     get().setSubjectNames((prev) => ({ ...prev, ...subjectMap }));
//   },

//   // ------------------------------
//   // ACTIVE SELECTION
//   // ------------------------------
//   changeActive: (id) => {
//     const saved = get().saved;
//     if (!saved) return;

//     set({ activeId: id, currentIndex: 0 });

//     if (saved.mode === 'subject') {
//       get().fetchQuestions('subjects', id, saved.subjectYears?.[id]);
//     } else {
//       get().fetchQuestions('topics', id, saved.topicYears?.[id]);
//     }
//   },

//   // ------------------------------
//   // NEXT QUESTION / SUBJECT
//   // ------------------------------
//   next: () => {
//     const { currentIndex, questions, activeId, saved } = get();

//     if (currentIndex < questions.length - 1) {
//       return set({ currentIndex: currentIndex + 1 });
//     }

//     const list = saved.mode === 'subject' ? saved.subjects : Object.values(saved.topics).flat();
//     const idx = list.indexOf(activeId);

//     if (idx < list.length - 1) {
//       const nextId = list[idx + 1];
//       get().changeActive(nextId);
//     } else {
//       alert('🎉 You have finished all!');
//     }
//   },

//   // ------------------------------
//   // INITIALIZATION
//   // ------------------------------
//   init: async () => {
//     const saved = get().saved;
//     if (!saved) return;

//     await Promise.all([get().fetchSubjectNames(), get().fetchTopicNames()]);

//     if (saved.mode === 'subject') {
//       const first = saved.subjects[0];
//       set({ activeId: first });
//       get().fetchQuestions('subjects', first, saved.subjectYears?.[first]);
//     }

//     if (saved.mode === 'topic') {
//       const firstTopicId = Object.entries(saved.topics)[0][1][0];
//       set({ activeId: firstTopicId });
//       get().fetchQuestions('topics', firstTopicId, saved.topicYears?.[firstTopicId]);
//     }
//   },
// }));














// import { create } from "zustand";
// import useAuthStore from "./authStore";

// export const useStudyStore = create((set, get) => ({
//   // ------------------------------
//   // STATE
//   // ------------------------------
//   saved: null,
//   questions: [],
//   loading: false,
//   selectedOptions: {},
//   activeId: null,
//   currentIndex: 0,
//   subjectNames: {},
//   topicNames: {},

//   // ------------------------------
//   // SYNC LOCAL STORAGE
//   // ------------------------------
//   syncSaved: async () => {
//     try {
//       const saved = JSON.parse(localStorage.getItem("studySelections"));
//       console.log("🔄 syncSaved()", saved);
//       if (!saved) return null;

//       set({ saved });
//       // fetch names after saved is ready
//       await Promise.all([
//         get().fetchSubjectNames(),
//         get().fetchTopicNames(),
//       ]);

//       // set first active item
//       const firstId =
//         saved.mode === "subject"
//           ? saved.subjects?.[0]
//           : Object.values(saved.topics || {})[0]?.[0];

//       if (firstId) get().changeActive(firstId);

//       return saved;
//     } catch (e) {
//       console.error("❌ syncSaved failed", e);
//       return null;
//     }
//   },

//   // ------------------------------
//   // RESET STORE
//   // ------------------------------
//   reset: () =>
//     set({
//       saved: null,
//       questions: [],
//       loading: false,
//       selectedOptions: {},
//       activeId: null,
//       currentIndex: 0,
//       subjectNames: {},
//       topicNames: {},
//     }),

//   // ------------------------------
//   // SETTERS
//   // ------------------------------
//   setActiveId: (id) => {
//     console.log("🎯 setActiveId:", id);
//     set({ activeId: id, currentIndex: 0 });
//   },

//   setSelectedOption: (qId, opt) =>
//     set((state) => ({
//       selectedOptions: { ...state.selectedOptions, [qId]: opt },
//     })),

//   setCurrentIndex: (index) =>
//     set((state) => ({ currentIndex: Math.max(0, Math.min(index, state.questions.length - 1)) })),

//   // ------------------------------
//   // NAVIGATION
//   // ------------------------------
//   next: () => {
//     const { currentIndex, questions, saved, activeId } = get();
//     if (currentIndex < questions.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//     } else {
//       // move to next subject/topic
//       if (!saved) return;
//       const ids =
//         saved.mode === "subject"
//           ? saved.subjects
//           : Object.values(saved.topics || {})[0];
//       const currentPos = ids.indexOf(activeId);
//       const nextId = ids[currentPos + 1];
//       if (nextId) get().changeActive(nextId);
//     }
//   },

//   // ------------------------------
//   // FETCH QUESTIONS
//   // ------------------------------
//   fetchQuestions: async (type, id, year) => {
//     const { saved } = get();
//     if (!saved) return;

//     console.log("📥 fetchQuestions", { type, id, year });

//     set({ loading: true });

//     try {
//       const base = "https://fillops-server-5fuf.onrender.com/api";
//       const url =
//         year && year !== "random"
//           ? `${base}/${type}/${id}/questions?category=${saved.exam}&year=${year}`
//           : `${base}/${type}/${id}/questions?random=true&category=${saved.exam}`;

//       const token = useAuthStore.getState().accessToken;
//       console.log("🔗 Fetching from URL:", token);
//       const res = await fetch(url, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       const data = await res.json();

//       set({
//         questions: data.data || [],
//         currentIndex: 0,
//         selectedOptions: {},
//         loading: false,
//       });
//     } catch (e) {
//       console.error("❌ fetchQuestions error", e);
//       set({ questions: [], loading: false });
//     }
//   },

//   // ------------------------------
//   // FETCH SUBJECT NAMES
//   // ------------------------------
//   fetchSubjectNames: async () => {
//     const { saved } = get();
//     if (!saved?.subjects) return;

//     console.log("📘 fetchSubjectNames");

//     const names = {};
//     await Promise.all(
//       saved.subjects.map(async (id) => {
//         try {
//           const res = await fetch(
//             `https://fillops-server-5fuf.onrender.com/api/subjects/${id}`,
//             {
//               headers: {
//                 Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
//               },
//             }
//           );
//           const data = await res.json();
//           names[id] = data.subjectName || id;
//         } catch {
//           names[id] = id;
//         }
//       })
//     );

//     set({ subjectNames: names });
//   },

//   // ------------------------------
//   // FETCH TOPIC NAMES
//   // ------------------------------
  // fetchTopicNames: async () => {
  //   const { saved } = get();
  //   if (!saved?.topics) return;

  //   console.log("📙 fetchTopicNames");

  //   const topicNames = {};
  //   const subjectNames = {};

  //   await Promise.all(
  //     Object.entries(saved.topics).flatMap(([_, topicIds]) =>
  //       topicIds.map(async (topicId) => {
  //         try {
  //           const res = await fetch(
  //             `https://fillops-server-5fuf.onrender.com/api/topics/${topicId}`,
  //             {
  //               headers: {
  //                 Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
  //               },
  //             }
  //           );
  //           const raw = await res.json();
  //           const topic = raw.data || raw;

  //           topicNames[topicId] = topic.topicName || topicId;

  //           if (topic.module?.subject?.subjectName) {
  //             subjectNames[topicId] = topic.module.subject.subjectName;
  //           }
  //         } catch {
  //           topicNames[topicId] = topicId;
  //         }
  //       })
  //     )
  //   );

  //   set((state) => ({
  //     topicNames,
  //     subjectNames: { ...state.subjectNames, ...subjectNames },
  //   }));
  // },

//   // ------------------------------
//   // CHANGE ACTIVE SUBJECT/TOPIC
//   // ------------------------------
//   changeActive: (id) => {
//     const { saved } = get();
//     if (!saved) return;

//     console.log("🔁 changeActive:", id);
//     set({ activeId: id, currentIndex: 0 });

//     if (saved.mode === "subject") {
//       get().fetchQuestions("subjects", id, saved.subjectYears?.[id]);
//     } else {
//       get().fetchQuestions("topics", id, saved.topicYears?.[id]);
//     }
//   },
// }));


// import { create } from "zustand";
// import useAuthStore from "./authStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// export const useStudyStore = create((set, get) => ({
//   // =============================
//   // STATE
//   // =============================
//   saved: null,
//   questions: [],
//   loading: false,
//   selectedOptions: {},
//   activeId: null,
//   currentIndex: 0,
//   subjectNames: {},
//   topicNames: {},

//   // =============================
//   // SYNC LOCAL STORAGE
//   // =============================
//   syncSaved: async () => {
//     try {
//       const saved = JSON.parse(localStorage.getItem("studySelections"));
//       if (!saved) return null;

//       set({ saved });

//       // fetch names
//       await Promise.all([get().fetchSubjectNames(), get().fetchTopicNames()]);

//       // set first active
//       const firstId =
//         saved.mode === "subject"
//           ? saved.subjects?.[0]
//           : Object.values(saved.topics || {})[0]?.[0];

//       if (firstId) get().changeActive(firstId);

//       return saved;
//     } catch (err) {
//       console.error("❌ syncSaved failed", err);
//       return null;
//     }
//   },

//   // =============================
//   // RESET
//   // =============================
//   reset: () =>
//     set({
//       saved: null,
//       questions: [],
//       loading: false,
//       selectedOptions: {},
//       activeId: null,
//       currentIndex: 0,
//       subjectNames: {},
//       topicNames: {},
//     }),

//   // =============================
//   // SETTERS
//   // =============================
//   setActiveId: (id) => set({ activeId: id, currentIndex: 0 }),

//   setSelectedOption: (qId, opt) =>
//     set((s) => ({ selectedOptions: { ...s.selectedOptions, [qId]: opt } })),

//   setCurrentIndex: (index) =>
//     set((s) => ({
//       currentIndex: Math.max(0, Math.min(index, s.questions.length - 1)),
//     })),

//   // =============================
//   // NAVIGATION
//   // =============================
//   next: () => {
//     const { currentIndex, questions, saved, activeId } = get();
//     if (currentIndex < questions.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//       return;
//     }

//     if (!saved) return;

//     const ids =
//       saved.mode === "subject"
//         ? saved.subjects
//         : Object.values(saved.topics || {})[0];

//     const nextId = ids[ids.indexOf(activeId) + 1];
//     if (nextId) get().changeActive(nextId);
//   },

//   // =============================
//   // FETCH QUESTIONS (AUTO REFRESH)
//   // =============================
//   fetchQuestions: async (type, id, year) => {
//     const { saved } = get();
//     if (!saved) return;

//     set({ loading: true });

//     try {
//       const url =
//         year && year !== "random"
//           ? `${API_BASE}/${type}/${id}/questions?category=${saved.exam}&year=${year}`
//           : `${API_BASE}/${type}/${id}/questions?random=true&category=${saved.exam}`;

//       const { fetchWithAuth } = useAuthStore.getState();
//       const data = await fetchWithAuth(url);

//       set({
//         questions: data.data || [],
//         currentIndex: 0,
//         selectedOptions: {},
//         loading: false,
//       });
//     } catch (err) {
//       console.error("❌ fetchQuestions failed", err);
//       set({ questions: [], loading: false });
//     }
//   },

//   // =============================
//   // FETCH SUBJECT NAMES
//   // =============================
//   fetchSubjectNames: async () => {
//     const { saved } = get();
//     if (!saved?.subjects?.length) return;

//     const names = {};
//     const { fetchWithAuth } = useAuthStore.getState();

//     await Promise.all(
//       saved.subjects.map(async (subjectId) => {
//         try {
//           const res = await fetchWithAuth(`${API_BASE}/subjects/${subjectId}`);
//           names[subjectId] = res?.data?.subjectName || subjectId;
//         } catch {
//           names[subjectId] = subjectId;
//         }
//       })
//     );

//     set({ subjectNames: names });
//   },

//   // =============================
//   // FETCH TOPIC NAMES (WITH SUBJECT LINK)
//   // =============================
//   fetchTopicNames: async () => {
//     const { saved } = get();
//     if (!saved?.topics) return;

//     const topicNames = {};
//     const subjectNames = {};
//     const { fetchWithAuth } = useAuthStore.getState();

//     await Promise.all(
//       Object.entries(saved.topics).flatMap(([subjectId, topicIds]) =>
//         topicIds.map(async (topicId) => {
//           try {
//             const res = await fetchWithAuth(`${API_BASE}/topics/${topicId}`);
//             const data = res?.data || {};

//             topicNames[topicId] = data.topicName || topicId;

//             // Make sure subjectName for this topic is correctly set
//             if (data.module?.subject?.subjectName) {
//               subjectNames[subjectId] = data.module.subject.subjectName;
//             }
//           } catch {
//             topicNames[topicId] = topicId;
//           }
//         })
//       )
//     );

//     set((s) => ({
//       topicNames,
//       subjectNames: { ...s.subjectNames, ...subjectNames },
//     }));
//   },

//   // =============================
//   // CHANGE ACTIVE
//   // =============================
//   changeActive: (id) => {
//     const { saved } = get();
//     if (!saved) return;

//     set({ activeId: id, currentIndex: 0 });

//     if (saved.mode === "subject") {
//       get().fetchQuestions("subjects", id, saved.subjectYears?.[id]);
//     } else {
//       get().fetchQuestions("topics", id, saved.topicYears?.[id]);
//     }
//   },
// }));








// import { create } from "zustand";
// import useAuthStore from "./authStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
// const BUFFER_SIZE = 100; // how many questions ahead

// export const useStudyStore = create((set, get) => ({
//   // =============================
//   // STATE
//   // =============================
//   saved: null,
//   questions: [],
//   loading: false,
//   selectedOptions: {},
//   activeId: null,
//   currentIndex: 0,
//   subjectNames: {},
//   topicNames: {},

//   // 🔐 payment
//   paymentLocked: false,
//   paymentLoading: false,

//   // =============================
//   // SYNC LOCAL STORAGE
//   // =============================
//   syncSaved: async () => {
//     try {
//       const saved = JSON.parse(localStorage.getItem("studySelections"));
//       if (!saved) return null;

//       set({ saved });

//       await Promise.all([
//         get().fetchSubjectNames(),
//         get().fetchTopicNames(),
//       ]);

//       const firstId =
//         saved.mode === "subject"
//           ? saved.subjects?.[0]
//           : Object.values(saved.topics || {})[0]?.[0];

//       if (firstId) get().changeActive(firstId);

//       return saved;
//     } catch (err) {
//       console.error("❌ syncSaved failed", err);
//       return null;
//     }
//   },

//   // =============================
//   // RESET
//   // =============================
//   reset: () =>
//     set({
//       saved: null,
//       questions: [],
//       loading: false,
//       selectedOptions: {},
//       activeId: null,
//       currentIndex: 0,
//       subjectNames: {},
//       topicNames: {},
//       paymentLocked: false,
//     }),

//   // =============================
//   // SETTERS
//   // =============================
//   setSelectedOption: (qId, opt) =>
//     set((s) => ({
//       selectedOptions: { ...s.selectedOptions, [qId]: opt },
//     })),

//   // =============================
//   // NAVIGATION (SAFE)
//   // =============================
//   next: async () => {
//     const {
//       currentIndex,
//       questions,
//       saved,
//       activeId,
//       paymentLocked,
//     } = get();
  
//     if (paymentLocked) return;
  
//     // 1️⃣ Still have questions locally → move instantly
//     if (currentIndex < questions.length - 1) {
//       set({ currentIndex: currentIndex + 1 });
//       get().prefetchQuestions(); // background
//       return;
//     }
  
//     // 2️⃣ We are at the end → try prefetch
//     await get().prefetchQuestions();
  
//     const updated = get();
  
//     // 3️⃣ If new questions arrived → move
//     if (updated.currentIndex < updated.questions.length - 1) {
//       set({ currentIndex: updated.currentIndex + 1 });
//       return;
//     }
  
//     // 4️⃣ Still no questions → subject/topic exhausted
//     if (!saved) return;
  
//     const ids =
//       saved.mode === "subject"
//         ? saved.subjects
//         : Object.values(saved.topics || {})[0];
  
//     const currentPos = ids.indexOf(activeId);
//     const nextId = ids[currentPos + 1];
  
//     if (nextId) {
//       get().changeActive(nextId);
//       return;
//     }
  
//     // 5️⃣ No next subject/topic → end of study
//     console.log("✅ Study completed");
//   },


//   // =============================
//   // FETCH ONE QUESTION (LIMITED)
//   // ============================
//   prefetchQuestions: async () => {
//     const { saved, activeId, questions, paymentLocked, currentIndex } = get();
//     if (!saved || !activeId || paymentLocked) return;
  
//     const remaining = questions.length - currentIndex - 1;
//     if (remaining >= BUFFER_SIZE) return;
  
//     const { fetchWithAuth } = useAuthStore.getState();
  
//     try {
//       const skip = questions.length;
//       const limit = BUFFER_SIZE;
  
//       const base =
//         saved.mode === "subject"
//           ? `subjects/${activeId}`
//           : `topics/${activeId}`;
  
//       const year =
//         saved.mode === "subject"
//           ? saved.subjectYears?.[activeId]
//           : saved.topicYears?.[activeId];
  
//       const url =
//         year && year !== "random"
//           ? `${API_BASE}/${base}/questions?category=${saved.exam}&year=${year}&limit=${limit}&skip=${skip}`
//           : `${API_BASE}/${base}/questions?category=${saved.exam}&random=true&limit=${limit}&skip=${skip}`;
  
//       const data = await fetchWithAuth(url);
  
//       // ✅ CHECK BACKEND RESPONSE
//       if (
//         data?.code === "PAYMENT_REQUIRED" || 
//         data?.status === 403 || 
//         (data?.data && data.data.code === "PAYMENT_REQUIRED")
//       ) {
//         set({ paymentLocked: true });
//         console.log("🔥 Payment required detected:", data);
//         return;
//       }
  
//       // ✅ SAFE ARRAY CHECK
//       if (Array.isArray(data?.data)) {
//         set((s) => ({
//           questions: [...s.questions, ...data.data],
//         }));
//       }
//     } catch (err) {
//       console.log("PAYMENT ERROR:", err);
  
//       if (
//         err?.status === 403 ||
//         err?.response?.status === 403 ||
//         err?.message?.includes("403")
//       ) {
//         set({ paymentLocked: true });
//         return;
//       }
//     }
//   }, 

//   // fetchNextQuestion: async () => {
//   //   const { saved, activeId, questions, paymentLocked } = get();
//   //   if (!saved || !activeId || paymentLocked) return;

//   //   set({ loading: true });

//   //   try {
//   //     const skip = questions.length;
//   //     const limit = 1;

//   //     const base =
//   //       saved.mode === "subject"
//   //         ? `subjects/${activeId}`
//   //         : `topics/${activeId}`;

//   //     const year =
//   //       saved.mode === "subject"
//   //         ? saved.subjectYears?.[activeId]
//   //         : saved.topicYears?.[activeId];

//   //     const url =
//   //       year && year !== "random"
//   //         ? `${API_BASE}/${base}/questions?category=${saved.exam}&year=${year}&limit=${limit}&skip=${skip}`
//   //         : `${API_BASE}/${base}/questions?category=${saved.exam}&random=true&limit=${limit}&skip=${skip}`;

//   //     const { fetchWithAuth } = useAuthStore.getState();
//   //     const data = await fetchWithAuth(url);

//   //     set((s) => ({
//   //       questions: [...s.questions, ...(data.data || [])],
//   //       loading: false,
//   //     }));
//   //   } catch (err) {
//   //     if (err?.status === 403) {
//   //       // 🚫 free limit reached
//   //       set({ paymentLocked: true, loading: false });
//   //       return;
//   //     }

//   //     console.error("❌ fetchNextQuestion failed", err);
//   //     set({ loading: false });
//   //   }
//   // },

//   // =============================
//   // CHANGE ACTIVE (RESET QUESTIONS)
//   // =============================
//   // changeActive: (id) => {
//   //   const { saved } = get();
//   //   if (!saved) return;

//   //   set({
//   //     activeId: id,
//   //     questions: [],
//   //     currentIndex: 0,
//   //     selectedOptions: {},
//   //     paymentLocked: false,
//   //   });

//   //   get().fetchNextQuestion();
//   // },

//   changeActive: (id) => {
//     const { saved } = get();
//     if (!saved) return;
  
//     set({
//       activeId: id,
//       questions: [],
//       currentIndex: 0,
//       selectedOptions: {},
//       paymentLocked: false,
//     });
  
//     // fetch initial buffer
//     get().prefetchQuestions();
//   },
  

//   // =============================
//   // SUBJECT NAMES
//   // =============================
//   fetchSubjectNames: async () => {
//     const { saved } = get();
//     if (!saved?.subjects?.length) return;

//     const names = {};
//     const { fetchWithAuth } = useAuthStore.getState();

//     await Promise.all(
//       saved.subjects.map(async (id) => {
//         try {
//           const res = await fetchWithAuth(`${API_BASE}/subjects/${id}`);
//           names[id] = res?.data?.subjectName || id;
//         } catch {
//           names[id] = id;
//         }
//       })
//     );

//     set({ subjectNames: names });
//   },

  // // =============================
  // // TOPIC NAMES
  // // =============================
  // fetchTopicNames: async () => {
  //   const { saved } = get();
  //   if (!saved?.topics) return;

  //   const topicNames = {};
  //   const subjectNames = {};
  //   const { fetchWithAuth } = useAuthStore.getState();

  //   await Promise.all(
  //     Object.entries(saved.topics).flatMap(([subjectId, topicIds]) =>
  //       topicIds.map(async (topicId) => {
  //         try {
  //           const res = await fetchWithAuth(`${API_BASE}/topics/${topicId}`);
  //           const data = res?.data || {};

  //           topicNames[topicId] = data.topicName || topicId;

  //           if (data.module?.subject?.subjectName) {
  //             subjectNames[subjectId] =
  //               data.module.subject.subjectName;
  //           }
  //         } catch {
  //           topicNames[topicId] = topicId;
  //         }
  //       })
  //     )
  //   );

  //   set((s) => ({
  //     topicNames,
  //     subjectNames: { ...s.subjectNames, ...subjectNames },
  //   }));
  // },

  // // =============================
  // // PAYMENTS
  // // =============================
  // initializePayment: async () => {
  //   set({ paymentLoading: true });

  //   try {
  //     const { fetchWithAuth } = useAuthStore.getState();
  //     const data = await fetchWithAuth(
  //       `${API_BASE}/payments/initialize`,
  //       { method: "POST" }
  //     );
  //     set({ paymentLoading: false });
  //     console.log( data.data.authorization_url)
  //     window.location.href = data.data.authorizationUrl;
  //   } catch (err) {
  //     console.error("❌ payment init failed", err);
  //     set({ paymentLoading: false });
  //   }
  // },
// }));







import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

export const useStudyStore = create((set, get) => ({
  // =============================
  // STATE
  // =============================
  saved: null,
  questionsByUnit: {},
  activeId: null,
  currentIndex: 0,
  selectedOptions: {},
  subjectNames: {},
  topicNames: {},
  loading: false,
  paymentLocked: false,
  paymentLoading: false,

  // =============================
  // SYNC SAVED SELECTION
  // =============================
  syncSaved: async () => {
    const saved = JSON.parse(localStorage.getItem("studySelections"));
    if (!saved) return;

    set({ saved });

    await Promise.all([
      get().fetchSubjectNames(),
      get().fetchTopicNames(),
    ]);

    const firstId =
      saved.mode === "subject"
        ? saved.subjects?.[0]
        : Object.values(saved.topics || {})[0]?.[0];

    if (firstId) get().changeActive(firstId);
  },

  setCurrentIndex: (index) =>
    set({
      currentIndex: Math.max(0, index),
    }),
  

  // =============================
  // RESET
  // =============================
  reset: () =>
    set({
      saved: null,
      questionsByUnit: {},
      activeId: null,
      currentIndex: 0,
      selectedOptions: {},
      paymentLocked: false,
    }),

  // =============================
  // DERIVED QUESTIONS
  // =============================
  getQuestions: () => {
    const { activeId, questionsByUnit } = get();
    return questionsByUnit[activeId] || [];
  },

  // =============================
  // SETTERS
  // =============================
  setSelectedOption: (qId, opt) =>
    set((s) => ({
      selectedOptions: { ...s.selectedOptions, [qId]: opt },
    })),

  // =============================
  // CHANGE ACTIVE (FETCH ALL ONCE)
  // =============================
  changeActive: async (id) => {
    const { saved, questionsByUnit } = get();
    if (!saved) return;
  
    set({
      activeId: id,
      currentIndex: 0,
      selectedOptions: {},
      paymentLocked: false,
      loading: true,
    });
  
    // Already fetched → do nothing
    if (questionsByUnit[id]) {
      set({ loading: false });
      return;
    }
  
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const base = saved.mode === "subject" ? `subjects/${id}` : `topics/${id}`;
      const year = saved.mode === "subject" ? saved.subjectYears?.[id] : saved.topicYears?.[id];
      const url = year && year !== "random"
        ? `${API_BASE}/${base}/questions?category=${saved.exam}&year=${year}`
        : `${API_BASE}/${base}/questions?category=${saved.exam}&random=true`;
  
      const res = await fetchWithAuth(url);
  
      // Payment required
      if (res?.code === "PAYMENT_REQUIRED" || res?.status === 403) {
        set({ paymentLocked: true, loading: false });
        // Always set empty questions so UI renders payment
        set((s) => ({
          questionsByUnit: { ...s.questionsByUnit, [id]: [] }
        }));
        return;
      }
  
      // Set fetched questions
      set((s) => ({
        questionsByUnit: { ...s.questionsByUnit, [id]: Array.isArray(res?.data) ? res.data : [] },
        loading: false,
      }));
    } catch (err) {
      console.error("❌ fetch questions failed", err);
      set((s) => ({
        questionsByUnit: { ...s.questionsByUnit, [id]: [] },
        paymentLocked: err?.status === 403 || err?.response?.status === 403 ? true : false,
        loading: false,
      }));
    }
  },
  

  // =============================
  // NAVIGATION (NO BLINKING)
  // =============================
  next: () => {
    const { saved, activeId, currentIndex, paymentLocked } = get();
    if (paymentLocked) return;

    const questions = get().getQuestions();

    // move locally
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
      return;
    }

    // move to next subject/topic
    const ids =
      saved.mode === "subject"
        ? saved.subjects
        : Object.values(saved.topics || {})[0];

    const pos = ids.indexOf(activeId);
    const nextId = ids[pos + 1];

    if (nextId) {
      get().changeActive(nextId);
    } else {
      console.log("✅ Study completed");
    }
  },

  prev: () =>
    set((s) => ({
      currentIndex: Math.max(0, s.currentIndex - 1),
    })),

  // =============================
  // SUBJECT NAMES
  // =============================
  fetchSubjectNames: async () => {
    const { saved } = get();
    if (!saved?.subjects) return;

    const { fetchWithAuth } = useAuthStore.getState();
    const names = {};

    await Promise.all(
      saved.subjects.map(async (id) => {
        const res = await fetchWithAuth(`${API_BASE}/subjects/${id}`);
        names[id] = res?.data?.subjectName || id;
      })
    );

    set({ subjectNames: names });
  },

  // =============================
  // TOPIC NAMES
  // =============================
  fetchTopicNames: async () => {
    const { saved } = get();
    if (!saved?.topics) return;

    const topicNames = {};
    const subjectNames = {};
    const { fetchWithAuth } = useAuthStore.getState();

    await Promise.all(
      Object.entries(saved.topics).flatMap(([subjectId, topicIds]) =>
        topicIds.map(async (topicId) => {
          try {
            const res = await fetchWithAuth(`${API_BASE}/topics/${topicId}`);
            const data = res?.data || {};

            topicNames[topicId] = data.topicName || topicId;

            if (data.module?.subject?.subjectName) {
              subjectNames[subjectId] =
                data.module.subject.subjectName;
            }
          } catch {
            topicNames[topicId] = topicId;
          }
        })
      )
    );

    set((s) => ({
      topicNames,
      subjectNames: { ...s.subjectNames, ...subjectNames },
    }));
  },
   // =============================
  // PAYMENTS
  // =============================
  initializePayment: async () => {
    set({ paymentLoading: true });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const data = await fetchWithAuth(
        `${API_BASE}/payments/initialize`,
        { method: "POST" }
      );
      set({ paymentLoading: false });
      console.log( data.data.authorization_url)
      window.location.href = data.data.authorizationUrl;
    } catch (err) {
      console.error("❌ payment init failed", err);
      set({ paymentLoading: false });
    }
  },
}));
