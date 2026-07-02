"use client";

import { Checkbox as HeadlessCheckbox } from "@headlessui/react";
import type { MouseEvent } from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

/** Thin wrapper around Headless UI's Checkbox — matches the data-checked +
 *  group svg-checkmark pattern used by ColumnSelector / FilterDropdown. */
export function Checkbox({ checked, onChange, className = "" }: CheckboxProps) {
  return (
    <HeadlessCheckbox
      checked={checked}
      onChange={onChange}
      onClick={(e: MouseEvent) => e.stopPropagation()}
      className={`group doc-checkbox ${className}`}
    >
      <svg
        className="w-2 h-2 text-white opacity-0 group-data-checked:opacity-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.5" />
      </svg>
    </HeadlessCheckbox>
  );
}
