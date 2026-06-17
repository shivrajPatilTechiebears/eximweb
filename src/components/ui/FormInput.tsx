interface FormInputProps {
  label: string;
  name?: string;
  value?: string;
  placeholder?: string;
  type?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
}

export function FormInput({
  label,
  name,
  value,
  placeholder,
  type = "text",
  onChange,
  disabled = false,
}: FormInputProps) {
  return (
    <div>
      <label className="block text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full px-3 py-2 text-[12px] bg-[#f8f9fc] border border-gray-200 rounded-lg outline-none focus:border-[#8470ff]/50 focus:ring-1 focus:ring-[#8470ff]/10 placeholder:text-gray-300 text-slate-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
  );
}
