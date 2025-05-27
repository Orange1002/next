'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineRightCircle } from 'react-icons/ai'
import { FaRegHeart, FaHeart } from 'react-icons/fa'

const SmallArticleCard = ({ article }) => {
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

      if (res.ok && data.success) {
        setIsFavorited(!isFavorited)
        if (typeof data.favoriteCount === 'number') {
          setFavoriteCount(data.favoriteCount)
        } else {
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

  const truncateTitle = (str, maxLength) => {
    if (!str) return ''
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
  }

  return (
    <div className="col-12 col-sm-6 col-md-4 col-lg-2">
      <div className="card card-s h-100 position-relative">
        <Image
          width={200}
          height={200}
          src={imageSrc}
          className="card-img-top object-fit-cover"
          alt={article.title}
        />
        <div className="card-body d-flex align-items-center p-4 mb-4">
          <Link
            href={`/article/article-detail/${article.id}`}
            className="btn btn-link read-more rounded-circle d-flex justify-content-center align-items-center icon-link"
          >
            <AiOutlineRightCircle className="icon" />
          </Link>
          <p className="card-text card-s-p ps-3">
            {truncateTitle(article.title, 18)}
          </p>
          <div
            className="position-absolute bottom-0 end-0 p-3 d-flex align-items-center gap-1"
            style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
            onClick={handleFavoriteToggle}
          >
            <span className="text-muted regular">{favoriteCount}</span>
            {isFavorited ? (
              <FaHeart className="card-icon text-danger" size={16} />
            ) : (
              <FaRegHeart className="card-icon" size={16} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SmallArticleCard

// import React, { useState, useEffect } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import {
//   AiOutlineRightCircle,
//   AiOutlineHeart,
//   AiFillHeart,
// } from 'react-icons/ai'

// const SmallArticleCard = ({ article }) => {
//   let images = []
//   try {
//     images = article.article_images ? JSON.parse(article.article_images) : []
//   } catch (err) {
//     console.error('圖片 JSON 解析錯誤', err)
//   }

//   const firstImage = images.length > 0 ? images[0] : '/article_img/default-image.jpeg'
//   const imageSrc = firstImage.startsWith('/')
//     ? `http://localhost:3005${firstImage}`
//     : firstImage

//   const truncateTitle = (str, maxLength) => {
//     if (!str) return ''
//     return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
//   }

//   const [isFavorited, setIsFavorited] = useState(false)
//   const [favoriteCount, setFavoriteCount] = useState(article.favorite_count || 0)

//   useEffect(() => {
//     const fetchFavoriteStatus = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3005/api/article/favorites/status/${article.id}`,
//           {
//           method: 'GET',
//           credentials: 'include',
//         })
//         const data = await res.json()
//         if (res.ok) {
//           setIsFavorited(data.isFavorited)
//           setFavoriteCount(data.favoriteCount)
//         }
//       } catch (error) {
//         console.error('取得收藏狀態失敗', error)
//       }
//     }
//     fetchFavoriteStatus()
//   }, [article.id])

//   const handleFavoriteToggle = async () => {
//     const url = isFavorited
//       ? 'http://localhost:3005/api/article/favorites/remove'
//       : 'http://localhost:3005/api/article/favorites/add'

//     try {
//       const response = await fetch(url, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: 'include',
//         body: JSON.stringify({ articleId: article.id }),
//       })

//       const result = await response.json()

//       if (response.ok) {
//         setIsFavorited(!isFavorited)
//         if (result.favoriteCount !== undefined) {
//           setFavoriteCount(result.favoriteCount)
//         } else {
//           // 當 API 沒回傳數量時自己更新
//           setFavoriteCount(prev => (isFavorited ? prev - 1 : prev + 1))
//         }
//       } else {
//         alert(result.message || (isFavorited ? '取消收藏失敗' : '收藏失敗'))
//       }
//     } catch (error) {
//       console.error('收藏操作失敗:', error)
//       alert('伺服器錯誤')
//     }
//   }

//   return (
//     <div className="col-12 col-sm-6 col-md-4 col-lg-2">
//       <div className="card card-s h-100 position-relative">
//         <Image
//           width={200}
//           height={200}
//           src={imageSrc}
//           className="card-img-top object-fit-cover"
//           alt={article.title}
//         />
//         <div className="card-body d-flex align-items-center p-4 mb-4">
//           <Link
//             href={`/article/article-detail/${article.id}`}
//             className="btn btn-link read-more rounded-circle d-flex justify-content-center align-items-center icon-link"
//           >
//             <AiOutlineRightCircle className="icon" />
//           </Link>
//           <p className="card-text card-s-p ps-3">{truncateTitle(article.title, 18)}</p>
//           <div className="position-absolute bottom-0 end-0 p-3 d-flex align-items-center gap-1">
//             <span className="text-muted regular">{favoriteCount}</span>
//             {isFavorited ? (
//               <AiFillHeart
//                 className="card-icon"
//                 size={20}
//                 style={{ cursor: 'pointer', color: 'red' }}
//                 onClick={handleFavoriteToggle}
//               />
//             ) : (
//               <AiOutlineHeart
//                 className="card-icon"
//                 size={20}
//                 style={{ cursor: 'pointer' }}
//                 onClick={handleFavoriteToggle}
//               />
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default SmallArticleCard

