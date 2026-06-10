import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface NavLinkProps {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
  iconSize?: number;
  textSize?: string;
}

export function NavLink({ icon, label, href, active = false, iconSize = 14, textSize = "text-[12px]" }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-2 py-1.5 rounded-lg transition-colors ${
        active
          ? "text-white bg-teal-600/20"
          : "text-slate-400 hover:text-slate-200 hover:bg-slate-800"
      }`}
    >
      <Icon
        name={icon}
        size={iconSize}
        className={`shrink-0 ${active ? "text-teal-400" : "text-slate-500"}`}
      />
      <span className={`${textSize} leading-none ${active ? "font-bold" : "font-normal"}`}>
        {label}
      </span>
    </Link>
  );
}
