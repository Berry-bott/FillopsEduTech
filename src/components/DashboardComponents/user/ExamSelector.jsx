// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import StudyActions from "./StudyActions";
// import StudyDialog from "./StudyDialog";
// import { useToast } from "@/components/ui/use-toast";



// export default function ExamSelector() {
//   const navigate = useNavigate();
//   const { toast } = useToast();
//   const [open, setOpen] = useState(false);
//   const [examDropdownOpen, setExamDropdownOpen] = useState(false);
//   const [activeAction, setActiveAction] = useState(null);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [selectMode, setSelectMode] = useState(null);

//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [subjectYears, setSubjectYears] = useState({});
//   const [subjectData, setSubjectData] = useState([]);

//   const [selectedTopics, setSelectedTopics] = useState({});
//   const [topicYears, setTopicYears] = useState({});
//   const [topicData, setTopicData] = useState({});
//   const [openTopicSubject, setOpenTopicSubject] = useState(null);

//   const [questions, setQuestions] = useState({});

//   const exams = ["WAEC", "JAMB", "NECO", "PUTME"];



//   const resetSelections = (keepExam = false) => {
//     if (!keepExam) setSelectedExam(null); // optional reset of exam
//     setSelectMode(null);
//     setSelectedSubjects([]);
//     setSubjectYears({});
//     setSelectedTopics({});
//     setTopicYears({});
//     setSubjectData([]);
//     setTopicData({});
//     setOpenTopicSubject(null);
//     setQuestions({});
//   };
  

//   const onSelectExam = (exam) => {
//     setSelectedExam(exam);  // save exam
//     setSelectMode(null);     // reset selection mode
//     setOpen(true);   
//     setActiveAction("study");       // open modal
//   };

//   const openFor = (action) => {
//     setActiveAction(action);
//     resetSelections();  // 🔹 reset every selection
//     setSelectMode(null); // reset mode
//     setSelectedExam(null); // reset exam if you want full reset
//     setOpen(true);
//   };
  

//   React.useEffect(() => {
//     if (open) {
//       resetSelections(true); // keep selectedExam if already chosen
//     }
//   }, [open]);


//   // ---------- HANDLE START ----------  
//   const handleStart = () => {
//     // ✅ Validation
//     if (selectMode === "subject" && selectedSubjects.length === 0) return;
//     if (
//       selectMode === "topic" &&
//       !Object.values(selectedTopics).some((arr) => arr.length > 0)
//     )
//       return;


//     const payload = {
//       exam: selectedExam,
//       mode: selectMode,
//       subjects: selectMode === "subject" ? selectedSubjects : undefined,
//       subjectYears: selectMode === "subject" ? subjectYears : undefined,
//       topics: selectMode === "topic" ? selectedTopics : undefined,
//       topicYears: selectMode === "topic" ? topicYears : undefined,
//       questions,
//       timestamp: new Date().toISOString(),
//     };

//     localStorage.setItem("studySelections", JSON.stringify(payload));
//     setOpen(false);

//     if (activeAction === "study") navigate("/study");
//     if (activeAction === "exam") navigate("/exam");
//   };

  
//   const clearAllTopics = () => {
//     setSelectedTopics({});
//   };

//   return (
//     <div className="flex flex-col space-y-4 py-6">
//      <StudyActions
//       examDropdownOpen={examDropdownOpen}
//       setExamDropdownOpen={setExamDropdownOpen}
//       exams={exams}
//       onSelectExam={onSelectExam} 
//       openFor={openFor}
//     />

//       <StudyDialog
//       open={open}
//       setOpen={setOpen}
//       activeAction={activeAction}
//       selectedExam={selectedExam}
//       setSelectedExam={setSelectedExam}
//       selectMode={selectMode}
//       setSelectMode={setSelectMode}
//       exams={exams}
//       subjectData={subjectData}
//       topicData={topicData}
//       selectedSubjects={selectedSubjects}
//       subjectYears={subjectYears}
//       topicYears={topicYears}
//       selectedTopics={selectedTopics}
//       clearAllTopics={clearAllTopics}
//       toggleSubject={(id) => {
//         if (selectedSubjects.includes(id)) {
//           // Deselect
//           setSelectedSubjects(prev => prev.filter(x => x !== id));
//         } else if (selectedSubjects.length < 9) {
//           // Add subject if under limit
//           setSelectedSubjects(prev => [...prev, id]);
//         } else {
//           // Show toast safely outside setState
//           toast({
//             title: "Limit reached",
//             description: "You can select up to 9 or 4 subjects only",
//             variant: "destructive",
//             className: "z-[9999]", // ensures it appears above modals
//           });
//         }
//       }}

//       toggleTopic={(subjectId, topicId) => {
//         setSelectedTopics(prev => {
//           const arr = prev[subjectId] || [];
//           const exists = arr.includes(topicId);
//           return { 
//             ...prev, 
//             [subjectId]: exists ? arr.filter(x => x !== topicId) : [...arr, topicId] 
//           };
//         });
//       }}

//       setYearForSubject={(subId, year) =>
//         setSubjectYears(prev => ({ ...prev, [subId]: year }))
//       }
//       setTopicYear={(topicId, year) =>
//         setTopicYears(prev => ({ ...prev, [topicId]: year }))
//       }

//       openTopicSubject={openTopicSubject}
//       setOpenTopicSubject={setOpenTopicSubject}
//       handleStart={handleStart}
//       />

//     </div>
//   );
// }





import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudyActions from "./StudyActions";
import StudyDialog from "./StudyDialog";
import { useToast } from "@/components/ui/use-toast";
import BotChat from "../../../chat-bot/BotChat"



export default function ExamSelector() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectMode, setSelectMode] = useState(null);

  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectYears, setSubjectYears] = useState({});
  const [subjectData, setSubjectData] = useState([]);

  const [selectedTopics, setSelectedTopics] = useState({});
  const [topicYears, setTopicYears] = useState({});
  const [topicData, setTopicData] = useState({});
  const [openTopicSubject, setOpenTopicSubject] = useState(null);

  const [questions, setQuestions] = useState({});

  const exams = ["WAEC", "JAMB", "NECO", "PUTME"];

  const resetSelections = (keepExam = false) => {
    if (!keepExam) setSelectedExam(null);
    setSelectMode(null);
    setSelectedSubjects([]);
    setSubjectYears({});
    setSelectedTopics({});
    setTopicYears({});
    setSubjectData([]);
    setTopicData({});
    setOpenTopicSubject(null);
    setQuestions({});
  };

  // ✅ NEW: Function to clear all topic selections (for TopicSelector callback)
  const clearAllTopicSelections = () => {
    setSelectedTopics({});
    setTopicYears({});
  };

  const onSelectExam = (exam) => {
    setSelectedExam(exam);
    setSelectMode(null);
    setOpen(true);   
    setActiveAction("study");
  };

  const openFor = (action) => {
    setActiveAction(action);
    resetSelections();
    setSelectMode(null);
    setSelectedExam(null);
    setOpen(true);
  };

  React.useEffect(() => {
    if (open) {
      resetSelections(true);
    }
  }, [open]);

  const handleStart = () => {
    if (selectMode === "subject" && selectedSubjects.length === 0) return;
    if (
      selectMode === "topic" &&
      !Object.values(selectedTopics).some((arr) => arr.length > 0)
    )
      return;

    const payload = {
      exam: selectedExam,
      mode: selectMode,
      subjects: selectMode === "subject" ? selectedSubjects : undefined,
      subjectYears: selectMode === "subject" ? subjectYears : undefined,
      topics: selectMode === "topic" ? selectedTopics : undefined,
      topicYears: selectMode === "topic" ? topicYears : undefined,
      questions,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("studySelections", JSON.stringify(payload));
    setOpen(false);

    if (activeAction === "study") navigate("/study");
    if (activeAction === "exam") navigate("/exam");
  };

  const clearAllTopics = () => {
    setSelectedTopics({});
  };

  return (
    <div className="flex flex-col space-y-4 py-6">
              <BotChat/>
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
        topicYears={topicYears}
        selectedTopics={selectedTopics}
        clearAllTopics={clearAllTopics}
        onClearTopicSelections={clearAllTopicSelections} // ✅ Pass the callback
        toggleSubject={(id) => {
          if (selectedSubjects.includes(id)) {
            setSelectedSubjects(prev => prev.filter(x => x !== id));
          } else if (selectedSubjects.length < 9) {
            setSelectedSubjects(prev => [...prev, id]);
          } else {
            toast({
              title: "Limit reached",
              description: "You can select up to 9 or 4 subjects only",
              variant: "destructive",
              className: "z-[9999]",
            });
          }
        }}

        toggleTopic={(subjectId, topicId) => {
          // ✅ Handle the special 'CLEAR_SUBJECT' case
          if (topicId === 'CLEAR_SUBJECT') {
            setSelectedTopics(prev => {
              const updated = { ...prev };
              delete updated[subjectId];
              return updated;
            });
            return;
          }

          setSelectedTopics(prev => {
            const arr = prev[subjectId] || [];
            const exists = arr.includes(topicId);
            return { 
              ...prev, 
              [subjectId]: exists ? arr.filter(x => x !== topicId) : [...arr, topicId] 
            };
          });
        }}

        setYearForSubject={(subId, year) =>
          setSubjectYears(prev => ({ ...prev, [subId]: year }))
        }
        setTopicYear={(topicId, year) =>
          setTopicYears(prev => ({ ...prev, [topicId]: year }))
        }

        openTopicSubject={openTopicSubject}
        setOpenTopicSubject={setOpenTopicSubject}
        handleStart={handleStart}
      />
    </div>
  );
}