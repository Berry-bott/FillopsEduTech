// // src/components/ExamSelector/TopicSelector.jsx
// import React, { useState } from "react";

// export default function TopicSelector({
//   selectedExam,
//   subjectData,
//   topicData,
//   topicYears,
//   openTopicSubject,
//   setOpenTopicSubject,
//   topicYearFilter,
//   selectedTopics,
//   setTopicYear,
//   toggleTopic,
//   fetchTopicsForSubject,
// }) {
//   const subjects = subjectData || []; // ✅ corrected
//   const [warning, setWarning] = useState({ message: "", show: false });

//   const hasSelectedTopics = Object.values(selectedTopics).some(
//     (arr) => Array.isArray(arr) && arr.length > 0
//   );

//   const handleHoverLocked = () => {
//     if (hasSelectedTopics) {
//       setWarning({
//         message: "You can only select topics from one subject.",
//         show: true,
//       });
//       setTimeout(() => setWarning({ message: "", show: false }), 3000);
//     }
//   };

//   const handleTopicClick = (subjectId, topicId) => {
//     const isCurrentSubjectSelected =
//       selectedTopics[subjectId]?.length > 0 || !hasSelectedTopics;

//     if (!isCurrentSubjectSelected) {
//       setWarning({
//         message: "You can only select topics from one subject.",
//         show: true,
//       });
//       setTimeout(() => setWarning({ message: "", show: false }), 3000);
//       return;
//     }

//     toggleTopic(subjectId, topicId);
//   };

//   return (
//     <div className="max-h-[460px] overflow-y-auto space-y-4 relative">
//       <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
//         Select topics by clicking on them — only one subject can have selected
//         topics at a time.
//       </p>

//       {/* Warning */}
//       {warning.show && (
//         <div className="fixed w-[400px] top-20 left-1/2 transform -translate-x-1/2 z-50">
//           <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn scale-100 transition-transform duration-300">
//             <span>{warning.message}</span>
//           </div>
//         </div>
//       )}

//       {subjects.map((subject) => {
//         const isOpen = openTopicSubject === subject.id;
//         const isLocked = hasSelectedTopics && !selectedTopics[subject.id];
//         const topics = topicData[subject.id] || [];

//         return (
//           <div
//             key={subject.id}
//             className={`relative border rounded-xl p-3 transition-all duration-200 
//               ${isOpen ? "bg-indigo-50 dark:bg-gray-700 shadow-md" : ""}
//               ${isLocked ? "opacity-50 pointer-events-auto" : ""}
//             `}
//             onMouseEnter={() => {
//               if (isLocked) {
//                 handleHoverLocked();
//               } else {
//                 setOpenTopicSubject(subject.id);
//                 // ✅ fetch topics if not already loaded
//                 if (!topicData[subject.id] || topicData[subject.id].length === 0) {
//                   fetchTopicsForSubject(subject.id);
//                 }
//               }
//             }}
//             onMouseLeave={() => !isLocked && setOpenTopicSubject(null)}
//           >
//             {/* Subject header */}
//             <div className="flex items-center justify-between">
//               <div className="font-medium text-gray-800 dark:text-gray-100">
//                 {subject.name}
//               </div>

//               <select
//                 value={topicYearFilter[subject.id] || ""}
//                 onChange={(e) => setTopicYear(subject.id, null, e.target.value)}
//                 className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
//                 disabled={isLocked}
//               >
//                 <option value="">Year (All)</option>
//                 <option value="random">Random</option>
//                 {topics.length > 0 &&
//                   topics.map((t) =>
//                     topicYears[t.id]?.map((y) => (
//                       <option key={`${t.id}-${y}`} value={y}>
//                         {y}
//                       </option>
//                     ))
//                   )}
//               </select>
//             </div>

//             {/* Topics grid */}
//             {isOpen && (
//               <div className="absolute left-0 top-12 w-full z-40 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-xl p-4 mt-2 animate-fadeIn transition-all duration-300">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto">
//                   {topics.length > 0 ? (
//                     topics.map((topic) => {
//                       const isSelected =
//                         selectedTopics[subject.id]?.includes(topic.id) || false;
//                       return (
//                         <button
//                           key={topic.id}
//                           onClick={() =>
//                             handleTopicClick(subject.id, topic.id)
//                           }
//                           className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
//                             ${isSelected
//                               ? "bg-indigo-600 text-white shadow-md"
//                               : "bg-indigo-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-600"
//                             }`}
//                         >
//                           {topic.name}
//                         </button>
//                       );
//                     })
//                   ) : (
//                     <div className="col-span-2 text-xs text-gray-500 text-center">
//                       Loading topics...
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// // src/components/ExamSelector/TopicSelector.jsx
// import React, { useState } from "react";

// export default function TopicSelector({
//   selectedExam,
//   // subjectData,     
//   topicData,
//   topicYears,
//   openTopicSubject,
//   setOpenTopicSubject,
//   topicYearFilter,
//   selectedTopics,
//   setTopicYear,
//   toggleTopic,
//   fetchTopicsForSubject,
// }) {
//   console.log("Subjects Data:", topicData);


//   // ✅ FIXED — always an array
//   // const subjects = subjectData?.data || [];
//   const topics = topicData?.data || [];
//   console.log(topics);
//   // console.log(subjects);
  

//   const [warning, setWarning] = useState({ message: "", show: false });

//   const hasSelectedTopics = Object.values(selectedTopics).some(
//     (arr) => Array.isArray(arr) && arr.length > 0
//   );

//   const handleHoverLocked = () => {
//     if (hasSelectedTopics) {
//       setWarning({
//         message: "You can only select topics from one subject.",
//         show: true,
//       });
//       setTimeout(() => setWarning({ message: "", show: false }), 3000);
//     }
//   };

//   const handleTopicClick = (subjectId, topicId) => {
//     const isCurrentSubjectSelected =
//       selectedTopics[subjectId]?.length > 0 || !hasSelectedTopics;

//     if (!isCurrentSubjectSelected) {
//       setWarning({
//         message: "You can only select topics from one subject.",
//         show: true,
//       });
//       setTimeout(() => setWarning({ message: "", show: false }), 3000);
//       return;
//     }

//     toggleTopic(subjectId, topicId);
//   };

//   return (
//     <div className="max-h-[460px] overflow-y-auto space-y-4 relative">
//       <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
//         Select topics by clicking on them — only one subject can have selected topics at a time.
//       </p>

//       {/* Warning */}
//       {warning.show && (
//         <div className="fixed w-[400px] top-20 left-1/2 transform -translate-x-1/2 z-50">
//           <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn scale-100 transition-transform duration-300">
//             <span>{warning.message}</span>
//           </div>
//         </div>
//       )}

//       {subjects.length === 0 && (
//         <p className="text-center text-gray-500 dark:text-gray-400">No subjects available.</p>
//       )}

//       {subjects.map((subject) => {
//         const isOpen = openTopicSubject === subject.id;
//         const isLocked = hasSelectedTopics && !selectedTopics[subject.id];
//         const topics = topicData[subject.id] || [];

//         return (
//           <div
//             key={subject.id}
//             className={`relative border rounded-xl p-3 transition-all duration-200 
//               ${isOpen ? "bg-indigo-50 dark:bg-gray-700 shadow-md" : ""}
//               ${isLocked ? "opacity-50 pointer-events-auto" : ""}
//             `}
//             onMouseEnter={() => {
//               if (isLocked) {
//                 handleHoverLocked();
//               } else {
//                 setOpenTopicSubject(subject.id);

//                 // Fetch topics only if not already fetched
//                 if (!topicData[subject.id] || topicData[subject.id].length === 0) {
//                   fetchTopicsForSubject(subject.id);
//                 }
//               }
//             }}
//             onMouseLeave={() => !isLocked && setOpenTopicSubject(null)}
//           >
//             {/* Subject header */}
//             <div className="flex items-center justify-between">
//               <div className="font-medium text-gray-800 dark:text-gray-100">
//                 {subject.subjectName} 
//               </div>

//               <select
//                 value={topicYearFilter[subject.id] || ""}
//                 onChange={(e) => setTopicYear(subject.id, null, e.target.value)}
//                 className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
//                 disabled={isLocked}
//               >
//                 <option value="">Year (All)</option>
//                 <option value="random">Random</option>

//                 {/* List all years from all topics */}
//                 {topics.length > 0 &&
//                   topics.map((t) =>
//                     topicYears[t.id]?.map((y) => (
//                       <option key={`${t.id}-${y}`} value={y}>
//                         {y}
//                       </option>
//                     ))
//                   )}
//               </select>
//             </div>

//             {/* Topics grid */}
//             {isOpen && (
//               <div className="absolute left-0 top-12 w-full z-40 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-xl p-4 mt-2 animate-fadeIn transition-all duration-300">
//                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto">
//                   {topics.length > 0 ? (
//                     topics.map((topic) => {
//                       const isSelected =
//                         selectedTopics[subject.id]?.includes(topic.id) || false;

//                       return (
//                         <button
//                           key={topic.id}
//                           onClick={() => handleTopicClick(subject.id, topic.id)}
//                           className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
//                             ${
//                               isSelected
//                                 ? "bg-indigo-600 text-white shadow-md"
//                                 : "bg-indigo-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-600"
//                             }
//                           `}
//                         >
//                           {topic.name}
//                         </button>
//                       );
//                     })
//                   ) : (
//                     <div className="col-span-2 text-xs text-gray-500 text-center">
//                       Loading topics...
//                     </div>
//                   )}
//                 </div>
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }


// src/components/ExamSelector/TopicSelector.jsx
import React, { useState } from "react";

export default function TopicSelector({
  selectedExam,
  subjectData,
  topicData,
  topicYears,
  openTopicSubject,
  setOpenTopicSubject,
  topicYearFilter,
  selectedTopics,
  setTopicYear,
  toggleTopic,
  fetchTopicsForSubject,
}) {
  const subjects = subjectData?.data || [];
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

  const handleTopicClick = (subjectId, topicId) => {
    const isCurrentSubjectSelected =
      selectedTopics[subjectId]?.length > 0 || !hasSelectedTopics;

    if (!isCurrentSubjectSelected) {
      setWarning({ message: "You can only select topics from one subject.", show: true });
      setTimeout(() => setWarning({ message: "", show: false }), 3000);
      return;
    }
    toggleTopic(subjectId, topicId);
  };

  return (
    <div className="max-h-[460px] overflow-y-auto space-y-4 relative">
      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
        Select topics by clicking on them — only one subject can have selected topics at a time.
      </p>

      {warning.show && (
        <div className="fixed w-[400px] top-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 px-6 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fadeIn scale-100 transition-transform duration-300">
            <span>{warning.message}</span>
          </div>
        </div>
      )}

      {subjects.map((subject) => {
        const isOpen = openTopicSubject === subject.id;
        const isLocked = hasSelectedTopics && !selectedTopics[subject.id];
        const topics = topicData[subject.id] || [];

        return (
          <div
            key={subject.id}
            className={`relative border rounded-xl p-3 transition-all duration-200 
              ${isOpen ? "bg-indigo-50 dark:bg-gray-700 shadow-md" : ""}
              ${isLocked ? "opacity-50 pointer-events-auto" : ""}
            `}
            onMouseEnter={() => {
              if (isLocked) handleHoverLocked();
              else {
                setOpenTopicSubject(subject.id);
                if (!topicData[subject.id] || topicData[subject.id].length === 0) {
                  fetchTopicsForSubject(subject.id);
                }
              }
            }}
            onMouseLeave={() => !isLocked && setOpenTopicSubject(null)}
          >
            {/* Subject header */}
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-800 dark:text-gray-100">{subject.name}</div>

              <select
                value={topicYearFilter[subject.id] || ""}
                onChange={(e) => setTopicYear(subject.id, null, e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 transition"
                disabled={isLocked}
              >
                <option value="">Year (All)</option>
                <option value="random">Random</option>
                {topics.length > 0 &&
                  topics.map((t) =>
                    topicYears[t.id]?.map((y) => (
                      <option key={`${t.id}-${y}`} value={y}>
                        {y}
                      </option>
                    ))
                  )}
              </select>
            </div>

            {/* Topics grid */}
            {isOpen && (
              <div className="absolute left-0 top-12 w-full z-40 bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 rounded-xl shadow-xl p-4 mt-2 animate-fadeIn transition-all duration-300">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto">
                  {topics.length > 0 ? (
                    topics.map((topic) => {
                      const isSelected =
                        selectedTopics[subject.id]?.includes(topic.id) || false;
                      return (
                        <button
                          key={topic.id}
                          onClick={() => handleTopicClick(subject.id, topic.id)}
                          className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                            ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-md"
                                : "bg-indigo-50 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-gray-600"
                            }`}
                        >
                          {topic.name}
                        </button>
                      );
                    })
                  ) : (
                    <div className="col-span-2 text-xs text-gray-500 text-center">
                      Loading topics...
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
