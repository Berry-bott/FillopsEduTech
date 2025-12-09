// export default function QuestionCard({
//     q,
//     currentIndex,
//     total,
//     selectedOptions,
//     setSelectedOptions,
//     setCurrentIndex
//   }) {
//     if (!q) return <p>No question found.</p>;
  
//     const handleChange = (opt) =>
//       setSelectedOptions((prev) => ({ ...prev, [q.id]: opt }));
  
//     return (
//         <main>

//       <div className="border border-gray-300 p-4 rounded-lg">
//         <h2 className="font-semibold mb-2">
//           Question {currentIndex + 1} of {total}
//         </h2>
  
//         <p className="mb-3">{q.text}</p>
  
//         {q.options.map((opt, i) => (
//           <label
//             key={i}
//             className="flex items-center mb-2 cursor-pointer ml-3"
//           >
//             <input
//               type="radio"
//               name={q.id}
//               value={opt}
//               checked={selectedOptions[q.id] === opt}
//               onChange={() => handleChange(opt)}
//               className="mr-2"
//             />
//             {String.fromCharCode(65 + i)}. {opt}
//           </label>
//         ))}
//          <p className="mt-8 text-green-700 font-medium">
//                ✅ Correct Answer: {q.correctAnswer}
//              </p>
//          <p className="mt-1 text-blue-700 text-sm">{q.explanation}</p>
  
//             <p className="text-xs text-gray-500 mt-1">
//               Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
//             </p>


//       </div>
//         <div className="mt-4 flex justify-between border py-4">
//           <button
//             disabled={currentIndex === 0}
//             onClick={() => setCurrentIndex((prev) => prev - 1)}
//             className={`px-8 py-2 rounded-lg ${
//               currentIndex === 0 ? "bg-gray-400" : "bg-red-500 text-white"
//             }`}
//           >
//             Prev
//           </button>
  
//           <button
//             disabled={currentIndex === total - 1}
//             onClick={() => setCurrentIndex((prev) => prev + 1)}
//             className={`px-8 py-2 rounded-lg ${
//               currentIndex === total - 1
//                 ? "bg-gray-400"
//                 : "bg-blue-600 text-white"
//             }`}
//           >
//             Next
//           </button>
//         </div>
//       </main>

//     );
//   }
  

import { useState } from "react";

export default function QuestionCard({
  q,
  currentIndex,
  total,
  selectedOptions,
  setSelectedOptions,
  setCurrentIndex,
  onFinishSubject // callback when last question is done
}) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!q) return <p>No question found.</p>;

  // Save selected option
  const handleSelect = (opt) => {
    setSelectedOptions((prev) => ({ ...prev, [q.id]: opt }));
    setShowExplanation(false); // hide explanation until user clicks
  };

  const userChoice = selectedOptions[q.id];
  const isCorrect = userChoice === q.correctAnswer;

  const goNext = () => {
    if (currentIndex === total - 1) {
      onFinishSubject?.(); // move to next subject
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  return (
    <main className="relative">

      <div className="border border-gray-300 p-4 rounded-lg pb-28 overflow-y-auto" >
        {/* QUESTION HEADER */}
        <h2 className="font-semibold mb-2">
          Question {currentIndex + 1} of {total}
        </h2>

        <p className="mb-3">{q.text}</p>

        {/* OPTIONS */}
        {q.options.map((opt, i) => {
          const optionLetter = String.fromCharCode(65 + i);

          let borderColor = "border-gray-300";
          if (userChoice) {
            if (opt === q.correctAnswer) borderColor = "border-green-600";
            if (opt === userChoice && !isCorrect)
              borderColor = "border-red-600";
          }

          return (
            <label
              key={i}
              className={`flex items-center mb-3 cursor-pointer p-2 border rounded-lg ${borderColor}`}
            >
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={userChoice === opt}
                onChange={() => handleSelect(opt)}
                className="mr-2"
              />
              {optionLetter}. {opt}
            </label>
          );
        })}

        {/* CORRECT ANSWER (show only after selecting) */}
        {userChoice && (
          <p className="mt-6 text-green-700 font-medium">
            ✅ Correct Answer: {q.correctAnswer}
          </p>
        )}

        {/* EXPLANATION TOGGLE */}
        {userChoice && (
          <p
            className="mt-2 text-blue-700 text-sm underline cursor-pointer transition-all"
            onClick={() => setShowExplanation((prev) => !prev)}
          >
            {showExplanation ? "Hide Explanation" : "Show Explanation"}
          </p>
        )}

        {/* EXPLANATION CONTENT */}
        {showExplanation && (
          <p className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
            {q.explanation}
          </p>
        )}

        {/* FOOTER INFO */}
        <p className="text-xs text-gray-500 mt-4">
          Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
        </p>
      </div>

      {/* FIXED BUTTONS */}
      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-4 flex justify-between border-t mt-8">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex((prev) => prev - 1)}
          className={`px-8 py-2 rounded-lg ${
            currentIndex === 0
              ? "bg-gray-400 text-white"
              : "bg-red-500 text-white"
          }`}
        >
          Prev
        </button>

        <button
          onClick={goNext}
          className="px-8 py-2 rounded-lg bg-blue-600 text-white"
        >
          {currentIndex === total - 1 ? "Next Subject" : "Next"}
        </button>
      </div>
    </main>
  );
}
