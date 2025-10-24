export default function CalendarWidget() {
  const events = [
    { date: "Oct 25", event: "WAEC Mock Exam", type: "exam" },
    { date: "Oct 28", event: "Chemistry Quiz", type: "quiz" },
    { date: "Nov 1", event: "NECO Practice", type: "exam" },
  ]

  // Color map for event types
  const typeColors = {
    exam: "from-blue-500 to-blue-700",
    quiz: "from-indigo-400 to-indigo-600",
    default: "from-gray-400 to-gray-600",
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          📆 Upcoming Events
        </h3>
        <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">
          View All
        </span>
      </div>

      {/* Event List */}
      <div className="space-y-3">
        {events.map((event, idx) => {
          const gradient = typeColors[event.type] || typeColors.default
          return (
            <div
              key={idx}
              className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-blue-200 hover:border-blue-300 transition-all duration-300"
            >
              {/* Date Badge */}
              <div
                className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm`}
              >
                {event.date}
              </div>

              {/* Event Info */}
              <div className="flex-1">
                <p className="font-semibold text-blue-900">{event.event}</p>
                <p className="text-xs text-blue-700 capitalize mt-1">
                  {event.type}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-3 border-t border-gray-100 text-right">
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-all">
          Add Event +
        </button>
      </div>
    </div>
  )
}
