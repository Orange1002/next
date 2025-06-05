'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { FaRegHeart, FaHeart, FaPaw } from 'react-icons/fa'
import Swal from 'sweetalert2'

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

  const handleFavoriteToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()

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
        const result = await Swal.fire({
          icon: 'error',
          title: '尚未登入',
          text: '請先登入才能收藏喔',
          showCancelButton: true,
          confirmButtonText: '登入',
          cancelButtonText: '確認',
        })

        if (result.isConfirmed) {
          window.location.href = '/member/login'
        }
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

  const truncateTitle = (str, maxLength) => {
    if (!str) return ''
    return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
  }

  return (
    <div className="col">
      <Link
        href={`/article/article-detail/${article.id}`}
        className="card card-s h-100 position-relative text-decoration-none"
        style={{ color: 'inherit' }}
      >
        <Image
          width={200}
          height={200}
          src={imageSrc}
          className="card-img-top object-fit-cover"
          alt={article.title}
        />
        <div className="card-body d-flex align-items-center p-4 mb-4 position-relative">
          <p className="card-text card-s-p ps-3 mb-0">
            {truncateTitle(article.title, 18)}
          </p>
          <div
            className="position-absolute top-0 end-0 p-2 paw-icon"
            style={{ fontSize: '20px', color: '#ed784a', cursor: 'pointer' }}
          >
            <FaPaw />
          </div>
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
      </Link>
    </div>
  )
}

export default SmallArticleCard

// 'use client'
// import React, { useState, useEffect } from 'react'
// import Image from 'next/image'
// import Link from 'next/link'
// import { FaRegHeart, FaHeart, FaPaw } from 'react-icons/fa'

// const SmallArticleCard = ({ article }) => {
//   const [isFavorited, setIsFavorited] = useState(false)
//   const [favoriteCount, setFavoriteCount] = useState(
//     article.favorite_count || 0
//   )
//   const [loading, setLoading] = useState(false)

//   useEffect(() => {
//     const fetchFavoriteStatus = async () => {
//       try {
//         const res = await fetch(
//           `http://localhost:3005/api/article/favorites/status/${article.id}`,
//           {
//             method: 'GET',
//             credentials: 'include',
//             headers: { 'Content-Type': 'application/json' },
//           }
//         )
//         const data = await res.json()
//         if (res.ok && data.success) {
//           setIsFavorited(data.isFavorited)
//           setFavoriteCount(data.favoriteCount)
//         }
//       } catch (err) {
//         console.error('取得收藏狀態錯誤', err)
//       }
//     }
//     fetchFavoriteStatus()
//   }, [article.id])

//   const handleFavoriteToggle = async (e) => {
//     e.preventDefault() // 阻止 Link 預設跳轉
//     e.stopPropagation() // 阻止事件冒泡，避免卡片點擊事件觸發

//     if (loading) return
//     setLoading(true)

//     const url = isFavorited
//       ? 'http://localhost:3005/api/article/favorites/remove'
//       : 'http://localhost:3005/api/article/favorites/add'

//     try {
//       const res = await fetch(url, {
//         method: 'POST',
//         credentials: 'include',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ articleId: article.id }),
//       })

//       const data = await res.json()

//       if (res.ok && data.success) {
//         setIsFavorited(!isFavorited)
//         if (typeof data.favoriteCount === 'number') {
//           setFavoriteCount(data.favoriteCount)
//         } else {
//           setFavoriteCount((prev) => (isFavorited ? prev - 1 : prev + 1))
//         }
//       } else {
//         alert(data.message || (isFavorited ? '取消收藏失敗' : '收藏失敗'))
//       }
//     } catch (err) {
//       console.error('收藏操作失敗', err)
//       alert('伺服器錯誤')
//     } finally {
//       setLoading(false)
//     }
//   }

//   let images = []
//   try {
//     images = article.article_images ? JSON.parse(article.article_images) : []
//   } catch (err) {
//     console.error('圖片 JSON 解析錯誤', err)
//   }
//   const firstImage =
//     images.length > 0 ? images[0] : '/article_img/default-image.jpeg'
//   const imageSrc = firstImage.startsWith('/')
//     ? `http://localhost:3005${firstImage}`
//     : firstImage

//   const truncateTitle = (str, maxLength) => {
//     if (!str) return ''
//     return str.length > maxLength ? str.slice(0, maxLength) + '...' : str
//   }
//   return (
//     <div className="col-12 col-sm-6 col-md-4 col-lg-2">
//       <Link
//         href={`/article/article-detail/${article.id}`}
//         className="card card-s h-100 position-relative text-decoration-none"
//         style={{ color: 'inherit' }}
//       >
//         <Image
//           width={200}
//           height={200}
//           src={imageSrc}
//           className="card-img-top object-fit-cover"
//           alt={article.title}
//         />
//         <div className="card-body d-flex align-items-center p-4 mb-4 position-relative">
//           <p className="card-text card-s-p ps-3 mb-0">
//             {truncateTitle(article.title, 18)}
//           </p>
//           {/* 狗腳印 icon，放右上角示範 */}
//           <div
//             className="position-absolute top-0 end-0 p-2 paw-icon"
//             style={{ fontSize: '20px', color: '#ed784a', cursor: 'pointer' }}
//           >
//             <FaPaw />
//           </div>
//           <div
//             className="position-absolute bottom-0 end-0 p-3 d-flex align-items-center gap-1"
//             style={{ cursor: loading ? 'not-allowed' : 'pointer' }}
//             onClick={handleFavoriteToggle}
//           >
//             <span className="text-muted regular">{favoriteCount}</span>
//             {isFavorited ? (
//               <FaHeart className="card-icon text-danger" size={16} />
//             ) : (
//               <FaRegHeart className="card-icon" size={16} />
//             )}
//           </div>
//         </div>
//       </Link>
//     </div>
//   )
// }

// export default SmallArticleCard
