

// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useStudyStore } from "../../../../store/examStore";
// import InitializePayment from "../../../../payment/initializePayment";
// import { useToast } from "@/components/ui/use-toast";

// export default function QuestionCard() {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const {
//     currentIndex,
//     selectedOptions,
//     setSelectedOption,
//     next,
//     prev, // ✅ Use prev() instead of setCurrentIndex
//     loading,
//     paymentLocked,
//     getQuestions,
//     submitAnswer,
//     sessionActive,
//     endStudySession,
//   } = useStudyStore();

//   const questions = getQuestions();
//   const q = questions?.[currentIndex] ?? null;

//   const [visible, setVisible] = useState(false);
//   const [showExplanation, setShowExplanation] = useState(false);

//   const userChoice = q ? selectedOptions[q.id] : null;
//   const isCorrect = q && userChoice === q.correctAnswer;

//   // ✅ Only render question when allowed
//   const canRenderQuestion = !!q && !paymentLocked;

//   // ----------------------------
//   // Fade-in effect for question
//   // ----------------------------
//   useEffect(() => {
//     if (!canRenderQuestion) {
//       setVisible(false);
//       return;
//     }

//     setVisible(false);
//     const t = setTimeout(() => setVisible(true), 20);
//     return () => clearTimeout(t);
//   }, [currentIndex, canRenderQuestion]);

//   // ----------------------------
//   // Handle End Session
//   // ----------------------------
//   const handleEndSession = async () => {
//     try {
//       toast({
//         title: "Ending session...",
//         description: "Please wait while we process your request.",
//       });
//       await endStudySession();
//       toast({
//         title: "Success",
//         description: "Study session ended successfully!",
//       });
//       navigate("/user/dashboard");
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to end session. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ----------------------------
//   // Handle option selection with backend submission
//   // ----------------------------
//   const handleOptionSelect = async (option) => {
//     // Set the selected option in store
//     setSelectedOption(q.id, option);
//     setShowExplanation(false);

//     // Submit answer to backend if session is active
//     if (sessionActive) {
//       console.log("📤 Submitting answer to backend...");
//       const success = await submitAnswer(q.id, option);
//       if (success) {
//         console.log("✅ Answer submitted successfully");
//       } else {
//         console.warn("⚠️ Answer submission failed");
//       }
//     }
//   };

//   // ----------------------------
//   // Skeleton (ONLY when loading questions)
//   // ----------------------------
//   if ((loading || !q) && !paymentLocked) {
//     return (
//       <main className="p-4">
//         <div className="border border-gray-300 rounded-lg p-4 space-y-4 animate-pulse">
//           <div className="h-6 w-48 bg-gray-300 rounded-lg" />
//           <div className="h-12 bg-gray-300 rounded-lg" />
//           <div className="space-y-3">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="h-10 bg-gray-300 rounded-lg" />
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
    
//     <section className="py-0">
  
//       {/* Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
//         {/* ================= LEFT: QUESTION ================= */}
//         <main>
//           <div className="border border-gray-300 rounded-lg p-4">
//             {canRenderQuestion ? (
//               <div
//                 className={`transition-opacity duration-300 ${
//                   visible ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 {/* Question Header */}
//                 <div className="flex justify-between items-center mb-4">
//                   <h2 className="font-semibold">
//                     Question {currentIndex + 1} of {questions.length}
//                   </h2>
                  
//                   {/* Session Status Indicator with End Button */}
//                   {sessionActive && (
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
//                         <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
//                         Session Active
//                       </span>
//                       <button
//                         onClick={handleEndSession}
//                         className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
//                       >
//                         End Session
//                       </button>
//                     </div>
//                   )}
//                 </div>

//                 <p className="mb-4">{q.text}</p>

//                 {/* Options */}
//                 {Array.isArray(q.options) &&
//                   q.options.map((opt, i) => {
//                     const letter = String.fromCharCode(65 + i);

//                     let border = "border-gray-300";
//                     if (userChoice) {
//                       if (opt === q.correctAnswer) border = "border-green-600";
//                       else if (opt === userChoice) border = "border-red-600";
//                     }

//                     return (
//                       <label
//                         key={i}
//                         className={`flex items-center gap-2 p-2 mb-3 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${border}`}
//                       >
//                         <input
//                           type="radio"
//                           name={q.id}
//                           checked={userChoice === opt}
//                           onChange={() => handleOptionSelect(opt)}
//                           disabled={!!userChoice}
//                         />
//                         {letter}. {opt}
//                       </label>
//                     );
//                   })}

//                 {/* Answer Feedback */}
//                 {userChoice && (
//                   <>
//                     <p className={`mt-4 font-medium ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
//                       {isCorrect ? '✅' : '❌'} Correct Answer: {q.correctAnswer}
//                     </p>

//                     <button
//                       onClick={() => setShowExplanation((s) => !s)}
//                       className="text-sm underline text-blue-600 mt-2 hover:text-blue-800"
//                     >
//                       {showExplanation
//                         ? "Hide Explanation"
//                         : "Show Explanation"}
//                     </button>
//                   </>
//                 )}

//                 {/* Explanation */}
//                 {showExplanation && (
//                   <div className="mt-2 bg-blue-50 dark:bg-blue-900/20 p-3 rounded text-sm">
//                     <h4 className="font-semibold mb-1">Explanation:</h4>
//                     <p>{q.explanation}</p>
//                   </div>
//                 )}

//                 {/* Question Meta Info */}
//                 {(q.year || q.difficulty || q.category) && (
//                   <div className="mt-4 flex gap-2 flex-wrap text-xs">
//                     {q.year && (
//                       <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
//                         Year: {q.year}
//                       </span>
//                     )}
//                     {q.difficulty && (
//                       <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
//                         {q.difficulty}
//                       </span>
//                     )}
//                     {q.category && (
//                       <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
//                         {q.category}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // ⛔ Question blocked
//               <div className="text-center text-gray-500 py-10">
//                 Questions locked. Please subscribe to continue.
//               </div>
//             )}

//             {/* Navigation */}
//             <div className="mt-6 flex justify-between border-t pt-4">
//               <button
//                 disabled={currentIndex === 0}
//                 onClick={prev} // ✅ Fixed: Use prev() function
//                 className={`px-6 py-2 rounded transition ${
//                   currentIndex === 0
//                     ? "bg-gray-400 text-white cursor-not-allowed"
//                     : "bg-red-500 text-white hover:bg-red-600"
//                 }`}
//               >
//                 Prev
//               </button>

//               <button
//                 onClick={next}
//                 disabled={paymentLocked || !userChoice}
//                 className={`px-6 py-2 rounded transition ${
//                   paymentLocked || !userChoice
//                     ? "bg-gray-400 cursor-not-allowed text-white"
//                     : "bg-blue-600 text-white hover:bg-blue-700"
//                 }`}
//               >
//                 {currentIndex === questions.length - 1 ? "Finish" : "Next"}
//               </button>
//             </div>
//           </div>
//         </main>

//         {/* ================= RIGHT: PAYMENT ================= */}
//         <aside>
//           {paymentLocked && (
//             <div className="fixed top-16 right-0 w-full md:w-96 z-[9999]">
//               <InitializePayment />
//             </div>
//           )}
//         </aside>
//       </div>
//     </section>
//   );
// }





// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useExamStore } from "@/store/examStore";
// import InitializePayment from "../../../../payment/initializePayment";
// import { useToast } from "@/components/ui/use-toast";

// export default function QuestionCard() {
//   const navigate = useNavigate();
//   const { toast } = useToast();

//   const {
//     currentIndex,
//     selectedAnswers,
//     setSelectedAnswer,
//     next,
//     prev,
//     goToQuestion,
//     loading,
//     paymentLocked,
//     getAllQuestions,
//     getAnsweredCount,
//     submitAnswer,
//     examActive,
//     examId,
//     endExam,
//     timeRemaining,
//     examCompleted,
//     examResults,
//     examDuration,
//     examStartTime,
//   } = useExamStore();

//   const questions = getAllQuestions();
//   const q = questions?.[currentIndex] ?? null;
//   const answeredCount = getAnsweredCount();

//   // Debug: Log timer state
//   useEffect(() => {
//     console.log("🔍 Timer Debug:", {
//       examActive,
//       examId,
//       timeRemaining,
//       examDuration,
//       examStartTime,
//       examCompleted
//     });
//   }, [examActive, examId, timeRemaining, examDuration, examStartTime, examCompleted]);

//   const [visible, setVisible] = useState(false);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

//   const userChoice = q ? selectedAnswers[q.id] : null;
//   const isCorrect = q && userChoice === q.correctAnswer;

//   // ✅ Only render question when allowed
//   const canRenderQuestion = !!q && !paymentLocked && !examCompleted;

//   // ----------------------------
//   // Format time remaining
//   // ----------------------------
//   const formatTime = (seconds) => {
//     if (seconds === null) return "00:00:00";
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
//   };

//   // ----------------------------
//   // Check if time is running low (last 5 minutes)
//   // ----------------------------
//   const isTimeRunningLow = timeRemaining !== null && timeRemaining <= 300; // 5 minutes

//   // ----------------------------
//   // Fade-in effect for question
//   // ----------------------------
//   useEffect(() => {
//     if (!canRenderQuestion) {
//       setVisible(false);
//       return;
//     }

//     setVisible(false);
//     const t = setTimeout(() => setVisible(true), 20);
//     return () => clearTimeout(t);
//   }, [currentIndex, canRenderQuestion]);

//   // ----------------------------
//   // Handle Submit Exam
//   // ----------------------------
//   const handleSubmitExam = async () => {
//     setShowSubmitConfirm(false);
    
//     try {
//       toast({
//         title: "Submitting exam...",
//         description: "Please wait while we process your answers.",
//       });
      
//       const results = await endExam();
      
//       if (results) {
//         toast({
//           title: "Success!",
//           description: "Exam submitted successfully!",
//         });
//         // Results will be shown in the results view
//       } else {
//         toast({
//           title: "Warning",
//           description: "Exam ended but no results received.",
//           variant: "destructive",
//         });
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to submit exam. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

//   // ----------------------------
//   // Handle option selection with backend submission
//   // ----------------------------
//   const handleOptionSelect = async (option) => {
//     // Set the selected answer in store
//     setSelectedAnswer(q.id, option);
//     setShowExplanation(false);

//     // Submit answer to backend if exam is active
//     if (examActive && examId) {
//       console.log("📤 Submitting answer to backend...");
//       const success = await submitAnswer(q.id, option);
//       if (success) {
//         console.log("✅ Answer submitted successfully");
//       } else {
//         console.warn("⚠️ Answer submission failed");
//       }
//     }
//   };

//   // ----------------------------
//   // Show Results Screen
//   // ----------------------------
//   if (examCompleted && examResults) {
//     return (
//       <main className="p-4">
//         <div className="border border-gray-300 rounded-lg p-8 text-center space-y-6">
//           <h1 className="text-3xl font-bold text-green-600">Exam Completed! 🎉</h1>
          
//           <div className="space-y-4">
//             <div className="text-xl">
//               <span className="font-semibold">Score: </span>
//               <span className="text-2xl font-bold text-blue-600">
//                 {examResults.score || 'N/A'}
//               </span>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
//               <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
//                 <div className="text-2xl font-bold text-green-600">
//                   {examResults.correctAnswers || 0}
//                 </div>
//               </div>
              
//               <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
//                 <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
//                 <div className="text-2xl font-bold text-red-600">
//                   {examResults.incorrectAnswers || 0}
//                 </div>
//               </div>
//             </div>
            
//             <div className="text-sm text-gray-600 dark:text-gray-400">
//               Total Questions: {examResults.totalQuestions || questions.length}
//             </div>
//           </div>
          
//           <div className="flex gap-4 justify-center">
//             <button
//               onClick={() => navigate("/user/dashboard")}
//               className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
//             >
//               Back to Dashboard
//             </button>
            
//             <button
//               onClick={() => window.location.reload()}
//               className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
//             >
//               Take Another Exam
//             </button>
//           </div>
//         </div>
//       </main>
//     );
//   }

//   // ----------------------------
//   // Skeleton (ONLY when loading questions)
//   // ----------------------------
//   if ((loading || !q) && !paymentLocked) {
//     return (
//       <main className="p-4">
//         <div className="border border-gray-300 rounded-lg p-4 space-y-4 animate-pulse">
//           <div className="h-6 w-48 bg-gray-300 rounded-lg" />
//           <div className="h-12 bg-gray-300 rounded-lg" />
//           <div className="space-y-3">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="h-10 bg-gray-300 rounded-lg" />
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <section className="py-0">
//       {/* Layout */}
//       <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
//         {/* ================= LEFT: QUESTION ================= */}
//         <main>
//           <div className="border border-gray-300 rounded-lg p-4">
//             {canRenderQuestion ? (
//               <div
//                 className={`transition-opacity duration-300 ${
//                   visible ? "opacity-100" : "opacity-0"
//                 }`}
//               >
//                 {/* Question Header with Timer */}
//                 <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
//                   <h2 className="font-semibold">
//                     Question {currentIndex + 1} of {questions.length}
//                   </h2>
                  
//                   <div className="flex items-center gap-4">
//                     {/* Timer - Always show if timeRemaining is not null */}
//                     {timeRemaining !== null && (
//                       <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border-2 ${
//                         isTimeRunningLow 
//                           ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 animate-pulse' 
//                           : 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
//                       }`}>
//                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                         </svg>
//                         <span className="font-mono font-bold text-lg">
//                           {formatTime(timeRemaining)}
//                         </span>
//                       </div>
//                     )}
                    
//                     {/* Debug: Show timer state */}
//                     {timeRemaining === null && examActive && (
//                       <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
//                         Timer not initialized
//                       </div>
//                     )}
                    
//                     {/* Exam Status */}
//                     {examActive && (
//                       <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded">
//                         <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
//                         Exam Active
//                       </span>
//                     )}
//                   </div>
//                 </div>

//                 {/* Progress Indicator */}
//                 <div className="mb-4 text-sm text-gray-600">
//                   Answered: {answeredCount} / {questions.length}
//                   <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
//                     <div 
//                       className="bg-blue-600 h-2 rounded-full transition-all duration-300"
//                       style={{ width: `${(answeredCount / questions.length) * 100}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 <p className="mb-4 text-lg">{q.text}</p>

//                 {/* Options */}
//                 {Array.isArray(q.options) &&
//                   q.options.map((opt, i) => {
//                     const letter = String.fromCharCode(65 + i);
//                     const isSelected = userChoice === opt;

//                     return (
//                       <label
//                         key={i}
//                         className={`flex items-center gap-2 p-3 mb-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
//                           isSelected 
//                             ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
//                             : 'border-gray-300'
//                         }`}
//                       >
//                         <input
//                           type="radio"
//                           name={q.id}
//                           checked={isSelected}
//                           onChange={() => handleOptionSelect(opt)}
//                           className="w-4 h-4"
//                         />
//                         <span className="font-medium">{letter}.</span>
//                         <span>{opt}</span>
//                       </label>
//                     );
//                   })}

//                 {/* Question Meta Info */}
//                 {(q.year || q.difficulty || q.category) && (
//                   <div className="mt-4 flex gap-2 flex-wrap text-xs">
//                     {q.year && (
//                       <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
//                         Year: {q.year}
//                       </span>
//                     )}
//                     {q.difficulty && (
//                       <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
//                         {q.difficulty}
//                       </span>
//                     )}
//                     {q.category && (
//                       <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
//                         {q.category}
//                       </span>
//                     )}
//                   </div>
//                 )}
//               </div>
//             ) : (
//               // ⛔ Question blocked
//               <div className="text-center text-gray-500 py-10">
//                 Questions locked. Please subscribe to continue.
//               </div>
//             )}

//             {/* Navigation */}
//             <div className="mt-6 flex justify-between items-center border-t pt-4">
//               <button
//                 disabled={currentIndex === 0}
//                 onClick={prev}
//                 className={`px-6 py-2 rounded transition ${
//                   currentIndex === 0
//                     ? "bg-gray-400 text-white cursor-not-allowed"
//                     : "bg-gray-600 text-white hover:bg-gray-700"
//                 }`}
//               >
//                 Previous
//               </button>

//               <div className="flex gap-2">
//                 {currentIndex === questions.length - 1 ? (
//                   <button
//                     onClick={() => setShowSubmitConfirm(true)}
//                     disabled={paymentLocked}
//                     className={`px-6 py-2 rounded transition ${
//                       paymentLocked
//                         ? "bg-gray-400 cursor-not-allowed text-white"
//                         : "bg-green-600 text-white hover:bg-green-700"
//                     }`}
//                   >
//                     Submit Exam
//                   </button>
//                 ) : (
//                   <button
//                     onClick={next}
//                     disabled={paymentLocked}
//                     className={`px-6 py-2 rounded transition ${
//                       paymentLocked
//                         ? "bg-gray-400 cursor-not-allowed text-white"
//                         : "bg-blue-600 text-white hover:bg-blue-700"
//                     }`}
//                   >
//                     Next
//                   </button>
//                 )}
//               </div>
//             </div>
//           </div>

//           {/* Question Navigator */}
//           <div className="mt-4 border border-gray-300 rounded-lg p-4">
//             <h3 className="font-semibold mb-3">Question Navigator</h3>
//             <div className="grid grid-cols-10 gap-2">
//               {questions.map((_, idx) => {
//                 const isAnswered = selectedAnswers[questions[idx]?.id];
//                 const isCurrent = idx === currentIndex;
                
//                 return (
//                   <button
//                     key={idx}
//                     onClick={() => goToQuestion(idx)}
//                     className={`h-10 rounded transition ${
//                       isCurrent
//                         ? 'bg-blue-600 text-white font-bold'
//                         : isAnswered
//                         ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
//                         : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
//                     }`}
//                   >
//                     {idx + 1}
//                   </button>
//                 );
//               })}
//             </div>
//             <div className="mt-3 flex gap-4 text-xs">
//               <div className="flex items-center gap-1">
//                 <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
//                 <span>Answered</span>
//               </div>
//               <div className="flex items-center gap-1">
//                 <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
//                 <span>Not Answered</span>
//               </div>
//             </div>
//           </div>
//         </main>

//         {/* ================= RIGHT: PAYMENT OR INFO ================= */}
//         <aside>
//           {paymentLocked ? (
//             <div className="fixed top-16 right-0 w-full md:w-96 z-[9999]">
//               <InitializePayment />
//             </div>
//           ) : (
//             <div className="sticky top-4 space-y-4">
//               {/* Exam Info Card */}
//               <div className="border border-gray-300 rounded-lg p-4">
//                 <h3 className="font-semibold mb-3">Exam Information</h3>
//                 <div className="space-y-2 text-sm">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Total Questions:</span>
//                     <span className="font-medium">{questions.length}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Answered:</span>
//                     <span className="font-medium text-green-600">{answeredCount}</span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Remaining:</span>
//                     <span className="font-medium text-orange-600">
//                       {questions.length - answeredCount}
//                     </span>
//                   </div>
//                 </div>
//               </div>

//               {/* Submit Button (also in sidebar) */}
//               <button
//                 onClick={() => setShowSubmitConfirm(true)}
//                 disabled={!examActive}
//                 className={`w-full py-3 rounded-lg font-semibold transition ${
//                   !examActive
//                     ? "bg-gray-400 cursor-not-allowed text-white"
//                     : "bg-green-600 text-white hover:bg-green-700"
//                 }`}
//               >
//                 Submit Exam
//               </button>
//             </div>
//           )}
//         </aside>
//       </div>

//       {/* Submit Confirmation Modal */}
//       {showSubmitConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
//             <h3 className="text-xl font-bold mb-4">Submit Exam?</h3>
//             <p className="mb-2">
//               You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
//             </p>
//             {answeredCount < questions.length && (
//               <p className="text-orange-600 mb-4">
//                 ⚠️ You still have {questions.length - answeredCount} unanswered question(s).
//               </p>
//             )}
//             <p className="mb-6 text-gray-600">
//               Are you sure you want to submit your exam? This action cannot be undone.
//             </p>
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowSubmitConfirm(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSubmitExam}
//                 className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
//               >
//                 Yes, Submit
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }









import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useExamStore } from "@/store/examStore";
import InitializePayment from "../../../../payment/initializePayment";
import { useToast } from "@/components/ui/use-toast";

export default function ExamQuestionCard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    currentIndex,
    selectedAnswers,
    setSelectedAnswer,
    next,
    prev,
    goToQuestion,
    loading,
    paymentLocked,
    getAllQuestions,
    getAnsweredCount,
    submitAnswer,
    examActive,
    examId,
    endExam,
    timeRemaining,
    examCompleted,
    examResults,
    examDuration,
    examStartTime,
  } = useExamStore();

  const questions = getAllQuestions();
  const q = questions?.[currentIndex] ?? null;
  const answeredCount = getAnsweredCount();

  // Debug: Log timer state
  useEffect(() => {
    // console.log("🔍 Timer Debug:", {
    //   examActive,
    //   examId,
    //   timeRemaining,
    //   examDuration,
    //   examStartTime,
    //   examCompleted
    // });
  }, [examActive, examId, timeRemaining, examDuration, examStartTime, examCompleted]);

  const [visible, setVisible] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showEndExamConfirm, setShowEndExamConfirm] = useState(false);

  const userChoice = q ? selectedAnswers[q.id] : null;
  const isCorrect = q && userChoice === q.correctAnswer;

  // ✅ Only render question when allowed
  const canRenderQuestion = !!q && !paymentLocked && !examCompleted;

  // ----------------------------
  // Format time remaining
  // ----------------------------
  const formatTime = (seconds) => {
    if (seconds === null) return "00:00:00";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // ----------------------------
  // Check if time is running low (last 5 minutes)
  // ----------------------------
  const isTimeRunningLow = timeRemaining !== null && timeRemaining <= 300; // 5 minutes

  // ----------------------------
  // Fade-in effect for question
  // ----------------------------
  useEffect(() => {
    if (!canRenderQuestion) {
      setVisible(false);
      return;
    }

    setVisible(false);
    const t = setTimeout(() => setVisible(true), 20);
    return () => clearTimeout(t);
  }, [currentIndex, canRenderQuestion]);

  // ----------------------------
  // Handle Submit Exam (Auto-ends session)
  // ----------------------------
  const handleSubmitExam = async () => {
    setShowSubmitConfirm(false);
    
    try {
      toast({
        title: "Submitting exam...",
        description: "Please wait while we process your answers.",
      });
      
      console.log("📤 Submitting exam and ending session...");
      
      // ✅ endExam() calls the /exams/end endpoint which submits the exam
      const results = await endExam();
      
      console.log("✅ Exam submitted and session ended");
      console.log("📊 Results:", results);
      
      if (results) {
        toast({
          title: "Success!",
          description: "Exam submitted successfully!",
        });
      } else {
        toast({
          title: "Warning",
          description: "Exam ended but no results received.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("❌ Error submitting exam:", error);
      toast({
        title: "Error",
        description: "Failed to submit exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ----------------------------
  // Handle End Exam (Early exit - also ends session)
  // ----------------------------
  const handleEndExam = async () => {
    setShowEndExamConfirm(false);
    
    try {
      toast({
        title: "Ending exam...",
        description: "Your exam is being submitted.",
      });
      
      console.log("🛑 Ending exam early and submitting session...");
      
      // ✅ endExam() calls the /exams/end endpoint
      const results = await endExam();
      
      console.log("✅ Exam ended and session submitted");
      console.log("📊 Results:", results);
      
      if (results) {
        toast({
          title: "Exam Ended",
          description: "Your exam has been submitted.",
        });
      }
    } catch (error) {
      console.error("❌ Error ending exam:", error);
      toast({
        title: "Error",
        description: "Failed to end exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ----------------------------
  // Handle option selection with backend submission
  // ----------------------------
  const handleOptionSelect = async (option) => {
    // Set the selected answer in store
    setSelectedAnswer(q.id, option);
    setShowExplanation(false);

    // Submit answer to backend if exam is active
    if (examActive && examId) {
      console.log("📤 Submitting answer to backend...");
      const success = await submitAnswer(q.id, option);
      if (success) {
        console.log("✅ Answer submitted successfully");
      } else {
        console.warn("⚠️ Answer submission failed");
      }
    }
  };

  // ----------------------------
  // Show Results Screen
  // ----------------------------
  if (examCompleted && examResults) {
    return (
      <main className="p-4">
        <div className="border border-gray-300 rounded-lg p-8 text-center space-y-6">
          <h1 className="text-3xl font-bold text-green-600">Exam Completed! 🎉</h1>
          
          <div className="space-y-4">
            <div className="text-xl">
              <span className="font-semibold">Score: </span>
              <span className="text-2xl font-bold text-blue-600">
                {examResults.score || 'N/A'}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
                <div className="text-2xl font-bold text-green-600">
                  {examResults.correctAnswers || 0}
                </div>
              </div>
              
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
                <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
                <div className="text-2xl font-bold text-red-600">
                  {examResults.incorrectAnswers || 0}
                </div>
              </div>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Questions: {examResults.totalQuestions || questions.length}
            </div>
          </div>
          
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Back to Dashboard
            </button>
            
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
            >
              Take Another Exam
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ----------------------------
  // Skeleton (ONLY when loading questions)
  // ----------------------------
  if ((loading || !q) && !paymentLocked) {
    return (
      <main className="p-4">
        <div className="border border-gray-300 rounded-lg p-4 space-y-4 animate-pulse">
          <div className="h-6 w-48 bg-gray-300 rounded-lg" />
          <div className="h-12 bg-gray-300 rounded-lg" />
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-10 bg-gray-300 rounded-lg" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <section className="py-0">
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* ================= LEFT: QUESTION ================= */}
        <main>
          <div className="border border-gray-300 rounded-lg p-4">
            {canRenderQuestion ? (
              <div
                className={`transition-opacity duration-300 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Question Header with Timer */}
                <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                  <h2 className="font-semibold">
                    Question {currentIndex + 1} of {questions.length}
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    {/* Timer - Always show if timeRemaining is not null */}
                    {timeRemaining !== null && (
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border-2 ${
                        isTimeRunningLow 
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 animate-pulse' 
                          : 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-mono font-bold text-lg">
                          {formatTime(timeRemaining)}
                        </span>
                      </div>
                    )}
                    
                    {/* Debug: Show timer state */}
                    {timeRemaining === null && examActive && (
                      <div className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
                        Timer not initialized
                      </div>
                    )}
                    
                    {/* Exam Status with End Button */}
                    {examActive && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded">
                          <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                          Exam Active
                        </span>
                        <button
                          onClick={() => setShowEndExamConfirm(true)}
                          className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-medium"
                        >
                          End Exam
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Indicator */}
                <div className="mb-4 text-sm text-gray-600">
                  Answered: {answeredCount} / {questions.length}
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <p className="mb-4 text-lg">{q.text}</p>

                {/* Options */}
                {Array.isArray(q.options) &&
                  q.options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isSelected = userChoice === opt;

                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-2 p-3 mb-3 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
                          isSelected 
                            ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={isSelected}
                          onChange={() => handleOptionSelect(opt)}
                          className="w-4 h-4"
                        />
                        <span className="font-medium">{letter}.</span>
                        <span>{opt}</span>
                      </label>
                    );
                  })}

                {/* Question Meta Info */}
                {(q.year || q.difficulty || q.category) && (
                  <div className="mt-4 flex gap-2 flex-wrap text-xs">
                    {q.year && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        Year: {q.year}
                      </span>
                    )}
                    {q.difficulty && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {q.difficulty}
                      </span>
                    )}
                    {q.category && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {q.category}
                      </span>
                    )}
                  </div>
                )}
              </div>
            ) : (
              // ⛔ Question blocked
              <div className="text-center text-gray-500 py-10">
                Questions locked. Please subscribe to continue.
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex justify-between items-center border-t pt-4">
              <button
                disabled={currentIndex === 0}
                onClick={prev}
                className={`px-6 py-2 rounded transition ${
                  currentIndex === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-gray-600 text-white hover:bg-gray-700"
                }`}
              >
                Previous
              </button>

              <div className="flex gap-2">
                {currentIndex === questions.length - 1 ? (
                  <button
                    onClick={() => setShowSubmitConfirm(true)}
                    disabled={paymentLocked}
                    className={`px-6 py-2 rounded transition ${
                      paymentLocked
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    Submit Exam
                  </button>
                ) : (
                  <button
                    onClick={next}
                    disabled={paymentLocked}
                    className={`px-6 py-2 rounded transition ${
                      paymentLocked
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Question Navigator */}
          <div className="mt-4 border border-gray-300 rounded-lg p-4">
            <h3 className="font-semibold mb-3">Question Navigator</h3>
            <div className="grid grid-cols-10 gap-2">
              {questions.map((_, idx) => {
                const isAnswered = selectedAnswers[questions[idx]?.id];
                const isCurrent = idx === currentIndex;
                
                return (
                  <button
                    key={idx}
                    onClick={() => goToQuestion(idx)}
                    className={`h-10 rounded transition ${
                      isCurrent
                        ? 'bg-blue-600 text-white font-bold'
                        : isAnswered
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
            <div className="mt-3 flex gap-4 text-xs">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
                <span>Answered</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-gray-100 dark:bg-gray-700 rounded"></div>
                <span>Not Answered</span>
              </div>
            </div>
          </div>
        </main>

        {/* ================= RIGHT: PAYMENT OR INFO ================= */}
        <aside>
          {paymentLocked ? (
            <div className="fixed top-16 right-0 w-full md:w-96 z-[9999]">
              <InitializePayment />
            </div>
          ) : (
            <div className="sticky top-4 space-y-4">
              {/* Exam Info Card */}
              <div className="border border-gray-300 rounded-lg p-4">
                <h3 className="font-semibold mb-3">Exam Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="font-medium">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Answered:</span>
                    <span className="font-medium text-green-600">{answeredCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Remaining:</span>
                    <span className="font-medium text-orange-600">
                      {questions.length - answeredCount}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button (also in sidebar) */}
              <button
                onClick={() => setShowSubmitConfirm(true)}
                disabled={!examActive}
                className={`w-full py-3 rounded-lg font-semibold transition ${
                  !examActive
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                Submit Exam
              </button>

              {/* End Exam Button */}
              <button
                onClick={() => setShowEndExamConfirm(true)}
                disabled={!examActive}
                className={`w-full py-3 rounded-lg font-semibold transition border-2 ${
                  !examActive
                    ? "bg-gray-400 cursor-not-allowed text-white border-gray-400"
                    : "bg-white dark:bg-gray-800 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                }`}
              >
                End Exam Early
              </button>
            </div>
          )}
        </aside>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Submit Exam?</h3>
            <p className="mb-2">
              You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
            </p>
            {answeredCount < questions.length && (
              <p className="text-orange-600 mb-4">
                ⚠️ You still have {questions.length - answeredCount} unanswered question(s).
              </p>
            )}
            <p className="mb-6 text-gray-600">
              Are you sure you want to submit your exam? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitExam}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
              >
                Yes, Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* End Exam Confirmation Modal */}
      {showEndExamConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold">End Exam Early?</h3>
            </div>
            
            <div className="mb-6 space-y-2">
              <p className="text-gray-600 dark:text-gray-400">
                You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
              </p>
              
              {timeRemaining !== null && (
                <p className="text-gray-600 dark:text-gray-400">
                  Time remaining: <strong className="font-mono">{formatTime(timeRemaining)}</strong>
                </p>
              )}
              
              <p className="text-red-600 font-medium mt-4">
                ⚠️ Ending the exam now will submit all your current answers. You cannot resume this exam.
              </p>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowEndExamConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
              >
                Continue Exam
              </button>
              <button
                onClick={handleEndExam}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                End Now
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}