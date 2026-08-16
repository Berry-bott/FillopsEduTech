
import React, { useState, useEffect } from "react";
import useAuthStore from "@/store/authStore";
import { usePaymentStore } from "@/store/paymentStore";
import { useToast } from "@/components/ui/use-toast";

const API_BASE = `${import.meta.env.VITE_BACKEND_URL}/api`;

export default function TopicSelector({
  selectedTopics = {},
  toggleTopic = () => {},
  setTopicYear = () => {},
  selectedExam,
  onClearSelections = () => {},
}) {
  const { accessToken } = useAuthStore();
  const { toast } = useToast();
  
  // ✅ Get payment info for UI display
  const paymentStore = usePaymentStore();
  const activeSubscriptions = paymentStore?.activeSubscriptions || [];
  const checkStatus = paymentStore?.checkStatus;

  const [openSubject, setOpenSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectYears, setSubjectYears] = useState({});
  const [error, setError] = useState(null);
  const [previousExam, setPreviousExam] = useState(selectedExam);

  // ✅ Fetch subscriptions when component mounts
  useEffect(() => {
    if (accessToken && checkStatus && typeof checkStatus === 'function') {
      checkStatus();
    }
  }, [accessToken, checkStatus]);

  // ✅ AUTO-CLEAR: Detect exam change and clear selections
  useEffect(() => {
    if (previousExam && selectedExam && previousExam !== selectedExam) {
      const hasSelections = Object.keys(selectedTopics).length > 0;
      
      if (hasSelections) {
        console.log(`🧹 Exam changed from ${previousExam} to ${selectedExam} - clearing selections`);
        
        onClearSelections();
        setSubjectYears({});
        localStorage.removeItem('studySelections');
        
        toast({
          title: "Selections Cleared",
          description: `Switched to ${selectedExam}. Previous selections cleared.`,
        });
      }
    }
    
    setPreviousExam(selectedExam);
  }, [selectedExam, previousExam, selectedTopics, onClearSelections, toast]);

  // ✅ AUTO-CLEAR: When user unselects all topics from a subject
  useEffect(() => {
    Object.keys(selectedTopics).forEach((subjectId) => {
      const topics = selectedTopics[subjectId];
      
      if (Array.isArray(topics) && topics.length === 0) {
        console.log(`🧹 Auto-clearing subject ${subjectId} - no topics selected`);
        
        setSubjectYears(prev => {
          const updated = { ...prev };
          delete updated[subjectId];
          return updated;
        });
        
        toggleTopic(subjectId, 'CLEAR_SUBJECT');
        
        const stored = localStorage.getItem('studySelections');
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (parsed.topics && parsed.topics[subjectId]) {
              delete parsed.topics[subjectId];
              
              if (Object.keys(parsed.topics || {}).length === 0) {
                localStorage.removeItem('studySelections');
                console.log('🗑️ Cleared entire studySelections - no topics left');
              } else {
                localStorage.setItem('studySelections', JSON.stringify(parsed));
                console.log('💾 Updated studySelections in localStorage');
              }
            }
          } catch (err) {
            console.error('Error updating localStorage:', err);
          }
        }
      }
    });
  }, [selectedTopics, toggleTopic]);

  // Fetch topics and filter by selected exam
  useEffect(() => {
    if (!accessToken || !selectedExam) return;

    const fetchSubjectsAndTopics = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("➡️ Fetching topics for", selectedExam);

        const response = await fetch(`${API_BASE}/users/my-topics`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch topics");
        }

        const data = await response.json();
        console.log("📥 Fetched topics data:", data);

        const examKey = selectedExam.toUpperCase();
        console.log(`🔍 Filtering for exam: ${examKey}`);

        const subjectsWithTopics = data.data
          .filter((subject) => subject.category === examKey)
          .map((subject) => {
            console.log(`📚 ${subject.subjectName} (${subject.category})`);
            console.log(`  - Topics:`, subject.topics?.length || 0);

            const allTopics = subject.topics || [];

            console.log(`✅ ${subject.subjectName}: ${allTopics.length} topics`);

            return {
              id: subject.subjectId,
              subjectId: subject.subjectId,
              subjectName: subject.subjectName,
              icon: subject.icon,
              color: subject.color,
              allTopics: allTopics,
            };
          });

        setSubjects(subjectsWithTopics);
        console.log("✅ Loaded subjects:", subjectsWithTopics.length);
      } catch (err) {
        console.error("❌ Error loading topics:", err);
        setError("Unable to load subjects and topics");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsAndTopics();
  }, [accessToken, selectedExam]);

  const handleYearChange = (subjectId, year) => {
    setSubjectYears((prev) => ({ ...prev, [subjectId]: year }));
    setTopicYear(subjectId, year);
    console.log(`📌 Selected year for subject ${subjectId}:`, year);
  };

  // ✅ Helper: Check if user owns this subject (UI only)
  const userOwnsSubject = (subjectId) => {
    if (!activeSubscriptions || activeSubscriptions.length === 0) return false;
    
    return activeSubscriptions.some(sub => 
      (sub.subjectId === subjectId || sub.id === subjectId || sub._id === subjectId) &&
      sub.category === selectedExam?.toUpperCase()
    );
  };

  if (!selectedExam) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          Please select an exam first.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
        <p className="text-gray-700 dark:text-gray-300">
          Loading subjects and topics...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-3">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!subjects.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">
          No subjects available for {selectedExam}.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 relative overflow-y-auto max-h-[800px] p-2">
      {subjects.map((subject) => {
        const isOpen = openSubject === subject.subjectId;
        const allTopics = subject.allTopics || [];
        
        // ✅ Count selected topics for this subject
        const selectedCount = selectedTopics[subject.subjectId]?.length || 0;
        const hasSelections = selectedCount > 0;

        // ✅ Check if user owns this subject (for UI badge only)
        const isPremium = userOwnsSubject(subject.subjectId);

        // Extract available years from topics
        const availableYearsSet = new Set();
        allTopics.forEach((topic) => {
          if (topic.availableYears && Array.isArray(topic.availableYears)) {
            topic.availableYears.forEach((year) => availableYearsSet.add(year));
          }
        });
        const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);

        const selectedYear = subjectYears[subject.subjectId] || "";

        return (
          <div
            key={subject.subjectId}
            className={`relative border rounded-xl p-4 shadow-sm transition 
              ${
                hasSelections
                  ? "bg-indigo-50 dark:bg-primary-hover border-primary-hover dark:border-blue-700"
                  : isPremium
                  ? "bg-blue-50 dark:bg-green-900/20 border-blue-100 dark:border-blue-100"
                  : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              } 
              hover:bg-slate-50 dark:hover:bg-gray-700`}
            onMouseEnter={() => setOpenSubject(subject.subjectId)}
            onMouseLeave={() => setOpenSubject(null)}
          >
            {/* SUBJECT TITLE + YEAR DROPDOWN */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Subject Name */}
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {subject.subjectName}
                    </div>
                    
                    {/* Exam Badge */}
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                      {selectedExam}
                    </span>

                    {/* Free Trial shown next to the topics available below */}

                    {/* ✅ Selected Count Badge */}
                    {hasSelections && (
                      <span className="text-xs bg-primary-hovern dark:bg-transparent text-white px-1 py-0.5 rounded-full font-bold animate-pulse">
                        {selectedCount} selected
                      </span>
                    )}
                  </div>
                  
                  {/* Topic Count */}
                  <div className="text-xs text-gray-500 dark:text-white mt-1">
                    {allTopics.length} topics available
                    {hasSelections && (
                      <span className="text-primary dark:text-white font-semibold ml-2">
                        • {selectedCount} topic{selectedCount !== 1 ? 's' : ''} selected
                      </span>
                    )}
                    {!isPremium && (
                      <span className="text-blue-700 dark:text-blue-400 font-semibold ml-2">
                        • Free Trial
                      </span>
                    )}
                    {isPremium && (
                      <span className="text-green-600 dark:text-green-400 font-semibold ml-2">
                        • Paid
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* YEAR SELECT DROPDOWN */}
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(subject.subjectId, e.target.value)}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={(e) => e.stopPropagation()}
              >
                <option value="" disabled>
                  Select Year
                </option>
                <option value="random">Random</option>
                {availableYears.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            {/* TOPIC DROPDOWN (Shows on hover) */}
            {isOpen && (
              <div className="absolute left-0 top-[70px] mt-2 w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
                {allTopics.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                    {allTopics.map((topic) => {
                      const isSelected =
                        selectedTopics[subject.subjectId]?.includes(topic.topicId) || false;

                      return (
                        <button
                          key={topic.topicId}
                          onClick={() => toggleTopic(subject.subjectId, topic.topicId)}
                          className={`relative text-center px-2 py-2.5 rounded-lg text-xs font-medium transition-all border
                            ${
                              isSelected
                                ? "bg-gradient-to-br from-primary to-indigo-700 text-white shadow-lg border-indigo-800 transform scale-105"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700 hover:scale-105"
                            }`}
                          title={`${topic.questionCount || 0} questions • ${topic.description || 'No description'}`}
                        >
                          {/* ✅ Checkmark icon for selected topics */}
                          {isSelected && (
                            <div className="absolute -top-1 -right-1 bg-white rounded-full p-0.5">
                              <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                          
                          <div className="font-semibold truncate">
                            {topic.topicName}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-4">
                    No topics available for this subject.
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}