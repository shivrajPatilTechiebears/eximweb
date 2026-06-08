"use client";

import { Table, type TableColumn } from "@/components/ui/Table";

export type { TableColumn };

interface DataTableProps<T extends object> {
  title: string;
  titleClassName?: string;
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  rowStyle?: (row: T, index: number) => React.CSSProperties;
  expandedRow?: (row: T, index: number) => React.ReactNode | null;
  headerActions?: React.ReactNode;
  // Additional props for full-featured table
  description?: string;
  toolbarActions?: React.ReactNode;
  rowKey?: (row: T) => string | number;
  rowClassName?: (row: T) => string;
  showingCurrent?: number;
  showingTotal?: number;
  pagination?: React.ReactNode;
}

export function DataTable<T extends object>({
  title,
  titleClassName,
  columns,
  data,
  emptyMessage = "No data found.",
  rowStyle,
  expandedRow,
  headerActions,
  description,
  toolbarActions,
  rowClassName,
  showingCurrent,
  showingTotal,
  pagination,
}: DataTableProps<T>) {
  return (
    <section className="space-y-4">
      {/* Title + controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className={titleClassName ?? "text-xl font-bold text-gray-900"}>{title}</h2>
          {description && (
            <p className="text-sm text-gray-500 mt-0.5">{description}</p>
          )}
        </div>
        {headerActions && (
          <div className="flex items-center gap-3">{headerActions}</div>
        )}
      </div>

      {/* Toolbar actions */}
      {toolbarActions && (
        <div className="flex items-center gap-3 flex-wrap">
          {toolbarActions}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={data}
          emptyMessage={emptyMessage}
          rowStyle={rowStyle}
          expandedRow={expandedRow}
        />
      </div>

      {/* Footer with pagination */}
      {(showingCurrent !== undefined || pagination) && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/80 rounded-lg border border-gray-100">
          {showingCurrent !== undefined && showingTotal !== undefined && (
            <p className="text-xs text-gray-600">
              Showing {showingCurrent} of {showingTotal}
            </p>
          )}
          {pagination}
        </div>
      )}
    </section>
  );
}
