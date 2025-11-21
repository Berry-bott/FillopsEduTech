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
  return (
    <>
    <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">
        Select up to 4 subjects for <span className="font-semibold">{selectedExam.toUpperCase()}</span>.
      </p>
    <div className="mt-4 max-h-[450px] overflow-y-auto space-y-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
      

      {subjectData[selectedExam].map((subject) => (
        <div
          key={subject}
          className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
        >
          {/* Checkbox + Subject Name */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedSubjects.includes(subject)}
              onCheckedChange={() => toggleSubject(subject)}
              className="h-6 w-6 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400"
            />
            <span className="text-gray-800 dark:text-gray-100 font-medium">{subject}</span>
          </div>

          {/* Year selector */}
          <div>
            <select
              value={subjectYears[subject] || ""}
              onChange={(e) => setYearForSubject(subject, e.target.value)}
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition"
            >
              <option value="" disabled>
                Year
              </option>
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
    </>

  );
}
