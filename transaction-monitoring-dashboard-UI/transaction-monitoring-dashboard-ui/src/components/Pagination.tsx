// src/components/Pagination.tsx
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  const handlePageChange = (newPage: number): void => {
    if (newPage >= 0 && newPage < totalPages) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {currentPage * itemsPerPage + 1} to {Math.min((currentPage + 1) * itemsPerPage, totalItems)} of {totalItems} entries
      </div>
      <div className="pagination-controls">
        <button 
          onClick={() => handlePageChange(0)} 
          disabled={currentPage === 0}
          className="pagination-button"
        >
          First
        </button>
        <button 
          onClick={() => handlePageChange(currentPage - 1)} 
          disabled={currentPage === 0}
          className="pagination-button"
        >
          Previous
        </button>
        <span className="pagination-current">Page {currentPage + 1} of {totalPages}</span>
        <button 
          onClick={() => handlePageChange(currentPage + 1)} 
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Next
        </button>
        <button 
          onClick={() => handlePageChange(totalPages - 1)} 
          disabled={currentPage === totalPages - 1}
          className="pagination-button"
        >
          Last
        </button>
      </div>
      <div className="items-per-page">
        <label>Items per page:</label>
        <select 
          value={itemsPerPage} 
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;