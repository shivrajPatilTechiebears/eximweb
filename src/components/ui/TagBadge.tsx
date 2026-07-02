interface TagBadgeProps {
  label: string;
  badgeClassName: string;
  dotClassName?: string;
  className?: string;
}

/** Generic dot + pill tag badge. Colors are supplied by the caller's own
 *  category config (e.g. document type, status), keeping this component
 *  reusable across domains without baking in a fixed palette. */
export function TagBadge({ label, badgeClassName, dotClassName, className = "" }: TagBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-bold border whitespace-nowrap ${badgeClassName} ${className}`}
    >
      {dotClassName && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClassName}`} />}
      {label}
    </span>
  );
}
