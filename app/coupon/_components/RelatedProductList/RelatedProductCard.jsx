'use client'
import styles from './RelatedProductCard.module.scss'
import Link from 'next/link'

export default function RelatedProductCard({
  id = '',
  image = '/images/related-products1.png',
  name = '好食·金屬寵器台｜冷冽黑 & 云白 M',
  price = 'NT$3,500',
}) {
  const fullImageUrl = image?.startsWith('/uploads/')
    ? `http://localhost:3005${image}`
    : image || '/uploads/default.jpg'

  return (
    <Link href={`/product/${id}`} className={styles.relatedProductCardLink}>
      <div className={styles.relatedProductCard}>
        <div className={styles.relatedProductImg}>
          <img src={fullImageUrl} alt={name} />
        </div>
        <div className={styles.relatedProductInfo}>
          <div className={styles.relatedProductName}>{name}</div>
          <div className={styles.relatedProductPrice}>{price}</div>
        </div>
      </div>
    </Link>
  )
}
