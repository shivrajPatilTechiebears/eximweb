"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import { ExcelTable, type Column } from "./DataTable";

export interface TabTableConfig<T = unknown> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  sortKey?: string | null;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  rowClassName?: (row: T, index: number) => string;
  expandedRow?: (row: T, colSpan: number) => ReactNode;
  onReorder?: (from: number, to: number) => void;
  statusBar?: ReactNode;
  statusBarClassName?: string;
  emptyMessage?: string;
  cellClassName?: string;
}

export interface TabbedTableTab<T = unknown> {
  label: string;
  count?: number;
  content?: ReactNode;
  table?: TabTableConfig<T>;
  action?: ReactNode;
}

interface TabbedTableProps {
  tabs: TabbedTableTab[];
  defaultTab?: string;
  selectedIndex?: number;
  onChange?: (index: number) => void;
  className?: string;
}

export function TabbedTable({
  tabs,
  defaultTab,
  selectedIndex,
  onChange,
  className = "bg-white/50 backdrop-blur-xl rounded-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)]",
}: TabbedTableProps) {
  const defaultIndex = Math.max(tabs.findIndex((t) => t.label === defaultTab), 0);
  const [internalIndex, setInternalIndex] = useState(defaultIndex);

  const activeIndex = selectedIndex ?? internalIndex;

  const handleChange = (i: number) => {
    setInternalIndex(i);
    onChange?.(i);
  };

  const activeAction = tabs[activeIndex]?.action;

  return (
    <div className={className}>
      <TabGroup selectedIndex={activeIndex} onChange={handleChange}>
        <div className="flex items-center border-b border-white/40 px-1">
          <TabList className="flex">
            {tabs.map((tab) => (
              <Tab
                key={tab.label}
                className="group flex items-center gap-1 px-4 py-2.5 text-[11px] font-medium border-b-2 -mb-px transition-all outline-none border-transparent text-gray-400 hover:text-gray-600 data-selected:border-[#884D70] data-selected:text-[#884D70]"
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="text-[9px] px-1 py-px rounded font-semibold text-gray-400 group-data-selected:text-[#884D70]">
                    {tab.count}
                  </span>
                )}
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
                  sortKey={tab.table.sortKey}
                  sortDir={tab.table.sortDir}
                  onSort={tab.table.onSort}
                  rowClassName={tab.table.rowClassName}
                  expandedRow={tab.table.expandedRow}
                  onReorder={tab.table.onReorder}
                  statusBar={tab.table.statusBar}
                  statusBarClassName={
                    tab.table.statusBarClassName ??
                    "px-4 py-2 bg-white/30 border-t border-white/40 flex items-center justify-between rounded-b-xl"
                  }
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
