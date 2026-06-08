import type { ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";

type SectionPanelTone = "surface" | "primary";

const headerStyles: Record<SectionPanelTone, string> = {
  surface:
    "px-4 py-3 border-b border-white/60 flex justify-between items-center gap-2",
  primary:
    "px-4 py-3 bg-gray-900 text-white flex justify-between items-center gap-2",
};

interface SectionPanelProps {
  title?: string;
  icon?: string;
  /** Rendered before the icon+title — use for a back button, avatar, etc. */
  headerPrefix?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  tone?: SectionPanelTone;
  className?: string;
  bodyClassName?: string;
}

export function SectionPanel({
  title,
  icon,
  headerPrefix,
  action,
  children,
  tone = "surface",
  className,
  bodyClassName,
}: SectionPanelProps) {
  const hasHeader = Boolean(title || action || headerPrefix);

  return (
    <section
      className={`bg-white/75 border border-white rounded-2xl overflow-hidden shadow-sm${className ? ` ${className}` : ""}`}
    >
      {hasHeader && (
        <div className={headerStyles[tone]}>
          <div className="flex items-center gap-2 min-w-0">
            {headerPrefix}
            {title && (
              <h3
                className={`text-sm font-semibold flex items-center gap-1.5${tone === "surface" ? " text-gray-900" : " text-white"}`}
              >
                {icon && <Icon name={icon} size={15} className="text-gray-400" />}
                {title}
              </h3>
            )}
          </div>
          {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}
