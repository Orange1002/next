'use client'

import styles from './CouponCard.module.scss'
import Image from 'next/image'
import PropTypes from 'prop-types'
import { useRouter } from 'next/navigation'
import { categorySlugMap } from '../../../product/category/_categoryMap'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'

const CouponCard = ({
  title,
  date,
  minSpend,
  multiplier,
  image,
  categoryId,
  isClaimed,
  couponId,
  memberId,
  usageTypeId,
  onClaimed,
}) => {
  const router = useRouter()
  const [claimed, setClaimed] = useState(isClaimed)

  const handleUseClick = () => {
    if (usageTypeId === 2) {
      router.push('/sitter') // 保母
      return
    }

    if (!categoryId) return
    // 由 categorySlugMap 找出與 categoryId 相符的 slug
    const foundEntry = Object.entries(categorySlugMap).find(
      ([slug, data]) => data.id === categoryId
    )
    if (foundEntry) {
      const slug = foundEntry[0]
      // 此處路由調整成你的網頁路徑，這裡用 http://localhost:3000/product/category/food 為例
      router.push(`/product/category/${slug}`)
    }
  }

  const handleClaim = async () => {
    if (!memberId) {
      Swal.fire({ icon: 'error', title: '請先登入才能領取優惠券' })
      return
    }

    try {
      const res = await fetch(
        `http://localhost:3005/api/coupon/coupons/${couponId}/claim`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
      const data = await res.json()

      if (data.status === 'success') {
        await Swal.fire({
          icon: 'success',
          title: '已成功領取優惠券！',
          showConfirmButton: false,
          timer: 1500,
        })
        setClaimed(true)

        // ✅ 呼叫父層提供的刷新函式
        onClaimed?.()
      } else {
        Swal.fire({
          icon: 'error',
          title: '領取失敗',
          text: data.message || '請稍後再試',
        })
      }
    } catch (err) {
      console.error('領取失敗', err)
      Swal.fire({
        icon: 'error',
        title: '伺服器錯誤',
        text: '請稍後再試',
      })
    }
  }

  useEffect(() => {
    setClaimed(isClaimed)
  }, [isClaimed])

  return (
    <div className={styles.couponCard}>
      <div className={styles.couponLeft}>
        <Image
          src={image || '/coupon_img/DefaultCoupon.png'}
          alt="優惠券圖"
          width={100}
          height={100}
        />
      </div>
      <div className={styles.couponContent}>
        <div className={styles.couponBody}>
          <div className={styles.couponTitle}>{title}</div>
          <div className={styles.couponPrice}>
            低消 <span className={styles.highlight}>${minSpend}</span> 起
          </div>
          <div className={styles.couponDate}>
            <i className="bi bi-clock"></i>
            <span>{date}</span>
          </div>
          {multiplier && (
            <div className={styles.badgeMultiplier}>{multiplier}</div>
          )}
        </div>

        {/* 右下角的按鈕 */}
        {(categoryId || usageTypeId === 2) && (
          <div className={styles.couponFooter}>
            {claimed ? (
              <button className={styles.useButton} onClick={handleUseClick}>
                {usageTypeId === 2 ? '預約保母' : '前往使用'}
              </button>
            ) : (
              <button className={styles.useButton} onClick={handleClaim}>
                領取
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

CouponCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  minSpend: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  multiplier: PropTypes.string,
  image: PropTypes.string,
  categoryId: PropTypes.number, // 新增 categoryId 用來判斷導向頁
}

CouponCard.defaultProps = {
  multiplier: null,
  image: '/coupon_img/DefaultCoupon.png',
}

export default CouponCard
