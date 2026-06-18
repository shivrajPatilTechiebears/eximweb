"use client";

import { useState } from "react";
import type { ReactNode } from "react";

export interface TabbedTableTab {
  label: string;
  content: ReactNode;
  /** Right-aligned slot in the tab bar — shown only when this tab is active. */
  action?: ReactNode;
}

interface TabbedTableProps {
  tabs: TabbedTableTab[];
  defaultTab?: string;
  className?: string;
}

export function TabbedTable({
  tabs,
  defaultTab,
  className = "bg-white rounded-xl border border-gray-200/60 shadow-[0_1px_4px_rgba(0,0,0,0.06)]",
}: TabbedTableProps) {
  const [activeTab, setActiveTab] = useState(defaultTab ?? tabs[0]?.label ?? "");
  const active = tabs.find((t) => t.label === activeTab) ?? tabs[0];

  return (
    <div className={className}>
      {/* Tab bar */}
      <div className="flex items-center border-b border-gray-100 px-1">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`px-4 py-2.5 text-[11px] font-medium border-b-2 -mb-px transition-all ${
              activeTab === tab.label
                ? "border-[#8470ff] text-[#8470ff]"
                : "border-transparent text-gray-400 hover:text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
        {active?.action && (
          <>
            <div className="flex-1" />
            <div className="mr-1.5">{active.action}</div>
          </>
        )}
      </div>

      {/* Tab content */}
      {active?.content}
    </div>
  );
}
