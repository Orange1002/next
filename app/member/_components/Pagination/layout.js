'use client'
import React from 'react'
import styles from './layout.module.css'

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page)
    }
  }

  const getPageNumbers = () => {
    const pages = []

    if (totalPages <= 3) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      if (currentPage <= 2) {
        pages.push(1, 2, 3)
      } else if (currentPage >= totalPages - 1) {
        pages.push(totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(currentPage - 1, currentPage, currentPage + 1)
      }
    }

    return pages
  }

  return (
    <div className={styles.pagination}>
      <button
        onClick={() => handlePageClick(currentPage - 1)}
        disabled={currentPage === 1}
      >
        上一頁
      </button>
      <button
        onClick={() => handlePageClick(1)}
        className={currentPage === 1 ? styles.active : ''}
      >
        1
      </button>

      {getPageNumbers().map((page) =>
        page !== 1 && page !== totalPages ? (
          <button
            key={page}
            onClick={() => handlePageClick(page)}
            className={currentPage === page ? styles.active : ''}
          >
            {page}
          </button>
        ) : null
      )}

      {totalPages !== 1 && (
        <button
          onClick={() => handlePageClick(totalPages)}
          className={currentPage === totalPages ? styles.active : ''}
        >
          {totalPages}
        </button>
      )}
      <button
        onClick={() => handlePageClick(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        下一頁
      </button>
    </div>
  )
}
