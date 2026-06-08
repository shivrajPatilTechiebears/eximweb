import { KpiCard } from "./KpiCard";

export function ShipmentsKpiCard() {
  return (
    <KpiCard
      title="Shipments"
      value="2,899"
      delta="+400"
      deltaVariant="blue"
      description="Shipments increased by"
      highlight="25%"
      trendPct="25%"
      icon="local_shipping"
      bgColor="bg-white/75"
      iconBgColor="bg-orange-100"
      iconColor="text-orange-500"
      trend="up"
      trendColor="text-blue-500"
      detailsHref="/shipments"
    />
  );
}
