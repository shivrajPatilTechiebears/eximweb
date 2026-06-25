"use client";

import { useState, useRef, useEffect } from "react";
import { Icon } from "./Icon";

interface MenuItem {
  label: string;
  onClick: () => void;
}

interface OverflowMenuProps {
  items: MenuItem[];
}

export function OverflowMenu({ items }: OverflowMenuProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="btn-icon"
        title="More"
      >
        <Icon name="more_vert" size={16} />
      </button>
      {open && (
        <div className="absolute right-0 bottom-6 z-50 w-36 dropdown-glass">
          {items.map((item) => (
            <button
              key={item.label}
              onClick={() => { item.onClick(); setOpen(false); }}
              className="btn-menu-item"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
