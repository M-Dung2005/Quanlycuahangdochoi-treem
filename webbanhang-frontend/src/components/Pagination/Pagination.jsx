import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
        pages.push(
            <li key={i} className={`page-nav-item ${i === currentPage ? 'active' : ''}`}>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onPageChange(i);
                    }}
                >
                    {i}
                </a>
            </li>
        );
    }

    return (
        <div className="page-nav">
            <ul className="page-nav-list">
                <li
                    className={`page-nav-item ${currentPage === 1 ? 'disabled' : ''}`}
                >
                    <a
                        href="#"
                        aria-disabled={currentPage === 1}
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) onPageChange(currentPage - 1);
                        }}
                    >
                        <i className="fa-regular fa-arrow-left"></i>
                    </a>
                </li>
                {pages}
                <li
                    className={`page-nav-item ${currentPage === totalPages ? 'disabled' : ''}`}
                >
                    <a
                        href="#"
                        aria-disabled={currentPage === totalPages}
                        onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) onPageChange(currentPage + 1);
                        }}
                    >
                        <i className="fa-regular fa-arrow-right"></i>
                    </a>
                </li>
            </ul>
        </div>
    );
}

export default Pagination;
