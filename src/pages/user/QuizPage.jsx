// import { useEffect } from "react";
// import { useQuizStore } from "@/store/quizStore";
// import PageNav from "../../components/DashboardComponents/PageNav"



// export default function QuizPage() {
//   const {
//     questions,
//     currentIndex,
//     selectedOptions,
//     loading,
//     paymentLocked,
//     finished,
//     report,
//     initQuiz,
//     answer,
//     next,
//     prev,
//     submit,
//     initializePayment,
//   } = useQuizStore();

//   useEffect(() => {
//     initQuiz();
//   }, []);

//   const TOTAL_QUESTIONS = 10;

//   if (loading) return <div className="p-6">Loading quiz…</div>;

//   if (paymentLocked) return (
//     <div className="p-6 text-center space-y-4">
//       <h2 className="text-xl font-bold">Quiz Locked</h2>
//       <p>You’ve reached your free quiz limit.</p>
//       <button
//         onClick={initializePayment}
//         className="px-4 py-2 bg-primary text-white rounded"
//       >
//         Unlock Quiz
//       </button>
//     </div>
//   );

//   if (finished) return (
//     <div className="p-6 space-y-4">
//       <h2 className="text-2xl font-bold">Quiz Summary</h2>
//       {report.map((q, i) => (
//         <div key={q.id} className="border p-4 rounded shadow-md">
//           <p className="font-semibold">{i + 1}. {q.question}</p>
//           <p>Your answer: {q.selected}</p>
//           <p>Correct answer: {q.correct}</p>
//           <p className={q.isCorrect ? "text-green-600" : "text-red-600"}>
//             {q.isCorrect ? "Correct" : "Wrong"}
//           </p>
//           <p className="text-sm mt-2 text-gray-700">{q.explanation}</p>
//         </div>
//       ))}
//     </div>
//   );

//   const q = questions[currentIndex];
//   console.log("Current Question:", q);
//   if (!q) return <div className="p-6">No question available</div>;

//   return (
//     <main>
//       <div>
//       <PageNav />
//       </div>
//     <div className="px-20 py-40 space-y-4">
//       <h2 className="text-lg font-semibold">
//         Question {currentIndex + 1} / {TOTAL_QUESTIONS}
//       </h2>

//       <div className="border p-4 rounded shadow-md space-y-3">
//         <p>{q.text}</p>
//         <div className="space-y-2">
//           {q.options.map(opt => (
//             <button
//               key={opt}
//               onClick={() => answer(q.id, opt)}
//               className={`block w-full p-2 border rounded ${
//                 selectedOptions[q.id] === opt ? "bg-primary text-white" : ""
//               }`}
//             >
//               {opt}
//             </button>
//           ))}
//         </div>
//       </div>

//       <div className="flex justify-between pt-4">
//         <button
//           onClick={prev}
//           disabled={currentIndex === 0}
//           className="px-4 py-2 border rounded"
//         >
//           Prev
//         </button>

//         {currentIndex === TOTAL_QUESTIONS - 1 ? (
//           <button
//             onClick={submit}
//             className="px-4 py-2 bg-primary text-white rounded"
//           >
//             Submit
//           </button>
//         ) : (
//           <button
//             onClick={next}
//             className="px-4 py-2 bg-primary text-white rounded"
//           >
//             Next
//           </button>
//         )}
//       </div>
//     </div>
//     </main>

//   );
// }



// import { useEffect } from "react";
// import { useQuizStore } from "@/store/quizStore";
// import { useNavigate } from "react-router-dom";
// import PageNav from "../../components/DashboardComponents/PageNav"

// export default function QuizPage() {
//   const {
//     questions,
//     currentIndex,
//     selectedOptions,
//     next,
//     prev,
//     answer,
//     submit,
//     loading,
//     initQuiz,   // 👈 ADD THIS
//   } = useQuizStore();

//   const navigate = useNavigate();

//   useEffect(() => {
//     initQuiz(); // 👈 THIS WAS MISSING
//   }, [initQuiz]);

//   const question = questions[currentIndex];
//   const TOTAL_QUESTIONS = 10;


//   if (loading) return <p>Loading...</p>;
//   if (!question) return <p>No question available</p>;

//   return (
//     <main>
//       <div>
//       <PageNav />
//       </div>
//     <div className="max-w-xl mx-auto py-40 space-y-6">
//     <h2 className="text-lg font-semibold">
//          Question {currentIndex + 1} / {TOTAL_QUESTIONS}
//        </h2>
//       <p className="text-lg font-semibold">
//         {currentIndex + 1}. {question.text}
//       </p>

//       <div className="space-y-3">
//         {question.options.map((opt, i) => (
//           <button
//             key={i}
//             onClick={() => answer(question.id, opt)}
//             className={`w-full p-3 border rounded text-left ${
//               selectedOptions[question.id] === opt
//                 ? "bg-blue-600 text-white"
//                 : "bg-white"
//             }`}
//           >
//             {opt}
//           </button>
//         ))}
//       </div>

//       <div className="flex justify-between pt-4">
//         <button
//           onClick={prev}
//           disabled={currentIndex === 0}
//           className="px-4 py-2 border rounded"
//         >
//           Prev
//         </button>

//         {currentIndex === questions.length - 1 ? (
//           <button
//             onClick={() => {
//               submit();
//               navigate("/quiz-result");
//             }}
//             className="px-4 py-2 bg-green-600 text-white rounded"
//           >
//             Submit
//           </button>
//         ) : (
//           <button
//             onClick={next}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//           >
//             Next
//           </button>
//         )}
//       </div>
//     </div>
//     </main>
//   );
// }



import { useEffect, useState } from "react";
import { useQuizStore } from "@/store/quizStore";

function PieChart({ percentage }) {
  const r = 50;
  const c = 2 * Math.PI * r;
  const o = c - (percentage / 100) * c;

  return (
    <svg width="120" height="120">
      <circle cx="60" cy="60" r={r} stroke="#e5e7eb" strokeWidth="10" fill="none" />
      <circle
        cx="60"
        cy="60"
        r={r}
        stroke="#2563eb"
        strokeWidth="10"
        fill="none"
        strokeDasharray={c}
        strokeDashoffset={o}
        transform="rotate(-90 60 60)"
      />
      <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle">
        {percentage}%
      </text>
    </svg>
  );
}

export default function QuizPage() {
  const {
    initQuiz,
    questions,
    currentIndex,
    selectedOptions,
    answer,
    next,
    prev,
    submit,
    finished,
    report,
    score,
    percentage,
    grade,
    loading,
  } = useQuizStore();

  const [showExp, setShowExp] = useState({});

  useEffect(() => {
    initQuiz();
  }, []);

  if (loading) return <p className="p-4">Loading quiz...</p>;
  if (!questions.length) return <p className="p-4">No question available</p>;

  // ================= RESULT PAGE =================
  if (finished) {
    return (
      <div className="p-4 space-y-6 max-w-xl mx-auto">
        <h1 className="text-2xl font-bold">Quiz Result</h1>

        <div className="flex justify-center">
          <PieChart percentage={percentage} />
        </div>

        <div className="bg-gray-100 p-4 rounded">
          <p>Score: {score} / {report.length}</p>
          <p>Percentage: {percentage}%</p>
          <p className="font-semibold">Grade: {grade}</p>
        </div>

        {report.map((q, i) => (
          <div key={q.id} className="border-b pb-3">
            <p className="font-semibold">
              {i + 1}. {q.question}
            </p>

            <p>Your answer: {q.selected || "None"}</p>
            <p>Correct: {q.correct}</p>

            <p className={q.isCorrect ? "text-green-600" : "text-red-600"}>
              {q.isCorrect ? "Correct" : "Wrong"}
            </p>

            {q.explanation && (
              <button
                onClick={() =>
                  setShowExp((s) => ({ ...s, [q.id]: !s[q.id] }))
                }
                className="text-blue-600 text-sm"
              >
                {showExp[q.id] ? "Hide" : "View"} explanation
              </button>
            )}

            {showExp[q.id] && (
              <p className="text-sm text-gray-600">{q.explanation}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  // ================= QUIZ PAGE =================
  const q = questions[currentIndex];

  return (
    <div className="p-4 max-w-xl mx-auto space-y-4">
      <p className="font-semibold">
        Question {currentIndex + 1} / {questions.length}
      </p>

      <p className="text-lg">{q.text}</p>

      <div className="space-y-2">
        {q.options.map((opt) => (
          <button
            key={opt}
            onClick={() => answer(q.id, opt)}
            className={`w-full p-2 border rounded ${
              selectedOptions[q.id] === opt
                ? "bg-blue-600 text-white"
                : ""
            }`}
          >
            {opt}
          </button>
        ))}
      </div>

      <div className="flex justify-between pt-4">
        <button onClick={prev} disabled={currentIndex === 0}>
          Prev
        </button>

        {currentIndex === questions.length - 1 ? (
          <button onClick={submit} className="font-semibold">
            Submit
          </button>
        ) : (
          <button onClick={next}>Next</button>
        )}
      </div>
    </div>
  );
}
