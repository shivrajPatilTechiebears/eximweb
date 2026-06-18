"use client";

import type { ReactNode } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";

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
    <TabGroup selectedIndex={activeTab} onChange={onTabChange} as="div" className="flex items-center shrink-0">
      <TabList className="flex">
        {tabs.map((tab) => (
          <Tab
            key={tab.label}
            className="group flex items-center gap-1 px-3 py-1.5 text-[11px] font-medium border-b-2 transition-all outline-none border-transparent text-gray-400 hover:text-gray-600 data-selected:border-[#8470ff] data-selected:text-[#8470ff]"
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="text-[9px] px-1 py-px rounded font-semibold text-gray-400 group-data-selected:text-[#8470ff]">
                {tab.count}
              </span>
            )}
          </Tab>
        ))}
      </TabList>
    </TabGroup>
  );
}

// ─── Self-contained tabs with content panels ──────────────────────────────────

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  defaultActiveId?: string;
}

export function Tabs({ items, defaultActiveId }: TabsProps) {
  const defaultIndex = Math.max(items.findIndex((t) => t.id === defaultActiveId), 0);

  return (
    <TabGroup defaultIndex={defaultIndex} as="div" className="flex flex-col">
      <TabList className="flex border-b border-gray-200 mb-2 gap-6">
        {items.map((tab) => (
          <Tab
            key={tab.id}
            className="px-1 py-1.5 text-xs uppercase tracking-wider outline-none border-b-2 border-transparent -mb-px text-gray-400 hover:text-primary transition-colors data-selected:text-primary data-selected:border-primary data-selected:font-bold"
          >
            {tab.label}
          </Tab>
        ))}
      </TabList>
      <TabPanels>
        {items.map((tab) => (
          <TabPanel key={tab.id} unmount={false}>
            {tab.content}
          </TabPanel>
        ))}
      </TabPanels>
    </TabGroup>
  );
}
