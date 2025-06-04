'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaRegHeart, FaHeart, FaDog } from 'react-icons/fa' // 匯入 FaDog 圖示
import { GiDogHouse } from 'react-icons/gi'
import Swal from 'sweetalert2'

const Card2 = ({ article }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(
    article.favorite_count || 0
  )
  const [loading, setLoading] = useState(false)
  const [isHovered, setIsHovered] = useState(false) // 新增狀態：追蹤卡片是否被懸停

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      try {
        const res = await fetch(
          `http://localhost:3005/api/article/favorites/status/${article.id}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
          }
        )
        const data = await res.json()
        if (res.ok && data.success) {
          setIsFavorited(data.isFavorited)
          setFavoriteCount(data.favoriteCount)
        }
      } catch (err) {
        console.error('取得收藏狀態錯誤', err)
      }
    }
    fetchFavoriteStatus()
  }, [article.id])

  const handleFavoriteToggle = async () => {
    if (loading) return
    setLoading(true)

    const url = isFavorited
      ? 'http://localhost:3005/api/article/favorites/remove'
      : 'http://localhost:3005/api/article/favorites/add'

    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId: article.id }),
      })

      const data = await res.json()
      if (res.ok && data.success) {
        setIsFavorited(!isFavorited)
        if (typeof data.favoriteCount === 'number') {
          setFavoriteCount(data.favoriteCount)
        } else {
          setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1))
        }
      } else {
        // SweetAlert 提示尚未登入
        await Swal.fire({
          icon: 'error',
          title: '尚未登入',
          text: '請先登入才能收藏喔',
          showCancelButton: true,
          confirmButtonText: '登入',
          cancelButtonText: '確認',
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = '/member/login' // 或你自訂的登入路由
          }
        })
      }
    } catch (err) {
      console.error('收藏操作失敗', err)
      Swal.fire({
        icon: 'error',
        title: '伺服器錯誤',
        showConfirmButton: false,
        timer: 1500,
      })
    } finally {
      setLoading(false)
    }
  }

  let images = []
  try {
    images = article.article_images ? JSON.parse(article.article_images) : []
  } catch (err) {
    console.error('圖片 JSON 解析錯誤', err)
  }
  const firstImage =
    images.length > 0 ? images[0] : '/article_img/default-image.jpeg'
  const imageSrc = firstImage.startsWith('/')
    ? `http://localhost:3005${firstImage}`
    : firstImage

  return (
    <div
      className="card card-2 mt-4 d-none d-xl-block w-100 position-relative"
      tabIndex={0}
    >
      {' '}
      {/* 加入 position-relative */}
      <Link
        href={`/article/article-detail/${article.id}`}
        className="text-decoration-none text-dark"
        style={{ display: 'block' }}
        onMouseEnter={() => setIsHovered(true)} // 滑鼠進入時設定為懸停狀態
        onMouseLeave={() => setIsHovered(false)} // 滑鼠離開時取消懸停狀態
      >
        {/* 狗屋 icon - 僅在懸停時顯示 */}
        {isHovered && (
          <div
            className="doghouse-icon position-absolute top-0 end-0 p-2"
            style={{
              fontSize: '20px',
              color: '#ed784a',
              cursor: 'pointer',
              zIndex: 10,
            }} // 調整顏色和 z-index
          >
            <GiDogHouse size={24} />
          </div>
        )}

        <div className="row g-0">
          <div className="col-md-5">
            <Image
              src={imageSrc}
              alt={article.title || '文章圖片'}
              width={426}
              height={250}
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="col-md-7">
            <div className="card-body pt-4 position-relative">
              <h5 className="card-title title-1 mt-2">
                {article.title && article.title.length > 20
                  ? article.title.substring(0, 20) + '…'
                  : article.title}
              </h5>
              <p className="text-content text-break lh-base big-card">
                {article.content1 &&
                  article.content1.substring(0, 100) + '....'}
              </p>
              <div className="d-flex justify-content-between mt-4 align-items-center">
                <p className="mb-0">
                  {article.created_date &&
                    new Date(article.created_date).toLocaleString()}
                </p>
                <div
                  className="d-flex align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation() // 阻止事件冒泡到 Link
                    handleFavoriteToggle()
                  }}
                >
                  {isFavorited ? (
                    <FaHeart className="card-icon card-i-hover text-danger" />
                  ) : (
                    <FaRegHeart className="card-icon card-i-hover" />
                  )}
                  <span className="ms-1">{favoriteCount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default Card2
