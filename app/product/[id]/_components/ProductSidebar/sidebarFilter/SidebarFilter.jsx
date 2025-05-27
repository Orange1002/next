'use client'
import { useState } from 'react'
import Link from 'next/link'
import section2Styles from './sidebarFilter.module.scss'
import {
  categorySlugMap,
  subcategorySlugMap,
} from '../../../../category/_categoryMap'

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
                          查看「{category.name}」全部商品
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
    </>
  )
}
