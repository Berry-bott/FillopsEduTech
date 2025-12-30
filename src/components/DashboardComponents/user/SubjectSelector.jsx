// // src/components/ExamSelector/SubjectSelector.jsx
// import React, { useEffect, useState } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import useAuthStore from "../../../store/authStore";

// export default function SubjectSelector({
//   selectedExam,
//   selectedSubjects = [],
//   toggleSubject,
//   subjectYears = {},
//   setYearForSubject,
// }) {
//   const { accessToken } = useAuthStore();

//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);


// console.log({
//   subjects: JSON.parse(localStorage.getItem("prefSubjects") || "{}"),
// });
// let subjectsName = JSON.parse(localStorage.getItem("prefSubjects") || "{}")

// console.log(subjectsName.jamb);


//   // Load subjects from localStorage when exam changes
//   useEffect(() => {
//     if (!selectedExam) return;

//     setLoading(true);
//     setError(null);

//     try {
//       const Subjects = JSON.parse(localStorage.getItem("prefSubjects") || "{}");
//       const examSubjects = Subjects[selectedExam] || [];

//       // Transform to match the expected structure
//       const mappedSubjects = examSubjects.map((s) =>
//         typeof s === "string"
//           ? { id: s, subjectName: s, question: [] } // fallback if only name stored
//           : { id: s.id, subjectName: s.name, question: [] }
//       );

//       setSubjects(mappedSubjects);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load subjects from local storage");
//     } finally {
//       setLoading(false);
//     }
//   }, [selectedExam]);



//   // Fetch subjects when exam changes
//   // useEffect(() => {
//   //   if (!selectedExam || !accessToken) return;

//   //   setLoading(true);
//   //   setError(null);

//   //   fetch(`https://fillops-server-5fuf.onrender.com/api/subjects?category=${selectedExam}`,{
//   //     headers: { Authorization: `Bearer ${accessToken}` },
//   //   })
//   //     .then((res) => {
//   //       if (!res.ok) throw new Error("Failed to fetch subjects");
//   //       return res.json();
//   //     })
//   //     .then((data) => setSubjects(data.data || []))
//   //     .catch(() => setError("Unable to load subjects"))
//   //     .finally(() => setLoading(false));
//   // }, [selectedExam, accessToken]);

//   if (!selectedExam) return null;

//   return (
//     <div>
//       <p className="text-sm font-medium mb-3">
//         Select up to 4 subjects for{" "}
//         <span className="font-semibold">{selectedExam.toUpperCase()}</span>
//       </p>

//       {loading && (
//         <div className="flex flex-col items-center justify-center py-10">
//           <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
//           <p>Loading subjects...</p>
//         </div>
//       )}
//       {error && <p className="text-red-500">{error}</p>}

//       <div className="space-y-4 max-h-[450px] overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
//         {subjects.map((subject) => {
//           const years = [...new Set(subject.question.map((q) => q.year))];

//           return (
//             <div
//               key={subject.id}
//               className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
//             >
//               {/* Subject checkbox */}
//               <div className="flex items-center gap-3">
//                 <Checkbox
//                   checked={selectedSubjects.includes(subject.id)}
//                   onCheckedChange={() => toggleSubject(subject.id)}
//                   className="h-6 w-6 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400"
//                 />
//                 <span className="text-gray-800 dark:text-gray-100 font-medium">
//                   {subject.subjectName}
//                 </span>
//               </div>

//               {/* Year select */}
//               <select
//                 value={subjectYears[subject.id] || ""}
//                 onChange={(e) => setYearForSubject(subject.id, e.target.value)}
//                 className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
//               >
//                 <option value="" disabled>
//                   Select Year
//                 </option>
//                 <option value="random">Random</option>
//                 {years.map((y) => (
//                   <option key={y} value={y}>
//                     {y}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// }





// // src/components/ExamSelector/SubjectSelector.jsx
// import React, { useEffect, useState } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import useAuthStore from "../../../store/authStore";

// export default function SubjectSelector({
//   selectedExam,
//   selectedSubjects = [],
//   toggleSubject,
//   subjectYears = {},
//   setYearForSubject,
// }) {
//   const { accessToken } = useAuthStore();

//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);

//   // ================= 1️⃣ LOAD SUBJECTS FROM LOCALSTORAGE =================
//   useEffect(() => {
//     if (!selectedExam) return;

//     try {
//       const stored = JSON.parse(localStorage.getItem("prefSubjects") || "{}");

//       const examKey = selectedExam.toLowerCase();
//       const rawSubjects = stored[examKey] || [];

//       // only keep objects: { id, name }
//       const cleaned = rawSubjects.filter(
//         (s) => s && typeof s === "object" && s.id && s.name
//       );

//       const mapped = cleaned.map((s) => ({
//         id: s.id,
//         subjectName: s.name,
//         years: [],
//       }));

//       console.log("🟡 Loaded subjects from localStorage:", mapped);
//       setSubjects(mapped);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load subjects from local storage");
//     }
//   }, [selectedExam]);

//   // ================= 2️⃣ FETCH YEARS FROM API (MERGE ONLY) =================
//   useEffect(() => {
//     if (!selectedExam || !accessToken) return;
//     if (!subjects.length) return; // wait for localStorage subjects

//     setLoading(true);
//     setError(null);

//     fetch(
//       `https://fillops-server-5fuf.onrender.com/api/subjects?category=${selectedExam}`,
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     )
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch subjects");
//         return res.json();
//       })
//       .then((data) => {
//         const apiSubjects = data.data || [];

//         setSubjects((prev) =>
//           prev.map((localSubj) => {
//             const apiMatch = apiSubjects.find(
//               (apiSubj) =>
//                 apiSubj.subjectName?.toLowerCase() ===
//                 localSubj.subjectName?.toLowerCase()
//             );

//             const years = apiMatch
//               ? [...new Set(apiMatch.question.map((q) => q.year))]
//               : [];

//             return {
//               ...localSubj,
//               years,
//             };
//           })
//         );
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Unable to load years");
//       })
//       .finally(() => setLoading(false));
//   }, [selectedExam, accessToken, subjects.length]);

//   if (!selectedExam) return null;

//   return (
//     <div>
//       <p className="text-sm font-medium mb-3">
//         Select up to 4 subjects for{" "}
//         <span className="font-semibold">{selectedExam.toUpperCase()}</span>
//       </p>

//       {loading && (
//         <div className="flex flex-col items-center justify-center py-10">
//           <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
//           <p>Loading subjects...</p>
//         </div>
//       )}

//       {error && <p className="text-red-500">{error}</p>}

//       <div className="space-y-4 max-h-[450px] overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
//         {subjects.map((subject) => (
//           <div
//             key={subject.id}
//             className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
//           >
//             {/* Subject checkbox */}
//             <div className="flex items-center gap-3">
//               <Checkbox
//                 checked={selectedSubjects.includes(subject.id)}
//                 onCheckedChange={() => toggleSubject(subject.id)}
//                 className="h-6 w-6 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400"
//               />
//               <span className="text-gray-800 dark:text-gray-100 font-medium">
//                 {subject.subjectName}
//               </span>
//             </div>

//             {/* Year select */}
//             <select
//               value={subjectYears[subject.id] || ""}
//               onChange={(e) => setYearForSubject(subject.id, e.target.value)}
//               className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
//             >
//               <option value="" disabled>
//                 Select Year
//               </option>
//               <option value="random">Random</option>
//               {subject.years.map((y) => (
//                 <option key={y} value={y}>
//                   {y}
//                 </option>
//               ))}
//             </select>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }







// import React, { useEffect, useState } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import useAuthStore from "../../../store/authStore";

// export default function SubjectSelector({
//   selectedExam,
//   selectedSubjects = [],
//   toggleSubject,
//   subjectYears = {},
//   setYearForSubject,
// }) {
//   const { accessToken } = useAuthStore();

//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [ready, setReady] = useState(false);

//   /* ================= 1️⃣ LOAD SUBJECTS FROM LOCALSTORAGE ================= */
//   useEffect(() => {
//     if (!selectedExam) return;

//     setLoading(true);
//     setReady(false);
//     setError(null);

//     try {
//       const stored = JSON.parse(localStorage.getItem("prefSubjects") || "{}");
//       const examKey = selectedExam.toLowerCase();

//       const rawSubjects = stored[examKey] || [];

//       // ✅ ONLY objects with id + name
//       const cleaned = rawSubjects.filter(
//         (s) => s && typeof s === "object" && s.id && s.name
//       );

//       const mapped = cleaned.map((s) => ({
//         id: s.id,
//         subjectName: s.name,
//         years: [],
//       }));

//       console.log("🟡 Loaded subjects from localStorage:", mapped);
//       setSubjects(mapped);
//     } catch (err) {
//       console.error(err);
//       setError("Unable to load subjects from local storage");
//       setLoading(false);
//     }
//   }, [selectedExam]);

//   /* ================= 2️⃣ FETCH YEARS FROM API (MERGE ONLY) ================= */
//   useEffect(() => {
//     if (!selectedExam || !accessToken) return;
//     if (!subjects.length) return;

//     fetch(
//       `https://fillops-server-5fuf.onrender.com/api/subjects?category=${selectedExam}`,
//       {
//         headers: { Authorization: `Bearer ${accessToken}` },
//       }
//     )
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch subjects");
//         return res.json();
//       })
//       .then((data) => {
//         const apiSubjects = data.data || [];

//         setSubjects((prev) =>
//           prev.map((localSubj) => {
//             const apiMatch = apiSubjects.find(
//               (apiSubj) =>
//                 apiSubj.subjectName?.toLowerCase() ===
//                 localSubj.subjectName?.toLowerCase()
//             );

//             const years = apiMatch
//               ? [...new Set(apiMatch.question.map((q) => q.year))]
//               : [];

//             return { ...localSubj, years };
//           })
//         );

//         setReady(true);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("Unable to load years");
//         setLoading(false);
//       });
//   }, [selectedExam, accessToken, subjects.length]);

//   if (!selectedExam) return null;

//   return (
//     <div>
//       <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
//         Select Number of subjects for{" "}
//         <span className="font-semibold">{selectedExam.toUpperCase()}</span>
//       </p>

//       {/* ================= LOADING ================= */}
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-10 text-gray-700 dark:text-gray-300">
//           <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
//           <p>Loading subjects...</p>
//         </div>
//       )}

//       {error && <p className="text-red-500">{error}</p>}

//       {/* ================= SUBJECT LIST ================= */}
//       {!loading && ready && (
//         <div className="space-y-4 max-h-[450px] overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
//           {subjects.map((subject) => (
//             <div
//               key={subject.id}
//               className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
//             >
//               {/* Subject checkbox */}
//               <div className="flex items-center gap-3">
//                 <Checkbox
//                   checked={selectedSubjects.includes(subject.id)}
//                   onCheckedChange={() => toggleSubject(subject.id)}
//                   className="h-6 w-6 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400"
//                 />
//                 <span className="text-gray-800 dark:text-primary font-medium">
//                   {subject.subjectName}
//                 </span>
//               </div>

//               {/* Year select */}
//               <select
//                 value={subjectYears[subject.id] || ""}
//                 onChange={(e) =>
//                   setYearForSubject(subject.id, e.target.value)
//                 }
//                 className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
//               >
//                 <option value="" disabled>
//                   Select Year
//                 </option>
//                 <option value="random">Random</option>
//                 {subject.years.map((y) => (
//                   <option key={y} value={y}>
//                     {y}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }


import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import useAuthStore from "../../../store/authStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

export default function SubjectSelector({
  selectedExam,
  selectedSubjects = [],
  toggleSubject,
  subjectYears = {},
  setYearForSubject,
}) {
  const { accessToken } = useAuthStore();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  /* ================= 1️⃣ LOAD SUBJECTS FROM API ================= */
  useEffect(() => {
    if (!selectedExam || !accessToken) return;

    setLoading(true);
    setReady(false);
    setError(null);

    fetch(`${API_BASE}/preferences`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch preferences");
        return res.json();
      })
      .then((data) => {
        console.log("🟢 Fetched preferences:", data);

        // Correct path: data.preferences.selectedSubjects
        const preferences = data.data?.preferences || {};
        const selectedSubjects = preferences.selectedSubjects || {};
        
        // Get subjects for the selected exam (e.g., "WAEC", "NECO", etc.)
        const examKey = selectedExam.toUpperCase();
        const rawSubjects = selectedSubjects[examKey] || [];

        console.log(`🔍 Subjects for ${examKey}:`, rawSubjects);

        // Map the subjects to the expected format
        const mapped = rawSubjects.map((subject) => {
          return {
            id: subject.id || subject._id,
            subjectName: subject.name || subject.subjectName || "Unknown Subject",
            years: [],
          };
        });

        console.log("🟡 Loaded subjects from API:", mapped);
        setSubjects(mapped);
      })
      .catch((err) => {
        console.error("Error loading preferences:", err);
        setError("Unable to load subjects from preferences");
        setLoading(false);
      });
  }, [selectedExam, accessToken]);

  /* ================= 2️⃣ FETCH YEARS FROM API (MERGE ONLY) ================= */
  useEffect(() => {
    if (!selectedExam || !accessToken) return;
    if (!subjects.length) return;

    fetch(
      `${API_BASE}/subjects?category=${selectedExam}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch subjects");
        return res.json();
      })
      .then((data) => {
        console.log("🟢 Fetched subjects with years:", data);
        const apiSubjects = data.data || [];

        setSubjects((prev) =>
          prev.map((localSubj) => {
            const apiMatch = apiSubjects.find(
              (apiSubj) =>
                apiSubj.subjectName?.toLowerCase() ===
                localSubj.subjectName?.toLowerCase()
            );

            console.log(`🔍 Matching ${localSubj.subjectName}:`, apiMatch);

            // Handle different possible response structures
            let years = [];
            if (apiMatch) {
              // Check for questions array in different possible locations
              const questions = apiMatch.question || apiMatch.questions || [];
              
              if (Array.isArray(questions) && questions.length > 0) {
                // Extract unique years from questions
                years = [...new Set(questions.map((q) => q.year).filter(Boolean))];
              }
            }

            console.log(`📅 Years for ${localSubj.subjectName}:`, years);

            return { ...localSubj, years };
          })
        );

        setReady(true);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading years:", err);
        setError("Unable to load years");
        setLoading(false);
      });
  }, [selectedExam, accessToken, subjects.length]);

  if (!selectedExam) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
        Select Number of subjects for{" "}
        <span className="font-semibold">{selectedExam.toUpperCase()}</span>
      </p>

      {/* ================= LOADING ================= */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-700 dark:text-gray-300">
          <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
          <p>Loading subjects...</p>
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {/* ================= SUBJECT LIST ================= */}
      {!loading && ready && (
        <div className="space-y-4 max-h-[450px] overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
          {subjects.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No subjects found for {selectedExam.toUpperCase()}
            </p>
          ) : (
            subjects.map((subject) => (
              <div
                key={subject.id}
                className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
              >
                {/* Subject checkbox */}
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={selectedSubjects.includes(subject.id)}
                    onCheckedChange={() => toggleSubject(subject.id)}
                    className="h-6 w-6 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400"
                  />
                  <span className="text-gray-800 dark:text-primary font-medium">
                    {subject.subjectName}
                  </span>
                </div>

                {/* Year select */}
                <select
                  value={subjectYears[subject.id] || ""}
                  onChange={(e) =>
                    setYearForSubject(subject.id, e.target.value)
                  }
                  disabled={subject.years.length === 0}
                  className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="" disabled>
                    {subject.years.length === 0 ? "No years available" : "Select Year"}
                  </option>
                  {subject.years.length > 0 && (
                    <>
                      <option value="random">Random</option>
                      {subject.years.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </>
                  )}
                </select>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}