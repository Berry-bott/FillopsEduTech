// import { create } from "zustand";
// import useAuthStore from "./authStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
// const TOTAL_QUESTIONS = 10;

// const getTodayKey = () => {
//   const d = new Date();
//   return `quiz-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
// };

// export const useQuizStore = create((set, get) => ({
//   questions: [],
//   currentIndex: 0,
//   selectedOptions: {},
//   loading: false,
//   finished: false,
//   report: [],

//   // ---------------- INIT QUIZ ----------------
//   initQuiz: async () => {
//     const todayKey = getTodayKey();
//     const cached = JSON.parse(localStorage.getItem(todayKey));

//     if (cached?.length === TOTAL_QUESTIONS) {
//       set({
//         questions: cached,
//         currentIndex: 0,
//         selectedOptions: {},
//         finished: false,
//         report: [],
//         loading: false,
//       });
//       return;
//     }

//     set({
//       questions: [],
//       currentIndex: 0,
//       selectedOptions: {},
//       finished: false,
//       report: [],
//       loading: true,
//     });

//     await get().fetchQuestions();
//   },

//   // ---------------- FETCH QUESTIONS ----------------
//   fetchQuestions: async () => {
//     try {
//       const stored = JSON.parse(localStorage.getItem("prefSubjects") || "{}");
//       const subjects = Object.values(stored).flat();

//       if (!subjects.length) {
//         set({ loading: false });
//         return;
//       }

//       const { fetchWithAuth } = useAuthStore.getState();
//       const questions = [];

//       while (questions.length < TOTAL_QUESTIONS) {
//         const subject =
//           subjects[Math.floor(Math.random() * subjects.length)];

//         const res = await fetchWithAuth(
//           `${API_BASE}/subjects/${subject.id}/questions?random=true&limit=1`
//         );

//         if (res?.data?.length) {
//           const q = res.data[0];

//           // prevent duplicates
//           if (!questions.find((x) => x.id === q.id)) {
//             questions.push(q);
//           }
//         }
//       }

//       const todayKey = getTodayKey();
//       localStorage.setItem(todayKey, JSON.stringify(questions));

//       set({
//         questions,
//         loading: false,
//       });
//     } catch (err) {
//       console.error("Quiz fetch failed", err);
//       set({ loading: false });
//     }
//   },

//   // ---------------- NAVIGATION ----------------
//   next: () =>
//     set((s) => ({
//       currentIndex: Math.min(
//         s.currentIndex + 1,
//         s.questions.length - 1
//       ),
//     })),

//   prev: () =>
//     set((s) => ({
//       currentIndex: Math.max(0, s.currentIndex - 1),
//     })),

//   // ---------------- ANSWER ----------------
//   answer: (qId, option) =>
//     set((s) => ({
//       selectedOptions: { ...s.selectedOptions, [qId]: option },
//     })),

//   // ---------------- SUBMIT ----------------
//   submit: () => {
//     const { questions, selectedOptions } = get();

//     const report = questions.map((q) => ({
//       id: q.id,
//       question: q.question,
//       selected: selectedOptions[q.id] || null,
//       correct: q.correct,
//       isCorrect: selectedOptions[q.id] === q.correct,
//       explanation: q.explanation,
//     }));

//     set({
//       finished: true,
//       report,
//     });
//   },

//   // ---------------- RESET ----------------
//   reset: () =>
//     set({
//       questions: [],
//       currentIndex: 0,
//       selectedOptions: {},
//       finished: false,
//       report: [],
//     }),
// }));





import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
const TOTAL_QUESTIONS = 10;

const getTodayKey = () => {
  const d = new Date();
  return `quiz-${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const useQuizStore = create((set, get) => ({
  questions: [],
  currentIndex: 0,
  selectedOptions: {},
  loading: false,
  finished: false,

  report: [],
  score: 0,
  percentage: 0,
  grade: "",

  // ---------------- INIT ----------------
  initQuiz: async () => {
    const todayKey = getTodayKey();
    const cached = JSON.parse(localStorage.getItem(todayKey));

    if (cached?.length === TOTAL_QUESTIONS) {
      set({
        questions: cached,
        currentIndex: 0,
        selectedOptions: {},
        finished: false,
        report: [],
        score: 0,
        percentage: 0,
        grade: "",
        loading: false,
      });
      return;
    }

    set({
      questions: [],
      currentIndex: 0,
      selectedOptions: {},
      finished: false,
      report: [],
      score: 0,
      percentage: 0,
      grade: "",
      loading: true,
    });

    await get().fetchQuestions();
  },

  // ---------------- FETCH QUESTIONS ----------------
  fetchQuestions: async () => {
    try {
      const stored = JSON.parse(localStorage.getItem("prefSubjects") || "{}");
      const subjects = Object.values(stored).flat(); // ARRAY OF IDS

      if (!subjects.length) {
        set({ loading: false });
        return;
      }

      const { fetchWithAuth } = useAuthStore.getState();
      const questions = [];

      while (questions.length < TOTAL_QUESTIONS) {
        const subjectId =
          subjects[Math.floor(Math.random() * subjects.length)];

        const res = await fetchWithAuth(
          `${API_BASE}/subjects/${subjectId}/questions?random=true&limit=${TOTAL_QUESTIONS}`
        );

        if (res?.data?.length) {
          const q = res.data[0];

          if (!questions.find((x) => x.id === q.id)) {
            questions.push(q);
          }
        }
      }

      localStorage.setItem(getTodayKey(), JSON.stringify(questions));

      set({
        questions,
        loading: false,
      });
    } catch (err) {
      console.error("Quiz fetch failed", err);
      set({ loading: false });
    }
  },

  // ---------------- NAV ----------------
  next: () =>
    set((s) => ({
      currentIndex: Math.min(s.currentIndex + 1, s.questions.length - 1),
    })),

  prev: () =>
    set((s) => ({
      currentIndex: Math.max(0, s.currentIndex - 1),
    })),

  // ---------------- ANSWER ----------------
  answer: (qId, option) =>
    set((s) => ({
      selectedOptions: { ...s.selectedOptions, [qId]: option },
    })),

  // ---------------- SUBMIT ----------------
  submit: () => {
    const { questions, selectedOptions } = get();
    let score = 0;

    const report = questions.map((q) => {
      const selected = selectedOptions[q.id] || null;
      const isCorrect = selected === q.correct;

      if (isCorrect) score++;

      return {
        id: q.id,
        question: q.text, // ✅ CORRECT FIELD
        selected,
        correct: q.correct,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const percentage = Math.round((score / questions.length) * 100);

    let grade = "Poor";
    if (percentage >= 80) grade = "Excellent";
    else if (percentage >= 60) grade = "Good";
    else if (percentage >= 40) grade = "Fair";

    set({
      finished: true,
      report,
      score,
      percentage,
      grade,
    });
  },

  // ---------------- RESET ----------------
  reset: () =>
    set({
      questions: [],
      currentIndex: 0,
      selectedOptions: {},
      finished: false,
      report: [],
      score: 0,
      percentage: 0,
      grade: "",
    }),
}));
