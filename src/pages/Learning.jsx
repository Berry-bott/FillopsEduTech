      // import React, { useEffect, useState, useRef } from "react";
      // import { CheckCircle, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
      // import { useNavigate } from "react-router-dom";
      // import TopNav from "../components/DashboardComponents/TopNav";
      // import useAuthStore from "../store/authStore";

      // export default function CBTLearningPage() {

      //   const user = useAuthStore((state) => state.user);
      //     const checkAuth = useAuthStore((state) => state.checkAuth);
        
      //     useEffect(() => {
      //       checkAuth(); 
      //     }, []);


      //   const navigate = useNavigate();
      //   const [studyData, setStudyData] = useState(null);
      //   const [selectedCourse, setSelectedCourse] = useState(null);
      //   const [currentQuestion, setCurrentQuestion] = useState(0);
      //   const [selectedOption, setSelectedOption] = useState(null);
      //   const [expandedSubject, setExpandedSubject] = useState(null);

      //   useEffect(() => {
      //     const raw = localStorage.getItem("studySelections");
      //     if (!raw) return;
      //     try {
      //       const parsed = JSON.parse(raw);
      //       setStudyData(parsed);

      //       // Auto-select first course
      //       const firstCourse =
      //         parsed.mode === "topic"
      //           ? Object.entries(parsed.topics)
      //               .flatMap(([subject, topics]) => topics.map((topic) => ({ subject, topic })))[0]
      //           : parsed.mode === "subject"
      //           ? { subject: parsed.subjects[0] }
      //           : null;

      //       if (firstCourse) setSelectedCourse(firstCourse);
      //     } catch {
      //       setStudyData(null);
      //     }
      //   }, []);

      //   if (!studyData) {
      //     return (
      //       <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
      //         <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
      //           No study selections found — please set up your study first.
      //         </p>
      //       </div>
      //     );
      //   }

      //   // Mock questions
      // const mockQuestions = {
      //   Maths: [
      //     { 
      //       id: 1,
      //       question: "What is the square root of 144?",
      //       options: ["10", "11", "12", "13"],
      //       correct: "12",
      //       explanation: "The square root of 144 is 12 because 12 × 12 = 144."
      //     },
      //     {
      //       id: 2,
      //       question: "Simplify: 2x + 3x - 4",
      //       options: ["5x - 4", "6x", "x + 4", "4x - 5"],
      //       correct: "5x - 4",
      //       explanation: "2x + 3x = 5x, then subtract 4 → 5x − 4."
      //     },
      //     {
      //       id: 3,
      //       question: "If x = 2, what is 3x²?",
      //       options: ["6", "9", "12", "8"],
      //       correct: "12",
      //       explanation: "x² = 4 → 3 × 4 = 12."
      //     },
      //   ],

      //   English: [
      //     { 
      //       id: 1,
      //       question: "Which of these is a synonym of ‘happy’?",
      //       options: ["Sad", "Joyful", "Angry", "Tired"],
      //       correct: "Joyful",
      //       explanation: "A synonym means similar meaning. Joyful means happy."
      //     },
      //     {
      //       id: 2,
      //       question: "Which sentence is correct?",
      //       options: ["He go to school every day.", "He goes to school every day.", "He going to school every day.", "He gone to school every day."],
      //       correct: "He goes to school every day.",
      //       explanation: "For singular (he/she/it), we add 's' → goes."
      //     },
      //   ],

      //   Physics: [
      //     { 
      //       id: 1,
      //       question: "What is the SI unit of force?",
      //       options: ["Pascal", "Joule", "Newton", "Watt"],
      //       correct: "Newton",
      //       explanation: "Force is measured in Newton, named after Isaac Newton."
      //     },
      //     {
      //       id: 2,
      //       question: "What is acceleration due to gravity on Earth?",
      //       options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "12 m/s²"],
      //       correct: "9.8 m/s²",
      //       explanation: "Standard gravitational acceleration is 9.8 m/s²."
      //     },
      //   ]
      // };


      //   const getQuestions = () => {
      //     const topic = selectedCourse?.topic || selectedCourse?.subject;
      //     return mockQuestions[topic] || [];
      //   };

      //   const questions = getQuestions();

      //   const handleSelectOption = (option) => setSelectedOption(option);

      //   const nextQuestion = () => {
      //     if (currentQuestion < questions.length - 1) {
      //       setCurrentQuestion(currentQuestion + 1);
      //       setSelectedOption(null);
      //     }
      //   };

      //   const prevQuestion = () => {
      //     if (currentQuestion > 0) {
      //       setCurrentQuestion(currentQuestion - 1);
      //       setSelectedOption(null);
      //     }
      //   };

      //   return (
      //     <section>
      //       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 pb-20">

      //         {/* FIXED TOP NAVBAR */}
      //         <div className="w-full fixed top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm">
      //           <div className="px-4 py-2">
      //             <TopNav />
      //           </div>
      //           <hr />

      //         {/* SUBJECTS ROW */}
      //         <div className="relative">
      //           {/* SUBJECT BUTTONS */}
      //        <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2">
      //         {studyData.mode === "topic" && studyData.topics
      //         ? Object.keys(studyData.topics).map((subject) => {
      //           const isSelected = selectedCourse?.subject === subject && !selectedCourse?.topic;
      //           return (
      //             <button
      //               key={subject}
      //               onClick={() => {
      //                 setExpandedSubject(expandedSubject === subject ? null : subject);
      //                 setSelectedCourse({ subject });
      //                 setCurrentQuestion(0);
      //                 setSelectedOption(null);
      //               }}
      //               className={`flex-shrink-0 px-4 py-2 rounded font-semibold whitespace-nowrap transition ${
      //                 isSelected
      //                   ? "bg-blue-600 text-white shadow-md flex-1 text-center"
      //                   : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
      //               }`}
      //             >
      //               {subject} ▼
      //             </button>
      //           );
      //         })
      //     : studyData.subjects?.map((subject) => {
      //         const isSelected = selectedCourse?.subject === subject;
      //         return (
      //           <button
      //             key={subject}
      //             onClick={() => {
      //               setSelectedCourse({ subject });
      //               setCurrentQuestion(0);
      //               setSelectedOption(null);c
      //             }}
      //             className={`flex-shrink-0 px-4 py-2 rounded-md font-semibold whitespace-nowrap transition ${
      //               isSelected
      //                 ? "bg-blue-600 text-white shadow-md flex-1 text-center"
      //                 : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
      //             }`}
      //           >
      //             {subject}
      //           </button>
      //         );
      //       })}
      // </div>


      //           {/* 👉 FLOATING DROPDOWN (SEPARATE FROM BUTTONS) */}
      //           {expandedSubject && studyData.topics?.[expandedSubject] && (
      //             <div className="absolute left-4 mt-1 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-2xl z-[300] w-56">
      //               <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
      //                 Topics
      //               </h4>

      //               <div className="flex flex-col gap-2">
      //                 {studyData.topics[expandedSubject].map((topic) => (
      //                   <button
      //                     key={topic}
      //                     onMouseEnter={() => {
      //                       setSelectedCourse({ subject: expandedSubject, topic });
      //                       setCurrentQuestion(0);
      //                       setSelectedOption(null);
      //                       setExpandedSubject(null);
      //                     }}
      //                     className={`px-3 py-2 flex flex-1 rounded-lg text-sm font-medium transition text-left ${
      //                       selectedCourse?.topic === topic
      //                         ? "bg-blue-600 text-white shadow-md"
      //                         : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
      //                     }`}
      //                   >
      //                     {topic}
      //                   </button>
      //                 ))}
      //               </div>
      //             </div>
      //           )}
      //         </div>

      //         </div>

      //         {/* MAIN CONTENT */}
      //         <main className="max-w-6xl mx-auto px-4 pt-32 py-8 border-2">
      //         <div className="py-2 px-6 bg-blue-50 dark:bg-gray-800 rounded-lg shadow-sm border border-blue-200 dark:border-blue-700">
      //           <span className="text-red-600 dark:text-blue-400 font-semibold text-xl">
      //             {user?.firstName
      //               ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
      //               : "User"}{"! "}
      //               <span  className="text-primary-hover dark:text-blue-400 font-semibold text-xl"> In Learning Mode</span>
      //           </span>
      //         </div>


      //           {/* RETURN TO DASHBOARD ON NEXT LINE */}
      //           <div className="w-full flex justify-end px- pb-2 mt-2">
      //             <button
      //               onClick={() => navigate("/user/dashboard")}
      //               className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 underline text-white px-2 py-1 rounded-md  
      //                text-[10px] font-semibold whitespace-nowrap"
      //             >
      //               <ArrowLeft size={18} />
      //               Return to Dashboard
      //             </button>
      //           </div>

      //           {!selectedCourse && <p className="text-center text-gray-500 mb-6 mt-4">Choose a topic to begin.</p>}

      //           {selectedCourse && (
      //             <div className="max-w-3xl mx-auto mt-4">
      //               {questions.length > 0 ? (
      //                 <>
      //                   <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      //                     <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
      //                       {selectedCourse.topic || selectedCourse.subject}
      //                     </h3>
      //                     <p className="text-md font-medium mb-4">{questions[currentQuestion].question}</p>
      //                     <div className="space-y-3">
      //                       {questions[currentQuestion].options.map((opt, i) => (
      //                         <button
      //                           key={i}
      //                           onClick={() => handleSelectOption(opt)}
      //                           className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-all duration-200 ${
      //                             selectedOption === opt
      //                               ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
      //                               : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      //                           }`}
      //                         >
      //                           <span>{opt}</span>
      //                           {selectedOption === opt && <CheckCircle className="w-5 h-5 text-blue-600" />}
      //                         </button>
      //                       ))}
      //                     </div>
      //                     <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
      //                       Question {currentQuestion + 1} of {questions.length}
      //                     </p>
      //                   </div>

      //                   {/* Question Navigation */}
      //                   <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto">
      //                     <button
      //                       onClick={prevQuestion}
      //                       disabled={currentQuestion === 0}
      //                       className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
      //                     >
      //                       <ChevronLeft className="w-4 h-4" /> Previous
      //                     </button>
      //                     <button
      //                       onClick={nextQuestion}
      //                       disabled={currentQuestion === questions.length - 1}
      //                       className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
      //                     >
      //                       Next <ChevronRight className="w-4 h-4" />
      //                     </button>
      //                   </div>
      //                 </>
      //               ) : (
      //                 <p className="text-center text-gray-500">No questions available for this topic yet.</p>
      //               )}
      //             </div>
      //           )}
      //         </main>
      //       </div>
      //     </section>
      //   );
      // }


      import React, { useEffect, useState, useRef } from "react";
      import { CheckCircle, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
      import { useNavigate } from "react-router-dom";
      import TopNav from "../components/DashboardComponents/TopNav";
      import useAuthStore from "../store/authStore";

      export default function CBTLearningPage() {

        const user = useAuthStore((state) => state.user);
        const checkAuth = useAuthStore((state) => state.checkAuth);

        useEffect(() => {
          checkAuth(); 
        }, []);

        const navigate = useNavigate();
        const [studyData, setStudyData] = useState(null);
        const [selectedCourse, setSelectedCourse] = useState(null);
        const [currentQuestion, setCurrentQuestion] = useState(0);
        const [selectedOption, setSelectedOption] = useState(null);
        const [expandedSubject, setExpandedSubject] = useState(null);

        // NEW
        const [showExplanation, setShowExplanation] = useState(false);

        useEffect(() => {
          const raw = localStorage.getItem("studySelections");
          if (!raw) return;
          try {
            const parsed = JSON.parse(raw);
            setStudyData(parsed);

            const firstCourse =
              parsed.mode === "topic"
                ? Object.entries(parsed.topics)
                    .flatMap(([subject, topics]) => topics.map((topic) => ({ subject, topic })))[0]
                : parsed.mode === "subject"
                ? { subject: parsed.subjects[0] }
                : null;

            if (firstCourse) setSelectedCourse(firstCourse);
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

        // UPDATED MOCK QUESTIONS WITH EXPLANATIONS
        const mockQuestions = {
          Maths: [
            { 
              id: 1,
              question: "What is the square root of 144?",
              options: ["10", "11", "12", "13"],
              correct: "12",
              explanation: "Because 12 × 12 = 144."
            },
            {
              id: 2,
              question: "Simplify: 2x + 3x - 4",
              options: ["5x - 4", "6x", "x + 4", "4x - 5"],
              correct: "5x - 4",
              explanation: "2x + 3x = 5x."
            },
            {
              id: 3,
              question: "If x = 2, what is 3x²?",
              options: ["6", "9", "12", "8"],
              correct: "12",
              explanation: "3 × (2²) = 3 × 4 = 12."
            },
          ],
          English: [
            { 
              id: 1,
              question: "Which of these is a synonym of ‘happy’?",
              options: ["Sad", "Joyful", "Angry", "Tired"],
              correct: "Joyful",
              explanation: "Joyful shares the same meaning as happy."
            },
            {
              id: 2,
              question: "Which sentence is correct?",
              options: ["He go to school every day.", "He goes to school every day.", "He going to school every day.", "He gone to school every day."],
              correct: "He goes to school every day.",
              explanation: "With he/she/it we add 's': goes."
            },
          ],
          Physics: [
            { 
              id: 1,
              question: "What is the SI unit of force?",
              options: ["Pascal", "Joule", "Newton", "Watt"],
              correct: "Newton",
              explanation: "Force is measured in Newton."
            },
            {
              id: 2,
              question: "What is acceleration due to gravity on Earth?",
              options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "12 m/s²"],
              correct: "9.8 m/s²",
              explanation: "Standard gravitational acceleration is 9.8 m/s²."
            },
          ],
        };

        const getQuestions = () => {
          const topic = selectedCourse?.topic || selectedCourse?.subject;
          return mockQuestions[topic] || [];
        };

        const questions = getQuestions();

        const handleSelectOption = (option) => setSelectedOption(option);

        // NEXT QUESTION WITH AUTO-MOVE TO NEXT TOPIC/SUBJECT
        const nextQuestion = () => {
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setShowExplanation(false);
            return;
          }

          // AUTO MOVE TO NEXT SUBJECT/TOPIC
          const queue = [];

          if (studyData.mode === "topic") {
            Object.entries(studyData.topics).forEach(([subject, topics]) => {
              topics.forEach((topic) => queue.push({ subject, topic }));
            });
          } else {
            studyData.subjects.forEach((subject) => queue.push({ subject }));
          }

          const currentIndex = queue.findIndex(
            (item) =>
              item.subject === selectedCourse.subject &&
              (item.topic || null) === (selectedCourse.topic || null)
          );

          if (queue[currentIndex + 1]) {
            setSelectedCourse(queue[currentIndex + 1]);
            setCurrentQuestion(0);
            setSelectedOption(null);
            setShowExplanation(false);
          }
        };

        const prevQuestion = () => {
          if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            setSelectedOption(null);
            setShowExplanation(false);
          }
        };

        return (
          <section>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 pb-20">

              {/* TOP NAV */}
              <div className="w-full fixed top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm">
                <div className="px-4 py-2">
                  <TopNav />
                </div>
                <hr />

                {/* SUBJECTS ROW */}
                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2">
                    {studyData.mode === "topic" && studyData.topics
                      ? Object.keys(studyData.topics).map((subject) => {
                          const isSelected = selectedCourse?.subject === subject && !selectedCourse?.topic;
                          return (
                            <button
                              key={subject}
                              onClick={() => {
                                setExpandedSubject(expandedSubject === subject ? null : subject);
                                setSelectedCourse({ subject });
                                setCurrentQuestion(0);
                                setSelectedOption(null);
                              }}
                              title="Select subject"
                              className={`flex-shrink-0 px-4 py-2 rounded font-semibold whitespace-nowrap transition ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-md flex-1 text-center"
                                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                              }`}
                            >
                              {subject} ▼
                            </button>
                          );
                        })
                      : studyData.subjects?.map((subject) => {
                          const isSelected = selectedCourse?.subject === subject;
                          return (
                            <button
                              key={subject}
                              onClick={() => {
                                setSelectedCourse({ subject });
                                setCurrentQuestion(0);
                                setSelectedOption(null);
                              }}
                              title="Select subject"
                              className={`flex-shrink-0 px-4 py-2 rounded-md font-semibold whitespace-nowrap transition ${
                                isSelected
                                  ? "bg-blue-600 text-white shadow-md flex-1 text-center"
                                  : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                              }`}
                            >
                              {subject}
                            </button>
                          );
                        })}
                  </div>

                  {/* FLOATING TOPIC DROPDOWN */}
                  {expandedSubject && studyData.topics?.[expandedSubject] && (
                    <div className="absolute left-4 mt-1 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-2xl z-[300] w-56">
                      <h4 className="text-sm font-semibold mb-2">Topics</h4>

                      <div className="flex flex-col gap-2">
                        {studyData.topics[expandedSubject].map((topic) => (
                          <button
                            key={topic}
                            onClick={() => {
                              setSelectedCourse({ subject: expandedSubject, topic });
                              setCurrentQuestion(0);
                              setSelectedOption(null);
                              setExpandedSubject(null);
                            }}
                            title="Select topic"
                            className={`px-3 py-2 rounded-lg text-sm transition text-left ${
                              selectedCourse?.topic === topic
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            }`}
                          >
                            {topic}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* MAIN CONTENT */}
              <main className="max-w-6xl mx-auto px-4 pt-32 py-8">

                <div className="py-2 px-6 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
                  <span className="text-red-600 dark:text-blue-400 font-semibold text-xl">
                    {user?.firstName
                      ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
                      : "User"}{" "}
                    <span className="text-primary-hover dark:text-blue-400 font-semibold text-xl">is in Learning Mode</span>
                  </span>
                </div>

                <div className="w-full flex justify-end mt-2">
                  <button
                    onClick={() => navigate("/user/dashboard")}
                    title="Return to your dashboard"
                    className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 underline text-white px-2 py-1 rounded-md text-[10px] font-semibold"
                  >
                    <ArrowLeft size={18} />
                    Return to Dashboard
                  </button>
                </div>

                {!selectedCourse && (
                  <p className="text-center text-gray-500 mt-4">Choose a topic to begin.</p>
                )}

                {selectedCourse && (
                  <div className="max-w-3xl mx-auto mt-4">
                    {questions.length > 0 ? (
                      <>
                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">

                          <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                            {selectedCourse.topic || selectedCourse.subject}
                          </h3>

                          <p className="text-md font-medium mb-6">{questions[currentQuestion].question}</p>

                          <div className="space-y-3">
                            {questions[currentQuestion].options.map((opt, i) => (
                              <button
                                key={i}
                                onClick={() => handleSelectOption(opt)}
                                title="Select this answer"
                                className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-all duration-200 ${
                                  selectedOption === opt
                                    ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                                    : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                                }`}
                              >
                                <span>{opt}</span>
                                {selectedOption === opt && <CheckCircle className="w-5 h-5 text-blue-600" />}
                              </button>
                            ))}
                          </div>

                          {/* EXPLANATION SECTION */}
                          <div className="mt-6">
                            <button
                              onClick={() => setShowExplanation(!showExplanation)}
                              className="text-blue-600 dark:text-blue-400 underline text-sm"
                              title="Show explanation"
                            >
                              {showExplanation ? "Hide Explanation" : "Show Explanation"}
                            </button>

                            {showExplanation && (
                              <div className="mt-3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
                                {questions[currentQuestion].explanation}
                              </div>
                            )}
                          </div>

                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                            Question {currentQuestion + 1} of {questions.length}
                          </p>
                        </div>

                        <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto">
                          <button
                            onClick={prevQuestion}
                            disabled={currentQuestion === 0}
                            title="Previous question"
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                          >
                            <ChevronLeft className="w-4 h-4" /> Previous
                          </button>

                          <button
                            onClick={nextQuestion}
                            disabled={currentQuestion === questions.length - 1}
                            title="Next question"
                            className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                          >
                            Next <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-gray-500">No questions available for this topic yet.</p>
                    )}
                  </div>
                )}
              </main>
            </div>

            {/* FLOATING CHAT ICON */}
            <button
              title="Need help?"
              className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition z-[500]"
            >
              💬
            </button>

          </section>
        );
      }
