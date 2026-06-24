import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

type DeltaVariant = "blue" | "pink";
type TrendDirection = "up" | "down";

interface KpiCardProps {
  title: string;
  value: string;
  delta: string;
  deltaVariant?: DeltaVariant;
  description: string;
  highlight: string;
  trendPct: string;
  icon: string;
  bgColor: string;
  iconBgColor: string;
  iconColor: string;
  trend?: TrendDirection;
  trendColor?: string;
  detailsHref?: string;
}

export function KpiCard({
  title,
  value,
  delta,
  deltaVariant = "blue",
  trendPct,
  icon,
  iconBgColor,
  iconColor,
  trend = "up",
  detailsHref = "#",
}: KpiCardProps) {
  const progressBg = iconColor.replace("text-", "bg-");

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
      {/* Icon + badge */}
      <div className="flex items-start justify-between mb-3">
        <div className={`${iconBgColor} p-2.5 rounded-xl`}>
          <Icon name={icon} className={`${iconColor} text-[18px]`} />
        </div>
        <span
          className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
            deltaVariant === "pink"
              ? "text-rose-600 bg-rose-50"
              : "text-[#884D70] bg-[#FFDBCB]/40"
          }`}
        >
          {delta}
        </span>
      </div>

      {/* Value */}
      <p className="text-2xl font-black text-slate-900 tracking-tight leading-none">{value}</p>
      <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{title}</p>

      {/* Progress bar */}
      <div className="mt-3.5 h-0.5 w-full bg-[#FFDBCB]/50 rounded-full overflow-hidden">
        <div className={`h-full ${progressBg} rounded-full`} style={{ width: trendPct }} />
      </div>

      {/* See details link */}
      <div className="mt-3 flex items-center justify-between">
        <span className={`flex items-center gap-0.5 text-[9px] font-semibold ${trend === "down" ? "text-rose-400" : "text-emerald-500"}`}>
          <Icon name={trend === "down" ? "trending_down" : "trending_up"} className="text-[14px]" />
          {trendPct}
        </span>
        <Link
          href={detailsHref}
          className="text-[9px] font-semibold text-slate-400 hover:text-slate-600 transition-colors"
        >
          See details →
        </Link>
      </div>
    </div>
  );
}
