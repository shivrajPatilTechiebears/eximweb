import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  compact?: boolean;
}

export function Select({ options, compact = false, className, ...props }: SelectProps) {
  const baseClasses = "w-full border border-gray-300 bg-gray-50/60 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary text-gray-800 outline-none transition-all";
  const sizeClasses = compact ? "compact-input" : "px-3 py-2 text-sm";
  
  return (
    <select
      className={`${baseClasses} ${sizeClasses} ${className ?? ""}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  );
}
