export default function Recommendations({ user }) {
  const recommendations = [
    {
      id: 1,
      title: "Focus on Weak Areas",
      description: "Chemistry needs more attention - currently at 55%",
      action: "Study Chemistry",
      priority: "high",
    },
    {
      id: 2,
      title: "Practice Mock Exams",
      description: "You haven't taken a mock exam in 3 days",
      action: "Take Exam",
      priority: "medium",
    },
    {
      id: 3,
      title: "Join Study Group",
      description: "Physics study group is discussing Mechanics today",
      action: "Join Group",
      priority: "low",
    },
  ]

  const priorityColors = {
    high: "bg-red-50 border-red-200",
    medium: "bg-yellow-50 border-yellow-200",
    low: "bg-blue-50 border-blue-200",
  }

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <h2 className="text-xl font-bold text-foreground mb-4">Personalized Recommendations</h2>
      <div className="space-y-3">
        {recommendations.map((rec) => (
          <div key={rec.id} className={`p-4 border rounded-lg ${priorityColors[rec.priority]}`}>
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-foreground">{rec.title}</h3>
              <span
                className={`text-xs font-semibold px-2 py-1 rounded capitalize ${
                  rec.priority === "high"
                    ? "bg-red-200 text-red-800"
                    : rec.priority === "medium"
                      ? "bg-yellow-200 text-yellow-800"
                      : "bg-blue-200 text-blue-800"
                }`}
              >
                {rec.priority}
              </span>
            </div>
            <p className="text-sm text-foreground/70 mb-3">{rec.description}</p>
            <button className="text-sm font-semibold text-primary hover:underline">{rec.action} →</button>
          </div>
        ))}
      </div>
    </div>
  )
}
