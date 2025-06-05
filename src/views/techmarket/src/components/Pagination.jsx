import { useState } from "react";

// Pagination.js
export const Pagination = ({ pagination, onPageChange }) => {
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pagination.totalPages) {
            onPageChange(newPage);
        }
    };

    return (
        <div className="pagination">
            <button 
                onClick={() => handlePageChange(1)}
                disabled={pagination.currentPage === 1}
            >
                &laquo;
            </button>
            <button 
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
            >
                &lsaquo;
            </button>
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                    pageNum = i + 1;
                } else if (pagination.currentPage <= 3) {
                    pageNum = i + 1;
                } else if (pagination.currentPage >= pagination.totalPages - 2) {
                    pageNum = pagination.totalPages - 4 + i;
                } else {
                    pageNum = pagination.currentPage - 2 + i;
                }

                return (
                    <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={pagination.currentPage === pageNum ? 'active' : ''}
                    >
                        {pageNum}
                    </button>
                );
            })}
            <button 
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
            >
                &rsaquo;
            </button>
            <button 
                onClick={() => handlePageChange(pagination.totalPages)}
                disabled={pagination.currentPage === pagination.totalPages}
            >
                &raquo;
            </button>
        </div>
    );
};