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
      if (prev.length >= 4) {
        setErrorModal({
          open: true,
          message: "You can only select up to 4 subjects.",
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
  
    // 🔹 Resolve random years for subjects
    const resolvedSubjectYears = { ...subjectYears };
    Object.entries(resolvedSubjectYears).forEach(([sub, year]) => {
      if (String(year).toLowerCase() === "random") {
        const pick = YEARS[Math.floor(Math.random() * YEARS.length)];
        resolvedSubjectYears[sub] = String(pick);
      }
    });
  
    // 🔹 Resolve random years for topics
    const resolvedTopicYears = { ...topicYearFilter };
    Object.entries(resolvedTopicYears).forEach(([sub, val]) => {
      if (String(val).toLowerCase() === "random") {
        const pick = YEARS[Math.floor(Math.random() * YEARS.length)];
        resolvedTopicYears[sub] = String(pick);
      }
    });
  
    // 🔹 Keep only the subject that has selected topics
    const selectedSubjectWithTopics = Object.keys(selectedTopics).find(
      (sub) => selectedTopics[sub]?.length > 0
    );
  
    const filteredTopics =
      selectedSubjectWithTopics
        ? { [selectedSubjectWithTopics]: selectedTopics[selectedSubjectWithTopics] }
        : {};
  
    const payload = {
      exam: selectedExam,
      mode: selectMode,
      subjects: selectMode === "subject" ? selectedSubjects : undefined,
      subjectYears: selectMode === "subject" ? resolvedSubjectYears : undefined,
      topics: selectMode === "topic" ? filteredTopics : undefined,
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
