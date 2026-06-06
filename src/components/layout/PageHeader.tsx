import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

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
            className="w-7 h-7 bg-primary-container text-on-primary rounded flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
          >
            <Icon name="arrow_back" className="text-sm" />
          </Link>
        )}
        <div className="min-w-0">
          <div className="flex items-center gap-3 min-w-0">
            <h3 className="text-[14px] font-bold leading-none text-primary truncate">
              {title}
            </h3>
            {meta && (
              <>
                <div className="hidden sm:block h-5 w-px bg-outline-variant" />
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
