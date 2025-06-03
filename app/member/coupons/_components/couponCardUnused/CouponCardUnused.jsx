import styles from './CouponCardUnused.module.scss'
import Image from 'next/image'
import PropTypes from 'prop-types'
import Link from 'next/link'

const CouponCardUnused = ({
  title,
  date,
  minSpend,
  multiplier,
  image,
  couponId,
  memberId,
}) => {
  const selectedImage = image || '/coupon_img/DefaultCoupon.png'

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
          <button className={styles.btnUse}>使用</button>
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
}

CouponCardUnused.defaultProps = {
  multiplier: null,
  image: '/coupon_img/DefaultCoupon.png',
}

export default CouponCardUnused
