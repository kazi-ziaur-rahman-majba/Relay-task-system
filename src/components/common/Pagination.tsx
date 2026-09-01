import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  startIndex: number;
  endIndex: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  startIndex,
  endIndex,
  onPageChange,
  className = '',
}) => {
  if (totalItems === 0) return null;

  // Generate visible page numbers (maximum 5 page numbers visible)
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      let start = Math.max(1, currentPage - 2);
      let end = Math.min(totalPages, start + maxVisible - 1);

      if (end === totalPages) {
        start = Math.max(1, end - maxVisible + 1);
      }

      if (start > 1) {
        pages.push(1);
        if (start > 2) pages.push('...');
      }

      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) pages.push(i);
      }

      if (end < totalPages) {
        if (end < totalPages - 1) pages.push('...');
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-3 sm:px-4 sm:py-3 rounded-2xl border border-slate-200 shadow-2xs text-xs font-semibold text-slate-600 ${className}`}>
      {/* Range Info Counter */}
      <div>
        Showing <span className="font-extrabold text-slate-900">{startIndex}</span> to{' '}
        <span className="font-extrabold text-slate-900">{endIndex}</span> of{' '}
        <span className="font-extrabold text-slate-900">{totalItems}</span> tasks
      </div>

      {/* Page Navigation Controls */}
      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Number Pills */}
        <div className="flex items-center gap-1">
          {getPageNumbers().map((num, idx) => {
            if (typeof num === 'string') {
              return (
                <span key={`ellipsis-${idx}`} className="px-2 text-slate-400 font-bold select-none">
                  ...
                </span>
              );
            }

            const isActive = num === currentPage;

            return (
              <button
                key={num}
                onClick={() => onPageChange(num)}
                className={`min-w-[32px] h-8 px-2 rounded-lg font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#FE9F43] text-white shadow-2xs'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {num}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
