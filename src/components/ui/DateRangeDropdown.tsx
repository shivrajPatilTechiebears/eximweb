"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

interface DateRangeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function DateRangeDropdown({ value, onChange, options }: DateRangeDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div
        onClick={() => setOpen(!open)}
        className="bg-gray-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-gray-200 transition-colors select-none"
      >
        <span className="text-sm text-gray-700">{value}</span>
        <Icon
          name="expand_more"
          className={`text-gray-500 text-[16px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </div>

      {open && (
        <div className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 w-48">
          {options.map((option) => (
            <button
              key={option}
              onClick={() => { onChange(option); setOpen(false); }}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                value === option ? "font-semibold text-gray-900" : "text-gray-600"
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
