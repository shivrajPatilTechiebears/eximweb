import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  compact?: boolean;
}

export function Input({ compact = true, className, ...props }: InputProps) {
  return (
    <input
      className={`w-full border border-outline-variant rounded focus:ring-1 focus:ring-primary focus:border-primary text-on-surface outline-none ${compact ? "compact-input" : ""} ${className ?? ""}`}
      {...props}
    />
  );
}
