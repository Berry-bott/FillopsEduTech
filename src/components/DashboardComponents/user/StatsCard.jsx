export default function StatsCard({ icon, label, value, trend }) {
  return (
    <div className="bg-card border border-border rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {trend && (
          <span className={`text-xs font-semibold ${trend > 0 ? "text-green-600" : "text-red-600"}`}>
            {trend > 0 ? "+" : ""}
            {trend}%
          </span>
        )}
      </div>
      <p className="text-sm text-foreground/60 mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">{value}</p>
    </div>
  )
}
