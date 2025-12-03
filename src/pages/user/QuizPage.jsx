import PageNav from "../../components/DashboardComponents/PageNav";
import React, { useEffect, useState, useRef } from "react";

export default function QuizPage() {
  const [navProps, setNavProps] = useState({
    exams: "",
    mood: ""
  });
  const [studyData, setStudyData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("studySelections");
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      setStudyData(parsed);
      console.log("Parsed study data:", parsed);
  
      // Extract exam type and mode for the navbar
      const examType = parsed.exam || "JAMB";
      const studyMode = "Quiz"; 
  
      setNavProps({
        exams: examType,
        mood: studyMode
      });
  
    } catch {
      setStudyData(null);
    }
  }, []);

  return(
    <>
      <PageNav exams={navProps.exams} mood={navProps.mood} />
    </>
  )
}