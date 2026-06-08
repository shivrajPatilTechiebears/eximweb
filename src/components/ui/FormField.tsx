import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-gray-700 block uppercase tracking-wide">
        {label}
      </label>
      {children}
    </div>
  );
}
