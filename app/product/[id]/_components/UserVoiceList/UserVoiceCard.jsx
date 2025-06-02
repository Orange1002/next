import { useState } from 'react'
import { FaStar } from 'react-icons/fa'
import styles from './UserVoiceCard.module.scss' // 模組化樣式
import Swal from 'sweetalert2'

export default function UserVoiceCard({
  id,
  memberId,
  reviewMemberId,
  username,
  date = '',
  rate = 0,
  content = '',
  onUpdated = () => {},
}) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editRating, setEditRating] = useState(rate)
  const [editContent, setEditContent] = useState(content)
  const [hoverRating, setHoverRating] = useState(0)

  const handleSubmit = async () => {
    if (
      !editRating ||
      editRating < 1 ||
      editRating > 5 ||
      !editContent.trim()
    ) {
      Swal.fire('錯誤', '請填寫正確的星等與內容', 'error')
      return
    }

    try {
      const res = await fetch(
        `http://localhost:3005/api/product/review/${id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            rating: editRating,
            comment: editContent,
          }),
        }
      )
      const result = await res.json()
      if (res.ok) {
        Swal.fire('更新成功', result.message, 'success')
        setIsEditing(false)
        onUpdated?.()
      } else {
        Swal.fire('錯誤', result.error || '更新失敗', 'error')
      }
    } catch (err) {
      console.error('❌ 更新失敗', err)
      Swal.fire('錯誤', '無法送出請求', 'error')
    }
  }

  const handleDelete = async () => {
    const confirm = await Swal.fire({
      title: '確定要刪除嗎？',
      text: '刪除後將無法復原',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ed784a',
      cancelButtonColor: '#888',
      confirmButtonText: '確認刪除',
      cancelButtonText: '取消',
    })

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(
          `http://localhost:3005/api/product/review/${id}`,
          {
            method: 'DELETE',
            credentials: 'include',
          }
        )
        const result = await res.json()
        if (res.ok) {
          Swal.fire('刪除成功', result.message, 'success')
          onUpdated?.()
        } else {
          Swal.fire('錯誤', result.error || '刪除失敗', 'error')
        }
      } catch (err) {
        console.error('❌ 刪除失敗', err)
        Swal.fire('錯誤', '無法送出請求', 'error')
      }
    }
  }

  return (
    <div className={styles.voiceCard}>
      <div className={styles.voiceCardLeft}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
        >
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
        <div className={styles.voiceTitle}>
          {username ? `會員：${username}` : '（會員已刪除）'}
        </div>
        <div
          className={`${styles.voiceContent} ${isExpanded ? styles.expanded : ''}`}
          onClick={() => setIsExpanded((prev) => !prev)}
        >
          {(content || '').split('\n').map((line, i) => (
            <span key={i} className={styles.voiceText}>
              {line}
              <br />
            </span>
          ))}
        </div>
      </div>
      {memberId === reviewMemberId && !isEditing && (
        <button
          id={`edit-review-${id}`}
          className={styles.editBtn}
          onClick={() => setIsEditing(true)}
        >
          編輯
        </button>
      )}

      {isEditing && (
        <div className={styles.editForm}>
          <label className={styles.starSelect}>
            星等：
            <div className={styles.starRating}>
              {[1, 2, 3, 4, 5].map((v) => (
                <FaStar
                  key={v}
                  size={24}
                  color={v <= (hoverRating || editRating) ? '#ed784a' : '#ccc'}
                  style={{ cursor: 'pointer', marginRight: 4 }}
                  onClick={() => setEditRating(v)}
                  onMouseEnter={() => setHoverRating(v)}
                  onMouseLeave={() => setHoverRating(0)}
                />
              ))}
            </div>
          </label>
          <label>
            留言內容：
            <textarea
              rows="3"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
          </label>
          <div className={styles.editBtnRow}>
            <button onClick={handleSubmit}>送出</button>
            <button onClick={() => setIsEditing(false)}>取消</button>
            <button className={styles.deleteBtn} onClick={handleDelete}>
              刪除
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
