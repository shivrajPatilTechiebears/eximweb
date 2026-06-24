"use client";
import { Field, Label, Select } from "@headlessui/react";

export interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps {
  label: string;
  value?: string;
  options: SelectOption[];
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function FormSelect({
  label,
  value,
  options,
  placeholder = "Select…",
  onChange,
  disabled = false,
}: FormSelectProps) {
  return (
    <Field disabled={disabled}>
      <Label className="block text-[9px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
        {label}
      </Label>
      <Select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2 text-[12px] bg-white border border-gray-300 rounded-lg outline-none focus:border-[#884D70]/50 focus:ring-1 focus:ring-[#884D70]/10 text-slate-700 appearance-none transition-all data-disabled:opacity-50 data-disabled:cursor-not-allowed cursor-pointer"
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </Select>
    </Field>
  );
}
