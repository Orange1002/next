import styles from './CouponCardUnused.module.scss';
import Image from 'next/image';
import ticketLeft1 from './img/coupon-1.png';
import ticketLeft2 from './img/coupon-2.png';
import ticketLeft3 from './img/coupon-3.png';
import ticketLeft4 from './img/coupon-4.png';
import ticketLeft5 from './img/coupon-5.png';
import PropTypes from 'prop-types';

const imageMap = {
  1: ticketLeft1,
  2: ticketLeft2,
  3: ticketLeft3,
  4: ticketLeft4,
  5: ticketLeft5,
};

const CouponCardUnused = ({ title, date, minSpend, multiplier, imageIndex }) => {
  const selectedImage = imageMap[imageIndex] || ticketLeft1;

  return (
    <div className={styles.couponCard}>
      <div className={styles.couponLeft}>
        <Image
          src={selectedImage}
          alt="可使用優惠券圖"
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
          <button className={styles.btnUse}>使用</button>
        </div>
      </div>
    </div>
  );
};

CouponCardUnused.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  minSpend: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  multiplier: PropTypes.string,
  imageIndex: PropTypes.number, // <== 新增圖片索引
};

CouponCardUnused.defaultProps = {
  multiplier: null,
  imageIndex: 1, // 預設使用第一張圖
};

export default CouponCardUnused;