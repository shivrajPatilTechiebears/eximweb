import React from "react";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
}

export function FormField({ label, children }: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="font-label-caps text-label-caps text-on-surface-variant block uppercase">
        {label}
      </label>
      {children}
    </div>
  );
}
