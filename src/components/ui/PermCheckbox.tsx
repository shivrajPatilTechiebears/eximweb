"use client";

export type PermCheckboxState = "checked" | "unchecked";

interface PermCheckboxProps {
  state: PermCheckboxState;
  onToggle: () => void;
}

export function PermCheckbox({ state, onToggle }: PermCheckboxProps) {
  return (
    <button
      onClick={onToggle}
      className={`w-5 h-5 rounded-[5px] flex items-center justify-center shrink-0 transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#884D70]/40 ${
        state === "checked"
          ? "bg-gradient-to-br from-[#A06080] to-[#884D70] border-2 border-[#884D70]/70 shadow-[0_1px_3px_rgba(136,77,112,0.25)]"
          : "bg-white border-2 border-[#94A3B8] shadow-[0_1px_3px_rgba(0,0,0,0.10)] hover:border-[#884D70]/70 hover:shadow-[0_1px_5px_rgba(136,77,112,0.15)]"
      }`}
    >
      {state === "checked" && (
        <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
          <path d="M1.5 4.5L4 7L9.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
