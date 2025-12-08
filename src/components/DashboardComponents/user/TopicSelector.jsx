import React, { useState, useEffect } from "react";
import useAuthStore from "../../../store/authStore";





export default function TopicSelector({
  selectedTopics = {},
  toggleTopic = () => {},
  setTopicYear = () => {}, // now receives subjectId + year
}) {
  const { accessToken } = useAuthStore();

  const [openSubject, setOpenSubject] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Contains { subjectId: year }
  const [subjectYears, setSubjectYears] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("studySelections"));
      return saved?.subjectYears || {};
    } catch (e) {
      return {};
    }
  });

  // Fetch Topics
  useEffect(() => {
    if (!accessToken) return;

    const fetchAllTopics = async () => {
      setLoading(true);
      try {
        console.log("➡️ Fetching /api/topics ...");
        const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/topics`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });

        const json = await res.json();
        console.log("📥 /api/topics response:", json);

        setAllTopics(json.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch topics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTopics();
  }, [accessToken]);

  // Save YEAR to localStorage under subject
  const persistYear = (subjectId, year) => {
    try {
      const saved = JSON.parse(localStorage.getItem("studySelections")) || {};

      const updated = {
        ...saved,
        subjectYears: {
          ...(saved.subjectYears || {}),
          [subjectId]: year,
        },
      };

      localStorage.setItem("studySelections", JSON.stringify(updated));

      console.log("💾 Persisted subjectYears:", updated.subjectYears);
    } catch (err) {
      console.error("❌ Failed to save subjectYears", err);
    }
  };

  // Extract subjects
  const subjects = Array.from(
    new Map(allTopics.map((t) => [t.module.subject.id, t.module.subject])).values()
  );

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
        <p className="text-gray-700 dark:text-gray-300">Loading subjects and topics...</p>
      </div>
    );

  if (!subjects.length) return <p>No subjects available.</p>;

  return (
    <div className="space-y-4 relative overflow-y-auto">
      {subjects.map((subject) => {
        const isOpen = openSubject === subject.id;

        const topics = allTopics.filter(
          (t) => t.module.subject.id === subject.id
        );

        // Collect available years from ALL topics of this subject
        const availableYears = Array.from(
          new Set(
            topics
              .flatMap((t) => (t.question || []).map((q) => q.year))
              .filter(Boolean)
          )
        );

        const selectedYear = subjectYears[subject.id] || "";

        return (
          <div
            key={subject.id}
            className="relative border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm transition hover:bg-slate-400"
            onMouseEnter={() => setOpenSubject(subject.id)}
            onMouseLeave={() => setOpenSubject(null)}
          >
            {/* SUBJECT TITLE + YEAR DROPDOWN */}
            <div className="flex justify-between items-center gap-3">
              <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                {subject.subjectName}
              </div>

              {/* YEAR SELECT placed beside subject name */}
              <select
                value={selectedYear}
                onChange={(e) => {
                  const y = e.target.value;

                  setSubjectYears((prev) => ({ ...prev, [subject.id]: y }));

                  persistYear(subject.id, y);

                  // notify parent
                  setTopicYear(subject.id, y);

                  console.log(`📌 Selected year for subject ${subject.subjectName}:`, y);
                }}
                className="border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white"
              >
                <option value="" disabled>Select Year</option>
                <option value="random">Random</option>
                {availableYears.length === 0 ? (
                  <option value="random">Random</option>
                ) : (
                  availableYears.map((yr) => (
                    <option key={yr} value={yr}>
                      {yr}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* TOPIC DROPDOWN (unchanged) */}
            {isOpen && (
              <div className="absolute left-0 top-18 mt-4 w-full bg-white dark:bg-gray-900 border rounded-xl shadow-lg p-3 z-50">
                {topics.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                    {topics.map((topic) => {
                      const isSelected =
                        selectedTopics[subject.id]?.includes(topic.id) || false;

                      return (
                        <button
                          key={topic.id}
                          onClick={() => toggleTopic(subject.id, topic.id)}
                          className={`text-center px-1 py-2 rounded-lg text-sm font-medium transition-all
                            ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                        >
                          {topic.topicName}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-2">
                    No topics available.
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
