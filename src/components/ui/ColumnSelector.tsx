"use client";

import { Popover, PopoverButton, PopoverPanel, Checkbox, Field, Label } from "@headlessui/react";
import { Icon } from "@/components/ui/Icon";

interface ColumnSelectorProps {
  columns: { key: string; header: string }[];
  visibleColumns: Set<string>;
  onToggle: (key: string) => void;
}

export function ColumnSelector({ columns, visibleColumns, onToggle }: ColumnSelectorProps) {
  return (
    <Popover className="relative">
      <PopoverButton className="flex items-center gap-1.5 text-[11px] font-medium px-3 py-2 rounded-xl border transition-all outline-none bg-white/70 border-gray-200 text-gray-500 hover:text-slate-700 hover:bg-white hover:border-gray-300 data-open:bg-white data-open:border-gray-300 data-open:text-slate-700 data-open:shadow-sm">
        <Icon name="filter_list" size={13} />
        Columns
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute right-0 top-full mt-1.5 bg-white border border-gray-100 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.15)] p-2 z-50 w-44 transition data-closed:opacity-0 data-closed:scale-[0.98] data-closed:-translate-y-1"
      >
        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider px-2 mb-1.5">
          Columns
        </p>
        {columns.map((col) => (
          <Field
            key={col.key}
            className="flex items-center gap-2 w-full px-2 py-1.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <Checkbox
              checked={visibleColumns.has(col.key)}
              onChange={() => onToggle(col.key)}
              className="group w-3.5 h-3.5 rounded-sm border-2 transition-all flex items-center justify-center shrink-0 outline-none border-gray-300 data-checked:bg-[#8470ff] data-checked:border-[#8470ff]"
            >
              <svg
                className="w-2 h-2 text-white opacity-0 group-data-checked:opacity-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
              </svg>
            </Checkbox>
            <Label className={`text-[11px] cursor-pointer ${visibleColumns.has(col.key) ? "text-slate-700" : "text-gray-400"}`}>
              {col.header}
            </Label>
          </Field>
        ))}
      </PopoverPanel>
    </Popover>
  );
}
