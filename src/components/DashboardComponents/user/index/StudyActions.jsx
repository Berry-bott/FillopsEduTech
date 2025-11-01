// src/components/ExamSelector/StudyActions.jsx
import React from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, PenTool, FileText } from "lucide-react";

export default function StudyActions({
  examDropdownOpen,
  setExamDropdownOpen,
  exams,
  onSelectExam,
  openFor,
}) {
  return (
    <div className="flex gap-3">
      {/* Study button */}
      <div className="relative inline-block">
        <Button
          onClick={() => setExamDropdownOpen((s) => !s)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Study</span>
        </Button>

        {examDropdownOpen && (
          <div className="absolute mt-2 w-40 bg-white dark:bg-gray-800 rounded shadow border z-30">
            {exams.map((ex) => (
              <button
                key={ex}
                className="w-full text-left px-4 py-2 capitalize hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => onSelectExam(ex)}
              >
                {ex}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Quiz button */}
      <Button
        onClick={() => openFor("quiz")}
        className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
      >
        <PenTool className="w-4 h-4" />
        <span>Take Quiz</span>
      </Button>

      {/* Exam button */}
      <Button
        onClick={() => openFor("exam")}
        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
      >
        <FileText className="w-4 h-4" />
        <span>Write Exam</span>
      </Button>
    </div>
  );
}
