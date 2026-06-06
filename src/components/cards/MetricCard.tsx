interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
}

export function MetricCard({ title, value, subtitle }: MetricCardProps) {
  return (
    <div className="bg-white p-3 rounded-lg border border-outline-variant shadow-sm hover:shadow transition-shadow">
      <p className="font-body-sm text-[11px] text-on-surface-variant mb-0.5">{title}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-on-surface">{value}</span>
        <span className="text-[9px] text-on-surface-variant/60 uppercase">{subtitle}</span>
      </div>
    </div>
  );
}
