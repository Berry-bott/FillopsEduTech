// import { useState } from 'react';
// import { useStudyStore } from '../../../../store/studyStore';


// export default function QuestionCard() {
//   const {
//     questions,
//     currentIndex,
//     selectedOptions,
//     setSelectedOption,
//     setCurrentIndex,
//     next,
//   } = useStudyStore();

//   const [showExplanation, setShowExplanation] = useState(false);

//   const q = questions[currentIndex];
//   if (!q) return <p>No question found.</p>;

//   const userChoice = selectedOptions[q.id];
//   const isCorrect = userChoice === q.correctAnswer;

//   return (
//     <main className="relative">
//       <div className="border border-gray-300 p-4 rounded-lg pb-28 overflow-y-auto">
//         <h2 className="font-semibold mb-2">
//           Question {currentIndex + 1} of {questions.length}
//         </h2>
//         <p className="mb-3">{q.text}</p>

//         {q.options.map((opt, i) => {
//           const optionLetter = String.fromCharCode(65 + i);
//           let borderColor = 'border-gray-300';
//           if (userChoice) {
//             if (opt === q.correctAnswer) borderColor = 'border-green-600';
//             if (opt === userChoice && !isCorrect) borderColor = 'border-red-600';
//           }

//           return (
//             <label
//               key={i}
//               className={`flex items-center mb-3 cursor-pointer p-2 border rounded-lg ${borderColor}`}
//             >
//               <input
//                 type="radio"
//                 name={q.id}
//                 value={opt}
//                 checked={userChoice === opt}
//                 onChange={() => {
//                   setSelectedOption(q.id, opt);
//                   setShowExplanation(false);
//                 }}
//                 className="mr-2"
//               />
//               {optionLetter}. {opt}
//             </label>
//           );
//         })}

//         {userChoice && (
//           <p className="mt-6 text-green-700 font-medium">
//             ✅ Correct Answer: {q.correctAnswer}
//           </p>
//         )}

//         {userChoice && (
//           <p
//             className="mt-2 text-blue-700 text-sm underline cursor-pointer transition-all"
//             onClick={() => setShowExplanation((prev) => !prev)}
//           >
//             {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
//           </p>
//         )}

//         {showExplanation && (
//           <p className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
//             {q.explanation}
//           </p>
//         )}

//         <p className="text-xs text-gray-500 mt-4">
//           Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
//         </p>
//       </div>

//       <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-4 flex justify-between border-t mt-8">
//         <button
//           disabled={currentIndex === 0}
//           onClick={() => setCurrentIndex(currentIndex - 1)}
//           className={`px-8 py-2 rounded-lg ${
//             currentIndex === 0 ? 'bg-gray-400 text-white' : 'bg-red-500 text-white'
//           }`}
//         >
//           Prev
//         </button>

//         <button
//           onClick={next}
//           className="px-8 py-2 rounded-lg bg-blue-600 text-white"
//         >
//           {currentIndex === questions.length - 1 ? 'Next Subject' : 'Next'}
//         </button>
//       </div>
//     </main>
//   );
// }



import { useState } from 'react';
import { useStudyStore } from '../../../../store/studyStore';

export default function QuestionCard() {
  const {
    questions,
    currentIndex,
    selectedOptions,
    setSelectedOption,
    setCurrentIndex,
    next,
  } = useStudyStore();

  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[currentIndex];
  if (!q) return <p>No question found.</p>;

  const userChoice = selectedOptions[q.id];
  const isCorrect = userChoice === q.correctAnswer;

  return (
    <main className="relative">
      <div className="border border-gray-300 p-4 rounded-lg pb-28 overflow-y-auto">
        <h2 className="font-semibold mb-2">
          Question {currentIndex + 1} of {questions.length}
        </h2>
        <p className="mb-3">{q.text}</p>

        {q.options.map((opt, i) => {
          const optionLetter = String.fromCharCode(65 + i);
          let borderColor = 'border-gray-300';
          if (userChoice) {
            if (opt === q.correctAnswer) borderColor = 'border-green-600';
            if (opt === userChoice && !isCorrect) borderColor = 'border-red-600';
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
                onChange={() => {
                  setSelectedOption(q.id, opt);
                  setShowExplanation(false);
                }}
                className="mr-2"
              />
              {optionLetter}. {opt}
            </label>
          );
        })}

        {userChoice && (
          <p className="mt-6 text-green-700 font-medium">
            ✅ Correct Answer: {q.correctAnswer}
          </p>
        )}

        {userChoice && (
          <p
            className="mt-2 text-blue-700 text-sm underline cursor-pointer transition-all"
            onClick={() => setShowExplanation((prev) => !prev)}
          >
            {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
          </p>
        )}

        {showExplanation && (
          <p className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
            {q.explanation}
          </p>
        )}

        <p className="text-xs text-gray-500 mt-4">
          Difficulty: {q.difficulty} • Year: {q.year} • Exam: {q.examType}
        </p>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white py-3 px-4 flex justify-between border-t mt-8">
        <button
          disabled={currentIndex === 0}
          onClick={() => setCurrentIndex(currentIndex - 1)}
          className={`px-8 py-2 rounded-lg ${
            currentIndex === 0 ? 'bg-gray-400 text-white' : 'bg-red-500 text-white'
          }`}
        >
          Prev
        </button>

        <button
          onClick={next}
          className="px-8 py-2 rounded-lg bg-blue-600 text-white"
        >
          {currentIndex === questions.length - 1 ? 'Next Subject' : 'Next'}
        </button>
      </div>
    </main>
  );
}
