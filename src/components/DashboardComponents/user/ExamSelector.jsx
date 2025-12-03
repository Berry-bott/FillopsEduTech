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


// src/components/ExamSelector/ExamSelector.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import StudyActions from "./StudyActions";
import StudyDialog from "./StudyDialog";
import useAuthStore from "../../../store/authStore";

/**
 * ExamSelector handles:
 * - Choosing an exam (WAEC, JAMB, etc.)
 * - Loading subjects and topics
 * - Storing user selections
 * - Starting learning / quiz / exam sessions
 */
export default function ExamSelector() {
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();

  // UI State
  const [open, setOpen] = useState(false);
  const [examDropdownOpen, setExamDropdownOpen] = useState(false);
  const [activeAction, setActiveAction] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectMode, setSelectMode] = useState(null);

  // Subject State
  const [subjectData, setSubjectData] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [subjectYears, setSubjectYears] = useState({});
  const [loadingSubjects, setLoadingSubjects] = useState(false);

  // Topic State
  const [topicData, setTopicData] = useState({});
  const [topicYears, setTopicYears] = useState({});
  const [openTopicSubject, setOpenTopicSubject] = useState(null);
  const [selectedTopics, setSelectedTopics] = useState({});
  const [topicYearFilter, setTopicYearFilter] = useState({});
  const [loadingTopics, setLoadingTopics] = useState({});

  const [questions, setQuestions] = useState({});
  const [apiError, setApiError] = useState(null);

  const exams = ["WAEC", "JAMB", "NECO", "PUTME"];

  /** ---------------------------------------------------
   * Reset all selection states
   * --------------------------------------------------- */
  const resetSelections = () => {
    setSelectedSubjects([]);
    setSubjectYears({});
    setSelectedTopics({});
    setTopicYearFilter({});
    setTopicData({});
    setTopicYears({});
    setSubjectData([]);
    setApiError(null);
  };

  /** ---------------------------------------------------
   * Called when user clicks the big STUDY / QUIZ / EXAM button
   * Opens modal and resets previous selection
   * --------------------------------------------------- */
  const openFor = (action) => {
    setActiveAction(action);
    resetSelections();
    setOpen(true);
    setExamDropdownOpen(false);
  };

  /** ---------------------------------------------------
   * When user selects an exam → fetch all subjects
   * --------------------------------------------------- */
  const onSelectExam = async (exam) => {
    if (!accessToken) return setApiError("Not authenticated.");

    resetSelections();
    setSelectedExam(exam);
    setLoadingSubjects(true);

    try {
      const res = await fetch(
        `https://fillops-server-5fuf.onrender.com/api/subjects?category=${exam}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch subjects");

      setSubjectData(await res.json());
    } catch {
      setApiError("Failed to load subjects");
    } finally {
      setLoadingSubjects(false);
    }
  };

  /** ---------------------------------------------------
   * When user selects a year for a subject → fetch Q&A
   * --------------------------------------------------- */
  const setYearForSubject = async (subjectId, year) => {
    setSubjectYears((prev) => ({ ...prev, [subjectId]: year }));

    try {
      const res = await fetch(
        `https://fillops-server-5fuf.onrender.com/api/subjects/${subjectId}/questions?category=${selectedExam}&year=${year}`
      );

      if (res.ok) {
        const data = await res.json();
        setQuestions((prev) => ({ ...prev, [subjectId]: data }));
      }
    } catch (err) {
      console.log(err);
    }
  };

  /** ---------------------------------------------------
   * Fetch topics for a subject on hover
   * --------------------------------------------------- */
  const fetchTopicsForSubject = async (subjectId) => {
    if (!accessToken) return;

    setLoadingTopics((prev) => ({ ...prev, [subjectId]: true }));

    try {
      const res = await fetch(
        `https://fillops-server-5fuf.onrender.com/api/topics?subjectId=${subjectId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      if (!res.ok) throw new Error("Failed to fetch topics");

      const topics = await res.json();
      setTopicData((prev) => ({ ...prev, [subjectId]: topics }));

      // Fetch available years for each topic
      const yearsObj = {};
      for (let topic of topics) {
        try {
          const qRes = await fetch(
            `https://fillops-server-5fuf.onrender.com/api/topics/${topic.id}/questions?category=${selectedExam}`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          );

          const qData = await qRes.json();
          yearsObj[topic.id] = [...new Set(qData.map((q) => q.year))];
        } catch {
          yearsObj[topic.id] = [];
        }
      }

      setTopicYears((prev) => ({ ...prev, ...yearsObj }));
    } catch (err) {
      console.log(err);
      setTopicData((prev) => ({ ...prev, [subjectId]: [] }));
    } finally {
      setLoadingTopics((prev) => ({ ...prev, [subjectId]: false }));
    }
  };

  /** ---------------------------------------------------
   * Toggle subject selection (max 4)
   * --------------------------------------------------- */
  const toggleSubject = (subjectId) => {
    setSelectedSubjects((prev) => {
      if (prev.includes(subjectId)) return prev.filter((id) => id !== subjectId);
      if (prev.length >= 4) return prev;
      return [...prev, subjectId];
    });
  };

  /** ---------------------------------------------------
   * Toggle topic selection
   * Restriction: Topics can only be selected from ONE subject at a time
   * --------------------------------------------------- */
  const toggleTopic = (subjectId, topicId) => {
    setSelectedTopics((prev) => {
      const currentlySelectedSubject = Object.keys(prev).find(
        (s) => prev[s]?.length > 0
      );

      // If user tries selecting topics from a 2nd subject → block
      if (currentlySelectedSubject && currentlySelectedSubject !== subjectId)
        return prev;

      const list = prev[subjectId] || [];
      const newList = list.includes(topicId)
        ? list.filter((id) => id !== topicId)
        : [...list, topicId];

      return { ...prev, [subjectId]: newList };
    });
  };

  /** ---------------------------------------------------
   * Set year filter for topics of a subject
   * --------------------------------------------------- */
  const setTopicYear = (subjectId, topicId, year) => {
    setTopicYearFilter((prev) => ({
      ...prev,
      [subjectId]: { ...(prev[subjectId] || {}), [topicId]: year },
    }));
  };

  /** ---------------------------------------------------
   * User clicks START → generate payload → navigate
   * --------------------------------------------------- */
  const handleStart = () => {
    const payload = {
      exam: selectedExam,
      mode: selectMode,
      subjects: selectedSubjects,
      subjectYears,
      topics: selectedTopics,
      topicYears: topicYearFilter,
      questions,
    };

    localStorage.setItem("studySelections", JSON.stringify(payload));

    if (activeAction === "study") navigate("/learning");
    if (activeAction === "quiz") navigate("/quiz");
    if (activeAction === "exam") navigate("/exams");

    setOpen(false);
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
        selectedSubjects={selectedSubjects}
        toggleSubject={toggleSubject}
        subjectYears={subjectYears}
        setYearForSubject={setYearForSubject}
        topicData={topicData}
        topicYears={topicYears}
        selectedTopics={selectedTopics}
        toggleTopic={toggleTopic}
        openTopicSubject={openTopicSubject}
        setOpenTopicSubject={setOpenTopicSubject}
        topicYearFilter={topicYearFilter}
        setTopicYear={setTopicYear}
        loadingSubjects={loadingSubjects}
        loadingTopics={loadingTopics}
        fetchTopicsForSubject={fetchTopicsForSubject}
        handleStart={handleStart}
      />
    </div>
  );
}
