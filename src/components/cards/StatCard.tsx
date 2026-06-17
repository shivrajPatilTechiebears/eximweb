interface StatCardProps {
  title: string;
  value: string | number;
  badge?: string;
  badgeClassName?: string;
  accentColor?: string;
  subtitle?: string;
  className?: string;
}

export default function StatCard({
  title,
  value,
  badge,
  badgeClassName = "text-gray-500 bg-gray-100",
  accentColor = "#8470ff",
  subtitle,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_3px_rgba(0,0,0,0.07)] p-3 relative overflow-hidden group hover:shadow-[0_4px_12px_rgba(0,0,0,0.09)] hover:-translate-y-px transition-all cursor-default ${className}`}
    >
      <div
        className="absolute top-0 left-0 right-0 h-[3px] rounded-t-xl"
        style={{ backgroundColor: accentColor }}
      />
      <div className="flex items-center justify-between mt-0.5 mb-2">
        <span className="text-[9px] text-gray-400 font-semibold uppercase tracking-widest">
          {title}
        </span>
        {badge && (
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeClassName}`}>
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
        {subtitle && (
          <p className="text-[9px] text-gray-400 pb-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
