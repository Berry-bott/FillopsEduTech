// src/components/ExamSelector/TopicSelector.jsx
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { YEARS } from "./data";

export default function TopicSelector({
  selectedExam,
  subjectData,
  topicData,
  openTopicSubject,
  setOpenTopicSubject,
  topicYearFilter,
  selectedTopics,
  setTopicYear,
  toggleTopic,
}) {
  return (
    <div className="mt-4 max-h-[420px] overflow-y-auto space-y-3">
      <p className="text-sm text-gray-700">
        Select topics (hover a subject to view topics).
      </p>

      {subjectData[selectedExam].map((subject) => (
        <div
          key={subject}
          className="border rounded p-3 relative"
          onMouseEnter={() => setOpenTopicSubject(subject)}
          onMouseLeave={() => setOpenTopicSubject(null)}
        >
          <div className="flex items-center justify-between">
            <div className="font-medium">{subject}</div>
            <select
              value={topicYearFilter[subject] || ""}
              onChange={(e) => setTopicYear(subject, e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="">Year (All)</option>
              <option value="random">Random</option>
              {YEARS.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {openTopicSubject === subject && (
            <div className="mt-2 grid grid-cols-2 gap-2">
              {(topicData[subject] || []).map((topic) => (
                <label
                  key={topic}
                  className="flex items-center gap-2 text-sm"
                >
                  <Checkbox
                    checked={selectedTopics[subject]?.includes(topic) || false}
                    onCheckedChange={() => toggleTopic(subject, topic)}
                  />
                  <span>{topic}</span>
                </label>
              ))}
              {!topicData[subject] && (
                <div className="text-xs text-gray-500">
                  No topics defined for this subject.
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
