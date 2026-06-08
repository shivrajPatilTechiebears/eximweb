"use client";

import React, { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

interface FilterDropdownProps {
  options: string[];
  active: Set<string>;
  onChange: (option: string) => void;
  /** Custom label renderer for each option — useful for styled pills, badges, etc. */
  renderOption?: (option: string) => React.ReactNode;
  label?: string;
  groupLabel?: string;
}

export function FilterDropdown({
  options,
  active,
  onChange,
  renderOption,
  label = "Filter",
  groupLabel = "Filter by",
}: FilterDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const hiddenCount = options.length - active.size;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors ${
          open ? "bg-gray-50 border-gray-300" : "bg-white border-gray-200 hover:bg-gray-50"
        }`}
      >
        <Icon name="filter_list" className="text-gray-600 text-[16px]" />
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {hiddenCount > 0 && (
          <span className="w-4 h-4 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center">
            {hiddenCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50 w-44">
          <p className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wide">
            {groupLabel}
          </p>
          {options.map((option) => (
            <label
              key={option}
              className="flex items-center gap-2.5 py-1.5 px-1 cursor-pointer hover:bg-gray-50 rounded-lg"
            >
              <input
                type="checkbox"
                checked={active.has(option)}
                onChange={() => onChange(option)}
                className="w-3.5 h-3.5 accent-gray-900 cursor-pointer"
              />
              {renderOption ? (
                renderOption(option)
              ) : (
                <span className="text-xs font-semibold text-gray-700">{option}</span>
              )}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
