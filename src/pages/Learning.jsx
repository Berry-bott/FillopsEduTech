// import React, { useEffect, useState } from "react";
// import { Play, Check } from "lucide-react";
// import TopNav from "../components/DashboardComponents/TopNav"

// export default function CBTLearningPage() {
//   const [studyData, setStudyData] = useState(null);

//   useEffect(() => {
//     const raw = localStorage.getItem("studySelections");
//     if (!raw) return;
//     try {
//       const parsed = JSON.parse(raw);
//       setStudyData(parsed);
//     } catch {
//       setStudyData(null);
//     }
//   }, []);

//   if (!studyData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
//         <p className="text-gray-600 dark:text-gray-400">
//           No study selections found — please set up your study first.
//         </p>
//       </div>
//     );
//   }

//   const allTopics =
//     studyData.mode === "topic"
//       ? Object.entries(studyData.topics).flatMap(([subject, topics]) =>
//           topics.map((topic) => ({ subject, topic }))
//         )
//       : [];

//   return (
//     <section>
//       <div className="py-2">
//       <TopNav/>
//       </div>
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
//       {/* Hero */}
//       <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-12 px-6">
        
//         <div className="max-w-6xl mx-auto text-center">
//           <h1 className="text-4xl md:text-5xl font-bold mb-2">Your Learning Dashboard</h1>
//           <p className="text-lg md:text-xl opacity-90">
//             All your selected subjects and topics are ready to start. Click play and begin learning!
//           </p>
//         </div>
      
//       </header>

//       {/* Courses Grid */}
//       <main className="max-w-7xl mx-auto px-6 py-12">
//         <h2 className="text-2xl font-bold mb-6">Your Courses</h2>

//         {studyData.mode === "subject" && studyData.subjects?.length > 0 && (
//           <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {studyData.subjects.map((subject) => (
//               <div
//                 key={subject}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
//               >
//                 <div className="p-6 flex flex-col justify-between h-full">
//                   <div>
//                     <h3 className="font-bold text-lg mb-2">{subject}</h3>
//                     <p className="text-gray-500 dark:text-gray-400 text-sm">
//                       Year: {studyData.subjectYears?.[subject] || "All"}
//                     </p>
//                   </div>
//                   <button className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300">
//                     <Play className="w-4 h-4" /> Start Studying
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {studyData.mode === "topic" && allTopics.length > 0 && (
//           <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//             {allTopics.map(({ subject, topic }, idx) => (
//               <div
//                 key={idx}
//                 className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
//               >
//                 <div className="p-6 flex flex-col justify-between h-full">
//                   <div>
//                     <h3 className="font-bold text-lg mb-1">{topic}</h3>
//                     <p className="text-gray-500 dark:text-gray-400 text-sm">{subject}</p>
//                   </div>
//                   <button className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300">
//                     <Play className="w-4 h-4" /> Start Studying
//                   </button>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </main>

//       {/* Footer */}
//       <footer className="py-6 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-12">
//         © {new Date().getFullYear()} Fillops Tech. All rights reserved.
//       </footer>
//     </div>
//     </section>

//   );
// }

import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/DashboardComponents/TopNav";

export default function CBTLearningPage() {
  const [studyData, setStudyData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const raw = localStorage.getItem("studySelections");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setStudyData(parsed);
    } catch {
      setStudyData(null);
    }
  }, []);

  if (!studyData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400">
          No study selections found — please set up your study first.
        </p>
      </div>
    );
  }

  // Mock data for topics (replace later with API)
  const mockTopics = {
    Mathematics: [
      "Algebra Basics",
      "Geometry Principles",
      "Trigonometry",
      "Calculus",
    ],
    English: ["Grammar Rules", "Reading Comprehension", "Essay Writing"],
    Physics: ["Motion & Forces", "Waves", "Electricity Basics"],
  };

  const handleTopicClick = (subject, topic) => {
    navigate("/topic", { state: { subject, topic } }); // navigate to topic page
  };

  const allTopics =
    studyData.mode === "topic"
      ? Object.entries(studyData.topics).flatMap(([subject, topics]) =>
          topics.map((topic) => ({ subject, topic }))
        )
      : [];

  return (
    <section>
      <TopNav />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
        {/* Hero */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              Your Learning Dashboard
            </h1>
            <p className="text-lg md:text-xl opacity-90">
              All your selected subjects and topics are ready to start. Choose a
              topic to begin learning!
            </p>
          </div>
        </header>

        {/* Courses Grid */}
        <main className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-bold mb-6">Your Courses</h2>

          {/* ====== SUBJECT MODE ====== */}
          {studyData.mode === "subject" && studyData.subjects?.length > 0 && (
            <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {studyData.subjects.map((subject) => (
                <div
                  key={subject}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-bold text-lg mb-2">{subject}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
                        Year: {studyData.subjectYears?.[subject] || "All"}
                      </p>

                      <div className="space-y-2">
                        {(mockTopics[subject] || []).map((topic, index) => (
                          <button
                            key={index}
                            onClick={() => handleTopicClick(subject, topic)}
                            className="w-full text-left text-sm px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ====== TOPIC MODE ====== */}
          {studyData.mode === "topic" && allTopics.length > 0 && (
            <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {allTopics.map(({ subject, topic }, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  <div className="p-6 flex flex-col justify-between h-full">
                    <div>
                      <h3 className="font-bold text-lg mb-1">{topic}</h3>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">
                        {subject}
                      </p>
                    </div>
                    <button
                      onClick={() => handleTopicClick(subject, topic)}
                      className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
                    >
                      <Play className="w-4 h-4" /> Start Learning
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-6 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-12">
          © {new Date().getFullYear()} Fillops Tech. All rights reserved.
        </footer>
      </div>
    </section>
  );
}
