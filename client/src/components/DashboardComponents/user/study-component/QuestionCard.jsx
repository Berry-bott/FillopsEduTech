
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyStore } from "../../../../store/studyStore";
import InitializePayment from "../../../../payment/initializePayment";
import StudySummary from "./StudySummary";
import { useToast } from "@/components/ui/use-toast";
import { ExternalLink, Youtube, Lock, Unlock } from "lucide-react";

// ─── End Session Confirmation Modal ───────────────────────────────────────────
function EndSessionModal({ isOpen, onConfirm, onCancel, questionsAnswered, totalQuestions }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Modal card */}
      <div className="relative z-10 w-full max-w-sm mx-4 bg-white dark:bg-gray-800
        rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">

        {/* Icon + heading */}
        <div className="flex flex-col items-center pt-8 pb-4 px-6">
          <div className="w-14 h-14 rounded-full bg-amber-100 dark:bg-amber-900/30
            flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71
                   c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898
                   0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          </div>

          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
            End Study Session?
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center leading-relaxed">
            Are you sure you want to end this session? Your progress will be saved
            and you'll be taken to the summary screen.
          </p>
        </div>

        {/* Progress pill */}
        <div className="mx-6 mb-5 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50
          border border-gray-200 dark:border-gray-600 flex items-center justify-between">
          <span className="text-xs text-gray-500 dark:text-gray-400">Questions answered</span>
          <span className="text-sm font-semibold text-gray-800 dark:text-gray-100">
            {questionsAnswered} / {totalQuestions}
          </span>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
              bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200
              hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
          >
            Keep Going
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold
              bg-red-500 text-white hover:bg-red-600 active:bg-red-700
              transition-colors cursor-pointer"
          >
            End Session
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function QuestionCard() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const {
    currentIndex,
    selectedOptions,
    setSelectedOption,
    next,
    prev,
    paymentLocked,
    getQuestions,
    submitAnswer,
    sessionActive,
    endStudySession,
    initialized,
    showSummary,
    setShowSummary,
    generateStudyResults,
    studyResults,
    getOrderedIds,
    activeId,
    units,
    changeActive,
        lockedQuestions = {},
    setQuestionLocked,
      namesReady,
    saved,
    reset, // ✅ clear store + localStorage when leaving study → forces fresh GET /users/study-questions on next visit
  } = useStudyStore();

  const questions = getQuestions();
  const q = questions?.[currentIndex] ?? null;

  const [visible, setVisible] = useState(false);
  const [showStudyPanel, setShowStudyPanel] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false); // ← new

  const isQuestionLocked = q ? (lockedQuestions[q.id] || false) : false;
  const savedSelection = q ? selectedOptions[q.id] : null;
  const displayedChoice = savedSelection;
  const isCorrect = q && savedSelection === q.correctAnswer;
  const canRenderQuestion = !!q && !paymentLocked && initialized;
  // 🚦 Full skeleton is ONLY for the very first page load (store not ready).
  // Once the study session is initialized, switching subjects/topics must NOT
  // blank the page — that's what made it feel like a full page reload.
  const isInitialLoading = !initialized || !namesReady;
  // True when the active unit has no questions yet (first visit to that unit).
  const hasActiveQuestions = questions.length > 0;
  // True when the active unit finished loading and returned ZERO questions.
  // (fetchMoreQuestions sets `exhausted: true` when the backend returns nothing.)
  const activeUnitExhausted = !!units[activeId]?.exhausted;

  const areAllUnitsExhausted = () => {
    const orderedIds = getOrderedIds();
    if (orderedIds.length === 0) return false;
    return orderedIds.every(id => units[id]?.exhausted === true);
  };

  const isAtLastQuestion = () => {
    const orderedIds = getOrderedIds();
    const currentUnitIndex = orderedIds.indexOf(activeId);
    const isLastUnit = currentUnitIndex === orderedIds.length - 1;
    const unit = units[activeId];
    const isLastQuestionInUnit = currentIndex === (unit?.items?.length || 0) - 1;
    return isLastUnit && isLastQuestionInUnit && unit?.exhausted;
  };

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

  useEffect(() => {
    setShowStudyPanel(false);
  }, [currentIndex, q?.id]);

  const handleNext = async () => {
    if (paymentLocked) return;
    if (!savedSelection) {
      toast({ title: "No Answer Selected", description: "Please select an answer before proceeding.", variant: "destructive" });
      return;
    }
    const isLastQuestion = isAtLastQuestion() && areAllUnitsExhausted();
    if (sessionActive && !isQuestionLocked) {
      submitAnswer(q.id, savedSelection).then(success => {
        if (success) console.log("✅ Answer submitted successfully");
        else console.warn("⚠️ Answer submission failed");
      });
    }
    if (isLastQuestion) {
      const results = generateStudyResults();
      if (!results) {
        toast({ title: "Error", description: "Failed to generate study results", variant: "destructive" });
        return;
      }
      endStudySession();
      setShowSummary(true);
      toast({ title: "Study Session Complete! 🎉", description: "Great work! Review your performance below." });
      return;
    }
    next();
  };

  const handleStudy = async () => {
    if (!savedSelection) {
      toast({ title: "No Answer Selected", description: "Please select an answer to study.", variant: "destructive" });
      return;
    }
    if (!isQuestionLocked) {
      if (typeof setQuestionLocked === 'function') setQuestionLocked(q.id, true);
      if (sessionActive) {
        const success = await submitAnswer(q.id, savedSelection);
        if (success) {
          toast({ title: "Answer Locked 🔒", description: "Your answer has been saved and locked." });
        }
      }
    }
    setShowStudyPanel(!showStudyPanel);
  };

  // Opens the modal — no session logic yet
  const handleEndSessionRequest = () => {
    setShowEndModal(true);
  };

  // Called only after the user confirms in the modal
  const handleEndSession = async () => {
    setShowEndModal(false);

    const results = generateStudyResults();
    if (!results) {
      toast({ title: "Error", description: "Failed to generate study results", variant: "destructive" });
      return;
    }

    // Show summary immediately (optimistic UI)
    setShowSummary(true);
    toast({ title: "Session Ended", description: "Review your performance below." });

    // Settle API call in background
    endStudySession().catch((err) => {
      console.warn("⚠️ endStudySession failed silently:", err);
    });
  };

    const handleReturnToDashboard = () => {
    setShowSummary(false);
    // ✅ Reset BOTH the in-memory store and the localStorage "studySelections"
    // cache so the next time the user starts a study session, StudyPage can't
    // reuse the previous units — forcing the GET /users/study-questions?...
    // endpoint to fire again. (reset() also clears the intent cache.)
    if (typeof reset === "function") {
      reset();
    }
    navigate("/user/dashboard");
  };

  const handleStartNewSession = () => {
    // ✅ No navigation here. "New Session" is handled entirely by the store
    // (StudySummary → reset() + triggerRestart()), which re-runs the StudyPage
    // init effect WITHOUT remounting the page/route. Navigating back to
    // "/study" from "/study" was effectively a full-page reload attempt.
  };

  const handleOptionSelect = (option) => {
    if (isQuestionLocked) {
      toast({ title: "Answer Locked 🔒", description: "This answer is permanently locked.", variant: "destructive" });
      return;
    }
    setSelectedOption(q.id, option);
    setShowStudyPanel(false);
  };

  // ─── SUMMARY ────────────────────────────────────────────────────────────────
  if (showSummary && studyResults) {
    return (
      <StudySummary
        studyResults={studyResults}
        onReturnToDashboard={handleReturnToDashboard}
      />
    );
  }

  // ─── PAYMENT WALL ───────────────────────────────────────────────────────────
  if (paymentLocked) {
    return (
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
          <main>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
              <Lock className="w-16 h-16 text-gray-300 dark:text-gray-600" />
              <h2 className="text-xl font-bold text-gray-700 dark:text-gray-200">Questions Locked</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
                You've used your free questions. Subscribe to unlock unlimited access.
              </p>
                            <button
                onClick={handleReturnToDashboard}
                className="mt-2 inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow transition"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Back to Dashboard
              </button>
            </div>
          </main>
          <aside><InitializePayment /></aside>
        </div>
      </section>
    );
  }

  // ─── INITIAL LOADING SKELETON (only on very first page load) ───────────────
  if (isInitialLoading) {
    return (
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
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

  // ─── UNIT-SWITCH LOADING OR EMPTY (compact, layout stays intact) ────────────
  // Switching to a subject/topic that hasn't been visited yet fetches questions.
  if (!hasActiveQuestions) {
    // ✅ Loaded with ZERO questions → show a clear message instead of an endless spinner.
    if (activeUnitExhausted) {
      return (
        <section className="py-0">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
            <main>
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[320px] gap-3 text-center">
                <svg className="w-12 h-12 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <h3 className="text-base font-semibold text-gray-700 dark:text-gray-200">
                  No questions found
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
                  There are no questions available for this {saved?.mode === "topic" ? "topic" : "subject"}.
                  Please select a different {saved?.mode === "topic" ? "topic" : "subject"}.
                </p>
              </div>
            </main>
            <aside>
              <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[320px] gap-3 text-center">
                <p className="text-sm text-gray-500 dark:text-gray-400">No questions to display.</p>
              </div>
            </aside>
          </div>
        </section>
      );
    }

    // Still loading → show a small centered spinner (not a full page blank).
    return (
      <section className="py-0">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">
          <main>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[320px] gap-3">
              <div className="w-9 h-9 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Loading questions for this {saved?.mode === "topic" ? "topic" : "subject"}...
              </p>
            </div>
          </main>
          <aside>
            <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center min-h-[320px] gap-3">
              <div className="w-9 h-9 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
            </div>
          </aside>
        </div>
      </section>
    );
  }

  // ─── MAIN QUESTION VIEW ─────────────────────────────────────────────────────
  return (
    <section className="py-0">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-8">

        {/* LEFT: Question */}
        <main>
          <div className="border border-gray-300 dark:border-gray-700 rounded-lg p-3 md:p-6">
            <div className={`transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}>

              {/* Header */}
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-sm md:text-lg text-gray-800 dark:text-gray-100">
                  Question {currentIndex + 1} of {questions.length}
                </h2>
                {sessionActive && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                      <span className="w-2 h-2 bg-green-600 rounded-full animate-pulse" />
                      Session Active
                    </span>
                    {/* ← now opens modal instead of ending directly */}
                    <button
                      onClick={handleEndSessionRequest}
                      className="text-xs bg-red-500 text-white px-3 py-1.5 rounded hover:bg-red-600 transition"
                    >
                      End Session
                    </button>
                  </div>
                )}
              </div>

              {/* Lock indicators */}
              {isQuestionLocked && (
                <div className="mb-2 p-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                  <p className="text-sm text-blue-700 dark:text-blue-300 flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Choice of option can not be changed again in this question
                  </p>
                </div>
              )}
              {!isQuestionLocked && savedSelection && (
                <div className="mb-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <p className="text-sm text-green-700 dark:text-green-300 flex items-center gap-2">
                    <Unlock className="w-4 h-4" />
                    You can change your choice of option until you click study button
                  </p>
                </div>
              )}

              {/* Question text */}
              <div 
                className="mb-6 text-gray-800 dark:text-gray-200 text-lg leading-relaxed prose prose-sm max-w-none [&_img]:max-w-full [&_img]:rounded [&_img]:my-1 [&_sup]:text-xs [&_sub]:text-xs"
                dangerouslySetInnerHTML={{ __html: q.text }}
              />

              {/* Options */}
              <div className="space-y-2">
                {Array.isArray(q.options) && q.options.map((opt, i) => {
                  const letter = String.fromCharCode(65 + i);
                  let borderColor = "border-gray-300 dark:border-gray-600";
                  let bgColor = "bg-white dark:bg-gray-800";
                  if (isQuestionLocked && showStudyPanel && savedSelection) {
                    if (opt === q.correctAnswer) { borderColor = "border-green-600"; bgColor = "bg-green-50 dark:bg-green-900/20"; }
                    else if (opt === savedSelection) { borderColor = "border-red-600"; bgColor = "bg-red-50 dark:bg-red-900/20"; }
                  }
                  return (
                    <label key={i} className={`flex items-center gap-3 p-2 border-2 rounded-lg transition-all
                      ${borderColor} ${bgColor}
                      ${!isQuestionLocked ? "hover:bg-blue-50 dark:hover:bg-blue-900/10 hover:border-blue-400 cursor-pointer" : "cursor-not-allowed"}`}>
                      <input
                        type="radio"
                        name={q.id}
                        checked={displayedChoice === opt}
                        onChange={() => handleOptionSelect(opt)}
                        disabled={isQuestionLocked}
                        className="w-4 h-4"
                      />
                      <span className="text-gray-800 dark:text-gray-200"><strong>{letter}.</strong> {opt}</span>
                    </label>
                  );
                })}
              </div>

              {/* Meta tags */}
              {(q.year || q.difficulty || q.category) && (
                <div className="mt-6 flex gap-2 flex-wrap text-xs">
                  {q.year && <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">Year: {q.year}</span>}
                  {q.difficulty && <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">{q.difficulty}</span>}
                  {q.category && <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full">{q.category}</span>}
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="mt-6 flex justify-between items-center border-t border-gray-300 dark:border-gray-700 pt-4">
              <button
                disabled={currentIndex === 0}
                onClick={prev}
                className={`px-6 py-2.5 rounded-lg transition font-medium
                  ${currentIndex === 0 ? "bg-gray-400 text-white cursor-not-allowed" : "bg-red-500 text-white hover:bg-red-600"}`}
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={!savedSelection}
                className={`px-6 py-2.5 rounded-lg transition font-medium
                  ${!savedSelection ? "bg-gray-400 cursor-not-allowed text-white"
                    : isAtLastQuestion() && areAllUnitsExhausted() ? "bg-green-600 text-white hover:bg-green-700"
                    : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {isAtLastQuestion() && areAllUnitsExhausted() ? "Finish Study" : "Next"}
              </button>
            </div>
          </div>
        </main>

        {/* RIGHT: Sidebar */}
        <aside className="space-y-4">
          {savedSelection ? (
            <div className="border flex justify-center items-center flex-col border-gray-300 dark:border-gray-700 rounded-lg p-6 bg-white dark:bg-gray-800">
              <button
                onClick={handleStudy}
                className={`px-8 py-3 rounded-lg font-semibold transition-all
                  ${showStudyPanel
                    ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                    : isQuestionLocked
                      ? "bg-primary text-white hover:bg-primary-hover"
                      : "bg-blue-600 text-white hover:bg-blue-700"}`}
              >
                {showStudyPanel ? "Hide Study Panel" : isQuestionLocked ? "View Explanation" : "Study"}
              </button>

              {showStudyPanel && isQuestionLocked && (
                <div className="mt-4 space-y-4 w-full">
                  {/* Result */}
                  <div className={`p-4 rounded-lg ${isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700"
                    : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"}`}>
                    <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-100">
                      {isCorrect ? "✅ Correct!" : "❌ Incorrect"}
                    </h4>
                    <p className={`text-sm font-medium ${isCorrect ? "text-green-700 dark:text-green-300" : "text-red-700 dark:text-red-300"}`}>
                      Correct Answer: <strong>{q.correctAnswer}</strong>
                    </p>
                  </div>

                  {/* Explanation */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                    <h4 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">💡 Explanation</h4>
                    <div 
                      className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed prose prose-sm max-w-none [&_img]:max-w-full [&_img]:rounded [&_img]:my-1 [&_sup]:text-xs [&_sub]:text-xs"
                      dangerouslySetInnerHTML={{ __html: q.explanation || "No explanation available for this question." }}
                    />
                  </div>

                  {/* Additional Resources */}
                  {(q.videoLink || q.articleLink || q.additionalNotes) && (
                    <div className="p-4 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg">
                      <h4 className="font-semibold mb-3 text-purple-900 dark:text-purple-100">📚 Additional Resources</h4>
                      {q.videoLink && (
                        <a href={q.videoLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 mb-2 text-sm text-red-600 dark:text-red-400 hover:underline">
                          <Youtube className="w-4 h-4" /> Watch Video Tutorial <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {q.articleLink && (
                        <a href={q.articleLink} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 mb-2 text-sm text-blue-600 dark:text-blue-400 hover:underline">
                          <ExternalLink className="w-4 h-4" /> Read More
                        </a>
                      )}
                      {q.additionalNotes && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-3 pt-3 border-t border-purple-200 dark:border-purple-700">
                          {q.additionalNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              )}

              {!showStudyPanel && (
                <p className="mt-3 text-xs text-center text-gray-500 dark:text-gray-400">
                  {isQuestionLocked
                    ? "Click to view explanation and resources"
                    : "Click to lock your answer and view explanation"}
                </p>
              )}
            </div>
          ) : (
            <div className="border border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6 text-center bg-gray-50 dark:bg-gray-800/50">
              <p className="text-gray-500 dark:text-gray-400 text-sm">Select an answer to unlock the study panel</p>
            </div>
          )}
        </aside>
      </div>

      {/* ─── End Session Confirmation Modal ─── */}
      <EndSessionModal
        isOpen={showEndModal}
        onConfirm={handleEndSession}
        onCancel={() => setShowEndModal(false)}
        questionsAnswered={Object.keys(selectedOptions).length}
        totalQuestions={questions.length}
      />
    </section>
  );
}