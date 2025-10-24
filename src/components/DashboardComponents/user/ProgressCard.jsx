export default function ProgressCard({ subject, progress }) {
    return (
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="font-semibold text-foreground mb-3">{subject}</h3>
        <div className="w-full bg-accent rounded-full h-2 mb-2">
          <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-sm text-foreground/60">{progress}% Complete</p>
      </div>
    )
  }
  