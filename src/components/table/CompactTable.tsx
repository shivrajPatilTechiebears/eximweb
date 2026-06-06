import React from "react";

export type HeaderTheme = "plummish" | "blue";

export interface CompactTableColumn<T> {
  field: string;
  header: string;
  /** Custom cell renderer — return content inside the <td>, not the <td> itself. */
  body?: (row: T) => React.ReactNode;
  /** Extra className(s) on <th>. */
  headerClass?: string;
  /** Extra className(s) on <td>. */
  cellClass?: string;
}

interface CompactTableProps<T> {
  columns: CompactTableColumn<T>[];
  data: T[];
  rowKey?: (row: T) => string | number;
  rowClassName?: (row: T, index: number) => string;
  headerTheme?: HeaderTheme;
}

const HEADER_THEMES: Record<HeaderTheme, { bg: string; color: string }> = {
  plummish: { bg: "#3d1b28", color: "#ffffff" },
  blue: { bg: "#E0EBFF", color: "#000000" },
};

export function CompactTable<T>({
  columns,
  data,
  rowKey,
  rowClassName,
  headerTheme = "plummish",
}: CompactTableProps<T>) {
  const theme = HEADER_THEMES[headerTheme];

  return (
    <div className="overflow-x-auto">
      <table className="w-full ultra-compact-table border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th 
                key={col.field} 
                className={col.headerClass ?? ""}
                style={{ backgroundColor: theme.bg, color: theme.color }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={rowKey ? rowKey(row) : i}
              className={`hover:bg-primary-container/5 transition-colors${rowClassName ? ` ${rowClassName(row, i)}` : ""}`}
            >
              {columns.map((col) => (
                <td key={col.field} className={col.cellClass ?? ""}>
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
  );
}
