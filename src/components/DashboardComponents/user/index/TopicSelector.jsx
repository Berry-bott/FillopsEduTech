// // src/components/ExamSelector/TopicSelector.jsx
// import React from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { YEARS } from "./data";

// export default function TopicSelector({
//   selectedExam,
//   subjectData,
//   topicData,
//   openTopicSubject,
//   setOpenTopicSubject,
//   topicYearFilter,
//   selectedTopics,
//   setTopicYear,
//   toggleTopic,
// }) {
//   return (
//     <div className="mt-4 max-h-[420px] overflow-y-auto space-y-3">
//       <p className="text-sm text-gray-700">
//         Select topics (hover a subject to view topics).
//       </p>

//       {subjectData[selectedExam].map((subject) => (
//         <div
//           key={subject}
//           className="border rounded p-3 relative"
//           onMouseEnter={() => setOpenTopicSubject(subject)}
//           onMouseLeave={() => setOpenTopicSubject(null)}
//         >
//           <div className="flex items-center justify-between">
//             <div className="font-medium">{subject}</div>
//             <select
//               value={topicYearFilter[subject] || ""}
//               onChange={(e) => setTopicYear(subject, e.target.value)}
//               className="border rounded px-2 py-1 text-sm"
//             >
//               <option value="">Year (All)</option>
//               <option value="random">Random</option>
//               {YEARS.map((y) => (
//                 <option key={y} value={String(y)}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {openTopicSubject === subject && (
//             <div className="mt-2 grid grid-cols-2 gap-2">
//               {(topicData[subject] || []).map((topic) => (
//                 <label
//                   key={topic}
//                   className="flex items-center gap-2 text-sm"
//                 >
//                   <Checkbox
//                     checked={selectedTopics[subject]?.includes(topic) || false}
//                     onCheckedChange={() => toggleTopic(subject, topic)}
//                   />
//                   <span>{topic}</span>
//                 </label>
//               ))}
//               {!topicData[subject] && (
//                 <div className="text-xs text-gray-500">
//                   No topics defined for this subject.
//                 </div>
//               )}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }


// src/components/ExamSelector/TopicSelector.jsx
import React from "react";
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
}) {
  const subjects = subjectData?.[selectedExam] || [];

  return (
    <div className="mt-4 max-h-[420px] overflow-y-auto space-y-4 relative">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Select topics by clicking on them — hover a subject to view topics.
      </p>

      {subjects.map((subject) => (
        <div
          key={subject}
          className="relative border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-900 hover:shadow-md transition-all duration-200"
          onMouseEnter={() => setOpenTopicSubject(subject)}
          onMouseLeave={() => setOpenTopicSubject(null)}
        >
          {/* Subject header */}
          <div className="flex items-center justify-between">
            <div className="font-medium text-gray-800 dark:text-gray-100">
              {subject}
            </div>

            <select
              value={topicYearFilter[subject] || ""}
              onChange={(e) => setTopicYear(subject, e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500"
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
          {openTopicSubject === subject && (
            <div
              className="absolute left-0 top-full font w-full z-50 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-xl p-4 animate-fadeIn"
              style={{
                boxShadow:
                  "0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.05)",
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto">
                {(topicData?.[subject] || []).map((topic) => {
                  const isSelected =
                    selectedTopics[subject]?.includes(topic) || false;

                  return (
                    <button
                      key={topic}
                      onClick={() => toggleTopic(subject, topic)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                        ${
                          isSelected
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
      ))}
    </div>
  );
}
