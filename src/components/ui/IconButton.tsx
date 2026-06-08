import React from "react";
import { Button } from "./Button";
import { Icon } from "./Icon";

type IconButtonTone = "primary" | "danger" | "muted";

const toneStyles: Record<IconButtonTone, string> = {
  primary: "text-primary",
  danger: "text-error",
  muted: "text-on-surface-variant",
};

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: string;
  label: string;
  tone?: IconButtonTone;
}

export function IconButton({
  icon,
  label,
  tone = "primary",
  className,
  ...props
}: IconButtonProps) {
  return (
    <Button
      variant={tone === "danger" ? "icon-danger" : "icon"}
      title={label}
      aria-label={label}
      className={`p-1 rounded hover:bg-gray-100 ${toneStyles[tone]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      <Icon name={icon} className="text-sm" />
    </Button>
  );
}
