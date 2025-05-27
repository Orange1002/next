'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineRightCircle } from 'react-icons/ai'
import { FaRegHeart, FaHeart } from 'react-icons/fa'

const Card2 = ({ article }) => {
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(
    article.favorite_count || 0
  )
  const [loading, setLoading] = useState(false)

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
      console.log('API response:', data)

      if (res.ok && data.success) {
        setIsFavorited(!isFavorited)
        if (typeof data.favoriteCount === 'number') {
          setFavoriteCount(data.favoriteCount)
        } else {
          // 如果 API 沒傳收藏數，自己根據狀態調整
          setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1))
        }
      } else {
        alert(data.message || (isFavorited ? '取消收藏失敗' : '收藏失敗'))
      }
    } catch (err) {
      console.error('收藏操作失敗', err)
      alert('伺服器錯誤')
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
    <div className="card card-1 mt-4 d-none d-xl-block">
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
          <div className="card-body pt-4">
            <div className="d-flex align-items-center mt-2">
              <Link
                href={`/article/article-detail/${article.id}`}
                className="icon-link"
              >
                <AiOutlineRightCircle className="icon" />
              </Link>
              <h5 className="card-title title-1 ms-2 mt-2">
                {article.title && article.title.length > 20
                  ? article.title.substring(0, 20) + '…'
                  : article.title}
              </h5>
            </div>
            <p className="text-content text-break lh-base big-card">
              {article.content1 && article.content1.substring(0, 100)}
            </p>
            <div className="d-flex justify-content-between mt-4">
              <p>
                {article.created_date &&
                  new Date(article.created_date).toLocaleString()}
              </p>
              <div
                className="d-flex align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={handleFavoriteToggle}
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
    </div>
  )
}

export default Card2