import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface TableActionsProps {
  viewHref?: string;
  editHref?: string;
  onDelete?: () => void;
  onMore?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TableActions({ viewHref, editHref, onDelete, onMore }: TableActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {viewHref && (
        <Link href={viewHref}>
          <button className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors" title="View">
            <Icon name="visibility" size={13} />
          </button>
        </Link>
      )}
      {editHref && (
        <Link href={editHref}>
          <button className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
            <Icon name="edit" size={13} />
          </button>
        </Link>
      )}
      {onDelete && (
        <button
          onClick={onDelete}
          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete"
        >
          <Icon name="delete" size={13} />
        </button>
      )}
      {onMore && (
        <button
          onClick={onMore}
          className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="More"
        >
          <Icon name="more_vert" size={13} />
        </button>
      )}
    </div>
  );
}
