"use client";

import { AppShell } from "@/components/layout/AppShell";
import { PurchaseOrdersKpiCard } from "@/components/cards/PurchaseOrdersKpiCard";
import { SuppliersKpiCard } from "@/components/cards/SuppliersKpiCard";
import { ShipmentsKpiCard } from "@/components/cards/ShipmentsKpiCard";
import { OverdueKpiCard } from "@/components/cards/OverdueKpiCard";
import { PoStatusChartCard } from "@/components/cards/PoStatusChartCard";
import { PurchaseOrdersTable } from "@/components/tables/PurchaseOrdersTable";

export default function HomePage() {
  return (
    <AppShell title="Dashboard" activeNavLabel="Image Library">
      <main className="p-8 space-y-6">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-3 items-start">
            <PurchaseOrdersKpiCard />
            <SuppliersKpiCard />
            <ShipmentsKpiCard />
            <OverdueKpiCard />
          </div>
          <PoStatusChartCard />
        </div>
        <PurchaseOrdersTable />
      </main>
    </AppShell>
  );
}
