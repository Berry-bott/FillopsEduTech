// src/components/ExamSelector/SubjectSelector.jsx
import React, { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import useAuthStore from "../../../store/authStore";

export default function SubjectSelector({
  selectedExam,
  selectedSubjects = [],
  toggleSubject,
  subjectYears = {},
  setYearForSubject,
}) {
  const { accessToken } = useAuthStore();

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch subjects when exam changes
  useEffect(() => {
    if (!selectedExam || !accessToken) return;

    setLoading(true);
    setError(null);

    fetch(`https://fillops-server-5fuf.onrender.com/api/subjects?category=${selectedExam}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch subjects");
        return res.json();
      })
      .then((data) => setSubjects(data.data || []))
      .catch(() => setError("Unable to load subjects"))
      .finally(() => setLoading(false));
  }, [selectedExam, accessToken]);

  if (!selectedExam) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-3">
        Select up to 4 subjects for{" "}
        <span className="font-semibold">{selectedExam.toUpperCase()}</span>
      </p>

      {loading && (
        <div className="flex flex-col items-center justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-400 border-dashed rounded-full animate-spin"></div>
          <p>Loading subjects...</p>
        </div>
      )}
      {error && <p className="text-red-500">{error}</p>}

      <div className="space-y-4 max-h-[450px] overflow-y-auto p-3 bg-gray-50 dark:bg-gray-800 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700">
        {subjects.map((subject) => {
          const years = [...new Set(subject.question.map((q) => q.year))];

          return (
            <div
              key={subject.id}
              className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-b-0"
            >
              {/* Subject checkbox */}
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

              {/* Year select */}
              <select
                value={subjectYears[subject.id] || ""}
                onChange={(e) => setYearForSubject(subject.id, e.target.value)}
                className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 transition hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                <option value="" disabled>
                  Select Year
                </option>
                <option value="random">Random</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}
