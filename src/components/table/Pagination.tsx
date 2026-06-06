interface PaginationProps {
  current: number;
  total: number;
  totalPages: number;
}

export function Pagination({ current, total, totalPages }: PaginationProps) {
  return (
    <div className="px-4 py-2 flex items-center justify-between bg-white border-t border-outline-variant">
      <p className="text-[11px] text-on-surface-variant">
        Showing {current} of {total}
      </p>
      <div className="flex items-center gap-1">
        <button
          className="h-6 px-2 text-[10px] border border-outline-variant rounded hover:bg-surface-container-low disabled:opacity-50"
          disabled={current === 1}
        >
          Prev
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            className={
              page === current
                ? "h-6 w-6 text-[10px] bg-primary-container text-white font-bold rounded"
                : "h-6 w-6 text-[10px] border border-outline-variant rounded hover:bg-surface-container-low"
            }
          >
            {page}
          </button>
        ))}
        <button className="h-6 px-2 text-[10px] border border-outline-variant rounded hover:bg-surface-container-low">
          Next
        </button>
      </div>
    </div>
  );
}
