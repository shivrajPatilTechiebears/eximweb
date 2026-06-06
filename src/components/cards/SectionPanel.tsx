import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

type SectionPanelTone = "surface" | "primary";

const headerStyles: Record<SectionPanelTone, string> = {
  surface:
    "px-4 py-2 border-b border-outline-variant/60 bg-surface-container-low flex justify-between items-center",
  primary:
    "px-4 py-2 bg-primary-container/96 text-on-primary flex justify-between items-center",
};

interface SectionPanelProps {
  title?: string;
  icon?: string;
  action?: ReactNode;
  children: ReactNode;
  tone?: SectionPanelTone;
  className?: string;
  bodyClassName?: string;
}

export function SectionPanel({
  title,
  icon,
  action,
  children,
  tone = "surface",
  className,
  bodyClassName,
}: SectionPanelProps) {
  const hasHeader = Boolean(title || action);

  return (
    <section
      className={`bg-surface-container-lowest border border-outline-variant/70 rounded-lg overflow-hidden shadow-sm${className ? ` ${className}` : ""}`}
    >
      {hasHeader && (
        <div className={headerStyles[tone]}>
          {title ? (
            <h3
              className={`text-[11px] font-bold uppercase flex items-center gap-2${tone === "surface" ? " text-on-surface-variant" : ""}`}
            >
              {icon && <Icon name={icon} className="text-sm" />}
              {title}
            </h3>
          ) : (
            <span />
          )}
          {action}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
