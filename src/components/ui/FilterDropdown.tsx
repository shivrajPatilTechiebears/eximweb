import { Icon } from "./Icon";

interface FilterDropdownProps {
  icon: string;
  label: string;
}

export function FilterDropdown({ icon, label }: FilterDropdownProps) {
  return (
    <div className="flex items-center gap-1 px-2 h-8 bg-white border border-outline-variant rounded cursor-pointer hover:bg-surface-container-low transition-colors text-[11px]">
      <Icon name={icon} className="text-base" />
      <span>{label}</span>
      <Icon name="keyboard_arrow_down" className="text-base" />
    </div>
  );
}
