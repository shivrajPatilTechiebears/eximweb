import { Icon } from "@/components/ui/Icon";

interface HeaderProps {
  title: string;
  userName: string;
  userRole: string;
}

export function Header({ title, userName, userRole }: HeaderProps) {
  return (
    <header className="flex justify-between items-center w-full px-4 h-12 sticky top-0 z-40 bg-white border-b border-outline-variant">
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container transition-colors">
          <Icon name="menu_open" />
        </button>
        <h2 className="font-display-lg text-lg text-on-surface">{title}</h2>
      </div>
      <div className="flex items-center gap-2 px-2 py-1 hover:bg-surface-container-high transition-all cursor-pointer rounded-full border border-outline-variant scale-90">
        <Icon name="account_circle" className="text-primary text-2xl" />
        <div className="text-right hidden sm:block">
          <p className="font-body-md text-xs font-bold text-on-surface leading-tight">
            {userName}
          </p>
          <p className="font-label-caps text-[8px] text-on-surface-variant">{userRole}</p>
        </div>
        <Icon name="keyboard_arrow_down" className="text-on-surface-variant text-sm" />
      </div>
    </header>
  );
}
