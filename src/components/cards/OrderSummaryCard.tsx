import Link from "next/link";
import { ChevronRightIcon } from "@/components/ui/ChevronRightIcon";

const CONFIG = {
  title: "My Orders",
  subtitle: "Monitoring monthly PO activity",
  metric: "1,482",
  delta: "+15%",
  deltaLabel: "from last month",
  ctaLabel: "Create Purchase Order",
  ctaSubLabel: "Add a new order to pipeline",
  ctaHref: "/purchase-order/create",
} as const;

const METRICS = [
  { label: "Total Shipments", value: "2,899", barWidth: "83%", barTrackClass: "bg-[#FFDBCB]/50", barFillClass: "bg-[#884D70]" },
  { label: "Active Suppliers", value: "234",   barWidth: "78%", barTrackClass: "bg-gray-100",     barFillClass: "bg-emerald-500" },
];

export function OrderSummaryCard() {
  return (
    <>
      {/* Header */}
      <div className="card-header">
        <div>
          <h3 className="card-title">{CONFIG.title}</h3>
          <p className="section-subtitle mt-0.5">{CONFIG.subtitle}</p>
        </div>
        <button className="card-menu-btn">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          </svg>
        </button>
      </div>

      {/* Primary metric */}
      <div>
        <h2 className="card-metric">{CONFIG.metric}</h2>
        <p className="card-delta mt-1">
          {CONFIG.delta} <span className="text-gray-400 font-normal">{CONFIG.deltaLabel}</span>
        </p>
      </div>

      {/* Progress rows */}
      <div className="space-y-3">
        {METRICS.map(({ label, value, barWidth, barTrackClass, barFillClass }) => (
          <div key={label}>
            <div className="metric-row">
              <span className="text-gray-400">{label}</span>
              <span className="metric-value">{value}</span>
            </div>
            <div className={`metric-bar-track ${barTrackClass}`}>
              <div className={`stat-bar-fill ${barFillClass}`} style={{ width: barWidth }} />
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <Link href={CONFIG.ctaHref} className="card-cta group/cta">
        <div className="flex items-center gap-2.5">
          <div className="brand-badge">PO</div>
          <div>
            <p className="metric-value text-[10px]">{CONFIG.ctaLabel}</p>
            <p className="section-subtitle">{CONFIG.ctaSubLabel}</p>
          </div>
        </div>
        <ChevronRightIcon />
      </Link>
    </>
  );
}
