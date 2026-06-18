import { KpiCard } from "./KpiCard";

export function PurchaseOrdersKpiCard() {
  return (
    <KpiCard
      title="Purchase Orders"
      value="1,482"
      delta="+115"
      deltaVariant="blue"
      description="POs increased by"
      highlight="15%"
      trendPct="25%"
      icon="shopping_cart"
      bgColor="bg-white/75"
      iconBgColor="bg-[#FFDBCB]/60"
      iconColor="text-[#884D70]"
      trend="up"
      trendColor="text-blue-500"
      detailsHref="/purchase-order"
    />
  );
}
