"use client";

import Link from "next/link";
import { createContext, useContext, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { Icon } from "@/components/ui/Icon";
import { Button } from "@/components/ui/Button";

// ─── Breadcrumb trail (shared between DashboardPageHeader and in-page toolbars) ─

interface BreadcrumbsProps {
  items: { label: string; href?: string }[];
  className?: string;
  /** "default" for light toolbar/header surfaces, "muted" for tinted panels like the sidebar */
  variant?: "default" | "muted";
}

export function Breadcrumbs({ items, className = "", variant = "default" }: BreadcrumbsProps) {
  const isMuted = variant === "muted";

  return (
    <div
      className={`flex items-center gap-1 flex-wrap ${
        isMuted ? "text-[9px] text-[#884D70]/55 font-semibold" : "text-[10px] text-gray-400"
      } ${className}`}
    >
      {items.map((crumb, i) => (
        <span key={crumb.label} className="flex items-center gap-1">
          {i > 0 && (
            <svg className={`${isMuted ? "w-2 h-2 opacity-60" : "w-2.5 h-2.5"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          )}
          {crumb.href ? (
            <Link
              href={crumb.href}
              className={isMuted ? "hover:text-[#884D70] transition-colors" : "text-gray-500 hover:text-slate-600 transition-colors"}
            >
              {crumb.label}
            </Link>
          ) : (
            <span className={isMuted ? "text-[#884D70]/85" : "text-slate-600 font-medium"}>{crumb.label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

// ─── Shared dashboard header slot (mounted once in the (main) layout) ─────────
//
// DashboardHeaderSlot renders the single glass bar shared by every page under
// (main). Pages that need breadcrumbs / right-side content render
// <DashboardPageHeader ... /> as before — it portals its content into that
// shared bar instead of rendering its own, so pages with nothing to show
// (the common case) don't need to render anything at all.

const HeaderSlotCtx = createContext<{
  slotNode: HTMLDivElement | null;
  setSlotNode: (node: HTMLDivElement | null) => void;
}>({ slotNode: null, setSlotNode: () => {} });

export function DashboardHeaderProvider({ children }: { children: ReactNode }) {
  const [slotNode, setSlotNode] = useState<HTMLDivElement | null>(null);
  return (
    <HeaderSlotCtx.Provider value={{ slotNode, setSlotNode }}>
      {children}
    </HeaderSlotCtx.Provider>
  );
}

export function DashboardHeaderSlot() {
  const { setSlotNode } = useContext(HeaderSlotCtx);
  return (
    <div
      ref={setSlotNode}
      className="pt-16 card-header-glass px-10 py-12 flex items-center justify-between shrink-0"
    />
  );
}

// ─── Dashboard-style page header (list pages with breadcrumbs) ────────────────

interface DashboardPageHeaderProps {
  breadcrumbs?: { label: string; href?: string }[];
  summary?: string;
  buttonText?: string;
  buttonHref?: string;
  rightContent?: ReactNode;
}

export function DashboardPageHeader({
  breadcrumbs = [],
  summary,
  buttonText,
  buttonHref,
  rightContent,
}: DashboardPageHeaderProps) {
  const { slotNode } = useContext(HeaderSlotCtx);
  if (!slotNode) return null;

  return createPortal(
    <>
      <Breadcrumbs items={breadcrumbs} />

      <div className="flex items-center gap-2.5">
        {rightContent ?? (
          <>
            {summary && (
              <span className="text-[12px] text-gray-500 font-medium">{summary}</span>
            )}
            {buttonText && buttonHref && (
              <>
                <div className="w-px h-4 bg-gray-200" />
                <Link href={buttonHref}>
                  <Button variant="cta-sunset" icon="add">{buttonText}</Button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </>,
    slotNode
  );
}

// ─── Standalone back button ────────────────────────────────────────────────────

interface BackButtonProps { href: string; label?: string }

export function BackButton({ href, label = "Go back" }: BackButtonProps) {
  return (
    <Link href={href} aria-label={label} title={label}
      className="w-7 h-7 rounded-lg bg-gradient-to-br from-app-bg-1 to-app-bg-3 shadow-sm hover:shadow-md flex items-center justify-center transition-all shrink-0">
      <Icon name="arrow_back" size={14} className="text-primary" />
    </Link>
  );
}

interface PageHeaderProps {
  title: string;
  description?: string;
  backHref?: string;
  backLabel?: string;
  meta?: ReactNode;
  actions?: ReactNode;
}

export function PageHeader({
  title,
  description,
  backHref,
  backLabel = "Go back",
  meta,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-wrap justify-between items-center gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {backHref && (
          <Link
            href={backHref}
            aria-label={backLabel}
            title={backLabel}
            className="w-7 h-7 rounded-lg bg-gradient-to-br from-app-bg-1 to-app-bg-3 shadow-sm hover:shadow-md flex items-center justify-center transition-all shrink-0"
          >
            <Icon name="arrow_back" size={14} className="text-primary" />
          </Link>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="text-[14px] font-bold leading-none text-primary truncate">
              {title}
            </h3>
            {meta && (
              <>
                <div className="hidden sm:block h-5 w-px bg-gray-200" />
                <span className="hidden sm:block text-body-sm text-on-surface-variant truncate">
                  {meta}
                </span>
              </>
            )}
          </div>
          {description && (
            <p className="text-[10px] text-on-surface-variant mt-0.5">
              {description}
            </p>
          )}
        </div>
      </div>

      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
