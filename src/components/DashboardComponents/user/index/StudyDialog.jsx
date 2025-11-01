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
    toggleSubject,
    setYearForSubject,
    selectedTopics,
    toggleTopic,
    openTopicSubject,
    setOpenTopicSubject,
    topicYearFilter,
    setTopicYear,
    handleStart,
  } = props;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {activeAction === "learning"
              ? "Study - Setup"
              : activeAction === "quiz"
              ? "Quiz - Setup"
              : "Exam - Setup"}
          </DialogTitle>
        </DialogHeader>

        {/* Step 1 */}
        {!selectedExam && (
          <div className="mt-4">
            <p className="text-sm text-gray-700">Select exam type:</p>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {exams.map((ex) => (
                <Button
                  key={ex}
                  variant="outline"
                  className="capitalize"
                  onClick={() => setSelectedExam(ex)}
                >
                  {ex}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2 */}
        {selectedExam && !selectMode && (
          <div className="mt-4">
            <p className="text-sm text-gray-700">
              {`Selected exam: ${selectedExam.toUpperCase()}. How do you want to proceed?`}
            </p>
            <div className="mt-2 grid gap-2">
              <Button variant="outline" onClick={() => setSelectMode("subject")}>
                Select by Subject
              </Button>
              <Button variant="outline" onClick={() => setSelectMode("topic")}>
                Select by Topic
              </Button>
            </div>
          </div>
        )}

        {/* Step 3 */}
        {selectedExam && selectMode === "subject" && (
          <SubjectSelector
            selectedExam={selectedExam}
            subjectData={subjectData}
            selectedSubjects={selectedSubjects}
            subjectYears={subjectYears}
            toggleSubject={toggleSubject}
            setYearForSubject={setYearForSubject}
          />
        )}

        {selectedExam && selectMode === "topic" && (
          <TopicSelector
            selectedExam={selectedExam}
            subjectData={subjectData}
            topicData={topicData}
            openTopicSubject={openTopicSubject}
            setOpenTopicSubject={setOpenTopicSubject}
            topicYearFilter={topicYearFilter}
            selectedTopics={selectedTopics}
            setTopicYear={setTopicYear}
            toggleTopic={toggleTopic}
          />
        )}

        {/* Start button */}
        {(selectMode === "subject" && selectedSubjects.length > 0) ||
        (selectMode === "topic" &&
          Object.values(selectedTopics).some(
            (arr) => Array.isArray(arr) && arr.length > 0
          )) ? (
          <DialogFooter className="mt-4">
            <Button onClick={handleStart} className="w-full">
              Start Studying
            </Button>
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
