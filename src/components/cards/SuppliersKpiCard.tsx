import { KpiCard } from "./KpiCard";

export function SuppliersKpiCard() {
  return (
    <KpiCard
      title="Suppliers"
      value="234"
      delta="+12"
      deltaVariant="pink"
      description="Rates decreased by"
      highlight="4%"
      trendPct="4%"
      icon="inventory_2"
      bgColor="bg-white/75"
      iconBgColor="bg-green-100"
      iconColor="text-green-500"
      trend="down"
      trendColor="text-pink-500"
      detailsHref="/suppliers"
    />
  );
}
