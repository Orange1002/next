'use client'

import styles from './VIPCard.module.scss'
import Image from 'next/image'
import defaultCardImg from './img/vipcard-01.png'
import LoyalCardImg from './img/vipcard-02.png'
import PlatinumCardImg from './img/vipcard-03.png'
import defaultPawIcon from './img/icon-paw.png'

const VIPCard = ({
  userName = '趙柏茗',
  accumulatedPoints = 3000,
  iconImage = defaultPawIcon,
}) => {
  // 根據點數設定等級、卡面與下一級資訊
  let cardImage = defaultCardImg
  let level = '新會員'
  let statusNote = '（累積中）'
  let nextLevelName = '忠實會員'
  let nextLevelPoints = 5000

  if (accumulatedPoints >= 8000) {
    cardImage = PlatinumCardImg
    level = '白金會員'
    statusNote = '（尊榮無比）'
    nextLevelName = null
    nextLevelPoints = null
  } else if (accumulatedPoints >= 5000) {
    cardImage = LoyalCardImg
    level = '忠實會員'
    statusNote = '（即將升級）'
    nextLevelName = '白金會員'
    nextLevelPoints = 8000
  }

  const pointsToNextLevel = nextLevelPoints ? Math.max(nextLevelPoints - accumulatedPoints, 0) : 0

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

              {nextLevelName ? (
                <p className={styles.pointHint}>
                  <span className={styles.pointHintText}>在滿</span>
                  <span className={styles.pointHintCurrent}>
                    {pointsToNextLevel.toLocaleString()}
                  </span>
                  <span className={styles.pointHintText}>
                    點即可升級為{nextLevelName}
                  </span>
                </p>
              ) : (
                <p className={styles.pointHint}>
                  <span className={styles.pointHintText}>
                    您已達最高等級
                  </span>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default VIPCard
