import { Icon } from "./Icon";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  className?: string;
}

export function EmptyState({ icon, title, description, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center gap-3 py-20 ${className}`}>
      <div className="empty-state-icon-badge">
        <Icon name={icon} size={24} className="empty-state-icon" />
      </div>
      <p className="text-[13px] font-semibold text-slate-600">{title}</p>
      <p className="text-[11px] text-slate-500">{description}</p>
    </div>
  );
}
