import React from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface TableColumn<T> {
  field: string;
  header: string;
  /** Custom cell renderer. Falls back to `String(row[field])` if omitted. */
  body?: (row: T, index: number) => React.ReactNode;
  /** Center-align both the header and cells for this column. */
  center?: boolean;
}

interface TableProps<T extends object> {
  columns: TableColumn<T>[];
  data: T[];
  emptyMessage?: string;
  /** Per-row inline style (e.g. alternating bg, highlight). */
  rowStyle?: (row: T, index: number) => React.CSSProperties;
  /**
   * When provided, called for every row. If it returns non-null the entire row
   * collapses into a single full-width cell showing that content — useful for
   * inline confirmations, expanded details, etc.
   */
  expandedRow?: (row: T, index: number) => React.ReactNode | null;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function Table<T extends object>({
  columns,
  data,
  emptyMessage = "No data found.",
  rowStyle,
  expandedRow,
}: TableProps<T>) {
  return (
    <div className="bg-white/80 rounded-2xl border border-gray-100">
      <table className="min-w-full text-left">
        <thead>
          <tr className="bg-table-header">
            {columns.map((col, ci) => (
              <th
                key={col.field}
                style={{ whiteSpace: "nowrap" }}
                className={`px-4 py-2.5 text-xs font-semibold text-gray-900${col.center ? " text-center" : ""} ${
                  ci === 0 ? "rounded-tl-2xl" : ci === columns.length - 1 ? "rounded-tr-2xl" : ""
                }`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-sm text-gray-400">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => {
              const expanded = expandedRow?.(row, i) ?? null;
              return (
                <tr
                  key={i}
                  className="hover:bg-gray-100/60 transition-colors"
                  style={rowStyle?.(row, i)}
                >
                  {expanded !== null ? (
                    <td colSpan={columns.length} className="px-4 py-3">
                      {expanded}
                    </td>
                  ) : (
                    columns.map((col) => (
                      <td key={col.field} style={{ whiteSpace: "nowrap" }} className={`px-4 py-2.5${col.center ? " text-center" : ""}`}>
                        {col.body
                          ? col.body(row, i)
                          : String((row as Record<string, unknown>)[col.field] ?? "")}
                      </td>
                    ))
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
