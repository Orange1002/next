import { useState } from 'react'
import styles from './ProductSidebar.module.scss'

export default function ProductSidebar() {
  const [isFoodOpen, setIsFoodOpen] = useState(true)
  const [isCourseOpen, setIsCourseOpen] = useState(false)
  const [isHotelOpen, setIsHotelOpen] = useState(false)

  return (
    <aside className={styles.productSidebar}>
      {/* Title */}
      <div className={styles.sidebarTextContainer}>
        <div className={styles.sidebarTextProduct}>Product</div>
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 15" fill="none">
          <circle cx="7.5" cy="7.5" r="7.5" fill="#505050" />
        </svg>
      </div>

      {/* 分類選單 */}
      <nav className={styles.productFilterNav}>
        <ul>
          {/* Food */}
          <li className={`${styles.hasSub} ${isFoodOpen ? styles.active : ''}`}>
            <button
              className={styles.categoryToggle}
              type="button"
              onClick={() => setIsFoodOpen((prev) => !prev)}
            >
              Food
              {isFoodOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="1" viewBox="0 0 11 1" fill="none">
                  <rect width="11" height="1" fill="#505050" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <rect y="5" width="11" height="1" fill="#505050" />
                  <rect x="5" width="1" height="11" fill="#505050" />
                </svg>
              )}
            </button>
          </li>
          {isFoodOpen && (
            <ul className={styles.subCategoryFood}>
              <li className="active">
                <a href="#"><div>Dry Dog Food</div></a>
              </li>
              <li><a href="#"><div>Can</div></a></li>
              <li><a href="#"><div>Snack</div></a></li>
            </ul>
          )}

          {/* 其他分類 */}
          <li className={styles.otherProduct}><a href="#"><div>Bed</div></a></li>
          <li className={styles.otherProduct}><a href="#"><div>Bath</div></a></li>
          <li className={styles.otherProduct}><a href="#"><div>Toy</div></a></li>
          <li className={styles.otherProduct}><a href="#"><div>Cloth</div></a></li>
          <li className={styles.otherProduct}><a href="#"><div>Collar</div></a></li>

          {/* Course */}
          <li className={`${styles.hasSub} ${styles.noGap}`}>
            <button
              className={styles.categoryToggle}
              type="button"
              onClick={() => setIsCourseOpen((prev) => !prev)}
            >
              Course
              {isCourseOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="1" viewBox="0 0 11 1" fill="none">
                  <rect width="11" height="1" fill="#505050" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <rect y="5" width="11" height="1" fill="#505050" />
                  <rect x="5" width="1" height="11" fill="#505050" />
                </svg>
              )}
            </button>
          </li>
          {isCourseOpen && (
            <ul className={styles.subCategoryFood}>
              <li><a href="#"><div>Dog Training</div></a></li>
              <li><a href="#"><div>Nutrition</div></a></li>
            </ul>
          )}

          {/* Pet Hotel */}
          <li className={`${styles.hasSub} ${styles.noGap}`}>
            <button
              className={styles.categoryToggle}
              type="button"
              onClick={() => setIsHotelOpen((prev) => !prev)}
            >
              Pet Hotel
              {isHotelOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="1" viewBox="0 0 11 1" fill="none">
                  <rect width="11" height="1" fill="#505050" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 11 11" fill="none">
                  <rect y="5" width="11" height="1" fill="#505050" />
                  <rect x="5" width="1" height="11" fill="#505050" />
                </svg>
              )}
            </button>
          </li>
          {isHotelOpen && (
            <ul className={styles.subCategoryFood}>
              <li><a href="#"><div>Overnight</div></a></li>
              <li><a href="#"><div>Daycare</div></a></li>
            </ul>
          )}
        </ul>
      </nav>

      {/* 價格區間 */}
      <form className={styles.priceFilter}>
        <div className={styles.priceFilterContainer}>
          <div className={styles.priceTitle}>價格區間</div>
          <div className={styles.priceRange}>
            <input type="number" placeholder="最低" />
            <svg xmlns="http://www.w3.org/2000/svg" width="23" height="24" viewBox="0 0 23 24" fill="none">
              <path
                d="M6 11.6666C6 11.476 6.07243 11.2932 6.20136 11.1584C6.3303 11.0236 6.50516 10.9479 6.6875 10.9479H16.3125C16.4948 10.9479 16.6697 11.0236 16.7986 11.1584C16.9276 11.2932 17 11.476 17 11.6666C17 11.8573 16.9276 12.0401 16.7986 12.1749C16.6697 12.3097 16.4948 12.3854 16.3125 12.3854H6.6875C6.50516 12.3854 6.3303 12.3097 6.20136 12.1749C6.07243 12.0401 6 11.8573 6 11.6666Z"
                fill="black"
              />
            </svg>
            <input type="number" placeholder="最高" />
          </div>

          <div className={styles.priceNote}>
            (原始區間：<span className={styles.priceRangeNote}>NT$0–NT$99,999</span>)
          </div>

          <div className={styles.priceSubmitContainer}>
            <button type="submit" className={styles.priceSubmitBtn}>篩選</button>
          </div>
        </div>
      </form>
    </aside>
  )
}
