import { ChevronLeft, ChevronRight } from 'lucide-react';
import React from 'react'

const Pagination = ({ currentPage = 1, totalPages = 10 }) => {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages if total pages are less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page, current page and nearby pages, last page
      pages.push(1);
      
      // Show ellipsis if current page is far from first page
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Add pages around current page
      const startPage = Math.max(2, currentPage - 1);
      const endPage = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = startPage; i <= endPage; i++) {
        if (!pages.includes(i)) {
          pages.push(i);
        }
      }
      
      // Show ellipsis if current page is far from last page
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Add last page if not already included
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex justify-center mt-10 mb-10">
      <div className="flex items-center gap-2">
        <button 
          className="w-10 h-10 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          disabled={currentPage === 1}
        >
          <ChevronLeft size={16} />
        </button>
        
        {renderPageNumbers().map((page, index) => (
          page === '...' ? (
            <span key={`ellipsis-${index}`} className="w-10 h-10 flex items-center justify-center">
              ...
            </span>
          ) : (
            <button
              key={`page-${page}`}
              className={`w-10 h-10 border rounded-md flex items-center justify-center transition-colors ${
                page === currentPage ? 'bg-black text-white' : 'hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        ))}
        
        <button 
          className="w-10 h-10 border rounded-md flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
          disabled={currentPage === totalPages}
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination