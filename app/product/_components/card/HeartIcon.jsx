'use client'
import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { AiFillHeart, AiOutlineHeart } from 'react-icons/ai'


export default function HeartIcon({ productId, isActive = false }) {
  const [liked, setLiked] = useState(isActive)

  useEffect(() => {
    setLiked(isActive)
  }, [isActive])

  const toggleFavorite = async () => {
    try {
      const res = await fetch('http://localhost:3005/api/product/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ productId }),
      })

      if (res.status === 401) {
        await Swal.fire({
          icon: 'info',
          title: '請先登入才能收藏喔！',
          showConfirmButton: false,
          timer: 1500,
        })
        return
      }

      const result = await res.json()
      setLiked(result.data.favorite)

      if (result.data.favorite) {
        await Swal.fire({
          icon: 'success',
          title: '已加入收藏！',
          showConfirmButton: false,
          timer: 1500,
        })
      } else {
        await Swal.fire({
          icon: 'info',
          title: '已取消收藏！',
          showConfirmButton: false,
          timer: 1500,
        })
      }
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
      style={{ cursor: 'pointer', fontSize: '28px' }}
    >
     {liked ? (
        <AiFillHeart color="#ED784A" />
      ) : (
        <AiOutlineHeart color="#505050" />
      )}
    </div>
  )
}
