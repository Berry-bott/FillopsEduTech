
// import React, { useEffect, useState } from "react";
// import { Checkbox } from "@/components/ui/checkbox";
// import useAuthStore from "../../../store/authStore";
// import { usePaymentStore } from "@/store/paymentStore";

// const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

// export default function SubjectSelector({
//   selectedExam,
//   selectedSubjects = [],
//   toggleSubject,
//   subjectYears = {},
//   setYearForSubject,
// }) {
//   const { accessToken } = useAuthStore();
  
//   // ✅ Get payment info for UI display
//   const paymentStore = usePaymentStore();
//   const activeSubscriptions = paymentStore?.activeSubscriptions || [];
//   const checkStatus = paymentStore?.checkStatus;

//   const [subjects, setSubjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // ✅ Fetch subscriptions when component mounts
//   useEffect(() => {
//     if (accessToken && checkStatus && typeof checkStatus === 'function') {
//       checkStatus();
//     }
//   }, [accessToken, checkStatus]);

//   /* ================= LOAD SUBJECTS FROM API (WITH YEARS) ================= */
//   useEffect(() => {
//     if (!selectedExam || !accessToken) return;

//     setLoading(true);
//     setError(null);

//     fetch(`${API_BASE}/users/my-subjects`, {
//       headers: { Authorization: `Bearer ${accessToken}` },
//     })
//       .then((res) => {
//         if (!res.ok) throw new Error("Failed to fetch my subjects");
//         return res.json();
//       })
//       .then((data) => {
//         console.log("🟢 Fetched preferences:", data);

//         const subjectsByCategory = data.data?.subjectsByCategory || {};
        
//         const examKey = selectedExam.toUpperCase();
//         const rawSubjects = subjectsByCategory[examKey] || [];

//         console.log(`🔍 Subjects for ${examKey}:`, rawSubjects);

//         const mapped = rawSubjects.map((subject) => {
//           return {
//             id: subject.id || subject._id,
//             subjectName: subject.subjectName || subject.name || "Unknown Subject",
//             years: subject.availableYears || [],
            
//           };
//         });

//         console.log("🟡 Loaded subjects with years:", mapped);
//         setSubjects(mapped);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("❌ Error loading subjects:", err);
//         setError("Unable to load subjects");
//         setLoading(false);
//       });
//   }, [selectedExam, accessToken]);

//   // ✅ Helper: Check if user owns this subject (UI only)
//   const userOwnsSubject = (subjectId) => {
//     if (!activeSubscriptions || activeSubscriptions.length === 0) return false;
    
//     return activeSubscriptions.some(sub => 
//       (sub.subjectId === subjectId || sub.id === subjectId || sub._id === subjectId) &&
//       sub.category === selectedExam?.toUpperCase()
//     );
//   };

//   if (!selectedExam) return null;

//   return (
//     <div>
//       <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
//         Select subjects for{" "}
//         <span className="font-semibold">{selectedExam.toUpperCase()}</span>
//       </p>

//       {/* ================= LOADING ================= */}
//       {loading && (
//         <div className="flex flex-col items-center justify-center py-10 text-gray-700 dark:text-gray-300">
//           <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
//           <p className="mt-2">Loading subjects...</p>
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
//           <p className="text-red-600 text-sm">{error}</p>
//         </div>
//       )}

//       {/* ================= SUBJECT LIST ================= */}
//       {!loading && !error && (
//         <div className="space-y-4 max-h-[850px] overflow-y-auto p-2">
//           {subjects.length === 0 ? (
//             <p className="text-center text-gray-500 dark:text-gray-400 py-4">
//               No subjects found for {selectedExam.toUpperCase()}
//             </p>
//           ) : (
//             subjects.map((subject) => {
//               const isSelected = selectedSubjects.includes(subject.id);
//               const isPremium = userOwnsSubject(subject.id);
              
//               return (
//                 <div
//                   key={subject.id}
//                   className={`relative border rounded-xl p-4 shadow-sm transition 
//                     ${
//                       isSelected
//                         ? "bg-indigo-50 dark:bg-primary-hover border-primary-hover dark:border-blue-700"
//                         : isPremium
//                         ? "bg-blue-50 dark:bg-green-900/20 border-blue-100 dark:border-blue-100"
//                         : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
//                     } 
//                     hover:bg-slate-50 dark:hover:bg-gray-700`}

//                 >
//                   <div className="flex justify-between items-center gap-3">
//                     <div className="flex items-center gap-3 flex-1">
//                       {/* Checkbox */}
//                       <Checkbox
//                         checked={isSelected}
//                         onCheckedChange={() => toggleSubject(subject.id)}
//                         className="h-6 w-6 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400"
//                       />
                      
//                       <div className="flex-1">
//                         <div className="flex items-center gap-2 flex-wrap">
//                           {/* Subject Name with color indicator */}
//                           <div className="flex items-center gap-2">
                          
//                             <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
//                               {subject.subjectName}
//                             </div>
//                           </div>
                          
//                           {/* Exam Badge */}
//                           <span className="text-[8px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
//                             {selectedExam}
//                           </span>

//                           {/* ✅ Premium Badge (UI only - doesn't control access) */}
//                           {isPremium && (
//                             <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
//                               <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
//                               </svg>
//                               Premium
//                             </span>
//                           )}

//                           {/* ✅ Free Trial Badge (if not premium) */}
//                           {!isPremium && (
//                             <span className="text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
//                                Free Trial
//                             </span>
//                           )}
//                         </div>
                        
//                         {/* Info text */}
//                         <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
//                           {subject.years?.length || 0} years available
//                           {isPremium && (
//                             <span className="text-green-600 dark:text-green-400 font-semibold ml-2">
//                               • Paid
//                             </span>
//                           )}
//                         </div>
//                       </div>
//                     </div>

//                     {/* Year select */}
//                     <select
//                       value={subjectYears[subject.id] || ""}
//                       onChange={(e) =>
//                         setYearForSubject(subject.id, e.target.value)
//                       }
//                       disabled={!subject.years || subject.years.length === 0}
//                       className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//                       onClick={(e) => e.stopPropagation()}
//                     >
//                       <option value="" disabled>
//                         {!subject.years || subject.years.length === 0 
//                           ? "No years available" 
//                           : "Select Year"}
//                       </option>
//                       {subject.years && subject.years.length > 0 && (
//                         <>
//                           <option value="random">Random</option>
//                           {subject.years.map((y) => (
//                             <option key={y} value={y}>
//                               {y}
//                             </option>
//                           ))}
//                         </>
//                       )}
//                     </select>
//                   </div>
//                 </div>
//               );
//             })
//           )}
//         </div>
//       )}
//     </div>
//   );
// }










import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import useAuthStore from "../../../store/authStore";
import { usePaymentStore } from "@/store/paymentStore";

const API_BASE = "https://fillops-server-5fuf.onrender.com/api";

export default function SubjectSelector({
  selectedExam,
  selectedSubjects = [],
  toggleSubject,
  subjectYears = {},
  setYearForSubject,
}) {
  const { accessToken } = useAuthStore();

  const paymentStore = usePaymentStore();
  const activeSubscriptions = paymentStore?.activeSubscriptions || [];
  const checkStatus = paymentStore?.checkStatus;

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (accessToken && checkStatus && typeof checkStatus === "function") {
      checkStatus();
    }
  }, [accessToken, checkStatus]);

  useEffect(() => {
    if (!selectedExam || !accessToken) return;

    setLoading(true);
    setError(null);

    fetch(`${API_BASE}/users/my-subjects`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch my subjects");
        return res.json();
      })
      .then((data) => {
        const subjectsByCategory = data.data?.subjectsByCategory || {};
        const examKey = selectedExam.toUpperCase();
        const rawSubjects = subjectsByCategory[examKey] || [];

        const mapped = rawSubjects.map((subject) => ({
          id: subject.id || subject._id,
          subjectName: subject.subjectName || subject.name || "Unknown Subject",
          years: subject.availableYears || [],
        }));

        setSubjects(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Error loading subjects:", err);
        setError("Unable to load subjects");
        setLoading(false);
      });
  }, [selectedExam, accessToken]);

  const userOwnsSubject = (subjectId) => {
    if (!activeSubscriptions || activeSubscriptions.length === 0) return false;
    return activeSubscriptions.some(
      (sub) =>
        (sub.subjectId === subjectId ||
          sub.id === subjectId ||
          sub._id === subjectId) &&
        sub.category === selectedExam?.toUpperCase()
    );
  };

  if (!selectedExam) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-3 text-gray-700 dark:text-gray-300">
        Select subjects for{" "}
        <span className="font-semibold">{selectedExam.toUpperCase()}</span>
      </p>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-10 text-gray-700 dark:text-gray-300">
          <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin" />
          <p className="mt-2">Loading subjects...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      {/* Subject list */}
      {!loading && !error && (
        <div className="space-y-4 max-h-[850px] overflow-y-auto p-2">
          {subjects.length === 0 ? (
            <p className="text-center text-gray-500 dark:text-gray-400 py-4">
              No subjects found for {selectedExam.toUpperCase()}
            </p>
          ) : (
            subjects.map((subject) => {
              const isSelected = selectedSubjects.includes(subject.id);
              const isPremium = userOwnsSubject(subject.id);

              return (
                <div
                  key={subject.id}
                  onClick={() => toggleSubject(subject.id)}
                  className={`relative border rounded-xl p-4 shadow-sm transition cursor-pointer
                    ${
                      isSelected
                        ? "bg-indigo-50 dark:bg-primary-hover border-primary-hover dark:border-blue-700"
                        : isPremium
                        ? "bg-blue-50 dark:bg-green-900/20 border-blue-100 dark:border-blue-100"
                        : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                    }
                    hover:bg-slate-50 dark:hover:bg-gray-700`}
                >
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3 flex-1">
                      {/* Checkbox — stop propagation so click doesn't double-fire */}
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSubject(subject.id)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-6 w-6 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400"
                      />

                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                              {subject.subjectName}
                            </div>
                          </div>

                          <span className="text-[8px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-bold">
                            {selectedExam}
                          </span>

                          {isPremium ? (
                            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold flex items-center gap-1">
                              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              Premium
                            </span>
                          ) : (
                            <span className="text-[8px] bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full font-bold">
                              Free Trial
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {subject.years?.length || 0} years available
                          {isPremium && (
                            <span className="text-green-600 dark:text-green-400 font-semibold ml-2">
                              • Paid
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Year select — stop propagation so clicking it doesn't toggle the card */}
                    <select
                      value={subjectYears[subject.id] || ""}
                      onChange={(e) => setYearForSubject(subject.id, e.target.value)}
                      onClick={(e) => e.stopPropagation()}
                      disabled={!subject.years || subject.years.length === 0}
                      className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="" disabled>
                        {!subject.years || subject.years.length === 0
                          ? "No years available"
                          : "Select Year"}
                      </option>
                      {subject.years && subject.years.length > 0 && (
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
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}