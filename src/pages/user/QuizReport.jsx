import { useQuizStore } from "@/store/quizStore";

export default function QuizReport() {
  const { score, percentage, grade, report } = useQuizStore();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Quiz Result</h1>

      <div className="p-4 rounded bg-gray-100">
        <p>Score: {score} / {report.length}</p>
        <p>Percentage: {percentage}%</p>
        <p className="font-semibold">Grade: {grade}</p>
      </div>

      <hr />

      {report.map((q, idx) => (
        <div key={q.id} className="space-y-2">
          <p className="font-semibold">
            {idx + 1}. {q.question}
          </p>

          <p>Your Answer: {q.selected || "None"}</p>
          <p>Correct Answer: {q.correct}</p>

          <p
            className={
              q.isCorrect ? "text-green-600" : "text-red-600"
            }
          >
            {q.isCorrect ? "Correct" : "Wrong"}
          </p>

          {q.explanation && (
            <p className="text-sm text-gray-600">
              Explanation: {q.explanation}
            </p>
          )}

          <hr />
        </div>
      ))}
    </div>
  );
}
