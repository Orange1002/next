'use client'
import styles from './pagination.module.scss'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

export default function Pagination({
  currentPage,
  setCurrentPage,
  totalPages,
}) {
  // 顯示最多 3 頁碼，根據 currentPage 動態計算範圍
  const pageWindow = 3
  const start = Math.max(1, currentPage - 1)
  const end = Math.min(totalPages, start + pageWindow - 1)
  const pages = Array.from({ length: end - start + 1 }, (_, i) => start + i)

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 650, behavior: 'smooth' })
    }
  }

  return (
    <>
      <div className={styles.paginationContainer}>
        <nav className={styles.pagination}>
          <ul className={styles.pagination}>
            {/* 第一頁 */}
            <li
              className={styles.pageText}
              onClick={() => goToPage(1)}
              style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              第一頁
            </li>

            {/* 上一頁 */}
            <li
              className={styles.pageArrow}
              onClick={() => goToPage(currentPage - 1)}
              style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              <IoIosArrowBack />
            </li>

            {/* 頁碼 */}
            {pages.map((page) => (
              <li
                key={page}
                className={`${styles.page} ${page === currentPage ? styles.current : ''}`}
                onClick={() => goToPage(page)}
              >
                {page}
              </li>
            ))}

            {/* 下一頁 */}
            <li
              className={styles.pageArrow}
              onClick={() => goToPage(currentPage + 1)}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              <IoIosArrowForward />
            </li>

            {/* 最後一頁 */}
            <li
              className={styles.pageText}
              onClick={() => goToPage(totalPages)}
              style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              最後一頁
            </li>
          </ul>
        </nav>
        <span className={styles.totalText}>共 {totalPages} 頁</span>
      </div>
    </>
  )
}
