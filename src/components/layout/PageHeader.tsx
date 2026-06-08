import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

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
