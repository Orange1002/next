'use client'
import { useState } from 'react'

export default function HeartIcon({ productId, isActive = false }) {
  const [liked, setLiked] = useState(isActive)

  const toggleFavorite = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/product/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      })

      if (res.status === 401) {
        alert('請先登入才能收藏喔')
        return
      }

      const result = await res.json()
      setLiked(result.data.favorite)
    } catch (err) {
      console.error('收藏失敗', err)
    }
  }

  return (
    <div
      onClick={(e) => {
        e.stopPropagation() // ✅ 防止點擊愛心時跳轉卡片
        toggleFavorite()
      }}
      style={{ cursor: 'pointer' }}
    >
      {liked ? (
        // ❤️ 點亮
        <svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 27 27" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.4151 3.14841C20.8129 -4.48567 39.309 8.87313 13.4151 26.0506C-12.4789 8.8748 6.01729 -4.48567 13.4151 3.14841Z"
            fill="#ED784A"
          />
        </svg>
      ) : (
        // 🖤 未點亮
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="25" viewBox="0 0 28 25" fill="none">
          <path
            d="M14.1673 4.58007L12.9723 3.35174C10.1674 0.468413 5.02404 1.46341 3.16738 5.0884C2.29572 6.79339 2.09905 9.25505 3.69071 12.3967C5.22404 15.4217 8.41403 19.045 14.1673 22.9917C19.9207 19.045 23.109 15.4217 24.644 12.3967C26.2356 9.25338 26.0406 6.79339 25.1673 5.0884C23.3106 1.46341 18.1673 0.466746 15.3623 3.35007L14.1673 4.58007ZM14.1673 25C-11.3876 8.11339 6.29904 -5.06657 13.874 1.90507C13.974 1.9973 14.0718 2.0923 14.1673 2.19007C14.2612 2.09168 14.3591 1.99716 14.4607 1.90674C22.034 -5.0699 39.7223 8.11172 14.1673 25Z"
            fill="#505050"
          />
        </svg>
      )}
    </div>
  )
}
