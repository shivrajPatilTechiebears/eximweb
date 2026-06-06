import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface NavLinkProps {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

export function NavLink({ icon, label, href, active = false }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={
        active
          ? "bg-white/10 text-white rounded flex items-center gap-2 px-2 py-1.5 font-bold group"
          : "flex items-center gap-2 px-2 py-1.5 text-on-primary/70 hover:text-on-primary hover:bg-on-primary-fixed-variant/10 transition-colors rounded group"
      }
    >
      <Icon name={icon} />
      <span className="text-xs">{label}</span>
    </Link>
  );
}
