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
      iconBgColor="bg-indigo-100"
      iconColor="text-indigo-500"
      trend="up"
      trendColor="text-blue-500"
      detailsHref="/purchase-order"
    />
  );
}
