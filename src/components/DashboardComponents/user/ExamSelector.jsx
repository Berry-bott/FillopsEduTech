// // src/components/ExamSelector/ExamSelector.jsx
// import React, { useState, useRef, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import StudyActions from "./StudyActions";
// import StudyDialog from "./StudyDialog";
// import useAuthStore from "../../../store/authStore";

// export default function ExamSelector() {
//   const navigate = useNavigate();
//   const { accessToken } = useAuthStore();
//   const tokenRef = useRef(accessToken);

//   useEffect(() => {
//     console.log("Token updated:", accessToken);
//   }, [accessToken]);

//   const [open, setOpen] = useState(false);
//   const [examDropdownOpen, setExamDropdownOpen] = useState(false);
//   const [activeAction, setActiveAction] = useState(null);
//   const [selectedExam, setSelectedExam] = useState(null);
//   const [selectMode, setSelectMode] = useState(null);

//   const [selectedSubjects, setSelectedSubjects] = useState([]);
//   const [subjectYears, setSubjectYears] = useState({});
//   const [subjectData, setSubjectData] = useState([]);
//   const [loadingSubjects, setLoadingSubjects] = useState(false);
//   const [apiError, setApiError] = useState(null);

//   const [selectedTopics, setSelectedTopics] = useState({});
//   const [topicYearFilter, setTopicYearFilter] = useState({});
//   const [topicData, setTopicData] = useState({});
//   const [topicYears, setTopicYears] = useState({});
//   const [loadingTopics, setLoadingTopics] = useState({});
//   const [openTopicSubject, setOpenTopicSubject] = useState(null);

//   const [errorModal, setErrorModal] = useState({ open: false, message: "" });
//   const [questions, setQuestions] = useState({}); // <-- needed for saving questions

//   const exams = ["WAEC", "JAMB", "NECO", "PUTME"];

//   const resetSelections = () => {
//     setSelectedExam(null);
//     setSelectMode(null);
//     setSelectedSubjects([]);
//     setSubjectYears({});
//     setSelectedTopics({});
//     setTopicYearFilter({});
//     setSubjectData([]);
//     setTopicData({});
//     setTopicYears({});
//     setApiError(null);
//     setLoadingSubjects(false);
//   };

//   const openFor = (action) => {
//     setActiveAction(action);
//     resetSelections();
//     setOpen(true);
//     setExamDropdownOpen(false);
//   };

//   // FETCH SUBJECTS
//   const onSelectExam = async (ex) => {
//     if (!accessToken) {
//       setApiError("You are not authenticated.");
//       return;
//     }

//     resetSelections();
//     setSelectedExam(ex);
//     setActiveAction("learning");
//     setOpen(true);
//     setLoadingSubjects(true);

//     try {
//       const res = await fetch(
//         `https://fillops-server-5fuf.onrender.com/api/subjects?category=${ex}`,
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );

//       if (!res.ok) throw new Error("Failed to fetch subjects");

//       const data = await res.json();
//       setSubjectData(data);
//     } catch (error) {
//       setApiError("Unable to load subjects");
//       setSubjectData([]);
//     } finally {
//       setLoadingSubjects(false);
//     }
//   };

//    // SET YEAR FOR SUBJECT + FETCH QUESTIONS
//    const setYearForSubject = async (subjectId, year) => {
//     setSubjectYears((prev) => ({ ...prev, [subjectId]: year }));

//     try {
//       const response = await fetch(
//         `https://fillops-server-5fuf.onrender.com/api/subjects/${subjectId}/questions?category=WAEC&year=${year}`
//       );

//       if (!response.ok) throw new Error("Failed to fetch questions");

//       const qs = await response.json();

//       setQuestions((prev) => ({
//         ...prev,
//         [subjectId]: qs,
//       }));
//     } catch (error) {
//       console.log(error);
//     }
//   };

  

//   // FETCH TOPICS
//   const fetchSubjectsFromTopics = async () => {
//     if (!accessToken) return;
  
//     try {
//       const res = await fetch(`https://fillops-server-5fuf.onrender.com/api/topics`, {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       });
//       console.log(res);
      
//       if (!res.ok) throw new Error("Failed to fetch topics");
//       const allTopics = await res.json();
  
//       // Extract unique subjects
//       const subjectsMap = {};
//       allTopics.forEach((t) => {
//         if (t.subject && !subjectsMap[t.subject.id]) {
//           subjectsMap[t.subject.id] = t.subject;
//         }
//       });
//       console.log(`this is the topics ${subjectsMap}`);
      
  
//       const subjectsArray = Object.values(subjectsMap);
//       setSubjectData({ data: subjectsArray }); // match your StudyDialog structure
//     } catch (err) {
//       console.error("Error fetching subjects from topics:", err);
//       setSubjectData({ data: [] });
//     }
//   };

//   const fetchTopicsForSubject = async (subjectId) => {
//     if (!accessToken) return;
  
//     setLoadingTopics((prev) => ({ ...prev, [subjectId]: true }));
  
//     try {
//       const res = await fetch(
//         `https://fillops-server-5fuf.onrender.com/api/topics?subjectId=${subjectId}`,
//         { headers: { Authorization: `Bearer ${accessToken}` } }
//       );
//       if (!res.ok) throw new Error("Failed to fetch topics");
  
//       const topics = await res.json();
//       setTopicData((prev) => ({ ...prev, [subjectId]: topics }));
//       console.log();
      
  
//       // Fetch years per topic
//       const topicYearsObj = {};
//       for (const topic of topics) {
//         try {
//           const questionsRes = await fetch(
//             `https://fillops-server-5fuf.onrender.com/api/topics/${topic.id}/questions?category=${selectedExam}`,
//             { headers: { Authorization: `Bearer ${accessToken}` } }
//           );
//           const questions = await questionsRes.json();
//           topicYearsObj[topic.id] = [...new Set(questions.map((q) => q.year))];
//         } catch {
//           topicYearsObj[topic.id] = [];
//         }
//       }
  
//       setTopicYears((prev) => ({ ...prev, ...topicYearsObj }));
//     } catch (err) {
//       console.error("Error fetching topics for subject:", err);
//       setTopicData((prev) => ({ ...prev, [subjectId]: [] }));
//     } finally {
//       setLoadingTopics((prev) => ({ ...prev, [subjectId]: false }));
//     }
//   };
  

//   // SUBJECT TOGGLE
//   const toggleSubject = (subject) => {
//     setSelectedSubjects((prev) => {
//       if (prev.includes(subject)) {
//         const next = prev.filter((s) => s !== subject);
//         const copy = { ...subjectYears };
//         delete copy[subject];
//         setSubjectYears(copy);
//         return next;
//       }
//       if (prev.length >= 4) {
//         setErrorModal({ open: true, message: "You can only select up to 4 subjects." });
//         return prev;
//       }
//       return [...prev, subject];
//     });
//   };

 

//   const toggleTopic = (subject, topic) => {
//     setSelectedTopics((prev) => {
//       const arr = prev[subject] ? [...prev[subject]] : [];
//       const exists = arr.includes(topic);
//       const next = exists ? arr.filter((t) => t !== topic) : [...arr, topic];
//       return { ...prev, [subject]: next };
//     });
//   };

//   const setTopicYear = (subject, topic, year) => {
//     setTopicYearFilter((prev) => ({
//       ...prev,
//       [subject]: { ...prev[subject], [topic]: year },
//     }));
//   };

//   // ---------- HANDLE START ----------
//   const handleStart = () => {
//     console.log("Starting study session...");

//     // VALIDATION
//     if (selectMode === "subject" && selectedSubjects.length === 0) {
//       setErrorModal({ open: true, message: "Please select at least one subject." });
//       return;
//     }

//     if (
//       selectMode === "topic" &&
//       !Object.values(selectedTopics).some((arr) => Array.isArray(arr) && arr.length > 0)
//     ) {
//       setErrorModal({ open: true, message: "Please select at least one topic." });
//       return;
//     }

//     // BUILD PAYLOAD
//     const payload = {
//       exam: selectedExam,
//       mode: selectMode,
//       subjects: selectMode === "subject" ? selectedSubjects : undefined,
//       subjectYears: selectMode === "subject" ? subjectYears : undefined,
//       topics: selectMode === "topic" ? selectedTopics : undefined,
//       topicYears: selectMode === "topic" ? topicYearFilter : undefined,
//       questions,
//       timestamp: new Date().toISOString(),
//     };

//     console.log("Payload ready:", payload);

//     localStorage.setItem("studySelections", JSON.stringify(payload));
//     setOpen(false);

//     if (activeAction === "study") navigate("/learning");
//     if (activeAction === "quiz") navigate("/quiz");
//     if (activeAction === "exam") navigate("/exams");
//   };

//   // ---------- RETURN UI ----------
//   return (
//     <div className="flex flex-col space-y-4 py-6">
//       <StudyActions
//         examDropdownOpen={examDropdownOpen}
//         setExamDropdownOpen={setExamDropdownOpen}
//         exams={exams}
//         onSelectExam={onSelectExam}
//         openFor={openFor}
//       />

//       <StudyDialog
//         open={open}
//         setOpen={setOpen}
//         activeAction={activeAction}
//         selectedExam={selectedExam}
//         setSelectedExam={setSelectedExam}
//         selectMode={selectMode}
//         setSelectMode={setSelectMode}
//         exams={exams}
//         subjectData={subjectData}
//         topicData={topicData}
//         topicYears={topicYears}
//         selectedSubjects={selectedSubjects}
//         subjectYears={subjectYears}
//         toggleSubject={toggleSubject}
//         setYearForSubject={setYearForSubject}
//         selectedTopics={selectedTopics}
//         toggleTopic={toggleTopic}
//         openTopicSubject={openTopicSubject}
//         setOpenTopicSubject={setOpenTopicSubject}
//         topicYearFilter={topicYearFilter}
//         setTopicYear={setTopicYear}
//         handleStart={handleStart}
//         loadingSubjects={loadingSubjects}
//         loadingTopics={loadingTopics}
//         apiError={apiError}
//         fetchTopicsForSubject={fetchTopicsForSubject}
//       />

//       {errorModal.open && (
//         <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
//           <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-sm p-6 text-center border">
//             <h2 className="text-lg font-semibold text-indigo-600 mb-2">Notice</h2>
//             <p className="text-gray-700 mb-5">{errorModal.message}</p>
//             <button
//               onClick={() => setErrorModal({ open: false, message: "" })}
//               className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg"
//             >
//               OK
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }













import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import StudyActions from "./StudyActions";
import StudyDialog from "./StudyDialog";
import { useToast } from "@/components/ui/use-toast";



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
  const [topicYearFilter, setTopicYearFilter] = useState({});
  const [topicData, setTopicData] = useState({});
  const [openTopicSubject, setOpenTopicSubject] = useState(null);

  const [questions, setQuestions] = useState({});

  const exams = ["WAEC", "JAMB", "NECO", "PUTME"];

  const resetSelections = () => {
    setSelectedExam(null);
    setSelectMode(null);
    setSelectedSubjects([]);
    setSubjectYears({});
    setSelectedTopics({});
    setTopicYearFilter({});
    setSubjectData([]);
    setTopicData({});
    setOpenTopicSubject(null);
    setQuestions({});
  };

  const onSelectExam = (exam) => {
    setSelectedExam(exam);  // save exam
    setSelectMode(null);     // reset selection mode
    setOpen(true);           // open modal
  };

  const openFor = (action) => {
    setActiveAction(action);
    resetSelections();
    setOpen(true);
    setExamDropdownOpen(false);
  };

  const handleStart = () => {
    // ✅ Validation
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
      topicYears: selectMode === "topic" ? topicYearFilter : undefined,
      questions,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem("studySelections", JSON.stringify(payload));
    setOpen(false);

    if (activeAction === "study") navigate("/learning");
    if (activeAction === "quiz") navigate("/quiz");
    if (activeAction === "exam") navigate("/exams");
  };

  
  const clearAllTopics = () => {
    setSelectedTopics({});
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


      {/* <StudyDialog
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
        selectedTopics={selectedTopics}
        clearAllTopics={clearAllTopics}
        toggleSubject={(id) =>
          setSelectedSubjects((prev) => {
            if (prev.includes(id)) {
              return prev.filter((x) => x !== id); // deselect
            } else if (prev.length < 4) {
              return [...prev, id]; // add only if less than 4
            } else {
              // optional: show toast
              toast({
                title: "Limit reached",
                description: "You can select up to 4 subjects only",
                variant: "destructive",
              });
              return prev;
            }
          })
        }
        
        toggleTopic={(subjectId, topicId) => {
          setSelectedTopics((prev) => {
            const arr = prev[subjectId] || [];
            const exists = arr.includes(topicId);
            return { ...prev, [subjectId]: exists ? arr.filter((x) => x !== topicId) : [...arr, topicId] };
          });
        }}
        
        setYearForSubject={(subId, year) =>
          setSubjectYears((prev) => ({ ...prev, [subId]: year }))
        }
        setTopicYear={(subId, topicId, year) =>
          setTopicYearFilter((prev) => ({
            ...prev,
            [subId]: { ...(prev[subId] || {}), [topicId]: year },
          }))
        }
        openTopicSubject={openTopicSubject}
        setOpenTopicSubject={setOpenTopicSubject}
        handleStart={handleStart}
      /> */}
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
      selectedTopics={selectedTopics}
      clearAllTopics={clearAllTopics}
      toggleSubject={(id) => {
        if (selectedSubjects.includes(id)) {
          // Deselect
          setSelectedSubjects(prev => prev.filter(x => x !== id));
        } else if (selectedSubjects.length < 4) {
          // Add subject if under limit
          setSelectedSubjects(prev => [...prev, id]);
        } else {
          // Show toast safely outside setState
          toast({
            title: "Limit reached",
            description: "You can select up to 4 subjects only",
            variant: "destructive",
            className: "z-[9999]", // ensures it appears above modals
          });
        }
      }}

      toggleTopic={(subjectId, topicId) => {
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
      setTopicYear={(subId, topicId, year) =>
        setTopicYearFilter(prev => ({
          ...prev,
          [subId]: { ...(prev[subId] || {}), [topicId]: year },
        }))
      }
      openTopicSubject={openTopicSubject}
      setOpenTopicSubject={setOpenTopicSubject}
      handleStart={handleStart}
      />

    </div>
  );
}
