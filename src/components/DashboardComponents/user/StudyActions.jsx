// src/components/ExamSelector/StudyActions.jsx
import React, { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap, PenTool, FileText } from "lucide-react";

export default function StudyActions({
  examDropdownOpen,
  setExamDropdownOpen,
  exams,
  onSelectExam,
  openFor,
}) {
  const dropdownRef = useRef(null);

  // 🔥 Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setExamDropdownOpen(false);
      }
    }

    if (examDropdownOpen) {
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }

    return () => document.removeEventListener("click", handleClickOutside);
  }, [examDropdownOpen]);

  return (
    <div className="flex gap-2 md:gap-6">
      {/* Study button */}
      <div className="relative inline-block" ref={dropdownRef}>
        <Button
          onClick={() => setExamDropdownOpen((s) => !s)}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-1 px-4"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Study</span>
        </Button>

        {/* 🔥 Fully Enhanced Dropdown */}
        <div
          className={`absolute mt-2 w-[230px] bg-white dark:bg-gray-900 
            rounded-2xl shadow-2xl border border-blue-400/40 
            z-30 overflow-hidden transform-gpu 
            transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)]
            origin-top
            ${
              examDropdownOpen
                ? "max-h-96 opacity-100 scale-100"
                : "max-h-0 opacity-0 scale-95"
            }
          `}
        >
        {exams.map((ex, index) => (
          <button
            key={ex}
            style={{
              transitionDelay: examDropdownOpen ? `${index * 40}ms` : "0ms",
            }}
            className="w-full text-left px-4 py-3 capitalize font-inter text-sm transition-all duration-200 hover:bg-blue-50/80 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-300"
            onClick={() => onSelectExam(ex)}
          > {ex}
          </button>
        ))}
        </div>
      </div>

      {/* Quiz button */}
      <Button
        onClick={() => openFor("quiz")}
        className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2 px-4"
      >
        <PenTool className="w-4 h-4" />
        <span>Take Quiz</span>
      </Button>

      {/* Exam button */}
      <Button
        onClick={() => openFor("exam")}
        className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2 px-4"
      >
        <FileText className="w-4 h-4" />
        <span>Write Exam</span>
      </Button>
    </div>
  );
}
