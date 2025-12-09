import { useState } from "react";
// import PageNav from "../../components/DashboardComponents/PageNav";
import useAuthStore from "../../store/authStore";

import Header from "../../components/DashboardComponents/user/study-component/subjectHeader";
import QuestionCard from "../../components/DashboardComponents/user/study-component/QuestionCard";
// import ProgressBar from "./ProgressBar";

export default function QuizPage() {
  const { accessToken } = useAuthStore();

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [subjectNames, setSubjectNames] = useState({});
  const [topicNames, setTopicNames] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  // onFinishSubject()


  const saved = JSON.parse(localStorage.getItem("studySelections"));
  if (!saved) return <p>No study selections found.</p>;

  const q = questions[currentIndex];

  const handleNextSubject = () => {
    console.log("Subject finished — moving to next");
  
    // 🚀 switch to the next subject or topic
    goToNextSubjectOrTopic();
  };

  
  const handleFinishSubject = () => {
    // Find current index of active subject in the list
    const subjectList = saved.mode === "subject" ? saved.subjects : Object.keys(saved.topics);
    const currentSubjectIndex = subjectList.indexOf(activeId);
  
    if (currentSubjectIndex < subjectList.length - 1) {
      // Move to next subject/topic
      const nextSubjectId = subjectList[currentSubjectIndex + 1];
      setActiveId(nextSubjectId);
  
      if (saved.mode === "subject") {
        fetchQuestions("subjects", nextSubjectId, saved.subjectYears?.[nextSubjectId]);
      } else {
        fetchQuestions("topics", nextSubjectId, saved.topicYears?.[nextSubjectId]);
      }
  
      setCurrentIndex(0); // reset question index
    } else {
      // All subjects/topics completed
      alert("🎉 Congratulations! You finished all subjects.");
    }
  };
  

  return (
    <div className="p-4">
 

      <Header
        saved={saved}
        activeId={activeId}
        setActiveId={setActiveId}
        setQuestions={setQuestions}
        setLoading={setLoading}
        subjectNames={subjectNames}
        setSubjectNames={setSubjectNames}
        topicNames={topicNames}
        setTopicNames={setTopicNames}
        accessToken={accessToken}
        setCurrentIndex={setCurrentIndex}
      />

      {/* <ProgressBar current={currentIndex + 1} total={questions.length} /> */}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
        <p>Loading...</p>
      </div>
      ) : (
        <QuestionCard
        q={questions[currentIndex]}
        currentIndex={currentIndex}
        total={questions.length}
        selectedOptions={selectedOptions}
        setSelectedOptions={setSelectedOptions}
        setCurrentIndex={setCurrentIndex}
        onFinishSubject={handleFinishSubject}
      />
      
      )}
    </div>
  );
}
