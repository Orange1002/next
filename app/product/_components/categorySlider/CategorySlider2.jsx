'use client'

import Image from 'next/image'
import Link from 'next/link'
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi'
import styles from './CategorySlider2.module.scss'
import { useRef } from 'react'
import { categorySlugMap } from '../../category/_categoryMap'
import { usePathname } from 'next/navigation'

export default function CategorySlider2() {
  const scrollRef = useRef(null)
  const pathname = usePathname()

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: 'smooth' })
  }

  return (
    <div className={styles.categoryWrapper}>
      <button
        className={`${styles.categoryArrow} ${styles.leftArrow}`}
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        <BiChevronLeft />
      </button>

      <div className={styles.categoryScroll} ref={scrollRef}>
        {Object.entries(categorySlugMap).map(([slug, { name }]) => {
          const isActive = pathname.includes(`/category/${slug}`)
          return (
            <Link
              key={slug}
              href={`/product/category/${slug}`}
              className={styles.categoryItemLink}
            >
              <div
                className={`${styles.categoryItem} ${isActive ? styles.active : ''}`}
              >
                <Image
                  src={`/product-img/icon-${slug}.png`}
                  alt={name}
                  width={48}
                  height={48}
                />
                <div className="text-uppercase small mt-2">{name}</div>
              </div>
            </Link>
          )
        })}
      </div>

      <button
        className={`${styles.categoryArrow} ${styles.rightArrow}`}
        onClick={scrollRight}
        aria-label="Scroll right"
      >
        <BiChevronRight />
      </button>
    </div>
  )
}
