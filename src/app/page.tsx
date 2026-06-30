"use client";

import { PurchaseOrdersTable } from "@/components/tables/PurchaseOrdersTable";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";
import { StatTile } from "@/components/ui/StatTile";
import { DashboardPageHeader } from "@/components/layout/PageHeader";
import { PoTrendChartCard } from "@/components/cards/PoTrendChartCard";
import { OrderSummaryCard } from "@/components/cards/OrderSummaryCard";
import { OrderBreakdownCard } from "@/components/cards/OrderBreakdownCard";

const STAT_TILES = [
  {
    label: "Active POs",
    value: "1,482",
    delta: "+15%",
    trend: "up" as const,
    barWidth: "74%",
    barTrackClass: "bg-[#FFDBCB]/50",
    barFillClass: "bg-[#884D70]",
    hint: "518 remaining · 8 days left",
  },
  {
    label: "Shipments",
    value: "2,899",
    delta: "+8%",
    trend: "up" as const,
    barWidth: "83%",
    barTrackClass: "bg-gray-100",
    barFillClass: "bg-sky-400",
    hint: "Intransit: 1,204 · Confirmed: 1,695",
  },
  {
    label: "Active Suppliers",
    value: "234",
    delta: "+3%",
    trend: "up" as const,
    barWidth: "78%",
    barTrackClass: "bg-gray-100",
    barFillClass: "bg-emerald-400",
    hint: "7 new onboarded this month",
  },
  {
    label: "Order Value",
    value: "$35.6k",
    delta: "−4%",
    trend: "down" as const,
    barWidth: "62%",
    barTrackClass: "bg-gray-100",
    barFillClass: "bg-orange-400",
    hint: "Target $57.4k · Gap $21.8k",
  },
];


// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-transparent">

      <FloatingNavbar />
      <SecondaryNav />

      {/* ═══════ GREETING + ACTIVE POs STRIP ═══════ */}
      <DashboardPageHeader
        title="Welcome Back, Shivam Chaudhari 👋"
        breadcrumbs={[{ label: "📅 Wednesday, 24 March 2026" }]}
      />

      {/* ═══════════════════════ CONTENT GRID ═══════════════════════ */}
      <main className="flex-1 px-6 py-3 grid grid-cols-12 gap-3 content-start">

        {/* ── Stat tiles ── */}
        {STAT_TILES.map((tile) => (
          <StatTile key={tile.label} {...tile} />
        ))}

        {/* ── PO Trend chart ── */}
        <section className="col-span-6 dash-card">
          <PoTrendChartCard />
        </section>

        {/* ── Order Summary ── */}
        <section className="col-span-3 dash-card flex flex-col justify-between">
          <OrderSummaryCard />
        </section>

        {/* ── Order Breakdown ── */}
        <section className="col-span-3 dash-card">
          <OrderBreakdownCard />
        </section>

        {/* ── Table ── */}
        <div className="col-span-12">
          <PurchaseOrdersTable />
        </div>


      </main>
      {/* ═══════════════════════ END CONTENT GRID ═══════════════════════ */}

    </div>
  );
}
