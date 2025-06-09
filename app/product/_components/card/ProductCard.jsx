'use client'

import './ProductCard.scss'
import HeartIcon from './HeartIcon'
import CartIcon from './CartIcon'
import { FaStar } from 'react-icons/fa'
import { useRouter } from 'next/navigation' // 如果是 pages router 改用 next/router
import { useCart } from '@/hooks/use-cart'

export default function ProductCard({
  id,
  image,
  name,
  price,
  avgRating,
  isFavorite = false,
}) {
  const router = useRouter()
  const { items } = useCart()

  const isInCart = items.some(
    (item) => item.type === 'product' && item.product_id === id
  )

  const handleClick = () => {
    router.push(`/product/${id}`)
  }

  const fullImageUrl = image?.startsWith('/uploads/')
    ? `http://localhost:3005${image}`
    : image || '/uploads/default.jpg'

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
      <img className="product-card-img" src={fullImageUrl} alt={name} />
      <div className="product-card-content">
        <div className="product-card-name">{name}</div>
        <div className="product-card-price">{price}</div>
        <div className="product-card-icon">
          <div className="product-card-star">
            <FaStar style={{ color: 'orange' }} className="CardIcon" />
            <p>{avgRating || '0'}</p>
          </div>
          <HeartIcon
            productId={id}
            isActive={isFavorite}
            className="CardHeartIcon"
          />
          <CartIcon className="CardIcon" isActive={isInCart} />
        </div>
      </div>
    </div>
  )
}
