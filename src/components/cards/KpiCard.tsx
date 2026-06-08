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
  description,
  highlight,
  trendPct,
  icon,
  bgColor,
  iconBgColor,
  iconColor,
  trend = "up",
  trendColor = "text-blue-500",
  detailsHref = "#",
}: KpiCardProps) {
  return (
    <div className={`${bgColor} p-3.5 rounded-2xl border border-white flex flex-col gap-2`}>
      {/* Icon + See Details */}
      <div className="flex justify-between items-center">
        <div className={`${iconBgColor} p-1.5 rounded-lg`}>
          <Icon name={icon} className={`${iconColor} text-[20px]`} />
        </div>
        <Link
          href={detailsHref}
          className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-0.5 rounded-lg border border-gray-100 hover:bg-gray-50 hover:text-gray-700 transition-colors"
        >
          See Details
        </Link>
      </div>

      {/* Title */}
      <h4 className="text-gray-500 font-medium text-sm">{title}</h4>

      {/* Value + Delta */}
      <div className="flex items-baseline gap-2">
        <span className="text-[26px] font-bold text-gray-900 leading-none">{value}</span>
        <span
          className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
            deltaVariant === "pink"
              ? "text-pink-600 bg-pink-100"
              : "text-blue-600 bg-blue-100"
          }`}
        >
          {delta}
        </span>
      </div>

      {/* Description + Trend */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] text-gray-400 max-w-[95px] leading-snug">
          {description}{" "}
          <span className="text-gray-900 font-bold">{highlight}</span> in last 7 days
        </p>
        <div className={`flex items-center gap-0.5 ${trendColor}`}>
          <Icon
            name={trend === "down" ? "trending_down" : "trending_up"}
            className="text-[18px]"
          />
          <span className="text-[11px] font-bold">{trendPct}</span>
        </div>
      </div>
    </div>
  );
}
