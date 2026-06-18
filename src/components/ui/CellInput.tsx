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
