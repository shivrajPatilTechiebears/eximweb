"use client";

import Link from "next/link";
import { PurchaseOrdersTable } from "@/components/tables/PurchaseOrdersTable";
import { BarChart, Bar, BarXAxis, Grid, ChartTooltip, LinearGradient } from "@/components/ui/bar-chart";
import { FloatingNavbar } from "@/components/layout/FloatingNavbar";
import { SecondaryNav } from "@/components/layout/SecondaryNav";

const PO_TREND_DATA = [
  { month: "Jan", orders: 68 },
  { month: "Feb", orders: 52 },
  { month: "Mar", orders: 84 },
  { month: "Apr", orders: 76 },
  { month: "May", orders: 91 },
  { month: "Jun", orders: 100 },
  { month: "Jul", orders: 88 },
  { month: "Aug", orders: 105 },
  { month: "Sep", orders: 79 },
  { month: "Oct", orders: 72 },
  { month: "Nov", orders: 61 },
  { month: "Dec", orders: 74 },
];

// Derived from real PO table data: Shipped $19,200 | Pending $12,200 | Delayed $4,200
const ORDER_BREAKDOWN = [
  { emoji: "📦", label: "Shipped",    pct: "54%", value: "$19,200", bg: "bg-green-50"  },
  { emoji: "⏳", label: "Pending",    pct: "34%", value: "$12,200", bg: "bg-yellow-50" },
  { emoji: "⚠️",  label: "Delayed",   pct: "12%", value: "$4,200",  bg: "bg-red-50"    },
];

// ── Tiny helpers ──────────────────────────────────────────────────────────────

function ChevronRight() {
  return (
    <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col antialiased text-slate-800 bg-gray-50">

      <FloatingNavbar />
      <SecondaryNav />

      {/* ═══════ GREETING + ACTIVE POs STRIP ═══════ */}
      <div className="pt-16 bg-white border-b border-gray-100 px-10 py-3 flex items-center justify-between shrink-0">
        <div>
          <p className="text-sm font-bold text-slate-800">Welcome Back, Shivam Chaudhari 👋</p>
          <p className="text-[11px] text-gray-400 mt-0.5">📅 Wednesday, 24 March 2026</p>
        </div>
        <div className="flex items-center gap-2.5">
          <p className="text-[10px] text-gray-400">Active POs · March 2026</p>
          <div className="w-28 bg-gray-100 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-[#8470ff] rounded-full" style={{ width: "74%" }} />
          </div>
          <span className="text-[11px] font-bold text-slate-700">1,482 / 2,000</span>
          <span className="text-[9px] text-gray-400">· 518 left · 8 days</span>
        </div>
      </div>

      {/* ═══════════════════════ CONTENT GRID ═══════════════════════ */}
      <main className="flex-1 px-6 py-3 grid grid-cols-12 gap-3 bg-gray-50 content-start">

        {/* ── Stat tiles ── */}
        <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-sm hover:-translate-y-px transition-all group cursor-default">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 font-medium">Active POs</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">+15%</span>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight leading-none">1,482</p>
          <div className="mt-2 h-0.75 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-[#8470ff] rounded-full" style={{ width: "74%" }} />
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">518 remaining · 8 days left</p>
        </div>

        <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-sm hover:-translate-y-px transition-all group cursor-default">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 font-medium">Shipments</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">+8%</span>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight leading-none">2,899</p>
          <div className="mt-2 h-0.75 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-sky-400 rounded-full" style={{ width: "83%" }} />
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">Intransit: 1,204 · Confirmed: 1,695</p>
        </div>

        <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-sm hover:-translate-y-px transition-all group cursor-default">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 font-medium">Active Suppliers</span>
            <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">+3%</span>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight leading-none">234</p>
          <div className="mt-2 h-0.75 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400 rounded-full" style={{ width: "78%" }} />
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">7 new onboarded this month</p>
        </div>

        <div className="col-span-3 bg-white rounded-xl border border-gray-100 p-3.5 hover:shadow-sm hover:-translate-y-px transition-all group cursor-default">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] text-gray-400 font-medium">Order Value</span>
            <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1.5 py-0.5 rounded-full">−4%</span>
          </div>
          <p className="text-xl font-black text-slate-900 tracking-tight leading-none">$35.6k</p>
          <div className="mt-2 h-0.75 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 rounded-full" style={{ width: "62%" }} />
          </div>
          <p className="text-[9px] text-gray-400 mt-1.5 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-150">Target $57.4k · Gap $21.8k</p>
        </div>

        {/* ── PO Trend chart ── */}
        <section className="col-span-6 bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-baseline gap-2">
              <span className="text-[11px] font-bold text-slate-800">PO Trend</span>
              <span className="text-[10px] text-gray-400">Monthly · 2026</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-[9px] text-emerald-500 font-semibold">+115 this month</span>
              <span className="text-base font-black text-slate-900">4,740</span>
              <Link href="/purchase-order" className="text-[9px] text-gray-400 hover:text-slate-700 transition-colors">See all →</Link>
            </div>
          </div>

          <BarChart
            data={PO_TREND_DATA}
            xDataKey="month"
            aspectRatio="auto"
            className="h-57.5"
            margin={{ top: 20, right: 12, bottom: 34, left: 12 }}
            barGap={0.3}
            animationDuration={900}
          >
            <LinearGradient from="hsl(217, 91%, 60%)" id="poGradient" to="hsl(280, 87%, 65%)" />
            <Grid horizontal numTicksRows={3} strokeDasharray="4,4" />
            <Bar dataKey="orders" fill="url(#poGradient)" lineCap={6} stroke="hsl(217, 91%, 60%)" fadedOpacity={0.35} />
            <BarXAxis showAllLabels tickerHalfWidth={24} />
            <ChartTooltip
              rows={(point) => [{ color: "hsl(217, 91%, 60%)", label: "POs", value: point.orders as number }]}
            />
          </BarChart>
        </section>

        {/* ── Order Summary (My Balance style) ── */}
        <section className="col-span-3 bg-white rounded-2xl border border-gray-100 p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-[12px] font-bold text-slate-800">My Orders</h3>
              <p className="text-[10px] text-gray-400 mt-0.5">Monitoring monthly PO activity</p>
            </div>
            <button className="text-gray-300 hover:text-gray-500 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
              </svg>
            </button>
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 leading-none">1,482</h2>
            <p className="text-[10px] font-bold text-emerald-500 mt-1">
              +15% <span className="text-gray-400 font-normal">from last month</span>
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-[10px] mb-1.5">
                <span className="text-gray-400">Total Shipments</span>
                <span className="font-bold text-slate-700">2,899</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#8470ff] rounded-full" style={{ width: "83%" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] mb-1.5">
                <span className="text-gray-400">Active Suppliers</span>
                <span className="font-bold text-slate-700">234</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: "78%" }} />
              </div>
            </div>
          </div>

          <Link
            href="/purchase-order/create"
            className="bg-gray-50 p-3 rounded-xl flex items-center justify-between border border-gray-100 hover:bg-gray-100 transition-colors group/cta"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-[#8470ff] rounded-lg flex items-center justify-center text-white text-[9px] font-bold shrink-0">PO</div>
              <div>
                <p className="text-[10px] font-bold text-slate-700">Create Purchase Order</p>
                <p className="text-[9px] text-gray-400">Add a new order to pipeline</p>
              </div>
            </div>
            <ChevronRight />
          </Link>
        </section>

        {/* ── Order Breakdown ── */}
        <section className="col-span-3 bg-white rounded-2xl border border-gray-100 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-slate-800">Order Breakdown</span>
            <Link href="/purchase-order" className="text-[9px] text-gray-400 hover:text-slate-700 transition-colors">See all →</Link>
          </div>

          {/* Conic-gradient donut */}
          <div className="relative flex justify-center mb-3">
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{ background: "conic-gradient(#22c55e 0% 54%, #facc15 54% 88%, #ef4444 88% 100%)" }}
            >
              <div className="w-20 h-20 bg-white rounded-full flex flex-col items-center justify-center text-center">
                <p className="text-[9px] text-gray-400">Total</p>
                <p className="text-sm font-bold text-slate-900">$35.6k</p>
              </div>
            </div>
            {/* Floating % badges */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-3 left-5 text-[9px] font-bold bg-white px-1.5 py-0.5 rounded-full border border-gray-100 shadow-sm">54%</div>
              <div className="absolute top-1 right-7 text-[9px] font-bold bg-white px-1.5 py-0.5 rounded-full border border-gray-100 shadow-sm">12%</div>
              <div className="absolute bottom-5 left-3 text-[9px] font-bold bg-white px-1.5 py-0.5 rounded-full border border-gray-100 shadow-sm">34%</div>
            </div>
          </div>

          {/* Status rows */}
          <div className="space-y-0.5">
            {ORDER_BREAKDOWN.map((item) => (
              <div key={item.label} className="flex items-center justify-between px-2 py-1.5 -mx-2 rounded-xl hover:bg-gray-50 transition-colors cursor-default group/row">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1 ${item.bg} rounded-lg text-[12px] leading-none`}>{item.emoji}</div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">{item.label}</p>
                    <p className="text-[9px] text-gray-400 opacity-0 group-hover/row:opacity-100 transition-opacity">{item.pct}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-900">{item.value}</span>
                  <ChevronRight />
                </div>
              </div>
            ))}
          </div>

          <Link
            href="/purchase-order/create"
            className="mt-2 flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 hover:bg-[#8470ff]/5 border border-gray-100 hover:border-[#8470ff]/20 transition-all group/cta"
          >
            <div className="w-5 h-5 bg-[#8470ff] rounded-full flex items-center justify-center shrink-0">
              <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-slate-600 group-hover/cta:text-[#8470ff] transition-colors flex-1">New Purchase Order</span>
            <ChevronRight />
          </Link>
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
