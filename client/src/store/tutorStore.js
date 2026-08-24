  import { create } from "zustand";
  import { persist } from "zustand/middleware";
  import useTutorAuthStore from "./tutorAuthStore"; 

  const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;
  
  // Helper to get the refresh-aware fetchWithAuth from tutorAuthStore
  const authFetch = (url, options = {}) => {
    return useTutorAuthStore.getState().fetchWithAuth(url, options);
  };

  // Build a multipart FormData body from question fields + optional image file.
  // Used by create/update so the image is sent through the question endpoint body
  // (the separate /tutor/questions/upload-image endpoint does not exist).
  function buildQuestionFormData(questionData, file) {
    const fd = new FormData();
    Object.entries(questionData).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach((item) => fd.append(key, String(item)));
      } else if (typeof value === "object") {
        fd.append(key, JSON.stringify(value));
      } else {
        fd.append(key, String(value));
      }
    });
    if (file) fd.append("image", file);
    return fd;
  }

  // Strip null/undefined values from a plain object so they are not sent in the
  // JSON body. This mirrors the multipart behavior above and prevents backend
  // validation errors like "Image url must be a string." when imageUrl is null.
  function stripNulls(obj) {
    return Object.fromEntries(
      Object.entries(obj).filter(([, value]) => value !== undefined && value !== null)
    );
  }
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
          set({ loading: true, error: "", dashboardData: null });

          try {
            const res = await authFetch(`${API_BASE}/tutor/dashboard`);

            if (res.success) {
              set({
                dashboardData: res.data,
                success: "Dashboard loaded successfully",
              });
              console.log("✅ Dashboard data fetched:", res.data);
            } else {
              set({ error: res.message || "Failed to fetch dashboard" });
            }

            return res;
          } catch (error) {
            console.error("❌ Error fetching dashboard:", error);
            const errorMessage = "Network error. Please check your connection.";
            set({ error: errorMessage });
            return { success: false, message: errorMessage };
          } finally {
            set({ loading: false });
          }
        },

        // 🔹 FETCH WITH AUTH (delegates to tutorAuthStore which handles 401/403 refresh)
        fetchWithAuth: async (url, options = {}) => {
          return authFetch(url, options);
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

            if (!result?.success) {
              return { success: false, message: result?.message || "Failed to load enrolled students" };
            }

            // Return the full structured response
            return {
              success: true,
              data: result.data || { students: [], pagination: null, subject: null },
            };
          } catch (error) {
            console.error("Error fetching enrolled students:", error);
            return { success: false, message: "Network or server error" };
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

              set((state) => ({
                topics: [result.data, ...(state.topics || [])],
                topicsLoaded: true,
                subjectsLoaded: false,
              }))
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

              set((state) => {
                const topics = [...(state.topics || [])]
                const idx = topics.findIndex((topic) => (topic.id || topic.topicId) === (result.data?.id || topicId))

                if (idx >= 0) {
                  topics[idx] = {
                    ...topics[idx],
                    ...result.data,
                    content: result.data?.content || topics[idx]?.content || "",
                  }
                } else {
                  topics.unshift(result.data)
                }

                return {
                  topics,
                  topicsLoaded: true,
                }
              })
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

        // Get questions with server-side filtering + pagination.
        // Accepts query params the backend supports: page, limit, subjectId,
        // topicId, search, category, year, difficulty, type, origin.
        getQuestions: async ({
          page = 1,
          limit = 10,
          subjectId = null,
          topicId = null,
          search = "",
          category = "",
          year = "",
          difficulty = "",
          origin = "",
        } = {}) => {
          set({ loading: true, error: "" })

          try {
            const params = new URLSearchParams()
            params.set("page", String(page))
            params.set("limit", String(limit))
            if (subjectId) params.set("subjectId", subjectId)
            if (topicId) params.set("topicId", topicId)
            if (search) params.set("search", search)
            if (category && category !== "all-catigories") params.set("category", category)
            if (year) params.set("year", String(year))
            if (difficulty) params.set("difficulty", difficulty)
            if (origin) params.set("origin", origin)

            const qs = params.toString()
            const result = await get().fetchWithAuth(`${API_BASE}/tutor/questions${qs ? `?${qs}` : ""}`)

            if (result.success) {
              const questions = result.data?.questions || result.data || []
              // The questions endpoint returns pagination at the TOP level of the
              // response (sibling of `data`), unlike subjects/topics. Support both.
              const pagination = result.pagination || result.data?.pagination || null

              set({
                questions,
                questionsPagination: pagination,
                questionsLoaded: true,
              })

              console.log("✅ Questions stored in Zustand:", questions, pagination)
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
        createQuestion: async (topicId, questionData, file) => {
          set({ loading: true, error: "" })

          try {
            const isMultipart = !!file
            const result = await get().fetchWithAuth(`${API_BASE}/tutor/topics/${topicId}/questions`, {
              method: "POST",
              body: isMultipart ? buildQuestionFormData(questionData, file) : JSON.stringify(stripNulls(questionData)),
            })

            if (result.success) {
              console.log("✅ Question created:", result.data)

              // If we uploaded an image, surface the URL the backend stored.
              if (isMultipart && result.data) {
                const storedImageUrl =
                  result.data.imageUrl ??
                  result.data.url ??
                  result.data.image?.url ??
                  null
                if (storedImageUrl) result.data.imageUrl = storedImageUrl
              }

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
        updateQuestion: async (questionId, questionData, file) => {
          set({ loading: true, error: "" })

          try {
            const isMultipart = !!file
            const result = await get().fetchWithAuth(`${API_BASE}/tutor/questions/${questionId}`, {
              method: "PATCH",
              body: isMultipart ? buildQuestionFormData(questionData, file) : JSON.stringify(stripNulls(questionData)),
            })

            if (result.success) {
              console.log("✅ Question updated:", result.data)

              // If we uploaded an image, surface the URL the backend stored.
              if (isMultipart && result.data) {
                const storedImageUrl =
                  result.data.imageUrl ??
                  result.data.url ??
                  result.data.image?.url ??
                  null
                if (storedImageUrl) result.data.imageUrl = storedImageUrl
              }

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