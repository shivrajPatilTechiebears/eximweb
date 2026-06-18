import React from "react";
import { Icon } from "./Icon";

export type ButtonVariant = "primary" | "secondary" | "outlined" | "text" | "icon" | "icon-danger" | "add" | "pill-primary" | "pill-secondary" | "pill-ghost";

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary:
    "flex items-center gap-1 px-3 h-8 bg-gradient-to-br from-primary to-surface-tint text-white font-bold text-[11px] rounded shadow-sm hover:opacity-90 transition-all active:scale-[0.98]",
  secondary:
    "flex items-center gap-1 px-3 h-8 border border-gray-200 text-gray-600 font-semibold text-[11px] rounded hover:bg-gray-50 transition-colors active:scale-[0.98]",
  outlined:
    "px-3 h-8 border border-primary/30 text-primary font-bold text-[11px] rounded hover:bg-primary/5 transition-colors",
  text:
    "text-primary font-bold text-xs hover:underline transition-colors",
  icon:
    "text-black/30 hover:text-gray-700 transition-colors",
  "icon-danger":
    "text-black/30 hover:text-red-500 transition-colors",
  /** Ghost add-row button — "+ Add Item / Schedule" pattern */
  add:
    "flex items-center gap-1 text-[11px] font-medium text-[#8470ff] hover:bg-[#8470ff]/8 px-2.5 py-1 rounded-lg transition-colors",
  /** Rounded-full solid pill — page header / footer actions */
  "pill-primary":
    "flex items-center gap-1.5 px-3.5 py-1.5 bg-[#8470ff] text-white text-[12px] font-semibold rounded-full hover:bg-[#7360ef] transition-colors shadow-md",
  /** Rounded-full outlined pill — secondary page actions */
  "pill-secondary":
    "text-[12px] font-medium text-gray-500 px-3.5 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors",
  /** Rounded-full borderless pill — cancel / low-emphasis actions */
  "pill-ghost":
    "text-[12px] font-medium text-gray-500 px-3.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: string;
}

export function Button({
  variant = "primary",
  icon,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${buttonVariantStyles[variant]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {icon && <Icon name={icon} className="text-base" />}
      {children}
    </button>
  );
}
