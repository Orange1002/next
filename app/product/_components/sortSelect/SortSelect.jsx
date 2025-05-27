'use client'

import styles from './SortSelect.module.scss'

export default function SortSelect({ onChange, defaultValue = 'latest' }) {
  const handleChange = (e) => {
    const value = e.target.value

    switch (value) {
      case 'latest':
        onChange?.({ sort: 'created_at', order: 'desc' })
        break
      case 'popular':
        onChange?.({ sort: 'review_count', order: 'desc' })
        break
      case 'price_low':
        onChange?.({ sort: 'price', order: 'asc' })
        break
      case 'price_high':
        onChange?.({ sort: 'price', order: 'desc' })
        break
      case 'rating_high':
        onChange?.({ sort: 'avg_rating', order: 'desc' })
        break
      case 'favorite_high':
        onChange?.({ sort: 'favorite_count', order: 'desc' })
        break
      case 'updated_desc':
        onChange?.({ sort: 'updated_at', order: 'desc' })
        break
      default:
        break
    }
  }

  return (
    <select className={styles.customSelect} defaultValue={defaultValue} onChange={handleChange}>
      <option value="latest">最新上架</option>
      <option value="popular">人氣排序</option>
      <option value="rating_high">評價高到低</option>
      <option value="favorite_high">收藏數高到低</option>
      <option value="price_low">價格低到高</option>
      <option value="price_high">價格高到低</option>
      <option value="updated_desc">最近更新</option>
    </select>
  )
}
