"use client";
import type { InputHTMLAttributes } from "react";
import { Input as HUIInput } from "@headlessui/react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  compact?: boolean;
}

export function Input({ compact = false, className, ...props }: InputProps) {
  const baseClasses =
    "w-full border border-gray-300 bg-gray-50/60 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 outline-none transition-all";
  const sizeClasses = compact ? "compact-input" : "px-3 py-2 text-sm";

  return (
    <HUIInput
      className={`${baseClasses} ${sizeClasses} ${className ?? ""}`}
      {...props}
    />
  );
}
