"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "@/components/ui/Icon";

interface ColumnSelectorProps {
  columns: { key: string; header: string }[];
  visibleColumns: Set<string>;
  onToggle: (key: string) => void;
}

export function ColumnSelector({ columns, visibleColumns, onToggle }: ColumnSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setIsOpen((v) => !v)}
        className={`flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-xl border transition-all ${
          isOpen
            ? "bg-white border-gray-300 text-slate-700 shadow-sm"
            : "bg-white/70 border-gray-200 text-gray-500 hover:text-slate-700 hover:bg-white hover:border-gray-300"
        }`}
      >
        <Icon name="filter_list" size={13} />
        Columns
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-2 z-50 w-44">
          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">
            Columns
          </p>
          {columns.map((col) => (
            <button
              key={col.key}
              onClick={() => onToggle(col.key)}
              className="flex items-center gap-2 w-full px-2 py-1.5 rounded-xl text-[11px] hover:bg-gray-50 transition-colors"
            >
              <div
                className={`w-3.5 h-3.5 rounded-sm border-2 transition-all flex items-center justify-center shrink-0 ${
                  visibleColumns.has(col.key)
                    ? "bg-[#8470ff] border-[#8470ff]"
                    : "border-gray-300"
                }`}
              >
                {visibleColumns.has(col.key) && (
                  <svg className="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
                  </svg>
                )}
              </div>
              <span className={visibleColumns.has(col.key) ? "text-slate-700" : "text-gray-400"}>
                {col.header}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
