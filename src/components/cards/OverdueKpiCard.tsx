import { KpiCard } from "./KpiCard";

export function OverdueKpiCard() {
  return (
    <KpiCard
      title="Overdue"
      value="12"
      delta="+3"
      deltaVariant="pink"
      description="Overdue items up by"
      highlight="4%"
      trendPct="4%"
      icon="schedule"
      bgColor="bg-white/75"
      iconBgColor="bg-pink-100"
      iconColor="text-pink-500"
      trend="up"
      trendColor="text-blue-500"
      detailsHref="/overdue"
    />
  );
}
