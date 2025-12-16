// import { useEffect } from 'react';
// import Header from '../../components/DashboardComponents/user/study-component/Header';
// import QuestionCard from '../../components/DashboardComponents/user/study-component/QuestionCard';
// import { useStudyStore } from '../../store/studyStore';

// export default function QuizPage() {
//   const { saved, questions, loading, currentIndex, init, next } = useStudyStore();

//   useEffect(() => {
//     init();
//   }, []);

//   if (!saved) return <p>No study selections found.</p>;

//   return (
//     <div className="p-4">
//       <Header />

//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-10">
//           <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
//           <p>Loading...</p>
//         </div>
//       ) : (
//         <QuestionCard />
//       )}
//     </div>
//   );
// }


import { useEffect } from 'react';
import Header from '../../components/DashboardComponents/user/study-component/Header';
import QuestionCard from '../../components/DashboardComponents/user/study-component/QuestionCard';
import { useStudyStore } from '../../store/studyStore';

export default function QuizPage() {
  const init = useStudyStore((s) => s.syncSaved);
  const reset = useStudyStore((s) => s.reset);
  const loading = useStudyStore((s) => s.loading);
  const saved = useStudyStore((s) => s.saved);

  useEffect(() => {
    console.log('📘 QuizPage mounted → sync store');
    init();

    return () => {
      console.log('🧹 QuizPage unmounted → reset store');
      reset();
    };
  }, []);

  if (!saved) return <p>No study selections found.</p>;

  return (
    <div className="p-4">
      <Header />

      {loading ? (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          <p>Loading...</p>
        </div>
      ) : (
        <QuestionCard />
      )}
    </div>
  );
}
