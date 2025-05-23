'use client';

import styles from './VIPCard.module.scss';
import Image from 'next/image';
import defaultCardImg from './img/vipcard.jpg';
import defaultPawIcon from './img/icon-paw.png';


const VIPCard = ({
  userName = '趙柏茗',
  level = '新會員',
  statusNote = '（累積中）',
  accumulatedPoints = 3000,
  nextLevelPoints = 2000,
  cardImage = defaultCardImg,
  iconImage = defaultPawIcon,
}) => {
  return (
    <section className={styles.myCardSection}>
      <div className={`container ${styles.memberCard}`}>
        <div className={styles.cardInfo}>
          <div className={styles.cardBox}>
            <Image
              src={cardImage}
              alt="會員卡"
              fill
              className={styles.vipCardImg}
              style={{ objectFit: 'cover' }}
            />
          </div>

          <div className={styles.cardText}>
            <p className={styles.helloText}>
              HELLO, <span className={styles.highlight}>{userName}</span>
            </p>

            <p className={styles.memberLevel}>
              <Image
                src={iconImage}
                alt="paw"
                className={styles.pawIcon}
                width={16}
                height={16}
              />
              <span className={styles.levelText}>您目前是</span>
              <span className={styles.levelCurrent}>{level}</span>
              <span className={styles.levelText}>等級</span>
              <span className={styles.levelExtra}>{statusNote}</span>
            </p>

            <div className={styles.cardPoints}>
              <div className={styles.pointBanner}>
                <span className={styles.pointBannerText}>目前已累計</span>
                <span className={styles.pointAmount}>
                  {accumulatedPoints.toLocaleString()}
                </span>
                <span className={styles.pointBannerText}>點</span>
              </div>
              <p className={styles.pointHint}>
                <span className={styles.pointHintText}>在滿</span>
                <span className={styles.pointHintCurrent}>
                  {nextLevelPoints.toLocaleString()}
                </span>
                <span className={styles.pointHintText}>
                  點即可升級為忠實會員
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VIPCard;
