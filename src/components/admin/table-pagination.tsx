"use client";

import React, { useState, useEffect } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

export interface TablePaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  onItemsPerPageChange?: (itemsPerPage: number) => void;
  itemsPerPageOptions?: number[];
  className?: string;
}

export function TablePagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [10, 25, 50],
  className = "",
}: TablePaginationProps) {
  const safeTotalPages = Math.max(totalPages || 1, 1);
  const safeCurrentPage = Math.min(Math.max(currentPage || 1, 1), safeTotalPages);
  
  const [pageInput, setPageInput] = useState<string>(String(safeCurrentPage));

  useEffect(() => {
    setPageInput(String(safeCurrentPage));
  }, [safeCurrentPage]);

  const count = totalItems !== undefined ? totalItems : safeTotalPages * itemsPerPage;
  const startItem = count === 0 ? 0 : (safeCurrentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(safeCurrentPage * itemsPerPage, count);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  const handleInputBlurOrSubmit = () => {
    const parsed = parseInt(pageInput, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= safeTotalPages) {
      onPageChange(parsed);
    } else {
      setPageInput(String(safeCurrentPage));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleInputBlurOrSubmit();
    }
  };

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 bg-white border-t border-gray-100 select-none ${className}`}>
      {/* Left side: Items per page & item count */}
      <div className="flex items-center gap-3 text-sm text-gray-600 font-normal">
        <span>Items per page</span>
        <div className="relative inline-flex items-center">
          <select
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange?.(Number(e.target.value))}
            className="appearance-none bg-white border border-gray-200 hover:border-gray-300 rounded-lg pl-3 pr-7 py-1 text-sm text-gray-700 font-medium focus:outline-none focus:border-gray-400 cursor-pointer shadow-2xs"
          >
            {itemsPerPageOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 absolute right-2 text-gray-400 pointer-events-none" />
        </div>
        <span className="text-gray-600">
          {startItem}-{endItem} of {count} items
        </span>
      </div>

      {/* Right side: Navigation buttons & Page Input */}
      <div className="flex items-center gap-3 text-sm font-medium text-gray-500">
        {/* First Page button « */}
        <button
          onClick={() => onPageChange(1)}
          disabled={safeCurrentPage <= 1}
          className="p-1 text-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:hover:text-gray-300 disabled:cursor-not-allowed transition-colors"
          title="First Page"
          type="button"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous button ‹ Previous */}
        <button
          onClick={() => onPageChange(Math.max(safeCurrentPage - 1, 1))}
          disabled={safeCurrentPage <= 1}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors font-normal text-sm"
          type="button"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Previous</span>
        </button>

        {/* Page input [ 1 ] */}
        <input
          type="text"
          value={pageInput}
          onChange={handleInputChange}
          onBlur={handleInputBlurOrSubmit}
          onKeyDown={handleKeyDown}
          className="w-11 py-1 text-center border border-gray-300 rounded-md text-sm font-medium text-gray-800 bg-white focus:outline-none focus:border-gray-400 shadow-2xs"
        />

        {/* of total */}
        <span className="text-gray-600 font-normal">of {safeTotalPages}</span>

        {/* Next button Next › */}
        <button
          onClick={() => onPageChange(Math.min(safeCurrentPage + 1, safeTotalPages))}
          disabled={safeCurrentPage >= safeTotalPages}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 disabled:opacity-40 disabled:hover:text-gray-400 disabled:cursor-not-allowed transition-colors font-normal text-sm"
          type="button"
        >
          <span>Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>

        {/* Last Page button » */}
        <button
          onClick={() => onPageChange(safeTotalPages)}
          disabled={safeCurrentPage >= safeTotalPages}
          className="p-1 text-gray-300 hover:text-gray-700 disabled:opacity-40 disabled:hover:text-gray-300 disabled:cursor-not-allowed transition-colors"
          title="Last Page"
          type="button"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
