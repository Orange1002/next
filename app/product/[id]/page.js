'use client'

import Breadcrumb from './_components/Breadcrumb/Breadcrumb'
import OrderNotice from './_components/OrderNotice/OrderNotice'
import ProductDescription from './_components/ProductDescription/ProductDescription'
import ProductDetailPanel from './_components/ProductDetailPanel/ProductDetailPanel'
import ProductImages from './_components/ProductImages/ProductImages'
import ProductSidebar from './_components/ProductSidebar/ProductSidebar'
import ProductSpecs from './_components/ProductSpecs/ProductSpecs'
import RelatedProductList from './_components/RelatedProductList/RelatedProductList'
import UserVoiceList from './_components/UserVoiceList/UserVoiceList'
import styles from './_styles/Page.module.scss'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

export default function ProductDetailPage() {
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `http://localhost:3005/api/product/products/${id}`,
          {
            credentials: 'include',
          }
        )
        const data = await res.json()
        setProduct(data.data.product)
      } catch (err) {
        console.error('❌ 抓商品失敗', err)
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchProduct()
  }, [id])

  useEffect(() => {
    if (!product) return

    const fetchRelated = async () => {
      try {
        const params = new URLSearchParams({
          category_ids: product.category_id,
          subcategory_ids: product.subcategory_id,
          perpage: 5,
          page: 1,
        })

        const res = await fetch(
          `http://localhost:3005/api/product/products?${params}`
        )
        const data = await res.json()
        setRelatedProducts(
          data.data.products.filter((p) => p.id !== product.id)
        )
      } catch (err) {
        console.error('❌ 抓推薦商品失敗', err)
      }
    }

    fetchRelated()
  }, [product])

  if (loading) return <div>載入中...</div>
  if (!product) return <div>找不到商品</div>

  function convertColorNameToHex(name) {
    const colorMap = {
      灰色: '#888888',
      米白色: '#f5f5dc',
      紅色: '#ff0000',
      黑色: '#000000',
      藍色: '#0000ff',
      綠色: '#008000',
      黃色: '#ffff00',
      橘色: '#ffa500',
    }
    return colorMap[name] || '#d9d9d9'
  }

  // 將 variantTypes 依據名稱分類
  const getOptionsByTypeName = (name) => {
    const type = product.variantTypes?.find((t) => t.name === name)
    return type?.options || []
  }

  const rawColorOptions = getOptionsByTypeName('顏色')
  const colorOptions = rawColorOptions.map((opt) => ({
    name: opt.name,
    color: convertColorNameToHex(opt.name),
  }))
  const sizeOptions = getOptionsByTypeName('尺寸')
    .map((opt) => opt.name)
    .filter((name) => name?.trim() !== '')

  const packOptions = getOptionsByTypeName('包裝')
    .map((opt) => opt.name)
    .filter((name) => name?.trim() !== '')

  const contentOptions = getOptionsByTypeName('內容物')
    .map((opt) => opt.name)
    .filter((name) => name?.trim() !== '')

  const allOptionMap = {}
  product.variantTypes?.forEach((type) => {
    type.options?.forEach((opt) => {
      allOptionMap[opt.name] = opt.id
    })
  })

  return (
    <div className={styles.mainWrapper}>
      <main className={styles.main}>
        <section className={styles.productDetailSection1}>
          <Breadcrumb
            categoryName={product.productCategory?.name}
            subcategoryName={product.subcategory?.name}
            categoryId={product.category_id}
            subcategoryId={product.subcategory_id}
          />
          <div className={styles.productContainer}>
            <ProductImages images={product.product_images} />
            <ProductDetailPanel
              productSN={product.sn || `PRD-${product.id}`}
              productName={product.name}
              productNote="超取滿NT$1,000免運"
              price={`NT$${product.price}`}
              colorOptions={colorOptions}
              sizeOptions={sizeOptions}
              packOptions={packOptions}
              contentOptions={contentOptions}
              variantCombinations={product.variantCombinations}
              optionMap={allOptionMap}
              basePrice={Number(product.price)}
              isFavorite={product.isFavorite}
              productId={product.id}
            />
          </div>
        </section>

        <section className={styles.productDetailSection2}>
          <div className={styles.section2Container}>
            <ProductSidebar />
            <div className={styles.descriptionContainer}>
              <div className={styles.productInfo}>
                <ProductSpecs
                  specs={product.product_specifications.map((s) => ({
                    title: s.title,
                    items: s.value.split('\n'),
                  }))}
                />
                <ProductDescription
                  title={product.name}
                  content={product.description?.split('\n') || []}
                />

                <OrderNotice content={product.notice?.split('\n') || []} />
              </div>
              <UserVoiceList
                data={
                  product.reviews?.map((r) => ({
                    date: new Date(r.created_at).toLocaleDateString('zh-TW'),
                    rate: r.rating,
                    title: `來自會員 #${r.memberId}`,
                    content: r.comment || '（無留言）',
                  })) || []
                }
              />
              <RelatedProductList title="推薦商品" products={relatedProducts} />
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
