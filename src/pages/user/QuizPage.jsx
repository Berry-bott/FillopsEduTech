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

  const saved = JSON.parse(localStorage.getItem("studySelections"));
  if (!saved) return <p>No study selections found.</p>;

  const q = questions[currentIndex];

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
        <p>Loading...</p>
      ) : (
        <QuestionCard
          q={q}
          currentIndex={currentIndex}
          total={questions.length}
          selectedOptions={selectedOptions}
          setSelectedOptions={setSelectedOptions}
          setCurrentIndex={setCurrentIndex}
        />
      )}
    </div>
  );
}
