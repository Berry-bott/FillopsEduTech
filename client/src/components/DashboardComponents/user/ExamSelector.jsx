

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

  const exams = ["WAEC", "JAMB", "NECO", /* "PUTME" */];

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
        onClearTopicSelections={clearAllTopicSelections} 
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
            
            // ✅ NEW: Check if we've already selected 4 topics for this subject
            const topicCount = arr.length;
            const maxTopicsPerSubject = 4;
            
            if (exists) {
              // User is clicking to deselect - allow it
              return { 
                ...prev, 
                [subjectId]: arr.filter(x => x !== topicId) 
              };
            }
            
            if (topicCount >= maxTopicsPerSubject) {
              toast({
                title: "Limit reached",
                description: `You can select up to ${maxTopicsPerSubject} topics`,
                variant: "destructive",
                className: "z-[9999]",
              });
              return prev;
            }
            
            // ✅ NEW: When selecting a topic from a new subject, 
            // clear previously selected topics from other subjects
            // to enforce "one topic subject per time" rule
            // If selecting from a different subject than currently selected, clear others
            const selectedSubjectKeys = Object.keys(prev);
            const alreadyHasSelectedSubject = selectedSubjectKeys.find(
              (key) => prev[key] && prev[key].length > 0
            );
            
            // If user is clicking on a different subject than the one already selected
            if (alreadyHasSelectedSubject && alreadyHasSelectedSubject !== subjectId) {
              // Clear all other subjects' topics, keep only the current subject's topics
              const newSelectedTopics = {};
              selectedSubjectKeys.forEach((key) => {
                if (key === subjectId) {
                  newSelectedTopics[subjectId] = [...arr, topicId];
                } else {
                  newSelectedTopics[key] = []; // Clear topics for other subjects
                }
              });
              // If the subject was completely new (not in prev), just set it
              if (!newSelectedTopics[subjectId]) {
                newSelectedTopics[subjectId] = [topicId];
              }
              return newSelectedTopics;
            }
            
            return { 
              ...prev, 
              [subjectId]: [...arr, topicId] 
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