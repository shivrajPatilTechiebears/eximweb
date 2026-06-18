"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "@/components/ui/Icon";
import { MODULE_TABS } from "./SecondaryNav";

function isModulePath(pathname: string) {
  return MODULE_TABS.some(
    tab =>
      pathname.startsWith(tab.href) ||
      (tab.sub?.some(s => pathname.startsWith(s.href)) ?? false)
  );
}

// ─── Dashboard-style page header (list pages with breadcrumbs) ────────────────

interface DashboardPageHeaderProps {
  title: string;
  breadcrumbs: { label: string; href?: string }[];
  summary?: string;
  buttonText?: string;
  buttonHref?: string;
  rightContent?: ReactNode;
}

export function DashboardPageHeader({
  title,
  breadcrumbs,
  summary,
  buttonText,
  buttonHref,
  rightContent,
}: DashboardPageHeaderProps) {
  const pathname = usePathname();
  const topPadding = isModulePath(pathname) ? "pt-30" : "pt-16";

  return (
    <div className={`${topPadding} bg-white/60 backdrop-blur-xl border-b border-white/50 px-10 pt-5 pb-4 flex items-center justify-between shrink-0`}>
      <div>
        <div className="flex items-center gap-1.5 text-[10px] text-gray-400 mb-0.5">
          {breadcrumbs.map((crumb, i) => (
            <span key={crumb.label} className="flex items-center gap-1.5">
              {i > 0 && (
                <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
                </svg>
              )}
              {crumb.href ? (
                <Link href={crumb.href} className="hover:text-slate-600 transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-600 font-medium">{crumb.label}</span>
              )}
            </span>
          ))}
        </div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
      </div>

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
                  <button className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#884D70] text-white text-[12px] font-semibold rounded-full hover:bg-[#6B3A5A] transition-colors shadow-md">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                    {buttonText}
                  </button>
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </div>
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
