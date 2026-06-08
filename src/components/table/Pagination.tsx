interface PaginationProps {
  current: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
}

export function Pagination({ current, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange?.(current - 1)}
        disabled={current === 1}
        className="h-7 px-2.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange?.(page)}
          className={
            page === current
              ? "h-7 w-7 text-xs font-bold rounded-lg text-white bg-gradient-to-br from-primary to-surface-tint shadow-sm"
              : "h-7 w-7 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          }
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange?.(current + 1)}
        disabled={current === totalPages}
        className="h-7 px-2.5 text-xs font-medium text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next
      </button>
    </div>
  );
}
