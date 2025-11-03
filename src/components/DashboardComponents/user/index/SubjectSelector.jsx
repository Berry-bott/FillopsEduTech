// src/components/ExamSelector/SubjectSelector.jsx
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { YEARS } from "./data";

export default function SubjectSelector({
  selectedExam,
  subjectData,
  selectedSubjects,
  subjectYears,
  toggleSubject,
  setYearForSubject,
}) {
  // 🧩 1. Handle case when no exam is selected yet
  if (!selectedExam) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        Please select an exam first.
      </div>
    );
  }

  // 🧩 2. Handle case when subjectData or subjects for selected exam not loaded
  const subjects = subjectData?.[selectedExam];
  if (!subjects || subjects.length === 0) {
    return (
      <div className="mt-4 text-sm text-gray-500">
        No subjects available for {selectedExam.toUpperCase()}.
      </div>
    );
  }

  // 🧩 3. Render list safely
  return (
    <div className="mt-4 max-h-[420px] overflow-y-auto space-y-3">
      <p className="text-sm text-gray-700 mb-2">
        Select up to 5 subjects for {selectedExam.toUpperCase()}.
      </p>

      {subjects.map((subject) => (
        <div
          key={subject}
          className="flex items-center justify-between border-b pb-2"
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedSubjects.includes(subject)}
              onCheckedChange={() => toggleSubject(subject)}
            />
            <span>{subject}</span>
          </div>

          <div>
            <select
              value={subjectYears[subject] || ""}
              onChange={(e) => setYearForSubject(subject, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Year</option>
              <option value="random">Random</option>
              {YEARS.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      ))}
    </div>
  );
}


// src/components/ExamSelector/SubjectSelector.jsx
// import React from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import { YEARS } from "./data";

// export default function SubjectSelector({
//   selectedExam,
//   subjectData,
//   selectedSubjects,
//   subjectYears,
//   toggleSubject,
//   setYearForSubject,
// }) {
//   return (
//     <div className="mt-4 max-h-[420px] overflow-y-auto space-y-3">
//       <p className="text-sm text-gray-700">
//         Select up to 5 subjects for {selectedExam.toUpperCase()}.
//       </p>

//       {subjectData[selectedExam].map((subject) => (
//         <div
//           className="flex items-center justify-between border-b pb-2"
//           key={subject}
//         >
//           <div className="flex items-center gap-3">
//             <Checkbox
//               checked={selectedSubjects.includes(subject)}
//               onCheckedChange={() => toggleSubject(subject)}
//             />
//             <span>{subject}</span>
//           </div>

//           <div>
//             <select
//               value={subjectYears[subject] || ""}
//               onChange={(e) => setYearForSubject(subject, e.target.value)}
//               className="border rounded px-2 py-1 text-sm"
//             >
//               <option value="">Year</option>
//               <option value="random">Random</option>
//               {YEARS.map((y) => (
//                 <option key={y} value={String(y)}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }
