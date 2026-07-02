import Image from "next/image";
import { Icon } from "./Icon";

export type FileExt = "pdf" | "jpg" | "png" | "xlsx" | "docx";

interface FileTypeConfig {
  label: string;
  textClass: string;
  gradientClass: string;
  borderClass: string;
}

const FILE_TYPE_CONFIG: Record<FileExt, FileTypeConfig> = {
  pdf:  { label: "PDF", textClass: "text-red-500",     gradientClass: "from-red-50 to-red-100",         borderClass: "border-red-200/60" },
  jpg:  { label: "IMG", textClass: "text-blue-500",    gradientClass: "from-blue-50 to-indigo-100",     borderClass: "border-blue-200/60" },
  png:  { label: "PNG", textClass: "text-blue-500",    gradientClass: "from-blue-50 to-indigo-100",     borderClass: "border-blue-200/60" },
  xlsx: { label: "XLS", textClass: "text-emerald-600", gradientClass: "from-emerald-50 to-emerald-100", borderClass: "border-emerald-200/60" },
  docx: { label: "DOC", textClass: "text-violet-600",  gradientClass: "from-violet-50 to-violet-100",   borderClass: "border-violet-200/60" },
};

interface FileTypeIconProps {
  ext: FileExt;
  /** "badge" — small square used inline (list rows); "tile" — wide preview strip (grid cards) */
  variant?: "badge" | "tile";
  /** Shrinks the "tile" variant's height for dense grid layouts */
  compact?: boolean;
  /** Real preview image URL for the file — when present, renders the actual thumbnail
   *  (cropped to fill the same footprint) instead of the placeholder ext label/icon */
  thumbnailUrl?: string;
  className?: string;
}

export function FileTypeIcon({ ext, variant = "badge", compact = false, thumbnailUrl, className = "" }: FileTypeIconProps) {
  const cfg = FILE_TYPE_CONFIG[ext];
  const surface = `bg-gradient-to-br ${cfg.gradientClass} border ${cfg.borderClass} shadow-sm flex items-center justify-center`;

  if (variant === "tile") {
    const sizeClass = compact ? "h-11" : "h-16";

    if (thumbnailUrl) {
      return (
        <div className={`relative ${sizeClass} rounded-t-xl border-b ${cfg.borderClass} overflow-hidden ${className}`}>
          <Image
            src={thumbnailUrl}
            alt=""
            fill
            sizes={compact ? "112px" : "180px"}
            className="object-cover"
          />
        </div>
      );
    }

    return (
      <div className={`${sizeClass} rounded-t-xl border-b ${surface} ${className}`}>
        <span className={`${compact ? "text-sm" : "text-lg"} font-black tracking-tight ${cfg.textClass}`}>{cfg.label}</span>
      </div>
    );
  }

  if (thumbnailUrl) {
    return (
      <div className={`relative w-9 h-9 rounded-xl shrink-0 overflow-hidden border ${cfg.borderClass} shadow-sm ${className}`}>
        <Image src={thumbnailUrl} alt="" fill sizes="36px" className="object-cover" />
      </div>
    );
  }

  return (
    <div className={`w-9 h-9 rounded-xl shrink-0 ${surface} ${className}`}>
      {ext === "jpg" || ext === "png" ? (
        <Icon name="add_photo_alternate" size={15} className={cfg.textClass} />
      ) : (
        <span className={`text-[9px] font-black tracking-tight ${cfg.textClass}`}>{cfg.label}</span>
      )}
    </div>
  );
}
