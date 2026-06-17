"use client";

import { useState } from "react";
import React from "react";

// ─── Controlled tab bar (index-based, no content slots) ───────────────────────

export interface TabBarItem {
  label: string;
  count?: number;
}

interface TabBarProps {
  tabs: TabBarItem[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

export function TabBar({ tabs, activeTab, onTabChange }: TabBarProps) {
  return (
    <div className="flex items-center shrink-0">
      {tabs.map((tab, i) => (
        <button
          key={tab.label}
          onClick={() => onTabChange(i)}
          className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium border-b-2 transition-all ${
            activeTab === i
              ? "border-[#8470ff] text-[#8470ff]"
              : "border-transparent text-gray-400 hover:text-gray-600"
          }`}
        >
          {tab.label}
          {tab.count !== undefined && (
            <span
              className={`text-[9px] px-1 py-px rounded font-semibold ${
                activeTab === i ? "text-[#8470ff]" : "text-gray-400"
              }`}
            >
              {tab.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
}

export function Tabs({ items, defaultActiveId }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultActiveId ?? items[0]?.id);

  return (
    <div className="flex flex-col">
      {/* Tab bar */}
      <div className="flex border-b border-gray-200 mb-2 gap-6">
        {items.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={
              activeId === tab.id
                ? "px-1 py-1.5 text-primary border-b-2 border-primary font-bold text-xs uppercase tracking-wider"
                : "px-1 py-1.5 text-gray-400 hover:text-primary transition-colors text-xs uppercase tracking-wider"
            }
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Active tab content */}
      {items.map((tab) => (
        <div key={tab.id} className={tab.id === activeId ? "" : "hidden"}>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
