import Link from "next/link";
import {
  BarChart,
  Bar,
  BarXAxis,
  Grid,
  ChartTooltip,
  LinearGradient,
} from "@/components/ui/bar-chart";

const DATA = [
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

const CONFIG = {
  title: "PO Trend",
  subtitle: "Monthly · 2026",
  delta: "+115 this month",
  total: "4,740",
  href: "/purchase-order",
} as const;

export function PoTrendChartCard() {
  return (
    <>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-baseline gap-2">
          <span className="section-title">{CONFIG.title}</span>
          <span className="section-subtitle">{CONFIG.subtitle}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="section-delta">{CONFIG.delta}</span>
          <span className="section-total">{CONFIG.total}</span>
          <Link href={CONFIG.href} className="section-link">See all →</Link>
        </div>
      </div>

      <BarChart
        data={DATA}
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
    </>
  );
}
