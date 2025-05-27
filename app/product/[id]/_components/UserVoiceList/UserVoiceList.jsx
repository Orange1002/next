'use client'
import { useState } from 'react'
import UserVoiceCard from './UserVoiceCard'
import styles from './UserVoiceList.module.scss'

export default function UserVoiceList({ data = [] }) {
  const [visibleCount, setVisibleCount] = useState(3)

  const handleReadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, data.length))
  }

  return (
    <div className={styles.userVoice}>
      <div className={styles.titleBarContainer}>
        <div className={styles.titleBar}>
          <span className={styles.titleLine}></span>
          <div className={styles.titleText}>User's Voice</div>
          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 10 10" fill="none">
            <circle cx="5" cy="5" r="5" fill="#505050" />
          </svg>
        </div>
      </div>

      <div className={styles.voiceContainer}>
        {data.slice(0, visibleCount).map((item, i) => (
          <UserVoiceCard
            key={i}
            date={item.date}
            rate={item.rate}
            title={item.title}
            content={item.content}
          />
        ))}

        {visibleCount < data.length && (
          <div className={styles.voiceMore} onClick={handleReadMore}>
            <div className={styles.voiceMoreText}>Read more</div>
            <i className={`fa-solid fa-chevron-right ${styles.moreIcon}`}></i>
          </div>
        )}
      </div>
    </div>
  )
}