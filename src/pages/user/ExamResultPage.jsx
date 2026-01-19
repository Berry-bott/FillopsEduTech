import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useExamStore } from "@/store/examStore";

export default function ExamResultPage() {
  const navigate = useNavigate();
  const { examId } = useParams();

  const examResults = useExamStore((s) => s.examResults);
  const examCompleted = useExamStore((s) => s.examCompleted);
  const reset = useExamStore((s) => s.reset);

  useEffect(() => {
    console.log("📊 ExamResultPage - examResults:", examResults);
    console.log("📊 ExamResultPage - examCompleted:", examCompleted);
    
    if (!examCompleted && !examResults && !examId) {
      console.warn("⚠️ No results available, redirecting to dashboard");
      navigate("/user/dashboard");
    }
    
    return () => {
      console.log("🧹 ExamResultPage unmounting - resetting exam store");
      reset();
    };
  }, [examCompleted, examResults, examId, navigate, reset]);

  if (!examResults) {
    return (
      <main className="p-6 min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Loading your results...</p>
        </div>
      </main>
    );
  }

  // ✅ Extract result data
  const resultData = examResults.result || {};
  
  // ✅ Parse rawScore to get correct/incorrect (e.g., "1/6" -> {correct: 1, total: 6})
  const parseRawScore = (rawScore) => {
    if (!rawScore || typeof rawScore !== 'string') return { correct: 0, total: 0 };
    const parts = rawScore.split('/');
    return {
      correct: parseInt(parts[0]) || 0,
      total: parseInt(parts[1]) || 0
    };
  };

  // ✅ Calculate totals from breakdown
  let totalCorrect = 0;
  let totalQuestions = 0;

  if (resultData.breakdown && Array.isArray(resultData.breakdown)) {
    resultData.breakdown.forEach(topic => {
      const { correct, total } = parseRawScore(topic.rawScore);
      totalCorrect += correct;
      totalQuestions += total;
    });
  }

  const totalIncorrect = totalQuestions - totalCorrect;
  const percentageNum = resultData.percentageScore ? parseInt(resultData.percentageScore) : 0;
  const isPassing = percentageNum >= 50;

  // ✅ Handle navigation
  const handleBackToDashboard = () => {
    navigate("/user/dashboard");
  };

  const handleRetakeExam = () => {
    // ✅ Clear exam state and navigate to exam page to start fresh
    reset();
    navigate("/exam");
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50 dark:from-gray-900 dark:via-slate-900 dark:to-gray-900 py-6 px-4">
      <div className="max-w-3xl mx-auto space-y-5">
        
        {/* Compact Header Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 border border-blue-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                isPassing ? 'bg-green-100 dark:bg-green-900/30' : 'bg-blue-100 dark:bg-blue-900/30'
              }`}>
                <span className="text-lg">{isPassing ? '🎉' : '✅'}</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 dark:text-white">Exam Completed</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">{examResults.userDetails?.name}</p>
              </div>
            </div>
            {examResults.passCode && (
              <div className="text-right">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">Pass Code</p>
                <p className="text-xl font-mono font-bold text-blue-600 dark:text-blue-400">{examResults.passCode}</p>
              </div>
            )}
          </div>
        </div>

        {/* Compact Score Cards Grid */}
        <div className="grid grid-cols-3 gap-3">
          {/* Main Score */}
            <div className="col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12"></div>
                <div className="relative">
                <p className="text-xs opacity-90 mb-1">Your Score</p>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-black">{resultData.scoreLabel?.split('/')[0] || resultData.totalScore}</span>
                    <span className="text-2xl font-bold opacity-80 mb-0.5">/ {resultData.scoreLabel?.split('/')[1] || resultData.totalPossible}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold">{resultData.percentageScore}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                    isPassing ? 'bg-green-400/30' : 'bg-blue-400/30'
                    }`}>
                    {isPassing ? 'PASSED' : 'COMPLETE'}
                    </span>
                </div>
                </div>
            </div>

          {/* Quick Stats */}
          <div className="space-y-2">
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-2 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-600 dark:text-gray-400">Correct</span>
              </div>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{totalCorrect}</p>
            </div>

            <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-2 border border-red-200 dark:border-red-800">
              <div className="flex items-center gap-2 mb-1">
                <svg className="w-4 h-4 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span className="text-xs text-gray-600 dark:text-gray-400">Wrong</span>
              </div>
              <p className="text-2xl font-bold text-red-600 dark:text-red-400">{totalIncorrect}</p>
            </div>
          </div>
        </div>

        {/* Compact Performance Breakdown */}
        {resultData.breakdown && resultData.breakdown.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-3 border border-blue-100 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
              <div className="bg-blue-100 dark:bg-blue-900/30 p-1.5 rounded-lg">
                <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">Subject Performance</h2>
            </div>
            
            <div className="space-y-2">
              {resultData.breakdown.map((topic, index) => {
                const { correct, total } = parseRawScore(topic.rawScore);
                const incorrect = total - correct;
                const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
                const isGoodScore = percentage >= 70;

                return (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-blue-50/50 dark:from-gray-700/50 dark:to-blue-900/10 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="bg-blue-500 w-1 h-5 rounded-full"></div>
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white">{topic.subject}</h3>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 ml-3">
                          <span>Score: <span className="font-semibold text-gray-800 dark:text-gray-300">{topic.rawScore}</span></span>
                          <span className="text-blue-600 dark:text-blue-400">Scaled: {topic.scaledScore}</span>
                        </div>
                      </div>
                      
                      <div className={`px-3 py-2 rounded-lg ${
                        isGoodScore 
                          ? 'bg-green-100 dark:bg-green-900/30' 
                          : 'bg-orange-100 dark:bg-orange-900/30'
                      }`}>
                        <div className={`text-xl font-bold ${
                          isGoodScore 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-orange-600 dark:text-orange-400'
                        }`}>
                          {percentage}%
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 mb-2 ml-3">
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{correct} correct</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{incorrect} wrong</span>
                      </div>
                    </div>
                    
                    <div className="relative h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden ml-3">
                      <div 
                        className={`absolute top-0 left-0 h-full rounded-full transition-all duration-700 ${
                          isGoodScore 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                            : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Enhanced Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          {/* Back to Dashboard Button */}
          <button
            onClick={handleBackToDashboard}
            className="group bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </button>

          {/* Retake Exam Button */}
          <button
            onClick={handleRetakeExam}
            className="group bg-green-500 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
          >
            <svg className="w-4 h-4 group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>Retake Exam</span>
          </button>
        </div>

      </div>
    </main>
  );
}