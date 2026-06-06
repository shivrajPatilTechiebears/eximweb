import React from "react";
import { SectionHeading } from "@/components/typography/SectionHeading";

export interface TableColumn<T> {
  field: string;
  header: string;
  /** Custom cell renderer. Return the cell content (not the <td>). */
  body?: (row: T) => React.ReactNode;
  center?: boolean;
}

interface DataTableProps<T> {
  title: string;
  description: string;
  toolbarActions: React.ReactNode;
  columns: TableColumn<T>[];
  data: T[];
  /** Returns a unique key per row. Defaults to row index. */
  rowKey?: (row: T) => string;
  /** Extra className(s) applied to each <tr>. */
  rowClassName?: (row: T) => string;
  showingCurrent: number;
  showingTotal: number;
  pagination: React.ReactNode;
}

export function DataTable<T>({
  title,
  description,
  toolbarActions,
  columns,
  data,
  rowKey,
  rowClassName,
  showingCurrent,
  showingTotal,
  pagination,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg border border-outline-variant overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="px-lg py-md flex flex-col md:flex-row md:items-center justify-between gap-md border-b border-outline-variant bg-white">
        <SectionHeading title={title} description={description} />
        <div className="flex flex-wrap items-center gap-2">{toolbarActions}</div>
      </div>

      {/* Row count */}
      <div className="px-4 py-1.5 bg-surface-bright flex justify-end border-b border-outline-variant">
        <p className="font-label-caps text-[9px] text-on-surface-variant">
          Showing <span className="text-primary font-bold">{showingCurrent}</span> of{" "}
          <span className="text-primary font-bold">{showingTotal}</span>
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse [&_th]:py-2 [&_th]:px-2 [&_td]:py-0.5 [&_td]:px-2 min-w-max">
          <thead className="bg-primary-container text-white">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.field}
                  className={`font-table-header uppercase text-[10px] tracking-wider whitespace-nowrap${col.center ? " text-center" : ""}`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant text-[12px]">
            {data.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row) : i}
                className={`hover:bg-surface-container-low transition-colors group${rowClassName ? ` ${rowClassName(row)}` : ""}`}
              >
                {columns.map((col) => (
                  <td
                    key={col.field}
                    className={`whitespace-nowrap${col.center ? " text-center" : ""}`}
                  >
                    {col.body
                      ? col.body(row)
                      : String((row as Record<string, unknown>)[col.field] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination}
    </div>
  );
}
