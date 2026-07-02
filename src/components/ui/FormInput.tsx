"use client";

import { Field, Input, Label } from "@headlessui/react";
import type { CSSProperties } from "react";

interface FormInputProps {
  label: string;
  name?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  autoComplete?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  inputClassName?: string;
  inputStyle?: CSSProperties;
}

export function FormInput({
  label,
  name,
  value,
  placeholder,
  type = "text",
  autoComplete,
  onChange,
  disabled = false,
  inputClassName,
  inputStyle,
}: FormInputProps) {
  return (
    <Field disabled={disabled}>
      <Label className="block text-[9px] font-semibold text-slate-700 uppercase tracking-wider mb-1">
        {label}
      </Label>
      <Input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange?.(e.target.value)}
        style={inputStyle}
        className={
          inputClassName ??
          "w-full px-3 py-2 text-[12px] bg-white border border-gray-300 rounded-lg outline-none focus:border-[#884D70]/50 focus:ring-1 focus:ring-[#884D70]/10 placeholder:text-gray-500 text-slate-700 transition-all data-disabled:opacity-50 data-disabled:cursor-not-allowed"
        }
      />
    </Field>
  );
}
