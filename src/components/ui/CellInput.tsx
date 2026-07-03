"use client";

import { Input } from "@headlessui/react";
import type { InputHTMLAttributes } from "react";

interface CellInputProps extends InputHTMLAttributes<HTMLInputElement> {
  align?: "left" | "center" | "right";
  width?: string;
}

export function CellInput({ align = "left", width, className, ...props }: CellInputProps) {
  const alignClass =
    align === "center" ? "text-center" : align === "right" ? "text-right" : "";

  return (
    <Input
      className={[
        "px-2 py-1.5 text-[11px] text-slate-800 bg-transparent outline-none",
        "focus:bg-[#FFF0EB] focus:ring-1 focus:ring-[#884D70]/20 rounded",
        "placeholder:text-gray-500 tabular-nums transition-all",
        "data-disabled:opacity-50 data-disabled:cursor-not-allowed",
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
