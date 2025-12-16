
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








import { create } from "zustand";
import useAuthStore from "./authStore";

export const useStudyStore = create((set, get) => ({
  // ------------------------------
  // STATE
  // ------------------------------
  saved: null,
  questions: [],
  loading: false,
  selectedOptions: {},
  activeId: null,
  currentIndex: 0,
  subjectNames: {},
  topicNames: {},

  // ------------------------------
  // SYNC LOCAL STORAGE
  // ------------------------------
  syncSaved: async () => {
    try {
      const saved = JSON.parse(localStorage.getItem("studySelections"));
      console.log("🔄 syncSaved()", saved);
      if (!saved) return null;

      set({ saved });
      // fetch names after saved is ready
      await Promise.all([
        get().fetchSubjectNames(),
        get().fetchTopicNames(),
      ]);

      // set first active item
      const firstId =
        saved.mode === "subject"
          ? saved.subjects?.[0]
          : Object.values(saved.topics || {})[0]?.[0];

      if (firstId) get().changeActive(firstId);

      return saved;
    } catch (e) {
      console.error("❌ syncSaved failed", e);
      return null;
    }
  },

  // ------------------------------
  // RESET STORE
  // ------------------------------
  reset: () =>
    set({
      saved: null,
      questions: [],
      loading: false,
      selectedOptions: {},
      activeId: null,
      currentIndex: 0,
      subjectNames: {},
      topicNames: {},
    }),

  // ------------------------------
  // SETTERS
  // ------------------------------
  setActiveId: (id) => {
    console.log("🎯 setActiveId:", id);
    set({ activeId: id, currentIndex: 0 });
  },

  setSelectedOption: (qId, opt) =>
    set((state) => ({
      selectedOptions: { ...state.selectedOptions, [qId]: opt },
    })),

  setCurrentIndex: (index) =>
    set((state) => ({ currentIndex: Math.max(0, Math.min(index, state.questions.length - 1)) })),

  // ------------------------------
  // NAVIGATION
  // ------------------------------
  next: () => {
    const { currentIndex, questions, saved, activeId } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    } else {
      // move to next subject/topic
      if (!saved) return;
      const ids =
        saved.mode === "subject"
          ? saved.subjects
          : Object.values(saved.topics || {})[0];
      const currentPos = ids.indexOf(activeId);
      const nextId = ids[currentPos + 1];
      if (nextId) get().changeActive(nextId);
    }
  },

  // ------------------------------
  // FETCH QUESTIONS
  // ------------------------------
  fetchQuestions: async (type, id, year) => {
    const { saved } = get();
    if (!saved) return;

    console.log("📥 fetchQuestions", { type, id, year });

    set({ loading: true });

    try {
      const base = "https://fillops-server-5fuf.onrender.com/api";
      const url =
        year && year !== "random"
          ? `${base}/${type}/${id}/questions?category=${saved.exam}&year=${year}`
          : `${base}/${type}/${id}/questions?random=true&category=${saved.exam}`;

      const token = useAuthStore.getState().accessToken;
      console.log("🔗 Fetching from URL:", token);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();

      set({
        questions: data.data || [],
        currentIndex: 0,
        selectedOptions: {},
        loading: false,
      });
    } catch (e) {
      console.error("❌ fetchQuestions error", e);
      set({ questions: [], loading: false });
    }
  },

  // ------------------------------
  // FETCH SUBJECT NAMES
  // ------------------------------
  fetchSubjectNames: async () => {
    const { saved } = get();
    if (!saved?.subjects) return;

    console.log("📘 fetchSubjectNames");

    const names = {};
    await Promise.all(
      saved.subjects.map(async (id) => {
        try {
          const res = await fetch(
            `https://fillops-server-5fuf.onrender.com/api/subjects/${id}`,
            {
              headers: {
                Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
              },
            }
          );
          const data = await res.json();
          names[id] = data.subjectName || id;
        } catch {
          names[id] = id;
        }
      })
    );

    set({ subjectNames: names });
  },

  // ------------------------------
  // FETCH TOPIC NAMES
  // ------------------------------
  fetchTopicNames: async () => {
    const { saved } = get();
    if (!saved?.topics) return;

    console.log("📙 fetchTopicNames");

    const topicNames = {};
    const subjectNames = {};

    await Promise.all(
      Object.entries(saved.topics).flatMap(([_, topicIds]) =>
        topicIds.map(async (topicId) => {
          try {
            const res = await fetch(
              `https://fillops-server-5fuf.onrender.com/api/topics/${topicId}`,
              {
                headers: {
                  Authorization: `Bearer ${useAuthStore.getState().accessToken}`,
                },
              }
            );
            const raw = await res.json();
            const topic = raw.data || raw;

            topicNames[topicId] = topic.topicName || topicId;

            if (topic.module?.subject?.subjectName) {
              subjectNames[topicId] = topic.module.subject.subjectName;
            }
          } catch {
            topicNames[topicId] = topicId;
          }
        })
      )
    );

    set((state) => ({
      topicNames,
      subjectNames: { ...state.subjectNames, ...subjectNames },
    }));
  },

  // ------------------------------
  // CHANGE ACTIVE SUBJECT/TOPIC
  // ------------------------------
  changeActive: (id) => {
    const { saved } = get();
    if (!saved) return;

    console.log("🔁 changeActive:", id);
    set({ activeId: id, currentIndex: 0 });

    if (saved.mode === "subject") {
      get().fetchQuestions("subjects", id, saved.subjectYears?.[id]);
    } else {
      get().fetchQuestions("topics", id, saved.topicYears?.[id]);
    }
  },
}));
