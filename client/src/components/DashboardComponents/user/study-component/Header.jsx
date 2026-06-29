// import { useEffect, useState } from "react";
// import PageNav from "../../../DashboardComponents/PageNav";
// import { useStudyStore } from "../../../../store/studyStore";

// export default function Header() {
//   const {
//     saved,
//     subjectNames,
//     topicNames,
//     activeId,
//     changeActive,
//     questions,
//   } = useStudyStore();

//   const [ready, setReady] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(0);

//   /* ===============================
//      WAIT UNTIL ALL DATA IS READY
//   =============================== */
//   useEffect(() => {
//     if (!saved) return;

//     let cancelled = false;

//     const waitUntilReady = async () => {
//       while (true) {
//         if (cancelled) return;

//         const subjectReady =
//           saved.mode === "subject"
//             ? Object.keys(subjectNames).length ===
//               (saved.subjects?.length || 0)
//             : true;

//         const topicReady =
//           saved.mode === "topic"
//             ? Object.keys(topicNames).length ===
//               Object.values(saved.topics ?? {}).flat().length
//             : true;

//         const questionsReady = questions.length > 0;

//         if (subjectReady && topicReady && questionsReady) {
//           setReady(true);
//           return;
//         }

//         await new Promise((r) => setTimeout(r, 80));
//       }
//     };

//     waitUntilReady();

//     return () => {
//       cancelled = true;
//     };
//   }, [saved, subjectNames, topicNames, questions]);

//   /* ===============================
//      STAGGERED FADE-IN ANIMATION
//   =============================== */
//   useEffect(() => {
//     if (!ready || !saved) return;

//     setVisibleCount(0);

//     const total =
//       saved.mode === "subject"
//         ? saved.subjects.length
//         : Object.values(saved.topics ?? {})[0]?.length || 1;

//     let count = 0;

//     const interval = setInterval(() => {
//       count += 1;
//       setVisibleCount((v) => Math.min(v + 1, total));
//       if (count >= total) clearInterval(interval);
//     }, 300);

//     return () => clearInterval(interval);
//   }, [ready, saved]);

//   /* ===============================
//      SKELETON (BLOCKING)
//   =============================== */
//   if (!saved || !ready) {
//     const skeletonCount =
//       saved?.mode === "subject"
//         ? saved.subjects?.length || 4
//         : Object.values(saved?.topics ?? {})[0]?.length || 4;

//     return (
//       <main className="pt-16">
//       <PageNav />
//       <div className="p-4 space-y-4">
//         <div className='flex justify-between items-center '>
//         <div>
//           <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
//           <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
//         </div>
//         <div >
//         <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
//         <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
//         </div>
//         </div>
//         <div className="grid gap-3" style={{ gridTemplateColumns: `repeat(${Math.min(skeletonCount, 4)}, 1fr)` }}>
//         {Array.from({ length: skeletonCount }).map((_, idx) => (
//             <div key={`skeleton-group-${idx}`} className="space-y-2">
//               <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
//               <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
//               <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
//             </div>
//           ))}


//         </div>
//       </div>
//     </main>
//     );
//   }

//   /* ===============================
//      RENDER CONTENT
//   =============================== */

  // const isTopicMode = saved.mode === "topic";

  // // ---------- TOPIC MODE ----------
  // if (isTopicMode) {
  //   const subjectId = Object.keys(saved.topics)[0];
  //   const topicList = saved.topics[subjectId] || [];
  //   const subjectName = subjectNames[subjectId] || "Subject";

  //   return (
  //     <main>
  //       <div className="pt-16">
  //       <PageNav />
  //       </div>
  //       <h1 className="px-4 text-2xl text-white rounded-lg shadow my-2 bg-primary-hover">
  //         {subjectName}
  //       </h1>

  //       <div
  //         className="grid gap-3 mb-6"
  //         style={{
  //           gridTemplateColumns: `repeat(${Math.min(
  //             topicList.length,
  //             4
  //           )}, 1fr)`,
  //         }}
  //       >
          // {topicList.map((topicId, idx) => (
          //   <button
          //     key={topicId}
          //     onClick={() => changeActive(topicId)}
          //     className={`px-2 py-2 rounded-lg shadow text-white text-xs transition-opacity duration-500
          //       ${idx < visibleCount ? "opacity-100" : "opacity-0"}
          //       ${
          //         activeId === topicId
          //           ? "bg-primary"
          //           : "bg-primary-hover"
          //       }`}
          //   >
          //     {topicNames[topicId] || "Topic"}
          //   </button>
          // ))}
  //       </div>
  //     </main>
  //   );
  // }

//   // ---------- SUBJECT MODE ----------
//   return (
//     <main className="pt-12">
//       <PageNav />
//       <div
//         className="grid gap-3 mb-6 py-6"
//         style={{
//           gridTemplateColumns: `repeat(${Math.min(
//             saved.subjects.length,
//             4
//           )}, 1fr)`,
//         }}
//       >
//         {saved.subjects.map((subjectId, idx) => (
//           <button
//             key={subjectId}
//             onClick={() => changeActive(subjectId)}
//             className={`px-2 py-2 rounded-lg shadow text-white text-xs transition-opacity duration-500
//               ${idx < visibleCount ? "opacity-100" : "opacity-0"}
//               ${
//                 activeId === subjectId
//                   ? "bg-blue-700"
//                   : "bg-blue-500"
//               }`}
//           >
//             {subjectNames[subjectId] || "Subject"}
//           </button>
//         ))}
//       </div>

//       <hr className="m-4 border" />
//     </main>
//   );
// }





// import { useEffect, useState } from "react";
// import PageNav from "../../../DashboardComponents/PageNav";
// import { useStudyStore } from "../../../../store/studyStore";

// export default function Header() {
//   const {
//     saved,
//     subjectNames,
//     topicNames,
//     activeId,
//     changeActive,
//   } = useStudyStore();
  
//   const { paymentLocked } = useStudyStore();
//   const [ready, setReady] = useState(false);
//   const [visibleCount, setVisibleCount] = useState(0);

//   /* ===============================
//      WAIT UNTIL ALL DATA IS READY
//   =============================== */
//   useEffect(() => {
//     if (!saved) return;

//     let cancelled = false;

//     const waitUntilReady = async () => {
//       while (true) {
//         if (cancelled) return;

//         // ✅ SAFE SUBJECT COUNT
//         const subjectCount = Array.isArray(saved.subjects)
//           ? saved.subjects.length
//           : 0;

//         // ✅ SAFE TOPIC COUNT
//         const topicCount = Array.isArray(saved.topics)
//           ? saved.topics.length
//           : Object.values(saved.topics || {})
//               .flat()
//               .filter(Boolean).length;

//         const subjectReady =
//           saved.mode === "subject"
//             ? Object.keys(subjectNames || {}).length === subjectCount
//             : true;

//         const topicReady =
//           saved.mode === "topic"
//             ? Object.keys(topicNames || {}).length === topicCount
//             : true;


//         if (subjectReady && topicReady ) {
//           setReady(true);
//           return;
//         }

//         await new Promise((r) => setTimeout(r, 80));
//       }
//     };

//     waitUntilReady();

//     return () => {
//       cancelled = true;
//     };
//   }, [saved, subjectNames, topicNames]);

//   /* ===============================
//      STAGGERED FADE-IN ANIMATION
//   =============================== */
//   useEffect(() => {
//     if (!ready || !saved) return;

//     setVisibleCount(0);

//     const total =
//       saved.mode === "subject"
//         ? saved.subjects?.length || 0
//         : Object.values(saved.topics || {})[0]?.length || 0;

//     if (!total) return;

//     let count = 0;

//     const interval = setInterval(() => {
//       count += 1;
//       setVisibleCount((v) => Math.min(v + 1, total));
//       if (count >= total) clearInterval(interval);
//     }, 300);

//     return () => clearInterval(interval);
//   }, [ready, saved]);

//   /* ===============================
//      SKELETON (BLOCKING)
//   =============================== */
//   if (!saved || !ready) {
//     const skeletonCount =
//       saved?.mode === "subject"
//         ? saved?.subjects?.length || 4
//         : Object.values(saved?.topics || {})[0]?.length || 4;

//     return (
//       <main className="pt-16">
//         <PageNav />
//         <div className="p-4 space-y-4">
          // <div className="flex justify-between items-center">
          //   <div>
          //     <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          //     <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          //   </div>
          //   <div>
          //     <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          //     <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
          //   </div>
          // </div>

//           <div
//             className="grid gap-3"
//             style={{
//               gridTemplateColumns: `repeat(${Math.min(
//                 skeletonCount,
//                 2
//               )}, 1fr)`,
//             }}
//           >
//             {Array.from({ length: skeletonCount }).map((_, idx) => (
//               <div key={idx} className="space-y-2">
//                 <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" />
//                 {/* <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" /> */}
//                 {/* <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded animate-pulse" /> */}
//               </div>
//             ))}
//           </div>
//         </div>
//       </main>
//     );
//   }

//   /* ===============================
//      RENDER CONTENT
//   =============================== */


//   const isTopicMode = saved.mode === "topic";

//   // ---------- TOPIC MODE ----------
//   if (isTopicMode) {
//     const subjectId = Object.keys(saved.topics)[0];
//     const topicList = saved.topics[subjectId] || [];
//     const subjectName = subjectNames[subjectId] || "Subject";

//     return (
//       <main>
//         <div className="pt-16">
//         <PageNav />
//         </div>
//         <h1 className="px-4 text-2xl text-white rounded-lg shadow my-2 bg-primary-hover">
//           {subjectName}
//         </h1>

//         <div
//           className="grid gap-3 mb-6"
//           style={{
//             gridTemplateColumns: `repeat(${Math.min(
//               topicList.length,
//               4
//             )}, 1fr)`,
//           }}
//         >
//            {topicList.map((topicId, idx) => (
//             <button
//               key={topicId}
//               onClick={() => !paymentLocked && changeActive(topicId)}
//               className={`px-2 py-2 rounded-lg shadow text-white text-xs transition-opacity duration-500
//                 ${idx < visibleCount ? "opacity-100" : "opacity-0"}
//                 ${activeId === topicId ? "bg-primary" : "bg-primary-hover"}
//                 ${paymentLocked ? "cursor-not-allowed opacity-80" : ""}`}
//             >
//               {topicNames[topicId] || "Topic"}
//             </button>
//           ))}
//         </div>
//       </main>
//     );
//   }
//   // ---------- SUBJECT MODE ----------
//   return (
//     <main className="pt-12">
//       <PageNav />

//       <div
//         className="grid gap-3 mb-6 py-6"
//         style={{
//           gridTemplateColumns: `repeat(${Math.min(
//             saved.subjects?.length || 0,
//             4
//           )}, 1fr)`,
//         }}
//       >
//         {saved.subjects?.map((subjectId, idx) => (
//             <button
//               key={subjectId}
//               onClick={() => !paymentLocked && changeActive(subjectId)}
//               disabled={paymentLocked}
//               className={`px-2 py-2 rounded-lg shadow text-white text-xs transition-opacity duration-500
//                 ${idx < visibleCount ? "opacity-100" : "opacity-0"}
//                 ${activeId === subjectId ? "bg-blue-700" : "bg-blue-500"}
//                 ${paymentLocked ? "cursor-not-allowed opacity-80" : ""}`}
//             >
//               {subjectNames?.[subjectId] || "Subject"}
//             </button>
//         ))}

//       </div>

//       <hr className="m-4 border" />
//     </main>
//   );
// }






import { useEffect, useState } from "react";
import PageNav from "../../PageNav";
import { useStudyStore } from "../../../../store/studyStore";

export default function Header() {
  const {
    saved,
    subjectNames,
    topicNames,
    activeId,
    changeActive,
    paymentLocked,
  } = useStudyStore();

  const [ready, setReady] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);

  // ----------------- WAIT UNTIL NAMES READY -----------------
  useEffect(() => {
    if (!saved) return;

    const namesReady =
      saved.mode === "subject"
        ? Object.keys(subjectNames).length === saved.subjects.length
        : Object.keys(topicNames).length ===
          Object.values(saved.topics || {}).flat().length;

    if (namesReady) setReady(true);
  }, [saved, subjectNames, topicNames]);

  // ----------------- FADE IN -----------------
  useEffect(() => {
    if (!ready || !saved) return;

    setVisibleCount(0);

    const total =
      saved.mode === "subject"
        ? saved.subjects?.length || 0
        : Object.values(saved.topics || {})[0]?.length || 0;

    if (!total) return;

    let count = 0;
    const interval = setInterval(() => {
      count += 1;
      setVisibleCount((v) => Math.min(v + 1, total));
      if (count >= total) clearInterval(interval);
    }, 300);

    return () => clearInterval(interval);
  }, [ready, saved]);

  // ----------------- SKELETON -----------------
  if (!saved || !ready) {
    return (
      <main className="pt-16">
        <PageNav />
          <div className="flex justify-between items-center">
            <div>
              <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
            </div>
            <div>
              <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
              <div className="h-8 w-36 bg-gray-300 dark:bg-gray-700 rounded mb-4 animate-pulse" />
            </div>
          </div>
      </main>
    );
  }

  // ----------------- RENDER -----------------
  const isTopicMode = saved.mode === "topic";

  if (isTopicMode) {
    const subjectId = Object.keys(saved.topics)[0];
    const topicList = saved.topics[subjectId] || [];
    const subjectName = subjectNames[subjectId] || "Subject";

    return (
      <main className="pt-16">
        <PageNav />
        <h1 className="px-4 text-2xl text-white rounded-lg shadow my-2 bg-primary-hover">
          {subjectName}
        </h1>
        <div className="grid gap-3 mb-6" style={{ gridTemplateColumns: `repeat(${Math.min(topicList.length,4)}, 1fr)` }}>
          {topicList.map((topicId, idx) => (
            <button
              key={topicId}
              onClick={() => !paymentLocked && changeActive(topicId)}
              className={`px-2 py-2 rounded-lg shadow text-white text-xs transition-opacity duration-500
                ${idx < visibleCount ? "opacity-100" : "opacity-0"}
                ${activeId === topicId ? "bg-primary" : "bg-primary-hover"}
                ${paymentLocked ? "cursor-not-allowed opacity-80" : ""}`}
            >
              {topicNames[topicId] || "Topic"}
            </button>
          ))}
        </div>
      </main>
    );
  }

  // ---------- SUBJECT MODE ----------
  return (
    <main className="pt-12">
      <PageNav />
      <div className="grid gap-3 mb-6 py-6" style={{ gridTemplateColumns: `repeat(${Math.min(saved.subjects?.length || 0, 4)}, 1fr)` }}>
        {saved.subjects?.map((subjectId, idx) => (
          <button
            key={subjectId}
            onClick={() => !paymentLocked && changeActive(subjectId)}
            disabled={paymentLocked}
            className={`px-2 py-2 rounded-lg shadow text-white text-xs transition-opacity duration-500
              ${idx < visibleCount ? "opacity-100" : "opacity-0"}
              ${activeId === subjectId ? "bg-blue-700" : "bg-blue-500"}
              ${paymentLocked ? "cursor-not-allowed opacity-80" : ""}`}
          >
            {subjectNames?.[subjectId] || "Subject"}
          </button>
        ))}
      </div>
      <hr className="m-4 border" />
    </main>
  );
}

