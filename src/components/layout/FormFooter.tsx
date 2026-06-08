import React from "react";

// ─── Metric item ──────────────────────────────────────────────────────────────

export interface FooterMetric {
  label: string;
  value: string;
}

// ─── Action button ────────────────────────────────────────────────────────────

type FooterButtonVariant = "ghost" | "secondary" | "primary";

const buttonStyles: Record<FooterButtonVariant, string> = {
  /** Subtle ghost — Cancel */
  ghost:
    "px-3 py-1.5 text-[11px] font-bold text-gray-500 hover:text-primary transition-colors rounded uppercase tracking-wider",
  /** Soft tinted — Save as Draft */
  secondary:
    "px-3 py-1.5 text-[11px] font-bold bg-primary/10 text-primary hover:bg-primary/15 transition-all rounded uppercase tracking-wider",
  /** Brand gradient — Submit */
  primary:
    "px-4 py-1.5 text-[11px] font-bold bg-gradient-to-br from-primary to-surface-tint text-white hover:opacity-90 transition-all rounded uppercase tracking-wider shadow-sm",
};

interface FooterButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: FooterButtonVariant;
}

export function FormFooterButton({
  variant = "ghost",
  children,
  className,
  ...props
}: FooterButtonProps) {
  return (
    <button
      className={`${buttonStyles[variant]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

// ─── Footer strip ─────────────────────────────────────────────────────────────

interface FormFooterProps {
  metrics?: FooterMetric[];
  actions: React.ReactNode;
}

export function FormFooter({ metrics = [], actions }: FormFooterProps) {
  return (
    <div className="px-4 pb-4">
      <div
        className="flex items-center justify-between px-4 py-2.5 rounded-xl shadow-sm"
        style={{ backgroundImage: "var(--chart-card-bg)" }}
      >
        {/* Metrics */}
        <div className="flex gap-6 px-1">
          {metrics.map((metric, i) => (
            <React.Fragment key={metric.label}>
              {i > 0 && <div className="w-px h-6 bg-primary/15 self-center" />}
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-semibold text-on-primary-container leading-tight tracking-wider">
                  {metric.label}
                </span>
                <span className="text-[15px] font-bold leading-none text-primary">
                  {metric.value}
                </span>
              </div>
            </React.Fragment>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">{actions}</div>
      </div>
    </div>
  );
}
