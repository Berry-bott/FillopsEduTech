// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Checkbox } from "@/components/ui/checkbox";
// import { GraduationCap, PenTool, FileText } from "lucide-react";

// const subjectData = {
//   jamb: ["English", "Maths", "Physics", "Chemistry", "Biology", "Government", "Literature", "Commerce"],
//   waec: ["Biology", "Chemistry", "Physics", "Maths", "English", "Literature", "Accounting", "Economics"],
//   neco: ["English", "Maths", "Biology", "Chemistry", "Physics", "Commerce", "Economics"],
//   putme: ["Use of English", "Physics", "Chemistry", "Biology", "Government", "Accounting", "Economics"],
// };

// const topicData = {
//   English: ["Comprehension", "Grammar", "Summary", "Lexis"],
//   Maths: ["Algebra", "Geometry", "Trigonometry"],
//   Physics: ["Mechanics", "Electricity", "Optics"],
//   Chemistry: ["Organic", "Inorganic", "Physical"],
//   Biology: ["Cells", "Genetics", "Ecology"],
//   "Use of English": ["Grammar", "Comprehension"],
//   Economics: ["Micro", "Macro"],
//   Commerce: ["Trade", "Business"],
//   Accounting: ["Journal", "Ledger"],
//   Government: ["Civics", "Constitutional"],
//   Literature: ["Poetry", "Prose"],
//   CRS: ["Ethics", "Religions"],
// };

// const YEARS = [2024, 2023, 2022, 2021, 2020];
// const YEAR_OPTIONS = [...YEARS.map((y) => String(y)), "Random"];

// export default function ExamSelector() {
//   const navigate = useNavigate();

//   const [open, setOpen] = useState(false);
//   const [examDropdownOpen, setExamDropdownOpen] = useState(false);
//   const [activeAction, setActiveAction] = useState(null);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [selectMode, setSelectMode] = useState(null);

//   // Subject selection
//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [subjectYears, setSubjectYears] = useState({});

//   // Topic selection
//   const [openTopicSubject, setOpenTopicSubject] = useState(null);
//   const [selectedTopics, setSelectedTopics] = useState({});
//   const [topicYearFilter, setTopicYearFilter] = useState({});

//   const openFor = (action) => {
//     setActiveAction(action);
//     setSelectedExam(null);
//     setSelectMode(null);
//     setSelectedSubjects([]);
//     setSubjectYears({});
//     setSelectedTopics({});
//     setTopicYearFilter({});
//     setOpen(true);
//     setExamDropdownOpen(false);
//   };

//   const toggleSubject = (subject) => {
//     setSelectedSubjects((prev) => {
//       if (prev.includes(subject)) {
//         const next = prev.filter((s) => s !== subject);
//         const copy = { ...subjectYears };
//         delete copy[subject];
//         setSubjectYears(copy);
//         return next;
//       }
//       if (prev.length >= 5) {
//         alert("You can only select up to 5 subjects");
//         return prev;
//       }
//       return [...prev, subject];
//     });
//   };

//   const setYearForSubject = (subject, year) => {
//     setSubjectYears((prev) => ({ ...prev, [subject]: year }));
//   };

//   const toggleTopic = (subject, topic) => {
//     setSelectedTopics((prev) => {
//       const arr = prev[subject] ? [...prev[subject]] : [];
//       const exists = arr.includes(topic);
//       const next = exists ? arr.filter((t) => t !== topic) : [...arr, topic];
//       return { ...prev, [subject]: next };
//     });
//   };

//   const setTopicYear = (subject, val) => {
//     setTopicYearFilter((prev) => ({ ...prev, [subject]: val }));
//   };

//   const handleStart = () => {
//     if (selectMode === "subject" && selectedSubjects.length === 0) {
//       alert("Please select at least one subject.");
//       return;
//     }

//     if (
//       selectMode === "topic" &&
//       !Object.values(selectedTopics).some((arr) => Array.isArray(arr) && arr.length > 0)
//     ) {
//       alert("Please select at least one topic.");
//       return;
//     }

//     const resolvedSubjectYears = { ...subjectYears };
//     Object.entries(resolvedSubjectYears).forEach(([sub, year]) => {
//       if (String(year).toLowerCase() === "random") {
//         const pick = YEARS[Math.floor(Math.random() * YEARS.length)];
//         resolvedSubjectYears[sub] = String(pick);
//       }
//     });

//     const resolvedTopicYears = { ...topicYearFilter };
//     Object.entries(resolvedTopicYears).forEach(([sub, val]) => {
//       if (String(val).toLowerCase() === "random") {
//         const pick = YEARS[Math.floor(Math.random() * YEARS.length)];
//         resolvedTopicYears[sub] = String(pick);
//       }
//     });

//     const payload = {
//       exam: selectedExam,
//       mode: selectMode,
//       subjects: selectMode === "subject" ? selectedSubjects : undefined,
//       subjectYears: selectMode === "subject" ? resolvedSubjectYears : undefined,
//       topics: selectMode === "topic" ? selectedTopics : undefined,
//       topicYears: selectMode === "topic" ? resolvedTopicYears : undefined,
//       timestamp: new Date().toISOString(),
//     };

//     localStorage.setItem("studySelections", JSON.stringify(payload));
//     setOpen(false);
//     navigate("/learning");
//   };

//   const exams = ["jamb", "waec", "neco", "putme"];

//   return (
//     <div className="flex flex-col items-center space-y-4">
//       {/* Main Action Buttons */}
//       <div className="flex gap-3">
//         {/* Study button */}
//         <div className="relative inline-block">
//           <Button
//             onClick={() => setExamDropdownOpen((s) => !s)}
//             className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
//           >
//             <GraduationCap className="w-4 h-4" />
//             <span>Study</span>
//           </Button>

//           {examDropdownOpen && (
//             <div className="absolute mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow border z-30">
//               {exams.map((ex) => (
//                 <button
//                   key={ex}
//                   className="w-full text-left px-4 py-2 capitalize hover:bg-gray-100 dark:hover:bg-gray-700"
//                   onClick={() => {
//                     setSelectedExam(ex);
//                     setSelectMode(null);
//                     setSelectedSubjects([]);
//                     setSubjectYears({});
//                     setSelectedTopics({});
//                     setTopicYearFilter({});
//                     setExamDropdownOpen(false);
//                     setActiveAction("learning");
//                     setOpen(true);
//                   }}
//                 >
//                   {ex}
//                 </button>
//               ))}
//             </div>
//           )}
//         </div>

//         {/* Quiz button */}
//         <Button
//           onClick={() => openFor("quiz")}
//           className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
//         >
//           <PenTool className="w-4 h-4" />
//           <span>Take Quiz</span>
//         </Button>

//         {/* Exam button */}
//         <Button
//           onClick={() => openFor("exam")}
//           className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
//         >
//           <FileText className="w-4 h-4" />
//           <span>Write Exam</span>
//         </Button>
//       </div>

//       {/* Modal */}
//       <Dialog open={open} onOpenChange={setOpen}>
//         <DialogContent className="max-w-2xl">
//           <DialogHeader>
//             <DialogTitle>
//               {activeAction === "learning"
//                 ? "Study - Setup"
//                 : activeAction === "quiz"
//                 ? "Quiz - Setup"
//                 : "Exam - Setup"}
//             </DialogTitle>
//           </DialogHeader>

//           {/* Step 1: Select Exam */}
//           {!selectedExam && (
//             <div className="mt-4">
//               <p className="text-sm text-gray-700">Select exam type:</p>
//               <div className="mt-2 grid grid-cols-2 gap-2">
//                 {exams.map((ex) => (
//                   <Button
//                     key={ex}
//                     variant="outline"
//                     className="capitalize"
//                     onClick={() => setSelectedExam(ex)}
//                   >
//                     {ex}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Step 2: Choose Mode */}
//           {selectedExam && !selectMode && (
//             <div className="mt-4">
//               <p className="text-sm text-gray-700">
//                 {`Selected exam: ${selectedExam.toUpperCase()}. How do you want to proceed?`}
//               </p>
//               <div className="mt-2 grid gap-2">
//                 <Button variant="outline" onClick={() => setSelectMode("subject")}>
//                   Select by Subject
//                 </Button>
//                 <Button variant="outline" onClick={() => setSelectMode("topic")}>
//                   Select by Topic
//                 </Button>
//               </div>
//             </div>
//           )}

//           {/* Step 3A: Subject Mode */}
//           {selectedExam && selectMode === "subject" && (
//             <div className="mt-4 max-h-[420px] overflow-y-auto space-y-3">
//               <p className="text-sm text-gray-700">
//                 Select up to 5 subjects for {selectedExam.toUpperCase()}.
//               </p>

//               {subjectData[selectedExam].map((subject) => (
//                 <div
//                   className="flex items-center justify-between border-b pb-2"
//                   key={subject}
//                 >
//                   <div className="flex items-center gap-3">
//                     <Checkbox
//                       checked={selectedSubjects.includes(subject)}
//                       onCheckedChange={() => toggleSubject(subject)}
//                     />
//                     <span>{subject}</span>
//                   </div>

//                   <div>
//                     <select
//                       value={subjectYears[subject] || ""}
//                       onChange={(e) => setYearForSubject(subject, e.target.value)}
//                       className="border rounded px-2 py-1 text-sm"
//                     >
//                       <option value="">Year</option>
//                       <option value="random">Random</option>
//                       {YEARS.map((y) => (
//                         <option key={y} value={String(y)}>
//                           {y}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Step 3B: Topic Mode */}
//           {selectedExam && selectMode === "topic" && (
//             <div className="mt-4 max-h-[420px] overflow-y-auto space-y-3">
//               <p className="text-sm text-gray-700">
//                 Select topics (hover a subject to view topics).
//               </p>

//               {subjectData[selectedExam].map((subject) => (
//                 <div
//                   key={subject}
//                   className="border rounded p-3 relative"
//                   onMouseEnter={() => setOpenTopicSubject(subject)}
//                   onMouseLeave={() => setOpenTopicSubject(null)}
//                 >
//                   <div className="flex items-center justify-between">
//                     <div className="font-medium">{subject}</div>
//                     <select
//                       value={topicYearFilter[subject] || ""}
//                       onChange={(e) => setTopicYear(subject, e.target.value)}
//                       className="border rounded px-2 py-1 text-sm"
//                     >
//                       <option value="">Year (All)</option>
//                       <option value="random">Random</option>
//                       {YEARS.map((y) => (
//                         <option key={y} value={String(y)}>
//                           {y}
//                         </option>
//                       ))}
//                     </select>
//                   </div>

//                   {openTopicSubject === subject && (
//                     <div className="mt-2 grid grid-cols-2 gap-2">
//                       {(topicData[subject] || []).map((topic) => (
//                         <label
//                           key={topic}
//                           className="flex items-center gap-2 text-sm"
//                         >
//                           <Checkbox
//                             checked={
//                               selectedTopics[subject]?.includes(topic) || false
//                             }
//                             onCheckedChange={() => toggleTopic(subject, topic)}
//                           />
//                           <span>{topic}</span>
//                         </label>
//                       ))}
//                       {!topicData[subject] && (
//                         <div className="text-xs text-gray-500">
//                           No topics defined for this subject.
//                         </div>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}

//           {/* Start Button */}
//           {(
//             (selectMode === "subject" && selectedSubjects.length > 0) ||
//             (selectMode === "topic" &&
//               Object.values(selectedTopics).some(
//                 (arr) => Array.isArray(arr) && arr.length > 0
//               ))
//           ) && (
//             <DialogFooter className="mt-4">
//               <Button onClick={handleStart} className="w-full">
//                 Start Studying
//               </Button>
//             </DialogFooter>
//           )}
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// }



// src/components/ExamSelector/ExamSelector.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { subjectData, topicData, YEARS } from "./data";
import StudyActions from "./StudyActions";
import StudyDialog from "./StudyDialog";

export default function ExamSelector() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectMode, setSelectMode] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectYears, setSubjectYears] = useState({});
  const [openTopicSubject, setOpenTopicSubject] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState({});
  const [topicYearFilter, setTopicYearFilter] = useState({});
  const [errorModal, setErrorModal] = useState({ open: false, message: "" });

  const exams = ["WAEC", "JAMB", "NECO", "PUTME"];

  const openFor = (action) => {
    setActiveAction(action);
    setSelectedExam(null);
    setSelectMode(null);
    setSelectedSubjects([]);
    setSubjectYears({});
    setSelectedTopics({});
    setTopicYearFilter({});
    setOpen(true);
    setExamDropdownOpen(false);
  };

  const onSelectExam = (ex) => {
    setSelectedExam(ex);
    setSelectMode(null);
    setSelectedSubjects([]);
    setSubjectYears({});
    setSelectedTopics({});
    setTopicYearFilter({});
    setExamDropdownOpen(false);
    setActiveAction("learning");
    setOpen(true);
  };

  const toggleSubject = (subject) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subject)) {
        const next = prev.filter((s) => s !== subject);
        const copy = { ...subjectYears };
        delete copy[subject];
        setSubjectYears(copy);
        return next;
      }
      if (prev.length >= 9) {
        setErrorModal({
          open: true,
          message: "You can only select up to 9 subjects.",
        });
        return prev;
      }
      return [...prev, subject];
    });
  };

  const setYearForSubject = (subject, year) => {
    setSubjectYears((prev) => ({ ...prev, [subject]: year }));
  };

  const toggleTopic = (subject, topic) => {
    setSelectedTopics((prev) => {
      const arr = prev[subject] ? [...prev[subject]] : [];
      const exists = arr.includes(topic);
      const next = exists ? arr.filter((t) => t !== topic) : [...arr, topic];
      return { ...prev, [subject]: next };
    });
  };

  const setTopicYear = (subject, val) => {
    setTopicYearFilter((prev) => ({ ...prev, [subject]: val }));
  };

  const handleStart = () => {
    if (selectMode === "subject" && selectedSubjects.length === 0) {
      setErrorModal({ open: true, message: "Please select at least one subject." });
      return;
    }

    if (
      selectMode === "topic" &&
      !Object.values(selectedTopics).some(
        (arr) => Array.isArray(arr) && arr.length > 0
      )
    ) {
      setErrorModal({ open: true, message: "Please select at least one topic." });
      return;
    }

    const resolvedSubjectYears = { ...subjectYears };
    Object.entries(resolvedSubjectYears).forEach(([sub, year]) => {
      if (String(year).toLowerCase() === "random") {
        const pick = YEARS[Math.floor(Math.random() * YEARS.length)];
        resolvedSubjectYears[sub] = String(pick);
      }
    });

    const resolvedTopicYears = { ...topicYearFilter };
    Object.entries(resolvedTopicYears).forEach(([sub, val]) => {
      if (String(val).toLowerCase() === "random") {
        const pick = YEARS[Math.floor(Math.random() * YEARS.length)];
        resolvedTopicYears[sub] = String(pick);
      }
    });

    const payload = {
      exam: selectedExam,
      mode: selectMode,
      subjects: selectMode === "subject" ? selectedSubjects : undefined,
      subjectYears: selectMode === "subject" ? resolvedSubjectYears : undefined,
      topics: selectMode === "topic" ? selectedTopics : undefined,
      topicYears: selectMode === "topic" ? resolvedTopicYears : undefined,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("studySelections", JSON.stringify(payload));
    setOpen(false);
    navigate("/learning");
  };

  return (
    <div className="flex flex-col space-y-4 py-6">
      <StudyActions
        examDropdownOpen={examDropdownOpen}
        setExamDropdownOpen={setExamDropdownOpen}
        exams={exams}
        onSelectExam={onSelectExam}
        openFor={openFor}
      />

      <StudyDialog
        open={open}
        setOpen={setOpen}
        activeAction={activeAction}
        selectedExam={selectedExam}
        setSelectedExam={setSelectedExam}
        selectMode={selectMode}
        setSelectMode={setSelectMode}
        exams={exams}
        subjectData={subjectData}
        topicData={topicData}
        selectedSubjects={selectedSubjects}
        subjectYears={subjectYears}
        toggleSubject={toggleSubject}
        setYearForSubject={setYearForSubject}
        selectedTopics={selectedTopics}
        toggleTopic={toggleTopic}
        openTopicSubject={openTopicSubject}
        setOpenTopicSubject={setOpenTopicSubject}
        topicYearFilter={topicYearFilter}
        setTopicYear={setTopicYear}
        handleStart={handleStart}
      />

      {/* 🔹 Error Modal */}
      {errorModal.open && (
        <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
          <div className="bg-white dark:background rounded-2xl shadow-xl w-[90%] max-w-sm p-6 text-center border border-indigo-200 dark:border-indigo-800">
            <h2 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400 mb-2">
              Notice
            </h2> 
            <p className="text-gray-700 dark:text-gray-300 mb-5">
              {errorModal.message}
            </p>
            <button
              onClick={() => setErrorModal({ open: false, message: "" })}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg transition-all"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
