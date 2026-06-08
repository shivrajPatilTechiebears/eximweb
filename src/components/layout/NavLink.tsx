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
      className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors ${
        active
          ? "text-black"
          : "text-black/60 hover:text-black/80"
      }`}
    >
      <Icon
        name={icon}
        className={`text-[12px] shrink-0 ${active ? "text-black" : "text-black/60"}`}
      />
      <span className={`text-[12px] leading-none ${active ? "font-bold" : "font-normal"}`}>
        {label}
      </span>
    </Link>
  );
}
