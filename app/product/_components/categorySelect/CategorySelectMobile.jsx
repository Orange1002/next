'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { categorySlugMap, subcategorySlugMap } from '../../category/_categoryMap'
import styles from './CategorySelectMobile.module.scss'

export default function CategorySelectMobile() {
  const router = useRouter()

  const handleChange = (e) => {
    const [type, slug] = e.target.value.split(':')
    if (!slug) return

    if (type === 'main') {
      router.push(`/product/category/${slug}`)
    } else if (type === 'sub') {
      const sub = subcategorySlugMap[slug]
      const mainSlug = Object.entries(categorySlugMap).find(
        ([, val]) => val.id === sub.categoryId
      )?.[0]
      if (mainSlug) {
        router.push(`/product/category/${mainSlug}/${slug}`)
      }
    }
  }

  return (
    <select
      className={styles.mobileCategorySelect}
      defaultValue=""
      onChange={handleChange}
    >
      <option value="" disabled>請選擇分類</option>

      {Object.entries(categorySlugMap).map(([mainSlug, category]) => {
        return (
          <React.Fragment key={mainSlug}>
            <option value={`main:${mainSlug}`}>{category.name}</option>
            {Object.entries(subcategorySlugMap)
              .filter(([, sub]) => sub.categoryId === category.id)
              .map(([subSlug, sub]) => (
                <option key={subSlug} value={`sub:${subSlug}`}>
                  └ {sub.name}
                </option>
              ))}
          </React.Fragment>
        )
      })}
    </select>
  )
}
