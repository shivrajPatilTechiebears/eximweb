import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/ChevronRightIcon";

const CONFIG = {
  title: "Order Breakdown",
  href: "/purchase-order",
  donutTotal: "$35.6k",
  ctaLabel: "New Purchase Order",
  ctaHref: "/purchase-order/create",
} as const;

const BREAKDOWN = [
  { emoji: "📦", label: "Shipped", pct: "54%", value: "$19,200", bg: "bg-green-50"  },
  { emoji: "⏳", label: "Pending", pct: "34%", value: "$12,200", bg: "bg-yellow-50" },
  { emoji: "⚠️", label: "Delayed", pct: "12%", value: "$4,200",  bg: "bg-red-50"    },
];

const DONUT_BADGES = [
  { pct: "54%", pos: "top-3 left-5"    },
  { pct: "12%", pos: "top-1 right-7"   },
  { pct: "34%", pos: "bottom-5 left-3" },
];

export function OrderBreakdownCard() {
  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <span className="section-title">{CONFIG.title}</span>
        <Link href={CONFIG.href} className="section-link">See all →</Link>
      </div>

      {/* Donut chart */}
      <div className="relative flex justify-center mb-3">
        <div
          className="w-32 h-32 rounded-full flex items-center justify-center"
          style={{ background: "conic-gradient(#22c55e 0% 54%, #facc15 54% 88%, #ef4444 88% 100%)" }}
        >
          <div className="w-20 h-20 bg-white/90 rounded-full flex flex-col items-center justify-center text-center">
            <p className="section-subtitle">Total</p>
            <p className="text-sm font-bold text-slate-900">{CONFIG.donutTotal}</p>
          </div>
        </div>
        <div className="absolute inset-0 pointer-events-none">
          {DONUT_BADGES.map(({ pct, pos }) => (
            <div key={pct} className={`absolute ${pos} donut-pct-badge`}>{pct}</div>
          ))}
        </div>
      </div>

      {/* Status rows */}
      <div className="space-y-0.5">
        {BREAKDOWN.map((item) => (
          <div key={item.label} className="breakdown-row group/row">
            <div className="flex items-center gap-2.5">
              <div className={`p-1 ${item.bg} rounded-lg text-[12px] leading-none`}>{item.emoji}</div>
              <div>
                <p className="breakdown-label">{item.label}</p>
                <p className="stat-hint">{item.pct}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="breakdown-value">{item.value}</span>
              <ChevronRightIcon />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href={CONFIG.ctaHref} className="mt-2 card-cta-brand group/cta">
        <div className="brand-badge-sm">
          <svg className="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
          </svg>
        </div>
        <span className="text-[10px] font-semibold text-slate-600 group-hover/cta:text-[#884D70] transition-colors flex-1">
          {CONFIG.ctaLabel}
        </span>
        <ChevronRightIcon />
      </Link>
    </>
  );
}
