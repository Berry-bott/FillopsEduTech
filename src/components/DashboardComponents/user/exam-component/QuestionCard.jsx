









// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useExamStore } from "@/store/examStore";
// import InitializePayment from "../../../../payment/initializePayment";
// import { useToast } from "@/components/ui/use-toast";

// export default function ExamQuestionCard() {
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
//     // console.log("🔍 Timer Debug:", {
//     //   examActive,
//     //   examId,
//     //   timeRemaining,
//     //   examDuration,
//     //   examStartTime,
//     //   examCompleted
//     // });
//   }, [examActive, examId, timeRemaining, examDuration, examStartTime, examCompleted]);

//   const [visible, setVisible] = useState(false);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
//   const [showEndExamConfirm, setShowEndExamConfirm] = useState(false);

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
//   // Handle Submit Exam (Auto-ends session)
//   // ----------------------------
// //   const handleSubmitExam = async () => {
// //     setShowSubmitConfirm(false);
    
// //     try {
// //       toast({
// //         title: "Submitting exam...",
// //         description: "Please wait while we process your answers.",
// //       });
      
// //       console.log("📤 Submitting exam and ending session...");
      
// //       // ✅ endExam() calls the /exams/end endpoint which submits the exam
// //       const results = await endExam();
      
// //       console.log("✅ Exam submitted and session ended");
// //       console.log("📊 Results:", results);
      
// //       if (results) {
// //         toast({
// //           title: "Success!",
// //           description: "Exam submitted successfully!",
// //         });
// //       } else {
// //         toast({
// //           title: "Warning",
// //           description: "Exam ended but no results received.",
// //           variant: "destructive",
// //         });
// //       }
// //     } catch (error) {
// //       console.error("❌ Error submitting exam:", error);
// //       toast({
// //         title: "Error",
// //         description: "Failed to submit exam. Please try again.",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// const handleSubmitExam = async () => {
//   setShowSubmitConfirm(false);
  
//   try {
//     toast({
//       title: "Submitting exam...",
//       description: "Please wait while we process your answers.",
//     });
    
//     console.log("📤 Submitting exam and ending session...");
    
//     // ✅ endExam() returns the response data
//     const result = await endExam();
    
//     console.log("✅ Exam submitted:", result);
    
//     // ✅ Check for examId in the response
//     if (result?.examId) {
//       toast({
//         title: "Success!",
//         description: "Exam submitted successfully!",
//       });
      
//       // ✅ Navigate to results page with examId
//       console.log("🔀 Navigating to results page with examId:", result.examId);
//       navigate(`/exam-results/${result.examId}`);
//     } else {
//       // ✅ If no examId but we have result data, still show success
//       toast({
//         title: "Warning",
//         description: "Exam submitted but results format unexpected.",
//         variant: "destructive",
//       });
      
//       console.warn("⚠️ Unexpected result structure:", result);
      
//       // Try to navigate anyway if we have any result
//       if (result) {
//         navigate("/exam-results");
//       } else {
//         navigate("/user/dashboard");
//       }
//     }
//   } catch (error) {
//     console.error("❌ Error submitting exam:", error);
//     toast({
//       title: "Error",
//       description: "Failed to submit exam. Please try again.",
//       variant: "destructive",
//     });
//   }
// };

//   // ----------------------------
//   // Handle End Exam (Early exit - also ends session)
//   // ----------------------------
//   const handleEndExam = async () => {
//     setShowEndExamConfirm(false);
    
//     try {
//       toast({
//         title: "Ending exam...",
//         description: "Your exam is being submitted.",
//       });
      
//       console.log("🛑 Ending exam early and submitting session...");
      
//       // ✅ endExam() calls the /exams/end endpoint
//       const results = await endExam();
      
//       console.log("✅ Exam ended and session submitted");
//       console.log("📊 Results:", results);
      
//       if (results) {
//         toast({
//           title: "Exam Ended",
//           description: "Your exam has been submitted.",
//         });
//       }
//     } catch (error) {
//       console.error("❌ Error ending exam:", error);
//       toast({
//         title: "Error",
//         description: "Failed to end exam. Please try again.",
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
// //   if (examCompleted && examResults) {
// //     return (
// //       <main className="p-4">
// //         <div className="border border-gray-300 rounded-lg p-8 text-center space-y-6">
// //           <h1 className="text-3xl font-bold text-green-600">Exam Completed! 🎉</h1>
          
// //           <div className="space-y-4">
// //             <div className="text-xl">
// //               <span className="font-semibold">Score: </span>
// //               <span className="text-2xl font-bold text-blue-600">
// //                 {examResults.score || 'N/A'}
// //               </span>
// //             </div>
            
// //             <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
// //               <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded">
// //                 <div className="text-sm text-gray-600 dark:text-gray-400">Correct</div>
// //                 <div className="text-2xl font-bold text-green-600">
// //                   {examResults.correctAnswers || 0}
// //                 </div>
// //               </div>
              
// //               <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded">
// //                 <div className="text-sm text-gray-600 dark:text-gray-400">Incorrect</div>
// //                 <div className="text-2xl font-bold text-red-600">
// //                   {examResults.incorrectAnswers || 0}
// //                 </div>
// //               </div>
// //             </div>
            
// //             <div className="text-sm text-gray-600 dark:text-gray-400">
// //               Total Questions: {examResults.totalQuestions || questions.length}
// //             </div>
// //           </div>
          
// //           <div className="flex gap-4 justify-center">
// //             <button
// //               onClick={() => navigate("/user/dashboard")}
// //               className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
// //             >
// //               Back to Dashboard
// //             </button>
            
// //             <button
// //               onClick={() => window.location.reload()}
// //               className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition"
// //             >
// //               Take Another Exam
// //             </button>
// //           </div>
// //         </div>
// //       </main>
// //     );
// //   }

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
                  
//                   <div className="flex items-center gap-3">
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
                    
//                     {/* Exam Status with End Button */}
//                     {examActive && (
//                       <div className="flex items-center gap-2">
//                         <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 px-2 py-1 bg-green-50 dark:bg-green-900/20 rounded">
//                           <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
//                           Exam Active
//                         </span>
//                         <button
//                           onClick={() => setShowEndExamConfirm(true)}
//                           className="text-xs bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition font-medium"
//                         >
//                           End Exam
//                         </button>
//                       </div>
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

//               {/* End Exam Button */}
//               <button
//                 onClick={() => setShowEndExamConfirm(true)}
//                 disabled={!examActive}
//                 className={`w-full py-3 rounded-lg font-semibold transition border-2 ${
//                   !examActive
//                     ? "bg-gray-400 cursor-not-allowed text-white border-gray-400"
//                     : "bg-white dark:bg-gray-800 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
//                 }`}
//               >
//                 End Exam Early
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

//       {/* End Exam Confirmation Modal */}
//       {showEndExamConfirm && (
//         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
//           <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
//                 <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
//                 </svg>
//               </div>
//               <h3 className="text-xl font-bold">End Exam Early?</h3>
//             </div>
            
//             <div className="mb-6 space-y-2">
//               <p className="text-gray-600 dark:text-gray-400">
//                 You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions.
//               </p>
              
//               {timeRemaining !== null && (
//                 <p className="text-gray-600 dark:text-gray-400">
//                   Time remaining: <strong className="font-mono">{formatTime(timeRemaining)}</strong>
//                 </p>
//               )}
              
//               <p className="text-red-600 font-medium mt-4">
//                 ⚠️ Ending the exam now will submit all your current answers. You cannot resume this exam.
//               </p>
//             </div>
            
//             <div className="flex gap-3">
//               <button
//                 onClick={() => setShowEndExamConfirm(false)}
//                 className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
//               >
//                 Continue Exam
//               </button>
//               <button
//                 onClick={handleEndExam}
//                 className="flex-1 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
//               >
//                 End Now
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </section>
//   );
// }






import { useState, useEffect, useRef  } from "react";
import { useNavigate  } from "react-router-dom";
import { useExamStore, setExamNavigationCallback } from "@/store/examStore";
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
    getAnsweredCount,
    submitAnswer,
    examActive,
    examId,
    endExam,
    timeRemaining,
    examCompleted,
    getActiveQuestions,
     hasNextSubjectOrTopic,        
  moveToNextSubjectOrTopic,     
  isLastSubjectOrTopic,     
  getSubjectProgress,   
  } = useExamStore();

  const questions = getActiveQuestions();
  const q = questions?.[currentIndex] ?? null;
  const answeredCount = getAnsweredCount();
  const subjectProgress = getSubjectProgress();
  const isLast = isLastSubjectOrTopic();
  const [visible, setVisible] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showEndExamConfirm, setShowEndExamConfirm] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true); 
  const hasInitialized = useRef(false);
  const userChoice = q ? selectedAnswers[q.id] : null;
  const isCorrect = q && userChoice === q.correctAnswer;


    useEffect(() => {
    setExamNavigationCallback((path) => {
      console.log("🔀 Navigation callback triggered:", path);
      
      // Show toast for auto-submit
      toast({
        title: "Time's Up!",
        description: "Your exam has been automatically submitted.",
        variant: "default",
      });
      
      // Navigate after a brief delay
      setTimeout(() => {
        navigate(path);
      }, 500);
    });
    
    return () => {
      // Clean up callback on unmount
      setExamNavigationCallback(null);
    };
  }, [navigate, toast]);

  // ✅ Wait for exam to be fully initialized

  useEffect(() => {
  // Only run once when everything is ready
  if (!hasInitialized.current && 
      examActive && 
      examId && 
      timeRemaining !== null && 
      questions.length > 0) {
    console.log("✅ Exam fully initialized, showing questions");
    hasInitialized.current = true; // ✅ Mark as initialized
    
    const timer = setTimeout(() => {
      setIsInitializing(false);
    }, 500);
    return () => clearTimeout(timer);
  }
}, [examActive, examId, timeRemaining, questions.length]);

//   useEffect(() => {
//     // Check if exam is fully ready
//     if (examActive && examId && timeRemaining !== null && questions.length > 0) {
//       console.log("✅ Exam fully initialized, showing questions");
//       // Add small delay to ensure everything is ready
//       const timer = setTimeout(() => {
//         setIsInitializing(false);
//       }, 100);
//       return () => clearTimeout(timer);
//     }
//   }, [examActive, examId, timeRemaining, questions.length, isInitializing]);

  // ✅ Only render question when allowed AND fully initialized
  const canRenderQuestion = !!q && !paymentLocked && !examCompleted && !isInitializing;

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
  // Handle Submit Exam
  // ----------------------------
  
// ----------------------------
// Handle Submit Current Subject/Topic
// ----------------------------
const handleSubmitCurrentSubject = async () => {
  setShowSubmitConfirm(false);
  
  try {
    console.log("📤 Submitting current subject/topic answers...");
    
    toast({
      title: "Saving answers...",
      description: "Moving to next section...",
    });
    
    // Check if there's another subject/topic
    const hasNext = hasNextSubjectOrTopic();
    
    if (hasNext) {
      console.log("➡️ Moving to next subject/topic...");
      
      // Move to next subject/topic
      const moved = await moveToNextSubjectOrTopic();
      
      if (moved) {
        toast({
          title: "Section Complete!",
          description: `Moving to section ${subjectProgress.current + 1} of ${subjectProgress.total}`,
        });
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        toast({
          title: "Error",
          description: "Failed to load next section",
          variant: "destructive",
        });
      }
    } else {
      // This is the last subject/topic - submit entire exam
      console.log("✅ This is the last subject/topic - submitting entire exam");
      await handleFinalSubmit();
    }
  } catch (error) {
    console.error("❌ Error submitting section:", error);
    toast({
      title: "Error",
      description: "Failed to save answers. Please try again.",
      variant: "destructive",
    });
  }
};

// ----------------------------
// Handle Final Exam Submission (all subjects/topics done)
// ----------------------------
const handleFinalSubmit = async () => {
  try {
    toast({
      title: "Submitting exam...",
      description: "Please wait while we process your answers.",
    });
    
    console.log("📤 Submitting FINAL exam and ending session...");
    
    const result = await endExam({ autoSubmit: false });
    
    console.log("✅ Exam submitted:", result);
    
    if (result?.examId) {
      toast({
        title: "Success!",
        description: "Exam submitted successfully!",
      });
      navigate(`/exam-results/${result.examId}`);
    } else if (result) {
      toast({
        title: "Success!",
        description: "Exam submitted successfully!",
      });
      navigate("/exam-results");
    } else {
      toast({
        title: "Warning",
        description: "Exam submitted but no results received.",
        variant: "destructive",
      });
      navigate("/user/dashboard");
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
// Update handleEndExam to also submit final
// ----------------------------
const handleEndExam = async () => {
  setShowEndExamConfirm(false);
  
  try {
    toast({
      title: "Ending exam...",
      description: "Your exam is being submitted.",
    });
    
    console.log("🛑 Ending exam early...");
    
    const results = await endExam({ autoSubmit: false });
    
    console.log("✅ Exam ended:", results);
    
    if (results?.examId) {
      toast({
        title: "Exam Ended",
        description: "Your exam has been submitted.",
      });
      navigate(`/exam-results/${results.examId}`);
    } else if (results) {
      toast({
        title: "Exam Ended",
        description: "Your exam has been submitted.",
      });
      navigate("/exam-results");
    } else {
      navigate("/user/dashboard");
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




//   const handleSubmitExam = async () => {
//   setShowSubmitConfirm(false);
  
//   try {
//     toast({
//       title: "Submitting exam...",
//       description: "Please wait while we process your answers.",
//     });
    
//     console.log("📤 Submitting exam and ending session...");
    
//     // ✅ Pass autoSubmit: false
//     const result = await endExam({ autoSubmit: false });
    
//     console.log("✅ Exam submitted:", result);
    
//     if (result?.examId) {
//       toast({
//         title: "Success!",
//         description: "Exam submitted successfully!",
//       });
//       navigate(`/exam-results/${result.examId}`);
//     } else if (result) {
//       toast({
//         title: "Success!",
//         description: "Exam submitted successfully!",
//       });
//       navigate("/exam-results");
//     } else {
//       toast({
//         title: "Warning",
//         description: "Exam submitted but no results received.",
//         variant: "destructive",
//       });
//       navigate("/user/dashboard");
//     }
//   } catch (error) {
//     console.error("❌ Error submitting exam:", error);
//     toast({
//       title: "Error",
//       description: "Failed to submit exam. Please try again.",
//       variant: "destructive",
//     });
//   }
// };
//   const handleSubmitExam = async () => {
//     setShowSubmitConfirm(false);
    
//     try {
//       toast({
//         title: "Submitting exam...",
//         description: "Please wait while we process your answers.",
//       });
      
//       console.log("📤 Submitting exam and ending session...");
      
//       const result = await endExam();
      
//       console.log("✅ Exam submitted:", result);
      
//       if (result?.examId) {
//         toast({
//           title: "Success!",
//           description: "Exam submitted successfully!",
//         });
        
//         console.log("🔀 Navigating to results page with examId:", result.examId);
//         navigate(`/exam-results/${result.examId}`);
//       } else {
//         toast({
//           title: "Warning",
//           description: "Exam submitted but results format unexpected.",
//           variant: "destructive",
//         });
        
//         console.warn("⚠️ Unexpected result structure:", result);
        
//         if (result) {
//           navigate("/exam-results");
//         } else {
//           navigate("/user/dashboard");
//         }
//       }
//     } catch (error) {
//       console.error("❌ Error submitting exam:", error);
//       toast({
//         title: "Error",
//         description: "Failed to submit exam. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

  // ----------------------------
  // Handle End Exam
  // ----------------------------
//   const handleEndExam = async () => {
//   setShowEndExamConfirm(false);
  
//   try {
//     toast({
//       title: "Ending exam...",
//       description: "Your exam is being submitted.",
//     });
    
//     console.log("🛑 Ending exam early...");
    
//     // ✅ Pass autoSubmit: false
//     const results = await endExam({ autoSubmit: false });
    
//     console.log("✅ Exam ended:", results);
    
//     if (results?.examId) {
//       toast({
//         title: "Exam Ended",
//         description: "Your exam has been submitted.",
//       });
//       navigate(`/exam-results/${results.examId}`);
//     } else if (results) {
//       toast({
//         title: "Exam Ended",
//         description: "Your exam has been submitted.",
//       });
//       navigate("/exam-results");
//     } else {
//       navigate("/user/dashboard");
//     }
//   } catch (error) {
//     console.error("❌ Error ending exam:", error);
//     toast({
//       title: "Error",
//       description: "Failed to end exam. Please try again.",
//       variant: "destructive",
//     });
//   }
// };
//   const handleEndExam = async () => {
//     setShowEndExamConfirm(false);
    
//     try {
//       toast({
//         title: "Ending exam...",
//         description: "Your exam is being submitted.",
//       });
      
//       console.log("🛑 Ending exam early and submitting session...");
      
//       const results = await endExam();
      
//       console.log("✅ Exam ended and session submitted");
//       console.log("📊 Results:", results);
      
//       if (results) {
//         toast({
//           title: "Exam Ended",
//           description: "Your exam has been submitted.",
//         });
//       }
//     } catch (error) {
//       console.error("❌ Error ending exam:", error);
//       toast({
//         title: "Error",
//         description: "Failed to end exam. Please try again.",
//         variant: "destructive",
//       });
//     }
//   };

  // ----------------------------
  // Handle option selection
  // ----------------------------
  
  const handleOptionSelect = async (option) => {
    setSelectedAnswer(q.id, option);
    setShowExplanation(false);

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
  // Show loading while initializing or fetching questions
  // ----------------------------
if (isInitializing || loading || !q) {
  return (
    <main className="p-4">

      {/* Modern Loading Animation */}
      <div className="min-h-[60vh] border w-[600px] m-auto border-border flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          {/* Animated Dots Loader */}
          <div className="flex justify-center">
            <div className="flex space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="w-4 h-4 bg-blue-600 rounded-full animate-bounce"></div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              Preparing Your Exam
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Setting up your personalized exam experience
            </p>
          </div>

          {/* Progress Steps */}
          <div className="space-y-4">
            {/* Step 1: Starting Session */}
            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg border border-blue-100 dark:border-blue-800 transition-all duration-500">
              <div className="flex-shrink-0">
                {examId ? (
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="relative w-10 h-10">
                    <div className="absolute inset-0 border-4 border-blue-200 dark:border-blue-700 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${examId ? 'text-green-700 dark:text-green-400' : 'text-gray-700 dark:text-gray-300'}`}>
                  Starting Exam Session
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {examId ? 'Session initialized' : 'Connecting to server...'}
                </p>
              </div>
            </div>

            {/* Step 2: Timer */}
            <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
              timeRemaining !== null 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800' 
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex-shrink-0">
                {timeRemaining !== null ? (
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${timeRemaining !== null ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  Initializing Timer
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {timeRemaining !== null ? 'Timer ready' : 'Waiting for session...'}
                </p>
              </div>
            </div>

            {/* Step 3: Loading Questions */}
            <div className={`flex items-center gap-4 p-4 rounded-lg border transition-all duration-500 ${
              questions.length > 0 
                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-100 dark:border-blue-800' 
                : 'bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700'
            }`}>
              <div className="flex-shrink-0">
                {questions.length > 0 ? (
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                ) : (
                  <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${questions.length > 0 ? 'text-green-700 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
                  Loading Questions
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {questions.length > 0 ? 'Questions loaded' : 'Fetching your questions...'}
                </p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>
                {examId && timeRemaining !== null && questions.length > 0 ? '100' : 
                 examId && timeRemaining !== null ? '67' : 
                 examId ? '33' : '0'}%
              </span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500 ease-out"
                style={{ 
                  width: `${examId && timeRemaining !== null && questions.length > 0 ? '100' : 
                           examId && timeRemaining !== null ? '67' : 
                           examId ? '33' : '0'}%` 
                }}
              ></div>
            </div>
          </div>

          {/* Fun Message */}
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400 italic">
              {!examId && "Connecting to exam server..."}
              {examId && timeRemaining === null && "Setting up your timer..."}
              {examId && timeRemaining !== null && questions.length === 0 && "Preparing your questions..."}
              {examId && timeRemaining !== null && questions.length > 0 && "Almost ready! 🎯"}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

  return (
    <section className="py-0">
      {/* Rest of your component code remains the same... */}
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* LEFT: QUESTION */}
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
                    {/* Timer */}
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
              <div className="text-center text-gray-500 py-10">
                Questions locked. Please subscribe to continue.
              </div>
            )}

            {/* Rest of your navigation code... */}
            {/* Navigation */}
            {/* <div className="mt-6 flex justify-between items-center border-t pt-4">
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
            </div> */}
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
                        : isLast
                        ? "bg-green-600 text-white hover:bg-green-700"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                >
                    {isLast ? "Submit Exam" : `Next Section (${subjectProgress.current + 1}/${subjectProgress.total})`}
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

        {/* RIGHT: PAYMENT OR INFO */}
        <aside>
          {paymentLocked ? (
            <div className="fixed top-16 right-0 w-full md:w-96 z-[9999]">
              <InitializePayment />
            </div>
          ) : (
            <div className="sticky top-4 space-y-4">
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

            <button
            onClick={() => setShowSubmitConfirm(true)}
            disabled={!examActive}
            className={`w-full py-3 rounded-lg font-semibold transition ${
                !examActive
                ? "bg-gray-400 cursor-not-allowed text-white"
                : isLast
                ? "bg-green-600 text-white hover:bg-green-700"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
            >
            {isLast ? "Submit Exam" : `Complete Section ${subjectProgress.current}/${subjectProgress.total}`}
            </button>

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

      {/* Modals remain the same... */}
      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">
                {isLast ? "Submit Exam?" : "Complete This Section?"}
            </h3>
            
            {/* Progress indicator */}
            {!isLast && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-blue-900 dark:text-blue-100">
                    Progress
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                    {subjectProgress.current} of {subjectProgress.total}
                    </span>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                    <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(subjectProgress.current / subjectProgress.total) * 100}%` }}
                    ></div>
                </div>
                </div>
            )}
            
            <p className="mb-2">
                You have answered <strong>{answeredCount}</strong> out of <strong>{questions.length}</strong> questions in this section.
            </p>
            
            {answeredCount < questions.length && (
                <p className="text-orange-600 mb-4">
                ⚠️ You still have {questions.length - answeredCount} unanswered question(s) in this section.
                </p>
            )}
            
            <p className="mb-6 text-gray-600">
                {isLast 
                ? "Are you sure you want to submit your entire exam? This action cannot be undone."
                : `Ready to move to section ${subjectProgress.current + 1}? You can't return to this section.`
                }
            </p>
            
            <div className="flex gap-3">
                <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700 transition"
                >
                Cancel
                </button>
                <button
                onClick={handleSubmitCurrentSubject}
                className={`flex-1 px-4 py-2 rounded transition text-white ${
                    isLast
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
                >
                {isLast ? "Submit Exam" : "Next Section"}
                </button>
            </div>
            </div>
        </div>
        )}
      {/* {showSubmitConfirm && (
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
      )} */}

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