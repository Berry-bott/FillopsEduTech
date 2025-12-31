// // import { useEffect } from "react";
// // import { useNavigate } from "react-router-dom";
// // import { useQuizStore } from "../../store/quizStore";

// // export default function QuizHistoryPage() {
// //   const navigate = useNavigate();
// //   const { 
// //     history, 
// //     historyLoading, 
// //     historyPage, 
// //     historyLimit,
// //     historyTotal,
// //     fetchHistory,
// //     fetchQuizById 
// //   } = useQuizStore();

// //   useEffect(() => {
// //     fetchHistory(1, 10);
// //   }, [fetchHistory]);

// //   const handleViewQuiz = async (quizId) => {
// //     await fetchQuizById(quizId);
// //     navigate("/quiz/results");
// //   };

// //   const handlePageChange = (newPage) => {
// //     fetchHistory(newPage, historyLimit);
// //   };

// //   const totalPages = Math.ceil(historyTotal / historyLimit);

// //   const getGradeColor = (percentage) => {
// //     if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
// //     if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
// //     if (percentage >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
// //     return "text-red-600 bg-red-50 border-red-200";
// //   };

// //   const getGradeEmoji = (percentage) => {
// //     if (percentage >= 80) return "🏆";
// //     if (percentage >= 60) return "⭐";
// //     if (percentage >= 40) return "💪";
// //     return "📚";
// //   };

// //   const formatDate = (dateString) => {
// //     const date = new Date(dateString);
// //     return date.toLocaleDateString("en-US", {
// //       month: "short",
// //       day: "numeric",
// //       year: "numeric",
// //     });
// //   };

// //   if (historyLoading && history.length === 0) {
// //     return (
// //       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
// //         <div className="text-center">
// //         <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
// //           <p className="text-gray-600">Loading history...</p>
// //         </div>
// //       </div>
// //     );
// //   }

// //   return (
// //     <div className="min-h-screen bg-gray-50 p-4 py-8">
// //       <div className="max-w-5xl mx-auto">
// //         {/* Header */}
// //         <div className="mb-8">
// //           <button
// //             onClick={() => navigate("/user/dashboard")}
// //             className="text-blue-600 hover:text-blue-700 font-semibold mb-4 flex items-center gap-2"
// //           >
// //             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
// //               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
// //             </svg>
// //             Back to Dashboard
// //           </button>
// //           <h1 className="text-4xl font-bold text-gray-900">Quiz History</h1>
// //           <p className="text-gray-600 mt-2">Review your past quiz performances</p>
// //         </div>

// //         {/* History List */}
// //         {history.length === 0 ? (
// //           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
// //             <div className="text-6xl mb-4">📝</div>
// //             <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quiz History Yet</h2>
// //             <p className="text-gray-600 mb-6">Start taking quizzes to see your history here!</p>
// //             <button
// //               onClick={() => navigate("/quiz")}
// //               className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
// //             >
// //               Take Your First Quiz
// //             </button>
// //           </div>
// //         ) : (
// //           <div className="space-y-4">
// //             {history.map((quiz, idx) => {
// //               const percentage = quiz.percentage || Math.round((quiz.score / quiz.totalQuestions) * 100);
// //               const quizId = quiz._id || quiz.id;
              
// //               return (
// //                 <div
// //                   key={quizId || idx}
// //                   className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
// //                 >
// //                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
// //                     {/* Left Side - Date and Score */}
// //                     <div className="flex items-center gap-4">
// //                       {/* Emoji */}
// //                       <div className="text-5xl">
// //                         {getGradeEmoji(percentage)}
// //                       </div>

// //                       {/* Info */}
// //                       <div>
// //                         <div className="flex items-center gap-3 mb-1">
// //                           <h3 className="text-xl font-bold text-gray-900">
// //                             {formatDate(quiz.quizDate || quiz.completedAt)}
// //                           </h3>
// //                           <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(percentage)}`}>
// //                             {percentage}%
// //                           </span>
// //                         </div>
// //                         <p className="text-gray-600">
// //                           Score: <span className="font-semibold">{quiz.score || 0}</span> / {quiz.totalQuestions || 10}
// //                         </p>
// //                       </div>
// //                     </div>

// //                     {/* Right Side - Stats and Action */}
// //                     <div className="flex items-center gap-4">
// //                       {/* Quick Stats */}
// //                       <div className="hidden sm:flex gap-4">
// //                         <div className="text-center">
// //                           <div className="text-2xl font-bold text-green-600">
// //                             {quiz.correctAnswers || quiz.score || 0}
// //                           </div>
// //                           <div className="text-xs text-gray-500">Correct</div>
// //                         </div>
// //                         <div className="text-center">
// //                           <div className="text-2xl font-bold text-red-600">
// //                             {quiz.wrongAnswers || (quiz.totalQuestions - quiz.score) || 0}
// //                           </div>
// //                           <div className="text-xs text-gray-500">Wrong</div>
// //                         </div>
// //                         <div className="text-center">
// //                           <div className="text-2xl font-bold text-blue-600">
// //                             {Math.floor((quiz.timeSpent || 0) / 60)}m
// //                           </div>
// //                           <div className="text-xs text-gray-500">Time</div>
// //                         </div>
// //                       </div>

// //                       {/* Review Button */}
// //                       <button
// //                         onClick={() => handleViewQuiz(quizId)}
// //                         className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap"
// //                       >
// //                         Review Quiz
// //                       </button>
// //                     </div>
// //                   </div>
// //                 </div>
// //               );
// //             })}
// //           </div>
// //         )}

// //         {/* Pagination */}
// //         {totalPages > 1 && (
// //           <div className="mt-8 flex justify-center items-center gap-2">
// //             <button
// //               onClick={() => handlePageChange(historyPage - 1)}
// //               disabled={historyPage === 1}
// //               className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               Previous
// //             </button>

// //             <div className="flex gap-2">
// //               {[...Array(totalPages)].map((_, i) => {
// //                 const page = i + 1;
// //                 // Show first, last, current, and surrounding pages
// //                 if (
// //                   page === 1 ||
// //                   page === totalPages ||
// //                   (page >= historyPage - 1 && page <= historyPage + 1)
// //                 ) {
// //                   return (
// //                     <button
// //                       key={page}
// //                       onClick={() => handlePageChange(page)}
// //                       className={`w-10 h-10 rounded-lg font-semibold ${
// //                         page === historyPage
// //                           ? "bg-blue-600 text-white"
// //                           : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
// //                       }`}
// //                     >
// //                       {page}
// //                     </button>
// //                   );
// //                 } else if (
// //                   (page === historyPage - 2 && page > 1) ||
// //                   (page === historyPage + 2 && page < totalPages)
// //                 ) {
// //                   return <span key={page} className="px-2">...</span>;
// //                 }
// //                 return null;
// //               })}
// //             </div>

// //             <button
// //               onClick={() => handlePageChange(historyPage + 1)}
// //               disabled={historyPage === totalPages}
// //               className="px-4 py-2 bg-white border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
// //             >
// //               Next
// //             </button>
// //           </div>
// //         )}

// //         {/* Loading Overlay */}
// //         {historyLoading && history.length > 0 && (
// //           <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
// //             <div className="bg-white rounded-2xl p-6 shadow-xl">
// //               <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
// //             </div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useQuizStore } from "../../store/quizStore";

// export default function QuizHistoryPage() {
//   const navigate = useNavigate();
//   const { 
//     history, 
//     historyLoading, 
//     fetchHistory,
//     fetchQuizById 
//   } = useQuizStore();

//   const [loadingQuizId, setLoadingQuizId] = useState(null);

//   useEffect(() => {
//     // Fetch ALL history without pagination - pass a large limit or fetch all
//     fetchHistory(1, 1000); // Request 1000 quizzes to get full history
//   }, [fetchHistory]);

//   const handleViewQuiz = async (quizId) => {
//     setLoadingQuizId(quizId);
//     try {
//       await fetchQuizById(quizId);
//       navigate("/quiz/results");
//     } catch (error) {
//       console.error("Failed to load quiz:", error);
//     } finally {
//       setLoadingQuizId(null);
//     }
//   };

//   const getGradeColor = (percentage) => {
//     if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
//     if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
//     if (percentage >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
//     return "text-red-600 bg-red-50 border-red-200";
//   };

//   const getGradeEmoji = (percentage) => {
//     if (percentage >= 80) return "🏆";
//     if (percentage >= 60) return "⭐";
//     if (percentage >= 40) return "💪";
//     return "📚";
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString("en-US", {
//       month: "short",
//       day: "numeric",
//       year: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   if (historyLoading && history.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
//           <p className="text-gray-600">Loading your quiz history...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 p-4 py-8">
//       <div className="max-w-5xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <button
//             onClick={() => navigate("/user/dashboard")}
//             className="text-blue-600 hover:text-blue-700 font-semibold mb-4 flex items-center gap-2"
//           >
//             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//             Back to Dashboard
//           </button>
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-4xl font-bold text-gray-900">Quiz History</h1>
//               <p className="text-gray-600 mt-2">
//                 Review your past quiz performances 
//                 {history.length > 0 && (
//                   <span className="ml-2 text-blue-600 font-semibold">
//                     ({history.length} quiz{history.length !== 1 ? 'zes' : ''})
//                   </span>
//                 )}
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* History List */}
//         {history.length === 0 ? (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//             <div className="text-6xl mb-4">📝</div>
//             <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quiz History Yet</h2>
//             <p className="text-gray-600 mb-6">Start taking quizzes to see your history here!</p>
//             <button
//               onClick={() => navigate("/quiz")}
//               className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
//             >
//               Take Your First Quiz
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-4">
//             {history.map((quiz, idx) => {
//               const percentage = quiz.percentage || Math.round((quiz.score / quiz.totalQuestions) * 100);
//               const quizId = quiz._id || quiz.id;
//               const isLoadingThisQuiz = loadingQuizId === quizId;
              
//               return (
//                 <div
//                   key={quizId || idx}
//                   className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
//                 >
//                   <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     {/* Left Side - Date and Score */}
//                     <div className="flex items-center gap-4">
//                       {/* Emoji */}
//                       <div className="text-5xl">
//                         {getGradeEmoji(percentage)}
//                       </div>

//                       {/* Info */}
//                       <div>
//                         <div className="flex items-center gap-3 mb-1">
//                           <h3 className="text-xl font-bold text-gray-900">
//                             {formatDate(quiz.quizDate || quiz.completedAt)}
//                           </h3>
//                           <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(percentage)}`}>
//                             {percentage}%
//                           </span>
//                         </div>
//                         <p className="text-gray-600">
//                           Score: <span className="font-semibold">{quiz.score || 0}</span> / {quiz.totalQuestions || 10}
//                         </p>
//                         {quiz.subject && (
//                           <p className="text-sm text-gray-500 mt-1">
//                             Subject: {quiz.subject}
//                           </p>
//                         )}
//                       </div>
//                     </div>

//                     {/* Right Side - Stats and Action */}
//                     <div className="flex items-center gap-4">
//                       {/* Quick Stats */}
//                       <div className="hidden sm:flex gap-4">
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-green-600">
//                             {quiz.correctAnswers || quiz.score || 0}
//                           </div>
//                           <div className="text-xs text-gray-500">Correct</div>
//                         </div>
//                         <div className="text-center">
//                           <div className="text-2xl font-bold text-red-600">
//                             {quiz.wrongAnswers || (quiz.totalQuestions - quiz.score) || 0}
//                           </div>
//                           <div className="text-xs text-gray-500">Wrong</div>
//                         </div>
//                         {quiz.timeSpent !== undefined && (
//                           <div className="text-center">
//                             <div className="text-2xl font-bold text-blue-600">
//                               {Math.floor((quiz.timeSpent || 0) / 60)}m
//                             </div>
//                             <div className="text-xs text-gray-500">Time</div>
//                           </div>
//                         )}
//                       </div>

//                       {/* Review Button */}
//                       <button
//                         onClick={() => handleViewQuiz(quizId)}
//                         disabled={isLoadingThisQuiz}
//                         className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
//                       >
//                         {isLoadingThisQuiz ? (
//                           <>
//                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
//                             Loading...
//                           </>
//                         ) : (
//                           <>
//                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
//                             </svg>
//                             Review Quiz
//                           </>
//                         )}
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         )}

//         {/* Loading Overlay for initial load */}
//         {historyLoading && history.length === 0 && (
//           <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
//             <div className="bg-white rounded-2xl p-6 shadow-xl">
//               <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
//               <p className="text-gray-600 font-semibold">Loading history...</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../store/quizStore";

export default function QuizHistoryPage() {
  const navigate = useNavigate();
  const { 
    history, 
    historyLoading, 
    fetchHistory,
    fetchQuizById 
  } = useQuizStore();

  const [loadingQuizId, setLoadingQuizId] = useState(null);

  useEffect(() => {
    // Fetch ALL history without pagination - pass a large limit or fetch all
    const loadHistory = async () => {
      await fetchHistory(1, 1000); // Request 1000 quizzes to get full history
    };
    loadHistory();
  }, [fetchHistory]);

  // Debug: Log the entire history whenever it changes
  useEffect(() => {
    console.log("=== FULL QUIZ HISTORY DEBUG ===");
    console.log("Total quizzes in history:", history.length);
    console.log("Full history array:", history);
    
    if (history.length > 0) {
      console.log("First quiz:", history[0]);
      console.log("Last quiz:", history[history.length - 1]);
      
      // Group by date to see distribution
      const byDate = {};
      history.forEach(quiz => {
        const date = new Date(quiz.quizDate || quiz.completedAt).toLocaleDateString();
        byDate[date] = (byDate[date] || 0) + 1;
      });
      console.log("Quizzes by date:", byDate);
    }
    console.log("================================");
  }, [history]);

  const handleViewQuiz = async (quizId) => {
    setLoadingQuizId(quizId);
    try {
      await fetchQuizById(quizId);
      navigate("/quiz/results");
    } catch (error) {
      console.error("Failed to load quiz:", error);
    } finally {
      setLoadingQuizId(null);
    }
  };

  const getGradeColor = (percentage) => {
    if (percentage >= 80) return "text-green-600 bg-green-50 border-green-200";
    if (percentage >= 60) return "text-blue-600 bg-blue-50 border-blue-200";
    if (percentage >= 40) return "text-yellow-600 bg-yellow-50 border-yellow-200";
    return "text-red-600 bg-red-50 border-red-200";
  };

  const getGradeEmoji = (percentage) => {
    if (percentage >= 80) return "🏆";
    if (percentage >= 60) return "⭐";
    if (percentage >= 40) return "💪";
    return "📚";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (historyLoading && history.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your quiz history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/user/dashboard")}
            className="text-blue-600 hover:text-blue-700 font-semibold mb-4 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Quiz History</h1>
              <p className="text-gray-600 mt-2">
                Review your past quiz performances 
                {history.length > 0 && (
                  <span className="ml-2 text-blue-600 font-semibold">
                    ({history.length} quiz{history.length !== 1 ? 'zes' : ''})
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* History List */}
        {history.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Quiz History Yet</h2>
            <p className="text-gray-600 mb-6">Start taking quizzes to see your history here!</p>
            <button
              onClick={() => navigate("/quiz")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Take Your First Quiz
            </button>
          </div>
        ) : (
          <>
            {/* Debug Info Card */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4 mb-4">
              <h3 className="font-bold text-yellow-900 mb-2">🔍 Debug Information</h3>
              <p className="text-sm text-yellow-800">
                Total quizzes loaded: <strong>{history.length}</strong>
              </p>
              <p className="text-sm text-yellow-800 mt-1">
                Check browser console for detailed history logs
              </p>
            </div>

            <div className="space-y-4">
            {history.map((quiz, idx) => {
              const percentage = quiz.percentage || Math.round((quiz.score / quiz.totalQuestions) * 100);
              const quizId = quiz._id || quiz.id;
              const isLoadingThisQuiz = loadingQuizId === quizId;
              
              return (
                <div
                  key={quizId || idx}
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    {/* Left Side - Date and Score */}
                    <div className="flex items-center gap-4">
                      {/* Emoji */}
                      <div className="text-5xl">
                        {getGradeEmoji(percentage)}
                      </div>

                      {/* Info */}
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="text-xl font-bold text-gray-900">
                            {formatDate(quiz.quizDate || quiz.completedAt)}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getGradeColor(percentage)}`}>
                            {percentage}%
                          </span>
                        </div>
                        <p className="text-gray-600">
                          Score: <span className="font-semibold">{quiz.score || 0}</span> / {quiz.totalQuestions || 10}
                        </p>
                        {quiz.subject && (
                          <p className="text-sm text-gray-500 mt-1">
                            Subject: {quiz.subject}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Right Side - Stats and Action */}
                    <div className="flex items-center gap-4">
                      {/* Quick Stats */}
                      <div className="hidden sm:flex gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-600">
                            {quiz.correctAnswers || quiz.score || 0}
                          </div>
                          <div className="text-xs text-gray-500">Correct</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-600">
                            {quiz.wrongAnswers || (quiz.totalQuestions - quiz.score) || 0}
                          </div>
                          <div className="text-xs text-gray-500">Wrong</div>
                        </div>
                        {quiz.timeSpent !== undefined && (
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600">
                              {Math.floor((quiz.timeSpent || 0) / 60)}m
                            </div>
                            <div className="text-xs text-gray-500">Time</div>
                          </div>
                        )}
                      </div>

                      {/* Review Button */}
                      <button
                        onClick={() => handleViewQuiz(quizId)}
                        disabled={isLoadingThisQuiz}
                        className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {isLoadingThisQuiz ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                            Loading...
                          </>
                        ) : (
                          <>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Review Quiz
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          </>
        )}

        {/* Loading Overlay for initial load */}
        {historyLoading && history.length === 0 && (
          <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-6 shadow-xl">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-600 font-semibold">Loading history...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}