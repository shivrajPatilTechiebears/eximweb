interface Step {
  label: string;
  complete: boolean;
}

interface ProgressPillProps {
  steps: Step[];
}

export function ProgressPill({ steps }: ProgressPillProps) {
  const completedCount = steps.filter((s) => s.complete).length;

  return (
    <div className="inline-flex items-center bg-[#FFDBCB]/10 border border-[#884D70]/20 rounded-full shadow-[0_4px_24px_rgba(136,77,112,0.13)] px-3 py-2 gap-2">
      <span className="text-[9px] font-medium text-[#884D70]/60 uppercase tracking-wide">Progress</span>
      <div className="flex items-center gap-1">
        {steps.map((step) => (
          <div
            key={step.label}
            title={step.label}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              step.complete ? "w-8 bg-[#884D70]" : "w-1.5 bg-[#FFDBCB]"
            }`}
          />
        ))}
      </div>
      <span className="text-[10px] font-semibold text-[#884D70] tabular-nums">
        {completedCount}/{steps.length}
      </span>
    </div>
  );
}
