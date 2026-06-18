import React from "react";

interface CellInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  align?: "left" | "center" | "right";
  width?: string;
}

/**
 * Inline input for editable ExcelTable cells.
 * Transparent background, focus highlight, no border — blends into the table row.
 */
export function CellInput({ align = "left", width, className, ...props }: CellInputProps) {
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "";

  return (
    <input
      className={[
        "px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none",
        "focus:bg-[#f5f3ff] focus:ring-1 focus:ring-[#8470ff]/20 rounded",
        "placeholder:text-gray-300 tabular-nums transition-all",
        alignClass,
        width ?? "w-full",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
