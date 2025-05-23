import styles from './CouponCard.module.scss';
import Image from 'next/image';
import ticketLeft from './img/coupon-ticket-left.png';
import PropTypes from 'prop-types';

const CouponCard = ({ title, date, minSpend, multiplier }) => {
  return (
    <div className={styles.couponCard}>
      <div className={styles.couponLeft}>
        <Image
          src={ticketLeft}
          alt="運費抵用券整塊圖"
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

        </div>
      </div>
    </div>
  );
};

CouponCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  minSpend: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  multiplier: PropTypes.string, // 可選
};

CouponCard.defaultProps = {
  multiplier: null,
};

export default CouponCard;
