// import React, { useEffect, useState } from "react";

// export default function Learning() {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     const selectedExam = localStorage.getItem("selectedExam");
//     const selectedSubjects = localStorage.getItem("selectedSubjects");
//     const yearSelections = localStorage.getItem("yearSelections");
//     const topicSelection = localStorage.getItem("topicSelection");

//     setData({
//       selectedExam,
//       selectedSubjects: selectedSubjects ? JSON.parse(selectedSubjects) : null,
//       yearSelections: yearSelections ? JSON.parse(yearSelections) : null,
//       topicSelection: topicSelection ? JSON.parse(topicSelection) : null,
//     });
//   }, []);

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
//       <h2 className="text-2xl font-bold mb-4">Learning Session</h2>
//       <pre className="bg-white/20 p-4 rounded-lg text-sm w-3/4 overflow-auto">
//         {JSON.stringify(data, null, 2)}
//       </pre>
//     </div>
//   );
// }



import React, { useEffect, useState } from "react";

export default function Learning() {
  const [studyData, setStudyData] = useState(null);

  useEffect(() => {
    const raw = localStorage.getItem("studySelections");
    if (!raw) {
      setStudyData(null);
      return;
    }
    try {
      const parsed = JSON.parse(raw);
      setStudyData(parsed);
    } catch {
      setStudyData(null);
    }
  }, []);

  if (!studyData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p className="text-gray-600">No study selections found — please set up study first.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Learning</h1>
      <p className="text-sm text-gray-600 mb-4">
        Exam: <strong>{studyData.exam?.toUpperCase()}</strong> — Mode:{" "}
        <strong>{studyData.mode}</strong> — Subcategory:{" "}
        <strong>{studyData.subcategory}</strong>
      </p>

      {studyData.mode === "subject" && (
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Subjects</h2>
          <ul className="list-disc pl-5">
            {(studyData.subjects || []).map((sub) => (
              <li key={sub}>
                {sub} — Year: <strong>{studyData.subjectYears?.[sub] || "N/A"}</strong>
              </li>
            ))}
          </ul>
        </section>
      )}

      {studyData.mode === "topic" && (
        <section className="mb-6">
          <h2 className="font-semibold mb-2">Topics</h2>
          {Object.entries(studyData.topics || {}).map(([subject, topics]) => (
            <div key={subject} className="mb-3">
              <div className="font-medium">{subject}</div>
              <div className="text-sm text-gray-700">
                {topics.length > 0 ? topics.join(", ") : "No topics selected"}
              </div>
              <div className="text-xs text-gray-500">
                Year: <strong>{studyData.topicYears?.[subject] || "All"}</strong>
              </div>
            </div>
          ))}
        </section>
      )}
    </div>
  );
}
