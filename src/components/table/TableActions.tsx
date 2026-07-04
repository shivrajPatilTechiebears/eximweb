import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

interface TableActionsProps {
  viewHref?: string;
  /** Use instead of viewHref when "View" should open a modal rather than navigate. */
  onView?: () => void;
  editHref?: string;
  /** Use instead of editHref when "Edit" should open a modal rather than navigate. */
  onEdit?: () => void;
  onDelete?: () => void;
  onMore?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function TableActions({ viewHref, onView, editHref, onEdit, onDelete, onMore }: TableActionsProps) {
  return (
    <div className="flex items-center gap-0.5">
      {viewHref && (
        <Link href={viewHref}>
          <button className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors" title="View">
            <Icon name="visibility" size={13} />
          </button>
        </Link>
      )}
      {!viewHref && onView && (
        <button
          onClick={onView}
          className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="View"
        >
          <Icon name="visibility" size={13} />
        </button>
      )}
      {editHref && (
        <Link href={editHref}>
          <button className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
            <Icon name="edit" size={13} />
          </button>
        </Link>
      )}
      {!editHref && onEdit && (
        <button
          onClick={onEdit}
          className="p-1.5 text-gray-400 hover:text-slate-700 hover:bg-gray-100 rounded-lg transition-colors"
          title="Edit"
        >
          <Icon name="edit" size={13} />
        </button>
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
