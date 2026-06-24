"use client";

import type { ReactNode } from "react";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Checkbox,
  Field,
  Label,
} from "@headlessui/react";
import { Icon } from "./Icon";

interface FilterDropdownProps {
  options: string[];
  active: Set<string>;
  onChange: (option: string) => void;
  /** Custom label renderer for each option — useful for styled pills, badges, etc. */
  renderOption?: (option: string) => ReactNode;
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
  const hiddenCount = options.length - active.size;

  return (
    <Popover className="relative">
      <PopoverButton className="px-3 py-1.5 rounded-xl border flex items-center gap-1.5 transition-colors outline-none bg-white border-gray-200 hover:bg-gray-50 data-open:bg-gray-50 data-open:border-gray-300">
        <Icon name="filter_list" className="text-gray-600 text-[16px]" />
        <span className="text-sm font-semibold text-gray-800">{label}</span>
        {hiddenCount > 0 && (
          <span className="w-4 h-4 bg-gray-900 text-white text-[10px] rounded-full flex items-center justify-center">
            {hiddenCount}
          </span>
        )}
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 p-3 z-50 w-44 transition data-closed:opacity-0 data-closed:-translate-y-1 data-closed:scale-[0.98]"
      >
        <p className="text-[11px] font-semibold text-gray-400 mb-2 uppercase tracking-wide">
          {groupLabel}
        </p>
        {options.map((option) => (
          <Field
            key={option}
            className="flex items-center gap-2.5 py-1.5 px-1 cursor-pointer hover:bg-gray-50 rounded-lg"
          >
            <Checkbox
              checked={active.has(option)}
              onChange={() => onChange(option)}
              className="group w-3.5 h-3.5 rounded border border-gray-300 cursor-pointer transition-colors flex items-center justify-center outline-none data-checked:bg-gray-900 data-checked:border-gray-900"
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
            {renderOption ? (
              renderOption(option)
            ) : (
              <Label className="text-xs font-semibold text-gray-700 cursor-pointer">{option}</Label>
            )}
          </Field>
        ))}
      </PopoverPanel>
    </Popover>
  );
}
