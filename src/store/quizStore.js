import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";
const BUFFER_LIMIT = 4; // fetch 5 questions per request
const TOTAL_QUESTIONS = 10;

export const useQuizStore = create((set, get) => ({
  questions: [],
  buffer: [],
  currentIndex: 0,
  selectedOptions: {},
  loading: false,
  paymentLocked: false,
  finished: false,
  fetchedCount: 0,
  report: [],

  initQuiz: async () => {
    set({
      questions: [],
      buffer: [],
      currentIndex: 0,
      selectedOptions: {},
      loading: true,
      paymentLocked: false,
      finished: false,
      fetchedCount: 0,
      report: [],
    });

    await get().fetchBuffer();

    const { buffer } = get();
    if (buffer.length) {
      set({
        questions: [buffer[0]],
        buffer: buffer.slice(1),
        currentIndex: 0,
      });
    }

    set({ loading: false });
  },

  fetchBuffer: async () => {
    const stored = JSON.parse(localStorage.getItem("prefSubjects") || "{}");
    const subjects = Object.values(stored).flat();
    if (!subjects.length) return;

    set({ loading: true });
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const newQuestions = [];

      for (let i = 0; i < BUFFER_LIMIT; i++) {
        const subject = subjects[Math.floor(Math.random() * subjects.length)];
        const res = await fetchWithAuth(
          `${API_BASE}/subjects/${subject.id}/questions?random=true&limit=1`
        );

        // Payment UI only if backend responds 403
        if (res?.status === 403 || res?.code === "PAYMENT_REQUIRED") {
          set({ paymentLocked: true, loading: false });
          return;
        }

        if (res?.data?.length) newQuestions.push(res.data[0]);
      }

      set(state => ({
        buffer: [...state.buffer, ...newQuestions],
        fetchedCount: state.fetchedCount + newQuestions.length,
        loading: false,
      }));
    } catch (err) {
      set({
        paymentLocked: err?.status === 403 || err?.response?.status === 403,
        loading: false,
      });
    }
  },

  next: async () => {
    const { buffer, questions, currentIndex } = get();

    if (buffer.length) {
      const nextQ = buffer[0];
      set({
        questions: [...questions, nextQ],
        buffer: buffer.slice(1),
        currentIndex: currentIndex + 1,
      });

      // Prefetch next buffer if empty
      if (get().buffer.length === 0) {
        await get().fetchBuffer(); // will trigger paymentLocked if 403
      }
    }
  },

  prev: () => set(s => ({
    currentIndex: Math.max(0, s.currentIndex - 1)
  })),

  answer: (qId, option) => set(s => ({
    selectedOptions: { ...s.selectedOptions, [qId]: option }
  })),

  submit: () => {
    const { questions, selectedOptions } = get();
    const report = questions.map(q => ({
      id: q.id,
      question: q.question,
      selected: selectedOptions[q.id] || "None",
      correct: q.correct,
      isCorrect: q.correct === selectedOptions[q.id],
      explanation: q.explanation,
    }));
    set({ finished: true, report });
  },

  initializePayment: async () => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/payments/initialize`, { method: "POST" });
      window.location.href = res.data.authorizationUrl;
    } catch (err) {
      console.error("Payment failed", err);
    }
  },
}));