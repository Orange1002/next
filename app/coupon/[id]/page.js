'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Breadcrumb from '../_components/Breadcrumb/Breadcrumb'
import ProductDescription from '../_components/ProductDescription/ProductDescription'
import ProductSpecs from '../_components/ProductSpecs/ProductSpecs'
import RelatedProductList from '../_components/RelatedProductList/RelatedProductList'
import styles from '../_styles/Page.module.scss'
import CouponCard from '../_components/couponCard/CouponCard'
import { categorySlugMap } from '../../product/category/_categoryMap'

export default function ProductDetailPage() {
  const { id } = useParams()
  const [coupon, setCoupon] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [memberId, setMemberId] = useState(null)
  const router = useRouter()

  useEffect(() => {
    if (!id) return

    const fetchCoupon = async () => {
      try {
        const res = await fetch(
          `http://localhost:3005/api/coupon/coupons/${id}`,
          {
            credentials: 'include',
          }
        )
        const data = await res.json()

        // 正確解構資料
        const couponData = data.data?.coupon
        const productList = data.data?.products || []

        setCoupon(couponData || null)
        setRelatedProducts(productList || [])
      } catch (err) {
        console.error('❌ 無法取得優惠券資料', err)
      }
    }

    fetchCoupon()
  }, [id])

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await fetch('http://localhost:3005/api/me/me', {
          credentials: 'include',
        })
        const data = await res.json()
        setMemberId(data?.id || null)
      } catch (err) {
        console.error('❌ 無法取得會員資訊', err)
      }
    }

    fetchMember()
  }, [])

  const handleCheckMore = () => {
    if (coupon.usageTypeId === 2) {
      router.push('/sitter')
      return
    }

    const categoryId = coupon.categoryCouponMap?.[0]?.categoryId
    if (!categoryId) return

    const foundEntry = Object.entries(categorySlugMap).find(
      ([slug, data]) => data.id === categoryId
    )

    if (foundEntry) {
      const slug = foundEntry[0]
      router.push(`/product/category/${slug}`)
    }
  }

  const usageText =
    coupon && coupon.usageType ? coupon.usageType.name : '使用範圍未指定'

  if (!coupon) return <p>載入中...</p>

  return (
    <div className={styles.mainWrapper}>
      <main className={styles.main}>
        <section className={styles.productDetailSection1}>
          <Breadcrumb
            items={[
              { label: '首頁', href: '/' },
              { label: '會員中心', href: '/member' },
              { label: '我的優惠券', href: '/member/coupons' },
              { label: coupon.title },
            ]}
          />

          <div className={`${styles.couponList} container`}>
            <CouponCard
              couponId={coupon.id}
              title={coupon.title}
              date={`有效期間 ${coupon.startAt?.slice(0, 10)} - ${coupon.endAt?.slice(0, 10)}`}
              minSpend={coupon.minPurchase}
              image={coupon.image || '/coupon_img/DefaultCoupon.png'}
              categoryId={coupon.categoryCouponMap?.[0]?.categoryId}
              isClaimed={coupon.isClaimed}
              memberId={memberId}
              usageTypeId={coupon.usageTypeId}
            />
          </div>
          <section className={styles.productDetailSection11}></section>
        </section>

        <section className={styles.productDetailSection2}>
          <div className={styles.section2Container}>
            <div className={styles.descriptionContainer}>
              <div className={styles.productInfo}>
                <ProductSpecs
                  specs={[
                    {
                      title: '有效期限',
                      items: [
                        `${coupon.startAt?.slice(0, 10)} 00:00 到 ${coupon.endAt?.slice(0, 10)} 23:59`,
                      ],
                    },
                    {
                      title: '優惠內容',
                      items: [
                        coupon.discountType === 'percentage'
                          ? `享 ${coupon.discountValue * 10} 折`
                          : `折扣金額 $${coupon.discountValue}`,
                      ],
                    },
                    { title: '描述', items: [`${coupon.description}`] },
                    {
                      title: '適用範圍',
                      items: [
                        coupon.usageTypeId === 2
                          ? '此優惠券可套用於寵物保母服務'
                          : coupon.usageTypeId === 1
                            ? '此優惠券可套用於商品結帳'
                            : '使用範圍未指定',
                      ],
                    },
                    { title: '付款', items: ['適用於所有付款方式'] },
                  ]}
                />
                <ProductDescription
                  title="使用規則"
                  content={[
                    `優惠代碼【${coupon.code}】
                    \n本優惠券適用於本網站指定商品與活動，僅限於優惠券有效期間內使用。每張優惠券僅限綁定帳號本人使用，且不得轉讓、折現、或與其他折價券合併使用（除非另有標示）。\n\n若使用本券之訂單全數退貨、取消或未完成付款，該優惠券將視為已使用且無法再次補發。部分商品如票券類、儲值金、限量活動商品、特定品牌與品類，可能不適用本券，實際使用範圍請依結帳頁面顯示為主。`,
                  ]}
                />
              </div>

              <RelatedProductList
                title={
                  coupon.usageTypeId === 2 ? '預約保母' : '此優惠券可用的商品'
                }
                products={relatedProducts.map((p) => ({
                  id: p.id,
                  image: p.product_images?.[0]?.image || '/fallback.jpg',
                  name: p.name,
                  price: `NT$${p.price}`,
                }))}
              />

              <div className={styles.btnContainer}>
                <button
                  className={styles.checkMoreButton}
                  onClick={handleCheckMore}
                >
                  查看更多
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
