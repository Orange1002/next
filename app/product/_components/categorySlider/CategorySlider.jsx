'use client'

import Image from 'next/image'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import styles from './CategorySlider.module.scss'
import { useRef } from 'react'

export default function CategorySlider() {
  const scrollRef = useRef(null)

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: 'smooth' })
    }
  }

  const categories = [
    { src: '/product-img/icon-food.png', label: 'FOOD' },
    { src: '/product-img/icon-can.png', label: 'CAN' },
    { src: '/product-img/icon-snack.png', label: 'SNACK' },
    { src: '/product-img/icon-bed.png', label: 'BED' },
    { src: '/product-img/icon-bath.png', label: 'BATH' },
    { src: '/product-img/icon-toy.png', label: 'TOY' },
    { src: '/product-img/icon-cloth.png', label: 'CLOTH' },
    { src: '/product-img/icon-collar.png', label: 'COLLAR' },
    { src: '/product-img/icon-toy.png', label: 'TOY' }, // 可改為 Accessory?
  ]

  return (
    <div className={`${styles.categoryWrapper}`}>
      {/* 左箭頭 */}
      <button className={`${styles.categoryArrow} ${styles.leftArrow}`} onClick={scrollLeft} aria-label="Scroll left">
        <BiChevronLeft />
      </button>

      {/* 可橫向滑動的分類 */}
      <div className={styles.categoryScroll} ref={scrollRef}>
        {categories.map((item, index) => (
          <div key={index} className={styles.categoryItem}>
            <Image src={item.src} alt={item.label} width={48} height={48} />
            <div className="text-uppercase small mt-2">{item.label}</div>
          </div>
        ))}
      </div>

      {/* 右箭頭 */}
      <button className={`${styles.categoryArrow} ${styles.rightArrow}`} onClick={scrollRight} aria-label="Scroll right">
        <BiChevronRight />
      </button>
    </div>
  )
}
