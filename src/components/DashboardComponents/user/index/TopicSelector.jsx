
// src/components/ExamSelector/TopicSelector.jsx
import React, { useState } from "react";
import { YEARS } from "./data";

export default function TopicSelector({
  selectedExam,
  subjectData,
  topicData,
  openTopicSubject,
  setOpenTopicSubject,
  topicYearFilter,
  selectedTopics,
  setTopicYear,
  toggleTopic,
  clearTopics,
}) {
  const subjects = subjectData?.[selectedExam] || [];
  const [warning, setWarning] = useState({ message: "", show: false });

  const hasSelectedTopics = Object.values(selectedTopics).some(
    (arr) => Array.isArray(arr) && arr.length > 0
  );

  const handleHoverLocked = () => {
    if (hasSelectedTopics) {
      setWarning({ message: "You can only select topics from one subject.", show: true });
      setTimeout(() => setWarning({ message: "", show: false }), 3000);
    }
  };

  const handleTopicClick = (subject, topic) => {
    const isCurrentSubjectSelected =
      selectedTopics[subject]?.length > 0 || !hasSelectedTopics;

    if (!isCurrentSubjectSelected) {
      setWarning({ message: "You can only select topics from one subject.", show: true });
      setTimeout(() => setWarning({ message: "", show: false }), 3000);
      return;
    }

    toggleTopic(subject, topic);
  };

  const handleClearSelection = () => {
    if (clearTopics) clearTopics();
    setWarning({ message: "", show: false });
  };

  return (
    <div className="max-h-[460px] overflow-y-auto space-y-4 relative">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Select topics by clicking on them — only one subject can have selected topics at a time.
      </p>

      {/* Popup Warning */}
      {warning.show && (
        <div className="fixed w-[400px] top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn scale-100 transition-transform duration-300">
            <span>{warning.message}</span>
            <button
              onClick={handleClearSelection}
              className="underline text-xs text-red-800 dark:text-red-200 hover:text-red-600 dark:hover:text-red-100"
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {subjects.map((subject) => {
        const isOpen = openTopicSubject === subject;
        const isLocked = hasSelectedTopics && !selectedTopics[subject];
        const isSelectedSubject = selectedTopics[subject]?.length > 0;

        return (
          <div
            key={subject}
            className={`relative border rounded-xl p-3 transition-all duration-200 
              ${isSelectedSubject ? "bg-indigo-100 dark:bg-indigo-800 shadow-lg" : ""}
              ${isOpen && !isSelectedSubject ? "bg-indigo-50 dark:bg-gray-700 shadow-md" : ""}
              ${!isOpen && !isSelectedSubject ? "bg-white dark:bg-gray-900 hover:shadow-md" : ""}
              ${isLocked ? "opacity-50 pointer-events-auto" : ""}
            `}
            onMouseEnter={() => (isLocked ? handleHoverLocked() : setOpenTopicSubject(subject))}
            onMouseLeave={() => !isLocked && setOpenTopicSubject(null)}
          >
            {/* Subject header */}
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-800 dark:text-gray-100">{subject}</div>

              <select
                value={topicYearFilter[subject] || ""}
                onChange={(e) => setTopicYear(subject, e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
                disabled={isLocked}
              >
                <option value="">Year (All)</option>
                <option value="random">Random</option>
                {YEARS.map((y) => (
                  <option key={y} value={String(y)}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Floating topic grid */}
            {isOpen && (
              <div
                className="absolute left-0 top-12 w-full z-40 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-xl p-4 mt-2 animate-fadeIn transition-all duration-300"
                style={{
                  boxShadow: "0 10px 25px rgba(0,0,0,0.1), 0 6px 10px rgba(0,0,0,0.05)",
                }}
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto">
                  {(topicData?.[subject] || []).map((topic) => {
                    const isSelected = selectedTopics[subject]?.includes(topic) || false;

                    return (
                      <button
                        key={topic}
                        onClick={() => handleTopicClick(subject, topic)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                          ${isSelected
                            ? "bg-indigo-600 text-white shadow-md"
                            : "bg-indigo-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-600"
                          }`}
                      >
                        {topic}
                      </button>
                    );
                  })}

                  {(!topicData[subject] || topicData[subject].length === 0) && (
                    <div className="col-span-2 text-xs text-gray-500 text-center">
                      No topics defined for this subject.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
