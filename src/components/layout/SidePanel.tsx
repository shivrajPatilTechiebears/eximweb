"use client";

import type { ReactNode } from "react";

// ── Public types ──────────────────────────────────────────────────────────────

export interface SidePanelItem {
  icon: ReactNode;
  label: string;
  count?: number;
  active?: boolean;
  onClick?: () => void;
}

export interface SidePanelSection {
  label: string;
  items: SidePanelItem[];
}

export interface SidePanelStorage {
  usedGB: number;
  totalGB: number;
}

interface SidePanelProps {
  sections: SidePanelSection[];
  storage?: SidePanelStorage;
}

// ── Internal nav item ─────────────────────────────────────────────────────────

function NavItem({ icon, label, count, active, onClick }: SidePanelItem) {
  return (
    <button
      onClick={onClick}
      className={`side-nav-item ${active ? "side-nav-item-active" : "side-nav-item-inactive"}`}
    >
      <span className="shrink-0">{icon}</span>
      <span className="flex-1">{label}</span>
      {count !== undefined && (
        <span className={`nav-badge ${active ? "nav-badge-active" : "nav-badge-inactive"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

// ── SidePanel ─────────────────────────────────────────────────────────────────

export function SidePanel({ sections, storage }: SidePanelProps) {
  const pct = storage ? Math.round((storage.usedGB / storage.totalGB) * 100) : 0;

  return (
    <aside className="nav-panel w-56 shrink-0 flex flex-col">

      {/* Sections */}
      <div className="flex flex-col gap-3 px-2 py-3 flex-1">
        {sections.map((section) => (
          <div key={section.label}>
            <p className="nav-section-label px-3 mb-1">{section.label}</p>
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <NavItem key={item.label} {...item} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Storage */}
      {storage && (
        <div className="px-3 pb-4">
          <div className="card-glass rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <p className="nav-section-label">Storage</p>
              <span className="text-[9px] font-bold text-[#884D70]">{pct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-gray-200/60 overflow-hidden mb-2">
              <div className="h-full rounded-full bg-[#884D70]" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[10px] text-gray-500">
              {storage.usedGB} GB <span className="text-gray-400">of {storage.totalGB} GB used</span>
            </p>
          </div>
        </div>
      )}
    </aside>
  );
}
