import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, PenTool, FileText } from "lucide-react";

// ✅ Subject structure by Exam & Subcategory
const subjectData = {
  jamb: {
    science: ["English", "Maths", "Physics", "Chemistry", "Biology"],
    art: ["English", "Government", "Literature", "CRS"],
    commercial: ["English", "Commerce", "Accounting", "Economics"],
  },
  waec: {
    science: ["Biology", "Chemistry", "Physics", "Maths", "English"],
    art: ["Literature", "CRS", "Government", "English"],
    commercial: ["Accounting", "Commerce", "Economics", "Maths"],
  },
  neco: {
    science: ["English", "Maths", "Biology", "Chemistry", "Physics"],
    art: ["English", "Government", "Literature"],
    commercial: ["Commerce", "Accounting", "Economics"],
  },
  putme: {
    science: ["Use of English", "Physics", "Chemistry", "Biology"],
    art: ["Use of English", "Government", "CRS", "Literature"],
    commercial: ["Use of English", "Commerce", "Accounting", "Economics"],
  },
};

export default function ExamSelector() {
  const [activeAction, setActiveAction] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  // Open modal when user clicks any main button
  const handleActionClick = (action) => {
    setActiveAction(action);
    setSelectedExam(null);
    setSelectedSubcategory(null);
    setSelectedSubjects([]);
    setOpen(true);
  };

  const handleToggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  const handleContinue = () => {
    setOpen(false);

    // Navigate based on selected action
    if (activeAction === "learning") navigate("/learning-path");
    if (activeAction === "test") navigate("/take-test");
    if (activeAction === "exam") navigate("/write-exam");
  };

  return (
    <div className="flex flex-col items-center justify-center mt-10 space-y-6 ">

      {/* === 3 Main Action Buttons === */}
      <div className="flex flex-wrap justify-center gap-4">
        <Button
          onClick={() => handleActionClick("learning")}
          className="bg-blue-600 hover:bg-blue-700 text-white flex items-center space-x-2"
        >
          <GraduationCap className="w-4 h-4" />
          <span>Study</span>
        </Button>

        <Button
          onClick={() => handleActionClick("test")}
          className="bg-green-600 hover:bg-green-700 text-white flex items-center space-x-2"
        >
          <PenTool className="w-4 h-4" />
          <span>Take Quiz</span>
        </Button>

        <Button
          onClick={() => handleActionClick("exam")}
          className="bg-purple-600 hover:bg-purple-700 text-white flex items-center space-x-2"
        >
          <FileText className="w-4 h-4" />
          <span>Write Exam</span>
        </Button>
      </div>

      {/* === Modal for Category + Subcategory + Subjects === */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {activeAction === "learning"
                ? "Choose Learning Category"
                : activeAction === "test"
                ? "Choose Test Category"
                : "Choose Exam Category"}
            </DialogTitle>
          </DialogHeader>

          {/* Step 1: Select Exam Category */}
          {!selectedExam && (
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium text-gray-700">Select Exam Type:</p>
              {["jamb", "waec", "neco", "putme"].map((exam) => (
                <Button
                  key={exam}
                  variant="outline"
                  className="w-full capitalize"
                  onClick={() => setSelectedExam(exam)}
                >
                  {exam}
                </Button>
              ))}
            </div>
          )}

          {/* Step 2: Select Subcategory */}
          {selectedExam && !selectedSubcategory && (
            <div className="space-y-2 mt-4">
              <p className="text-sm font-medium text-gray-700">Choose a Subcategory:</p>
              {["science", "art", "commercial"].map((sub) => (
                <Button
                  key={sub}
                  variant="outline"
                  className="w-full capitalize"
                  onClick={() => setSelectedSubcategory(sub)}
                >
                  {sub}
                </Button>
              ))}
            </div>
          )}

          {/* Step 3: Select Subjects */}
          {selectedExam && selectedSubcategory && (
            <div className="space-y-3 mt-4">
              <p className="text-sm font-medium text-gray-700">Select Subjects:</p>
              {subjectData[selectedExam][selectedSubcategory].map((subject) => (
                <div
                  key={subject}
                  className="flex items-center space-x-3 border-b border-gray-200 pb-2"
                >
                  <Checkbox
                    checked={selectedSubjects.includes(subject)}
                    onCheckedChange={() => handleToggleSubject(subject)}
                  />
                  <span className="text-sm">{subject}</span>
                </div>
              ))}
            </div>
          )}

          {/* Step 4: Continue */}
          {selectedSubjects.length > 0 && (
            <DialogFooter className="mt-6">
              <Button onClick={handleContinue} className="w-full">
                Continue
              </Button>
            </DialogFooter>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
