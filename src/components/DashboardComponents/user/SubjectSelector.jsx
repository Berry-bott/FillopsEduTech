import React from "react";
import { Checkbox } from "@/components/ui/checkbox";

export default function SubjectSelector({
  selectedExam,
  subjectData,
  selectedSubjects,
  subjectYears,
  toggleSubject,
  setYearForSubject,
}) {
  console.log("Selected Exam:", selectedExam);
  console.log("Subjects Data:", subjectData);

  // Safely get subjects array from API response
  const subjects = subjectData?.data || [];
  console.log(subjects);

  if (!selectedExam) return null;

  return (
    <>
      <p className="text-sm text-gray-700 dark:text-gray-300 font-medium mb-3">
        Select up to 4 subjects for{" "}
        <span className="font-semibold">{selectedExam.toUpperCase()}</span>.
      </p>

      <div className="mt-4 max-h-[450px] overflow-y-auto space-y-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
        {subjects.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center">
            No subjects available for {selectedExam}.
          </p>
        )}

        {subjects.map((subject) => {
          // ✅ Extract UNIQUE years from the questions array
          const years = [...new Set(subject.question.map((q) => q.year))];

          return (
            <div
              key={subject.id}
              className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
            >
              {/* Checkbox + Subject Name */}
              <div className="flex items-center gap-3">
                <Checkbox
                  checked={selectedSubjects.includes(subject.id)}
                  onCheckedChange={() => toggleSubject(subject.id)}
                  className="h-6 w-6 rounded border-gray-300 dark:border-gray-500 text-blue-600 dark:text-blue-400"
                />
                <span className="text-gray-800 dark:text-gray-100 font-medium">
                  {subject.subjectName}
                </span>
              </div>

              {/* Year selector */}
              <div>
                  <select
                  value={subjectYears[subject.id] || ""}
                  onChange={(e) => setYearForSubject(subject.id, e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 bg-white  dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100"
                >
                  <option value="" disabled >
                    Select Year
                  </option>

                  <option value="random" className="hover:bg-gray-900">Random</option>

                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>

              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
