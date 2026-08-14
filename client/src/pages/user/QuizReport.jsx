import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuizStore } from "../../store/quizStore";

export default function QuizResultsPage() {
  const navigate = useNavigate();
  const { result, reset, fetchStats } = useQuizStore();
  const [expandedId, setExpandedId] = useState(null);
  const leavingRef = useRef(false);
  console.log(fetchStats);
  
  useEffect(() => {
    if (leavingRef.current) return;
    if (!result) {
      navigate("/quiz");
    } else {
      fetchStats();
    }
  }, [result, navigate, fetchStats]);

  if (!result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    );
  }

  // Calculate stats
  const questions = result.questions || [];
  const correctCount = result.correctCount || questions.filter(q => q.userAnswer === q.correctAnswer).length || 0;
  const wrongCount = result.wrongCount || (result.totalQuestions - correctCount) || 0;
  const totalQuestions = result.totalQuestions || questions.length || 10;
  const score = result.score || correctCount;
  const percentage = result.percentage || Math.round((correctCount / totalQuestions) * 100);

  console.log("Result data:", result);
  console.log("Questions:", questions);
  console.log("Stats - Correct:", correctCount, "Wrong:", wrongCount, "Total:", totalQuestions);

  const getGradeColor = (pct) => {
    if (pct >= 80) return "text-green-600";
    if (pct >= 60) return "text-blue-600";
    if (pct >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getGradeText = (pct) => {
    if (pct >= 80) return "Excellent Performance!";
    if (pct >= 60) return "Good Performance!";
    if (pct >= 40) return "Fair Performance!";
    return "Needs Improvement";
  };

  const handleReturnHome = () => {
    // Flag that we're intentionally leaving so the "no result -> /quiz"
    // redirect effect above does not fire and override this navigation.
    leavingRef.current = true;
    reset();
    navigate("/user/dashboard");
  };

  // Strip any HTML tags from question text so raw <p> etc. never show literally
  const stripHtml = (str = "") =>
    typeof str === "string" ? str.replace(/<[^>]*>/g, "").trim() : str;

  return (
    <div className="min-h-screen bg-gray-50 p-5">
      <div className=" space-y-6">
        
        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-8xl">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-6xl font-bold text-gray-900 mb-2">Quiz Complete!</h1>
          
           <div>
              {/* Score Display */}
              <div className="flex justify-center items-center mb-2">
                <div className="flex justify-center items-center">
                  <span className={`text-6xl font-bold ${getGradeColor(percentage)} mb-2`}>
                    {percentage}%
                  </span>
                  <span className="text-2xl text-gray-600 font-semibold bg-gray-100 inline-block px-4 rounded-lg">
                    {score}/{totalQuestions}
                  </span>
                </div>
              </div>
              <p className={`text-2xl font-semibold ${getGradeColor(percentage)}`}>
              {getGradeText(percentage)}
            </p>
           </div>
          </div>



          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 mt-12">
            <div className="text-center p-2 bg-green-50 rounded-xl border border-green-200">
              <div className="text-3xl font-bold text-green-600">{correctCount}</div>
              <div className="text-sm text-gray-600 font-medium mt-">Correct</div>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-xl border border-red-200">
              <div className="text-3xl font-bold text-red-600">{wrongCount}</div>
              <div className="text-sm text-gray-600 font-medium mt-1">Wrong</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded-xl border border-blue-200">
              <div className="text-3xl font-bold text-blue-600">
                {Math.floor((result.timeSpent || 0) / 60)}:{String((result.timeSpent || 0) % 60).padStart(2, "0")}
              </div>
              <div className="text-sm text-gray-600 font-medium mt-1">Time</div>
            </div>
          </div>
        </div>

          {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <button
            onClick={handleReturnHome}
            className="py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/quiz/history")}
            className="py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            📚 History
          </button>
          <button
            onClick={() => window.print()}
            className="py-4 bg-white text-gray-700 border-2 border-gray-300 rounded-xl font-semibold hover:bg-gray-50 transition-colors shadow-lg"
          >
            🖨️ Print
          </button>
        </div>

        {/* Questions Review Card */}
        <div className="bg-white rounded-2xl shadow-lg p-2">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 ml-6">Review Answers</h2>
          
          {questions.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>No questions to review</p>
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => {
              const qId = q._id || q.id || q.questionId || idx;
              const isExpanded = expandedId === qId;
              const isCorrect = q.userAnswer === q.correctAnswer;

              return (
                <div
                  key={qId}
                  className="border rounded-xl p-4 hover:shadow-md transition-shadow"
                  style={{ borderColor: isCorrect ? "#10b981" : "#ef4444" }}
                >
                  {/* Question Header */}
                  <div className="flex items-start gap-4 mb-2">
                    <div className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center font-bold text-white ${
                      isCorrect ? "bg-green-500" : "bg-red-500"
                    }`}>
                      {isCorrect ? "✓" : "✗"}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-700">Q{idx + 1}</span>
                        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${
                          isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}>
                          {isCorrect ? "Correct" : "Wrong"}
                        </span>
                      </div>
                      <p className="text-gray-900 font-medium">{stripHtml(q.question)}</p>
                    </div>
                  </div>

                  {/* Answers */}
                  <div className="ml-12 space-y-3">
                    <div>
                      <span className="text-sm text-gray-500 font-medium">Your answer:</span>
                      <div className={`mt-1 px-4 py-2 rounded-lg font-semibold inline-block ${
                        isCorrect 
                          ? "bg-green-50 text-green-700 border border-green-200" 
                          : "bg-red-50 text-red-700 border border-red-200"
                      }`}>
                        {q.userAnswer || "Not answered"}
                      </div>
                    </div>

                    {!isCorrect && (
                      <div>
                        <span className="text-sm text-gray-500 font-medium">Correct answer:</span>
                        <div className="mt-1 px-4 py-2 rounded-lg font-semibold bg-green-50 text-green-700 border border-green-200 inline-block">
                          {q.correctAnswer}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Explanation */}
                  {q.explanation && (
                    <div className="ml-8 mt-4">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : qId)}
                        className="text-blue-600 font-semibold text-sm hover:text-blue-700 flex items-center gap-1"
                      >
                        <svg 
                          className={`w-4 h-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        {isExpanded ? "Hide" : "Show"} explanation
                      </button>

                      {isExpanded && (
                        <div 
                          className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200"
                          dangerouslySetInnerHTML={{ __html: q.explanation }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          )}
        </div>



        {/* Footer Message */}
        <div className="text-center text-gray-600 py-4">
          <p className="font-medium">Great job! Come back tomorrow for a new quiz 🚀</p>
        </div>
      </div>
    </div>
  );
}
