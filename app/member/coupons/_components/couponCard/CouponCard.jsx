import styles from './CouponCard.module.scss'
import Image from 'next/image'
import PropTypes from 'prop-types'

const CouponCard = ({
  title,
  date,
  minSpend,
  multiplier,
  image,
  couponId,
  memberId,
}) => {
  const selectedImage = image || '/coupon_img/DefaultCoupon.png' // fallback 預設圖
  const handleClaim = async () => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/coupon/members/${memberId}/claim/${couponId}`,
        {
          method: 'POST',
          credentials: 'include',
        }
      )
      const data = await res.json()
      if (data.status === 'success') {
        alert('已成功領取優惠券！')
      } else {
        alert(`領取失敗：${data.message}`)
      }
    } catch (err) {
      console.error('領取失敗', err)
      alert('伺服器錯誤，請稍後再試')
    }
  }
  return (
    <div className={styles.couponCard}>
      <div className={styles.couponLeft}>
        <Image src={selectedImage} alt="優惠券圖" width={100} height={100} />
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
          <button className={styles.btnUse} onClick={handleClaim}>
            領取
          </button>
        </div>
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
  image: PropTypes.string, // ✅ 新增 image path
}

CouponCard.defaultProps = {
  multiplier: null,
  image: '/coupon_img/DefaultCoupon.png', // ✅ 預設圖（記得放一張或換成其他）
}

export default CouponCard
