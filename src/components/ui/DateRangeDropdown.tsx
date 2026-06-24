"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Icon } from "./Icon";

interface DateRangeDropdownProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
}

export function DateRangeDropdown({ value, onChange, options }: DateRangeDropdownProps) {
  return (
    <Popover className="relative">
      <PopoverButton className="group bg-gray-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer hover:bg-gray-200 transition-colors select-none outline-none">
        <span className="text-sm text-gray-700">{value}</span>
        <Icon
          name="expand_more"
          className="text-gray-500 text-[16px] transition-transform duration-200 group-data-open:rotate-180"
        />
      </PopoverButton>

      <PopoverPanel
        transition
        className="absolute right-0 top-10 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 w-48 transition data-closed:opacity-0 data-closed:-translate-y-1 data-closed:scale-[0.98]"
      >
        {options.map((option) => (
          <PopoverButton
            key={option}
            as="button"
            onClick={() => onChange(option)}
            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
              value === option ? "font-semibold text-gray-900" : "text-gray-600"
            }`}
          >
            {option}
          </PopoverButton>
        ))}
      </PopoverPanel>
    </Popover>
  );
}
