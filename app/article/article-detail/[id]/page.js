'use client'
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

import '../_style/detail.scss'
import 'bootstrap/dist/css/bootstrap.min.css'
import { AiOutlineRight } from 'react-icons/ai'
import Image from 'next/image'
import { FaRegHeart, FaInstagram, FaYoutube, FaLine } from 'react-icons/fa'
import FloatingActionButton from '../_components/floatingActionButton2.js'

const ArticlePage = () => {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const yyyy = date.getFullYear()
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const hh = String(date.getHours()).padStart(2, '0')
    const mi = String(date.getMinutes()).padStart(2, '0')
    return `${yyyy}/${mm}/${dd} ${hh}:${mi}`
  }
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

  // 解析圖片 JSON
  let images = []
  try {
    images = article.article_images ? JSON.parse(article.article_images) : []
  } catch (err) {
    console.error('圖片 JSON 解析錯誤', err)
  }

  // 取第一張圖片路徑，若無則用預設圖
  const firstImage =
    images.length > 0 ? images[0] : '/article_img/default-image.jpeg'

  // 拼接完整圖片 URL，假設你的圖片是由 http://localhost:3005 提供
  const imageSrc = firstImage.startsWith('/')
    ? `http://localhost:3005${firstImage}`
    : firstImage

  return (
    <main>
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
          <div className="row d-flex justify-content-center mt-5">
            <div className="card mb-3 custom-card">
              <div className="row g-0">
                <div className="col-md-4">
                  <Image
                    width={215}
                    height={200}
                    src="../article_img/171758376764_o.jpg"
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
          </div>
        </div>
        <div className="d-flex justify-content-center article-p">
          <Image width={780} height={405} src={imageSrc} alt={article.title} />
        </div>
        {/* 文章內容分段顯示 */}
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
        <FloatingActionButton />
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
        <div className="row">
          <div className="col-12 mt-5">
            <div className="mb-3 replay-area">
              <h6>留言區</h6>

              <div className="card mb-2 p-1">
                <div className="card-body">
                  <strong>使用者A：</strong>
                  <p className="mt-2 mb-2">
                    我家的狗狗冬天真的比較沒精神，謝謝分享！
                  </p>
                  <div className="reply-box">
                    <strong>使用者B：</strong>
                    <p className="mt-2 mb-2">
                      我家也是，準備給牠吃溫補食物看看。
                    </p>
                  </div>
                  <form className="mt-2 reply-box">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="回覆這則留言..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary replay-btn mt-1"
                    >
                      送出
                    </button>
                  </form>
                </div>
              </div>

              <div className="card card-replay mt-3 p-1">
                <div className="card-body">
                  <strong>使用者C：</strong>
                  <p className="mb-2 mt-2">可以推薦哪些補品嗎？</p>
                  <form className="mt-2 reply-box">
                    <div className="mb-2">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="回覆這則留言..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="btn btn-sm btn-primary replay-btn mt-1"
                    >
                      送出
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="comment-footer">
        <form className="d-flex gap-2">
          <textarea
            className="form-control"
            placeholder=" 留下您的想法 🐶 ..."
          ></textarea>
          <button type="submit" className="btn btn-primary replay-btn">
            送出
          </button>
        </form>
      </div>
    </main>
  )
}

export default ArticlePage
