import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import styles from './UserVoiceCard.module.scss' // 模組化樣式

export default function UserVoiceCard({
  date = '2021/10/26 18:33:11',
  rate = 5,
  title = '光亮的設計很方便',
  content = `雖然我在兩款項圈之間猶豫，但我選擇了會發光的款式。\n有一次在家裡找不到它，正當我感到很困擾時，突然看到一道反射光閃現。\n\n結果成功發現了剛來到我們家的約克夏，牠藏在窗簾縫隙裡！未來牠的成長真的讓人期待。非常感謝這個美好的活動！`
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className={styles.voiceCard}>
      <div className={styles.voiceCardLeft}>
        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
          <g clipPath="url(#clip0_92_3165)">
            <path
              d="M27.5 15C27.5 16.9891 26.7098 18.8968 25.3033 20.3033C23.8968 21.7098 21.9891 22.5 20 22.5C18.0109 22.5 16.1032 21.7098 14.6967 20.3033C13.2902 18.8968 12.5 16.9891 12.5 15C12.5 13.0109 13.2902 11.1032 14.6967 9.6967C16.1032 8.29018 18.0109 7.5 20 7.5C21.9891 7.5 23.8968 8.29018 25.3033 9.6967C26.7098 11.1032 27.5 13.0109 27.5 15Z"
              fill="#505050"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M0 20C0 14.6957 2.10714 9.60859 5.85786 5.85786C9.60859 2.10714 14.6957 0 20 0C25.3043 0 30.3914 2.10714 34.1421 5.85786C37.8929 9.60859 40 14.6957 40 20C40 25.3043 37.8929 30.3914 34.1421 34.1421C30.3914 37.8929 25.3043 40 20 40C14.6957 40 9.60859 37.8929 5.85786 34.1421C2.10714 30.3914 0 25.3043 0 20ZM20 2.5C16.7044 2.50018 13.4759 3.43091 10.686 5.18507C7.8961 6.93923 5.65821 9.44553 4.22991 12.4155C2.80161 15.3854 2.24097 18.6983 2.6125 21.9729C2.98403 25.2474 4.27263 28.3505 6.33 30.925C8.105 28.065 12.0125 25 20 25C27.9875 25 31.8925 28.0625 33.67 30.925C35.7274 28.3505 37.016 25.2474 37.3875 21.9729C37.759 18.6983 37.1984 15.3854 35.7701 12.4155C34.3418 9.44553 32.1039 6.93923 29.314 5.18507C26.5241 3.43091 23.2956 2.50018 20 2.5Z"
              fill="#505050"
            />
          </g>
          <defs>
            <clipPath id="clip0_92_3165">
              <rect width="40" height="40" fill="white" />
            </clipPath>
          </defs>
        </svg>

        <div className={styles.voiceInfo}>
          <div className={styles.voiceDate}>DATE：{date}</div>
          <div className={styles.voiceRate}>
            RATE：
            {[...Array(rate)].map((_, i) => (
              <FaStar key={i} color="#ed784a" />
            ))}
          </div>
        </div>
      </div>

      <div className={styles.voiceCardRight}>
        <div className={styles.voiceTitle}>{title}</div>
        <div
          className={`${styles.voiceContent} ${isExpanded ? styles.expanded : ''}`}
          onClick={() => setIsExpanded(prev => !prev)}
        >
          {content.split('\n').map((line, i) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
