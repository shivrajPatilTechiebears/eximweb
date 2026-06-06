"use client";

import { useState } from "react";
import React from "react";

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
      <div className="flex border-b border-outline-variant/30 mb-2 gap-6">
        {items.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveId(tab.id)}
            className={
              activeId === tab.id
                ? "px-1 py-1.5 text-primary border-b-2 border-primary font-bold text-xs uppercase tracking-wider"
                : "px-1 py-1.5 text-on-surface-variant hover:text-primary transition-colors text-xs uppercase tracking-wider"
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
