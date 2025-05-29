'use client'

import styles from './pagination.module.scss'

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  return (
    <nav className={styles.pagination}>
      <ul>
        {/* 左箭頭 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.pageArrow}
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
          onClick={() => goToPage(currentPage - 1)}
          style={{
            opacity: currentPage === 1 ? 0.5 : 1,
            pointerEvents: currentPage === 1 ? 'none' : 'auto',
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M10.6445 2.04323C10.6881 2.08677 10.7228 2.1385 10.7464 2.19545C10.77 2.2524 10.7822 2.31345 10.7822 2.37511C10.7822 2.43676 10.77 2.49781 10.7464 2.55476C10.7228 2.61171 10.6881 2.66344 10.6445 2.70698L5.35042 8.0001L10.6445 13.2932C10.7325 13.3812 10.7819 13.5006 10.7819 13.6251C10.7819 13.7496 10.7325 13.869 10.6445 13.957C10.5565 14.045 10.4371 14.0944 10.3126 14.0944C10.1881 14.0944 10.0687 14.045 9.98073 13.957L4.35573 8.33198C4.31208 8.28844 4.27744 8.23671 4.25381 8.17976C4.23018 8.12281 4.21802 8.06176 4.21802 8.0001C4.21802 7.93845 4.23018 7.8774 4.25381 7.82045C4.27744 7.7635 4.31208 7.71177 4.35573 7.66823L9.98073 2.04323C10.0243 1.99958 10.076 1.96494 10.1329 1.94131C10.1899 1.91768 10.2509 1.90552 10.3126 1.90552C10.3743 1.90552 10.4353 1.91768 10.4923 1.94131C10.5492 1.96494 10.6009 1.99958 10.6445 2.04323Z"
            fill="#929292"
          />
        </svg>

        {/* 頁碼列表 */}
        {pages.map((page) => (
          <li
            key={page}
            className={`${styles.page} ${page === currentPage ? styles.current : ''}`}
            onClick={() => goToPage(page)}
          >
            {page}
          </li>
        ))}

        {/* 右箭頭 */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={styles.pageArrow}
          width="15"
          height="16"
          viewBox="0 0 15 16"
          fill="none"
          onClick={() => goToPage(currentPage + 1)}
          style={{
            opacity: currentPage === totalPages ? 0.5 : 1,
            pointerEvents: currentPage === totalPages ? 'none' : 'auto',
          }}
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.35552 13.9568C4.31187 13.9132 4.27723 13.8615 4.2536 13.8046C4.22997 13.7476 4.21781 13.6866 4.21781 13.6249C4.21781 13.5632 4.22997 13.5022 4.2536 13.4452C4.27723 13.3883 4.31187 13.3366 4.35552 13.293L9.64958 7.9999L4.35552 2.70677C4.2675 2.61875 4.21805 2.49937 4.21805 2.3749C4.21805 2.25042 4.2675 2.13104 4.35552 2.04302C4.44354 1.955 4.56292 1.90555 4.6874 1.90555C4.81187 1.90555 4.93125 1.955 5.01927 2.04302L10.6443 7.66802C10.6879 7.71156 10.7226 7.76329 10.7462 7.82024C10.7698 7.87719 10.782 7.93824 10.782 7.9999C10.782 8.06155 10.7698 8.1226 10.7462 8.17955C10.7226 8.2365 10.6879 8.28823 10.6443 8.33177L5.01927 13.9568C4.97573 14.0004 4.924 14.0351 4.86705 14.0587C4.8101 14.0823 4.74905 14.0945 4.68739 14.0945C4.62574 14.0945 4.56469 14.0823 4.50774 14.0587C4.45079 14.0351 4.39906 14.0004 4.35552 13.9568Z"
            fill="#929292"
          />
        </svg>
      </ul>
    </nav>
  )
}
