'use client'

import styles from './CouponCardUnused.module.scss'
import Image from 'next/image'
import PropTypes from 'prop-types'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { categorySlugMap } from '../../../../product/category/_categoryMap'

const CouponCardUnused = ({
  title,
  date,
  minSpend,
  multiplier,
  image,
  couponId,
  memberId,
  usageTypeId,
  categoryId,
}) => {
  const router = useRouter()
  const selectedImage = image || '/coupon_img/DefaultCoupon.png'

  const handleUseClick = () => {
    if (usageTypeId === 2) {
      router.push('/sitter') // 保母
      return
    }

    if (!categoryId) return

    const foundEntry = Object.entries(categorySlugMap).find(
      ([slug, data]) => data.id === categoryId
    )
    if (foundEntry) {
      const slug = foundEntry[0]
      router.push(`/product/category/${slug}`)
    }
  }
  
  return (
    <div className={styles.couponCard}>
      <div className={styles.couponLeft}>
        <Link href={`/coupon/${couponId}`}>
          <Image
            src={selectedImage}
            alt="可使用優惠券圖"
            width={100}
            height={100}
          />
        </Link>
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
        <div className={styles.couponActions}>
          {(categoryId || usageTypeId === 2) && (
            <button className={styles.btnUse} onClick={handleUseClick}>
              {usageTypeId === 2 ? '預約' : '使用'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

CouponCardUnused.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  minSpend: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  multiplier: PropTypes.string,
  image: PropTypes.string,
  couponId: PropTypes.number.isRequired,
  memberId: PropTypes.number,
  usageTypeId: PropTypes.number,
  categoryId: PropTypes.number,
}

CouponCardUnused.defaultProps = {
  multiplier: null,
  image: '/coupon_img/DefaultCoupon.png',
}

export default CouponCardUnused
