// // import { useEffect, useState } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useQuizStore } from "../../store/quizStore";

// // function Timer({ seconds }) {
// //   const mins = Math.floor(seconds / 60);
// //   const secs = seconds % 60;
// //   return (
// //     <div className="text-lg font-mono">
// //       {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
// //     </div>
// //   );
// // }

// // function QuestionNavigator({ questions, currentIndex, onSelect }) {
// //   return (
// //     <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
// //       {questions.map((q, idx) => {
// //         const qId = q._id || q.id || q.questionId || idx;
// //         return (
// //           <button
// //             key={qId}
// //             onClick={() => onSelect(idx)}
// //             className={`w-10 h-10 rounded-lg font-semibold transition-all ${
// //               q.userAnswer !== null
// //                 ? "bg-blue-600 text-white"
// //                 : idx === currentIndex
// //                 ? "bg-blue-200 border-2 border-blue-600"
// //                 : "bg-white border border-gray-300"
// //             }`}
// //           >
// //             {idx + 1}
// //           </button>
// //         );
// //       })}
// //     </div>
// //   );
// // }

// // export default function QuizPage() {
// //   const navigate = useNavigate();
// //   const {
// //     initQuiz,
// //     questions,
// //     currentIndex,
// //     answer,
// //     next,
// //     prev,
// //     submit,
// //     goToQuestion,
// //     loading,
// //     timerSeconds,
// //   } = useQuizStore();

// //   const [selectedOption, setSelectedOption] = useState(null);
// //   const [feedback, setFeedback] = useState(null);
// //   const [isProcessing, setIsProcessing] = useState(false);

// //   useEffect(() => {
// //     initQuiz();
// //   }, []);

// //   useEffect(() => {
// //     // Reset selection when question changes
// //     const currentQ = questions[currentIndex];
// //     if (currentQ) {
// //       setSelectedOption(currentQ.userAnswer);
// //       setFeedback(null);
// //     }
// //   }, [currentIndex, questions]);

// //   const handleAnswer = async (option) => {
// //     if (isProcessing) return;

// //     setSelectedOption(option);
// //     setIsProcessing(true);

// //     const currentQ = questions[currentIndex];
// //     // Use _id or id depending on what the backend returns
// //     const questionId = currentQ._id || currentQ.id || currentQ.questionId;
// //     console.log("Current question:", currentQ);
// //     console.log("Question ID:", questionId);
    
// //     const result = await answer(questionId, option);

// //     if (result) {
// //       setFeedback({
// //         isCorrect: result.isCorrect,
// //         explanation: result.explanation,
// //       });

// //       // Auto-advance after 1.5 seconds
// //       setTimeout(() => {
// //         if (currentIndex < questions.length - 1) {
// //           next();
// //         }
// //         setIsProcessing(false);
// //       }, 1500);
// //     } else {
// //       setIsProcessing(false);
// //     }
// //   };

// //   const handleFinish = async () => {
// //     await submit();
// //     navigate("/quiz/results");
// //   };

// //   if (loading) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="text-center">
// //           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
// //           <p className="text-lg">Loading your quiz...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   if (!questions.length) {
// //     return (
// //       <div className="flex items-center justify-center min-h-screen">
// //         <div className="text-center">
// //           <p className="text-xl mb-4">No quiz available</p>
// //           <button
// //             onClick={() => navigate("/")}
// //             className="px-6 py-2 bg-blue-600 text-white rounded-lg"
// //           >
// //             Go to Dashboard
// //           </button>
// //         </div>
// //       </div>
// //     );
// //   }

// //   const currentQ = questions[currentIndex];
// //   const progress = ((currentIndex + 1) / questions.length) * 100;
// //   const answeredCount = questions.filter((q) => q.userAnswer !== null).length;
// //   const allAnswered = answeredCount === questions.length;

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-4">
// //       <div className="max-w-4xl mx-auto space-y-6">
// //         {/* Header */}
// //         <div className="bg-white rounded-lg shadow-md p-4">
// //           <div className="flex justify-between items-center mb-4">
// //             <div>
// //               <h1 className="text-2xl font-bold">Daily Quiz</h1>
// //               <p className="text-sm text-gray-600">
// //                 Question {currentIndex + 1} of {questions.length}
// //               </p>
// //             </div>
// //             <div className="text-right">
// //               <div className="text-sm text-gray-600 mb-1">Time Elapsed</div>
// //               <Timer seconds={timerSeconds} />
// //             </div>
// //           </div>

// //           {/* Progress Bar */}
// //           <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
// //             <div
// //               className="bg-blue-600 h-full transition-all duration-300"
// //               style={{ width: `${progress}%` }}
// //             />
// //           </div>

// //           <div className="flex justify-between text-sm text-gray-600 mt-2">
// //             <span>{answeredCount} answered</span>
// //             <span>{questions.length - answeredCount} remaining</span>
// //           </div>
// //         </div>

// //         {/* Question Navigator */}
// //         <QuestionNavigator
// //           questions={questions}
// //           currentIndex={currentIndex}
// //           onSelect={goToQuestion}
// //         />

// //         {/* Question Card */}
// //         <div className="bg-white rounded-lg shadow-md p-6">
// //           <h2 className="text-xl font-semibold mb-6">{currentQ.text}</h2>

// //           <div className="space-y-3">
// //             {currentQ.options.map((opt) => {
// //               const isSelected = selectedOption === opt;
// //               const showFeedback = feedback && isSelected;

// //               let buttonClass =
// //                 "w-full p-4 border-2 rounded-lg text-left transition-all font-medium ";

// //               if (showFeedback) {
// //                 buttonClass += feedback.isCorrect
// //                   ? "border-green-500 bg-green-50 text-green-900"
// //                   : "border-red-500 bg-red-50 text-red-900";
// //               } else if (isSelected) {
// //                 buttonClass += "border-blue-600 bg-blue-50";
// //               } else {
// //                 buttonClass += "border-gray-300 hover:border-blue-300 hover:bg-blue-50";
// //               }

// //               return (
// //                 <button
// //                   key={opt}
// //                   onClick={() => handleAnswer(opt)}
// //                   disabled={isProcessing || currentQ.userAnswer !== null}
// //                   className={buttonClass}
// //                 >
// //                   <div className="flex items-center justify-between">
// //                     <span>{opt}</span>
// //                     {showFeedback && (
// //                       <span className="text-2xl">
// //                         {feedback.isCorrect ? "✓" : "✗"}
// //                       </span>
// //                     )}
// //                   </div>
// //                 </button>
// //               );
// //             })}
// //           </div>

// //           {/* Explanation */}
// //           {feedback && feedback.explanation && (
// //             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
// //               <p className="text-sm font-semibold text-blue-900 mb-1">
// //                 Explanation:
// //               </p>
// //               <p className="text-sm text-blue-800">{feedback.explanation}</p>
// //             </div>
// //           )}
// //         </div>

// //         {/* Navigation */}
// //         <div className="flex justify-between">
// //           <button
// //             onClick={prev}
// //             disabled={currentIndex === 0}
// //             className="px-6 py-3 bg-gray-200 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-300"
// //           >
// //             ← Previous
// //           </button>

// //           {currentIndex === questions.length - 1 ? (
// //             <button
// //               onClick={handleFinish}
// //               disabled={!allAnswered}
// //               className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               Finish Quiz {allAnswered ? "✓" : `(${questions.length - answeredCount} left)`}
// //             </button>
// //           ) : (
// //             <button
// //               onClick={next}
// //               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
// //             >
// //               Next →
// //             </button>
// //           )}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }


// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuizStore } from "../../store/quizStore";

// function Timer({ seconds }) {
//   const mins = Math.floor(seconds / 60);
//   const secs = seconds % 60;
//   return (
//     <div className="text-lg font-mono">
//       {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
//     </div>
//   );
// }

// function QuestionNavigator({ questions, currentIndex, onSelect }) {
//   return (
//     <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
//       {questions.map((q, idx) => {
//         const qId = q._id || q.id || q.questionId || idx;
//         return (
//           <button
//             key={qId}
//             onClick={() => onSelect(idx)}
//             className={`w-10 h-10 rounded-lg font-semibold transition-all ${
//               q.userAnswer !== null
//                 ? "bg-blue-600 text-white"
//                 : idx === currentIndex
//                 ? "bg-blue-200 border-2 border-blue-600"
//                 : "bg-white border border-gray-300"
//             }`}
//           >
//             {idx + 1}
//           </button>
//         );
//       })}
//     </div>
//   );
// }

// export default function QuizPage() {
//   const navigate = useNavigate();
//   const {
//     initQuiz,
//     questions,
//     currentIndex,
//     answer,
//     next,
//     prev,
//     submit,
//     goToQuestion,
//     loading,
//     timerSeconds,
//     finished,
//     result,
//   } = useQuizStore();

//   const [selectedOption, setSelectedOption] = useState(null);
//   const [feedback, setFeedback] = useState(null);
//   const [isProcessing, setIsProcessing] = useState(false);

//   useEffect(() => {
//     initQuiz();
//   }, []);

//   useEffect(() => {
//     // Reset selection when question changes
//     const currentQ = questions[currentIndex];
//     if (currentQ) {
//       setSelectedOption(currentQ.userAnswer);
//       setFeedback(null);
//     }
//   }, [currentIndex, questions]);

//   // If quiz is already completed, show completion screen
//   if (finished && result?.alreadyCompleted) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
//         <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
//           {/* Icon */}
//           <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//             <span className="text-6xl">✓</span>
//           </div>

//           {/* Title */}
//           <h1 className="text-3xl font-bold text-gray-900 mb-3">
//             Quiz Already Completed!
//           </h1>
          
//           {/* Message */}
//           <p className="text-lg text-gray-600 mb-8">
//            Opps! You've already completed today's quiz. Come back tomorrow for a new challenge!
//           </p>

//           {/* Stats */}
//           <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
//             <div className="text-5xl font-bold text-blue-600 mb-2">
//               {result.percentage}%
//             </div>
//             <div className="text-xl text-gray-700 font-semibold mb-4">
//               {result.score} / {result.totalQuestions}
//             </div>
            
//             <div className="grid grid-cols-2 gap-4 mt-6">
//               <div className="bg-white rounded-xl p-4">
//                 <div className="text-2xl font-bold text-green-600">{result.correctCount}</div>
//                 <div className="text-sm text-gray-600">Correct</div>
//               </div>
//               <div className="bg-white rounded-xl p-4">
//                 <div className="text-2xl font-bold text-red-600">{result.wrongCount}</div>
//                 <div className="text-sm text-gray-600">Wrong</div>
//               </div>
//             </div>
//           </div>

//           {/* Next Quiz Time */}
//           <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
//             <div className="flex items-center justify-center gap-2 text-yellow-800">
//               <span className="text-2xl">⏰</span>
//               <span className="font-semibold">Next quiz available at 5:00 AM</span>
//             </div>
//           </div>

//           {/* Action Button */}
//           <button
//             onClick={() => navigate("/user/dashboard")}
//             className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
//           >
//             Return to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const handleAnswer = async (option) => {
//     if (isProcessing) return;

//     setSelectedOption(option);
//     setIsProcessing(true);

//     const currentQ = questions[currentIndex];
//     // Use _id or id depending on what the backend returns
//     const questionId = currentQ._id || currentQ.id || currentQ.questionId;
//     console.log("Current question:", currentQ);
//     console.log("Question ID:", questionId);
    
//     const result = await answer(questionId, option);

//     if (result) {
//       setFeedback({
//         isCorrect: result.isCorrect,
//         explanation: result.explanation,
//       });

//       // Auto-advance after 1.5 seconds
//       setTimeout(() => {
//         if (currentIndex < questions.length - 1) {
//           next();
//         }
//         setIsProcessing(false);
//       }, 1500);
//     } else {
//       setIsProcessing(false);
//     }
//   };

//   const handleFinish = async () => {
//     await submit();
//     navigate("/quiz/results");
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-lg">Loading your daily quiz...</p>
//         </div>
//       </div>
//     );
//   }

//   if (!questions.length) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-center">
//           <p className="text-xl mb-4">No quiz available</p>
//           <button
//             onClick={() => navigate("/")}
//             className="px-6 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             Go to Dashboard
//           </button>
//         </div>
//       </div>
//     );
//   }

//   const currentQ = questions[currentIndex];
//   const progress = ((currentIndex + 1) / questions.length) * 100;
//   const answeredCount = questions.filter((q) => q.userAnswer !== null).length;
//   const allAnswered = answeredCount === questions.length;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-4xl mx-auto space-y-6">
//         {/* Header */}
//         <div className="bg-white rounded-lg shadow-md p-4">
//           <div className="flex justify-between items-center mb-4">
//             <div>
//               <h1 className="text-2xl font-bold">Daily Quiz</h1>
//               <p className="text-sm text-gray-600">
//                 Question {currentIndex + 1} of {questions.length}
//               </p>
//             </div>
//             <div className="text-right">
//               <div className="text-sm text-gray-600 mb-1">Time Elapsed</div>
//               <Timer seconds={timerSeconds} />
//             </div>
//           </div>

//           {/* Progress Bar */}
//           <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
//             <div
//               className="bg-blue-600 h-full transition-all duration-300"
//               style={{ width: `${progress}%` }}
//             />
//           </div>

//           <div className="flex justify-between text-sm text-gray-600 mt-2">
//             <span>{answeredCount} answered</span>
//             <span>{questions.length - answeredCount} remaining</span>
//           </div>
//         </div>

//         {/* Question Navigator */}
//         <QuestionNavigator
//           questions={questions}
//           currentIndex={currentIndex}
//           onSelect={goToQuestion}
//         />

//         {/* Question Card */}
//         <div className="bg-white rounded-lg shadow-md p-6">
//           <h2 className="text-xl font-semibold mb-6">{currentQ.text}</h2>

//           <div className="space-y-3">
//             {currentQ.options.map((opt) => {
//               const isSelected = selectedOption === opt;
//               const showFeedback = feedback && isSelected;

//               let buttonClass =
//                 "w-full p-4 border-2 rounded-lg text-left transition-all font-medium ";

//               if (showFeedback) {
//                 buttonClass += feedback.isCorrect
//                   ? "border-green-500 bg-green-50 text-green-900"
//                   : "border-red-500 bg-red-50 text-red-900";
//               } else if (isSelected) {
//                 buttonClass += "border-blue-600 bg-blue-50";
//               } else {
//                 buttonClass += "border-gray-300 hover:border-blue-300 hover:bg-blue-50";
//               }

//               return (
//                 <button
//                   key={opt}
//                   onClick={() => handleAnswer(opt)}
//                   disabled={isProcessing || currentQ.userAnswer !== null}
//                   className={buttonClass}
//                 >
//                   <div className="flex items-center justify-between">
//                     <span>{opt}</span>
//                     {showFeedback && (
//                       <span className="text-2xl">
//                         {feedback.isCorrect ? "✓" : "✗"}
//                       </span>
//                     )}
//                   </div>
//                 </button>
//               );
//             })}
//           </div>

//           {/* Explanation */}
//           {feedback && feedback.explanation && (
//             <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
//               <p className="text-sm font-semibold text-blue-900 mb-1">
//                 Explanation:
//               </p>
//               <p className="text-sm text-blue-800">{feedback.explanation}</p>
//             </div>
//           )}
//         </div>

//         {/* Navigation */}
//         <div className="flex justify-between">
//           <button
//             onClick={prev}
//             disabled={currentIndex === 0}
//             className="px-6 py-3 bg-gray-200 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-300"
//           >
//             ← Previous
//           </button>

//           {currentIndex === questions.length - 1 ? (
//             <button
//               onClick={handleFinish}
//               disabled={!allAnswered}
//               className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Finish Quiz {allAnswered ? "✓" : `(${questions.length - answeredCount} left)`}
//             </button>
//           ) : (
//             <button
//               onClick={next}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
//             >
//               Next →
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }






import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../store/quizStore";

function Timer({ seconds }) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return (
    <div className="text-lg font-mono">
      {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
    </div>
  );
}

function QuestionNavigator({ questions, currentIndex, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
      {questions.map((q, idx) => {
        const qId = q._id || q.id || q.questionId || idx;
        return (
          <button
            key={qId}
            onClick={() => onSelect(idx)}
            className={`w-10 h-10 rounded-lg font-semibold transition-all ${
              q.userAnswer !== null
                ? "bg-blue-600 text-white"
                : idx === currentIndex
                ? "bg-blue-200 border-2 border-blue-600"
                : "bg-white border border-gray-300"
            }`}
          >
            {idx + 1}
          </button>
        );
      })}
    </div>
  );
}

export default function QuizPage() {
  const navigate = useNavigate();
  const {
    initQuiz,
    questions,
    currentIndex,
    answer,
    next,
    prev,
    submit,
    goToQuestion,
    loading,
    timerSeconds,
    finished,
    result,
  } = useQuizStore();

  const [selectedOption, setSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    initQuiz();
  }, []);

  useEffect(() => {
    // Reset selection when question changes
    const currentQ = questions[currentIndex];
    if (currentQ) {
      setSelectedOption(currentQ.userAnswer);
      setFeedback(null);
    }
  }, [currentIndex, questions]);

  // If quiz is already completed, show completion screen
  if (finished && result?.alreadyCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 text-center">
          {/* Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-6xl">✓</span>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Quiz Already Completed!
          </h1>
          
          {/* Message */}
          <p className="text-lg text-gray-600 mb-8">
            You've already completed today's quiz. Come back tomorrow for a new challenge!
          </p>

          {/* Stats */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8">
            <div className="text-5xl font-bold text-blue-600 mb-2">
              {result.percentage}%
            </div>
            <div className="text-xl text-gray-700 font-semibold mb-4">
              {result.score} / {result.totalQuestions}
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="bg-white rounded-xl p-4">
                <div className="text-2xl font-bold text-green-600">{result.correctCount}</div>
                <div className="text-sm text-gray-600">Correct</div>
              </div>
              <div className="bg-white rounded-xl p-4">
                <div className="text-2xl font-bold text-red-600">{result.wrongCount}</div>
                <div className="text-sm text-gray-600">Wrong</div>
              </div>
            </div>
          </div>

          {/* Next Quiz Time */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center justify-center gap-2 text-yellow-800">
              <span className="text-2xl">⏰</span>
              <span className="font-semibold">Next quiz available at 5:00 AM</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            <button
              onClick={() => navigate("/user/dashboard")}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
            >
              Return to Dashboard
            </button>
            <button
              onClick={() => navigate("/quiz/history")}
              className="w-full py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all"
            >
              📚 View Quiz History
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswer = async (option) => {
    if (isProcessing) return;

    setSelectedOption(option);
    setIsProcessing(true);

    const currentQ = questions[currentIndex];
    // Use _id or id depending on what the backend returns
    const questionId = currentQ._id || currentQ.id || currentQ.questionId;
    console.log("Current question:", currentQ);
    console.log("Question ID:", questionId);
    
    const result = await answer(questionId, option);

    if (result) {
      setFeedback({
        isCorrect: result.isCorrect,
        explanation: result.explanation,
      });

      // Auto-advance after 1.5 seconds
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          next();
        }
        setIsProcessing(false);
      }, 500);
    } else {
      setIsProcessing(false);
    }
  };

  const handleFinish = async () => {
    await submit();
    navigate("/quiz/results");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg">Loading your daily quiz...</p>
        </div>
      </div>
    );
  }

  if (!questions.length) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl mb-4">No quiz available</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;
  const answeredCount = questions.filter((q) => q.userAnswer !== null).length;
  const allAnswered = answeredCount === questions.length;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold">Daily Quiz</h1>
              <p className="text-sm text-gray-600">
                Question {currentIndex + 1} of {questions.length}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/quiz/history")}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors text-sm"
              >
                📚 History
              </button>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">Time Elapsed</div>
                <Timer seconds={timerSeconds} />
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex justify-between text-sm text-gray-600 mt-2">
            <span>{answeredCount} answered</span>
            <span>{questions.length - answeredCount} remaining</span>
          </div>
        </div>

        {/* Question Navigator */}
        <QuestionNavigator
          questions={questions}
          currentIndex={currentIndex}
          onSelect={goToQuestion}
        />

        {/* Question Card */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-6">{currentQ.text}</h2>

          <div className="space-y-3">
            {currentQ.options.map((opt) => {
              const isSelected = selectedOption === opt;
              const showFeedback = feedback && isSelected;

              let buttonClass =
                "w-full p-4 border-2 rounded-lg text-left transition-all font-medium ";

              if (showFeedback) {
                buttonClass += feedback.isCorrect
                  ? "border-green-500 bg-green-50 text-green-900"
                  : "border-red-500 bg-red-50 text-red-900";
              } else if (isSelected) {
                buttonClass += "border-blue-600 bg-blue-50";
              } else {
                buttonClass += "border-gray-300 hover:border-blue-300 hover:bg-blue-50";
              }

              return (
                <button
                  key={opt}
                  onClick={() => handleAnswer(opt)}
                  disabled={isProcessing || currentQ.userAnswer !== null}
                  className={buttonClass}
                >
                  <div className="flex items-center justify-between">
                    <span>{opt}</span>
                    {showFeedback && (
                      <span className="text-2xl">
                        {feedback.isCorrect ? "✓" : "✗"}
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {/* {feedback && feedback.explanation && (
            <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm font-semibold text-blue-900 mb-1">
                Explanation:
              </p>
              <p className="text-sm text-blue-800">{feedback.explanation}</p>
            </div>
          )} */}
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={prev}
            disabled={currentIndex === 0}
            className="px-6 py-3 bg-gray-200 rounded-lg font-semibold disabled:opacity-50 hover:bg-gray-300"
          >
            ← Previous
          </button>

          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleFinish}
              disabled={!allAnswered}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Finish Quiz {allAnswered ? "✓" : `(${questions.length - answeredCount} left)`}
            </button>
          ) : (
            <button
              onClick={next}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}