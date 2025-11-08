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

// import React, { useEffect, useState } from "react";
// import { Play } from "lucide-react";
// import { useNavigate } from "react-router-dom";
// import TopNav from "../components/DashboardComponents/TopNav";

// export default function CBTLearningPage() {
//   const [studyData, setStudyData] = useState(null);
//   const navigate = useNavigate();

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

//   // Mock data for topics (replace later with API)
//   const mockTopics = {
//     Mathematics: [
//       "Algebra Basics",
//       "Geometry Principles",
//       "Trigonometry",
//       "Calculus",
//     ],
//     English: ["Grammar Rules", "Reading Comprehension", "Essay Writing"],
//     Physics: ["Motion & Forces", "Waves", "Electricity Basics"],
//   };

//   const handleTopicClick = (subject, topic) => {
//     navigate("/topic", { state: { subject, topic } }); // navigate to topic page
//   };

//   const allTopics =
//     studyData.mode === "topic"
//       ? Object.entries(studyData.topics).flatMap(([subject, topics]) =>
//           topics.map((topic) => ({ subject, topic }))
//         )
//       : [];

//   return (
//     <section>
//       <TopNav />

//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">
//         {/* Hero */}
//         <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-12 px-6">
//           <div className="max-w-6xl mx-auto text-center">
//             <h1 className="text-4xl md:text-5xl font-bold mb-2">
//               Your Learning Dashboard
//             </h1>
//             <p className="text-lg md:text-xl opacity-90">
//               All your selected subjects and topics are ready to start. Choose a
//               topic to begin learning!
//             </p>
//           </div>
//         </header>

//         {/* Courses Grid */}
//         <main className="max-w-7xl mx-auto px-6 py-12">
//           <h2 className="text-2xl font-bold mb-6">Your Courses</h2>

//           {/* ====== SUBJECT MODE ====== */}
//           {studyData.mode === "subject" && studyData.subjects?.length > 0 && (
//             <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//               {studyData.subjects.map((subject) => (
//                 <div
//                   key={subject}
//                   className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
//                 >
//                   <div className="p-6 flex flex-col justify-between h-full">
//                     <div>
//                       <h3 className="font-bold text-lg mb-2">{subject}</h3>
//                       <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
//                         Year: {studyData.subjectYears?.[subject] || "All"}
//                       </p>

//                       <div className="space-y-2">
//                         {(mockTopics[subject] || []).map((topic, index) => (
//                           <button
//                             key={index}
//                             onClick={() => handleTopicClick(subject, topic)}
//                             className="w-full text-left text-sm px-3 py-2 rounded-md bg-gray-100 dark:bg-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all duration-200"
//                           >
//                             {topic}
//                           </button>
//                         ))}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* ====== TOPIC MODE ====== */}
//           {studyData.mode === "topic" && allTopics.length > 0 && (
//             <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//               {allTopics.map(({ subject, topic }, idx) => (
//                 <div
//                   key={idx}
//                   className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
//                 >
//                   <div className="p-6 flex flex-col justify-between h-full">
//                     <div>
//                       <h3 className="font-bold text-lg mb-1">{topic}</h3>
//                       <p className="text-gray-500 dark:text-gray-400 text-sm">
//                         {subject}
//                       </p>
//                     </div>
//                     <button
//                       onClick={() => handleTopicClick(subject, topic)}
//                       className="mt-4 flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg transition-all duration-300"
//                     >
//                       <Play className="w-4 h-4" /> Start Learning
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </main>

//         {/* Footer */}
//         <footer className="py-6 text-center text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700 mt-12">
//           © {new Date().getFullYear()} Fillops Tech. All rights reserved.
//         </footer>
//       </div>
//     </section>
//   );
// }





import React, { useEffect, useState } from "react";
import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import TopNav from "../components/DashboardComponents/TopNav";

export default function CBTLearningPage() {
  const [studyData, setStudyData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

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
        <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
          No study selections found — please set up your study first.
        </p>
      </div>
    );
  }

  // 🎓 Mock Questions (you can later replace this with API data)
  const mockQuestions = {
    Maths: [
      {
        id: 1,
        question: "What is the square root of 144?",
        options: ["10", "11", "12", "13"],
        correct: "12",
      },
      {
        id: 2,
        question: "Simplify: 2x + 3x - 4",
        options: ["5x - 4", "6x", "x + 4", "4x - 5"],
        correct: "5x - 4",
      },
      {
        id: 3,
        question: "If x = 2, what is 3x²?",
        options: ["6", "9", "12", "8"],
        correct: "12",
      },
    ],
    English: [
      {
        id: 1,
        question: "Which of these is a synonym of ‘happy’?",
        options: ["Sad", "Joyful", "Angry", "Tired"],
        correct: "Joyful",
      },
      {
        id: 2,
        question: "Which sentence is correct?",
        options: [
          "He go to school every day.",
          "He goes to school every day.",
          "He going to school every day.",
          "He gone to school every day.",
        ],
        correct: "He goes to school every day.",
      },
    ],
    Physics: [
      {
        id: 1,
        question: "What is the SI unit of force?",
        options: ["Pascal", "Joule", "Newton", "Watt"],
        correct: "Newton",
      },
      {
        id: 2,
        question: "What is acceleration due to gravity on Earth?",
        options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "12 m/s²"],
        correct: "9.8 m/s²",
      },
    ],
  };

  // 🧠 Get questions for selected topic or subject
  const getQuestions = () => {
    const topic = selectedCourse?.topic || selectedCourse?.subject;
    return mockQuestions[topic] || [];
  };

  const questions = getQuestions();

  // ✅ Handle answer selection
  const handleSelectOption = (option) => {
    setSelectedOption(option);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
    }
  };

  const allCourses =
    studyData.mode === "topic"
      ? Object.entries(studyData.topics).flatMap(([subject, topics]) =>
          topics.map((topic) => ({ subject, topic }))
        )
      : studyData.mode === "subject"
      ? studyData.subjects.map((subject) => ({ subject }))
      : [];

  return (
    <section>
      <TopNav />

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300 pb-20">
        {/* Header */}
        <header className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-10 px-6 shadow-md">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-2">Your Learning Dashboard</h1>
            <p className="text-lg opacity-90">
              Select a subject or topic to begin your CBT practice.
            </p>
          </div>
        </header>

        {/* Inline Course Buttons */}
        <main className="max-w-6xl mx-auto px-4 py-10">
          <h2 className="text-2xl font-semibold mb-6 text-center">
            Available Topics
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            {allCourses.map(({ subject, topic }, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedCourse({ subject, topic });
                  setCurrentQuestion(0);
                  setSelectedOption(null);
                }}
                className={`px-5 py-2 rounded-full font-medium border transition-all duration-200 ${
                  selectedCourse?.topic === topic
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-700 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                }`}
              >
                {topic || subject}
              </button>
            ))}
          </div>

          {/* Questions Section */}
          {selectedCourse && (
            <div className="max-w-3xl mx-auto">
              {questions.length > 0 ? (
                <>
                  {/* Question Card */}
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                      {selectedCourse.topic || selectedCourse.subject}
                    </h3>

                    <p className="text-md font-medium mb-4">
                      {questions[currentQuestion].question}
                    </p>

                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(opt)}
                          className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-all duration-200 ${
                            selectedOption === opt
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                              : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOption === opt && (
                            <CheckCircle className="w-5 h-5 text-blue-600" />
                          )}
                        </button>
                      ))}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                      Question {currentQuestion + 1} of {questions.length}
                    </p>
                  </div>

                  {/* Navigation Buttons outside the box */}
                  <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto">
                    <button
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <button
                      onClick={nextQuestion}
                      disabled={currentQuestion === questions.length - 1}
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">
                  No questions available for this topic yet.
                </p>
              )}
            </div>
          )}
        </main>
      </div>
    </section>
  );
}
