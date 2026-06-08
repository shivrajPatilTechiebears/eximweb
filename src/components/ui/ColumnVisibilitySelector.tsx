"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Button } from "./Button";
import type { TableColumn } from "@/components/table/DataTable";

// ── Hook ──────────────────────────────────────────────────────────────────────

/**
 * Manages column visibility state for a set of columns.
 * Returns visibleColumns map, setter, and pre-filtered columns array.
 *
 * Usage:
 *   const { visibleColumns, setVisibleColumns, filteredColumns } = useColumnVisibility(COLUMNS);
 */
export function useColumnVisibility<T extends object>(columns: TableColumn<T>[]) {
  const [visibleColumns, setVisibleColumns] = useState<Record<string, boolean>>(
    () => Object.fromEntries(columns.map((col) => [col.field, true]))
  );
  const filteredColumns = columns.filter((col) => visibleColumns[col.field] !== false);
  return { visibleColumns, setVisibleColumns, filteredColumns };
}

// ── Component ─────────────────────────────────────────────────────────────────

interface ColumnVisibilitySelectorProps<T> {
  columns: TableColumn<T>[];
  visibleColumns: Record<string, boolean>;
  onVisibilityChange: (updated: Record<string, boolean>) => void;
  /** Override the button label. Defaults to "Columns". */
  label?: string;
}

export function ColumnVisibilitySelector<T>({
  columns,
  visibleColumns,
  onVisibilityChange,
  label = "Columns",
}: ColumnVisibilitySelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!isOpen) return;
    if (buttonRef.current) {
      const r = buttonRef.current.getBoundingClientRect();
      setPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    }
    const handle = (e: MouseEvent) => {
      if (
        !buttonRef.current?.contains(e.target as Node) &&
        !dropdownRef.current?.contains(e.target as Node)
      ) setIsOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [isOpen]);

  const toggle = (field: string) =>
    onVisibilityChange({ ...visibleColumns, [field]: !visibleColumns[field] });

  const selectAll = () =>
    onVisibilityChange(Object.fromEntries(columns.map((c) => [c.field, true])));

  const clearAll = () =>
    onVisibilityChange(
      Object.fromEntries(columns.map((c) => [c.field, c.field === "actions"]))
    );

  const dropdown = (
    <div
      ref={dropdownRef}
      className="fixed w-64 bg-white rounded-xl border border-gray-100 shadow-xl z-[9999] max-h-[400px] overflow-hidden flex flex-col"
      style={{ top: pos.top, right: pos.right }}
    >
      <div className="p-3 border-b border-gray-100">
        <h3 className="font-semibold text-sm text-primary">Select Columns</h3>
        <p className="text-xs text-gray-400 mt-0.5">Choose which columns to display</p>
      </div>
      <div className="p-2 overflow-y-auto flex-1">
        {columns.map((col) => (
          <label
            key={col.field}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              checked={visibleColumns[col.field] !== false}
              onChange={() => toggle(col.field)}
              className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary focus:ring-offset-0"
            />
            <span className="text-sm text-gray-700">{col.header}</span>
          </label>
        ))}
      </div>
      <div className="p-2 border-t border-gray-100 flex gap-2">
        <button
          onClick={selectAll}
          className="flex-1 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-gray-50 rounded transition-colors"
        >
          Select All
        </button>
        <button
          onClick={clearAll}
          className="flex-1 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 rounded transition-colors"
        >
          Clear All
        </button>
      </div>
    </div>
  );

  return (
    <div ref={buttonRef} className="relative">
      <Button variant="outlined" onClick={() => setIsOpen((o) => !o)}>
        {label}
      </Button>
      {mounted && isOpen && createPortal(dropdown, document.body)}
    </div>
  );
}
