"use client";

import { Tab, TabGroup, TabList } from "@headlessui/react";
import type { ReactNode } from "react";

export type ViewMode = "list" | "grid";

const VIEW_OPTIONS: { mode: ViewMode; label: string; icon: ReactNode }[] = [
  {
    mode: "list",
    label: "List view",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4 6h16M4 10h16M4 14h16M4 18h16" strokeLinecap="round" strokeWidth="2" />
      </svg>
    ),
  },
  {
    mode: "grid",
    label: "Grid view",
    icon: (
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

interface ViewToggleProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
  className?: string;
}

/** Index-based segmented control — same TabGroup pattern as Tabs.tsx's TabBar. */
export function ViewToggle({ view, onChange, className = "" }: ViewToggleProps) {
  const selectedIndex = VIEW_OPTIONS.findIndex((opt) => opt.mode === view);

  return (
    <TabGroup
      selectedIndex={selectedIndex}
      onChange={(index) => onChange(VIEW_OPTIONS[index].mode)}
      className={`flex items-center gap-0.5 bg-white/70 border border-gray-200/80 rounded-lg p-0.5 shadow-sm ${className}`}
    >
      <TabList className="flex items-center gap-0.5">
        {VIEW_OPTIONS.map(({ mode, label, icon }) => (
          <Tab key={mode} title={label} className="view-toggle-btn outline-none">
            {icon}
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
}
