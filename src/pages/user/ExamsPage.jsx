
// import { useEffect } from 'react';
// import Header from '../../components/DashboardComponents/user/study-component/Header';
// import QuestionCard from '../../components/DashboardComponents/user/study-component/QuestionCard';
// import { useStudyStore } from '../../store/studyStore';

// export default function ExamsPage() {
//   const init = useStudyStore((s) => s.syncSaved);
//   const reset = useStudyStore((s) => s.reset);
//   const loading = useStudyStore((s) => s.loading);
//   const startStudySession = useStudyStore((s) => s.startStudySession);
//   const endStudySession = useStudyStore((s) => s.endStudySession);
//   const sessionActive = useStudyStore((s) => s.sessionActive);

//   useEffect(() => {
//     console.log('📘 StudyPage mounted → sync store');
    
//     const initAndStartSession = async () => {
//       // FIRST: Initialize and load saved data
//       const savedData = await init();
      
//       console.log('📦 Saved data returned:', savedData);
      
//       // THEN: Start study session by passing the saved data directly
//       if (savedData && !sessionActive) {
//         console.log('🚀 Starting Exam session with data...');
//         const sessionId = await startStudySession(savedData); // Pass savedData here
//         if (sessionId) {
//           console.log('✅ Session started with ID:', sessionId);
//         } else {
//           console.warn('⚠️ Failed to start session');
//         }
//       } else if (!savedData) {
//         console.warn('⚠️ No saved data, cannot start session');
//       }
//     };

//     initAndStartSession();

//     return () => {
//       console.log('🧹 StudyPage unmounted → end session and reset store');
      
//       // End session when leaving page
//       if (sessionActive) {
//         endStudySession();
//       }
//       reset();
//     };
//   }, []);

//   return (
//     <div className="p-4">
//       <Header />

//       {loading ? (
//         <div className="h-[400px] flex items-center justify-center">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
//           </div>
//         </div>
//       ) : (
//         <QuestionCard />
//       )}
//     </div>
//   );
// }




import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/DashboardComponents/user/exam-component/Header';
import ExamQuestionCard from '../../components/DashboardComponents/user/exam-component/QuestionCard';
import { useExamStore } from '../../store/examStore';
import { useToast } from '@/components/ui/use-toast';

export default function ExamsPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const init = useExamStore((s) => s.syncSaved);
  const reset = useExamStore((s) => s.reset);
  const loading = useExamStore((s) => s.loading);
  const startExam = useExamStore((s) => s.startExam);
  const endExam = useExamStore((s) => s.endExam);
  const examActive = useExamStore((s) => s.examActive);
  const examId = useExamStore((s) => s.examId);
  const examCompleted = useExamStore((s) => s.examCompleted);

  

  // Update your cleanup function in ExamsPage.jsx:

useEffect(() => {
  console.log('📝 ExamsPage mounted → initializing exam store');
  
  const initAndStartExam = async () => {
    try {
      const savedData = await init();
      
      console.log('📦 Saved exam data returned:', savedData);
      
      if (savedData && !examActive && !examCompleted) {
        console.log('🚀 Starting exam session...');
        
        const examSessionId = await startExam();
        
        if (examSessionId) {
          console.log('✅ Exam started with ID:', examSessionId);
          toast({
            title: "Exam Started",
            description: "Good luck! Your exam has begun.",
          });
        } else {
          console.warn('⚠️ Failed to start exam session');
          toast({
            title: "Error",
            description: "Failed to start exam. Please try again.",
            variant: "destructive",
          });
        }
      } else if (!savedData) {
        console.warn('⚠️ No saved exam data, redirecting to dashboard');
        toast({
          title: "No Exam Data",
          description: "Please select exam options first.",
          variant: "destructive",
        });
        navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('❌ Error initializing exam:', error);
      toast({
        title: "Error",
        description: "Failed to initialize exam. Please try again.",
        variant: "destructive",
      });
    }
  };

  initAndStartExam();

  // Cleanup function
  return () => {
    console.log('🧹 ExamsPage unmounted');
    
    const state = useExamStore.getState();
    
    // ✅ Only end exam if it's still active AND not completed
    if (state.examActive && !state.examCompleted) {
      console.log('⚠️ User left exam page while exam active - ending exam session');
      
      toast({
        title: "Exam Ended",
        description: "Your exam was automatically submitted.",
        variant: "destructive",
      });
      
      endExam();
    }
    
    // ✅ DON'T reset if exam is completed - let results page use the data
    if (!state.examCompleted) {
      console.log('🧹 Resetting exam store (exam not completed)');
      reset();
    } else {
      console.log('✅ Keeping results in store for results page');
    }
  };
}, []);

  // Prevent accidental page reload during exam
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (examActive && !examCompleted) {
        e.preventDefault();
        e.returnValue = 'Are you sure you want to leave? Your exam progress will be lost.';
        return e.returnValue;
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [examActive, examCompleted]);

  // Show warning if user tries to go back
  useEffect(() => {
    const handlePopState = (e) => {
      if (examActive && !examCompleted) {
        const confirmLeave = window.confirm(
          'Are you sure you want to leave the exam? Your progress will be submitted automatically.'
        );
        
        if (!confirmLeave) {
          // Push state back to prevent navigation
          window.history.pushState(null, '', window.location.pathname);
        } else {
          // User confirmed - end exam
          endExam();
        }
      }
    };

    // Push initial state
    if (examActive && !examCompleted) {
      window.history.pushState(null, '', window.location.pathname);
      window.addEventListener('popstate', handlePopState);
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [examActive, examCompleted, endExam]);

  return (
    <div className="p-4 min-h-screen">
      <Header />

      {loading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading exam questions...</p>
          </div>
        </div>
      ) : (
        <ExamQuestionCard />
      )}

      {/* Exam Active Indicator (Floating) */}
      {examActive && !examCompleted && (
        <div className="fixed bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center gap-2 z-50">
          <span className="w-3 h-3 bg-white rounded-full animate-pulse"></span>
          <span className="text-sm font-medium">Exam in Progress</span>
        </div>
      )}
    </div>
  );
}