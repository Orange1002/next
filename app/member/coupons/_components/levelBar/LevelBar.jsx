'use client';

import styles from './LevelBar.module.scss';
import Image from 'next/image';
import dogBadge from './img/Dog.svg';
import iconPaw from './img/icon-paw.png';
import 'bootstrap/dist/css/bootstrap.min.css'

const LevelBar = () => {
  return (
    <section className={`py-4 ${styles.membershipLevelSection}`}>
      <div className="container position-relative">
        <div className={styles.levelWrapper}>
          <div className={`${styles.levelLine} ${styles.grayLine}`}></div>
          <div className={`${styles.levelLine} ${styles.orangeLine}`}></div>
          <div className={`${styles.levelLine} ${styles.yellowLine}`}></div>

          <div className={`${styles.levelNode} ${styles.entry}`}>
            <div className={styles.circleStart}></div>
          </div>

          <div className={`${styles.levelNode} ${styles.start}`}>
            <div className={styles.levelSvgBadge}>
              <Image src={dogBadge} alt="dog-badge" />
            </div>
            <div className={`${styles.circleIcon} ${styles.circleBlack}`}></div>
            <div className={`${styles.levelLabel} ${styles.labelGray}`}>
              <Image src={iconPaw} alt="paw" className={styles.labelIcon} />
              新會員
            </div>
          </div>

          <div className={`${styles.levelNode} ${styles.middle}`}>
            <div className={`${styles.circleIcon} ${styles.circleOrange}`}></div>
            <div className={`${styles.levelLabel} ${styles.labelOrange}`}>
              <Image src={iconPaw} alt="paw" className={styles.labelIcon} />
              忠實會員
            </div>
          </div>

          <div className={`${styles.levelNode} ${styles.end}`}>
            <div className={`${styles.circleIcon} ${styles.circleYellow}`}></div>
            <div className={`${styles.levelLabel} ${styles.labelYellow}`}>
              <Image src={iconPaw} alt="paw" className={styles.labelIcon} />
              黃金會員
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LevelBar;
