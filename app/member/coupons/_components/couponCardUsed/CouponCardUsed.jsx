import styles from './CouponCardUsed.module.scss'
import Image from 'next/image'
import PropTypes from 'prop-types'

const CouponCardUsed = ({ title, date, minSpend, multiplier, image }) => {
  const usedImage = image
    ? image.replace(/\\/g, '/').replace(/\/([^/]+)\.png$/, '/Used$1.png')
    : '/coupon_img/UsedDefaultCoupon.png'

  return (
    <div className={styles.couponCard}>
      <div className={styles.couponLeft}>
        <Image
          src={usedImage}
          alt="已使用優惠券圖"
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
        <div className={styles.couponActions}>
          <div className={styles.btnUse}>已使用</div>
        </div>
      </div>
    </div>
  )
}

CouponCardUsed.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  minSpend: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  multiplier: PropTypes.string,
  image: PropTypes.string,
}

CouponCardUsed.defaultProps = {
  multiplier: null,
  image: '/coupon_img/UsedDefaultCoupon.png',
}

export default CouponCardUsed
