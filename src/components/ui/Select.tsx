import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: string[];
  compact?: boolean;
}

export function Select({ options, compact = true, className, ...props }: SelectProps) {
  return (
    <select
      className={`w-full border border-outline-variant rounded focus:ring-1 focus:ring-primary focus:border-primary text-on-surface bg-surface-container-low outline-none ${compact ? "compact-input" : ""} ${className ?? ""}`}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt}>{opt}</option>
      ))}
    </select>
  );
}
