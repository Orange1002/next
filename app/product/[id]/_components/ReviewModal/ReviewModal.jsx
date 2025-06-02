'use client'

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { FaStar } from 'react-icons/fa'
import { createRoot } from 'react-dom/client'
import React, { useState } from 'react'
import styles from './ReviewModal.module.scss'


// 用 React 包裝 SweetAlert2
const MySwal = withReactContent(Swal)

function ReviewForm({ onConfirm, onCancel }) {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [comment, setComment] = useState('')

  const handleConfirm = () => {
    if (rating < 1 || rating > 5 || !comment.trim()) {
      Swal.fire('錯誤', '請填寫完整的星等與留言內容', 'error')
      return
    }
    onConfirm({ rating, comment })
  }

  return (
    <div>

      <div className={styles.modalForm}>
        <label>
          星等：
          <div className={styles.starRating}>
            {[1, 2, 3, 4, 5].map((v) => (
              <FaStar
                key={v}
                size={24}
                color={v <= (hoverRating || rating) ? '#ed784a' : '#ccc'}
                onClick={() => setRating(v)}
                onMouseEnter={() => setHoverRating(v)}
                onMouseLeave={() => setHoverRating(0)}
              />
            ))}
          </div>
        </label>

        <label>
          留言：
          <textarea
            rows="3"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>

        <div className={styles.modalBtnRow}>
          <button onClick={handleConfirm}>送出</button>
          <button onClick={onCancel}>取消</button>
        </div>
      </div>
    </div>
  )
}

export default function showReviewModal() {
  return new Promise((resolve, reject) => {
    MySwal.fire({
      title: '新增評論',
      html: '<div id="review-modal-root"></div>',
      showConfirmButton: false,
      showCancelButton: false,
      didOpen: () => {
        const container = document.getElementById('review-modal-root')
        const root = createRoot(container)
        root.render(
          <ReviewForm
            onConfirm={(data) => {
              MySwal.close()
              resolve(data)
            }}
            onCancel={() => {
              MySwal.close()
              reject()
            }}
          />
        )
      },
    })
  })
}