import { create } from "zustand";
import { persist } from "zustand/middleware";
import useTutorAuthStore from "./tutorAuthStore"; 

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

const useTutorStore = create(
  persist(
    (set, get) => ({
      // 🔐 STATE (dashboard-specific only)
      tutorProfile: null,
      dashboardData: null,
      loading: false,
      error: "",
      success: "",

      // 🔹 GET ACCESS TOKEN FROM AUTH STORE
      getAccessToken: () => {
        return useTutorAuthStore.getState().accessToken;
      },

      // 🔹 GET TUTOR FROM AUTH STORE
      getTutor: () => {
        return useTutorAuthStore.getState().tutor;
      },

      // 🔹 CHECK IF AUTHENTICATED FROM AUTH STORE
      isAuthenticated: () => {
        return useTutorAuthStore.getState().isAuthenticated;
      },

      // 🔹 GET TUTOR DASHBOARD
      fetchDashboard: async () => {
        const token = get().getAccessToken();
        
        if (!token) {
          set({ error: "Not authenticated" });
          return { success: false, message: "Not authenticated" };
        }

        set({ loading: true, error: "", dashboardData: null });

        try {
          const response = await fetch(`${API_BASE}/tutor/dashboard`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          });

          const res = await response.json();

          if (!res.success) {
            set({ error: res.message || "Failed to fetch dashboard" });
            return { success: false, message: res.message };
          }

          set({
            dashboardData: res.data,
            success: "Dashboard loaded successfully",
          });

          console.log("✅ Dashboard data fetched:", res.data);
          return { success: true, data: res.data };
        } catch (error) {
          console.error("❌ Error fetching dashboard:", error);
          const errorMessage = "Network error. Please check your connection.";
          set({ error: errorMessage });
          return { success: false, message: errorMessage };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 FETCH WITH AUTH (Helper for tutor endpoints)
      fetchWithAuth: async (url, options = {}) => {
        const token = get().getAccessToken();

        if (!token) {
          console.error("❌ No access token found");
          return { success: false, message: "Not authenticated" };
        }

        try {
          const response = await fetch(url, {
            ...options,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              ...options.headers,
            },
            credentials: "include",
          });

          const data = await response.json();
          return data;
        } catch (error) {
          console.error("❌ Fetch error:", error);
          return { success: false, message: error.message };
        }
      },

      // ========== SUBJECTS ==========

      // 🔹 CREATE SUBJECT
      createSubject: async (subjectData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects`, {
            method: "POST",
            body: JSON.stringify(subjectData),
          });

          if (result.success) {
            set({ success: "Subject created successfully" });
            console.log("✅ Subject created:", result.data);
          } else {
            set({ error: result.message || "Failed to create subject" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error creating subject:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 GET OWN SUBJECTS
      getSubjects: async () => {
        set({ loading: true, error: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects`);

          if (result.success) {
            console.log("✅ Subjects fetched:", result.data);
          } else {
            set({ error: result.message || "Failed to fetch subjects" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error fetching subjects:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 UPDATE SUBJECT
      updateSubject: async (subjectId, subjectData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects/${subjectId}`, {
            method: "POST",
            body: JSON.stringify(subjectData),
          });

          if (result.success) {
            set({ success: "Subject updated successfully" });
            console.log("✅ Subject updated:", result.data);
          } else {
            set({ error: result.message || "Failed to update subject" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error updating subject:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 DELETE SUBJECT
      deleteSubject: async (subjectId) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects/${subjectId}`, {
            method: "DELETE",
          });

          if (result.success) {
            set({ success: "Subject deleted successfully" });
            console.log("✅ Subject deleted");
          } else {
            set({ error: result.message || "Failed to delete subject" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error deleting subject:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // ========== MODULES ==========

      // 🔹 CREATE MODULE
      createModule: async (subjectId, moduleData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects/${subjectId}/modules`, {
            method: "POST",
            body: JSON.stringify(moduleData),
          });

          if (result.success) {
            set({ success: "Module created successfully" });
            console.log("✅ Module created:", result.data);
          } else {
            set({ error: result.message || "Failed to create module" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error creating module:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 GET OWN MODULES
      getModules: async () => {
        set({ loading: true, error: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/modules`);

          if (result.success) {
            console.log("✅ Modules fetched:", result.data);
          } else {
            set({ error: result.message || "Failed to fetch modules" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error fetching modules:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 UPDATE MODULE
      updateModule: async (moduleId, moduleData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/modules/${moduleId}`, {
            method: "PATCH",
            body: JSON.stringify(moduleData),
          });

          if (result.success) {
            set({ success: "Module updated successfully" });
            console.log("✅ Module updated:", result.data);
          } else {
            set({ error: result.message || "Failed to update module" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error updating module:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 DELETE MODULE
      deleteModule: async (moduleId) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/modules/${moduleId}`, {
            method: "DELETE",
          });

          if (result.success) {
            set({ success: "Module deleted successfully" });
            console.log("✅ Module deleted");
          } else {
            set({ error: result.message || "Failed to delete module" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error deleting module:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // ========== TOPICS ==========

      // 🔹 CREATE TOPIC
      createTopic: async (moduleId, topicData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/module/${moduleId}/topics`, {
            method: "POST",
            body: JSON.stringify(topicData),
          });

          if (result.success) {
            set({ success: "Topic created successfully" });
            console.log("✅ Topic created:", result.data);
          } else {
            set({ error: result.message || "Failed to create topic" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error creating topic:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 GET ALL TOPICS
      getTopics: async () => {
        set({ loading: true, error: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics`);

          if (result.success) {
            console.log("✅ Topics fetched:", result.data);
          } else {
            set({ error: result.message || "Failed to fetch topics" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error fetching topics:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 DELETE TOPIC
      deleteTopic: async (topicId) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics/${topicId}`, {
            method: "DELETE",
          });

          if (result.success) {
            set({ success: "Topic deleted successfully" });
            console.log("✅ Topic deleted");
          } else {
            set({ error: result.message || "Failed to delete topic" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error deleting topic:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // ========== QUESTIONS ==========

      // 🔹 CREATE QUESTION
      createQuestion: async (topicId, questionData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics/${topicId}/questions`, {
            method: "POST",
            body: JSON.stringify(questionData),
          });

          if (result.success) {
            set({ success: "Question created successfully" });
            console.log("✅ Question created:", result.data);
          } else {
            set({ error: result.message || "Failed to create question" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error creating question:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 GET ALL QUESTIONS
      getQuestions: async (filters = {}) => {
        set({ loading: true, error: "" });

        try {
          const queryParams = new URLSearchParams();
          if (filters.difficulty) queryParams.append("difficulty", filters.difficulty);
          if (filters.year) queryParams.append("year", filters.year);
          if (filters.category) queryParams.append("category", filters.category);
          if (filters.type) queryParams.append("type", filters.type);
          if (filters.search) queryParams.append("search", filters.search);

          const queryString = queryParams.toString();
          const url = `${API_BASE}/tutor/questions${queryString ? `?${queryString}` : ""}`;

          const result = await get().fetchWithAuth(url);

          if (result.success) {
            console.log("✅ Questions fetched:", result.data);
          } else {
            set({ error: result.message || "Failed to fetch questions" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error fetching questions:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 UPDATE QUESTION
      updateQuestion: async (questionId, questionData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/questions/${questionId}`, {
            method: "PATCH",
            body: JSON.stringify(questionData),
          });

          if (result.success) {
            set({ success: "Question updated successfully" });
            console.log("✅ Question updated:", result.data);
          } else {
            set({ error: result.message || "Failed to update question" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error updating question:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },

      // 🔹 DELETE QUESTION
      deleteQuestion: async (questionId) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/questions/${questionId}`, {
            method: "DELETE",
          });

          if (result.success) {
            set({ success: "Question deleted successfully" });
            console.log("✅ Question deleted");
          } else {
            set({ error: result.message || "Failed to delete question" });
          }

          return result;
        } catch (error) {
          console.error("❌ Error deleting question:", error);
          set({ error: "Network error" });
          return { success: false, message: error.message };
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "tutor-store",
      storage: {
        getItem: (key) => sessionStorage.getItem(key),
        setItem: (key, value) => sessionStorage.setItem(key, value),
        removeItem: (key) => sessionStorage.removeItem(key),
      },
      partialize: (state) => ({
        tutorProfile: state.tutorProfile,
        dashboardData: state.dashboardData,
      }),
    }
  )
);

export default useTutorStore;