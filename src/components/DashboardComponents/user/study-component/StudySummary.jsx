import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStudyStore } from "../../../../store/studyStore";

export default function StudySummary({
  studyResults,
  onReturnToDashboard,
  onStartNewSession,
}) {
  const navigate = useNavigate();
  const reset = useStudyStore((s) => s.reset);

  const [filterStatus, setFilterStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("all");

  const {
    totalQuestions = 0,
    correctAnswers = 0,
    incorrectAnswers = 0,
    skippedQuestions = 0,
    accuracy = 0,
    timeSpent = "00:00",
    subjects = [],
    questions = [],
  } = studyResults || {};

  // ── Filtering ───────────────────────────────────────────────────────────────
  const filteredQuestions = questions.filter((q) => {
    const isSkipped = q.userAnswer === null || q.userAnswer === undefined;
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "correct" && q.isCorrect === true) ||
      (filterStatus === "incorrect" && q.isCorrect === false && !isSkipped) ||
      (filterStatus === "skipped" && isSkipped);
    const matchesSubject =
      selectedSubject === "all" || q.subject === selectedSubject;
    const matchesSearch =
      searchQuery === "" ||
      (q.text || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (q.subject || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSubject && matchesSearch;
  });

  const uniqueSubjects = [
    ...new Set(questions.map((q) => q.subject).filter(Boolean)),
  ];

  // ── Resolve correct answer from any possible field name ─────────────────────
  const getCorrectAnswer = (q) =>
    q.correctAnswer ??
    q.correct_answer ??
    q.answer ??
    q.answerKey ??
    q.correctOption ??
    "—";

  // ── New session: reset store state + navigate to /study ─────────────────────

const handleNewSession = () => {
  reset();                               // clears progress, keeps localStorage
  useStudyStore.getState().triggerRestart(); // bumps sessionKey → effect re-runs
};

  // ── Dashboard ───────────────────────────────────────────────────────────────
  const handleDashboard = () => {
    if (typeof onReturnToDashboard === "function") {
      onReturnToDashboard();
    } else {
      navigate("/user/dashboard");
    }
  };

  // ── Status badge ────────────────────────────────────────────────────────────
  const getStatusBadge = (q) => {
    const isSkipped = q.userAnswer === null || q.userAnswer === undefined;
    if (isSkipped)
      return (
        <span className="px-2 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 rounded-full text-[10px] font-medium">
          Skipped
        </span>
      );
    if (q.isCorrect)
      return (
        <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-[10px] font-medium">
          ✓ Correct
        </span>
      );
    return (
      <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-[10px] font-medium">
        ✗ Incorrect
      </span>
    );
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen py-4 px-3">
      <div className="max-w-2xl mx-auto space-y-4">

        {/* ── Hero card ───────────────────────────────────────────────────────── */}
        <div className="bg-primary rounded-xl p-4 text-white">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xl">🎓</span>
                <h1 className="text-base font-bold">Session Complete!</h1>
              </div>
              <p className="text-blue-100 text-xs">Here's your performance summary</p>
              {timeSpent !== "00:00" && (
                <p className="text-blue-200 text-[10px] mt-0.5">⏱ Time: {timeSpent}</p>
              )}
            </div>
            <div className="text-center bg-white/20 rounded-lg px-4 py-2">
              <div className="text-2xl font-bold">{accuracy}%</div>
              <p className="text-[10px] text-blue-100 uppercase tracking-wide">Accuracy</p>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 mt-3">
            {[
              { label: "Total",     value: totalQuestions,   color: "text-white" },
              { label: "Correct",   value: correctAnswers,   color: "text-green-300" },
              { label: "Incorrect", value: incorrectAnswers, color: "text-red-300" },
              { label: "Skipped",   value: skippedQuestions, color: "text-gray-300" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-white/10 rounded-lg p-2 text-center">
                <div className={`text-lg font-bold ${color}`}>{value}</div>
                <div className="text-[10px] text-blue-100">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Action buttons ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleNewSession}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white
              px-4 py-2.5 rounded-lg hover:bg-blue-700 active:bg-blue-800
              transition text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            New Session
          </button>
          <button
            onClick={handleDashboard}
            className="flex items-center justify-center gap-2 bg-gray-600 text-white
              px-4 py-2.5 rounded-lg hover:bg-gray-700 active:bg-gray-800
              transition text-sm font-semibold"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Dashboard
          </button>
        </div>

        {/* ── Performance by subject ──────────────────────────────────────────── */}
        {subjects.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Performance by Subject
            </h2>
            <div className="space-y-3">
              {subjects.map((subject, idx) => {
                const pct =
                  subject.totalQuestions > 0
                    ? Math.round((subject.correct / subject.totalQuestions) * 100)
                    : 0;
                const barColor =
                  pct >= 80 ? "bg-green-500" : pct >= 60 ? "bg-yellow-500" : "bg-red-500";
                const textColor =
                  pct >= 80 ? "text-green-600" : pct >= 60 ? "text-yellow-600" : "text-red-600";
                return (
                  <div key={idx}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-gray-900 dark:text-white">
                          {subject.name}
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {subject.correct}/{subject.totalQuestions}
                        </span>
                      </div>
                      <span className={`text-xs font-bold ${textColor}`}>{pct}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <div className="flex gap-3 mt-1 text-[10px] text-gray-400">
                      <span className="text-green-600 dark:text-green-400">
                        {subject.correct} correct
                      </span>
                      <span className="text-red-500 dark:text-red-400">
                        {subject.incorrect} incorrect
                      </span>
                      {subject.skipped > 0 && <span>{subject.skipped} skipped</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Question review ─────────────────────────────────────────────────── */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
          <h2 className="text-sm font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Question Review
            <span className="ml-1 text-gray-400 font-normal">({filteredQuestions.length})</span>
          </h2>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-gray-600
                rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Questions</option>
              <option value="correct">Correct Only</option>
              <option value="incorrect">Incorrect Only</option>
              <option value="skipped">Skipped Only</option>
            </select>

            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-gray-600
                rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="all">All Subjects</option>
              {uniqueSubjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 dark:border-gray-600
                rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Cards */}
          <div className="space-y-2">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-8 text-gray-400 text-xs">
                No questions match your filters
              </div>
            ) : (
              filteredQuestions.map((question) => {
                const isSkipped =
                  question.userAnswer === null || question.userAnswer === undefined;
                const correctAns = getCorrectAnswer(question);

                return (
                  <div
                    key={question.id}
                    className={`border rounded-lg p-3 text-xs transition-shadow
                      ${isSkipped
                        ? "border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60"
                        : question.isCorrect
                          ? "border-green-200 dark:border-green-800/60 bg-green-50/30 dark:bg-green-900/10"
                          : "border-red-200 dark:border-red-800/60 bg-red-50/30 dark:bg-red-900/10"
                      }`}
                  >
                    {/* Row 1: number + subject + badge */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 flex items-center justify-center bg-blue-100
                          dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full
                          text-[10px] font-bold flex-shrink-0">
                          {question.questionNumber ?? "—"}
                        </span>
                        {question.subject && (
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700
                            text-gray-500 dark:text-gray-400 rounded-full text-[10px]">
                            {question.subject}
                          </span>
                        )}
                      </div>
                      {getStatusBadge(question)}
                    </div>

                    {/* Question text */}
                    <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-2">
                      {question.text}
                    </p>

                    {/* Answer info ── correct answer ALWAYS shown */}
                    <div className="bg-white/70 dark:bg-gray-700/40 rounded-lg p-2 space-y-1">

                      {/* ✅ Correct answer — shown for ALL questions including skipped */}
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
                        <span className="text-gray-400 dark:text-gray-500">Correct answer:</span>
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          {correctAns}
                        </span>
                      </div>

                      {/* User's answer — only if they answered */}
                      {!isSkipped && (
                        <div className="flex items-center gap-1.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0
                            ${question.isCorrect ? "bg-green-500" : "bg-red-500"}`}
                          />
                          <span className="text-gray-400 dark:text-gray-500">Your answer:</span>
                          <span className={`font-semibold
                            ${question.isCorrect
                              ? "text-green-700 dark:text-green-400"
                              : "text-red-700 dark:text-red-400"}`}>
                            {question.userAnswer}
                          </span>
                        </div>
                      )}

                      {/* Skipped note */}
                      {isSkipped && (
                        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 flex-shrink-0" />
                          You skipped this question
                        </div>
                      )}
                    </div>

                    {/* Meta tags */}
                    {(question.difficulty || question.category || question.year) && (
                      <div className="flex gap-1.5 flex-wrap mt-1.5">
                        {question.difficulty && (
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700
                            text-gray-400 rounded text-[10px]">
                            {question.difficulty}
                          </span>
                        )}
                        {question.category && (
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700
                            text-gray-400 rounded text-[10px]">
                            {question.category}
                          </span>
                        )}
                        {question.year && (
                          <span className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700
                            text-gray-400 rounded text-[10px]">
                            {question.year}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Footer note ─────────────────────────────────────────────────────── */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700
          rounded-lg p-3 mb-4">
          <p className="text-[11px] text-blue-900 dark:text-blue-100 flex items-start gap-2">
            <svg className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd" />
            </svg>
            Correct answers are shown for every question including skipped ones.
            Return to study mode to read full explanations.
          </p>
        </div>

      </div>
    </div>
  );
}