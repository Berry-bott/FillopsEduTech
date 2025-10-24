// export default function StudyPlanCard() {
//   return (
//     <div className="bg-card border border-border rounded-xl p-6">
//       <h3 className="text-lg font-bold text-foreground mb-4">Study Plan</h3>
//       <div className="space-y-3">
//         <div className="p-3 bg-accent rounded-lg">
//           <p className="text-sm font-medium text-foreground">Today: Mathematics - Algebra</p>
//           <p className="text-xs text-foreground/60">2 hours recommended</p>
//         </div>
//         <div className="p-3 bg-accent rounded-lg">
//           <p className="text-sm font-medium text-foreground">Tomorrow: Physics - Mechanics</p>
//           <p className="text-xs text-foreground/60">1.5 hours recommended</p>
//         </div>
//         <div className="p-3 bg-accent rounded-lg">
//           <p className="text-sm font-medium text-foreground">This Week: Chemistry Quiz</p>
//           <p className="text-xs text-foreground/60">Scheduled for Friday</p>
//         </div>
//       </div>
//     </div>
//   )
// }





export default function StudyPlanCard() {
  const studyPlan = [
    { title: "Today: Mathematics - Algebra", detail: "2 hours recommended" },
    { title: "Tomorrow: Physics - Mechanics", detail: "1.5 hours recommended" },
    { title: "This Week: Chemistry Quiz", detail: "Scheduled for Friday" },
  ]

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="border-b border-gray-100 pb-3 mb-4 flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-800">📅 Study Plan</h3>
        <span className="text-sm text-blue-600 font-medium">Weekly Goals</span>
      </div>

      {/* Study Items */}
      <div className="space-y-3">
        {studyPlan.map((item, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-300"
          >
            <p className="text-sm font-semibold text-blue-800">{item.title}</p>
            <p className="text-xs text-blue-600 mt-1">{item.detail}</p>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 text-right">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all">
          View Full Plan →
        </button>
      </div>
    </div>
  )
}
