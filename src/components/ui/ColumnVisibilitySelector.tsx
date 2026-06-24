"use client";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Checkbox, Field, Label } from "@headlessui/react";
import { Button } from "./Button";
import type { TableColumn } from "@/components/table/DataTable";

// ── Hook ──────────────────────────────────────────────────────────────────────

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
      className="fixed w-64 bg-white rounded-xl border border-gray-100 shadow-xl z-9999 max-h-100 overflow-hidden flex flex-col"
      style={{ top: pos.top, right: pos.right }}
    >
      <div className="p-3 border-b border-gray-100">
        <h3 className="font-semibold text-sm text-primary">Select Columns</h3>
        <p className="text-xs text-gray-400 mt-0.5">Choose which columns to display</p>
      </div>
      <div className="p-2 overflow-y-auto flex-1">
        {columns.map((col) => (
          <Field
            key={col.field}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded cursor-pointer transition-colors"
          >
            <Checkbox
              checked={visibleColumns[col.field] !== false}
              onChange={() => toggle(col.field)}
              className="group w-4 h-4 rounded border border-gray-300 cursor-pointer transition-colors flex items-center justify-center outline-none data-checked:bg-primary data-checked:border-primary"
            >
              <svg
                className="w-2.5 h-2.5 text-white opacity-0 group-data-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            </Checkbox>
            <Label className="text-sm text-gray-700 cursor-pointer">{col.header}</Label>
          </Field>
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
