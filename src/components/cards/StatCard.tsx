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
  accentColor = "#884D70",
  subtitle,
  className = "",
}: StatCardProps) {
  return (
    <div
      className={`bg-white/50 backdrop-blur-xl rounded-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] p-3 relative overflow-hidden group hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] hover:-translate-y-px transition-all cursor-default ${className}`}
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
