'use client'
import { useState } from 'react'
import UserVoiceCard from './UserVoiceCard'
import styles from './UserVoiceList.module.scss'
import Swal from 'sweetalert2'
import showReviewModal from '../ReviewModal/ReviewModal'

export default function UserVoiceList({
  data = [],
  memberId,
  productId,
  onUpdated = () => {},
}) {
  const [visibleCount, setVisibleCount] = useState(3)
  const [showNewCard, setShowNewCard] = useState(false)

  const handleNewClick = async () => {
    try {
      const res = await fetch(
        `http://localhost:3005/api/product/review/${productId}/check`,
        {
          method: 'GET',
          credentials: 'include',
        }
      )
      const result = await res.json()

      if (!res.ok) {
        Swal.fire('錯誤', result.error || '請先登入', 'error')
        return
      }

      if (!result.data.hasPurchased) {
        Swal.fire('無法留言', '您必須先購買此商品才能評論', 'warning')
        return
      }

      if (!result.data.hasCommented && !result.data.review) {
        // 顯示 modal 讓使用者填寫
        try {
          const formValues = await showReviewModal()
          await handleNewSubmit(formValues.rating, formValues.comment)
        } catch {
          // 使用者按了取消，什麼都不做
        }
      } else {
        // 已留言：提示是否改為編輯
        const confirm = await Swal.fire({
          icon: 'info',
          title: '您已經評論過了',
          text: '請問是否要編輯原有評論？',
          showCancelButton: true,
          confirmButtonText: '編輯',
          cancelButtonText: '取消',
        })

        if (confirm.isConfirmed) {
          document
            .querySelector(`#edit-review-${result.data.review.id}`)
            ?.click()
        }
      }
    } catch (err) {
      Swal.fire('錯誤', '無法檢查留言狀態', 'error')
    }
  }
  const handleNewSubmit = async (rating, comment) => {
    try {
      const res = await fetch('http://localhost:3005/api/product/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          productId,
          rating,
          comment,
        }),
      })

      const result = await res.json()

      if (res.ok) {
        Swal.fire('新增評論成功', result.message, 'success')
        setShowNewCard(false)
        onUpdated()
      } else {
        Swal.fire('錯誤', result.error || '新增評論失敗', 'error')
      }
    } catch (err) {
      console.error('❌ 新增評論失敗', err)
      Swal.fire('錯誤', '無法送出評論', 'error')
    }
  }

  const handleReadMore = () => {
    setVisibleCount((prev) => Math.min(prev + 5, data.length))
  }
  return (
    <div className={styles.userVoice}>
      <div className={styles.titleBarContainer}>
        <div className={styles.titleBar}>
          <span className={styles.titleLine}></span>
          <div className={styles.titleText}>User's Voice</div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
          >
            <circle cx="5" cy="5" r="5" fill="#505050" />
          </svg>
        </div>
      </div>

      <div className={styles.voiceContainer}>
        {data.slice(0, visibleCount).map((item, i) => (
          <UserVoiceCard
            key={`review-${item.id ?? i}`}
            id={item.id}
            date={item.date}
            rate={item.rate}
            content={item.content}
            memberId={memberId} // 當前登入會員 ID
            reviewMemberId={item.memberId} // 留言的會員 ID
            username={item.username}
            onUpdated={onUpdated}
          />
        ))}

        {visibleCount < data.length && (
          <div className={styles.voiceMore} onClick={handleReadMore}>
            <div className={styles.voiceMoreText}>Read more</div>
            <i className={`fa-solid fa-chevron-right ${styles.moreIcon}`}></i>
          </div>
        )}
        <div className={styles.voiceActionRow}>
          <button className={styles.addReviewBtn} onClick={handleNewClick}>
            新增評論
          </button>
        </div>
        {showNewCard && (
          <UserVoiceCard
            id={null}
            date={new Date().toISOString().split('T')[0]}
            rate={0}
            content=""
            memberId={memberId}
            reviewMemberId={memberId}
            username="我"
            isNew={true}
            onCancel={() => setShowNewCard(false)}
            onSubmitNew={handleNewSubmit}
          />
        )}
      </div>
    </div>
  )
}
