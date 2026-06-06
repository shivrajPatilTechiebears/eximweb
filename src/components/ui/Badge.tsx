export type BadgeVariant =
  | "created"
  | "pending"
  | "success"
  | "planned"
  | "muted"
  | "danger";

type BadgeShape = "rounded" | "pill";
type BadgeSize = "xs" | "sm";

const variantStyles: Record<BadgeVariant, string> = {
  created:
    "bg-[#6cf8bb]/10 text-[#00714d] border-[#6cf8bb]/30",
  pending:
    "bg-surface-container-high text-on-surface-variant border-outline-variant",
  success:
    "bg-secondary-container text-on-secondary-container border-secondary-container",
  planned:
    "bg-tertiary-container text-on-tertiary-container border-tertiary-container",
  muted:
    "bg-surface-variant text-on-surface-variant border-surface-variant",
  danger:
    "bg-error-container text-on-error-container border-error-container",
};

const shapeStyles: Record<BadgeShape, string> = {
  rounded: "rounded",
  pill: "rounded-full",
};

const sizeStyles: Record<BadgeSize, string> = {
  xs: "px-1.5 py-0.5 text-[9px]",
  sm: "px-2 py-0.5 text-[10px]",
};

interface BadgeProps {
  variant: BadgeVariant;
  label: string;
  shape?: BadgeShape;
  size?: BadgeSize;
  uppercase?: boolean;
  className?: string;
}

export function Badge({
  variant,
  label,
  shape = "rounded",
  size = "xs",
  uppercase = true,
  className,
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center font-bold border leading-none ${shapeStyles[shape]} ${sizeStyles[size]} ${uppercase ? "uppercase" : ""} ${variantStyles[variant]}${className ? ` ${className}` : ""}`}
    >
      {label}
    </span>
  );
}
