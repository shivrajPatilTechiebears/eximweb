import { Icon } from "@/components/ui/Icon";

interface MetricCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon?: string;
  iconBg?: string;
  iconColor?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon,
  iconBg = "bg-gray-100",
  iconColor = "text-gray-500",
}: MetricCardProps) {
  return (
    <div className="bg-white/75 px-4 py-3 rounded-xl border border-white shadow-sm hover:shadow-md transition-shadow flex items-center gap-3">
      {icon && (
        <div className={`${iconBg} w-9 h-9 rounded-xl flex items-center justify-center shrink-0`}>
          <Icon name={icon} size={18} className={iconColor} />
        </div>
      )}
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-500 leading-none mb-1">{title}</p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xl font-bold text-gray-900 leading-none">{value}</span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wide">{subtitle}</span>
        </div>
      </div>
    </div>
  );
}
