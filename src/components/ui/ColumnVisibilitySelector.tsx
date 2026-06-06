"use client";
import { useState, useRef, useEffect } from "react";
import { Button } from "./Button";
import type { TableColumn } from "@/components/table/DataTable";

interface ColumnVisibilitySelectorProps<T> {
  columns: TableColumn<T>[];
  visibleColumns: Record<string, boolean>;
  onVisibilityChange: (visibleColumns: Record<string, boolean>) => void;
}

export function ColumnVisibilitySelector<T>({
  columns,
  visibleColumns,
  onVisibilityChange,
}: ColumnVisibilitySelectorProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 8,
        left: rect.right - 256, // 256px = w-64
      });
    }
  }, [isOpen]);

  const toggleColumn = (field: string) => {
    onVisibilityChange({ ...visibleColumns, [field]: !visibleColumns[field] });
  };

  const selectAll = () => {
    const allVisible: Record<string, boolean> = {};
    columns.forEach((col) => {
      allVisible[col.field] = true;
    });
    onVisibilityChange(allVisible);
  };

  const clearAll = () => {
    const noneVisible: Record<string, boolean> = {};
    columns.forEach((col) => {
      noneVisible[col.field] = col.field === "actions"; // Keep actions always visible
    });
    onVisibilityChange(noneVisible);
  };

  return (
    <div ref={buttonRef} className="relative z-50">
      <Button variant="outlined" icon="view_column" onClick={() => setIsOpen(!isOpen)}>
        Columns
      </Button>
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
          {/* Dropdown */}
          <div
            className="fixed w-64 bg-white rounded-lg border border-outline-variant shadow-xl z-[70] max-h-[400px] overflow-hidden flex flex-col"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
            }}
          >
            <div className="p-3 border-b border-outline-variant bg-white">
              <h3 className="font-semibold text-sm text-primary">Select Columns</h3>
              <p className="text-xs text-on-surface-variant mt-0.5">Choose which columns to display</p>
            </div>
            <div className="p-2 overflow-y-auto flex-1">
              {columns.map((col) => (
                <label
                  key={col.field}
                  className="flex items-center gap-2 px-2 py-1.5 hover:bg-surface-container-low rounded cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns[col.field]}
                    onChange={() => toggleColumn(col.field)}
                    className="w-4 h-4 rounded border-outline-variant text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="text-sm text-on-surface">{col.header}</span>
                </label>
              ))}
            </div>
            <div className="p-2 border-t border-outline-variant flex gap-2 bg-white">
              <button
                onClick={selectAll}
                className="flex-1 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-surface-container-low rounded transition-colors"
              >
                Select All
              </button>
              <button
                onClick={clearAll}
                className="flex-1 px-3 py-1.5 text-xs font-semibold text-error hover:bg-error/10 rounded transition-colors"
              >
                Clear All
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
