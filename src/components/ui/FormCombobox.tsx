"use client";

import { useState, useRef, useEffect, useId } from "react";

export interface ComboboxOption {
  label: string;
  value: string;
}

interface FormComboboxProps {
  label: string;
  options: ComboboxOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function FormCombobox({
  label,
  options,
  value,
  placeholder = "Select or type…",
  onChange,
  disabled = false,
}: FormComboboxProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [highlighted, setHighlighted] = useState(-1);

  const selectedLabel = options.find((o) => o.value === value)?.label ?? "";

  // Filtered list
  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
        setHighlighted(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (opt: ComboboxOption) => {
    onChange?.(opt.value);
    setOpen(false);
    setQuery("");
    setHighlighted(-1);
    inputRef.current?.blur();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHighlighted(0);
    if (!open) setOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ") {
        setOpen(true);
        setHighlighted(0);
        e.preventDefault();
      }
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted((h) => Math.max(h - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (highlighted >= 0 && filtered[highlighted]) select(filtered[highlighted]);
        break;
      case "Escape":
        setOpen(false);
        setQuery("");
        setHighlighted(-1);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement | undefined;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  const displayValue = open ? query : selectedLabel;

  return (
    <div ref={containerRef} className="relative">
      <label
        htmlFor={id}
        className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1"
      >
        {label}
      </label>

      {/* Input */}
      <div
        className={`flex items-center w-full px-3 py-2 text-[12px] bg-[#f8f9fc] border rounded-lg transition-all ${
          open
            ? "border-[#8470ff]/50 ring-1 ring-[#8470ff]/10"
            : "border-gray-200"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          id={id}
          ref={inputRef}
          type="text"
          disabled={disabled}
          value={displayValue}
          placeholder={placeholder}
          onChange={handleInputChange}
          onFocus={() => { setOpen(true); setHighlighted(value ? options.findIndex(o => o.value === value) : 0); }}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className="flex-1 bg-transparent outline-none text-slate-700 placeholder:text-gray-300 min-w-0 disabled:cursor-not-allowed"
        />
        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={() => {
            if (open) { setOpen(false); setQuery(""); }
            else { setOpen(true); inputRef.current?.focus(); setHighlighted(0); }
          }}
          className="ml-1 text-gray-400 shrink-0 transition-transform duration-150"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
          </svg>
        </button>
      </div>

      {/* Dropdown */}
      {open && !disabled && (
        <ul
          ref={listRef}
          className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-[0_8px_30px_rgba(0,0,0,0.10)] py-1 max-h-52 overflow-y-auto"
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-2 text-[11px] text-gray-400 text-center">No results</li>
          ) : (
            filtered.map((opt, i) => {
              const isSelected = opt.value === value;
              const isHighlighted = i === highlighted;
              return (
                <li
                  key={opt.value}
                  onMouseDown={(e) => { e.preventDefault(); select(opt); }}
                  onMouseEnter={() => setHighlighted(i)}
                  className={`flex items-center justify-between px-3 py-2 text-[12px] cursor-pointer transition-colors ${
                    isHighlighted ? "bg-[#8470ff]/8 text-[#8470ff]" : "text-slate-700"
                  } ${isSelected ? "font-semibold" : ""}`}
                >
                  <span>{opt.label}</span>
                  {isSelected && (
                    <svg className="w-3 h-3 text-[#8470ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" />
                    </svg>
                  )}
                </li>
              );
            })
          )}
        </ul>
      )}
    </div>
  );
}
