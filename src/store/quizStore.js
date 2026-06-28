import { create } from "zustand";
import useAuthStore from "./authStore";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

export const useQuizStore = create((set, get) => ({
  // Quiz state
  questions: [],
  currentIndex: 0,
  loading: false,
  finished: false,
  startTime: null,
  timerSeconds: 0,
  timerInterval: null,
  
  // Stats from backend
  stats: {
    currentStreak: 0,
    totalQuizzes: 0,
    averageScore: 0,
    bestStreak: 0,
  },
  
  // Today's quiz status
  todayStatus: {
    isCompleted: false,
    score: null,
    percentage: null,
  },

  // Results
  result: null,

  // History
  history: [],
  historyLoading: false,
  historyPage: 1,
  historyLimit: 10,
  historyTotal: 0,

  // ---------------- FETCH STATS (For Dashboard) ----------------
  fetchStats: async () => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/quiz/stats`);
      
      console.log("Stats response:", res);
      
      if (res?.data) {
        const overview = res.data.overview || {};
        const today = res.data.today || {};
        
        set({
          stats: {
            currentStreak: overview.currentStreak || 0,
            totalQuizzes: overview.totalQuizzes || 0,
            averageScore: overview.averageScore || 0,
            bestStreak: overview.bestStreak || 0,
          },
          todayStatus: {
            isCompleted: today.isCompleted || false,
            score: today.score || null,
            percentage: today.percentage || null,
          },
        });
      }
    } catch (err) {
      console.error("Failed to fetch stats", err);
    }
  },

  // ---------------- INIT QUIZ ----------------
  initQuiz: async () => {
    set({ loading: true, finished: false, result: null });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/quiz/today`);
      
      console.log("Quiz today response:", res);
      
      if (res?.data) {
        // Check if quiz is already completed
        if (res.data.isCompleted) {
          // Set as finished with the completed data
          set({
            finished: true,
            loading: false,
            result: {
              score: res.data.score || res.data.correctAnswers || 0,
              totalQuestions: res.data.totalQuestions || 10,
              percentage: res.data.score ? Math.round((res.data.score / res.data.totalQuestions) * 100) : 0,
              correctCount: res.data.score || res.data.correctAnswers || 0,
              wrongCount: (res.data.totalQuestions || 10) - (res.data.score || 0),
              timeSpent: res.data.timeSpent || 0,
              completedAt: res.data.completedAt,
              questions: [], // No questions to review
              alreadyCompleted: true, // Flag to show different message
            },
          });
          return;
        }

        const questions = res.data.questions || [];
        
        // Find first unanswered question (for resume functionality)
        const firstUnanswered = questions.findIndex(q => q.userAnswer === null);
        const startIndex = firstUnanswered === -1 ? 0 : firstUnanswered;
        
        set({
          questions,
          currentIndex: startIndex,
          loading: false,
          startTime: Date.now(),
        });
        
        // Start timer
        get().startTimer();
      }
    } catch (err) {
      console.error("Failed to init quiz", err);
      set({ loading: false });
    }
  },

  // ---------------- TIMER ----------------
  startTimer: () => {
    const interval = setInterval(() => {
      set((s) => ({ timerSeconds: s.timerSeconds + 1 }));
    }, 1000);
    
    // Store interval ID for cleanup
    set({ timerInterval: interval });
  },

  stopTimer: () => {
    const { timerInterval } = get();
    if (timerInterval) {
      clearInterval(timerInterval);
    }
  },

  // ---------------- NAV ----------------
  next: () => {
    const { currentIndex, questions } = get();
    if (currentIndex < questions.length - 1) {
      set({ currentIndex: currentIndex + 1 });
    }
  },

  prev: () => {
    const { currentIndex } = get();
    if (currentIndex > 0) {
      set({ currentIndex: currentIndex - 1 });
    }
  },

  goToQuestion: (index) => {
    set({ currentIndex: index });
  },

  // ---------------- ANSWER (Real-time save) ----------------
  answer: async (questionId, selectedOption) => {
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      
      // Log the request for debugging
      console.log("Sending answer:", { questionId, answer: selectedOption });
      
      const res = await fetchWithAuth(`${API_BASE}/quiz/answer`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          answer: selectedOption,
        }),
      });
      
      console.log("Answer response:", res);
      
      if (res?.data) {
        // Update local state with answer result
        set((state) => ({
          questions: state.questions.map((q) => {
            const qId = q._id || q.id || q.questionId;
            return qId === questionId
              ? {
                  ...q,
                  userAnswer: selectedOption,
                  isCorrect: res.data.isCorrect,
                  explanation: res.data.explanation || q.explanation,
                }
              : q;
          }),
        }));
        
        return res.data; // Return for UI feedback
      }
    } catch (err) {
      console.error("Failed to save answer", err);
      console.error("Error details:", err.response || err);
      
      // Still update local state even if API fails
      set((state) => ({
        questions: state.questions.map((q) => {
          const qId = q._id || q.id || q.questionId;
          return qId === questionId
            ? {
                ...q,
                userAnswer: selectedOption,
              }
            : q;
        }),
      }));
      
      return null;
    }
  },

  // ---------------- SUBMIT ----------------
  submit: async () => {
    const { timerSeconds, questions } = get();
    
    get().stopTimer();
    set({ loading: true });

    try {
      const { fetchWithAuth } = useAuthStore.getState();
      
      console.log("Submitting quiz with timeSpent:", timerSeconds);
      
      const res = await fetchWithAuth(`${API_BASE}/quiz/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          timeSpent: timerSeconds,
        }),
      });
      
      console.log("Submit response:", res);
      
      // Handle both success and "already completed" cases
      if (res?.data) {
        // If quiz already completed, construct result from response
        if (!res.success && res.message === "Quiz already completed") {
          // Build result from local questions and backend data
          const result = {
            score: res.data.score,
            totalQuestions: res.data.totalQuestions,
            percentage: res.data.percentage,
            correctCount: res.data.score,
            wrongCount: res.data.totalQuestions - res.data.score,
            timeSpent: timerSeconds,
            questions: questions.map(q => ({
              id: q._id || q.id,
              question: q.text,
              userAnswer: q.userAnswer,
              correctAnswer: q.correct || q.correctAnswer,
              explanation: q.explanation,
            })),
          };
          
          set({
            result,
            finished: true,
            loading: false,
          });
        } else {
          // Normal successful submission
          set({
            result: res.data,
            finished: true,
            loading: false,
          });
        }
        
        // Refresh stats
        await get().fetchStats();
      }
    } catch (err) {
      console.error("Failed to submit quiz", err);
      console.error("Submit error details:", err.response || err);
      set({ loading: false });
    }
  },

  // ---------------- RESET ----------------
  reset: () => {
    get().stopTimer();
    set({
      questions: [],
      currentIndex: 0,
      loading: false,
      finished: false,
      startTime: null,
      timerSeconds: 0,
      timerInterval: null,
      result: null,
    });
  },

  // ---------------- FETCH HISTORY ----------------
  fetchHistory: async (page = 1, limit = 10) => {
    set({ historyLoading: true });
    
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/quiz/history?page=${page}&limit=${limit}`);
      
      console.log("History response:", res);
      
      if (res?.data) {
        set({
          history: res.data.quizzes || res.data.history || res.data,
          historyPage: page,
          historyTotal: res.data.total || 0,
          historyLoading: false,
        });
      }
    } catch (err) {
      console.error("Failed to fetch history", err);
      set({ historyLoading: false });
    }
  },

  // ---------------- FETCH SPECIFIC QUIZ ----------------
  fetchQuizById: async (quizId) => {
    set({ loading: true });
    
    try {
      const { fetchWithAuth } = useAuthStore.getState();
      const res = await fetchWithAuth(`${API_BASE}/quiz/${quizId}`);
      
      console.log("Specific quiz response:", res);
      
      if (res?.data) {
        // Format the result for display
        const quizData = res.data;
        const questions = quizData.questions || [];
        
        set({
          result: {
            score: quizData.score || quizData.correctAnswers || 0,
            totalQuestions: quizData.totalQuestions || questions.length || 10,
            percentage: quizData.percentage || Math.round((quizData.score / quizData.totalQuestions) * 100),
            correctCount: quizData.correctAnswers || quizData.score || 0,
            wrongCount: quizData.wrongAnswers || ((quizData.totalQuestions || 10) - (quizData.score || 0)),
            timeSpent: quizData.timeSpent || 0,
            completedAt: quizData.completedAt,
            questions: questions.map(q => ({
              id: q._id || q.id,
              question: q.question || q.text,
              userAnswer: q.userAnswer,
              correctAnswer: q.correctAnswer || q.correct,
              explanation: q.explanation,
            })),
            isReview: true, // Flag to indicate this is a review
          },
          finished: true,
          loading: false,
        });
      }
    } catch (err) {
      console.error("Failed to fetch quiz by ID", err);
      set({ loading: false });
    }
  },
}));