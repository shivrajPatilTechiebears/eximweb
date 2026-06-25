interface StatTileProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
  barWidth: string;
  barTrackClass: string;
  barFillClass: string;
  hint: string;
}

export function StatTile({
  label,
  value,
  delta,
  trend,
  barWidth,
  barTrackClass,
  barFillClass,
  hint,
}: StatTileProps) {
  return (
    <div className="col-span-3 card-glass card-glass-lift rounded-xl p-3.5 group cursor-default">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[10px] text-gray-400 font-medium">{label}</span>
        <span className={`stat-delta ${trend === "up" ? "stat-delta-up" : "stat-delta-down"}`}>
          {delta}
        </span>
      </div>
      <p className="text-xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
      <div className={`stat-bar-track ${barTrackClass}`}>
        <div className={`stat-bar-fill ${barFillClass}`} style={{ width: barWidth }} />
      </div>
      <p className="stat-hint">{hint}</p>
    </div>
  );
}
