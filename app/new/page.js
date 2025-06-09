'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import styles from './_style/Page.module.scss'
import CouponCard from '../member/coupons/_components/couponCard/CouponCard'
import CouponCardUnused from '../member/coupons/_components/couponCardUnused/CouponCardUnused'
import ProductCard from '../product/_components/card/ProductCard'
import RelatedProductList from '../coupon/_components/RelatedProductList/RelatedProductList'

export default function EventPage() {
  const [coupon, setCoupon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [member, setMember] = useState(null)
  const [products, setProducts] = useState([])
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    const fetchCoupon = async () => {
      try {
        const memberRes = await fetch('http://localhost:3005/api/me/me', {
          credentials: 'include',
        })
        if (!memberRes.ok) throw new Error('未登入')
        const memberData = await memberRes.json()
        setMember(memberData)

        const res = await fetch(
          `http://localhost:3005/api/coupon/coupons/22?memberId=${memberData.id}`,
          { credentials: 'include' }
        )
        const data = await res.json()
        setCoupon(data.data?.coupon)
      } catch (err) {
        console.error('❌ 抓取失敗', err)
      } finally {
        setLoading(false)
      }
    }
    fetchCoupon()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      if (!coupon) return

      try {
        const res = await fetch(
          `http://localhost:3005/api/product/products?categoryId=3`,
          {
            credentials: 'include',
          }
        )
        const data = await res.json()
        const allProducts = data.data?.products || []
        setProducts(allProducts)
        setRelatedProducts(allProducts.slice(4, 8))
      } catch (error) {
        console.error('❌ 活動頁抓商品失敗', error)
      }
    }

    fetchProducts()
  }, [coupon])

  const renderCouponCard = () => {
    if (!coupon) return null

    const title = coupon.title || '活動優惠券'
    const date = coupon.endAt
      ? `${new Date(coupon.endAt).toLocaleDateString('zh-TW')} 前使用`
      : '無期限'
    const minSpend = isNaN(parseFloat(coupon.minPurchase))
      ? '不限'
      : Math.floor(Number(coupon.minPurchase))
    const image = coupon.image || '/coupon_img/DefaultCoupon.png'
    const multiplier = coupon.vipLevelId ? 'VIP' : null
    const categoryId =
      coupon.categoryId ?? coupon.categoryCouponMap?.[0]?.categoryId
    const usageTypeId = coupon.usageTypeId

    if (coupon.isClaimed) {
      return (
        <CouponCardUnused
          couponId={coupon.id}
          title={title}
          date={date}
          minSpend={minSpend}
          multiplier={multiplier}
          image={image}
          usageTypeId={usageTypeId}
          categoryId={categoryId}
          memberId={member.id}
        />
      )
    } else {
      return (
        <CouponCard
          couponId={coupon.id}
          title={title}
          date={date}
          minSpend={minSpend}
          multiplier={multiplier}
          image={image}
          memberId={member.id}
          onClaimed={() => location.reload()}
        />
      )
    }
  }

  return (
    <main className={styles.newMain}>
      {/* 一區 */}
      <div className={styles.firstContainer}>
        <Image
          className={styles.Image1}
          src="/images/eventImg1.png"
          alt="Event Image 1"
          width={1920}
          height={820}
        />
      </div>
      <div className={styles.eventFirstContent}>
        <div className={styles.eventText1}>外出必備!! 春日好禮大放送！</div>
      </div>

      {/* 二區 */}
      <div className={styles.secondContainer}>
        <div className={styles.Image2Container}>
          <Image
            className={styles.Image2}
            src="/images/eventImg2.png"
            alt="Event Image 2"
            width={690}
            height={460}
          />
        </div>
        <div className={styles.eventSecondContent}>
          <div className={styles.eventText2Container}>
            <div className={styles.idkWhy}>
              <div className={styles.eventText2TitleBg}>
                <div className={styles.eventText2Title}>
                  外出，是一種選擇；備好，是一種溫柔。
                </div>
              </div>
              <div className={styles.eventText2}>
                春光正好，微風不噪。適合走進午後的陽光裡，也適合為出門的日常添一份儀式感。
                <br />
                <br />
                點擊下方，好禮就緒，與你一起走進季節的風景。
              </div>
            </div>
          </div>

          {loading ? <p>載入中...</p> : renderCouponCard()}
        </div>
      </div>

      {/* 三～五區照原樣 */}
      <div className={styles.Image3Container}>
        <Image
          className={styles.Image3}
          src="/images/eventImg3.png"
          alt="Event Image 3"
          width={1920}
          height={925}
        />
        {products[0] && (
          <div className={styles.eventProductCard}>
            <ProductCard
              id={products[0].id}
              image={products[0].product_images?.[0]?.image}
              name={products[0].name}
              price={`NT$${products[0].price}`}
              avgRating={
                products[0].rating?.count > 0
                  ? `${products[0].rating.avg} (${products[0].rating.count})`
                  : '0'
              }
              isFavorite={products[0].isFavorite}
            />
          </div>
        )}
      </div>

      <div className={styles.forthContainer}>
        <Image
          className={styles.Image4}
          src="/images/eventImg4.png"
          alt="Event Image 4"
          width={1920}
          height={1650}
        />
        {products[1] && (
          <div className={styles.eventProductCard2}>
            <ProductCard
              id={products[1].id}
              image={products[1].product_images?.[0]?.image}
              name={products[1].name}
              price={`NT$${products[1].price}`}
              avgRating={
                products[1].rating?.count > 0
                  ? `${products[1].rating.avg} (${products[1].rating.count})`
                  : '0'
              }
              isFavorite={products[1].isFavorite}
            />
          </div>
        )}

        {products[2] && (
          <div className={styles.eventProductCard3}>
            <ProductCard
              id={products[2].id}
              image={products[2].product_images?.[0]?.image}
              name={products[2].name}
              price={`NT$${products[2].price}`}
              avgRating={
                products[2].rating?.count > 0
                  ? `${products[2].rating.avg} (${products[2].rating.count})`
                  : '0'
              }
              isFavorite={products[2].isFavorite}
            />
          </div>
        )}
      </div>

      <div className={styles.fifthContainer}>
        <Image
          className={styles.Image5}
          src="/images/eventImg5.png"
          alt="Event Image 5"
          width={1920}
          height={491}
        />

        <div className={styles.eventRelatedProducts}>
          {coupon && (
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
          )}
        </div>
        <Link
          href="http://localhost:3000/product/category/travel"
          className={styles.btnMoreContainer}
        >
          <button className={styles.btnMore}>查看更多</button>
        </Link>
      </div>
    </main>
  )
}
