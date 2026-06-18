"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ExcelTable, type Column } from "./DataTable";

export interface TabTableConfig<T = unknown> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  onReorder?: (from: number, to: number) => void;
  statusBar?: ReactNode;
  statusBarClassName?: string;
  emptyMessage?: string;
  cellClassName?: string;
}

export interface TabbedTableTab<T = unknown> {
  label: string;
  /** Free-form content. Used when `table` is not provided. */
  content?: ReactNode;
  /** When provided, renders an ExcelTable with no outer border (card is provided by TabbedTable). */
  table?: TabTableConfig<T>;
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
  const defaultIndex = Math.max(tabs.findIndex((t) => t.label === defaultTab), 0);
  const [activeIndex, setActiveIndex] = useState(defaultIndex);

  const activeAction = tabs[activeIndex]?.action;

  return (
    <div className={className}>
      <TabGroup selectedIndex={activeIndex} onChange={setActiveIndex}>
        <div className="flex items-center border-b border-gray-100 px-1">
          <TabList className="flex">
            {tabs.map((tab) => (
              <Tab
                key={tab.label}
                className="px-4 py-2.5 text-[11px] font-medium border-b-2 -mb-px transition-all outline-none border-transparent text-gray-400 hover:text-gray-600 data-selected:border-[#8470ff] data-selected:text-[#8470ff]"
              >
                {tab.label}
              </Tab>
            ))}
          </TabList>

          {activeAction && (
            <>
              <div className="flex-1" />
              <div className="mr-1.5">{activeAction}</div>
            </>
          )}
        </div>

        <TabPanels>
          {tabs.map((tab) => (
            <TabPanel key={tab.label} unmount={false}>
              {tab.table ? (
                <ExcelTable
                  columns={tab.table.columns}
                  data={tab.table.data}
                  rowKey={tab.table.rowKey}
                  onReorder={tab.table.onReorder}
                  statusBar={tab.table.statusBar}
                  statusBarClassName={tab.table.statusBarClassName}
                  emptyMessage={tab.table.emptyMessage}
                  cellClassName={tab.table.cellClassName ?? "px-1 py-0.5"}
                  className=""
                />
              ) : (
                tab.content
              )}
            </TabPanel>
          ))}
        </TabPanels>
      </TabGroup>
    </div>
  );
}
