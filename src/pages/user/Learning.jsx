import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, ChevronLeft, ChevronRight, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import PageNav from "../../components/DashboardComponents/PageNav";
import useAuthStore from "../../store/authStore";
import { dummySubjects, dummyTopics } from "../../components/DashboardComponents/user/dummyData"; 

export default function CBTLearningPage() {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth(); 
  }, []);

  const navigate = useNavigate();
  const [studyData, setStudyData] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [expandedSubject, setExpandedSubject] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [navProps, setNavProps] = useState({
    exams: "",
    mood: ""
  });
  useEffect(() => {
    const raw = localStorage.getItem("studySelections");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setStudyData(parsed);
      console.log("Parsed study data:", parsed);
  
      // Extract exam type and mode for the navbar
      const examType = parsed.exam || "JAMB";
      let studyMode = "Learning";
      
      if (parsed.mode === "topic" || parsed.mode === "subject") {
        studyMode = "Learning";
      } 
  
      setNavProps({
        exams: examType,
        mood: studyMode
      });
  
      const firstCourse =
        parsed.mode === "topic"
          ? Object.entries(parsed.topics)
              .flatMap(([subject, topics]) => topics.map((topic) => ({ subject, topic })))[0]
          : parsed.mode === "subject"
          ? { subject: parsed.subjects[0] }
          : null;
  
      if (firstCourse) setSelectedCourse(firstCourse);
    } catch {
      setStudyData(null);
    }
  }, []);

  // Function to get questions based on selected course
  const getQuestions = () => {
    if (!selectedCourse) return [];

    const { subject, topic } = selectedCourse;
    
    // Find the subject in dummySubjects
    const subjectData = dummySubjects.find(s => s.name === subject);
    
    if (!subjectData) return [];

    // If topic mode and topic is selected, filter questions by topic
    if (topic && studyData?.mode === "topic") {
      // Find the topic in dummyTopics to get topicId
      const topicData = dummyTopics.find(t => t.name === topic && t.module?.name === subjectData.module?.find(m => m.name)?.name);
      
      if (topicData) {
        return subjectData.question.filter(q => q.topicId === topicData.id);
      }
    }
    
    // If subject mode or no specific topic, return all questions for the subject
    return subjectData.question || [];
  };

  const questions = getQuestions();

  const handleSelectOption = (option) => setSelectedOption(option);

  // NEXT QUESTION WITH AUTO-MOVE TO NEXT TOPIC/SUBJECT
  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowExplanation(false);
      return;
    }

    // AUTO MOVE TO NEXT SUBJECT/TOPIC
    const queue = [];

    if (studyData.mode === "topic") {
      Object.entries(studyData.topics).forEach(([subject, topics]) => {
        topics.forEach((topic) => queue.push({ subject, topic }));
      });
    } else {
      studyData.subjects.forEach((subject) => queue.push({ subject }));
    }

    const currentIndex = queue.findIndex(
      (item) =>
        item.subject === selectedCourse.subject &&
        (item.topic || null) === (selectedCourse.topic || null)
    );

    if (queue[currentIndex + 1]) {
      setSelectedCourse(queue[currentIndex + 1]);
      setCurrentQuestion(0);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedOption(null);
      setShowExplanation(false);
    }
  };

  if (!studyData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-900">
        <p className="text-gray-600 dark:text-gray-400 text-center text-lg">
          No study selections found — please set up your study first.
        </p>
      </div>
    );
  }

  return (
    <section>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 pb-20">

        {/* TOP NAV */}
        <div className="w-full fixed top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-300 dark:border-gray-700 shadow-sm">
          <div className=" ">
          <PageNav exams={navProps.exams} mood={navProps.mood} />
          </div>
          {/* <hr /> */}

          {/* SUBJECTS ROW */}
          <div className="relative">
            <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 py-2">
              {studyData.mode === "topic" && studyData.topics
                ? Object.keys(studyData.topics).map((subject) => {
                    const isSelected = selectedCourse?.subject === subject && !selectedCourse?.topic;
                    return (
                      <button
                        key={subject}
                        onClick={() => {
                          setExpandedSubject(expandedSubject === subject ? null : subject);
                          setSelectedCourse({ subject });
                          setCurrentQuestion(0);
                          setSelectedOption(null);
                        }}
                        title="Select subject"
                        className={`flex-shrink-0 px-4 py-2 rounded font-semibold whitespace-nowrap transition ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-md flex-1 text-center"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {subject} ▼
                      </button>
                    );
                  })
                : studyData.subjects?.map((subject) => {
                    const isSelected = selectedCourse?.subject === subject;
                    return (
                      <button
                        key={subject}
                        onClick={() => {
                          setSelectedCourse({ subject });
                          setCurrentQuestion(0);
                          setSelectedOption(null);
                        }}
                        title="Select subject"
                        className={`flex-shrink-0 px-4 py-2 rounded-md font-semibold whitespace-nowrap transition ${
                          isSelected
                            ? "bg-blue-600 text-white shadow-md flex-1 text-center"
                            : "bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-700"
                        }`}
                      >
                        {subject}
                      </button>
                    );
                  })}
            </div>

            {/* FLOATING TOPIC DROPDOWN */}
            {expandedSubject && studyData.topics?.[expandedSubject] && (
              <div className="absolute left-4 mt-1 bg-white dark:bg-gray-900 p-4 rounded-lg shadow-2xl z-[300] w-56">
                <h4 className="text-sm font-semibold mb-2">Topics</h4>

                <div className="flex flex-col gap-2">
                  {studyData.topics[expandedSubject].map((topic) => (
                    <button
                      key={topic}
                      onClick={() => {
                        setSelectedCourse({ subject: expandedSubject, topic });
                        setCurrentQuestion(0);
                        setSelectedOption(null);
                        setExpandedSubject(null);
                      }}
                      title="Select topic"
                      className={`px-3 py-2 rounded-lg text-sm transition text-left ${
                        selectedCourse?.topic === topic
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="max-w-6xl mx-auto px-4 pt-32 py-8">

          <div className="py-2 px-6 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-200 dark:border-blue-700">
            <span className="text-red-600 dark:text-blue-400 font-semibold text-xl">
              {user?.firstName
                ? user.firstName.charAt(0).toUpperCase() + user.firstName.slice(1).toLowerCase()
                : "User"}{" "}
              <span className="text-primary-hover dark:text-blue-400 font-semibold text-xl">is in Learning Mode</span>
            </span>
          </div>

          <div className="w-full flex justify-end mt-2">
            <button
              onClick={() => navigate("/user/dashboard")}
              title="Return to your dashboard"
              className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 underline text-white px-2 py-1 rounded-md text-[10px] font-semibold"
            >
              <ArrowLeft size={18} />
              Return to Dashboard
            </button>
          </div>

          {!selectedCourse && (
            <p className="text-center text-gray-500 mt-4">Choose a topic to begin.</p>
          )}

          {selectedCourse && (
            <div className="max-w-3xl mx-auto mt-4">
              {questions.length > 0 ? (
                <>
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">

                    <h3 className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-4">
                      {selectedCourse.topic || selectedCourse.subject}
                    </h3>

                    <p className="text-md font-medium mb-6">{questions[currentQuestion].text}</p>

                    <div className="space-y-3">
                      {questions[currentQuestion].options.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(opt)}
                          title="Select this answer"
                          className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg transition-all duration-200 ${
                            selectedOption === opt
                              ? "border-blue-600 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300"
                              : "border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                          }`}
                        >
                          <span>{opt}</span>
                          {selectedOption === opt && <CheckCircle className="w-5 h-5 text-blue-600" />}
                        </button>
                      ))}
                    </div>

                    {/* EXPLANATION SECTION */}
                    <div className="mt-6">
                      <button
                        onClick={() => setShowExplanation(!showExplanation)}
                        className="text-blue-600 dark:text-blue-400 underline text-sm"
                        title="Show explanation"
                      >
                        {showExplanation ? "Hide Explanation" : "Show Explanation"}
                      </button>

                      {showExplanation && (
                        <div className="mt-3 p-3 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-sm text-gray-700 dark:text-gray-300">
                          {/* Since the dummy data doesn't have explanations, we'll show a placeholder */}
                          {questions[currentQuestion].explanation || 
                            `This question is from ${questions[currentQuestion].year} ${questions[currentQuestion].category} exam. Difficulty: ${questions[currentQuestion].difficulty}.`}
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
                      Question {currentQuestion + 1} of {questions.length}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-8 max-w-3xl mx-auto">
                    <button
                      onClick={prevQuestion}
                      disabled={currentQuestion === 0}
                      title="Previous question"
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition disabled:opacity-50"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>

                    <button
                      onClick={nextQuestion}
                      disabled={currentQuestion === questions.length - 1}
                      title="Next question"
                      className="flex items-center gap-2 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">No questions available for this topic yet.</p>
              )}
            </div>
          )}
        </main>
      </div>

      {/* FLOATING CHAT ICON */}
      <button
        title="Need help?"
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition z-[500]"
      >
        💬
      </button>

    </section>
  );
}