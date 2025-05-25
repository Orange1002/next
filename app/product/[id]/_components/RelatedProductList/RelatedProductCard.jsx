'use client'

import { useRouter } from 'next/navigation'
import styles from './RelatedProductCard.module.scss'

export default function RelatedProductCard({
  id,
  image = '/images/related-products1.png',
  name = '好食·金屬寵器台｜冷冽黑 & 云白 M',
  price = 'NT$3,500',
}) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/product/${id}`)
  }

  return (
    <div className={styles.relatedProductCard} onClick={handleClick} style={{ cursor: 'pointer' }}>
      <div className={styles.relatedProductImg}>
        <img src={image} alt={name} />
      </div>
      <div className={styles.relatedProductInfo}>
        <div className={styles.relatedProductName}>{name}</div>
        <div className={styles.relatedProductPrice}>{price}</div>
      </div>
    </div>
  )
}
