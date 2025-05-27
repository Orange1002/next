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

  return (
    <main>
      {/* 麵包屑 */}
      <div className="d-flex align-items-center fw-light ms-5 detail-bread mb-5">
        <a href="#" className="mb-0 me-3 text-decoration-none">
          首頁
        </a>
        <AiOutlineRight className="me-3" />
        <a href="#" className="mb-0 me-3 text-decoration-none">
          文章
        </a>
        <AiOutlineRight className="me-3" />
        <a href="#" className="mb-0 me-3 text-decoration-none">
          文章列表
        </a>
        <AiOutlineRight className="me-3" />
        <a href="#" className="mb-0 me-3 text-decoration-none">
          營養與飲食
        </a>
        <AiOutlineRight className="me-3" />
        <a href="#" className="mb-0 me-3 text-decoration-none">
          {article.title}
        </a>
      </div>

      <div className="container">
        <div className="row">
          <div className="col d-flex justify-content-center mt-5 mb-5">
            <h2 className="title" style={{ fontSize: '40px' }}>
              {article.title}
            </h2>
          </div>

          <EditButton id={article.id} />

          {/* 作者卡 */}
          {/* <div className="row d-flex justify-content-center mt-5">
            <div className="card mb-3 custom-card">
              <div className="row g-0">
                <div className="col-md-4">
                  <Image
                    width={215}
                    height={200}
                    src="/article_img/171758376764_o.jpg"
                    className="img-fluid rounded-start object-fit-cover custom-card-photo"
                    alt="作者照片"
                  />
                </div>
                <div className="col-md-8">
                  <div className="card-body">
                    <h5 className="card-title mb-3">
                      {article.member_username}
                    </h5>
                    <p className="card-text mb-4">
                      <small className="text-body-secondary">
                        國立台灣大學獸醫系 學士
                      </small>
                    </p>
                    <p className="card-text">
                      現任 興沛動物醫院
                      主治獸醫師，擁有2486年寵物食療臨床經驗，寵物鮮食品牌【年年】共同創辦人
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div> */}
          
        </div>

        {/* 文章圖片 */}
        <div className="d-flex justify-content-center article-p">
          <Image width={780} height={405} src={imageSrc} alt={article.title} />
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
        <CommentSection articleId={article.id} />
      </div>
    </main>
  )
}

export default ArticlePage
