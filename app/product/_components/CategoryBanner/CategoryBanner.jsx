'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useParams, usePathname } from 'next/navigation'
import styles from './CategoryBanner.module.scss'

export default function CategoryBanner() {
  const params = useParams()
  const pathname = usePathname()
  const mainCategory = params?.main || ''
  const [src, setSrc] = useState(null)

  useEffect(() => {
    if (pathname.startsWith('/product/category/') && mainCategory) {
      setSrc(`/product-img/${mainCategory}Banner.png`)
    } else {
      setSrc('/product-img/productBanner.png')
    }
  }, [mainCategory, pathname])

  if (!src) return null // 圖片還沒確認好時不顯示

  return (
    <div className={styles.productBanner}>
      <Image
        src={src}
        alt={`${mainCategory || 'product'} banner`}
        width={1440}
        height={400}
        style={{ objectFit: 'cover', width: '100%', height: 'auto' }}
        sizes="(max-width: 440px) 100vw, 100vw"
        priority
      />
    </div>
  )
}
