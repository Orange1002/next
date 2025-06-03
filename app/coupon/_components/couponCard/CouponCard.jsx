'use client'

import styles from './CouponCard.module.scss';
import Image from 'next/image';
import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { categorySlugMap } from '../../../product/category/_categoryMap'

const CouponCard = ({ title, date, minSpend, multiplier, image, categoryId }) => {
  const router = useRouter();

  const handleUseClick = () => {
    if (!categoryId) return;
    // 由 categorySlugMap 找出與 categoryId 相符的 slug
    const foundEntry = Object.entries(categorySlugMap).find(
      ([slug, data]) => data.id === categoryId
    );
    if (foundEntry) {
      const slug = foundEntry[0];
      // 此處路由調整成你的網頁路徑，這裡用 http://localhost:3000/product/category/food 為例
      router.push(`/product/category/${slug}`);
    }
  };

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

        {/* 右下角的使用按鈕 */}
        {categoryId && (
          <div className={styles.couponFooter}>
            <button className={styles.useButton} onClick={handleUseClick}>
              前往使用
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

CouponCard.propTypes = {
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
  minSpend: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  multiplier: PropTypes.string,
  image: PropTypes.string,
  categoryId: PropTypes.number, // 新增 categoryId 用來判斷導向頁
};

CouponCard.defaultProps = {
  multiplier: null,
  image: '/coupon_img/DefaultCoupon.png',
};

export default CouponCard;
