import { useState } from 'react'
import styles from './ProductSidebar.module.scss'
import SidebarFilter from './sidebarFilter/SidebarFilter'

export default function ProductSidebar() {
  const [isFoodOpen, setIsFoodOpen] = useState(true)
  const [isCourseOpen, setIsCourseOpen] = useState(false)
  const [isHotelOpen, setIsHotelOpen] = useState(false)

  return (
    <aside className={styles.productSidebar}>
      {/* Title */}
      <div className={styles.sidebarTextContainer}>
        <div className={styles.sidebarTextProduct}>Product</div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
        >
          <circle cx="7.5" cy="7.5" r="7.5" fill="#505050" />
        </svg>
      </div>

      <SidebarFilter />
    </aside>
  )
}
