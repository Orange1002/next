'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import '../_style/detail.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AiOutlineRight } from 'react-icons/ai'
import Image from 'next/image'
import { FaRegHeart, FaInstagram, FaYoutube, FaLine } from 'react-icons/fa'
import EditButton from '../_components/editBtn.js'
import CommentSection from '../_components/commentSection'
import Author from '../../_components/author-1'
const ArticlePage = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // 抓取文章資料
  useEffect(() => {
    if (!id) return
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

  if (loading) return <p className="text-center mt-5">讀取中...</p>
  if (error)
    return <p className="text-center mt-5 text-danger">錯誤：{error}</p>
  if (!article) return null

  // 處理圖片
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

  // 格式化時間
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
    { name: article.title, href: '#' }, // 最後一層不用可點擊
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

          <EditButton id={article.id} />
          <Author article={article}/>
        </div>

        {/* 文章圖片 */}

        <div
          className="d-flex justify-content-center article-p"
          style={{
            width: '100%',
            maxWidth: '780px',
            margin: '0 auto',
          }}
        >
          <Image
            src={imageSrc}
            alt={article.title}
            width={780}
            height={405} // 可改任意高度，不會實際裁切
            style={{
              width: '100%',
              height: 'auto', // 高度根據圖片比例自動調整
              objectFit: 'contain', // 重點：完整顯示、不裁切
            }}
          />
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
          <div className="col-12 d-flex justify-content-between align-items-center border-bottom pb-2 ">
            <p className="mt-3">{formatDate(article.created_date)}</p>
            <div className="d-flex align-items-center py-1">
              <FaRegHeart className="share-heart me-5" />
              <p className="mb-1 me-2">分享--</p>
              <a className="me-2" href="#">
                <FaInstagram />
              </a>
              <a className="me-2" href="#">
                <FaYoutube />
              </a>
              <a href="#">
                <FaLine />
              </a>
            </div>
          </div>
        </div>
        <div className="mb-footer-gap">
          <CommentSection articleId={article.id} />
        </div>
      </div>
    </main>
  )
}

export default ArticlePage
