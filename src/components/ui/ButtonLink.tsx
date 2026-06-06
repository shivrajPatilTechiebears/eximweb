import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";
import { buttonVariantStyles, type ButtonVariant } from "./Button";
import { Icon } from "./Icon";

interface ButtonLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> {
  href: string;
  variant?: ButtonVariant;
  icon?: string;
  children: ReactNode;
}

export function ButtonLink({
  href,
  variant = "primary",
  icon,
  children,
  className,
  ...props
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={`${buttonVariantStyles[variant]}${className ? ` ${className}` : ""}`}
      {...props}
    >
      {icon && <Icon name={icon} className="text-base" />}
      {children}
    </Link>
  );
}
