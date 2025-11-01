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
    <div className="mt-4 max-h-[420px] overflow-y-auto space-y-3">
      <p className="text-sm text-gray-700">
        Select up to 5 subjects for {selectedExam.toUpperCase()}.
      </p>

      {subjectData[selectedExam].map((subject) => (
        <div
          className="flex items-center justify-between border-b pb-2"
          key={subject}
        >
          <div className="flex items-center gap-3">
            <Checkbox
              checked={selectedSubjects.includes(subject)}
              onCheckedChange={() => toggleSubject(subject)}
            />
            <span>{subject}</span>
          </div>

          <div>
            <select
              value={subjectYears[subject] || ""}
              onChange={(e) => setYearForSubject(subject, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Year</option>
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
  );
}
