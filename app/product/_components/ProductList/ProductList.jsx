'use client'
import { useEffect, useState } from 'react'
import section2Styles from './ProductList.module.scss'
import ProductCard from '../card/ProductCard'
import Pagination from '../pagination/Pagination'

export default function ProductList({ categoryId, subcategoryId }) {
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

    const fetchUrl = `http://localhost:3005/api/product/products?${params.toString()}`

    fetch(fetchUrl)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.data.products || [])
        setTotalPages(data.data.pageCount || 1)
      })
      .catch((err) => {
        console.error('❌ API 錯誤:', err)
        setProducts([])
      })
  }, [categoryId, subcategoryId, currentPage])

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
                ? `${product.rating.avg} (${product.rating.count}則)`
                : '尚無評價'
            }
          />
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </>
  )
}
