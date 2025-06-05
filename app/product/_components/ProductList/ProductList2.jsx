'use client'
import { useEffect, useState } from 'react'
import section2Styles from './ProductList2.module.scss'
import ProductCard from '../card/ProductCard'
import Pagination from '../pagination/Pagination'

export default function ProductList2({
  categoryId,
  subcategoryId,
  priceGte,
  priceLte,
  sortBy,
  onCountChange,
}) {
  const [products, setProducts] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const perPage = 12

  useEffect(() => {
    const params = new URLSearchParams()
    params.set('page', currentPage)
    params.set('perpage', perPage)
    if (categoryId) params.set('category_ids', categoryId)
    if (subcategoryId) params.set('subcategory_ids', subcategoryId)
    if (priceGte) params.set('price_gte', priceGte)
    if (priceLte) params.set('price_lte', priceLte)
    if (sortBy?.sort) params.set('sort', sortBy.sort)
    if (sortBy?.order) params.set('order', sortBy.order)

    const fetchUrl = `http://localhost:3005/api/product/products?${params.toString()}`

    fetch(fetchUrl, {
      credentials: 'include', // ✅ 加這行，才能帶 cookie
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data.products || [])
        setTotalPages(data.data.pageCount || 1)
        onCountChange?.(data.data.products.length)
      })
      .catch((err) => {
        console.error('❌ API 錯誤:', err)
        setProducts([])
      })
  }, [categoryId, subcategoryId, priceGte, priceLte, currentPage, sortBy])

  if (!products.length) return <div>尚無商品</div>

  return (
    <>
      <div className={section2Styles.cardGroup}>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            id={product.id}
            image={product.product_images?.[0]?.image || '/fallback.jpg'}
            name={product.name}
            price={`NT$${product.price}`}
            avgRating={
              product.rating?.count > 0
                ? `${product.rating.avg} (${product.rating.count})`
                : '0'
            }
            isFavorite={product.isFavorite}
          />
        ))}
      </div>
    </>
  )
}
