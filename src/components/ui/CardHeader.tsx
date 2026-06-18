import type { ReactNode } from "react";

interface CardHeaderProps {
  title: string;
  /** Short helper text rendered on the right (e.g. "Tab · Enter to move between fields") */
  hint?: string;
  /** Arbitrary right-side content — takes precedence over hint when both are provided */
  action?: ReactNode;
}

export function CardHeader({ title, hint, action }: CardHeaderProps) {
  return (
    <div className="px-5 py-2.5 border-b border-white/40 flex items-center justify-between">
      <h2 className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest">
        {title}
      </h2>
      {action ?? (hint && <span className="text-[10px] text-gray-400">{hint}</span>)}
    </div>
  );
}
