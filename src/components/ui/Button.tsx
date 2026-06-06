import React from "react";
import { Icon } from "./Icon";

export type ButtonVariant = "primary" | "outlined" | "text" | "icon" | "icon-danger";

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  primary:
    "flex items-center gap-1 px-3 h-8 bg-primary-container text-white font-bold text-[11px] rounded hover:bg-primary-container/90 shadow-sm transition-all active:scale-[0.98]",
  outlined:
    "px-3 h-8 border border-primary text-primary font-bold text-[11px] rounded hover:bg-primary/5 transition-colors",
  text:
    "text-primary font-bold text-xs hover:underline transition-colors",
  icon: "hover:text-primary transition-colors text-on-surface-variant",
  "icon-danger": "hover:text-error transition-colors text-on-surface-variant",
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
