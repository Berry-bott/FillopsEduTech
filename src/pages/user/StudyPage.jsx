// import { useEffect, useState } from "react";
// import PageNav from  "../../components/DashboardComponents/PageNav"
// import useAuthStore from "../../store/authStore";

// export default function StudyPage() {
//   const { accessToken } = useAuthStore();
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOptions, setSelectedOptions] = useState({}); // track selected radio per question

//   useEffect(() => {
//     loadQuestions();
//   }, []);

//   function extractTopicId(topicStorage) {
//     if (!topicStorage) return null;
  
//     const firstKey = Object.keys(topicStorage)[0];
//     const value = topicStorage[firstKey];
  
//     // if value is array: return first item
//     if (Array.isArray(value)) return value[0];
  
//     // if value is boolean style object: return key directly
//     return firstKey;
//   }
  

//   const loadQuestions = async () => {
//     try {
//       console.log("➡️ Fetching local storage selection...");

//       const saved = JSON.parse(localStorage.getItem("studySelections"));
//       console.log("📦 Local Storage Data:", saved);

//       if (!saved) {
//         console.warn("⚠️ No saved selection found in local storage");
//         setLoading(false);
//         return;
//       }

//       // let id, endpointType, year;

//       let id = null;
//       let endpointType = null;
//       let year = null;
      
//       if (saved.mode === "topic" && saved.topics) {
//         id = extractTopicId(saved.topics);
//         endpointType = "topics";
//         year = saved.topicYears?.[id];
//       } else if (saved.subjects) {
//         id = saved.subjects[0];
//         endpointType = "subjects";
//         year = saved.subjectYears?.[id];
//       }
//        else {
//         console.warn("❌ No subject or topic ID found in local storage");
//         setLoading(false);
//         return;
//     }    
    

//       const category = saved.exam; // e.g., "WAEC"
//       console.log(`🎯 Using filters -> Category: ${category}, Year: ${year}`);

//       // Build API URL
//       let url;
//       if (!year) {
//         console.warn("⚠️ Year not selected or missing, fetching random questions...");
//         url = `https://fillops-server-5fuf.onrender.com/api/${endpointType}/${id}/questions?random=true&category=${category}`;
//       } else {
//         url = `https://fillops-server-5fuf.onrender.com/api/${endpointType}/${id}/questions?category=${category}&year=${year}`;
//       }

//       console.log(`🌍 Fetching questions from: ${url}`);

//       const response = await fetch(url, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("📥 Backend response:", data);

//       const allQuestions = data.data || [];
//       console.log(`📝 Extracted ${allQuestions.length} questions.`);

//       if (!year) {
//         console.log("🎲 These are RANDOM questions because year was not selected.");
//       }

//       // Format questions
//       const formatted = allQuestions.map((q, index) => {
//         // console.log(`➡️ Formatting Question ${index + 1}:`, q);
//         return {
//           id: q.id,
//           text: q.text,
//           options: q.options,
//           correctAnswer: q.correctAnswer,
//           explanation: q.explanation,
//           difficulty: q.difficulty,
//           year: q.year,
//           examType: q.category,
//           moduleId: q.moduleId,
//           topicId: q.topicId,
//         };
//       });

//       console.log("🎉 Final formatted question list:", formatted);
//       setQuestions(formatted);
//     } catch (err) {
//       console.error("❌ Error while loading questions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle radio selection per question
//   const handleOptionChange = (questionId, option) => {
//     setSelectedOptions((prev) => ({ ...prev, [questionId]: option }));
//     console.log(`🖊 Selected option for ${questionId}: ${option}`);
//   };

//   if (loading) return <p>Loading questions...</p>;

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Study Questions</h1>

//       {questions.length === 0 ? (
//         <p>No questions found.</p>
//       ) : (
//         questions.map((q, index) => (
//           <div
//             key={q.id}
//             className="border border-gray-300 p-3 rounded-lg mb-4 shadow-sm"
//           >
//             <h2 className="font-semibold mb-2">
//               {index + 1}. {q.text}
//             </h2>

//             {/* OPTIONS as RADIO buttons */}
//             {q.options?.map((opt, i) => (
//               <label key={i} className="flex items-center ml-4 mb-1 cursor-pointer">
//                 <input
//                   type="radio"
//                   name={q.id}
//                   value={opt}
//                   checked={selectedOptions[q.id] === opt}
//                   onChange={() => handleOptionChange(q.id, opt)}
//                   className="mr-2"
//                 />
//                 {String.fromCharCode(65 + i)}. {opt}
//               </label>
//             ))}

//             <p className="mt-2 text-green-700 font-medium">
//               ✅ Correct Answer: {q.correctAnswer}
//             </p>

//             <p className="text-blue-600 mt-1 text-sm">
//               💡 Explanation: {q.explanation}
//             </p>

//             <p className="text-xs text-gray-500 mt-1">
//               Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }




// import { useEffect, useState } from "react";
// import PageNav from "../../components/DashboardComponents/PageNav";
// import useAuthStore from "../../store/authStore";

// export default function StudyPage() {
//   const { accessToken } = useAuthStore();
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [activeId, setActiveId] = useState(null); // subjectId OR topicId

//   const saved = JSON.parse(localStorage.getItem("studySelections"));
//   console.log("📦 Local Storage Data:", saved);

//   // Extract first topic ID
//   function extractTopicId(topicStorage) {
//     const firstKey = Object.keys(topicStorage)[0];
//     const value = topicStorage[firstKey];
//     return Array.isArray(value) ? value[0] : firstKey;
//   }

//   // MAIN API CALL
//   const fetchQuestions = async (type, id, year) => {
//     try {
//       setLoading(true);

//       let url;
//       const category = saved.exam;

//       if (!year) {
//         url = `https://fillops-server-5fuf.onrender.com/api/${type}/${id}/questions?random=true&category=${category}`;
//       } else {
//         url = `https://fillops-server-5fuf.onrender.com/api/${type}/${id}/questions?category=${category}&year=${year}`;
//       }

//       const response = await fetch(url, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });

//       const data = await response.json();
//       const formatted =
//         (data.data || []).map((q) => ({
//           id: q.id,
//           text: q.text,
//           options: q.options || [],
//           correctAnswer: q.correctAnswer,
//           explanation: q.explanation,
//           difficulty: q.difficulty,
//           year: q.year,
//           examType: q.category,
//         })) || [];

//       setQuestions(formatted);
//       setLoading(false);

//     } catch (err) {
//       console.error("❌ Error fetching:", err);
//       setLoading(false);
//     }
//   };

//   // LOAD DEFAULT
//   useEffect(() => {
//     if (!saved) return;

//     if (saved.mode === "subject") {
//       // default = first subject
//       const firstSubject = saved.subjects?.[0];
//       setActiveId(firstSubject);

//       const year = saved.subjectYears?.[firstSubject];
//       fetchQuestions("subjects", firstSubject, year);
//     }

//     if (saved.mode === "topic") {
//       // default = first topic
//       const firstTopic = extractTopicId(saved.topics);
//       setActiveId(firstTopic);

//       const year = saved.topicYears?.[firstTopic];
//       fetchQuestions("topics", firstTopic, year);
//     }
//   }, []);

//   // SUBJECT/TOPIC NAVIGATION
// // SUBJECT/TOPIC NAVIGATION (FIXED NAMES)
// const SubjectTopicBar = () => {
//   if (!saved) return null;

//   const isTopicMode = saved.mode === "topic";
//   const topics = saved.topics || {};          // { subjectId: ["topicId1", "topicId2"] }
//   const subjects = saved.subjects || [];      // ["subjectId1", "subjectId2"]

//   // --- TOPIC MODE ---
//   if (isTopicMode) {
//     const subjectId = Object.keys(topics)[0];
//     const topicList = topics[subjectId] || [];

//     return (
//       <div className="mb-6">
//         <div className="relative group inline-block">

//           {/* SHOW SUBJECT NAME */}
//           <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
//             {saved.subjectLabels?.[subjectId] || "Subject"}
//           </button>

//           {/* HOVER SHOW TOPICS */}
//           <div className="absolute hidden group-hover:block bg-white border p-3 rounded-lg shadow-lg w-56 z-20">
//             <p className="font-semibold mb-2 text-sm">Topics</p>

//             {topicList.map((topicId) => (
//               <button
//                 key={topicId}
//                 onClick={() => {
//                   setActiveId(topicId);
//                   const year = saved.topicYears?.[topicId];
//                   fetchQuestions("topics", topicId, year);
//                 }}
//                 className={`block w-full text-left p-2 rounded text-sm hover:bg-gray-200 ${
//                   activeId === topicId ? "bg-gray-300" : ""
//                 }`}
//               >
//                 {saved.topicLabels?.[topicId] || "Topic"}
//               </button>
//             ))}
//           </div>
//         </div>
//       </div>
//     );
//   }

//   // --- SUBJECT MODE ---
//   return (
//     <div className="flex gap-3 flex-wrap mb-6">
//       {subjects.map((subjectId) => (
//         <div key={subjectId} className="relative group">

//           {/* SUBJECT NAME FIX */}
//           <button
//             onClick={() => {
//               setActiveId(subjectId);
//               const year = saved.subjectYears?.[subjectId];
//               fetchQuestions("subjects", subjectId, year);
//             }}
//             className={`px-4 py-2 rounded-lg shadow text-white ${
//               activeId === subjectId ? "bg-blue-700" : "bg-blue-500"
//             }`}
//           >
//             {/* THIS WAS BROKEN BEFORE — NOW FIXED */}
//             {saved.subjectLabels?.[subjectId] || "Subject"}
//           </button>

//           {/* HOVER TOPICS IF ANY */}
//           {topics[subjectId] && topics[subjectId].length > 0 && (
//             <div className="absolute hidden group-hover:block bg-white border p-3 rounded-lg shadow-lg w-56 z-20">
//               <p className="font-semibold mb-2 text-sm">Topics</p>

//               {topics[subjectId].map((topicId) => (
//                 <button
//                   key={topicId}
//                   onClick={() => {
//                     setActiveId(topicId);
//                     const year = saved.topicYears?.[topicId];
//                     fetchQuestions("topics", topicId, year);
//                   }}
//                   className="block w-full text-left p-2 rounded text-sm hover:bg-gray-200"
//                 >
//                   {saved.topicLabels?.[topicId] || "Topic"}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// };


//   const handleOptionChange = (questionId, option) =>
//     setSelectedOptions((prev) => ({ ...prev, [questionId]: option }));

//   if (!saved) return <p>No study selections found.</p>;

//   return (
//     <div className="p-4">
//       <PageNav />

//       <SubjectTopicBar />

//       <h1 className="text-xl font-bold mb-4">Study Questions</h1>

//       {loading ? (
//         <p>Loading questions...</p>
//       ) : questions.length === 0 ? (
//         <p>No questions available.</p>
//       ) : (
//         questions.map((q, index) => (
//           <div key={q.id} className="border border-gray-300 p-3 rounded-lg mb-4">
//             <h2 className="font-semibold mb-2">
//               {index + 1}. {q.text}
//             </h2>

//             {q.options.map((opt, i) => (
//               <label key={i} className="flex items-center ml-4 mb-1 cursor-pointer">
//                 <input
//                   type="radio"
//                   name={q.id}
//                   value={opt}
//                   checked={selectedOptions[q.id] === opt}
//                   onChange={() => handleOptionChange(q.id, opt)}
//                   className="mr-2"
//                 />
//                 {String.fromCharCode(65 + i)}. {opt}
//               </label>
//             ))}

//             <p className="mt-2 text-green-700 font-medium">
//               ✅ Correct Answer: {q.correctAnswer}
//             </p>

//             <p className="mt-1 text-blue-700 text-sm">{q.explanation}</p>

//             <p className="text-xs text-gray-500 mt-1">
//               Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
//             </p>
//           </div>
//         ))
//       )}
//     </div>
//   );
// }














import { useEffect, useState } from "react";
import PageNav from "../../components/DashboardComponents/PageNav";
import useAuthStore from "../../store/authStore";

export default function StudyPage() {
  const { accessToken } = useAuthStore();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeId, setActiveId] = useState(null); // subjectId OR topicId
  const [subjectNames, setSubjectNames] = useState({});
  const [topicNames, setTopicNames] = useState({});


  const saved = JSON.parse(localStorage.getItem("studySelections"));
  console.log("📦 Local Storage Data:", saved);
  
  // Extract first topic ID
  function extractTopicId(topicStorage) {
    const firstKey = Object.keys(topicStorage)[0];
    const value = topicStorage[firstKey];
    return Array.isArray(value) ? value[0] : firstKey;
  }

  // Fetch questions
  const fetchQuestions = async (type, id, year) => {
    let url = "";
    try {
      setLoading(true);
      const category = saved.exam;

      if (year && year !== "random") {
        url = `https://fillops-server-5fuf.onrender.com/api/${type}/${id}/questions?category=${category}&year=${year}`
      } else {
        url = `https://fillops-server-5fuf.onrender.com/api/${type}/${id}/questions?random=true&category=${category}`;
      }
    

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}`},
      });
      const data = await res.json();

      const formatted = (data.data || []).map((q) => ({
        id: q.id,
        text: q.text,
        options: q.options || [],
        correctAnswer: q.correctAnswer,
        explanation: q.explanation,
        difficulty: q.difficulty,
        year: q.year,
        examType: q.category,
      }));

      setQuestions(formatted);
      setLoading(false);
    } catch (err) {
      console.error("❌ Error fetching questions:", err);
      setLoading(false);
    }
  };


// Fetch subject names
const fetchSubjectNames = async () => {
  if (!saved?.subjects) return;

  try {
    const names = {};

    await Promise.all(
      saved.subjects.map(async (id) => {
        try {
          const res = await fetch(
            `https://fillops-server-5fuf.onrender.com/api/subjects/${id}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );
          const data = await res.json();
          // Some APIs wrap data inside "data", some return at root
          names[id] = data.subjectName || data.data?.subjectName || id;
        } catch (err) {
          console.error("❌ Subject fetch error:", err);
          names[id] = id;
        }
      })
    );

    setSubjectNames(names);
  } catch (err) {
    console.error("❌ Error fetching subject names:", err);
  }
};

// Fetch topic names
// const fetchTopicNames = async () => {
//   if (!saved?.topics) return;

//   try {
//     const names = {};

//     const topicEntries = Object.entries(saved.topics);

//   await Promise.all(
//       topicEntries.flatMap(([subjectId, topicIds]) =>
        
//         topicIds.map(async (topicId) => {
//           try {
//             const res = await fetch(
//               `https://fillops-server-5fuf.onrender.com/api/topics/${topicId}`,
//               { headers: { Authorization: `Bearer ${accessToken}` } }
//             );
//             const data = await res.json();
//             console.log(data);
//             console.log("📚 Fetching topics for subject:", subjectId) 

//             // Handle wrapped or root response
//             names[topicId] = data.topicName || data.data?.topicName || topicId;
//           } catch (err) {
//             console.error("❌ Topic fetch error:", err);
//             names[topicId] = topicId;
//           }
//         })
//       )
//     );

//     setTopicNames(names);
//   } catch (err) {
//     console.error("❌ Error fetching topic names:", err);
//   }
// };
const fetchTopicNames = async () => {
  if (!saved?.topics) return;

  try {
    const names = {};
    const subjectForTopic = {}; // NEW

    const topicEntries = Object.entries(saved.topics);

    await Promise.all(
      topicEntries.flatMap(([subjectId, topicIds]) =>
        topicIds.map(async (topicId) => {
          try {
            const res = await fetch(
              `https://fillops-server-5fuf.onrender.com/api/topics/${topicId}`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );

            const data = await res.json();
            console.log("🔍 Topic API:", data);

            const topic = data.data || data;

            names[topicId] = topic.topicName;

            // extract subject name inside module → subject
            if (topic.module?.subject?.subjectName) {
              subjectForTopic[topicId] = topic.module.subject.subjectName;
            }

          } catch (err) {
            console.error("❌ Topic fetch error:", err);
            names[topicId] = topicId;
          }
        })
      )
    );

    setTopicNames(names);
    setSubjectNames((prev) => ({ ...prev, ...subjectForTopic })); // MERGE
  } catch (err) {
    console.error("❌ Error fetching topic names:", err);
  }
};



  // Load defaults and names
  useEffect(() => {
    if (!saved) return;

    fetchSubjectNames();
    fetchTopicNames();

    if (saved.mode === "subject") {
      const firstSubject = saved.subjects?.[0];
      setActiveId(firstSubject);
      const year = saved.subjectYears?.[firstSubject];
      fetchQuestions("subjects", firstSubject, year);
    }

    if (saved.mode === "topic") {
      const firstTopic = extractTopicId(saved.topics);
      setActiveId(firstTopic);
      const year = saved.topicYears?.[firstTopic];
      fetchQuestions("topics", firstTopic, year);
    }
  }, []);

  // Handle option selection
  const handleOptionChange = (questionId, option) =>
    setSelectedOptions((prev) => ({ ...prev, [questionId]: option }));

  // Subject/Topic Bar
  const SubjectTopicBar = () => {
    if (!saved) return null;
  
    const isTopicMode = saved.mode === "topic";
    const topics = saved.topics || {};
    const subjects = saved.subjects || [];
  
    /** -------------------------------
     * 🔵 TOPIC MODE
     --------------------------------*/
    if (isTopicMode) {
      const subjectId = Object.keys(topics)[0];
      const topicList = topics[subjectId] || [];
  
      // Determine subjectName from first topic
      let subjectName = "Subject";
  
      if (topicList.length > 0) {
        const firstTopicId = topicList[0];
  
        // Priority:
        // 1. subjectNames mapped by topicId (from module.subjectName)
        // 2. subjectNames mapped by subjectId (from your subject fetch)
        subjectName =
          subjectNames[firstTopicId] ||
          subjectNames[subjectId] ||
          "Subject";
      }
  
      return (
        <div className="mb-6 flex flex-wrap gap-2">
          {/* Subject Button */}
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow">
            {subjectName}
          </button>
  
          {/* Topic Buttons */}
          {topicList.map((topicId) => (
            <button
              key={topicId}
              onClick={() => {
                setActiveId(topicId);
                const year = saved.topicYears?.[topicId];
                fetchQuestions("topics", topicId, year);
              }}
              className={`px-4 py-2 rounded-lg shadow text-white ${
                activeId === topicId ? "bg-blue-700" : "bg-blue-500"
              }`}
            >
              {topicNames[topicId] || "Topic"}
            </button>
          ))}
        </div>
      );
    }
  
    /** -------------------------------
     * 🔵 SUBJECT MODE
     --------------------------------*/
    return (
      <div className="flex flex-wrap gap-2 mb-6">
        {subjects.map((subjectId) => (
          <div key={subjectId} className="relative group">
            {/* SUBJECT BUTTON */}
            <button
              onClick={() => {
                setActiveId(subjectId);
                const year = saved.subjectYears?.[subjectId];
                fetchQuestions("subjects", subjectId, year);
              }}
              className={`px-4 py-2 rounded-lg shadow text-white ${
                activeId === subjectId ? "bg-blue-700" : "bg-blue-500"
              }`}
            >
              {subjectNames[subjectId] || "Subject"}
            </button>
  
            {/* HOVER TOPIC DROPDOWN */}
            {topics[subjectId] && topics[subjectId].length > 0 && (
              <div className="absolute hidden group-hover:block bg-white border p-3 rounded-lg shadow-lg w-56 z-20">
                <p className="font-semibold mb-2 text-sm">Topics</p>
  
                {topics[subjectId].map((topicId) => (
                  <button
                    key={topicId}
                    onClick={() => {
                      setActiveId(topicId);
                      const year = saved.topicYears?.[topicId];
                      fetchQuestions("topics", topicId, year);
                    }}
                    className="block w-full text-left p-2 rounded text-sm hover:bg-gray-200"
                  >
                    {topicNames[topicId] || "Topic"}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };
  
  

  if (!saved) return <p>No study selections found.</p>;

  return (
    <div className="p-4">
      <PageNav />
      <SubjectTopicBar />

      <h1 className="text-xl font-bold mb-4">Study Questions</h1>

      {loading ? (
        <p>Loading questions...</p>
      ) : questions.length === 0 ? (
        <p>No questions available.</p>
      ) : (
        questions.map((q, index) => (
          <div key={q.id} className="border border-gray-300 p-3 rounded-lg mb-4">
            <h2 className="font-semibold mb-2">
              {index + 1}. {q.text}
            </h2>

            {q.options.map((opt, i) => (
              <label key={i} className="flex items-center ml-4 mb-1 cursor-pointer">
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={selectedOptions[q.id] === opt}
                  onChange={() => handleOptionChange(q.id, opt)}
                  className="mr-2"
                />
                {String.fromCharCode(65 + i)}. {opt}
              </label>
            ))}

            <p className="mt-2 text-green-700 font-medium">
              ✅ Correct Answer: {q.correctAnswer}
            </p>

            <p className="mt-1 text-blue-700 text-sm">{q.explanation}</p>

            <p className="text-xs text-gray-500 mt-1">
              Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
