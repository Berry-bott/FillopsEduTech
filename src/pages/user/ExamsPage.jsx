// import PageNav from "../../components/DashboardComponents/PageNav";
// import React, { useEffect, useState, useRef } from "react";
// import { Calculator, Clock, ChevronLeft, ChevronRight, Flag, Send } from "lucide-react";

// export default function ExamsPage() {
//   const [navProps, setNavProps] = useState({
//     exams: "",
//     mood: ""
//   });
//   const [studyData, setStudyData] = useState(null);
//   const [showCalculator, setShowCalculator] = useState(false);
//   const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes in seconds
//   const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
//   const [currentQuestion, setCurrentQuestion] = useState(0);
//   const [selectedOptions, setSelectedOptions] = useState({});
//   const [flaggedQuestions, setFlaggedQuestions] = useState(new Set());
//   const [calculatorValue, setCalculatorValue] = useState("0");
//   const [showSubmit, setShowSubmit] = useState(false);
//   // Add this state with your other useState declarations
// const [mobilePage, setMobilePage] = useState(0);

//   // Mock questions data organized by subject
//   const questionsBySubject = {
//     Mathematics: [
//       {
//         id: 1,
//         question: "What is the square root of 144?",
//         options: ["10", "11", "12", "13"],
//         correct: "12"
//       },
//       {
//         id: 2,
//         question: "Which of these is a prime number?",
//         options: ["1", "4", "11", "15"],
//         correct: "11"
//       },
//       {
//         id: 3,
//         question: "Solve for x: 2x + 5 = 15",
//         options: ["5", "10", "7.5", "8"],
//         correct: "5"
//       },
//     ],
//     English: [
//       {
//         id: 1,
//         question: "Which word is a synonym for 'happy'?",
//         options: ["Sad", "Joyful", "Angry", "Tired"],
//         correct: "Joyful"
//       },
//       {
//         id: 2,
//         question: "Identify the noun in: 'The quick brown fox jumps over the lazy dog'",
//         options: ["quick", "jumps", "fox", "lazy"],
//         correct: "fox"
//       },
//     ],
//     Physics: [
//       {
//         id: 1,
//         question: "What is the SI unit of force?",
//         options: ["Pascal", "Joule", "Newton", "Watt"],
//         correct: "Newton"
//       },
//       {
//         id: 2,
//         question: "What is acceleration due to gravity?",
//         options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "12 m/s²"],
//         correct: "9.8 m/s²"
//       },
//     ]
//   };

//   const subjects = Object.keys(questionsBySubject);
//   const currentSubject = subjects[currentSubjectIndex];
//   const currentQuestions = questionsBySubject[currentSubject] || [];
//   const totalQuestions = Object.values(questionsBySubject).reduce((total, subjectQuestions) => total + subjectQuestions.length, 0);

//   useEffect(() => {
//     const raw = localStorage.getItem("studySelections");
//     if (!raw) return;
//     try {
//       const parsed = JSON.parse(raw);
//       setStudyData(parsed);
//       console.log("Parsed study data:", parsed);
  
//       const examType = parsed.exam || "JAMB";
//       const studyMode = "Exam"; 
  
//       setNavProps({
//         exams: examType,
//         mood: studyMode
//       });
  
//     } catch {
//       setStudyData(null);
//     }
//   }, []);

//   // Countdown timer
//   useEffect(() => {
//     if (timeLeft <= 0) {
//       handleSubmit(); // Auto-submit when time runs out
//       return;
//     }

//     const timer = setInterval(() => {
//       setTimeLeft(prev => prev - 1);
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft]);

//   const formatTime = (seconds) => {
//     const hours = Math.floor(seconds / 3600);
//     const minutes = Math.floor((seconds % 3600) / 60);
//     const secs = seconds % 60;
//     return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//   };

//   const handleOptionSelect = (subject, questionIndex, option) => {
//     const key = `${subject}-${questionIndex}`;
//     setSelectedOptions(prev => ({
//       ...prev,
//       [key]: option
//     }));
//   };

//   const toggleFlagQuestion = (subject, questionIndex) => {
//     const key = `${subject}-${questionIndex}`;
//     setFlaggedQuestions(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(key)) {
//         newSet.delete(key);
//       } else {
//         newSet.add(key);
//       }
//       return newSet;
//     });
//   };

//   const navigateToQuestion = (subjectIndex, questionIndex) => {
//     setCurrentSubjectIndex(subjectIndex);
//     setCurrentQuestion(questionIndex);
//   };

//   const nextQuestion = () => {
//     // Check if there are more questions in current subject
//     if (currentQuestion < currentQuestions.length - 1) {
//       setCurrentQuestion(currentQuestion + 1);
//     } 
//     // Check if there are more subjects
//     else if (currentSubjectIndex < subjects.length - 1) {
//       setCurrentSubjectIndex(currentSubjectIndex + 1);
//       setCurrentQuestion(0);
//     }
//     // No more questions or subjects
//     else {
//       setShowSubmit(true);
//     }
//   };

//   const prevQuestion = () => {
//     if (currentQuestion > 0) {
//       setCurrentQuestion(currentQuestion - 1);
//     } else if (currentSubjectIndex > 0) {
//       const prevSubject = subjects[currentSubjectIndex - 1];
//       const prevSubjectQuestions = questionsBySubject[prevSubject];
//       setCurrentSubjectIndex(currentSubjectIndex - 1);
//       setCurrentQuestion(prevSubjectQuestions.length - 1);
//     }
//   };

//   const handleCalculatorInput = (input) => {
//     if (input === 'C') {
//       setCalculatorValue("0");
//     } else if (input === '=') {
//       try {
//         // Using Function constructor instead of eval for safety
//         const result = Function('"use strict";return (' + calculatorValue + ')')();
//         setCalculatorValue(String(result));
//       } catch {
//         setCalculatorValue("Error");
//       }
//     } else if (input === '⌫') {
//       setCalculatorValue(prev => prev.length > 1 ? prev.slice(0, -1) : "0");
//     } else {
//       setCalculatorValue(prev => prev === "0" || prev === "Error" ? input : prev + input);
//     }
//   };

//   const handleSubmit = () => {
//     // Calculate score
//     let score = 0;
//     Object.entries(selectedOptions).forEach(([key, selectedAnswer]) => {
//       const [subject, questionIndex] = key.split('-');
//       const question = questionsBySubject[subject][parseInt(questionIndex)];
//       if (question && selectedAnswer === question.correct) {
//         score++;
//       }
//     });

//     alert(`Exam submitted!\nYour score: ${score}/${totalQuestions}\nPercentage: ${((score / totalQuestions) * 100).toFixed(1)}%`);
//     // Here you would typically navigate to results page or send data to backend
//   };

//   // Functional calculator component
//   const CalculatorModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-80">
//         <div className="flex justify-between items-center mb-4">
//           <h3 className="text-lg font-semibold">Calculator</h3>
//           <button 
//             onClick={() => setShowCalculator(false)}
//             className="text-gray-500 hover:text-gray-700 text-2xl"
//           >
//             ×
//           </button>
//         </div>
//         <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded mb-4 text-right font-mono text-xl min-h-[60px] flex items-center justify-end">
//           {calculatorValue}
//         </div>
//         <div className="grid grid-cols-4 gap-2">
//           {['C', '⌫', '%', '/', '7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map((btn) => (
//             <button
//               key={btn}
//               onClick={() => handleCalculatorInput(btn)}
//               className={`p-3 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors font-medium ${
//                 btn === '=' 
//                   ? 'bg-blue-600 text-white hover:bg-blue-700' 
//                   : 'bg-gray-200 dark:bg-gray-600'
//               } ${btn === 'C' ? 'bg-red-500 text-white hover:bg-red-600' : ''}`}
//             >
//               {btn}
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );

//   // Flatten all questions for the grid view
//   const allQuestions = [];
//   subjects.forEach((subject, subjectIndex) => {
//     questionsBySubject[subject].forEach((_, questionIndex) => {
//       allQuestions.push({
//         subjectIndex,
//         questionIndex,
//         subject,
//         globalIndex: allQuestions.length
//       });
//     });
//   });

//   const currentGlobalIndex = allQuestions.findIndex(
//     q => q.subjectIndex === currentSubjectIndex && q.questionIndex === currentQuestion
//   );

//   return(
//     <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
//       <PageNav exams={navProps.exams} mood={navProps.mood} />
      
//       {/* Main Content */}
//       <div className="max-w-6xl mx-auto px-4 py-8 pt-20">
//         {/* Top Controls */}
//         <div className="flex justify-between items-center mb-6">
//           {/* Timer */}
//           <div className="flex items-center gap-2 bg-red-100 dark:bg-red-900 px-4 py-2 rounded-lg">
//             <Clock className="h-5 w-5 text-red-600" />
//             <span className="font-mono text-red-600 font-bold text-lg">
//               {formatTime(timeLeft)}
//             </span>
//           </div>

//           {/* Calculator Button */}
//           <button
//             onClick={() => setShowCalculator(true)}
//             className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//           >
//             <Calculator className="h-5 w-5" />
//             Calculator
//           </button>
//         </div>

//         {/* Subject Indicator */}
//         <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
//           <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 text-center">
//             {currentSubject} - Question {currentQuestion + 1} of {currentQuestions.length}
//           </h2>
//           <div className="flex justify-center gap-4 mt-2 text-sm text-blue-600 dark:text-blue-400">
//             {subjects.map((subject, index) => (
//               <span
//                 key={subject}
//                 className={`px-3 py-1 rounded-full ${
//                   index === currentSubjectIndex
//                     ? 'bg-blue-600 text-white'
//                     : 'bg-blue-100 dark:bg-blue-800'
//                 }`}
//               >
//                 {subject}
//               </span>
//             ))}
//           </div>
//         </div>

//         {/* Question Container */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
//           {/* Question Header */}
//           <div className="flex justify-between items-start mb-4">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
//               Question {currentQuestion + 1} of {currentQuestions.length} in {currentSubject}
//             </h3>
//             <button
//               onClick={() => toggleFlagQuestion(currentSubject, currentQuestion)}
//               className={`p-2 rounded-full ${
//                 flaggedQuestions.has(`${currentSubject}-${currentQuestion}`) 
//                   ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900' 
//                   : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
//               }`}
//             >
//               <Flag className="h-5 w-5" />
//             </button>
//           </div>

//           {/* Question */}
//           <p className="text-gray-900 dark:text-white text-lg mb-6">
//             {currentQuestions[currentQuestion]?.question}
//           </p>

//           {/* Options */}
//           <div className="space-y-3">
//             {currentQuestions[currentQuestion]?.options.map((option, index) => {
//               const key = `${currentSubject}-${currentQuestion}`;
//               return (
//                 <button
//                   key={index}
//                   onClick={() => handleOptionSelect(currentSubject, currentQuestion, option)}
//                   className={`w-full text-left p-4 rounded-lg border transition-colors ${
//                     selectedOptions[key] === option
//                       ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
//                       : 'border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
//                   }`}
//                 >
//                   {String.fromCharCode(65 + index)}. {option}
//                 </button>
//               );
//             })}
//           </div>

//           {/* Navigation Buttons */}
//           <div className="flex justify-between mt-6">
//             <button
//               onClick={prevQuestion}
//               disabled={currentSubjectIndex === 0 && currentQuestion === 0}
//               className="flex items-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeft className="h-5 w-5" />
//               Previous
//             </button>

//             {showSubmit ? (
//               <button
//                 onClick={handleSubmit}
//                 className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//               >
//                 <Send className="h-5 w-5" />
//                 Submit Exam
//               </button>
//             ) : (
//               <button
//                 onClick={nextQuestion}
//                 className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//               >
//                 Next
//                 <ChevronRight className="h-5 w-5" />
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Question Numbers Grid */}
//         <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 sm:p-6">
//   <h3 className="text-md font-semibold mb-4 text-gray-900 dark:text-white">
//     All Questions ({totalQuestions} total)
//   </h3>
  
//   {/* Mobile Question Navigation - Show only 5 at a time */}
//   <div className="sm:hidden">
//     <div className="flex items-center justify-between mb-4">
//       <button
//         onClick={() => setMobilePage(prev => Math.max(0, prev - 1))}
//         disabled={mobilePage === 0}
//         className="flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
//       >
//         <ChevronLeft className="h-4 w-4" />
//       </button>
      
//       <span className="text-sm font-medium">
//         Questions {mobilePage * 5 + 1}-{Math.min((mobilePage + 1) * 5, totalQuestions)}
//       </span>
      
//       <button
//         onClick={() => setMobilePage(prev => Math.min(Math.ceil(totalQuestions / 5) - 1, prev + 1))}
//         disabled={mobilePage >= Math.ceil(totalQuestions / 5) - 1}
//         className="flex items-center gap-1 px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50"
//       >
//         <ChevronRight className="h-4 w-4" />
//       </button>
//     </div>
    
//     <div className="grid grid-cols-5 gap-1">
//       {allQuestions
//         .slice(mobilePage * 5, (mobilePage + 1) * 5)
//         .map(({ subjectIndex, questionIndex, subject, globalIndex }) => {
//           const key = `${subject}-${questionIndex}`;
//           const isCurrent = subjectIndex === currentSubjectIndex && questionIndex === currentQuestion;
//           const isAnswered = selectedOptions[key];
//           const isFlagged = flaggedQuestions.has(key);
          
//           const displayNumber = globalIndex + 1;
//           const showEllipsis = displayNumber >= 100;
//           const formattedNumber = showEllipsis ? "..." : displayNumber;
          
//           return (
//             <button
//               key={globalIndex}
//               onClick={() => navigateToQuestion(subjectIndex, questionIndex)}
//               title={`Question ${displayNumber}: ${subject}`}
//               className={`aspect-square rounded-lg border-2 h-12 w-12 flex items-center justify-center font-medium transition-all relative ${
//                 isCurrent
//                   ? 'border-blue-500 bg-blue-500 text-white shadow-md'
//                   : isAnswered
//                   ? 'border-green-500 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
//                   : isFlagged
//                   ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
//                   : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
//               } ${showEllipsis ? 'text-xs' : 'text-sm'}`}
//             >
//               {formattedNumber}
//               {isFlagged && (
//                 <Flag className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
//               )}
//             </button>
//           );
//         })}
//     </div>
    
//     {/* Mobile pagination dots */}
//     <div className="flex justify-center gap-1 mt-3">
//       {Array.from({ length: Math.ceil(totalQuestions / 5) }, (_, i) => (
//         <button
//           key={i}
//           onClick={() => setMobilePage(i)}
//           className={`w-2 h-2 rounded-full transition-colors ${
//             i === mobilePage 
//               ? 'bg-blue-500' 
//               : 'bg-gray-300 dark:bg-gray-600'
//           }`}
//         />
//       ))}
//     </div>
//   </div>
  
//   {/* Desktop Question Grid - Show all questions */}
//   <div className="hidden sm:block">
//     <div className="grid grid-cols-5 md:grid-cols-10 gap-1">
//       {allQuestions.map(({ subjectIndex, questionIndex, subject, globalIndex }) => {
//         const key = `${subject}-${questionIndex}`;
//         const isCurrent = subjectIndex === currentSubjectIndex && questionIndex === currentQuestion;
//         const isAnswered = selectedOptions[key];
//         const isFlagged = flaggedQuestions.has(key);
        
//         const displayNumber = globalIndex + 1;
//         const showEllipsis = displayNumber >= 100;
//         const formattedNumber = showEllipsis ? "..." : displayNumber;
        
//         return (
//           <button
//             key={globalIndex}
//             onClick={() => navigateToQuestion(subjectIndex, questionIndex)}
//             title={`Question ${displayNumber}: ${subject}`}
//             className={`aspect-square rounded-lg border-2 h-10 w-10 flex items-center justify-center font-medium transition-all relative group ${
//               isCurrent
//                 ? 'border-blue-500 bg-blue-500 text-white shadow-md'
//                 : isAnswered
//                 ? 'border-green-500 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300'
//                 : isFlagged
//                 ? 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300'
//                 : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700'
//             } ${showEllipsis ? 'text-xs' : 'text-sm'}`}
//           >
//             {formattedNumber}
//             {isFlagged && (
//               <Flag className="h-3 w-3 absolute -top-1 -right-1 text-yellow-500" />
//             )}
            
//             {/* Tooltip for ellipsis */}
//             {showEllipsis && (
//               <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2 whitespace-nowrap z-10">
//                 Question {displayNumber}
//               </div>
//             )}
//           </button>
//         );
//       })}
//     </div>
//   </div>
  
//   {/* Legend */}
//   <div className="flex flex-wrap gap-3 sm:gap-4 mt-4 text-xs sm:text-sm">
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-blue-500 bg-blue-500 rounded"></div>
//       <span>Current</span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-green-500 bg-green-100 dark:bg-green-900/20 rounded"></div>
//       <span>Answered</span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-yellow-500 bg-yellow-100 dark:bg-yellow-900/20 rounded"></div>
//       <span>Flagged</span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 dark:border-gray-600 rounded"></div>
//       <span>Unanswered</span>
//     </div>
//     <div className="flex items-center gap-2">
//       <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-gray-300 dark:border-gray-600 rounded flex items-center justify-center text-xs">...</div>
//       <span>Question 100+</span>
//     </div>
//   </div>
// </div>
//       </div>

//       {/* Calculator Modal */}
//       {showCalculator && <CalculatorModal />}
//     </div>
//   )
// }






// import { useEffect } from 'react';
// import Header from '../../components/DashboardComponents/user/study-component/Header';
// import QuestionCard from '../../components/DashboardComponents/user/study-component/QuestionCard';
// import { useStudyStore } from '../../store/studyStore';

// export default function examsPage() {
//   const init = useStudyStore((s) => s.syncSaved);
//   const reset = useStudyStore((s) => s.reset);
//   const loading = useStudyStore((s) => s.loading);
//   const saved = useStudyStore((s) => s.saved);

//   useEffect(() => {
//     console.log('📘 examsPage mounted → sync store');
//     init();

//     return () => {
//       console.log('🧹 examsPage unmounted → reset store');
//       reset();
//     };
//   }, []);

//   // if (!saved) return <p>No study selections found.</p>;

//   return (
//     <div className="p-4">
      // <Header />

      // {loading ? (
      //     <div className="h-[400px] flex items-center justify-center">
      //     <div className="text-center">
      //       <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      //     </div>
      //   </div>
      // ) : (
      //   <QuestionCard />
      // )}
//     </div>
//   );
// }



import Header from '../../components/DashboardComponents/user/study-component/Header';
import QuestionCard from '../../components/DashboardComponents/user/study-component/QuestionCard';
import { useStudyStore } from '@/store/studyStore';
import { useState, useEffect, useRef } from 'react';
import { Clock, Calculator, BarChart3, Printer, RotateCcw, X } from 'lucide-react';



export default function ExamsPage() {

  const init = useStudyStore((s) => s.syncSaved);

  const reset = useStudyStore((s) => s.reset);
  const loading = useStudyStore((s) => s.loading);
  const saved = useStudyStore((s) => s.saved);

  const [examState, setExamState] = useState('setup'); // setup, active, completed
  const [timeLimit, setTimeLimit] = useState(60); // minutes
  const [timeRemaining, setTimeRemaining] = useState(0); // seconds
  const [subjects, setSubjects] = useState([
    { name: 'Mathematics', selected: true },
    { name: 'English', selected: false },
    { name: 'Physics', selected: false },
    { name: 'Chemistry', selected: false },
    { name: 'Biology', selected: false }
  ]);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [answers, setAnswers] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (examState === 'active' && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleExamComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [examState, timeRemaining]);

  const handleStartExam = () => {
    const selectedCount = subjects.filter(s => s.selected).length;
    if (selectedCount === 0) {
      alert('Please select at least one subject');
      return;
    }
    setTimeRemaining(timeLimit * 60);
    setExamState('active');
    setAnswers([]);
  };

  const handleExamComplete = () => {
    clearInterval(timerRef.current);
    setExamState('completed');
  };

  const handleAnswer = (answerData) => {
    setAnswers(prev => [...prev, answerData]);
  };

  const handleRetake = () => {
    setExamState('setup');
    setAnswers([]);
    setTimeRemaining(0);
  };

  const handlePrint = () => {
    window.print();
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const calculateResults = () => {
    const selectedSubjects = subjects.filter(s => s.selected);
    const subjectScores = {};
    
    selectedSubjects.forEach(subj => {
      const subjectAnswers = answers.filter(a => a.subject === subj.name);
      const correct = subjectAnswers.filter(a => a.correct).length;
      const total = subjectAnswers.length || 1;
      subjectScores[subj.name] = {
        correct,
        total,
        percentage: Math.round((correct / total) * 100)
      };
    });

    const totalCorrect = answers.filter(a => a.correct).length;
    const totalQuestions = answers.length || 1;
    const overallPercentage = Math.round((totalCorrect / totalQuestions) * 100);

    const strengths = Object.entries(subjectScores)
      .filter(([_, score]) => score.percentage >= 70)
      .map(([name]) => name);
    
    const weaknesses = Object.entries(subjectScores)
      .filter(([_, score]) => score.percentage < 50)
      .map(([name]) => name);

    return { subjectScores, overallPercentage, strengths, weaknesses };
  };

  // Calculator functions
  const handleCalc = (value) => {
    if (value === 'C') {
      setCalcDisplay('0');
    } else if (value === '=') {
      try {
        setCalcDisplay(String(eval(calcDisplay)));
      } catch {
        setCalcDisplay('Error');
      }
    } else {
      setCalcDisplay(prev => prev === '0' ? value : prev + value);
    }
  };

  // Setup Screen
  if (examState === 'setup') {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Header />
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Exam Setup</h2>
          
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">
              Time Limit (max 120 minutes)
            </label>
            <input
              type="number"
              min="1"
              max="120"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Math.min(120, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Select Subjects</label>
            <div className="space-y-2">
              {subjects.map((subj, idx) => (
                <label key={subj.name} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={subj.selected}
                    onChange={(e) => {
                      const updated = [...subjects];
                      updated[idx].selected = e.target.checked;
                      setSubjects(updated);
                    }}
                    className="w-4 h-4"
                  />
                  <span>{subj.name}</span>
                </label>
              ))}
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-semibold"
          >
            Start Exam
          </button>
        </div>
      </div>
    );
  }

  // Active Exam Screen
  if (examState === 'active') {
    return (
      <div className="p-4 max-w-4xl mx-auto">
        <Header />
        
        {/* Timer Bar */}
        <div className="bg-white rounded-lg shadow p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-semibold">{formatTime(timeRemaining)}</span>
          </div>
          
          <button
            onClick={() => setShowCalculator(!showCalculator)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
          >
            <Calculator className="w-4 h-4" />
            <span>Calculator</span>
          </button>

          <button
            onClick={handleExamComplete}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Submit Exam
          </button>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <p className="text-sm text-gray-600">
            Questions Answered: {answers.length}
          </p>
        </div>

        {/* Calculator Modal */}
        {showCalculator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-80">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Calculator</h3>
                <button onClick={() => setShowCalculator(false)}>
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="bg-gray-100 p-4 rounded mb-4 text-right text-2xl font-mono">
                {calcDisplay}
              </div>
              
              <div className="grid grid-cols-4 gap-2">
                {['7','8','9','/','4','5','6','*','1','2','3','-','0','.','=','+','C'].map(btn => (
                  <button
                    key={btn}
                    onClick={() => handleCalc(btn)}
                    className="bg-gray-200 hover:bg-gray-300 p-3 rounded font-semibold"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <QuestionCard 
          onAnswer={handleAnswer}
          currentSubject={subjects.find(s => s.selected)?.name}
        />
      </div>
    );
  }

  // Results Screen
  const results = calculateResults();
  const maxScore = Math.max(...Object.values(results.subjectScores).map(s => s.percentage), 1);

  return (
    <div className="p-4 max-w-6xl mx-auto print:p-8">
      <Header />
      
      <div className="bg-white rounded-lg shadow p-8">
        <h2 className="text-3xl font-bold mb-6 text-center">Exam Report</h2>
        
        {/* Overall Score */}
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600 mb-2">
            {results.overallPercentage}%
          </div>
          <p className="text-gray-600">Overall Score</p>
        </div>

        {/* Bar Chart */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Subject Performance
          </h3>
          
          <div className="space-y-4">
            {Object.entries(results.subjectScores).map(([subject, score]) => (
              <div key={subject}>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">{subject}</span>
                  <span className="text-gray-600">
                    {score.correct}/{score.total} ({score.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-6 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{ width: `${score.percentage}%` }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {score.percentage}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Strengths</h3>
            {results.strengths.length > 0 ? (
              <ul className="space-y-2">
                {results.strengths.map(subj => (
                  <li key={subj} className="text-green-700">✓ {subj}</li>
                ))}
              </ul>
            ) : (
              <p className="text-green-600">Keep practicing to build strengths!</p>
            )}
          </div>

          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-red-800 mb-3">Areas for Improvement</h3>
            {results.weaknesses.length > 0 ? (
              <ul className="space-y-2">
                {results.weaknesses.map(subj => (
                  <li key={subj} className="text-red-700">→ {subj}</li>
                ))}
              </ul>
            ) : (
              <p className="text-red-600">Great work! No major weaknesses identified.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 justify-center print:hidden">
          <button
            onClick={handleRetake}
            className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Retake Exam</span>
          </button>
          
          <button
            onClick={handlePrint}
            className="flex items-center space-x-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            <Printer className="w-5 h-5" />
            <span>Print Result</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/dashboard'}
            className="flex items-center space-x-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            <X className="w-5 h-5" />
            <span>Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
}