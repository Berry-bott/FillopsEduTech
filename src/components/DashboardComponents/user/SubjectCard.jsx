"use client"

export default function SubjectCard({ subject, progress, onSelect }) {
  return (
    <button
      onClick={() => onSelect(subject)}
      className="p-6 bg-card border border-border rounded-xl hover:border-primary hover:shadow-lg transition text-left"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{subject}</h3>
          <p className="text-sm text-foreground/60 mt-1">Click to start learning</p>
        </div>
        <div className="text-2xl">📖</div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-xs text-foreground/60">Progress</span>
          <span className="text-sm font-semibold text-primary">{progress}%</span>
        </div>
        <div className="w-full bg-accent rounded-full h-2">
          <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-2 mt-4 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-xs text-foreground/60">Topics</p>
          <p className="text-sm font-semibold text-foreground">12</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-foreground/60">Tests</p>
          <p className="text-sm font-semibold text-foreground">5</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-foreground/60">Avg Score</p>
          <p className="text-sm font-semibold text-foreground">72%</p>
        </div>
      </div>
    </button>
  )
}
