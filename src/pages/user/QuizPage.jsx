// import { useEffect } from "react";
// import { useQuizStore } from "@/store/quizStore";

// export default function QuizPage() {
//   const {
//     questions,
//     currentIndex,
//     selectedOptions,
//     loading,
//     paymentLocked,
//     finished,
//     initQuiz,
//     answer,
//     next,
//     prev,
//     submit,
//     initializePayment,
//   } = useQuizStore();

//   const TOTAL_QUESTIONS = 10;

//   useEffect(() => {
//     initQuiz();
//   }, []);

//   if (loading) return <div className="p-6">Loading quiz…</div>;

//   if (paymentLocked)
//     return (
//       <div className="p-6 text-center space-y-4">
//         <h2 className="text-xl font-bold">Quiz Locked</h2>
//         <p>You’ve reached your free quiz limit.</p>
//         <button
//           onClick={initializePayment}
//           className="px-4 py-2 bg-primary text-white rounded"
//         >
//           Unlock Quiz
//         </button>
//       </div>
//     );

//   if (finished)
//     return (
//       <div className="p-6">
//         <h2 className="text-xl font-bold">Quiz Finished</h2>
//         {questions.map((q, i) => (
//           <div key={q.id} className="border p-3 rounded my-2">
//             <p>{i + 1}. {q.question}</p>
//             <p>Your answer: {selectedOptions[q.id] || "None"}</p>
//             <p>Correct answer: {q.correctOption}</p>
//           </div>
//         ))}
//       </div>
//     );

//   const q = questions[currentIndex];
//   if (!q) return <div className="p-6">No question available</div>;

//   return (
//     <div className="p-6 space-y-4">
//       <h2 className="font-semibold">
//         Question {currentIndex + 1} / {TOTAL_QUESTIONS}
//       </h2>

//       <p>{q.question}</p>

//       <div className="space-y-2">
//         {q.options.map(opt => (
//           <button
//             key={opt}
//             onClick={() => answer(q.id, opt)}
//             className={`block w-full p-2 border rounded ${
//               selectedOptions[q.id] === opt ? "bg-primary text-white" : ""
//             }`}
//           >
//             {opt}
//           </button>
//         ))}
//       </div>

//       <div className="flex justify-between pt-4">
//         <button onClick={prev} disabled={currentIndex === 0}>Prev</button>
//         {currentIndex === TOTAL_QUESTIONS - 1 ? (
//           <button onClick={submit} className="bg-primary text-white px-4 py-2">Submit</button>
//         ) : (
//           <button onClick={next}>Next</button>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useEffect } from "react";
// import { useQuizStore } from "@/store/quizStore";

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

//   // ===========================
//   // LOADING
//   // ===========================
//   if (loading) return (
//     <div className="p-6 space-y-2">
//       {[...Array(3)].map((_, i) => (
//         <div key={i} className="animate-pulse bg-gray-200 h-20 rounded" />
//       ))}
//     </div>
//   );

//   // ===========================
//   // PAYMENT LOCKED
//   // ===========================
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

//   // ===========================
//   // QUIZ FINISHED (REPORT)
//   // ===========================
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

//   // ===========================
//   // CURRENT QUESTION
//   // ===========================
//   const q = questions[currentIndex];
//   if (!q) return <div className="p-6">No question available</div>;

//   return (
//     <div className="p-6 space-y-4">
//       <h2 className="text-lg font-semibold">
//         Question {currentIndex + 1} / {TOTAL_QUESTIONS}
//       </h2>

//       <div className="border p-4 rounded shadow-md space-y-3">
//         <p>{q.question}</p>
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

//         {currentIndex === questions.length - 1 ? (
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
//   );
// }



import { useEffect } from "react";
import { useQuizStore } from "@/store/quizStore";

export default function QuizPage() {
  const {
    questions,
    currentIndex,
    selectedOptions,
    loading,
    paymentLocked,
    finished,
    report,
    initQuiz,
    answer,
    next,
    prev,
    submit,
    initializePayment,
  } = useQuizStore();

  useEffect(() => {
    initQuiz();
  }, []);

  const TOTAL_QUESTIONS = 10;

  if (loading) return <div className="p-6">Loading quiz…</div>;

  if (paymentLocked) return (
    <div className="p-6 text-center space-y-4">
      <h2 className="text-xl font-bold">Quiz Locked</h2>
      <p>You’ve reached your free quiz limit.</p>
      <button
        onClick={initializePayment}
        className="px-4 py-2 bg-primary text-white rounded"
      >
        Unlock Quiz
      </button>
    </div>
  );

  if (finished) return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold">Quiz Summary</h2>
      {report.map((q, i) => (
        <div key={q.id} className="border p-4 rounded shadow-md">
          <p className="font-semibold">{i + 1}. {q.question}</p>
          <p>Your answer: {q.selected}</p>
          <p>Correct answer: {q.correct}</p>
          <p className={q.isCorrect ? "text-green-600" : "text-red-600"}>
            {q.isCorrect ? "Correct" : "Wrong"}
          </p>
          <p className="text-sm mt-2 text-gray-700">{q.explanation}</p>
        </div>
      ))}
    </div>
  );

  const q = questions[currentIndex];
  if (!q) return <div className="p-6">No question available</div>;

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-lg font-semibold">
        Question {currentIndex + 1} / {TOTAL_QUESTIONS}
      </h2>

      <div className="border p-4 rounded shadow-md space-y-3">
        <p>{q.question}</p>
        <div className="space-y-2">
          {q.options.map(opt => (
            <button
              key={opt}
              onClick={() => answer(q.id, opt)}
              className={`block w-full p-2 border rounded ${
                selectedOptions[q.id] === opt ? "bg-primary text-white" : ""
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <button
          onClick={prev}
          disabled={currentIndex === 0}
          className="px-4 py-2 border rounded"
        >
          Prev
        </button>

        {currentIndex === TOTAL_QUESTIONS - 1 ? (
          <button
            onClick={submit}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Submit
          </button>
        ) : (
          <button
            onClick={next}
            className="px-4 py-2 bg-primary text-white rounded"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
