interface TimeframeToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  label?: string;
}

export function TimeframeToggle({ value, onChange, label = "Timeframe" }: TimeframeToggleProps) {
  return (
    <button onClick={() => onChange(!value)} className="flex items-center gap-2">
      <div
        className={`w-11 h-6 rounded-full relative flex-shrink-0 transition-colors duration-200 ${
          value ? "bg-gray-900" : "bg-gray-300"
        }`}
      >
        <div
          className={`absolute top-[3px] w-[18px] h-[18px] bg-white rounded-full shadow transition-all duration-200 ${
            value ? "right-[3px]" : "left-[3px]"
          }`}
        />
      </div>
      <span className="text-sm font-semibold text-gray-900">{label}</span>
    </button>
  );
}
