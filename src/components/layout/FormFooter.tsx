import React from "react";

// ─── Metric item ──────────────────────────────────────────────────────────────

export interface FooterMetric {
  label: string;
  value: string;
}

// ─── Action button ────────────────────────────────────────────────────────────

type FooterButtonVariant = "ghost" | "secondary" | "primary";

const buttonStyles: Record<FooterButtonVariant, string> = {
  /** Subtle transparent — for Cancel / dismiss actions */
  ghost:
    "px-3 py-1.5 text-[11px] font-bold bg-white/10 hover:bg-white/20 transition-all rounded-lg uppercase tracking-wider",
  /** Light surface — for Save / draft actions */
  secondary:
    "px-3 py-1.5 text-[11px] font-bold bg-surface-container-highest text-primary-container hover:bg-white transition-all rounded-lg uppercase tracking-wider",
  /** Accent green — for Submit / confirm actions */
  primary:
    "px-4 py-1.5 text-[11px] font-bold bg-secondary-fixed text-on-secondary-fixed hover:shadow-[0_0_15px_rgba(111,251,190,0.4)] transition-all rounded-lg uppercase tracking-wider",
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
  /** Summary metrics shown on the left with dividers. */
  metrics?: FooterMetric[];
  /** Action buttons on the right — use <FormFooterButton> for consistent styling. */
  actions: React.ReactNode;
}

export function FormFooter({ metrics = [], actions }: FormFooterProps) {
  return (
    <div className="px-4 pb-4 bg-background">
      <div className="flex items-center justify-between bg-primary-container px-4 py-2 rounded-xl text-on-primary">
        {/* Metrics */}
        <div className="flex gap-6 px-1">
          {metrics.map((metric, i) => (
            <React.Fragment key={metric.label}>
              {i > 0 && <div className="w-px h-6 bg-on-primary/20 self-center" />}
              <div className="flex flex-col">
                <span className="text-[9px] uppercase font-bold text-on-primary/60 leading-tight">
                  {metric.label}
                </span>
                <span className="text-base font-extrabold leading-none">{metric.value}</span>
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
