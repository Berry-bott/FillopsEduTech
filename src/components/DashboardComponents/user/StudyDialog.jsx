// // src/components/ExamSelector/StudyDialog.jsx
// import React from "react";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import SubjectSelector from "./SubjectSelector";
// import TopicSelector from "./TopicSelector";

// export default function StudyDialog(props) {
//   const {
//     open,
//     setOpen,
//     activeAction,
//     selectedExam,
//     setSelectedExam,
//     selectMode,
//     setSelectMode,
//     exams,
//     subjectData,
//     topicData,
//     selectedSubjects,
//     subjectYears,
//     toggleSubject,
//     setYearForSubject,
//     selectedTopics,
//     toggleTopic,
//     openTopicSubject,
//     setOpenTopicSubject,
//     topicYearFilter,
//     setTopicYear,
//     handleStart,
//   } = props;

//   // Function to handle fade + slide animations
//   const getStepClasses = (isVisible) =>
//     `transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
//       isVisible
//         ? "opacity-100 translate-y-0 pointer-events-auto"
//         : "opacity-0 -translate-y-4 pointer-events-none"
//     }`;

//   return (
//     <Dialog open={open} onOpenChange={setOpen}>
//       <DialogContent className="max-w-3xl p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
//         <DialogHeader>
//           <DialogTitle className="text-lg md:text-xl font-semibold text-primary dark:text-gray-100">
//             {activeAction === "learning"
//               ? "Study - Setup"
//               : activeAction === "quiz"
//               ? "Quiz - Setup"
//               : "Exam - Setup"}
//           </DialogTitle>
//         </DialogHeader>

       
//         {/* Step 1: Select Mode */}
//         <div className={getStepClasses(selectedExam && !selectMode)}>
//           {selectedExam && !selectMode && (
//             <div className="mt-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
//               <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-4">
//                 {`Selected exam: ${selectedExam.toUpperCase()}. How do you want to proceed?`}
//               </p>
//               <div className="grid gap-3 md:grid-cols-2">
//                 <Button
//                   variant="outline"
//                   className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 dark:text-blue-300 font-medium transition-colors"
//                   onClick={() => setSelectMode("subject")}
//                 >
//                   Select by Subject
//                 </Button>
//                 <Button
//                   variant="outline"
//                   className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/20 dark:text-green-300 font-medium transition-colors"
//                   onClick={() => setSelectMode("topic")}
//                 >
//                   Select by Topic
//                 </Button>
//               </div>
//             </div>
//           )}
//         </div>


//            {/* Step 2: Select Exam */}
//         <div className={getStepClasses(!selectedExam)}>
//           {!selectedExam && (
//             <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
//               <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">
//                 Select exam type:
//               </p>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
//                 {exams.map((ex) => (
//                   <Button
//                     key={ex}
//                     variant="outline"
//                     className="capitalize w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors font-medium"
//                     onClick={() => setSelectedExam(ex)}
//                   >
//                     {ex}
//                   </Button>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>


//         {/* Step 3a: Subject Selector */}
//         <div className={getStepClasses(selectedExam && selectMode === "subject")}>
//           {selectedExam && selectMode === "subject" && (
//             <div className=" text-blue-700 mt-0">
//               <SubjectSelector
//                 selectedExam={selectedExam}
//                 subjectData={subjectData}
//                 selectedSubjects={selectedSubjects}
//                 subjectYears={subjectYears}
//                 toggleSubject={toggleSubject}
//                 setYearForSubject={setYearForSubject}
//               />
//             </div>
//           )}
//         </div>

//         {/* Step 3b: Topic Selector */}
//         <div className={getStepClasses(selectedExam && selectMode === "topic")}>
//           {selectedExam && selectMode === "topic" && (
//             <div className="mt-0">
//               <TopicSelector
//                 selectedExam={selectedExam}
//                 subjectData={subjectData}
//                 topicData={topicData}
//                 openTopicSubject={openTopicSubject}
//                 setOpenTopicSubject={setOpenTopicSubject}
//                 topicYearFilter={topicYearFilter}
//                 selectedTopics={selectedTopics}
//                 setTopicYear={setTopicYear}
//                 toggleTopic={toggleTopic}
//               />
//             </div>
//           )}
//         </div>

//         {/* Start button */}
//         {(selectMode === "subject" && selectedSubjects.length > 0) ||
//             (selectMode === "topic" &&
//               Object.values(selectedTopics).some(
//                 (arr) => Array.isArray(arr) && arr.length > 0
//               )) ? (
//               <DialogFooter className="mt-4">
//                 <Button onClick={handleStart} className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium">
//                   Start Studying
//                 </Button>
//               </DialogFooter>
//             ) : null}
//           </DialogContent>
//         </Dialog>
//       );
// }


// src/components/ExamSelector/StudyDialog.jsx





import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import SubjectSelector from "./SubjectSelector";
import TopicSelector from "./TopicSelector";
import { useToast } from "@/components/ui/use-toast";
export default function StudyDialog(props) {
  const {
    open,
    setOpen,
    activeAction,
    selectedExam,
    setSelectedExam,
    selectMode,
    setSelectMode,
    exams,
    subjectData,
    topicData,
    selectedSubjects,
    subjectYears,
    topicYears,
    toggleSubject,
    setYearForSubject,
    selectedTopics,
    toggleTopic,
    openTopicSubject,
    setOpenTopicSubject,
    topicYearFilter,
    setTopicYear,
    handleStart,
    clearAllTopics,
    fetchTopicsForSubject,
  } = props;
  
  // Function to handle fade + slide animations
  const getStepClasses = (isVisible) =>
    `transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] transform ${
      isVisible
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 -translate-y-4 pointer-events-none"
    }`;

    const { toast } = useToast();
    const handleToggleTopic = (subjectId, topicId) => {
   const selectedSubjectIds = Object.keys(selectedTopics);

  // if user already has topics from another subject
  if (
    selectedSubjectIds.length > 0 &&
    !selectedSubjectIds.includes(subjectId.toString())
  ) {
    toast({
      title: "Only one subject allowed",
      description: "Clear your previous subject before selecting another.",
      variant: "destructive",
    });
    return;
  }

  // otherwise allow topic toggle
  toggleTopic(subjectId, topicId);
};


  // Determine currently visible subject for topic mode
  const visibleSubject =
    Object.keys(selectedTopics).find(
      (sub) => Array.isArray(selectedTopics[sub]) && selectedTopics[sub].length > 0
    ) || null;

  const hasTopicsSelectedInVisibleSubject =
    visibleSubject &&
    selectedTopics[visibleSubject] &&
    selectedTopics[visibleSubject].length > 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-3xl p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-lg md:text-xl font-semibold text-primary dark:text-gray-100">
            {activeAction === "study"
              ? "Study - Setup"
              : activeAction === "quiz"
              ? "Quiz - Setup"
              : "Exam - Setup"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1: Select Mode */}
        <div className={getStepClasses(selectedExam && !selectMode)}>
          {selectedExam && !selectMode && (
            <div className="mt-4 p-5 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-4">
                {`Selected exam: ${selectedExam.toUpperCase()}. How do you want to proceed?`}
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                <Button
                  variant="outline"
                  className="w-full border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/20 dark:text-blue-300 font-medium transition-colors"
                  onClick={() => setSelectMode("subject")}
                >
                  Select by Subject
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-500/20 dark:text-green-300 font-medium transition-colors"
                  onClick={() => setSelectMode("topic")}
                >
                  Select by Topic
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Select Exam */}
        <div className={getStepClasses(!selectedExam)}>
          {!selectedExam && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">
                Select exam type:
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {exams.map((ex) => (
                  <Button
                    key={ex}
                    variant="outline"
                    className="capitalize w-full border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-blue-500/20 transition-colors font-medium"
                    onClick={() => setSelectedExam(ex)}
                  >
                    {ex}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 3a: Subject Selector */}
        <div className={getStepClasses(selectedExam && selectMode === "subject")}>
          {selectedExam && selectMode === "subject" && (
            <div className="text-blue-700 mt-0">
              <SubjectSelector
                selectedExam={selectedExam}
                subjectData={subjectData}
                selectedSubjects={selectedSubjects}
                subjectYears={subjectYears}
                toggleSubject={toggleSubject}
                setYearForSubject={setYearForSubject}
                
              />
            </div>
          )}
        </div>

        {/* Step 3b: Topic Selector */}
        <div className={getStepClasses(selectedExam && selectMode === "topic")}>
          {selectedExam && selectMode === "topic" && (
            <div className="mt-0">

          <TopicSelector
            selectedExam={selectedExam}
            selectedTopics={selectedTopics}
            toggleTopic={handleToggleTopic}   
            setTopicYear={setTopicYear}
            topicYears={topicYears}
            clearAllTopics={clearAllTopics}
          />
          </div>)}
        </div>

        {/* Start button */}
        {(
          (selectMode === "subject" && selectedSubjects.length > 0) ||
          (selectMode === "topic" && hasTopicsSelectedInVisibleSubject)
        ) && (
          <DialogFooter className="mt-4">
            <Button
              onClick={handleStart}
              className="w-full dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-medium"
            >
              Start Studying
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
