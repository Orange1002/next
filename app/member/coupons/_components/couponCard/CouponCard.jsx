import styles from './CouponCard.module.scss'
import Image from 'next/image'
import PropTypes from 'prop-types'
import Swal from 'sweetalert2'
import Link from 'next/link'

const CouponCard = ({
  title,
  date,
  minSpend,
  multiplier,
  image,
  couponId,
  memberId,
  onClaimed, // ✅ 新增：領取後觸發父層刷新
}) => {
  const selectedImage = image || '/coupon_img/DefaultCoupon.png'

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
        await Swal.fire({
          icon: 'success',
          title: '已成功領取優惠券！',
          showConfirmButton: false,
          timer: 1500,
        })

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

  return (
    <div className={styles.couponCard}>
      <div className={styles.couponLeft}>
        <Link href={`/coupon/${couponId}`}>
          <Image src={selectedImage} alt="優惠券圖" width={100} height={100} />
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
