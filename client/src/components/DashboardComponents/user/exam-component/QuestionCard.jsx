import { useState, useEffect } from "react";
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



  // ✅ Only render question when allowed AND fully initialized
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
  // Simple loading state
  // ----------------------------
  if (loading || !q) {
    return (
      <main className="p-4 flex items-center justify-center min-h-[40vh]">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">Loading your questions...</p>
        </div>
      </main>
    );
  }

  return (
    <section className="py-0">
     
      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
        {/* LEFT: QUESTION */}
        <main>
          <div className="border border-gray-300 rounded-lg p-2">
            {canRenderQuestion ? (
              <div
                className={`transition-opacity duration-300 ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              >
                {/* Question Header with Timer */}
                <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                  <h2 className="font-semibold">
                    Question {currentIndex + 1} of {questions.length}
                  </h2>
                  
                  <div className="flex items-center gap-3">
                    {/* Timer */}
                    {timeRemaining !== null && (
                      <div className={`flex items-center gap-2 px-1 rounded-lg border-2 ${
                        isTimeRunningLow 
                          ? 'border-red-600 bg-red-50 dark:bg-red-900/20 text-red-600 animate-pulse' 
                          : 'border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                      }`}>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <div className=" text-sm text-gray-600">
                  Answered: {answeredCount} / {questions.length}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div 
                  className="mt-4 mb-1 text-md prose prose-sm max-w-none [&_img]:max-w-full [&_img]:rounded [&_img]:my-1 [&_sup]:text-xs [&_sub]:text-xs"
                  dangerouslySetInnerHTML={{ __html: q.text }}
                />

                {/* Options */}
                {Array.isArray(q.options) &&
                  q.options.map((opt, i) => {
                    const letter = String.fromCharCode(65 + i);
                    const isSelected = userChoice === opt;

                    return (
                      <label
                        key={i}
                        className={`flex items-center gap-2 p-2 mb-2 border-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition ${
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

          
        </main>

        {/* RIGHT: PAYMENT OR INFO */}
        <aside>
          {paymentLocked ? (
            <div className="fixed top-16 right-0 w-full md:w-96 z-[9999]">
              <InitializePayment />
            </div>
          ) : (
            
            <div className="sticky top-4 space-y-3">
              <div className="border border-gray-300 rounded-lg p-2">
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
            className={`w-full py-2 rounded-lg font-semibold transition ${
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
                className={`w-full py-2 rounded-lg font-semibold transition border-2 ${
                  !examActive
                    ? "bg-gray-400 cursor-not-allowed text-white border-gray-400"
                    : "bg-white dark:bg-gray-800 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                }`}
              >
                End Exam Early
              </button>
            {/* Question Navigator */}
              <div className="mt- border border-gray-300 rounded-lg py-2 px-4">
                <h3 className="font-semibold mb-3">Question Navigator</h3>
                <div className="grid grid-cols-10 gap-2">
                  {questions.map((_, idx) => {
                    const isAnswered = selectedAnswers[questions[idx]?.id];
                    const isCurrent = idx === currentIndex;
                    
                    return (
                      <button
                        key={idx}
                        onClick={() => goToQuestion(idx)}
                        className={`h-8 rounded transition ${
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
            </div>
          )}
        </aside>
      </div>

     
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