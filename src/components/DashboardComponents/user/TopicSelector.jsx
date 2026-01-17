// import React, { useState, useEffect } from "react";
// import useAuthStore from "../../../store/authStore";





// export default function TopicSelector({
//   selectedTopics = {},
//   toggleTopic = () => {},
//   setTopicYear = () => {}, // now receives subjectId + year
// }) {
//   const { accessToken } = useAuthStore();

//   const [openSubject, setOpenSubject] = useState(null);
//   const [allTopics, setAllTopics] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Contains { subjectId: year }
//   const [subjectYears, setSubjectYears] = useState(() => {
//     try {
//       const saved = JSON.parse(localStorage.getItem("studySelections"));
//       return saved?.subjectYears || {};
//     } catch (e) {
//       return {};
//     }
//   });

//   // Fetch Topics
//   useEffect(() => {
//     if (!accessToken) return;

//     const fetchAllTopics = async () => {
//       setLoading(true);
//       try {
//         console.log("➡️ Fetching /api/topics ...");
//         const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/topics`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         const json = await res.json();
//         console.log("📥 /api/topics response:", json);

//         setAllTopics(json.data || []);
//       } catch (err) {
//         console.error("❌ Failed to fetch topics:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllTopics();
//   }, [accessToken]);

//   // Save YEAR to localStorage under subject
//   const persistYear = (subjectId, year) => {
//     try {
//       const saved = JSON.parse(localStorage.getItem("studySelections")) || {};

//       const updated = {
//         ...saved,
//         subjectYears: {
//           ...(saved.subjectYears || {}),
//           [subjectId]: year,
//         },
//       };

//       localStorage.setItem("studySelections", JSON.stringify(updated));

//       console.log("💾 Persisted subjectYears:", updated.subjectYears);
//     } catch (err) {
//       console.error("❌ Failed to save subjectYears", err);
//     }
//   };

//   // Extract subjects
//   const subjects = Array.from(
//     new Map(allTopics.map((t) => [t.module.subject.id, t.module.subject])).values()
//   );

//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center py-10">
//         <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
//         <p className="text-white-700 dark:text-gray-300">Loading subjects and topics...</p>
//       </div>
//     );

//   if (!subjects.length) return <p>No subjects available.</p>;

//   return (
//     <div className="space-y-4 relative overflow-y-auto">
//       {subjects.map((subject) => {
//         const isOpen = openSubject === subject.id;

//         const topics = allTopics.filter(
//           (t) => t.module.subject.id === subject.id
//         );

//         // Collect available years from ALL topics of this subject
//         const availableYears = Array.from(
//           new Set(
//             topics
//               .flatMap((t) => (t.question || []).map((q) => q.year))
//               .filter(Boolean)
//           )
//         );

//         const selectedYear = subjectYears[subject.id] || "";

//         return (
//           <div
//             key={subject.id}
//             className="relative border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm transition hover:bg-slate-400"
//             onMouseEnter={() => setOpenSubject(subject.id)}
//             onMouseLeave={() => setOpenSubject(null)}
//           >
//             {/* SUBJECT TITLE + YEAR DROPDOWN */}
//             <div className="flex justify-between items-center gap-3">
//               <div className="text-lg font-semibold text-gray-800 dark:text-primary">
//                 {subject.subjectName}
//               </div>

//               {/* YEAR SELECT placed beside subject name */}
//               <select
//                 value={selectedYear}
//                 onChange={(e) => {
//                   const y = e.target.value;

//                   setSubjectYears((prev) => ({ ...prev, [subject.id]: y }));

//                   persistYear(subject.id, y);

//                   // notify parent
//                   setTopicYear(subject.id, y);

//                   console.log(`📌 Selected year for subject ${subject.subjectName}:`, y);
//                 }}
//                 className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
//               >
//                 <option value="" disabled>Select Year</option>
//                 <option value="random">Random</option>
//                 {availableYears.length === 0 ? (
//                   <option value="random">Random</option>
//                 ) : (
//                   availableYears.map((yr) => (
//                     <option key={yr} value={yr}>
//                       {yr}
//                     </option>
//                   ))
//                 )}
//               </select>
//             </div>

//             {/* TOPIC DROPDOWN (unchanged) */}
//             {isOpen && (
//               <div className="absolute left-0 top-18 mt-4 w-full bg-white dark:bg-gray-900 border rounded-xl shadow-lg p-3 z-50">
//                 {topics.length > 0 ? (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-64 overflow-y-auto p-1">
//                     {topics.map((topic) => {
//                       const isSelected =
//                         selectedTopics[subject.id]?.includes(topic.id) || false;

//                       return (
//                         <button
//                           key={topic.id}
//                           onClick={() => toggleTopic(subject.id, topic.id)}
//                           className={`text-center px-1 py-2 rounded-lg text-sm font-medium transition-all
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
//                   <div className="text-center text-gray-500 py-2">
//                     No topics available.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }



// import React, { useState, useEffect } from "react";
// import useAuthStore from "@/store/authStore";

// export default function TopicSelector({
//   selectedTopics = {},
//   toggleTopic = () => {},
//   setTopicYear = () => {},
// }) {
//   const { accessToken } = useAuthStore();

//   const [openSubject, setOpenSubject] = useState(null);
//   const [allSubjects, setAllSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);

//   // Contains { subjectId: year }
//   const [subjectYears, setSubjectYears] = useState({});

//   // Fetch Topics from the correct endpoint
//   useEffect(() => {
//     if (!accessToken) return;

//     const fetchAllTopics = async () => {
//       setLoading(true);
//       try {
//         console.log("➡️ Fetching /api/users/my-topics ...");
//         const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/users/my-topics`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         const json = await res.json();
//         console.log("📥 /api/users/my-topics response:", json);

//         // Transform the API response into the structure we need
//         const subjects = json.data || [];
//         setAllSubjects(subjects);
        
//         console.log("✅ Loaded subjects:", subjects.length);
//       } catch (err) {
//         console.error("❌ Failed to fetch topics:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllTopics();
//   }, [accessToken]);

//   // Update year and notify parent
//   const handleYearChange = (subjectId, year) => {
//     setSubjectYears((prev) => ({ ...prev, [subjectId]: year }));
    
//     // Notify parent component
//     setTopicYear(subjectId, year);
    
//     console.log(`📌 Selected year for subject ${subjectId}:`, year);
//   };

//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center py-10">
//         <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
//         <p className="text-gray-700 dark:text-gray-300">Loading subjects and topics...</p>
//       </div>
//     );

//   if (!allSubjects.length) 
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 dark:text-gray-400">No subjects available.</p>
//       </div>
//     );

//   return (
//     <div className="space-y-4 relative overflow-y-auto max-h-[600px] p-2">
//       {allSubjects.map((subject) => {
//         const isOpen = openSubject === subject.subjectId;

//         // Get all topics from all modules for this subject
//         const allTopics = subject.modules.flatMap(module => 
//           module.topics.map(topic => ({
//             ...topic,
//             moduleId: module.moduleId,
//             moduleName: module.moduleName,
//           }))
//         );

//         // Extract available years from topics
//         const availableYearsSet = new Set();
//         allTopics.forEach(topic => {
//           if (topic.availableYears) {
//             topic.availableYears.forEach(year => availableYearsSet.add(year));
//           }
//         });
//         const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);

//         const selectedYear = subjectYears[subject.subjectId] || "";

//         return (
//           <div
//             key={subject.subjectId}
//             className="relative border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm transition hover:bg-slate-50 dark:hover:bg-gray-700"
//             onMouseEnter={() => setOpenSubject(subject.subjectId)}
//             onMouseLeave={() => setOpenSubject(null)}
//           >
//             {/* SUBJECT TITLE + YEAR DROPDOWN */}
//             <div className="flex justify-between items-center gap-3">
//               <div className="flex items-center gap-3">
//                 <span className="text-2xl">{subject.icon}</span>
//                 <div>
//                   <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                     {subject.subjectName}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {subject.totalTopics} topics available
//                   </div>
//                 </div>
//               </div>

//               {/* YEAR SELECT placed beside subject name */}
//               <select
//                 value={selectedYear}
//                 onChange={(e) => handleYearChange(subject.subjectId, e.target.value)}
//                 className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
//               >
//                 <option value="" disabled>Select Year</option>
//                 <option value="random">Random</option>
//                 {availableYears.length === 0 ? (
//                   <option value="random">Random (No specific years)</option>
//                 ) : (
//                   availableYears.map((yr) => (
//                     <option key={yr} value={yr}>
//                       {yr}
//                     </option>
//                   ))
//                 )}
//               </select>
//             </div>

//             {/* TOPIC DROPDOWN - Now organized by modules */}
//             {isOpen && (
//               <div className="absolute left-0 top-full mt-2 w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
//                 {subject.modules.length > 0 ? (
//                   <div className="space-y-4">
//                     {subject.modules.map(module => (
//                       <div key={module.moduleId} className="space-y-2">
//                         <h4 className="font-bold text-sm text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700 pb-2">
//                           📚 {module.moduleName}
//                         </h4>
//                         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                           {module.topics.map((topic) => {
//                             const isSelected =
//                               selectedTopics[subject.subjectId]?.includes(topic.topicId) || false;

//                             return (
//                               <button
//                                 key={topic.topicId}
//                                 onClick={() => toggleTopic(subject.subjectId, topic.topicId)}
//                                 className={`text-center px-2 py-2.5 rounded-lg text-xs font-medium transition-all border
//                                   ${
//                                     isSelected
//                                       ? "bg-indigo-600 text-white shadow-md border-indigo-700"
//                                       : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
//                                   }`}
//                                 title={`${topic.questionCount} questions`}
//                               >
//                                 <div className="font-semibold">{topic.topicName}</div>
//                                 <div className="text-xs opacity-75 mt-1">
//                                   {topic.questionCount} Qs
//                                 </div>
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center text-gray-500 py-4">
//                     No topics available for this subject.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}

//       {/* Debug Info */}
//       <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
//         <p className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-2">
//           📊 Debug Info:
//         </p>
//         <div className="text-xs text-blue-800 dark:text-blue-300 space-y-1">
//           <p>Total subjects: <strong>{allSubjects.length}</strong></p>
//           {allSubjects.map(s => {
//             const totalTopics = s.modules.reduce((sum, m) => sum + m.topics.length, 0);
//             return (
//               <p key={s.subjectId}>
//                 {s.subjectName}: <strong>{totalTopics} topics</strong> across {s.modules.length} modules
//               </p>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }





// import React, { useState, useEffect } from "react";
// import useAuthStore from "@/store/authStore";

// export default function TopicSelector({
//   selectedTopics = {},
//   toggleTopic = () => {},
//   setTopicYear = () => {},
// }) {
//   const { accessToken } = useAuthStore();

//   const [openSubject, setOpenSubject] = useState(null);
//   const [allSubjects, setAllSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [subjectYears, setSubjectYears] = useState({});

//   // Fetch Topics and deduplicate subjects
//   useEffect(() => {
//     if (!accessToken) return;

//     const fetchAllTopics = async () => {
//       setLoading(true);
//       try {
//         console.log("➡️ Fetching /api/users/my-topics ...");
//         const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/users/my-topics`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         const json = await res.json();
//         console.log("📥 /api/users/my-topics response:", json);

//         const subjects = json.data || [];

//         // Deduplicate subjects by name and collect all unique topics
//         const subjectMap = new Map();
        
//         subjects.forEach(subject => {
//           const subjectKey = subject.subjectName;
          
//           if (subjectMap.has(subjectKey)) {
//             // Subject already exists, add topics
//             const existing = subjectMap.get(subjectKey);
            
//             // Collect all topics from all modules
//             subject.modules.forEach(module => {
//               module.topics.forEach(topic => {
//                 // Use topicName as key to avoid duplicates
//                 const topicKey = topic.topicName;
//                 if (!existing.topicsMap.has(topicKey)) {
//                   existing.topicsMap.set(topicKey, topic);
//                 }
//               });
//             });
//           } else {
//             // New subject, create topics map
//             const topicsMap = new Map();
//             subject.modules.forEach(module => {
//               module.topics.forEach(topic => {
//                 topicsMap.set(topic.topicName, topic);
//               });
//             });
            
//             subjectMap.set(subjectKey, {
//               ...subject,
//               topicsMap,
//             });
//           }
//         });

//         // Convert topicsMap to array for each subject
//         const deduplicatedSubjects = Array.from(subjectMap.values()).map(subject => ({
//           ...subject,
//           allTopics: Array.from(subject.topicsMap.values()),
//         }));
        
//         setAllSubjects(deduplicatedSubjects);
        
//         console.log("✅ Loaded subjects:", deduplicatedSubjects.length);
//         console.log("📋 Subjects:", deduplicatedSubjects.map(s => s.subjectName));
//       } catch (err) {
//         console.error("❌ Failed to fetch topics:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllTopics();
//   }, [accessToken]);

//   // Update year and notify parent
//   const handleYearChange = (subjectId, year) => {
//     setSubjectYears((prev) => ({ ...prev, [subjectId]: year }));
//     setTopicYear(subjectId, year);
//     console.log(`📌 Selected year for subject ${subjectId}:`, year);
//   };

//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center py-10">
//         <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
//         <p className="text-gray-700 dark:text-gray-300">Loading subjects and topics...</p>
//       </div>
//     );

//   if (!allSubjects.length) 
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 dark:text-gray-400">No subjects available.</p>
//       </div>
//     );

//   return (
//     <div className="space-y-4 relative overflow-y-auto max-h-[600px] p-2">
//       {allSubjects.map((subject) => {
//         const isOpen = openSubject === subject.subjectId;

//         // Use the deduplicated topics
//         const allTopics = subject.allTopics || [];

//         // Extract available years from topics
//         const availableYearsSet = new Set();
//         allTopics.forEach(topic => {
//           if (topic.availableYears) {
//             topic.availableYears.forEach(year => availableYearsSet.add(year));
//           }
//         });
//         const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);

//         const selectedYear = subjectYears[subject.subjectId] || "";

//         return (
//           <div
//             key={subject.subjectId}
//             className="relative border rounded-xl p-4 bg-white dark:bg-gray-800 shadow-sm transition hover:bg-slate-50 dark:hover:bg-gray-700"
//             onMouseEnter={() => setOpenSubject(subject.subjectId)}
//             onMouseLeave={() => setOpenSubject(null)}
//           >
//             {/* SUBJECT TITLE + YEAR DROPDOWN */}
//             <div className="flex justify-between items-center gap-3">
//               <div className="flex items-center gap-3">
//                 <span className="text-2xl">{subject.icon}</span>
//                 <div>
//                   <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                     {subject.subjectName}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {allTopics.length} topics available
//                   </div>
//                 </div>
//               </div>

//               {/* YEAR SELECT */}
//               <select
//                 value={selectedYear}
//                 onChange={(e) => handleYearChange(subject.subjectId, e.target.value)}
//                 className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
//               >
//                 <option value="" disabled>Select Year</option>
//                 <option value="random">Random</option>
//                 {availableYears.map((yr) => (
//                   <option key={yr} value={yr}>
//                     {yr}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* TOPIC DROPDOWN - No modules, just topics */}
//             {isOpen && (
//               <div className="absolute left-0 top-[70px] mt-2 w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
//                 {allTopics.length > 0 ? (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                     {allTopics.map((topic) => {
//                       const isSelected =
//                         selectedTopics[subject.subjectId]?.includes(topic.topicId) || false;

//                       return (
//                         <button
//                           key={topic.topicId}
//                           onClick={() => toggleTopic(subject.subjectId, topic.topicId)}
//                           className={`text-center px-2 py-2.5 rounded-lg text-xs font-medium transition-all border
//                             ${
//                               isSelected
//                                 ? "bg-indigo-600 text-white shadow-md border-indigo-700"
//                                 : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
//                             }`}
//                           title={`${topic.questionCount} questions`}
//                         >
//                           <div className="font-semibold">{topic.topicName}</div>
                          
//                         </button>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center text-gray-500 py-4">
//                     No topics available for this subject.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }








// import React, { useState, useEffect } from "react";
// import useAuthStore from "@/store/authStore";
// import { Lock, Check } from "lucide-react";

// export default function TopicSelector({
//   selectedTopics = {},
//   toggleTopic = () => {},
//   setTopicYear = () => {},
// }) {
//   const { accessToken } = useAuthStore();

//   const [openSubject, setOpenSubject] = useState(null);
//   const [allSubjects, setAllSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [subjectYears, setSubjectYears] = useState({});
//   const [paidSubjects, setPaidSubjects] = useState([]); // NEW: Track paid subjects

//   // NEW: Fetch user's paid subjects
//   useEffect(() => {
//     if (!accessToken) return;

//     const fetchPaidSubjects = async () => {
//       try {
//         console.log("💰 Fetching paid subjects...");
//         const res = await fetch(
//           "https://fillops-server-5fuf.onrender.com/api/users/my-subjects",
//           {
//             headers: { Authorization: `Bearer ${accessToken}` },
//           }
//         );

//         const json = await res.json();
//         const subjects = json.data?.subjects || [];
//         setPaidSubjects(subjects);
//         console.log("✅ Paid subjects loaded:", subjects.length);
//       } catch (err) {
//         console.error("❌ Failed to fetch paid subjects:", err);
//       }
//     };

//     fetchPaidSubjects();
//   }, [accessToken]);

//   // Fetch Topics and deduplicate subjects
//   useEffect(() => {
//     if (!accessToken) return;

//     const fetchAllTopics = async () => {
//       setLoading(true);
//       try {
//         console.log("➡️ Fetching /api/users/my-topics ...");
//         const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/users/my-topics`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         });

//         const json = await res.json();
//         console.log("📥 /api/users/my-topics response:", json);

//         const subjects = json.data || [];

//         // Deduplicate subjects by name and collect all unique topics
//         const subjectMap = new Map();
        
//         subjects.forEach(subject => {
//           const subjectKey = subject.subjectName;
          
//           if (subjectMap.has(subjectKey)) {
//             // Subject already exists, add topics
//             const existing = subjectMap.get(subjectKey);
            
//             // Collect all topics from all modules
//             subject.modules.forEach(module => {
//               module.topics.forEach(topic => {
//                 // Use topicName as key to avoid duplicates
//                 const topicKey = topic.topicName;
//                 if (!existing.topicsMap.has(topicKey)) {
//                   existing.topicsMap.set(topicKey, topic);
//                 }
//               });
//             });
//           } else {
//             // New subject, create topics map
//             const topicsMap = new Map();
//             subject.modules.forEach(module => {
//               module.topics.forEach(topic => {
//                 topicsMap.set(topic.topicName, topic);
//               });
//             });
            
//             subjectMap.set(subjectKey, {
//               ...subject,
//               topicsMap,
//             });
//           }
//         });

//         // Convert topicsMap to array for each subject
//         const deduplicatedSubjects = Array.from(subjectMap.values()).map(subject => ({
//           ...subject,
//           allTopics: Array.from(subject.topicsMap.values()),
//         }));
        
//         setAllSubjects(deduplicatedSubjects);
        
//         console.log("✅ Loaded subjects:", deduplicatedSubjects.length);
//         console.log("📋 Subjects:", deduplicatedSubjects.map(s => s.subjectName));
//       } catch (err) {
//         console.error("❌ Failed to fetch topics:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllTopics();
//   }, [accessToken]);

//   // NEW: Check if subject is paid for
//   const isSubjectPaid = (subjectId) => {
//     return paidSubjects.some(
//       (subject) =>
//         subject.id === subjectId ||
//         subject._id === subjectId ||
//         subject.subjectId === subjectId
//     );
//   };

//   // Update year and notify parent
//   const handleYearChange = (subjectId, year) => {
//     setSubjectYears((prev) => ({ ...prev, [subjectId]: year }));
//     setTopicYear(subjectId, year);
//     console.log(`📌 Selected year for subject ${subjectId}:`, year);
//   };

//   if (loading)
//     return (
//       <div className="flex flex-col items-center justify-center py-10">
//         <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
//         <p className="text-gray-700 dark:text-gray-300">Loading subjects and topics...</p>
//       </div>
//     );

//   if (!allSubjects.length) 
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 dark:text-gray-400">No subjects available.</p>
//       </div>
//     );

//   return (
//     <div className="space-y-4 relative overflow-y-auto max-h-[600px] p-2">
//       {allSubjects.map((subject) => {
//         const isOpen = openSubject === subject.subjectId;
//         const isPaid = isSubjectPaid(subject.subjectId); // NEW: Check if paid

//         // Use the deduplicated topics
//         const allTopics = subject.allTopics || [];

//         // Extract available years from topics
//         const availableYearsSet = new Set();
//         allTopics.forEach(topic => {
//           if (topic.availableYears) {
//             topic.availableYears.forEach(year => availableYearsSet.add(year));
//           }
//         });
//         const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);

//         const selectedYear = subjectYears[subject.subjectId] || "";

//         return (
//           <div
//             key={subject.subjectId}
//             className={`relative border rounded-xl p-4 shadow-sm transition ${
//               isPaid 
//                 ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700 hover:bg-green-100 dark:hover:bg-green-900/30' 
//                 : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700'
//             }`}
//             onMouseEnter={() => setOpenSubject(subject.subjectId)}
//             onMouseLeave={() => setOpenSubject(null)}
//           >
//             {/* SUBJECT TITLE + YEAR DROPDOWN */}
//             <div className="flex justify-between items-center gap-3">
//               <div className="flex items-center gap-3 flex-1">
//                 <span className="text-2xl">{subject.icon}</span>
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                       {subject.subjectName}
//                     </div>
//                     {/* NEW: Payment status badge */}
//                     {isPaid ? (
//                       <span className="flex items-center gap-1 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-bold">
//                         <Check className="w-3 h-3" />
//                         PAID
//                       </span>
//                     ) : (
//                       <span className="flex items-center gap-1 text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full font-bold">
//                         <Lock className="w-3 h-3" />
//                         LOCKED
//                       </span>
//                     )}
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {allTopics.length} topics available
//                   </div>
//                 </div>
//               </div>

//               {/* YEAR SELECT */}
//               <select
//                 value={selectedYear}
//                 onChange={(e) => handleYearChange(subject.subjectId, e.target.value)}
//                 className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
//               >
//                 <option value="" disabled>Select Year</option>
//                 <option value="random">Random</option>
//                 {availableYears.map((yr) => (
//                   <option key={yr} value={yr}>
//                     {yr}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* TOPIC DROPDOWN - No modules, just topics */}
//             {isOpen && (
//               <div className="absolute left-0 top-[70px] mt-2 w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
//                 {allTopics.length > 0 ? (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                     {allTopics.map((topic) => {
//                       const isSelected =
//                         selectedTopics[subject.subjectId]?.includes(topic.topicId) || false;

//                       return (
//                         <button
//                           key={topic.topicId}
//                           onClick={() => toggleTopic(subject.subjectId, topic.topicId)}
//                           className={`text-center px-2 py-2.5 rounded-lg text-xs font-medium transition-all border
//                             ${
//                               isSelected
//                                 ? "bg-indigo-600 text-white shadow-md border-indigo-700"
//                                 : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
//                             }`}
//                           title={`${topic.questionCount} questions`}
//                         >
//                           <div className="font-semibold">{topic.topicName}</div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center text-gray-500 py-4">
//                     No topics available for this subject.
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         );
//       })}
//     </div>
//   );
// }




// import React, { useState, useEffect } from "react";
// import useAuthStore from "@/store/authStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// export default function TopicSelector({
//   selectedTopics = {},
//   toggleTopic = () => {},
//   setTopicYear = () => {},
//   selectedExam, // The selected exam category (WAEC, JAMB, etc)
// }) {
//   const { accessToken } = useAuthStore();

//   const [openSubject, setOpenSubject] = useState(null);
//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [subjectYears, setSubjectYears] = useState({});
//   const [error, setError] = useState(null);

//   // Fetch subjects filtered by selected exam
//   // useEffect(() => {
//   //   if (!accessToken || !selectedExam) return;

//   //   const fetchSubjects = async () => {
//   //     setLoading(true);
//   //     setError(null);

//   //     try {
//   //       console.log("➡️ Fetching subjects for", selectedExam);

//   //       // Use /my-subjects endpoint which returns subjects grouped by category
//   //       const res = await fetch(`${API_BASE}/users/my-subjects`, {
//   //         headers: { Authorization: `Bearer ${accessToken}` },
//   //       });

//   //       if (!res.ok) throw new Error("Failed to fetch subjects");

//   //       const data = await res.json();
//   //       console.log("📥 Fetched data:", data);

//   //       // Get subjects for the selected exam
//   //       const subjectsByCategory = data.data?.subjectsByCategory || {};
//   //       const examKey = selectedExam.toUpperCase();
//   //       const examSubjects = subjectsByCategory[examKey] || [];

//   //       console.log(`🔍 Subjects for ${examKey}:`, examSubjects);

//   //       // Now fetch topics for each subject
//   //       const subjectsWithTopics = await Promise.all(
//   //         examSubjects.map(async (subject) => {
//   //           try {
//   //             // Fetch topics for this specific subject
//   //             const topicsRes = await fetch(
//   //               `${API_BASE}/users/my-topics?subjectId=${subject.id}`,
//   //               {
//   //                 headers: { Authorization: `Bearer ${accessToken}` },
//   //               }
//   //             );

//   //             if (!topicsRes.ok) {
//   //               console.warn(`Failed to fetch topics for ${subject.subjectName}`);
//   //               return {
//   //                 ...subject,
//   //                 allTopics: [],
//   //               };
//   //             }

//   //             const topicsData = await topicsRes.json();
              
//   //             // Extract topics from modules
//   //             const allTopics = [];
//   //             const subjectData = topicsData.data?.[0]; // Assuming first item is the subject
              
//   //             if (subjectData?.modules) {
//   //               subjectData.modules.forEach(module => {
//   //                 module.topics?.forEach(topic => {
//   //                   allTopics.push(topic);
//   //                 });
//   //               });
//   //             }

//   //             return {
//   //               id: subject.id,
//   //               subjectId: subject.id,
//   //               subjectName: subject.subjectName,
//   //               icon: subject.icon,
//   //               allTopics,
//   //             };
//   //           } catch (err) {
//   //             console.error(`Error fetching topics for ${subject.subjectName}:`, err);
//   //             return {
//   //               ...subject,
//   //               allTopics: [],
//   //             };
//   //           }
//   //         })
//   //       );

//   //       setSubjects(subjectsWithTopics);
//   //       console.log("✅ Loaded subjects with topics:", subjectsWithTopics.length);
//   //       console.log("📋 Subjects:", subjectsWithTopics.map(s => 
//   //         `${s.subjectName} (${s.allTopics.length} topics)`
//   //       ));
//   //     } catch (err) {
//   //       console.error("❌ Error loading subjects:", err);
//   //       setError("Unable to load subjects");
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchSubjects();
//   // }, [accessToken, selectedExam]);

//   useEffect(() => {
//   if (!accessToken || !selectedExam) return;

//   const fetchSubjects = async () => {
//     setLoading(true);
//     setError(null);

//     try {
//       console.log("➡️ Fetching subjects for", selectedExam);

//       // Use /my-subjects endpoint which returns subjects grouped by category
//       const res = await fetch(`${API_BASE}/users/my-subjects`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (!res.ok) throw new Error("Failed to fetch subjects");

//       const data = await res.json();
//       console.log("📥 Fetched subjects data:", data);

//       // Get subjects for the selected exam
//       const subjectsByCategory = data.data?.subjectsByCategory || {};
//       const examKey = selectedExam.toUpperCase();
//       const examSubjects = subjectsByCategory[examKey] || [];

//       console.log(`🔍 Subjects for ${examKey}:`, examSubjects);

//       // Fetch ALL topics for ALL subjects at once
//       console.log("📡 Fetching all topics...");
//       const allTopicsRes = await fetch(`${API_BASE}/users/my-topics`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (!allTopicsRes.ok) {
//         throw new Error("Failed to fetch topics");
//       }

//       const allTopicsData = await allTopicsRes.json();
//       console.log("📥 All topics data:", allTopicsData);

//       // Map subjects with their topics
//       const subjectsWithTopics = examSubjects.map((subject) => {
//         const allTopics = [];

//         // Find this subject's data in the topics response
//         // Match by subjectId AND category (exam type)
//         if (allTopicsData.data && Array.isArray(allTopicsData.data)) {
//           const subjectTopicData = allTopicsData.data.find(
//             (item) => item.subjectId === subject.id && item.category === examKey
//           );

//           console.log(`🔍 Topic data for ${subject.subjectName} (${examKey}):`, subjectTopicData);

//           if (subjectTopicData?.modules) {
//             subjectTopicData.modules.forEach((module) => {
//               console.log(`  📦 Module: ${module.moduleName}`);
//               if (module.topics && Array.isArray(module.topics)) {
//                 module.topics.forEach((topic) => {
//                   console.log(`    ✅ Topic: ${topic.topicName}`);
//                   allTopics.push({
//                     ...topic,
//                     moduleName: module.moduleName,
//                     moduleId: module.moduleId,
//                     subjectId: subject.id,
//                   });
//                 });
//               }
//             });
//           }
//         }

//         console.log(`✅ ${subject.subjectName}: ${allTopics.length} topics`);

//         return {
//           id: subject.id,
//           subjectId: subject.id,
//           subjectName: subject.subjectName,
//           icon: subject.icon,
//           allTopics,
//         };
//       });

//       setSubjects(subjectsWithTopics);
//       console.log("✅ Loaded subjects with topics:", subjectsWithTopics.length);
//       console.log(
//         "📋 Subjects:",
//         subjectsWithTopics.map((s) => `${s.subjectName} (${s.allTopics.length} topics)`)
//       );
//     } catch (err) {
//       console.error("❌ Error loading subjects:", err);
//       setError("Unable to load subjects");
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchSubjects();
// }, [accessToken, selectedExam]);

//   // Update year and notify parent
//   const handleYearChange = (subjectId, year) => {
//     setSubjectYears((prev) => ({ ...prev, [subjectId]: year }));
//     setTopicYear(subjectId, year);
//     console.log(`📌 Selected year for subject ${subjectId}:`, year);
//   };

//   if (!selectedExam) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 dark:text-gray-400">Please select an exam first.</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex flex-col items-center justify-center py-10">
//         <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin mb-2"></div>
//         <p className="text-gray-700 dark:text-gray-300">Loading subjects and topics...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-3">
//         <p className="text-red-600 text-sm">{error}</p>
//       </div>
//     );
//   }

//   if (!subjects.length) {
//     return (
//       <div className="text-center py-8">
//         <p className="text-gray-500 dark:text-gray-400">
//           No subjects available for {selectedExam}.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-4 relative overflow-y-auto max-h-[600px] p-2">
//       {subjects.map((subject) => {
//         const isOpen = openSubject === subject.subjectId;
//         const allTopics = subject.allTopics || [];

//         // Extract available years from topics
//         const availableYearsSet = new Set();
//         allTopics.forEach(topic => {
//           if (topic.availableYears) {
//             topic.availableYears.forEach(year => availableYearsSet.add(year));
//           }
//         });
//         const availableYears = Array.from(availableYearsSet).sort((a, b) => b - a);

//         const selectedYear = subjectYears[subject.subjectId] || "";

//         return (
//           <div
//             key={subject.subjectId}
//             className="relative border rounded-xl p-4 shadow-sm transition bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700"
//             onMouseEnter={() => setOpenSubject(subject.subjectId)}
//             onMouseLeave={() => setOpenSubject(null)}
//           >
//             {/* SUBJECT TITLE + YEAR DROPDOWN */}
//             <div className="flex justify-between items-center gap-3">
//               <div className="flex items-center gap-3 flex-1">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2">
//                     <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                       {subject.subjectName}
//                     </div>
//                     {/* Show exam badge */}
//                     <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
//                       {selectedExam}
//                     </span>
//                   </div>
//                   <div className="text-xs text-gray-500 dark:text-gray-400">
//                     {allTopics.length} topics available
//                   </div>
//                 </div>
//               </div>

//               {/* YEAR SELECT */}
//               <select
//                 value={selectedYear}
//                 onChange={(e) => handleYearChange(subject.subjectId, e.target.value)}
//                 className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
//               >
//                 <option value="" disabled>Select Year</option>
//                 <option value="random">Random</option>
//                 {availableYears.map((yr) => (
//                   <option key={yr} value={yr}>
//                     {yr}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* TOPIC DROPDOWN */}
//             {isOpen && (
//               <div className="absolute left-0 top-[70px] mt-2 w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl p-4 z-50 max-h-96 overflow-y-auto">
//                 {allTopics.length > 0 ? (
//                   <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
//                     {allTopics.map((topic) => {
//                       const isSelected =
//                         selectedTopics[subject.subjectId]?.includes(topic.topicId) || false;

//                       return (
//                         <button
//                           key={topic.topicId}
//                           onClick={() => toggleTopic(subject.subjectId, topic.topicId)}
//                           className={`text-center px-2 py-2.5 rounded-lg text-xs font-medium transition-all border
//                             ${
//                               isSelected
//                                 ? "bg-indigo-600 text-white shadow-md border-indigo-700"
//                                 : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
//                             }`}
//                           title={`${topic.questionCount || 0} questions`}
//                         >
//                           <div className="font-semibold">{topic.topicName}</div>
//                         </button>
//                       );
//                     })}
//                   </div>
//                 ) : (
//                   <div className="text-center text-gray-500 py-4">
//                     No topics available for this subject.
//                   </div>
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
import useAuthStore from "@/store/authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

export default function TopicSelector({
  selectedTopics = {},
  toggleTopic = () => {},
  setTopicYear = () => {},
  selectedExam, // The selected exam category (WAEC, JAMB, etc)
}) {
  const { accessToken } = useAuthStore();

  const [openSubject, setOpenSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectYears, setSubjectYears] = useState({});
  const [error, setError] = useState(null);

  // Fetch topics and filter by selected exam
  useEffect(() => {
    if (!accessToken || !selectedExam) return;

    const fetchSubjectsAndTopics = async () => {
      setLoading(true);
      setError(null);

      try {
        console.log("➡️ Fetching topics for", selectedExam);

        // Fetch ALL topics - this endpoint has everything we need!
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

        // Filter subjects by selected exam category and extract topics
        const subjectsWithTopics = data.data
          .filter((subject) => subject.category === examKey)
          .map((subject) => {
            const allTopics = [];

            // Extract topics from modules
            if (subject.modules && Array.isArray(subject.modules)) {
              subject.modules.forEach((module) => {
                console.log(`  📦 ${subject.subjectName} - Module: ${module.moduleName}`);
                
                if (module.topics && Array.isArray(module.topics)) {
                  module.topics.forEach((topic) => {
                    allTopics.push({
                      ...topic,
                      moduleName: module.moduleName,
                      moduleId: module.moduleId,
                      subjectId: subject.subjectId,
                    });
                  });
                }
              });
            }

            console.log(`✅ ${subject.subjectName}: ${allTopics.length} topics`);

            return {
              id: subject.subjectId,
              subjectId: subject.subjectId,
              subjectName: subject.subjectName,
              icon: subject.icon,
              color: subject.color,
              allTopics,
            };
          });

        setSubjects(subjectsWithTopics);
        console.log("✅ Loaded subjects:", subjectsWithTopics.length);
        console.log(
          "📋 Summary:",
          subjectsWithTopics.map((s) => `${s.subjectName} (${s.allTopics.length} topics)`)
        );
      } catch (err) {
        console.error("❌ Error loading topics:", err);
        setError("Unable to load subjects and topics");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjectsAndTopics();
  }, [accessToken, selectedExam]);

  // Update year and notify parent
  const handleYearChange = (subjectId, year) => {
    setSubjectYears((prev) => ({ ...prev, [subjectId]: year }));
    setTopicYear(subjectId, year);
    console.log(`📌 Selected year for subject ${subjectId}:`, year);
  };

  // Loading states and error handling
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
    <div className="space-y-4 relative overflow-y-auto max-h-[600px] p-2">
      {subjects.map((subject) => {
        const isOpen = openSubject === subject.subjectId;
        const allTopics = subject.allTopics || [];

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
            className="relative border rounded-xl p-4 shadow-sm transition bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-slate-50 dark:hover:bg-gray-700"
            onMouseEnter={() => setOpenSubject(subject.subjectId)}
            onMouseLeave={() => setOpenSubject(null)}
          >
            {/* SUBJECT TITLE + YEAR DROPDOWN */}
            <div className="flex justify-between items-center gap-3">
              <div className="flex items-center gap-3 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
  
                    
                    {/* Subject Name */}
                    <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                      {subject.subjectName}
                    </div>
                    
                    {/* Exam Badge */}
                    <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                      {selectedExam}
                    </span>
                  </div>
                  
                  {/* Topic Count */}
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {allTopics.length} topics available
                  </div>
                </div>
              </div>

              {/* YEAR SELECT DROPDOWN */}
              <select
                value={selectedYear}
                onChange={(e) => handleYearChange(subject.subjectId, e.target.value)}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
                onClick={(e) => e.stopPropagation()} // Prevent triggering hover state
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
                          className={`text-center px-2 py-2.5 rounded-lg text-xs font-medium transition-all border
                            ${
                              isSelected
                                ? "bg-indigo-600 text-white shadow-md border-indigo-700"
                                : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                            }`}
                          title={`${topic.questionCount || 0} questions • ${topic.moduleName}`}
                        >
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