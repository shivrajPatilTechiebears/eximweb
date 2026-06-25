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
  className = "card-glass rounded-xl",
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
              <Tab key={tab.label} className="tab-item">
                {tab.label}
                {tab.count !== undefined && (
                  <span className="tab-count">{tab.count}</span>
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
                  statusBarClassName={tab.table.statusBarClassName ?? "table-status-bar-glass"}
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
