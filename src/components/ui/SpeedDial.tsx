"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Icon } from "./Icon";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SpeedDialAction {
  icon: string;
  label: string;
  sub?: string;
  href?: string;
  iconBg?: string;
  iconColor?: string;
  onClick?: () => void;
}

interface SpeedDialProps {
  actions: SpeedDialAction[];
  label?: string;
  dismissLabel?: string;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function SpeedDial({ actions, label = "Quick Actions", dismissLabel = "Dismiss" }: SpeedDialProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  const cardBase = "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-gray-950/80 backdrop-blur-xl border border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.35)] hover:bg-gray-900/90 hover:border-white/20 hover:shadow-[0_8px_28px_rgba(0,0,0,0.45)] transition-all duration-200";

  return (
    <div ref={ref} className="relative">

      {/* Action cards */}
      <div className={`absolute bottom-full left-0 right-0 mb-3 flex flex-col gap-1.5 transition-all duration-300 ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"}`}>
        {actions.map((action, i) => {
          const cardClass = `${cardBase} ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`;
          const delay = { transitionDelay: open ? `${i * 60}ms` : `${(actions.length - 1 - i) * 35}ms` };

          const content = (
            <div className={cardClass}>
              {action.iconBg && (
                <div className={`${action.iconBg} w-7 h-7 rounded-lg flex items-center justify-center shrink-0`}>
                  <Icon name={action.icon} size={14} className={action.iconColor ?? "text-gray-700"} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[12px] font-bold text-white leading-none tracking-wide">{action.label}</p>
                {action.sub && <p className="text-[10px] text-white/35 mt-0.5 leading-none">{action.sub}</p>}
              </div>
              <div className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center shrink-0 group-hover:bg-white/20 transition-colors">
                <Icon name="arrow_back" size={10} className="text-white/40 group-hover:text-white/70 rotate-180 transition-colors" />
              </div>
            </div>
          );

          return action.href ? (
            <Link key={action.label} href={action.href} style={delay} onClick={() => { action.onClick?.(); setOpen(false); }}>
              {content}
            </Link>
          ) : (
            <button key={action.label} type="button" style={delay} className="w-full text-left" onClick={() => { action.onClick?.(); setOpen(false); }}>
              {content}
            </button>
          );
        })}
      </div>

      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full relative flex items-center gap-3 px-4 py-2.5 rounded-xl text-white bg-teal-600 shadow-[0_4px_16px_-2px_rgba(20,184,166,0.45)] hover:bg-teal-500 hover:shadow-[0_6px_22px_-2px_rgba(20,184,166,0.55)] active:scale-[0.97] transition-all duration-200"
      >
        <div className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-white/0 via-white/25 to-white/0 pointer-events-none" />

        <div className={`shrink-0 transition-transform duration-300 ease-out ${open ? "rotate-[135deg]" : "rotate-0"}`}>
          <Icon name="add_circle" size={17} className="text-white/90" />
        </div>

        <span className="flex-1 text-left text-[11px] font-bold tracking-[0.08em] uppercase">
          {open ? dismissLabel : label}
        </span>

        <span className={`text-[10px] font-bold bg-white/20 border border-white/15 px-1.5 py-0.5 rounded-md leading-none transition-all duration-200 ${open ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}>
          {actions.length}
        </span>
      </button>

    </div>
  );
}
