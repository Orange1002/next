'use client'

import './ProductCard.scss'
import HeartIcon from './HeartIcon'
import CartIcon from './CartIcon'
import { FaStar } from 'react-icons/fa'
import { useRouter } from 'next/navigation' // 如果是 pages router 改用 next/router

export default function ProductCard({
  id,
  image,
  name,
  price,
  avgRating,
  isFavorite = false,
}) {
  const router = useRouter()

  const handleClick = () => {
    router.push(`/product/${id}`)
  }

  return (
    <div
      className="product-card"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyPress={(e) => {
        if (e.key === 'Enter') handleClick()
      }}
    >
      <img className="product-card-img" src={image} alt={name} />
      <div className="product-card-content">
        <div className="product-card-name">{name}</div>
        <div className="product-card-price">{price}</div>
        <div className="product-card-icon">
          <div className="product-card-star">
            <FaStar style={{ color: 'orange' }} />
            <p>{avgRating || '0'}</p>
          </div>
          <HeartIcon productId={id} isActive={isFavorite} />
          <CartIcon />
        </div>
      </div>
    </div>
  )
}
