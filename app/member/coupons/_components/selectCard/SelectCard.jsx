'use client';

import classNames from 'classnames';
import styles from './SelectCard.module.scss';

const tabs = [
  { id: 'available', desktop: '可領取的優惠券', mobile: '可領取' },
  { id: 'usable', desktop: '可使用的優惠券', mobile: '可使用' },
  { id: 'used', desktop: '已使用的優惠券', mobile: '已使用' },
];

const SelectCard = ({ activeTab, setActiveTab }) => {
  return (
    <div className={styles.container}>
      <ul className={styles.couponTabGroup} role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id} className={styles.couponTabItem}>
            <button
              type="button"
              role="tab"
              className={classNames(styles.couponTab, {
                [styles.active]: activeTab === tab.id,
              })}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className={`${styles.tabText} ${styles.desktop}`}>{tab.desktop}</span>
              <span className={`${styles.tabText} ${styles.mobile}`}>{tab.mobile}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectCard;
