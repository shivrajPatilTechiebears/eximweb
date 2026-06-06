import { NavLink } from "./NavLink";

export interface NavItem {
  icon: string;
  label: string;
  href: string;
  active?: boolean;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

interface SidebarProps {
  logoSrc: string;
  logoAlt: string;
  appName: string;
  appSubtitle: string;
  sections: NavSection[];
}

export function Sidebar({ logoSrc, logoAlt, appName, appSubtitle, sections }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 h-full w-[240px] flex flex-col p-lg bg-primary-container border-r border-outline-variant z-50">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 bg-white rounded flex items-center justify-center p-1 overflow-hidden shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img alt={logoAlt} className="w-full h-full object-contain" src={logoSrc} />
        </div>
        <div className="min-w-0">
          <h1 className="font-headline-md text-sm font-bold text-white tracking-tight truncate">
            {appName}
          </h1>
          <p className="font-label-caps text-[8px] text-white/60 tracking-widest uppercase truncate">
            {appSubtitle}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]">
        {sections.map((section) => (
          <div key={section.label} className="pb-2">
            <p className="font-label-caps text-[9px] text-white/40 mb-1 ml-1">
              {section.label}
            </p>
            {section.items.map((item) => (
              <NavLink
                key={item.label}
                icon={item.icon}
                label={item.label}
                href={item.href}
                active={item.active}
              />
            ))}
          </div>
        ))}
      </nav>
    </aside>
  );
}
