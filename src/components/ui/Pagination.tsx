interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 1}
        className="px-2.5 py-1 text-[10px] text-gray-500 hover:bg-gray-200 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        ← Prev
      </button>

      <span className="px-2.5 py-1 text-[10px] stepper-connector-filled text-white rounded font-semibold min-w-6.5 text-center">
        {currentPage}
      </span>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages}
        className="px-2.5 py-1 text-[10px] text-gray-500 hover:bg-gray-200 rounded transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:cursor-not-allowed"
      >
        Next →
      </button>
    </div>
  );
}
