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







import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStudyStore } from '../../../../store/studyStore';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Crown, Sparkles } from "lucide-react"


export default function QuestionCard() {
  const {
    questions,
    currentIndex,
    selectedOptions,
    setSelectedOption,
    setCurrentIndex,
    next,
    loading,
  } = useStudyStore();

  const [visible, setVisible] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const navigate = useNavigate();
  const q = questions[currentIndex];
  const userChoice = selectedOptions[q?.id];
  const isCorrect = userChoice === q?.correctAnswer;

  // ----------------------------
  // Staggered reveal logic
  // ----------------------------
  useEffect(() => {
    if (loading || !q) {
      setVisible(0);
      return;
    }

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setVisible(count);
      if (count >= 1) clearInterval(interval); 
    }, 500);

    return () => clearInterval(interval);
  }, [loading, currentIndex, q]);

  // ----------------------------
  // Skeleton while loading
  // ----------------------------
  if (loading || !q) {
    return (
      <main className="relative">
        <div className="border border-gray-300 p-4 rounded-lg pb-28 overflow-y-auto">
          <div className="h-6 w-48 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="h-12 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse"></div>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="h-10 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
        
      </main>
    );
  }

  // ----------------------------
  // Render actual question
  // ----------------------------
  return (
    <section className='py-0'>
    {/* Back to Dashboard */}
    <div className="p-2">
      <button
        onClick={() => navigate('/user/dashboard')}
        className="px-4 py-2 underline text-blue-500"
      >
        ← Back to Dashboard
      </button>
    </div>
  
    {/* MAIN LAYOUT */}
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] md:gap-6 gap-20 ">
      
      {/* ================= LEFT: QUESTION ================= */}
      <main className="relative">
        <div className="border border-gray-300 p-4 rounded-lg  overflow-y-auto">
          <div
            className="transition-opacity duration-500 ease-in-out"
            style={{ opacity: visible ? 1 : 0 }}
          >
            <h2 className="font-semibold mb-2">
              Question {currentIndex + 1} of {questions.length}
            </h2>
  
            <p className="mb-3">{q.text}</p>
  
            {q.options.map((opt, i) => {
              const optionLetter = String.fromCharCode(65 + i);
              let borderColor = 'border-gray-300';
  
              if (userChoice) {
                if (opt === q.correctAnswer) borderColor = 'border-green-600';
                if (opt === userChoice && !isCorrect)
                  borderColor = 'border-red-600';
              }
  
              return (
                <label
                  key={i}
                  className={`flex items-center mb-3 cursor-pointer p-2 border rounded-lg ${borderColor}`}
                >
                  <input
                    type="radio"
                    name={q.id}
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
                className="mt-2 text-blue-700 text-sm underline cursor-pointer"
                onClick={() => setShowExplanation((p) => !p)}
              >
                {showExplanation ? 'Hide Explanation' : 'Show Explanation'}
              </p>
            )}
  
            {showExplanation && (
              <p className="mt-2 p-2 bg-blue-50 rounded text-blue-800 text-sm">
                {q.explanation}
              </p>
            )}
          </div>
            {/* Navigation */}
        <div className=" z-50 right-0 pt-20 px-4 flex justify-between border-t">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(currentIndex - 1)}
            className={`px-8 py-2 dark:bg-transparent dark:border-2new commit rounded-lg ${
              currentIndex === 0
                ? 'bg-gray-400 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            Prev
          </button>
  
          <button
            onClick={next}
            className="px-8 py-2 rounded-lg bg-blue-600 text-white"
          >
            {currentIndex === questions.length - 1
              ? 'Next Subject'
              : 'Next'}
          </button>
        </div>
        </div>
  
      
      </main>
  
      {/* ================= RIGHT: PAYMENT ================= */}
      <div className="min-h-screen flex items-center justify-center relative -top-16 right-0">
      <Card className="w-[500px]  overflow-hidden flex flex-col border-2 border-border shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-br from-primary/5 to-accent/5">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Crown className="size-8 text-education-orange" />
            <h1 className="text-2xl font-bold text-primary">Go Premium</h1>
          </div>
          <p className="text-center text-sm text-muted-foreground text-balance">Unlock unlimited learning potential</p>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 p-4 space-y-4">
          {/* Premium Features */}
          <div className="space-y-3">
            <h2 className="text-lg text-primary-hover font-semibold flex items-center gap-2">
              <Sparkles className="size-5 text-education-orange" />
              Premium Benefits
            </h2>
            <div className="space-y-2 text-muted-foreground">
              {[
                "Unlimited access to 10,000+ courses",
                "Premium exclusive content",
                "Ad-free learning experience",
                "Verified certificates",
                "Offline downloads",
                "Priority 24h support",
              ].map((feature, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="size-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Card */}
          <Card className="p-4 bg-gradient-to-br from-accent/10 to-primary/5 border-2 border-accent/50 relative">
            <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-accent text-primary-hover text-xs hover:text-white">
              Most Popular
            </Badge>
            <div className="text-center space-y-4 mt-2">
              <div>
                <div className="text-sm text-muted-foreground mb-1">Premium Plan</div>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold bg-gradient-to-br from-primary to-accent bg-clip-text text-transparent">
                    #500
                  </span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>

              <div className="pt-4 space-y-2">
                <Button className="w-full" size="lg">
                  Start Premium Trial
                </Button>
                {/* <p className="text-xs text-muted-foreground text-center">7-day free trial • Cancel anytime</p> */}
              </div>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-border">
            <div className="text-center">
              <div className="text-xl font-bold text-education-orange">10K+</div>
              <div className="text-xs text-muted-foreground">Courses</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-sidebar-ring">500K+</div>
              <div className="text-xs text-muted-foreground">Learners</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-destructive">95%</div>
              <div className="text-xs text-muted-foreground">Satisfied</div>
            </div>
          </div>
        </div>

      </Card>
    </div>
    </div>
  </section>
  
  );
}
