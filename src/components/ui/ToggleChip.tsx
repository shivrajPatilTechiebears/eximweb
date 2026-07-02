import { Button } from "./Button";

interface ToggleChipProps {
  label: string;
  active: boolean;
  onClick: () => void;
  /** Leading color dot shown when inactive (hidden once active, matching the active fill) */
  dotClassName?: string;
  className?: string;
}

/** Small pill toggle — e.g. quick-access category filters */
export function ToggleChip({ label, active, onClick, dotClassName, className = "" }: ToggleChipProps) {
  return (
    <Button
      variant="unstyled"
      onClick={onClick}
      className={`doc-quick-chip ${active ? "doc-quick-chip-active" : "doc-quick-chip-inactive"} ${className}`}
    >
      {!active && dotClassName && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotClassName}`} />}
      {label}
    </Button>
  );
}
