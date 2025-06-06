import { Card, Button, Collapse, Row, Col } from 'react-bootstrap'
import { FaChevronCircleRight } from 'react-icons/fa'
import { AiOutlineHeart } from 'react-icons/ai'
import Cardbig from '../article/_components/card-1.js'

import React, { useState, useEffect } from 'react'
import Cardarea from '../article/_components/card-s-area.js'
import Cards from '../article/_components/card-s.js'
// import { Link } from 'react-router-dom'
import Link from 'next/link.js'
// import Articlelist from '../article/_components/aricleList.js'
/////
const articleData = [
  {
    image: '/images/article1.png',
    text: '從手作料理開始，兼顧毛孩的健康與美味！',
    likes: 137,
  },
]

const collapses = [
  '文章列表',
  '熱門文章',
  '最新活動',
  '推薦知識影音',
  '收藏文章',
  '寵物問答',
]

const ArticleCard = ({ image, text, likes }) => (
  <Card className="card-s mb-3 position-relative">
    <Card.Img variant="top" src={image} className="object-fit-cover" />
    <Card.Body className="d-flex align-items-center p-4">
      <Button
        variant="link"
        className="read-more d-flex justify-content-center align-items-center p-0"
      >
        <FaChevronCircleRight />
      </Button>
      <p className="card-text card-s-p ps-3 mb-0">{text}</p>
      <div className="position-absolute bottom-0 end-0 p-3 d-flex align-items-center gap-1">
        <span className="text-muted regular">{likes}</span>
        <AiOutlineHeart />
      </div>
    </Card.Body>
  </Card>
)

export default function MyArticleCard() {
  const [openIndex, setOpenIndex] = useState(null)

  ////////////
  // const currentIndex = useHeaderPhoto(images.length)

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  // 新增狀態來控制動畫的觸發
  const [animateIn, setAnimateIn] = useState(false)

  const breadcrumbItems = [
    { name: '首頁', href: '/' },
    { name: '文章', href: '/article' },
  ]

  // 載入全部文章函式
  const loadAllArticles = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        'http://localhost:3005/api/article/article-detail'
      )
      const data = await res.json()
      if (data.success) {
        // 按收藏數排序（降冪）
        const sorted = data.result.sort(
          (a, b) => (b.favorite_count || 0) - (a.favorite_count || 0)
        )
        setArticles(sorted)
      } else {
        setError('文章載入失敗')
      }
    } catch (err) {
      setError('載入文章錯誤')
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = async (keyword) => {
    if (!keyword) {
      loadAllArticles()
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(
        `http://localhost:3005/api/article/article-detail?keyword=${encodeURIComponent(keyword)}`
      )
      if (!res.ok) throw new Error('API 請求失敗')
      const data = await res.json()
      if (!data.success) throw new Error('API 回傳失敗')

      setArticles(data.result)
    } catch (err) {
      setError(err.message)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  // 當組件掛載時，設置 animateIn 為 true，觸發動畫
  useEffect(() => {
    setAnimateIn(true)
    loadAllArticles()
  }, [])

  /////////////
  return (
    <section>
      {/* 小螢幕版文章卡片 */}
      <div className="d-block d-lg-none mt-5 mb-5 container">
        <div className="article-title d-flex align-items-center justify-content-center">
          最新文章
        </div>
        {articles && articles.length > 1
          ? articles
              .slice(0, 1)
              .map((article) => <Cards key={article.id} article={article} />)
          : null}
      </div>

      {/* 桌面版列表 + 精選文章 */}
      <div className="container d-none d-lg-block  py-5 justify-content-center w-100">
        <div className="product-title d-flex align-items-center">最新文章</div>
        {/* 精選文章與小卡片 */}
        <div className="d-block w-100">
          <div className="d-flex justify-content-center">
            {articles.length > 0 && <Cardbig article={articles[0]} />}
          </div>

          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2">
            {articles && articles.length > 1
              ? articles
                  .slice(0, 4)
                  .map((article) => (
                    <Cards key={article.id} article={article} />
                  ))
              : null}
          </div>
        </div>
      </div>

      {/* 小螢幕查看更多按鈕 */}
      <div className="d-flex justify-content-center mt-5">
        <Link href="/article" className="btn product-btn">
          查看更多
        </Link>
      </div>
    </section>
  )
}
