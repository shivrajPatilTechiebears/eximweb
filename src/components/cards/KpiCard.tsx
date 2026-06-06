type KpiTone = "primary" | "success" | "danger" | "muted";

const valueStyles: Record<KpiTone, string> = {
  primary: "text-primary",
  success: "text-secondary",
  danger: "text-error",
  muted: "text-on-surface",
};

interface KpiCardProps {
  title: string;
  value: string;
  helper?: string;
  helperTone?: KpiTone;
  valueTone?: KpiTone;
}

export function KpiCard({
  title,
  value,
  helper,
  helperTone = "muted",
  valueTone = "primary",
}: KpiCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant/70 rounded-lg p-2 flex flex-col justify-between shadow-sm min-h-[68px]">
      <span className="text-[10px] text-on-surface-variant font-semibold uppercase">
        {title}
      </span>
      <div className="flex items-baseline gap-1">
        <span className={`text-xl font-extrabold ${valueStyles[valueTone]}`}>
          {value}
        </span>
        {helper && (
          <span className={`text-[10px] font-bold ${valueStyles[helperTone]}`}>
            {helper}
          </span>
        )}
      </div>
    </div>
  );
}
