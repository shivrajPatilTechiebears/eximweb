"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

// ── Static data ───────────────────────────────────────────────────────────────

const STATUS_MONTHS = [
  { month: "Jan", created: 55, progress: 38 },
  { month: "Feb", created: 65, progress: 50 },
  { month: "Mar", created: 75, progress: 70 },
  { month: "Apr", created: 100, progress: 85, active: true },
  { month: "May", created: 62, progress: 52 },
  { month: "Jun", created: 72, progress: 48 },
  { month: "Jul", created: 58, progress: 42 },
  { month: "Aug", created: 68, progress: 55 },
  { month: "Sep", created: 78, progress: 60 },
  { month: "Oct", created: 85, progress: 70 },
  { month: "Nov", created: 70, progress: 58 },
  { month: "Dec", created: 60, progress: 45 },
];

const HATCH_STYLE: React.CSSProperties = {
  backgroundImage: "var(--hatch-pattern)",
  backgroundColor: "var(--color-hatch-fill)",
};

// ── Component ─────────────────────────────────────────────────────────────────

export function PoStatusChartCard() {
  const [hoveredMonth, setHoveredMonth] = useState<string | null>(null);

  return (
    <div
      className="col-span-12 lg:col-span-7 p-6 rounded-[40px] border border-white"
      style={{ backgroundImage: "var(--chart-card-bg)" }}
    >
      {/* Card header */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-blue-100 p-2 rounded-xl">
            <Icon name="bar_chart" className="text-blue-500 text-[20px]" />
          </div>
          <h4 className="text-gray-900 font-bold">PO Status</h4>
        </div>
        <Link
          href="/purchase-order"
          className="text-[10px] font-semibold text-gray-500 bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm hover:shadow-md hover:text-gray-700 transition-all"
        >
          See Details
        </Link>
      </div>

      {/* Summary */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-4xl font-bold text-gray-900">4,740</span>
        <span className="text-[10px] font-bold text-green-600 bg-green-100 px-1.5 py-0.5 rounded">+115</span>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        Average processing time of <span className="text-gray-900 font-bold">3 days</span>
      </p>

      {/* Bar chart */}
      <div className="relative h-48 w-full flex items-end justify-between gap-1 pl-8">
        {/* Y-axis labels */}
        <div className="absolute left-0 inset-y-0 flex flex-col justify-between text-[10px] text-gray-400 text-right pb-5">
          <span>20k</span>
          <span>10k</span>
          <span>6k</span>
          <span>0</span>
        </div>

        {/* Gridlines */}
        <div className="absolute inset-0 pl-8 pb-5 flex flex-col justify-between pointer-events-none">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="border-t border-dashed border-gray-400/40 w-full" />
          ))}
        </div>

        {/* Month columns */}
        <div className="flex-1 flex items-end justify-between gap-1 pb-5">
          {STATUS_MONTHS.map((month) => (
            <div
              key={month.month}
              className="flex-1 flex flex-col items-center gap-1 relative cursor-pointer"
              onMouseEnter={() => setHoveredMonth(month.month)}
              onMouseLeave={() => setHoveredMonth(null)}
            >
              {/* Hover tooltip */}
              {hoveredMonth === month.month && (
                <div className="absolute -top-[88px] left-1/2 -translate-x-1/2 bg-white shadow-xl rounded-xl p-3 border border-gray-100 z-20 w-28 pointer-events-none">
                  <p className="text-[10px] text-gray-400 mb-2">{month.month}, 2024</p>
                  <div className="flex justify-between items-center mb-1">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-700">
                      <span className="w-1.5 h-1.5 bg-orange-500 rounded-full inline-block" /> Created
                    </span>
                    <span className="text-[10px] font-bold">{month.created}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-1 text-[10px] font-semibold text-gray-700">
                      <span className="w-1.5 h-1.5 bg-orange-200 rounded-full inline-block" /> Progress
                    </span>
                    <span className="text-[10px] font-bold">{month.progress}</span>
                  </div>
                </div>
              )}

              {/* Bars */}
              <div className="flex gap-0.5 items-end h-24 w-full justify-center">
                {month.active ? (
                  <>
                    <div className="w-5 bg-orange-600 rounded-t-xl h-full" />
                    <div className="w-5 bg-orange-200 rounded-t-xl" style={{ height: `${month.progress}%` }} />
                  </>
                ) : (
                  <>
                    <div className="w-4 rounded-t-xl" style={{ ...HATCH_STYLE, height: `${month.created}%` }} />
                    <div className="w-4 rounded-t-xl" style={{ ...HATCH_STYLE, height: `${month.progress}%` }} />
                  </>
                )}
              </div>

              <span className={`text-[10px] ${month.active ? "text-orange-600 font-bold" : "text-gray-400"}`}>
                {month.month}
              </span>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="absolute top-0 right-0 flex gap-4">
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 bg-orange-500 rounded-full inline-block" /> Created
          </div>
          <div className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="w-2 h-2 bg-orange-200 rounded-full inline-block" /> In Progress
          </div>
        </div>
      </div>
    </div>
  );
}
