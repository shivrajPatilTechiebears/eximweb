import { Icon } from "@/components/ui/Icon";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
}

export function SearchBar({
  placeholder = "Search",
  className,
  inputClassName,
}: SearchBarProps) {
  return (
    <div className={`relative w-48${className ? ` ${className}` : ""}`}>
      <input
        className={`pl-8 pr-2 py-1 h-8 w-full bg-white border border-gray-200 rounded text-xs focus:ring-1 focus:ring-primary focus:border-primary transition-all outline-none${inputClassName ? ` ${inputClassName}` : ""}`}
        placeholder={placeholder}
        type="text"
      />
      <Icon name="search" size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
    </div>
  );
}
