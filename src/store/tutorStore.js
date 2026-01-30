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
      subjects: [],
      subjectsLoaded: false,
      subjectsPagination: null,
      modules: [],
      modulesPagination: null,
      modulesLoaded: false,
      topics: [],
      topicsPagination: null,
      topicsLoaded: false,
      questions: [],
      questionsPagination: null,
      questionsLoaded: false,

      // 🔹 SET DASHBOARD DATA
      setDashboardData: (data) => {
        set({ dashboardData: data });
      },

      // 🔹 GET ACCESS TOKEN FROM AUTH STORE
      getAccessToken: () => {
        return useTutorAuthStore.getState().accessToken;
      },
      
      // ... rest of your code
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

      getSubjects: async () => {
    const { subjectsLoaded } = get()

    if (subjectsLoaded) {
      return { success: true, data: get().subjects }
    }

    set({ loading: true, error: "" })

    try {
      const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects`)

      if (result.success) {
        const subjects = result.data?.subjects || []
        const pagination = result.data?.pagination || null

        set({
          subjects,
          subjectsPagination: pagination,
          subjectsLoaded: true,
        })

        console.log("✅ Subjects stored in Zustand:", subjects)
      } else {
        set({ error: result.message || "Failed to fetch subjects" })
      }

      return result
    } catch (error) {
      console.error("❌ Error fetching subjects:", error)
      set({ error: "Network error" })
      return { success: false, message: error.message }
    } finally {
      set({ loading: false })
    }
      },



      // 🔹 GET SUBJECT BY ID
          getSubjectById: async (subjectId) => {
            set({ loading: true, error: "" });

            try {
              const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects/${subjectId}`);

              if (result.success) {
                console.log("✅ Subject fetched:", result.data);
              } else {
                set({ error: result.message || "Failed to fetch subject" });
              }

              return result;
            } catch (error) {
              console.error("❌ Error fetching subject:", error);
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
            method: "PATCH",
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
      deleteSubject: async (subjectId, subjectData) => {
        set({ loading: true, error: "", success: "" });

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects/${subjectId}`, {
            method: "DELETE",
            body: JSON.stringify(subjectData),
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

      // 🔹 GET STUDENTS ENROLLED IN SUBJECT
      getSubjectEnrolledStudents: async (subjectId) => {
        if (!subjectId) {
          return { success: false, message: "Subject ID is required" };
        }

        try {
          const result = await get().fetchWithAuth(
            `${API_BASE}/tutor/subjects/${subjectId}/users`
          );
          console.log(result);
          
          if (!result?.success) {
            return { success: false, message: result?.message || "Failed to load students" };
          }

          return {
            success: true,
            data: result.data || [],
          };
        } catch (error) {
          console.error("❌ Error fetching enrolled students:", error);
          return { success: false, message: "Network error" };
        }
      },

      // ========== TOPICS ==========
      // Get all topics (with caching)
      getTopics: async () => {
        const { topicsLoaded } = get()

        if (topicsLoaded) {
          return { 
            success: true, 
            data: { 
              topics: get().topics, 
              pagination: get().topicsPagination 
            } 
          }
        }

        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics`)

          if (result.success) {
            const topics = result.data?.topics || result.data || []
            const pagination = result.data?.pagination || null

            set({
              topics,
              topicsPagination: pagination,
              topicsLoaded: true,
            })

            console.log("✅ Topics stored in Zustand:", topics)
          } else {
            set({ error: result.message || "Failed to fetch topics" })
          }

          return result
        } catch (error) {
          console.error("❌ Error fetching topics:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },

      // Create topic
 
      createTopic: async (subjectId, topicData) => {
        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/subjects/${subjectId}/topics`, {
            method: "POST",
            body: JSON.stringify(topicData),
          })

          if (result.success) {
            console.log("✅ Topic created:", result.data)
            
            set({ 
              topicsLoaded: false,
              subjectsLoaded: false
            })
          } else {
            set({ error: result.message || "Failed to create topic" })
          }

          return result
        } catch (error) {
          console.error("❌ Error creating topic:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },

      // Update topic
      updateTopic: async (topicId, topicData) => {
        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics/${topicId}`, {
            method: "PATCH",
            body: JSON.stringify(topicData),
          })

          if (result.success) {
            console.log("✅ Topic updated:", result.data)
            set({ topicsLoaded: false })
          } else {
            set({ error: result.message || "Failed to update topic" })
          }

          return result
        } catch (error) {
          console.error("❌ Error updating topic:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },

      // Delete topic
      deleteTopic: async (topicId) => {
        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics/${topicId}`, {
            method: "DELETE",
          })

          if (result.success) {
            console.log("✅ Topic deleted")
            set({ 
              topicsLoaded: false,
              modulesLoaded: false,
              subjectsLoaded: false
            })
          } else {
            set({ error: result.message || "Failed to delete topic" })
          }

          return result
        } catch (error) {
          console.error("❌ Error deleting topic:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },

      // Get topic by ID
      getTopicById: async (topicId) => {
        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics/${topicId}`)

          if (result.success) {
            console.log("✅ Topic details fetched:", result.data)
          } else {
            set({ error: result.message || "Failed to fetch topic details" })
          }

          return result
        } catch (error) {
          console.error("❌ Error fetching topic details:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },


      // ========== QUESTIONS ==========

      // Get all questions (with caching)
      getQuestions: async () => {
        const { questionsLoaded } = get()

        if (questionsLoaded) {
          return { 
            success: true, 
            data: { 
              questions: get().questions, 
              pagination: get().questionsPagination 
            } 
          }
        }

        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/questions`)

          if (result.success) {
            const questions = result.data?.questions || result.data || []
            const pagination = result.data?.pagination || null

            set({
              questions,
              questionsPagination: pagination,
              questionsLoaded: true,
            })

            console.log("✅ Questions stored in Zustand:", questions)
          } else {
            set({ error: result.message || "Failed to fetch questions" })
          }

          return result
        } catch (error) {
          console.error("❌ Error fetching questions:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },

      // Create question
      createQuestion: async (topicId, questionData) => {
        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics/${topicId}/questions`, {
            method: "POST",
            body: JSON.stringify(questionData),
          })

          if (result.success) {
            console.log("✅ Question created:", result.data)
            
            set({ 
              questionsLoaded: false,
              topicsLoaded: false,
              modulesLoaded: false,
              subjectsLoaded: false
            })
          } else {
            set({ error: result.message || "Failed to create question" })
          }

          return result
        } catch (error) {
          console.error("❌ Error creating question:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },

      // Update question
      updateQuestion: async (questionId, questionData) => {
        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/questions/${questionId}`, {
            method: "PATCH",
            body: JSON.stringify(questionData),
          })

          if (result.success) {
            console.log("✅ Question updated:", result.data)
            set({ questionsLoaded: false })
          } else {
            set({ error: result.message || "Failed to update question" })
          }

          return result
        } catch (error) {
          console.error("❌ Error updating question:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },

      // Delete question
      deleteQuestion: async (questionId) => {
        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/questions/${questionId}`, {
            method: "DELETE",
          })

          if (result.success) {
            console.log("✅ Question deleted")
            set({ 
              questionsLoaded: false,
              topicsLoaded: false,
              modulesLoaded: false,
              subjectsLoaded: false
            })
          } else {
            set({ error: result.message || "Failed to delete question" })
          }

          return result
        } catch (error) {
          console.error("❌ Error deleting question:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
        }
      },

      // Get question by ID
      getQuestionById: async (questionId) => {
        set({ loading: true, error: "" })

        try {
          const result = await get().fetchWithAuth(`${API_BASE}/tutor/questions/${questionId}`)

          if (result.success) {
            console.log("✅ Question details fetched:", result.data)
          } else {
            set({ error: result.message || "Failed to fetch question details" })
          }

          return result
        } catch (error) {
          console.error("❌ Error fetching question details:", error)
          set({ error: "Network error" })
          return { success: false, message: error.message }
        } finally {
          set({ loading: false })
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