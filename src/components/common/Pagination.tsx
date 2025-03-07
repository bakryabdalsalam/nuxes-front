import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
  className = '',
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    
    // Case 1: If total pages are less than the page numbers we want to show
    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Calculate left and right sibling indices
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    // Whether to show dots
    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;
    
    // Case 2: Show left dots but not right dots
    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, '...', ...rightRange];
    }
    
    // Case 3: Show right dots but not left dots
    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + 2 * siblingCount;
      const leftRange = Array.from(
        { length: leftItemCount },
        (_, i) => i + 1
      );
      return [...leftRange, '...', totalPages];
    }
    
    // Case 4: Show both left and right dots
    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i
    );
    return [1, '...', ...middleRange, '...', totalPages];
  };

  // Don't show pagination if there's only 1 page
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = getPageNumbers();

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 ${className}`}>
      <div className="hidden sm:flex text-sm text-gray-700">
        Showing <span className="font-medium mx-1">page {currentPage}</span> of <span className="font-medium mx-1">{totalPages}</span>
      </div>
      
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Previous page"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>
        
        <div className="hidden sm:flex">
          {pageNumbers.map((pageNumber, index) => (
            pageNumber === '...' ? (
              <span
                key={`ellipsis-${index}`}
                className="px-3 py-2 text-gray-500"
              >
                ...
              </span>
            ) : (
              <button
                key={`page-${pageNumber}`}
                onClick={() => onPageChange(pageNumber as number)}
                disabled={currentPage === pageNumber}
                className={`px-3.5 py-2 rounded-md text-sm font-medium ${
                  currentPage === pageNumber
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-700 hover:bg-gray-50'
                } transition-colors duration-200`}
                aria-label={`Page ${pageNumber}`}
                aria-current={currentPage === pageNumber ? 'page' : undefined}
              >
                {pageNumber}
              </button>
            )
          ))}
        </div>
        
        {/* Mobile view - just show current/total */}
        <div className="sm:hidden flex items-center">
          <span className="text-sm text-gray-700">
            {currentPage} / {totalPages}
          </span>
        </div>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-2 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Next page"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};
