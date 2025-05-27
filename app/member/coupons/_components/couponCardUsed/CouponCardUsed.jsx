import styles from './CouponCardUsed.module.scss';
import Image from 'next/image';
import ticketLeft1 from './img/coupon-11.png';
import ticketLeft2 from './img/coupon-22.png';
import ticketLeft3 from './img/coupon-33.png';
import ticketLeft4 from './img/coupon-44.png';
import ticketLeft5 from './img/coupon-55.png';
import PropTypes from 'prop-types';

const imageMap = {
  1: ticketLeft1,
  2: ticketLeft2,
  3: ticketLeft3,
  4: ticketLeft4,
  5: ticketLeft5,
};

const CouponCardUsed = ({ title, date, minSpend, multiplier, imageIndex }) => {
  const selectedImage = imageMap[imageIndex] || ticketLeft1;

  return (
    <div className={styles.couponCard}>
      <div className={styles.couponLeft}>
        <Image
          src={selectedImage}
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
  );
};

CouponCardUsed.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  minSpend: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  multiplier: PropTypes.string,
  imageIndex: PropTypes.number, // 加入 imageIndex
};

CouponCardUsed.defaultProps = {
  multiplier: null,
  imageIndex: 1, // 預設使用第一張
};

export default CouponCardUsed;