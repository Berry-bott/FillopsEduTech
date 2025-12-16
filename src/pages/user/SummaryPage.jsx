import { useLocation } from "react-router-dom";

const EXAMS = {
  waec: "WAEC",
  neco: "NECO",
  jamb: "JAMB",
  putme: "PUTME",
};

export default function SummaryPage() {
  const { state } = useLocation();

  if (!state) return <p className="p-6">No data found</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Your Selection</h1>

      {/* Display Interests */}
      {state.interests && state.interests.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Interests</h2>
          <ul className="list-disc pl-6">
            {state.interests.map((i) => (
              <li key={i}>{i}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Hobbies */}
      {state.hobbies && state.hobbies.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Hobbies</h2>
          <ul className="list-disc pl-6">
            {state.hobbies.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Goals */}
      {state.goals && state.goals.length > 0 && (
        <div className="mb-4">
          <h2 className="font-semibold">Goals</h2>
          <ul className="list-disc pl-6">
            {state.goals.map((g) => (
              <li key={g}>{g}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Display Subjects */}
      {state.subjects &&
        Object.entries(state.subjects).map(([exam, subjects]) => (
          <div key={exam} className="mb-4">
            <h2 className="font-semibold">{EXAMS[exam]}</h2>
            <ul className="list-disc pl-6">
              {Array.isArray(subjects) ? subjects.map((s) => <li key={s}>{s}</li>) : null}
            </ul>
          </div>
        ))}
    </div>
  );
}
