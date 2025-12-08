// import React, { useEffect, useState } from "react";
// import { CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
// import PageNav from "../../components/DashboardComponents/PageNav";
// import useAuthStore from "../../store/authStore";

// export default function CBTLearningPage() {
//   const user = useAuthStore((state) => state.user);
//   const checkAuth = useAuthStore((state) => state.checkAuth);
//   const { accessToken } = useAuthStore();

//   // ------------------- STATE -------------------
//   const [studyData, setStudyData] = useState(null); // localStorage payload
//   const [selectedCourse, setSelectedCourse] = useState({ 
//     id: null, 
//     name: null, 
//     type: null, // 'subject' or 'topic'
//     parentSubject: null // for topics only
//   }); // active subject/topic
//   const [questions, setQuestions] = useState([]); // questions for the current course
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedOption, setSelectedOption] = useState(null);
//   const [expandedSubject, setExpandedSubject] = useState(null); // topic dropdown UI
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [navProps, setNavProps] = useState({ exams: "", mood: "" });
//   const [loadingQuestions, setLoadingQuestions] = useState(false);
//   const [subjectMap, setSubjectMap] = useState({}); // Map subject IDs to names
//   const [topicMap, setTopicMap] = useState({}); // Map topic IDs to names and parent subjects

//   // ------------------- AUTH CHECK -------------------
//   useEffect(() => {
//     checkAuth();
//   }, []);

//   // ------------------- LOAD LOCALSTORAGE -------------------
//   useEffect(() => {
//     console.log("CBTLearningPage: Loading localStorage data...");
//     const raw = localStorage.getItem("studySelections");
    
//     if (!raw) {
//       console.warn("No study selections found in localStorage");
//       return;
//     }
    
//     try {
//       const parsed = JSON.parse(raw);
//       console.log("Parsed study data:", parsed);
//       setStudyData(parsed);

//       // Update top nav
//       setNavProps({
//         exams: parsed.exam || "WAEC",
//         mood: parsed.mode === "topic" || parsed.mode === "subject" ? "Learning" : "",
//       });

//       // Initialize first course based on mode
//       if (parsed.mode === "subject" && parsed.subjects?.length > 0) {
//         const firstSubjectId = parsed.subjects[0];
//         setSelectedCourse({
//           id: firstSubjectId,
//           name: "Loading...", // Will be updated when we fetch subject details
//           type: "subject",
//           parentSubject: null
//         });
//       } else if (parsed.mode === "topic" && parsed.topics) {
//         // Find first subject and its first topic
//         const subjects = Object.keys(parsed.topics);
//         if (subjects.length > 0) {
//           const firstSubject = subjects[0];
//           const firstTopicId = parsed.topics[firstSubject][0];
//           setSelectedCourse({
//             id: firstTopicId,
//             name: "Loading...",
//             type: "topic",
//             parentSubject: firstSubject
//           });
//         }
//       }
//     } catch (err) {
//       console.error("Failed to parse study selections:", err);
//       setStudyData(null);
//     }
//   }, []);

//   // ------------------- FETCH QUESTIONS -------------------
//   const fetchQuestions = async (course) => {
//     console.log("Fetching questions for course:", course);
    
//     if (!course || !course.id) {
//       console.warn("No valid course selected for fetchQuestions");
//       return;
//     }
    
//     if (!studyData) {
//       console.warn("No studyData available");
//       return;
//     }
    
//     if (!accessToken) {
//       console.error("No accessToken - cannot fetch questions!");
//       return;
//     }

//     setLoadingQuestions(true);
//     let url = "";
//     const category = studyData.category || studyData.exam || "WAEC";

//     try {
//       // SUBJECT MODE
//       if (studyData.mode === "subject") {
//         const subjectId = course.id;
//         const year = studyData.subjectYears?.[subjectId];
        
//         console.log(`Subject Mode - ID: ${subjectId}, Year: ${year}, Category: ${category}`);
        
//         if (year && year !== "random") {
//           url = `https://fillops-server-5fuf.onrender.com/api/subjects/${subjectId}/questions?category=${category}&year=${year}`;
//         } else {
//           url = `https://fillops-server-5fuf.onrender.com/api/subjects/${subjectId}/questions?random=true`;
//         }
//       }
      
//       // TOPIC MODE
//       else if (studyData.mode === "topic") {
//         const topicId = course.id;
//         // Find year for this specific topic
//         let year = "random";
//         if (studyData.topicYears && course.parentSubject) {
//           year = studyData.topicYears[course.parentSubject]?.[topicId] || "random";
//         }
        
//         console.log(`Topic Mode - ID: ${topicId}, Year: ${year}, Category: ${category}`);
        
//         if (year && year !== "random") {
//           url = `https://fillops-server-5fuf.onrender.com/api/topics/${topicId}/questions?category=${category}&year=${year}`;
//         } else {
//           url = `https://fillops-server-5fuf.onrender.com/api/topics/${topicId}/questions?random=true`;
//         }
//       }

//       console.log("Fetching from URL:", url);

//       const response = await fetch(url, {
//         headers: { 
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json'
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
//       }
      
//       const data = await response.json();
//       console.log("Fetched response:", data);

//       // Handle different response structures
//       let questionsArray = [];
      
//       if (studyData.mode === "subject") {
//         // Subject endpoint returns subject object with questions array
//         if (data && data.question) {
//           questionsArray = data.question;
//           // Update course name from response
//           if (data.subjectName) {
//             setSelectedCourse(prev => ({
//               ...prev,
//               name: data.subjectName
//             }));
//             // Update subject map
//             setSubjectMap(prev => ({
//               ...prev,
//               [course.id]: data.subjectName
//             }));
//           }
//         }
//       } else if (studyData.mode === "topic") {
//         // Topic endpoint returns topic object with questions array
//         if (data && data.question) {
//           questionsArray = data.question;
//           // Update course name from response
//           if (data.topicName) {
//             setSelectedCourse(prev => ({
//               ...prev,
//               name: data.topicName
//             }));
//             // Update topic map
//             setTopicMap(prev => ({
//               ...prev,
//               [course.id]: {
//                 name: data.topicName,
//                 parentSubject: data.module?.subject?.subjectName || course.parentSubject
//               }
//             }));
            
//             // Also update subject name if available
//             if (data.module?.subject?.subjectName) {
//               setSubjectMap(prev => ({
//                 ...prev,
//                 [data.module.subject.id || course.parentSubject]: data.module.subject.subjectName
//               }));
//             }
//           }
//         }
//       }

//       // Filter questions by category if needed
//       if (category && category !== "All") {
//         questionsArray = questionsArray.filter(q => q.category === category);
//       }

//       console.log(`Filtered questions: ${questionsArray.length} questions`);
//       setQuestions(questionsArray);
//       setCurrentQuestion(0);
//       setSelectedOption(null);
//       setShowExplanation(false);

//     } catch (err) {
//       console.error("Error fetching questions:", err);
//       setQuestions([]);
//     } finally {
//       setLoadingQuestions(false);
//     }
//   };

//   // ------------------- GET COURSE NAME -------------------
//   const getCourseDisplayName = (course) => {
//     if (!course) return "Select a course";
    
//     if (course.name && course.name !== "Loading...") {
//       return course.name;
//     }
    
//     // Fallback to maps
//     if (course.type === "subject") {
//       return subjectMap[course.id] || `Subject (${course.id.substring(0, 8)}...)`;
//     } else if (course.type === "topic") {
//       const topicInfo = topicMap[course.id];
//       if (topicInfo) {
//         return topicInfo.name;
//       }
//       return `Topic (${course.id.substring(0, 8)}...)`;
//     }
    
//     return "Loading...";
//   };

//   // ------------------- SELECT OPTION -------------------
//   const handleSelectOption = (option) => {
//     setSelectedOption(option);
//     // Optional: Check if correct and show immediate feedback
//     const currentQ = questions[currentQuestion];
//     if (currentQ && option === currentQ.correctAnswer) {
//       console.log("Correct!");
//     }
//   };

//   // ------------------- NEXT QUESTION -------------------
//   const nextQuestion = () => {
//     if (currentQuestion < questions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//       setSelectedOption(null);
//       setShowExplanation(false);
//       return;
//     }

//     // Auto move to next course
//     if (!studyData) return;
    
//     const queue = [];
    
//     // Build queue based on mode
//     if (studyData.mode === "subject") {
//       studyData.subjects.forEach(subjectId => {
//         queue.push({
//           id: subjectId,
//           type: "subject",
//           parentSubject: null
//         });
//       });
//     } else if (studyData.mode === "topic" && studyData.topics) {
//       Object.entries(studyData.topics).forEach(([subjectId, topicIds]) => {
//         topicIds.forEach(topicId => {
//           queue.push({
//             id: topicId,
//             type: "topic",
//             parentSubject: subjectId
//           });
//         });
//       });
//     }

//     // Find current position
//     const currentIndex = queue.findIndex(
//       item => item.id === selectedCourse.id
//     );

//     console.log(`Current index: ${currentIndex}, Queue length: ${queue.length}`);

//     if (currentIndex < queue.length - 1) {
//       const nextCourse = queue[currentIndex + 1];
//       setSelectedCourse({
//         id: nextCourse.id,
//         name: "Loading...",
//         type: nextCourse.type,
//         parentSubject: nextCourse.parentSubject
//       });
//       // fetchQuestions will be triggered by useEffect
//     } else {
//       console.log("🎉 All courses completed!");
//       // Optional: Show completion message
//       alert("Congratulations! You've completed all selected courses.");
//     }
//   };

//   // ------------------- PREVIOUS QUESTION -------------------
//   const prevQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//       setSelectedOption(null);
//       setShowExplanation(false);
//     }
//   };

//   // ------------------- FETCH QUESTIONS ON COURSE CHANGE -------------------
//   useEffect(() => {
//     if (selectedCourse.id) {
//       fetchQuestions(selectedCourse);
//     }
//   }, [selectedCourse.id, studyData?.category]);

//   // ------------------- RENDER -------------------
//   if (!studyData) {
//     return (
//       <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
//         <div className="text-center">
//           <p className="text-gray-600 dark:text-gray-400 text-lg mb-4">
//             No study selections found
//           </p>
//           <button
//             onClick={() => window.location.href = "/dashboard"}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQ = questions[currentQuestion];

//   return (
//     <section className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 text-gray-800 dark:text-gray-100 pb-20">
//       {/* TOP NAV */}
//       <div className="w-full fixed top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-300 dark:border-gray-700 shadow-sm">
//         <PageNav exams={navProps.exams} mood={navProps.mood} />

//         {/* COURSE SELECTOR */}
//         <div className="px-4 py-3">
//           <div className="flex items-center gap-2 overflow-x-auto pb-2">
//             {/* Subject Mode */}
//             {studyData.mode === "subject" && studyData.subjects?.map((subjectId) => {
//               const isActive = selectedCourse.id === subjectId;
//               const displayName = subjectMap[subjectId] || `Subject (${subjectId.substring(0, 6)}...)`;
              
//               return (
//                 <button
//                   key={subjectId}
//                   onClick={() => setSelectedCourse({
//                     id: subjectId,
//                     name: subjectMap[subjectId] || "Loading...",
//                     type: "subject",
//                     parentSubject: null
//                   })}
//                   className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
//                     isActive 
//                       ? "bg-blue-600 text-white shadow-lg transform scale-105" 
//                       : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
//                   }`}
//                 >
//                   {displayName}
//                 </button>
//               );
//             })}

//             {/* Topic Mode */}
//             {studyData.mode === "topic" && studyData.topics && 
//               Object.entries(studyData.topics).map(([subjectId, topicIds]) => {
//                 const subjectName = subjectMap[subjectId] || `Subject (${subjectId.substring(0, 6)}...)`;
                
//                 return (
//                   <div key={subjectId} className="relative">
//                     <button
//                       onClick={() => setExpandedSubject(expandedSubject === subjectId ? null : subjectId)}
//                       className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
//                         expandedSubject === subjectId || selectedCourse.parentSubject === subjectId
//                           ? "bg-purple-600 text-white shadow-lg"
//                           : "bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
//                       }`}
//                     >
//                       {subjectName} ▼
//                     </button>

//                     {/* Topic Dropdown */}
//                     {expandedSubject === subjectId && (
//                       <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-900 p-3 rounded-lg shadow-xl z-50 w-64 border border-gray-300 dark:border-gray-700">
//                         <h4 className="text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300">
//                           Topics for {subjectName}
//                         </h4>
//                         <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
//                           {topicIds.map((topicId) => {
//                             const topicInfo = topicMap[topicId];
//                             const isActive = selectedCourse.id === topicId;
                            
//                             return (
//                               <button
//                                 key={topicId}
//                                 onClick={() => {
//                                   setSelectedCourse({
//                                     id: topicId,
//                                     name: topicInfo?.name || "Loading...",
//                                     type: "topic",
//                                     parentSubject: subjectId
//                                   });
//                                   setExpandedSubject(null);
//                                 }}
//                                 className={`px-3 py-2 rounded text-left transition ${
//                                   isActive
//                                     ? "bg-blue-600 text-white"
//                                     : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
//                                 }`}
//                               >
//                                 {topicInfo?.name || `Topic (${topicId.substring(0, 8)}...)`}
//                               </button>
//                             );
//                           })}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                 );
//               })
//             }
//           </div>
          
//           {/* Selected Course Info */}
//           {selectedCourse.id && (
//             <div className="mt-2 px-2">
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 Currently studying: <span className="font-semibold text-blue-600 dark:text-blue-400">
//                   {getCourseDisplayName(selectedCourse)}
//                 </span>
//                 {selectedCourse.type === "topic" && selectedCourse.parentSubject && (
//                   <span className="ml-2 text-gray-500 dark:text-gray-500">
//                     (under {subjectMap[selectedCourse.parentSubject] || "Subject"})
//                   </span>
//                 )}
//               </p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <main className="max-w-6xl mx-auto px-4 pt-36 pb-8">
//         {/* Course Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
//             {getCourseDisplayName(selectedCourse)}
//           </h1>
//           <p className="text-gray-600 dark:text-gray-400">
//             {studyData.mode === "subject" ? "Subject Questions" : "Topic Questions"} • {studyData.exam || "WAEC"}
//           </p>
//         </div>

//         {/* Questions Area */}
//         <div className="max-w-4xl mx-auto">
//           {loadingQuestions ? (
//             <div className="flex flex-col justify-center items-center py-20">
//               <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
//               <p className="text-gray-600 dark:text-gray-400">Loading questions...</p>
//             </div>
//           ) : questions.length > 0 ? (
//             <>
//               {/* Question Card */}
//               <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-200 dark:border-gray-700">
//                 {/* Question Counter */}
//                 <div className="flex justify-between items-center mb-6">
//                   <div className="flex items-center gap-2">
//                     <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium">
//                       Question {currentQuestion + 1} of {questions.length}
//                     </span>
//                     {currentQ.year && (
//                       <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-sm">
//                         {currentQ.year} Year
//                       </span>
//                     )}
//                   </div>
//                   <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-300 rounded-full text-sm font-medium">
//                     {currentQ.difficulty || "Standard"}
//                   </span>
//                 </div>

//                 {/* Question Text */}
//                 <p className="text-xl font-medium mb-8 leading-relaxed text-gray-800 dark:text-gray-100">
//                   {currentQ.text}
//                 </p>

//                 {/* Options */}
//                 <div className="space-y-4 mb-8">
//                   {currentQ.options.map((opt, i) => {
//                     const letters = ['A', 'B', 'C', 'D'];
//                     const isSelected = selectedOption === opt;
//                     const isCorrect = currentQ.correctAnswer === opt;
                    
//                     return (
//                       <button
//                         key={i}
//                         onClick={() => handleSelectOption(opt)}
//                         className={`w-full flex items-center justify-between p-5 rounded-xl transition-all duration-300 ${
//                           isSelected
//                             ? isCorrect
//                               ? "border-2 border-green-500 bg-green-50 dark:bg-green-900/20"
//                               : "border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20"
//                             : "border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 hover:bg-gray-50 dark:hover:bg-gray-700/50"
//                         }`}
//                       >
//                         <div className="flex items-center gap-4">
//                           <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold ${
//                             isSelected
//                               ? isCorrect
//                                 ? "bg-green-500 text-white"
//                                 : "bg-blue-500 text-white"
//                               : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
//                           }`}>
//                             {letters[i]}
//                           </div>
//                           <span className="text-lg text-left">{opt}</span>
//                         </div>
//                         {isSelected && (
//                           <CheckCircle className={`w-6 h-6 ${
//                             isCorrect ? "text-green-500" : "text-blue-500"
//                           }`} />
//                         )}
//                       </button>
//                     );
//                   })}
//                 </div>

//                 {/* Explanation Section */}
//                 <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
//                   <button
//                     onClick={() => setShowExplanation(!showExplanation)}
//                     className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium"
//                   >
//                     <span>{showExplanation ? "Hide Explanation" : "Show Explanation"}</span>
//                     <ChevronRight className={`w-4 h-4 transition-transform ${showExplanation ? "rotate-90" : ""}`} />
//                   </button>

//                   {showExplanation && (
//                     <div className="mt-4 p-4 border border-blue-200 dark:border-blue-800 rounded-lg bg-blue-50/50 dark:bg-blue-900/20">
//                       <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-2">Explanation:</h4>
//                       <p className="text-gray-700 dark:text-gray-300">
//                         {currentQ.explanation || 
//                           `This question is from the ${currentQ.year || "current"} ${studyData.exam || "WAEC"} exam.`}
//                       </p>
//                       {currentQ.correctAnswer && (
//                         <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded border border-green-200 dark:border-green-800">
//                           <span className="font-semibold text-green-700 dark:text-green-300">Correct Answer:</span>
//                           <span className="ml-2 text-green-600 dark:text-green-400">{currentQ.correctAnswer}</span>
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Navigation Controls */}
//               <div className="flex justify-between items-center px-4">
//                 <button
//                   onClick={prevQuestion}
//                   disabled={currentQuestion === 0}
//                   className="flex items-center gap-3 px-6 py-3 rounded-xl bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
//                 >
//                   <ChevronLeft className="w-5 h-5" />
//                   Previous
//                 </button>

//                 <div className="flex items-center gap-4">
//                   <span className="text-gray-600 dark:text-gray-400 text-sm">
//                     {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
//                   </span>
//                   <button
//                     onClick={nextQuestion}
//                     disabled={questions.length === 0}
//                     className="flex items-center gap-3 px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg"
//                   >
//                     {currentQuestion < questions.length - 1 ? "Next Question" : "Next Topic"}
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>

//               {/* Progress Bar */}
//               <div className="mt-8 px-4">
//                 <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
//                   <div 
//                     className="bg-gradient-to-r from-blue-500 to-blue-400 h-2.5 rounded-full transition-all duration-300"
//                     style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
//                   ></div>
//                 </div>
//                 <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
//                   <span>Start</span>
//                   <span>{currentQuestion + 1} / {questions.length}</span>
//                   <span>End</span>
//                 </div>
//               </div>
//             </>
//           ) : (
//             <div className="text-center py-20">
//               <div className="w-24 h-24 mx-auto mb-6 text-gray-400 dark:text-gray-600">
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
//                 No Questions Available
//               </h3>
//               <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
//                 No questions found for this {selectedCourse.type === "topic" ? "topic" : "subject"} 
//                 with the selected filters. Try a different year or check back later.
//               </p>
//               <button
//                 onClick={() => fetchQuestions(selectedCourse)}
//                 className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
//               >
//                 Try Again
//               </button>
//             </div>
//           )}
//         </div>
//       </main>

//       {/* FLOATING CHAT BUTTON */}
//       <button
//         className="fixed bottom-8 right-8 bg-gradient-to-r from-blue-600 to-blue-500 text-white p-5 rounded-full shadow-2xl hover:shadow-3xl hover:scale-110 transition-all duration-300 z-[500]"
//         title="Need help? Ask our AI tutor"
//         onClick={() => console.log("Open chat")}
//       >
//         <span className="text-2xl">🤖</span>
//       </button>

//       {/* DEBUG INFO (Remove in production) */}
//       {process.env.NODE_ENV === 'development' && (
//         <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs max-w-xs z-[500]">
//           <div><strong>Mode:</strong> {studyData.mode}</div>
//           <div><strong>Course ID:</strong> {selectedCourse.id?.substring(0, 12)}...</div>
//           <div><strong>Questions:</strong> {questions.length}</div>
//           <div><strong>Current:</strong> {currentQuestion + 1}</div>
//         </div>
//       )}
//     </section>
//   );
// }


// import { useEffect, useState } from "react";
// import useAuthStore from "../../store/authStore";

// export default function StudyPage() {
//   const { accessToken } = useAuthStore();
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     loadQuestions();
//   }, []);

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

//       // Extract subjectId from subjects array
//       const subjectId = saved.subjects?.[0];
//       console.log("📘 Extracted subjectId:", subjectId);

//       if (!subjectId) {
//         console.warn("❌ No subject ID found inside local storage");
//         setLoading(false);
//         return;
//       }

//       console.log(`🌍 Calling backend: GET /subjects/${subjectId}`);

//       const response = await fetch(
//         `https://fillops-server-5fuf.onrender.com/api/subjects/${subjectId}`, {
//           headers: { Authorization: `Bearer ${accessToken}` },
//         }
//       );

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }

//       const subjectObj = await response.json();
//       console.log("📥 Full backend response:", subjectObj);
//       console.log("📥 Full backend response:", subjectObj.data);
      

//       // Extract all questions from subject
//       const allQuestions = subjectObj.data.question || [];
//       console.log(`📝 Extracted ${allQuestions.length} questions from subject.`);

//       // Format the questions
//       const formatted = allQuestions.map((q, index) => {
//         console.log(`➡️ Formatting Question ${index + 1}:`, q);

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
//       console.error("❌ Error while loading subject questions:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <p>Loading questions...</p>;

//   return (
//     <div className="p-4">
//       <h1 className="text-xl font-bold mb-4">Subject Questions</h1>

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

//             {/* OPTIONS */}
//             {q.options?.map((opt, i) => (
//               <p key={i} className="ml-4">
//                 {String.fromCharCode(65 + i)}. {opt}
//               </p>
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
// import useAuthStore from "../../store/authStore";

// export default function StudyPage() {
//   const { accessToken } = useAuthStore();
//   const [questions, setQuestions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedOptions, setSelectedOptions] = useState({}); // Track selected radio per question

//   useEffect(() => {
//     loadQuestions();
//   }, []);

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

//       // Extract subjectId
//       const subjectId = saved.subjects?.[0];
//       console.log("📘 Extracted subjectId:", subjectId);

//       if (!subjectId) {
//         console.warn("❌ No subject ID found inside local storage");
//         setLoading(false);
//         return;
//       }

//       // Extract filters from local storage
//       const category = saved.exam; // e.g., "WAEC"
//       let year = saved.subjectYears?.[subjectId]; // e.g., "2026"
//       console.log(`🎯 Using filters -> Category: ${category}, Year: ${year}`);

//       // Determine which endpoint to use
//       let url;
//       if (!year) {
//         // If year is missing or null, fetch random questions
//         console.warn("⚠️ Year not selected or missing, fetching random questions...");
//         url = `https://fillops-server-5fuf.onrender.com/api/subjects/${subjectId}/questions?random=true&category=${category}`;
//       } else {
//         // Fetch filtered by year
//         url = `https://fillops-server-5fuf.onrender.com/api/subjects/${subjectId}/questions?category=${category}&year=${year}`;
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
//         console.log(`➡️ Formatting Question ${index + 1}:`, q);
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
//       console.error("❌ Error while loading subject questions:", err);
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
//       <h1 className="text-xl font-bold mb-4">Subject Questions</h1>

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





import { useEffect, useState } from "react";
import useAuthStore from "../../store/authStore";

export default function StudyPage() {
  const { accessToken } = useAuthStore();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({}); // track selected radio per question

  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = async () => {
    try {
      console.log("➡️ Fetching local storage selection...");

      const saved = JSON.parse(localStorage.getItem("studySelections"));
      console.log("📦 Local Storage Data:", saved);

      if (!saved) {
        console.warn("⚠️ No saved selection found in local storage");
        setLoading(false);
        return;
      }

      let id, endpointType, year;

      // Determine if user selected topic(s) or subject(s)
      if (saved.topics?.length) {
        id = saved.topics[0];
        endpointType = "topics";
        year = saved.topicYears?.[id];
        console.log("📘 Using topic selection:", id, "Year:", year);
      } else if (saved.subjects?.length) {
        id = saved.subjects[0];
        endpointType = "subjects";
        year = saved.subjectYears?.[id];
        console.log("📘 Using subject selection:", id, "Year:", year);
      } else {
        console.warn("❌ No subject or topic ID found in local storage");
        setLoading(false);
        return;
      }

      const category = saved.exam; // e.g., "WAEC"
      console.log(`🎯 Using filters -> Category: ${category}, Year: ${year}`);

      // Build API URL
      let url;
      if (!year) {
        console.warn("⚠️ Year not selected or missing, fetching random questions...");
        url = `https://fillops-server-5fuf.onrender.com/api/${endpointType}/${id}/questions?random=true&category=${category}`;
      } else {
        url = `https://fillops-server-5fuf.onrender.com/api/${endpointType}/${id}/questions?category=${category}&year=${year}`;
      }

      console.log(`🌍 Fetching questions from: ${url}`);

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("📥 Backend response:", data);

      const allQuestions = data.data || [];
      console.log(`📝 Extracted ${allQuestions.length} questions.`);

      if (!year) {
        console.log("🎲 These are RANDOM questions because year was not selected.");
      }

      // Format questions
      const formatted = allQuestions.map((q, index) => {
        return {
          id: q.id,
          text: q.text,
          options: q.options,
          correctAnswer: q.correctAnswer,
          explanation: q.explanation,
          difficulty: q.difficulty,
          year: q.year,
          examType: q.category,
          moduleId: q.moduleId,
          topicId: q.topicId,
        };
      });

      console.log("🎉 Final formatted question list:", formatted);
      setQuestions(formatted);
    } catch (err) {
      console.error("❌ Error while loading questions:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle radio selection per question
  const handleOptionChange = (questionId, option) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: option }));
    console.log(`🖊 Selected option for ${questionId}: ${option}`);
  };

  if (loading) return <p>Loading questions...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Study Questions</h1>

      {questions.length === 0 ? (
        <p>No questions found.</p>
      ) : (
        questions.map((q, index) => (
          <div
            key={q.id}
            className="border border-gray-300 p-3 rounded-lg mb-4 shadow-sm"
          >
            <h2 className="font-semibold mb-2">
              {index + 1}. {q.text}
            </h2>

            {/* OPTIONS as RADIO buttons */}
            {q.options?.map((opt, i) => (
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

            <p className="text-blue-600 mt-1 text-sm">
              💡 Explanation: {q.explanation}
            </p>

            <p className="text-xs text-gray-500 mt-1">
              Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
            </p>
          </div>
        ))
      )}
    </div>
  );
}
