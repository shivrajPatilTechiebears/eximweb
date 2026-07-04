import React from "react";
import { Icon } from "./Icon";

export type ButtonVariant = "cta" | "cta-secondary" | "cta-ghost" | "cta-sunset" | "primary" | "secondary" | "outlined" | "text" | "text-brand" | "icon" | "icon-danger" | "icon-brand" | "icon-brand-danger" | "add" | "pill-primary" | "pill-secondary" | "pill-ghost" | "brand" | "danger" | "ghost-glass" | "menu-item" | "nav-pill" | "tab-pill" | "icon-nav" | "user-menu" | "unstyled";

export const buttonVariantStyles: Record<ButtonVariant, string> = {
  /** Gradient pill CTA — primary action in page headers and key surfaces */
  cta:
    "btn-cta",
  /** Glass outline pill, gradient-tinted — Cancel or other low-emphasis actions beside a cta button */
  "cta-secondary":
    "btn-cta-secondary",
  /** Plain text ghost — lowest emphasis, Cancel links with no border/bg */
  "cta-ghost":
    "btn-cta-ghost",
  /** Plum-to-peach "sunset" gradient pill, sourced from FloatingNavbar/SecondaryNav's own brand tones — confirm action (e.g. Submit) beside violet secondary actions */
  "cta-sunset":
    "btn-cta-sunset",
  primary:
    "flex items-center gap-1 px-3 h-8 bg-gradient-to-br from-primary to-surface-tint text-white font-bold text-[11px] rounded shadow-sm hover:opacity-90 transition-all active:scale-[0.98]",
  secondary:
    "flex items-center gap-1 px-3 h-8 border border-gray-200 text-gray-600 font-semibold text-[11px] rounded hover:bg-gray-50 transition-colors active:scale-[0.98]",
  outlined:
    "px-3 h-8 border border-primary/30 text-primary font-bold text-[11px] rounded hover:bg-primary/5 transition-colors",
  text:
    "text-primary font-bold text-xs hover:underline transition-colors",
  /** Brand-colored text link — small inline actions like "Select all" / "Clear selection" */
  "text-brand":
    "doc-link-brand font-semibold hover:underline transition-colors",
  icon:
    "btn-icon",
  "icon-danger":
    "btn-icon-danger",
  /** Icon-only, brand-tinted hover — row/card actions (download, view) */
  "icon-brand":
    "doc-action-btn",
  /** Icon-only, red-tinted hover — destructive row/card actions (delete) */
  "icon-brand-danger":
    "doc-action-btn-danger",
  /** Ghost add-row button — "+ Add Item / Schedule" pattern */
  add:
    "flex items-center gap-1 text-[11px] font-medium text-[#884D70] hover:bg-[#884D70]/8 px-2.5 py-1 rounded-lg transition-colors",
  /** Rounded-full solid pill — page header / footer actions */
  "pill-primary":
    "btn-primary-pill",
  /** Rounded-full outlined pill — secondary page actions */
  "pill-secondary":
    "text-[12px] font-medium text-gray-500 px-3.5 py-1.5 border border-gray-200 rounded-full hover:bg-gray-50 transition-colors",
  /** Rounded-full borderless pill — cancel / low-emphasis actions */
  "pill-ghost":
    "text-[12px] font-medium text-gray-500 px-3.5 py-1.5 rounded-full hover:bg-gray-100 transition-colors",
  /** Brand gradient — Export / primary CTA with shadow (e.g. toolbar Export button) */
  brand:
    "btn-brand",
  /** Filled danger red — destructive confirmations */
  danger:
    "btn-danger",
  /** Glass-style secondary — cancel inside glassmorphism surfaces */
  "ghost-glass":
    "btn-ghost-glass",
  /** Dropdown menu item — full-width row in floating menus */
  "menu-item":
    "btn-menu-item",
  /** Rounded-full nav pill (FloatingNavbar) — pair with "nav-pill-active"/"nav-pill-inactive" via className */
  "nav-pill":
    "nav-pill",
  /** Rounded-[10px] flyout tab pill (SecondaryNav) — pair with "tab-pill-active"/"tab-pill-inactive" via className */
  "tab-pill":
    "tab-pill",
  /** Icon-only, brand-tinted circular hover — navbar icon actions (e.g. notifications bell) */
  "icon-nav":
    "p-1.5 text-[#884D70]/50 hover:text-[#884D70] hover:bg-[#884D70]/10 rounded-full transition-colors",
  /** Compound avatar + label pill — navbar user menu trigger */
  "user-menu":
    "flex items-center gap-1.5 px-2 py-1 hover:bg-[#884D70]/10 rounded-full transition-colors shrink-0",
  /** No base styles — fully styled via className, for one-off shapes (chips, custom pills) */
  unstyled:
    "",
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
