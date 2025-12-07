// import React, { useState, useEffect } from "react";
// import useAuthStore from "../../../store/authStore";

// export default function TopicSelector({
//   selectedTopics = {},    // Default to empty object
//   toggleTopic = () => {}, // Default no-op
// }) {
//   const { accessToken } = useAuthStore();
//   const [openSubject, setOpenSubject] = useState(null);
//   const [allTopics, setAllTopics] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Fetch all topics once
//   useEffect(() => {
//     if (!accessToken) return;

//     const fetchAllTopics = async () => {
//       setLoading(true);
//       try {
//         const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/topics`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });
//         const json = await res.json();
//         setAllTopics(json.data || []); // Save all topics
//       } catch (err) {
//         console.error("Failed to fetch topics:", err);
//         setAllTopics([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllTopics();
//   }, [accessToken]);

//   // Extract unique subjects from topics
//   const subjects = Array.from(
//     new Map(allTopics.map(t => [t.module.subject.id, t.module.subject])).values()
//   );

//   if (loading) return <p>Loading subjects and topics...</p>;
//   if (!subjects.length) return <p>No subjects available.</p>;

//   return (
//     <div className="space-y-4 relative">
//       {subjects.map((subject) => {
//         const isOpen = openSubject === subject.id;
//         const topics = allTopics.filter(t => t.module.subject.id === subject.id);

//         return (
//           <div
//             key={subject.id}
//             className="relative border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm transition"
//             onMouseEnter={() => setOpenSubject(subject.id)}
//             onMouseLeave={() => setOpenSubject(null)}
//           >
//             <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//               {subject.subjectName}
//             </div>

//             {isOpen && (
//               <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-900 border rounded-xl shadow-lg p-3 z-50">
//                 {topics.length > 0 ? (
//                   <div className="max-h-64 overflow-y-auto flex flex-wrap gap-2 p-1">
//                     {topics.map((topic) => {
//                       const isSelected = selectedTopics[subject.id]?.includes(topic.id) || false;
//                       return (
//                         <button
//                           key={topic.id}
//                           onClick={() => toggleTopic(subject.id, topic.id)}
//                           className={`flex-1 min-w-[180px] text-center px-3 py-2 rounded-lg text-sm font-medium transition-all
//                             ${
//                               isSelected
//                                 ? "bg-indigo-600 text-white shadow-md"
//                                 : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700"
//                             }`}
//                         >
//                           {topic.topicName}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center text-gray-500 py-2">No topics available.</div>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }



import React, { useState, useEffect } from "react";
import useAuthStore from "../../../store/authStore";

export default function TopicSelector({
  selectedTopics = {},    // Default to empty object
  toggleTopic = () => {}, // Default no-op
}) {
  const { accessToken } = useAuthStore();
  const [openSubject, setOpenSubject] = useState(null);
  const [allTopics, setAllTopics] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all topics once
  useEffect(() => {
    if (!accessToken) return;

    const fetchAllTopics = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/topics`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        const json = await res.json();
        setAllTopics(json.data || []); // Save all topics
      } catch (err) {
        console.error("Failed to fetch topics:", err);
        setAllTopics([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllTopics();
  }, [accessToken]);

  // Extract unique subjects from topics
  const subjects = Array.from(
    new Map(allTopics.map(t => [t.module.subject.id, t.module.subject])).values()
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
        <p className="text-gray-700 dark:text-gray-300">Loading subjects and topics...</p>
      </div>
    );
  }
  

  if (!subjects.length) return <p>No subjects available.</p>;

  return (
    <div className="space-y-4 relative overflow-y-auto">
      {subjects.map((subject) => {
        const isOpen = openSubject === subject.id;
        const topics = allTopics.filter(t => t.module.subject.id === subject.id);

        return (
          <div
            key={subject.id}
            className="relative border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm transition hover:bg-slate-400"
            onMouseEnter={() => setOpenSubject(subject.id)}
            onMouseLeave={() => setOpenSubject(null)}
          >
            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              {subject.subjectName}
            </div>

            {isOpen && (
              <div className="absolute left-0 top-18 mt-4 w-full bg-white dark:bg-gray-900 border rounded-xl shadow-lg p-3 z-50">
                {topics.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
                    {topics.map((topic) => {
                      const isSelected = selectedTopics[subject.id]?.includes(topic.id) || false;
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
                  <div className="text-center text-gray-500 py-2">No topics available.</div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

