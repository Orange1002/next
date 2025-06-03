'use client'
import ProductCard from '../../../../product/_components/card/ProductCard'

export default function ProductsPage({ data = [] }) {
  return (
    <>
      {data.map((product, index) => (
        <ProductCard
          key={product.product_id ?? `product-${index}`}
          id={product.product_id}
          image={product.primary_image || '/fallback.jpg'}
          name={product.product_name}
          price={`NT$${product.product_price}`}
          avgRating={'0'}
          isFavorite={true}
          onToggleFavorite={() => {}}
          className="col-3"
        />
      ))}
    </>
  )
}
