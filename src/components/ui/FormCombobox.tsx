"use client";

import { useState } from "react";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/react";

export interface ComboboxOption {
  label: string;
  value: string;
}

interface FormComboboxProps {
  label: string;
  options: ComboboxOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function FormCombobox({
  label,
  options,
  value,
  placeholder = "Select or type…",
  onChange,
  disabled = false,
}: FormComboboxProps) {
  const [query, setQuery] = useState("");

  const selectedOption = options.find((o) => o.value === value) ?? null;

  const filtered =
    query === ""
      ? options
      : options.filter((o) =>
          o.label.toLowerCase().includes(query.toLowerCase())
        );

  return (
    <div>
      <label className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </label>

      <Combobox
        value={selectedOption}
        onChange={(opt) => opt && onChange?.(opt.value)}
        onClose={() => setQuery("")}
        disabled={disabled}
        immediate
      >
        <div className="relative">
          {/* Input row */}
          <div className="flex items-center w-full px-3 py-2 bg-[#f8f9fc] border border-gray-200 rounded-lg focus-within:border-[#8470ff]/50 focus-within:ring-1 focus-within:ring-[#8470ff]/10 transition-all disabled:opacity-50">
            <ComboboxInput
              displayValue={(opt: ComboboxOption | null) => opt?.label ?? ""}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={placeholder}
              autoComplete="off"
              className="flex-1 bg-transparent outline-none text-[12px] text-slate-700 placeholder:text-gray-300 min-w-0 disabled:cursor-not-allowed"
            />
            {/* Chevron — rotates via group-data-[open] when Combobox is open */}
            <ComboboxButton className="group ml-1 text-gray-400 shrink-0">
              <svg
                className="w-3 h-3 transition-transform duration-200 ease-in-out group-data-open:rotate-180"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
              </svg>
            </ComboboxButton>
          </div>

          {/* Dropdown — Headless UI manages show/hide and ARIA */}
          <ComboboxOptions
            transition
            className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] py-1 max-h-52 overflow-y-auto empty:invisible transition duration-150 ease-out data-closed:opacity-0 data-closed:-translate-y-1 data-closed:scale-[0.98]"
          >
            {filtered.length === 0 && (
              <div className="px-3 py-2 text-[11px] text-gray-400 text-center">
                No results
              </div>
            )}
            {filtered.map((opt) => (
              <ComboboxOption
                key={opt.value}
                value={opt}
                className="flex items-center justify-between px-3 py-2 text-[12px] cursor-pointer transition-colors text-slate-700 data-focus:bg-[#8470ff]/8 data-focus:text-[#8470ff] data-selected:font-semibold"
              >
                <span>{opt.label}</span>
                {opt.value === value && (
                  <svg
                    className="w-3 h-3 text-[#8470ff] shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                  </svg>
                )}
              </ComboboxOption>
            ))}
          </ComboboxOptions>
        </div>
      </Combobox>
    </div>
  );
}
