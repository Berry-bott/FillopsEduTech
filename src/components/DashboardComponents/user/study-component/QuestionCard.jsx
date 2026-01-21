// import { useState } from 'react';
// import { useStudyStore } from '../../../../store/studyStore';

// export default function QuestionCard() {
//   const {
//     questions,
//     currentIndex,
//     selectedOptions,
//     setSelectedOption,
//     setCurrentIndex,
//     next,
//   } = useStudyStore();

//   const [showExplanation, setShowExplanation] = useState(false);

//   const q = questions[currentIndex];
//   if (!q) return <p>No question found.</p>;

//   const userChoice = selectedOptions[q.id];
//   const isCorrect = userChoice === q.correctAnswer;

//   return (
//     <main className="relative">
//       <div className="border border-gray-300 p-4 rounded-lg pb-28 overflow-y-auto">
//         <h2 className="font-semibold mb-2">
//           Question {currentIndex + 1} of {questions.length}
//         </h2>
//         <p className="mb-3">{q.text}</p>

//         {q.options.map((opt, i) => {
//           const optionLetter = String.fromCharCode(65 + i);
//           let borderColor = 'border-gray-300';
//           if (userChoice) {
//             if (opt === q.correctAnswer) borderColor = 'border-green-600';
//             if (opt === userChoice && !isCorrect) borderColor = 'border-red-600';
//           }

//           return (
//             <label
//               key={i}
//               className={`flex items-center mb-3 cursor-pointer p-2 border rounded-lg ${borderColor}`}
//             >
//               <input
//                 type="radio"
//                 name={q.id}
//                 value={opt}
//                 checked={userChoice === opt}
//                 onChange={() => {
//                   setSelectedOption(q.id, opt);
//                   setShowExplanation(false);
//                 }}
//                 className="mr-2"
//               />
//               {optionLetter}. {opt}
//             </label>
//           );
//         })}

//         {userChoice && (
//           <p className="mt-6 text-green-700 font-medium">
//             ✅ Correct Answer: {q.correctAnswer}
//           </p>
//         )}

//         {userChoice && (
//           <p
//             className="mt-2 text-blue-700 text-sm underline cursor-pointer transition-all"
//             onClick={() => setShowExplanation((prev) => !prev)}
//           >
//             {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
//           </p>
//         )}

//         {showExplanation && (
//           <p className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
//             {q.explanation}
//           </p>
//         )}

//         <p className="text-xs text-gray-500 mt-4">
//           Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
//         </p>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-4 flex justify-between border-t mt-8">
//         <button
//           disabled={currentIndex === 0}
//           onClick={() => setCurrentIndex(currentIndex - 1)}
//           className={`px-8 py-2 rounded-lg ${
//             currentIndex === 0 ? 'bg-gray-400 text-white' : 'bg-red-500 text-white'
//           }`}
//         >
//           Prev
//         </button>

//         <button
//           onClick={next}
//           className="px-8 py-2 rounded-lg bg-blue-600 text-white"
//         >
//           {currentIndex === questions.length - 1 ? 'Next Subject' : 'Next'}
//         </button>
//       </div>
//     </main>
//   );
// }




// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { useStudyStore } from "../../../../store/studyStore";
// import InitializePayment from "../../../../payments/initializePayment";

// export default function QuestionCard() {
//   const navigate = useNavigate();

//   const {
//     currentIndex,
//     selectedOptions,
//     setSelectedOption,
//     setCurrentIndex,
//     next,
//     loading,
//     paymentLocked,
//     getQuestions,
//   } = useStudyStore();



  
//   const questions = getQuestions();
//   const q = questions?.[currentIndex] ?? null;
  
//   if (!q) return null;

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
//     const t = setTimeout(() => setVisible(true), 200);
//     return () => clearTimeout(t);
//   }, [currentIndex, canRenderQuestion]);

//   // ----------------------------
//   // Skeleton (ONLY when loading questions)
//   // ----------------------------
//   if ((loading || !q) && !paymentLocked) {
//     return (
//       <main className="p-4">
//         <div className="border border-gray-300 rounded-lg p-4 space-y-4 animate-pulse">
//           <div className="h-6 w-48 bg-gray-300 rounded-lg p-4 space-y-4 animate-pulse" />
//           <div className="h-12 bg-gray-300 rounded-lg p-4 space-y-4 animate-pulse" />
//           <div className="space-y-3">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="h-10 bg-gray-300 rounded-lg p-4 space-y-4 animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <section className="py-0">
//       {/* Back */}
//       <div className="p-2">
//         <button
//           onClick={() => navigate("/user/dashboard")}
//           className=" text-white p-2 rounded text-[11px] bg-primary hover:bg-primary-hover"
//         >
//           ← Back to Dashboard
//         </button>
//       </div>

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
//                 <h2 className="font-semibold mb-2">
//                   Question {currentIndex + 1} of {questions.length}
//                 </h2>

//                 <p className="mb-4">{q.text}</p>

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
//                         className={`flex items-center gap-2 p-2 mb-3 border rounded-lg cursor-pointer ${border}`}
//                       >
//                         <input
//                           type="radio"
//                           name={q.id}
//                           checked={userChoice === opt}
//                           onChange={() => {
//                             setSelectedOption(q.id, opt);
//                             setShowExplanation(false);
//                           }}
//                         />
//                         {letter}. {opt}
//                       </label>
//                     );
//                   })}


//                 {userChoice && (
//                   <>
//                     <p className="mt-4 font-medium text-green-700">
//                       ✅ Correct Answer: {q.correctAnswer}
//                     </p>

//                     <button
//                       onClick={() => setShowExplanation((s) => !s)}
//                       className="text-sm underline text-blue-600 mt-2"
//                     >
//                       {showExplanation
//                         ? "Hide Explanation"
//                         : "Show Explanation"}
//                     </button>
//                   </>
//                 )}

//                 {showExplanation && (
//                   <p className="mt-2 bg-blue-50 p-2 rounded text-sm">
//                     {q.explanation}
//                   </p>
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
//                 onClick={() => setCurrentIndex(currentIndex - 1)}
//                 className={`px-6 py-2 rounded ${
//                   currentIndex === 0
//                     ? "bg-gray-400 text-white"
//                     : "bg-red-500 text-white"
//                 }`}
//               >
//                 Prev
//               </button>

//               <button
//                 onClick={next}
//                 disabled={paymentLocked}
//                 className={`px-6 py-2 rounded ${
//                   paymentLocked
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 text-white"
//                 }`}
//               >
//                 Next
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
// import { useStudyStore } from "../../../../store/studyStore";
// import InitializePayment from "../../../../payment/initializePayment";

// export default function QuestionCard() {
//   const navigate = useNavigate();

//   const {
//     currentIndex,
//     selectedOptions,
//     setSelectedOption,
//     setCurrentIndex,
//     next,
//     loading,
//     paymentLocked,
//     getQuestions,
//   } = useStudyStore();



  
//   const questions = getQuestions();
//   const q = questions?.[currentIndex] ?? null;
  
//   // if (!q) return null;

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
//   // Skeleton (ONLY when loading questions)
//   // ----------------------------
//   if ((loading || !q) && !paymentLocked) {
//     return (
//       <main className="p-4">
//         <div className="border border-gray-300 rounded-lg p-4 space-y-4 animate-pulse">
//           <div className="h-6 w-48 bg-gray-300 rounded-lg p-4 space-y-4 animate-pulse" />
//           <div className="h-12 bg-gray-300 rounded-lg p-4 space-y-4 animate-pulse" />
//           <div className="space-y-3">
//             {Array.from({ length: 4 }).map((_, i) => (
//               <div key={i} className="h-10 bg-gray-300 rounded-lg p-4 space-y-4 animate-pulse" />
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   return (
//     <section className="py-0">
//       {/* Back */}
//       <div className="p-2">
//         <button
//           onClick={() => navigate("/user/dashboard")}
//           className=" text-white p-2 rounded text-[11px] bg-primary hover:bg-primary-hover"
//         >
//           ← Back to Dashboard
//         </button>
//       </div>

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
//                 <h2 className="font-semibold mb-2">
//                   Question {currentIndex + 1} of {questions.length}
//                 </h2>

//                 <p className="mb-4">{q.text}</p>

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
//                         className={`flex items-center gap-2 p-2 mb-3 border rounded-lg cursor-pointer ${border}`}
//                       >
//                         <input
//                           type="radio"
//                           name={q.id}
//                           checked={userChoice === opt}
//                           onChange={() => {
//                             setSelectedOption(q.id, opt);
//                             setShowExplanation(false);
//                           }}
//                         />
//                         {letter}. {opt}
//                       </label>
//                     );
//                   })}


//                 {userChoice && (
//                   <>
//                     <p className="mt-4 font-medium text-green-700">
//                       ✅ Correct Answer: {q.correctAnswer}
//                     </p>

//                     <button
//                       onClick={() => setShowExplanation((s) => !s)}
//                       className="text-sm underline text-blue-600 mt-2"
//                     >
//                       {showExplanation
//                         ? "Hide Explanation"
//                         : "Show Explanation"}
//                     </button>
//                   </>
//                 )}

//                 {showExplanation && (
//                   <p className="mt-2 bg-blue-50 p-2 rounded text-sm">
//                     {q.explanation}
//                   </p>
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
//                 onClick={() => setCurrentIndex(currentIndex - 1)}
//                 className={`px-6 py-2 rounded ${
//                   currentIndex === 0
//                     ? "bg-gray-400 text-white"
//                     : "bg-red-500 text-white"
//                 }`}
//               >
//                 Prev
//               </button>

//               <button
//                 onClick={next}
//                 disabled={paymentLocked}
//                 className={`px-6 py-2 rounded ${
//                   paymentLocked
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : "bg-blue-600 text-white"
//                 }`}
//               >
//                 Next
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
// import { useStudyStore } from "../../../../store/studyStore";
// import InitializePayment from "../../../../payment/initializePayment";
// import { useToast } from "@/components/ui/use-toast";

// export default function QuestionCard() {
//   const navigate = useNavigate();

//   const {
//     currentIndex,
//     selectedOptions,
//     setSelectedOption,
//     setCurrentIndex,
//     next,
//     loading,
//     paymentLocked,
//     getQuestions,
//     submitAnswer,
//     sessionActive,
//     endStudySession,
//   } = useStudyStore();

//   const questions = getQuestions();
//   const q = questions?.[currentIndex] ?? null;
//   const { toast } = useToast();
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
//       toast.loading("Ending session...", { id: "end-session" });
//       await endStudySession();
//       toast.success("Study session ended successfully!", { id: "end-session" });
//       navigate("/user/dashboard");
//     } catch (error) {
//       toast.error("Failed to end session", { id: "end-session" });
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
//       {/* Back */}
//       <div className="p-2">
//         <button
//           onClick={() => navigate("/user/dashboard")}
//           className="text-white p-2 rounded text-[11px] bg-primary hover:bg-primary-hover"
//         >
//           ← Back to Dashboard
//         </button>
//       </div>

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
//                 onClick={() => setCurrentIndex(currentIndex - 1)}
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
// import { useStudyStore } from "../../../../store/studyStore";
// import InitializePayment from "../../../../payment/initializePayment";
// import { useToast } from "@/components/ui/use-toast";

// export default function QuestionCard() {
//   const navigate = useNavigate();
//   const { toast } = useToast(); // ✅ Fixed: Destructure toast from useToast

//   const {
//     currentIndex,
//     selectedOptions,
//     setSelectedOption,
//     setCurrentIndex,
//     next,
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
//       {/* Back */}
//       <div className="p-2">
//         <button
//           onClick={() => navigate("/user/dashboard")}
//           className="text-white p-2 rounded text-[11px] bg-primary hover:bg-primary-hover"
//         >
//           ← Back to Dashboard
//         </button>
//       </div>

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
//                 onClick={() => setCurrentIndex(currentIndex - 1)}
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
// import { useStudyStore } from "../../../../store/studyStore";
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






import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyStore } from "../../../../store/studyStore";
import InitializePayment from "../../../../payment/initializePayment";
import { useToast } from "@/components/ui/use-toast";

export default function QuestionCard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    currentIndex,
    selectedOptions,
    setSelectedOption,
    next,
    prev,
    loading,
    paymentLocked,
    getQuestions,
    submitAnswer,
    sessionActive,
    endStudySession,
    initialized,
  } = useStudyStore();

  const questions = getQuestions();
  const q = questions?.[currentIndex] ?? null;

  const [visible, setVisible] = useState(false);
  const [showStudyPanel, setShowStudyPanel] = useState(false);

  const userChoice = q ? selectedOptions[q.id] : null;
  const isCorrect = q && userChoice === q.correctAnswer;

  // ✅ Only render question when fully loaded
  const canRenderQuestion = !!q && !paymentLocked && initialized;
  const isFullyLoaded = initialized && !loading;

  // ----------------------------
  // Fade-in effect for question
  // ----------------------------
  useEffect(() => {
    if (!canRenderQuestion) {
      setVisible(false);
      setShowStudyPanel(false);
      return;
    }

    setVisible(false);
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, [currentIndex, canRenderQuestion]);

  // ----------------------------
  // Reset study panel when question changes
  // ----------------------------
  useEffect(() => {
    setShowStudyPanel(false);
  }, [currentIndex]);

  // ----------------------------
  // Handle End Session
  // ----------------------------
  const handleEndSession = async () => {
    try {
      toast({
        title: "Ending session...",
        description: "Please wait while we process your request.",
      });
      await endStudySession();
      toast({
        title: "Success",
        description: "Study session ended successfully!",
      });
      navigate("/user/dashboard");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to end session. Please try again.",
        variant: "destructive",
      });
    }
  };

  // ----------------------------
  // Handle option selection with backend submission
  // ----------------------------
  const handleOptionSelect = async (option) => {
    setSelectedOption(q.id, option);
    setShowStudyPanel(false);

    if (sessionActive) {
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
  // Loading Skeleton - Show until EVERYTHING is ready
  // ----------------------------
  if (!isFullyLoaded || !canRenderQuestion) {
    return (
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Left: Question Skeleton */}
          <main>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 space-y-4 animate-pulse">
              <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded-lg" />
              <div className="h-16 bg-gray-300 dark:bg-gray-700 rounded-lg" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-12 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                ))}
              </div>
              <div className="flex justify-between mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
                <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg" />
                <div className="h-10 w-24 bg-gray-300 dark:bg-gray-700 rounded-lg" />
              </div>
            </div>
          </main>

          {/* Right: Sidebar Skeleton */}
          <aside>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 space-y-4 animate-pulse">
              <div className="h-6 w-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
              <div className="h-32 bg-gray-300 dark:bg-gray-700 rounded-lg" />
            </div>
          </aside>
        </div>
      </section>
    );
  }

  return (
    <section className="py-0">
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_650px] md:grid-cols-[1fr_250px] gap-8">
        {/* ================= LEFT: QUESTION ================= */}
        <main>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6">
            <div
              className={`transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            >
              {/* Question Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">
                  Question {currentIndex + 1} of {questions.length}
                </h2>
                
                {/* Session Status Indicator with End Button */}
                {sessionActive && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></span>
                      Session Active
                    </span>
                    <button
                      onClick={handleEndSession}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
                    >
                      End Session
                    </button>
                  </div>
                )}
              </div>

              {/* Question Text */}
              <p className="mb-6 text-gray-800 dark:text-gray-200 text-lg leading-relaxed">
                {q.text}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {Array.isArray(q.options) &&
                  q.options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);

                    let borderColor = "border-gray-300 dark:border-gray-600";
                    let bgColor = "bg-white dark:bg-gray-800";
                    
                    if (userChoice) {
                      if (opt === q.correctAnswer) {
                        borderColor = "border-green-600";
                        bgColor = "bg-green-50 dark:bg-green-900/20";
                      } else if (opt === userChoice) {
                        borderColor = "border-red-600";
                        bgColor = "bg-red-50 dark:bg-red-900/20";
                      }
                    }

                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-3 p-2 border-2 rounded-lg cursor-pointer transition-all ${borderColor} ${bgColor} ${
                          !userChoice ? "hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400" : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={q.id}
                          checked={userChoice === opt}
                          onChange={() => handleOptionSelect(opt)}
                          disabled={!!userChoice}
                          className="w-4 h-4"
                        />
                        <span className="text-gray-800 dark:text-gray-200">
                          <strong>{letter}.</strong> {opt}
                        </span>
                      </label>
                    );
                  })}
              </div>

              {/* Question Meta Info */}
              {(q.year || q.difficulty || q.category) && (
                <div className="mt-6 flex gap-2 flex-wrap text-xs">
                  {q.year && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      Year: {q.year}
                    </span>
                  )}
                  {q.difficulty && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      {q.difficulty}
                    </span>
                  )}
                  {q.category && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">
                      {q.category}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex justify-between items-center border-t border-gray-300 dark:border-gray-700 pt-4">
              <button
                disabled={currentIndex === 0}
                onClick={prev}
                className={`px-6 py-2.5 rounded-lg transition font-medium ${
                  currentIndex === 0
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-red-500 text-white hover:bg-red-600"
                }`}
              >
                Previous
              </button>

              <button
                onClick={next}
                disabled={paymentLocked || !userChoice}
                className={`px-6 py-2.5 rounded-lg transition font-medium ${
                  paymentLocked || !userChoice
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {currentIndex === questions.length - 1 ? "Finish" : "Next"}
              </button>
            </div>
          </div>
        </main>

        {/* ================= RIGHT: SIDEBAR ================= */}
        <aside className="space-y-4">
          {/* Payment Panel */}
          {paymentLocked && (
            <div>
              <InitializePayment />
            </div>
          )}

          {/* Study Panel - Only shows when user selects an option */}
          {!paymentLocked && userChoice && (
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
              {/* Study Button */}
              <button
                onClick={() => setShowStudyPanel(!showStudyPanel)}
                className={`w-full px-4 py-3 rounded-lg font-semibold transition-all ${
                  showStudyPanel
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {showStudyPanel ? "Hide Study Panel" : "📚 Study"}
              </button>

              {/* Answer & Explanation - Shows when Study button is clicked */}
              {showStudyPanel && (
                <div className="mt-4 space-y-4 animate-fadeIn">
                  {/* Correct Answer */}
                  <div className={`p-4 rounded-lg ${
                    isCorrect 
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700" 
                      : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
                  }`}>
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                      {isCorrect ? '✅ Correct!' : '❌ Incorrect'}
                    </h4>
                    <p className={`text-sm font-medium ${
                      isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'
                    }`}>
                      Correct Answer: <strong>{q.correctAnswer}</strong>
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">
                      💡 Explanation
                    </h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                      {q.explanation || "No explanation available for this question."}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Placeholder when no option selected */}
          {!paymentLocked && !userChoice && (
            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800/50">
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                Select an option to unlock the study panel
              </p>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}