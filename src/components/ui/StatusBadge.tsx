interface StatusBadgeProps {
  label: string;
  color?: "warning" | "success" | "info" | "error";
  pulse?: boolean;
  className?: string;
}

const COLOR_MAP = {
  warning: {
    badge: "text-amber-600 bg-amber-50 border-amber-200/70",
    dot:   "bg-amber-400",
  },
  success: {
    badge: "text-emerald-600 bg-emerald-50 border-emerald-200/70",
    dot:   "bg-emerald-400",
  },
  info: {
    badge: "text-sky-600 bg-sky-50 border-sky-200/70",
    dot:   "bg-sky-400",
  },
  error: {
    badge: "text-red-600 bg-red-50 border-red-200/70",
    dot:   "bg-red-400",
  },
} as const;

export function StatusBadge({
  label,
  color = "info",
  pulse = false,
  className = "",
}: StatusBadgeProps) {
  const { badge, dot } = COLOR_MAP[color];

  return (
    <span
      className={`inline-flex items-center gap-1 text-[10px] font-semibold border px-2.5 py-1 rounded-full ${badge} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dot} ${pulse ? "animate-pulse" : ""}`} />
      {label}
    </span>
  );
}
