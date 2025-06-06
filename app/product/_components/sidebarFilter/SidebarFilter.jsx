'use client'
import { useState } from 'react'
import Link from 'next/link'
import section2Styles from './sidebarFilter.module.scss'
import {
  categorySlugMap,
  subcategorySlugMap,
} from '../../category/_categoryMap'

export default function SidebarFilter({ onPriceChange }) {
  const [openMain, setOpenMain] = useState('food')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()

    const gte = parseInt(minPrice, 10)
    const lte = parseInt(maxPrice, 10)

    if (isNaN(gte) && isNaN(lte)) {
      return // ✅ 沒有任何價格輸入，不做事
    }

    if (onPriceChange) {
      onPriceChange({
        priceGte: isNaN(gte) ? undefined : gte,
        priceLte: isNaN(lte) ? undefined : lte,
      })
    }

    window.scrollTo({ top: 650, behavior: 'smooth' })
  }

  return (
    <>
      <nav className={section2Styles.productFilterNav}>
        <ul>
          {Object.entries(categorySlugMap).map(([mainSlug, category]) => {
            const isOpen = openMain === mainSlug
            const toggleOpen = () => setOpenMain(isOpen ? '' : mainSlug)

            return (
              <div key={mainSlug}>
                <li
                  className={`${section2Styles.hasSub} ${section2Styles.noGap}`}
                  onClick={toggleOpen}
                >
                  <div className={section2Styles.categoryToggle}>
                    <div className={section2Styles.mainCategoryName}>
                      {category.name}
                    </div>
                    {isOpen ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="1"
                        viewBox="0 0 11 1"
                        fill="none"
                      >
                        <rect width="11" height="1" fill="#505050" />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="11"
                        height="11"
                        viewBox="0 0 11 11"
                        fill="none"
                      >
                        <rect y="5" width="11" height="1" fill="#505050" />
                        <rect x="5" width="1" height="11" fill="#505050" />
                      </svg>
                    )}
                  </div>
                </li>

                {isOpen && (
                  <ul className={section2Styles.subCategoryFood}>
                    {Object.entries(subcategorySlugMap)
                      .filter(([, sub]) => sub.categoryId === category.id)
                      .map(([subSlug, sub]) => (
                        <li key={subSlug}>
                          <Link
                            href={`/product/category/${mainSlug}/${subSlug}`}
                          >
                            <div>{sub.name}</div>
                          </Link>
                        </li>
                      ))}
                    <li>
                      <Link href={`/product/category/${mainSlug}`}>
                        <div style={{ fontWeight: 'bold' }}>
                          「{category.name}」全部商品
                        </div>
                      </Link>
                    </li>
                  </ul>
                )}
              </div>
            )
          })}
        </ul>
      </nav>

      {/* 價格區間 */}
      <form className={section2Styles.priceFilter} onSubmit={handleSubmit}>
        <div className={section2Styles.priceFilterContainer}>
          <div className={section2Styles.priceTitle}>價格區間</div>

          <div className={section2Styles.priceRange}>
            <input
              type="number"
              placeholder="最低"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="24"
              viewBox="0 0 23 24"
              fill="none"
            >
              <path
                d="M6 11.6666C6 11.476 6.07243 11.2932 6.20136 11.1584C6.3303 11.0236 6.50516 10.9479 6.6875 10.9479H16.3125C16.4948 10.9479 16.6697 11.0236 16.7986 11.1584C16.9276 11.2932 17 11.476 17 11.6666C17 11.8573 16.9276 12.0401 16.7986 12.1749C16.6697 12.3097 16.4948 12.3854 16.3125 12.3854H6.6875C6.50516 12.3854 6.3303 12.3097 6.20136 12.1749C6.07243 12.0401 6 11.8573 6 11.6666Z"
                fill="black"
              />
            </svg>
            <input
              type="number"
              placeholder="最高"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
          </div>

          <div className={section2Styles.priceNote}>
            (原始區間：
            <span className={section2Styles.priceRangeNote}>
              NT$0–NT$99,999
            </span>
            )
          </div>
          <div className={section2Styles.priceSubmitContainer}>
            <button type="submit" className={section2Styles.priceSubmitBtn}>
              篩選
            </button>
            <button
              type="button"
              className={section2Styles.priceSubmitBtn}
              style={{ backgroundColor: '#929292' }}
              onClick={() => {
                if (minPrice === '' && maxPrice === '') return 

                setMinPrice('')
                setMaxPrice('')
                onPriceChange?.({ priceGte: undefined, priceLte: undefined })
                window.scrollTo({ top: 650, behavior: 'smooth' })
              }}
            >
              重置
            </button>
          </div>
        </div>
      </form>
    </>
  )
}
