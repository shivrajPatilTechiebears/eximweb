export type BadgeVariant =
  | "created"
  | "pending"
  | "success"
  | "planned"
  | "muted"
  | "danger"
  | "warning";

type BadgeShape = "rounded" | "pill";
type BadgeSize = "xs" | "sm";

const variantStyles: Record<BadgeVariant, string> = {
  created:  "bg-[#6cf8bb]/10 text-[#00714d] border-[#6cf8bb]/30",
  pending:  "bg-gray-100 text-gray-500 border-gray-200",
  success:  "bg-green-100 text-green-700 border-green-200",
  planned:  "bg-blue-100 text-blue-700 border-blue-200",
  muted:    "bg-gray-100 text-gray-500 border-gray-200",
  danger:   "bg-red-100 text-red-700 border-red-200",
  warning:  "bg-amber-50 text-amber-600 border-amber-100",
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
