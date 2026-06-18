"use client";

import { Fragment } from "react";
import type { ReactNode } from "react";

// ── FooterStat ─────────────────────────────────────────────────────────────────

interface FooterStatProps {
  label: string;
  value: string;
  /** Renders the value in a darker weight — use for the grand total. */
  highlight?: boolean;
}

export function FooterStat({ label, value, highlight = false }: FooterStatProps) {
  return (
    <span className="text-[11px] text-gray-400">
      {label}:{" "}
      <strong className={`tabular-nums ${highlight ? "text-slate-900" : "text-slate-700"}`}>
        {value}
      </strong>
    </span>
  );
}

// ── StickyFooter ───────────────────────────────────────────────────────────────

export interface FooterStatItem {
  label: string;
  value: string;
  highlight?: boolean;
}

interface StickyFooterProps {
  stats: FooterStatItem[];
  actions: ReactNode;
}

export function StickyFooter({ stats, actions }: StickyFooterProps) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-200 px-10 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-5">
        {stats.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 && <span className="text-gray-200">|</span>}
            <FooterStat label={stat.label} value={stat.value} highlight={stat.highlight} />
          </Fragment>
        ))}
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
  );
}
