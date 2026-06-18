"use client";

import { Field, Input, Label } from "@headlessui/react";

interface FormInputProps {
  label: string;
  name?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function FormInput({
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  disabled = false,
}: FormInputProps) {
  return (
    <Field disabled={disabled}>
      <Label className="block text-[9px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
        {label}
      </Label>
      <Input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 placeholder:text-gray-400 text-slate-700 transition-all data-disabled:opacity-50 data-disabled:cursor-not-allowed"
      />
    </Field>
  );
}
