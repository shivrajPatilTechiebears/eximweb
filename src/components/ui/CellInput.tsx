import React from "react";

interface CellInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  align?: "left" | "center" | "right";
  width?: string;
}

/**
 * Borderless input for use inside editable table cells.
 * Tab / Enter navigation is handled by the parent table wrapper
 * via `useTableEnterHandler`.
 */
export function CellInput({ align = "left", width, className, ...props }: CellInputProps) {
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "";

  return (
    <input
      className={[
        "w-full bg-transparent border-0 focus:ring-0 text-sm text-gray-800",
        "p-0 outline-none placeholder:text-gray-400 tabular-nums",
        alignClass,
        width ?? "",
        className ?? "",
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
}
