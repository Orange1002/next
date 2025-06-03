'use client'
import React, { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import '../_style/detail.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AiOutlineRight } from 'react-icons/ai'
import Image from 'next/image'
import {
  FaHeart,
  FaRegHeart,
  FaInstagram,
  FaYoutube,
  FaLine,
  FaPaw,
} from 'react-icons/fa'
import EditButton from '../_components/editBtn.js' // 確保路徑正確
import CommentSection from '../_components/commentSection'
import Author from '../../_components/author-1'
import { useAuth } from '../../../../hooks/use-auth' // 確保路徑正確

const ArticlePage = () => {
  const { id } = useParams()
  const { isAuth, member } = useAuth() // 獲取 isAuth 和 member 物件

  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteCount, setFavoriteCount] = useState(0)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // 抓取文章資料
  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetch(`http://localhost:3005/api/article/article-detail/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error('抓取資料失敗')
        return res.json()
      })
      .then((data) => {
        if (data.success) {
          setArticle(data.result)
        } else {
          throw new Error(data.message || '未知錯誤')
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  // 收藏狀態初始化
  useEffect(() => {
    // 只有在文章資料載入完成且使用者已登入時才檢查收藏狀態
    if (!id || !isAuth || !article || !member.id) return

    fetch(`http://localhost:3005/api/article/favorites/status/${article.id}`, {
      method: 'POST', // 確認後端是否為 POST，通常檢查狀態會用 GET
      credentials: 'include', // 透過 cookie 認證
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ member_id: member.id }), // 傳送 member_id
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('收藏狀態:', data)
        if (data.success) {
          setIsFavorited(data.isFavorited)
          setFavoriteCount(data.favoriteCount)
        } else {
          console.warn('獲取收藏狀態失敗:', data.message)
          setIsFavorited(false); // 確保未成功時為未收藏狀態
          setFavoriteCount(data.favoriteCount || 0); // 確保有數量，即使失敗
        }
      })
      .catch((err) => {
        console.error('收藏狀態讀取錯誤', err);
        setIsFavorited(false); // 發生錯誤時設為未收藏
        setFavoriteCount(0); // 發生錯誤時數量為 0
      });
  }, [id, isAuth, article, member.id]) // 增加 member.id 作為依賴項

  // 收藏切換
  const toggleFavorite = async () => {
    if (!isAuth) {
      alert('請先登入才能收藏')
      return
    }
    if (!article) return

    const url = isFavorited
      ? 'http://localhost:3005/api/article/favorites/remove'
      : 'http://localhost:3005/api/article/favorites/add'

    try {
      const res = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId: article.id }),
      })

      const data = await res.json()
      if (data.success) {
        setIsFavorited((prev) => !prev)
        setFavoriteCount(data.favoriteCount)
      } else {
        alert(data.message)
      }
    } catch (error) {
      console.error('收藏切換錯誤', error)
      alert('收藏時發生錯誤')
    }
  }

  if (loading) return <p className="text-center mt-5">讀取中...</p>
  if (error)
    return <p className="text-center mt-5 text-danger">錯誤：{error}</p>
  if (!article) return null

  let images = []
  try {
    images = article?.article_images ? JSON.parse(article.article_images) : []
  } catch (err) {
    console.error('圖片 JSON 解析錯誤', err)
  }
  if (images.length === 0) {
    images = ['/article_img/default-image.jpeg']
  }

  // 手動切換上一張
  const goPrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
  }

  // 手動切換下一張
  const goNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length)
  }

  // 目前顯示的圖片 URL
  const currentImage = images[currentImageIndex]
  const imageSrc = currentImage.startsWith('/')
    ? `http://localhost:3005${currentImage}`
    : currentImage

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mi = String(date.getMinutes()).padStart(2, '0')
    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`
  }

  const breadcrumbItems = [
    { name: '首頁', href: '/' },
    { name: '文章', href: '/article' },
    { name: '文章列表', href: '/article/list' },
    { name: article.title, href: '#' },
  ]

  return (
    <main>
      {/* 麵包屑 */}
      <div className="d-flex align-items-center fw-light ms-5 detail-bread mb-5">
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={index}>
            <a
              href={item.href}
              className="mb-0 me-3 text-decoration-none"
              style={
                index === breadcrumbItems.length - 1
                  ? { pointerEvents: 'none', color: '#888' }
                  : {}
              }
            >
              {item.name}
            </a>
            {index < breadcrumbItems.length - 1 && (
              <AiOutlineRight className="me-3" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="container">
        <div className="row">
          <div className="col d-flex justify-content-center mt-5 mb-5">
            <h2 className="title" style={{ fontSize: '40px' }}>
              {article.title}
            </h2>
          </div>
          {/* 傳入文章 ID 和文章作者的 member_id */}
          {/* EditButton 組件內部會從 AuthContext 獲取當前登入會員 ID */}
          <EditButton id={article.id} member_id={article.member_id} />
          <Author article={article} />
        </div>

        {/* 文章圖片 */}
        <div
          className="d-flex justify-content-center article-p position-relative"
          style={{
            width: '100%',
            maxWidth: '780px',
            margin: '0 auto',
            userSelect: 'none',
          }}
        >
          <button
            onClick={goPrev}
            className="paw-btn paw-prev"
            aria-label="上一張"
          >
            <FaPaw />
          </button>

          <Image
            src={imageSrc}
            alt={article.title}
            width={780}
            height={405}
            style={{
              width: '100%',
              height: 'auto',
              objectFit: 'contain',
              borderRadius: '8px',
            }}
            priority
          />

          <button
            onClick={goNext}
            className="paw-btn paw-next"
            aria-label="下一張"
          >
            <FaPaw />
          </button>
        </div>

        {/* 文章內容 */}
        <div className="row text-center">
          <div
            className="mx-auto custom-letter-spacing pb-3 border-1"
            style={{ maxWidth: '850px' }}
          >
            {article.content1?.split('\n').map((para, i) => (
              <p
                key={i}
                style={{
                  fontSize: '20px',
                  lineHeight: '1.6',
                  textAlign: 'left',
                }}
              >
                {para}
              </p>
            ))}
          </div>
        </div>

        {/* 分享與留言 */}
        <div className="share-area">
          <div className="col-12 d-flex justify-content-between align-items-center border-bottom pb-2">
            <p className="mt-3">{formatDate(article.created_date)}</p>
            <div className="d-flex align-items-center py-1">
              {isFavorited ? (
                <FaHeart
                  className="share-heart me-2"
                  onClick={toggleFavorite}
                  style={{ color: '#d7633d', cursor: 'pointer' }}
                />
              ) : (
                <FaRegHeart
                  className="share-heart me-2"
                  onClick={toggleFavorite}
                  style={{ color: '#505050', cursor: 'pointer' }}
                />
              )}
              <span className="me-4">{favoriteCount}</span>
              <p className="mb-1 me-2">分享--</p>
              <a
                className="me-2"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaInstagram />
              </a>
              <a
                className="me-2"
                href="https://www.youtube.com/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaYoutube />
              </a>
              <a
                href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.href : ''
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaLine />
              </a>
            </div>
          </div>
        </div>

        <div className="comment-section col-12 mb-footer-gap">
          <CommentSection articleId={article.id} />
        </div>
      </div>
    </main>
  )
}

export default ArticlePage

// 'use client'
// import React, { useEffect, useState, useRef } from 'react'
// import { useParams } from 'next/navigation'
// import '../_style/detail.scss'
// import 'bootstrap/dist/css/bootstrap.min.css'
// import { AiOutlineRight } from 'react-icons/ai'
// import Image from 'next/image'
// import {
//   FaHeart,
//   FaRegHeart,
//   FaInstagram,
//   FaYoutube,
//   FaLine,
//   FaPaw,
// } from 'react-icons/fa'
// import EditButton from '../_components/editBtn.js'
// import CommentSection from '../_components/commentSection'
// import Author from '../../_components/author-1'
// import { useAuth } from '../../../../hooks/use-auth'

// const ArticlePage = () => {
//   const { id } = useParams()
//   const { isAuth } = useAuth()
//   const [article, setArticle] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [isFavorited, setIsFavorited] = useState(false)
//   const [favoriteCount, setFavoriteCount] = useState(0)

//   const [currentImageIndex, setCurrentImageIndex] = useState(0)

//   // 抓取文章資料
//   useEffect(() => {
//     if (!id) return
//     setLoading(true)
//     fetch(`http://localhost:3005/api/article/article-detail/${id}`)
//       .then((res) => {
//         if (!res.ok) throw new Error('抓取資料失敗')
//         return res.json()
//       })
//       .then((data) => {
//         if (data.success) {
//           setArticle(data.result)
//         } else {
//           throw new Error(data.message || '未知錯誤')
//         }
//         setLoading(false)
//       })
//       .catch((err) => {
//         setError(err.message)
//         setLoading(false)
//       })
//   }, [id])

//   // 收藏狀態初始化
//   useEffect(() => {
//     if (!id || !isAuth || !article) return

//     fetch(`http://localhost:3005/api/article/favorites/status/${article.id}`, {
//       credentials: 'include', // 透過 cookie 認證
//     })
//       .then((res) => res.json())
//       .then((data) => {
//         console.log('收藏狀態:', data)
//         if (data.success) {
//           setIsFavorited(data.isFavorited)
//           setFavoriteCount(data.favoriteCount)
//         }
//       })
//       .catch((err) => console.error('收藏狀態讀取錯誤', err))
//   }, [id, isAuth, article])

//   // 收藏切換
//   const toggleFavorite = async () => {
//     if (!isAuth) {
//       alert('請先登入才能收藏')
//       return
//     }
//     if (!article) return

//     const url = isFavorited
//       ? 'http://localhost:3005/api/article/favorites/remove'
//       : 'http://localhost:3005/api/article/favorites/add'

//     try {
//       const res = await fetch(url, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ articleId: article.id }),
//       })

//       const data = await res.json()
//       if (data.success) {
//         setIsFavorited((prev) => !prev)
//         setFavoriteCount(data.favoriteCount)
//       } else {
//         alert(data.message)
//       }
//     } catch (error) {
//       console.error('收藏切換錯誤', error)
//       alert('收藏時發生錯誤')
//     }
//   }

//   if (loading) return <p className="text-center mt-5">讀取中...</p>
//   if (error)
//     return <p className="text-center mt-5 text-danger">錯誤：{error}</p>
//   if (!article) return null

//   let images = []
//   try {
//     images = article?.article_images ? JSON.parse(article.article_images) : []
//   } catch (err) {
//     console.error('圖片 JSON 解析錯誤', err)
//   }
//   if (images.length === 0) {
//     images = ['/article_img/default-image.jpeg']
//   }

//   // 手動切換上一張
//   const goPrev = () => {
//     setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length)
//   }

//   // 手動切換下一張
//   const goNext = () => {
//     setCurrentImageIndex((prev) => (prev + 1) % images.length)
//   }

//   // 目前顯示的圖片 URL
//   const currentImage = images[currentImageIndex]
//   const imageSrc = currentImage.startsWith('/')
//     ? `http://localhost:3005${currentImage}`
//     : currentImage


//   const formatDate = (dateString) => {
//     const date = new Date(dateString)
//     const yyyy = date.getFullYear()
//     const mm = String(date.getMonth() + 1).padStart(2, '0')
//     const dd = String(date.getDate()).padStart(2, '0')
//     const hh = String(date.getHours()).padStart(2, '0')
//     const mi = String(date.getMinutes()).padStart(2, '0')
//     return `${yyyy}/${mm}/${dd} ${hh}:${mi}`
//   }

//   const breadcrumbItems = [
//     { name: '首頁', href: '/' },
//     { name: '文章', href: '/article' },
//     { name: '文章列表', href: '/article/list' },
//     { name: article.title, href: '#' },
//   ]

//   return (
//     <main>
//       {/* 麵包屑 */}
//       <div className="d-flex align-items-center fw-light ms-5 detail-bread mb-5">
//         {breadcrumbItems.map((item, index) => (
//           <React.Fragment key={index}>
//             <a
//               href={item.href}
//               className="mb-0 me-3 text-decoration-none"
//               style={
//                 index === breadcrumbItems.length - 1
//                   ? { pointerEvents: 'none', color: '#888' }
//                   : {}
//               }
//             >
//               {item.name}
//             </a>
//             {index < breadcrumbItems.length - 1 && (
//               <AiOutlineRight className="me-3" />
//             )}
//           </React.Fragment>
//         ))}
//       </div>

//       <div className="container">
//         <div className="row">
//           <div className="col d-flex justify-content-center mt-5 mb-5">
//             <h2 className="title" style={{ fontSize: '40px' }}>
//               {article.title}
//             </h2>
//           </div>
//           <EditButton id={article.id} />
//           <Author article={article} />
//         </div>

//         {/* 文章圖片 */}

//         <div
//           className="d-flex justify-content-center article-p position-relative"
//           style={{
//             width: '100%',
//             maxWidth: '780px',
//             margin: '0 auto',
//             userSelect: 'none',
//           }}
//         >
//           <button
//             onClick={goPrev}
//             className="paw-btn paw-prev"
//             aria-label="上一張"
//           >
//             <FaPaw />
//           </button>

//           <Image
//             src={imageSrc}
//             alt={article.title}
//             width={780}
//             height={405}
//             style={{
//               width: '100%',
//               height: 'auto',
//               objectFit: 'contain',
//               borderRadius: '8px',
//             }}
//             priority
//           />

//           <button
//             onClick={goNext}
//             className="paw-btn paw-next"
//             aria-label="下一張"
//           >
//             <FaPaw />
//           </button>
//         </div>

//         {/* 文章內容 */}
//         <div className="row text-center">
//           <div
//             className="mx-auto custom-letter-spacing pb-3 border-1"
//             style={{ maxWidth: '850px' }}
//           >
//             {article.content1?.split('\n').map((para, i) => (
//               <p
//                 key={i}
//                 style={{
//                   fontSize: '20px',
//                   lineHeight: '1.6',
//                   textAlign: 'left',
//                 }}
//               >
//                 {para}
//               </p>
//             ))}
//           </div>
//         </div>

//         {/* 分享與留言 */}
//         <div className="share-area">
//           <div className="col-12 d-flex justify-content-between align-items-center border-bottom pb-2">
//             <p className="mt-3">{formatDate(article.created_date)}</p>
//             <div className="d-flex align-items-center py-1">
//               {isFavorited ? (
//                 <FaHeart
//                   className="share-heart me-2"
//                   onClick={toggleFavorite}
//                   style={{ color: '#d7633d', cursor: 'pointer' }}
//                 />
//               ) : (
//                 <FaRegHeart
//                   className="share-heart me-2"
//                   onClick={toggleFavorite}
//                   style={{ color: '#505050', cursor: 'pointer' }}
//                 />
//               )}
//               <span className="me-4">{favoriteCount}</span>
//               <p className="mb-1 me-2">分享--</p>
//               <a
//                 className="me-2"
//                 href="https://www.instagram.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaInstagram />
//               </a>
//               <a
//                 className="me-2"
//                 href="https://www.youtube.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaYoutube />
//               </a>
//               <a
//                 href={`https://social-plugins.line.me/lineit/share?url=${encodeURIComponent(
//                   typeof window !== 'undefined' ? window.location.href : ''
//                 )}`}
//                 target="_blank"
//                 rel="noopener noreferrer"
//               >
//                 <FaLine />
//               </a>
//             </div>
//           </div>
//         </div>

//         <div className="comment-section col-12 mb-footer-gap">
//           <CommentSection articleId={article.id} />
//         </div>
//       </div>
//     </main>
//   )
// }

// export default ArticlePage
