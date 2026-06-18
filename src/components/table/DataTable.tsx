"use client";

import { Fragment, useState, useMemo } from "react";
import type { ReactNode } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  type ColumnDef,
  type RowData,
} from "@tanstack/react-table";
import { Table, type TableColumn } from "@/components/ui/Table";

export type { TableColumn };

// ── Column meta type extension ─────────────────────────────────────────────────
declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "center" | "right";
    sortable?: boolean;
  }
}

// ── Public column interface (unchanged for callers) ───────────────────────────
export interface Column<TRow = unknown> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: "left" | "center" | "right";
  cell?: (row: TRow, index: number) => ReactNode;
}

interface ExcelTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => string;
  sortKey?: string | null;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
  renderCell?: (row: T, column: Column<T>, rowIndex: number) => ReactNode;
  rowClassName?: (row: T, index: number) => string;
  expandedRow?: (row: T, colSpan: number) => ReactNode;
  statusBar?: ReactNode;
  emptyMessage?: string;
  header?: ReactNode;
  className?: string;
  cellClassName?: string;
  statusBarClassName?: string;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

// ── Drag-handle grip icon ──────────────────────────────────────────────────────
const GripIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="currentColor" className="text-gray-400">
    <circle cx="2" cy="2"  r="1.2" /><circle cx="6" cy="2"  r="1.2" />
    <circle cx="2" cy="6"  r="1.2" /><circle cx="6" cy="6"  r="1.2" />
    <circle cx="2" cy="10" r="1.2" /><circle cx="6" cy="10" r="1.2" />
  </svg>
);

export function ExcelTable<T>({
  columns,
  data,
  rowKey,
  sortKey,
  sortDir = "asc",
  onSort,
  renderCell,
  rowClassName,
  expandedRow,
  statusBar,
  emptyMessage = "No records found.",
  header,
  className = "bg-white rounded-xl border border-gray-300/50 shadow-[0_4px_20px_rgba(0,0,0,0.1)]",
  cellClassName = "px-3 py-2 whitespace-nowrap text-left",
  statusBarClassName = "px-4 py-1.5 bg-[#e8eaed] border-t border-gray-300/50 flex items-center justify-between rounded-b-xl",
  onReorder,
}: ExcelTableProps<T>) {
  // ── Drag state ──────────────────────────────────────────────────────────────
  const [dragFrom, setDragFrom] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const handleDragStart = (i: number) => setDragFrom(i);
  const handleDragOver  = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOver(i); };
  const handleDrop      = (i: number) => { if (dragFrom !== null && dragFrom !== i) onReorder?.(dragFrom, i); setDragFrom(null); setDragOver(null); };
  const handleDragEnd   = () => { setDragFrom(null); setDragOver(null); };

  // ── Map to TanStack ColumnDef ───────────────────────────────────────────────
  const tanstackCols = useMemo<ColumnDef<T>[]>(
    () =>
      columns.map((col) => ({
        id: col.key,
        header: col.header,
        enableSorting: col.sortable ?? false,
        meta: { align: col.align, sortable: col.sortable },
        cell: col.cell
          ? (info) => col.cell!(info.row.original, info.row.index)
          : (info) => renderCell?.(info.row.original, col, info.row.index) ?? null,
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [columns]
  );

  const table = useReactTable<T>({
    data,
    columns: tanstackCols,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    getRowId: rowKey,
  });

  const colSpan = columns.length + 1;
  const rows = table.getRowModel().rows;

  return (
    <div className={className}>
      {header && (
        <div className="px-5 py-2.5 border-b border-gray-100 flex items-center justify-between">
          {header}
        </div>
      )}

      <div className="overflow-x-auto overflow-y-hidden">
        <table className="w-full border-collapse">
          {/* ── Head ── */}
          <thead>
            {table.getHeaderGroups().map((hg) => (
              <tr key={hg.id}>
                {/* row-number gutter */}
                <th className="w-9 bg-[#e8eaed] border-b border-r border-gray-300 select-none" />

                {hg.headers.map((header) => {
                  const canSort = header.column.columnDef.meta?.sortable;
                  const isActive = sortKey === header.id;
                  return (
                    <th
                      key={header.id}
                      onClick={() => canSort && onSort?.(header.id)}
                      className={`bg-[#e8eaed] border-b border-r border-gray-300 px-3 py-2 text-left text-[9px] font-semibold text-gray-600 uppercase tracking-wider whitespace-nowrap select-none ${
                        canSort ? "cursor-pointer hover:bg-[#d8dce5] transition-colors" : ""
                      }`}
                    >
                      <div className="flex items-center gap-1">
                        <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                        {canSort && (
                          <span className={`text-[10px] leading-none transition-opacity ${isActive ? "opacity-100" : "opacity-20"}`}>
                            {isActive && sortDir === "asc" ? "↑" : isActive ? "↓" : "⇅"}
                          </span>
                        )}
                      </div>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          {/* ── Body ── */}
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={colSpan} className="px-4 py-2.5 text-center">
                  <p className="text-[11px] text-gray-400">{emptyMessage}</p>
                </td>
              </tr>
            ) : (
              rows.map((row, i) => {
                const defaultCls =
                  i % 2 === 0 ? "bg-white hover:bg-[#eef3fe]" : "bg-[#f2f4f8] hover:bg-[#eef3fe]";
                const isDragging   = dragFrom === i;
                const isDropTarget = dragOver === i && dragFrom !== i;

                return (
                  <Fragment key={row.id}>
                    <tr
                      className={`group transition-colors ${rowClassName ? rowClassName(row.original, i) : defaultCls} ${isDragging ? "opacity-40" : ""} ${isDropTarget ? "shadow-[inset_0_2px_0_#8470ff]" : ""}`}
                    >
                      {/* row-number / drag-handle cell */}
                      <td
                        draggable={!!onReorder}
                        onDragStart={() => handleDragStart(i)}
                        onDragOver={(e) => handleDragOver(e, i)}
                        onDrop={() => handleDrop(i)}
                        onDragEnd={handleDragEnd}
                        className={`w-9 text-center text-[10px] text-gray-400 tabular-nums font-mono border-b border-r border-gray-200 bg-[#f2f4f7] group-hover:bg-[#e4e9f7] transition-colors select-none py-2 ${onReorder ? "cursor-grab active:cursor-grabbing" : ""}`}
                      >
                        <span className={`${onReorder ? "group-hover:hidden" : ""} block`}>{i + 1}</span>
                        {onReorder && (
                          <span className="hidden group-hover:flex justify-center">
                            <GripIcon />
                          </span>
                        )}
                      </td>

                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className={`border-b border-r border-gray-200 ${cellClassName}`}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>

                    {expandedRow?.(row.original, colSpan)}
                  </Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {statusBar && (
        <div className={statusBarClassName}>{statusBar}</div>
      )}
    </div>
  );
}

// ── Legacy DataTable (unchanged) ───────────────────────────────────────────────

interface DataTableProps<T extends object> {
  title: string;
  titleClassName?: string;
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  rowStyle?: (row: T, index: number) => React.CSSProperties;
  expandedRow?: (row: T, index: number) => React.ReactNode | null;
  headerActions?: React.ReactNode;
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className={titleClassName ?? "text-xl font-bold text-gray-900"}>{title}</h2>
          {description && <p className="text-sm text-gray-500 mt-0.5">{description}</p>}
        </div>
        {headerActions && <div className="flex items-center gap-3">{headerActions}</div>}
      </div>

      {toolbarActions && <div className="flex items-center gap-3 flex-wrap">{toolbarActions}</div>}

      <div className="overflow-x-auto">
        <Table
          columns={columns}
          data={data}
          emptyMessage={emptyMessage}
          rowStyle={rowStyle}
          expandedRow={expandedRow}
        />
      </div>

      {(showingCurrent !== undefined || pagination) && (
        <div className="flex items-center justify-between px-4 py-2 bg-white/80 rounded-lg border border-gray-100">
          {showingCurrent !== undefined && showingTotal !== undefined && (
            <p className="text-xs text-gray-600">Showing {showingCurrent} of {showingTotal}</p>
          )}
          {pagination}
        </div>
      )}
    </section>
  );
}
