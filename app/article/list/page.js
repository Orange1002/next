'use client'

import React, { useEffect, useState } from 'react'
import useHeaderPhoto from '../_components/headerPhoto.js'
import Breadcrumb from '../_components/breadCrumb.js'
import Articlelist from '../_components/aricleList.js'
import Card2 from './_components/card-2.js'
import ButtonGroup from './_components/buttonGroup.js'
import FloatingActionButton from './_components/floatingActionButton.js'
import ChangePage from './_components/changePage.js'
import Image from 'next/image.js'
import '../_style/article.scss'
import './_style/list.scss'

const PAGE_SIZE = 6

const images = [
  '/article_img/d1e21f1a-4730-472b-8531-51b3c7b7890a.jpg',
  '/article_img/istockphoto-1300658241-612x612.jpg',
]

function ArticleHeaderPhoto() {
  const currentIndex = useHeaderPhoto(images.length)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const breadcrumbItems = [
    { name: '首頁', href: '/' },
    { name: '文章', href: '/article' },
    { name: '文章列表', href: '/article/list' },
  ]
  // 初始載入所有文章
  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = (searchKeyword = '', selectedCategory = '') => {
    setLoading(true)
    // 使用 URLSearchParams 組合查詢字串，避免錯誤
    const params = new URLSearchParams()
    if (searchKeyword) {
      params.append('keyword', searchKeyword)
    }
    if (selectedCategory) {
      params.append('category_name', selectedCategory)
    }

    const url = `http://localhost:3005/api/article/article-detail?${params.toString()}`

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('抓取文章列表失敗')
        }
        return res.json()
      })
      .then((data) => {
        if (data.success && data.result) {
          setArticles(data.result)
          setCurrentPage(1) // 搜尋後回第一頁
        } else {
          throw new Error(data.message || '未知錯誤')
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory)
    fetchArticles(keyword, selectedCategory)
    const el = document.getElementsByClassName('stophere')[0]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    fetchArticles(keyword, category)
  }

  // 總頁數
  const totalPages = Math.ceil(articles.length / PAGE_SIZE)

  // 當前頁面文章切片
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const currentArticles = articles.slice(startIndex, startIndex + PAGE_SIZE)

  // 換頁事件
  const handlePageChange = (page) => {
    if (page < 1) page = 1
    else if (page > totalPages) page = totalPages
    setCurrentPage(page)
    const el = document.getElementsByClassName('stophere')[0]
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  if (loading) {
    return <p className="text-center mt-5">讀取文章列表中...</p>
  }

  if (error) {
    return <p className="text-center mt-5 text-danger">錯誤：{error}</p>
  }

  return (
    <>
      <div className="container-fluid desktop">
        <div className="headerphoto d-none d-sm-block">
          {images.map((src, index) => (
            <Image
              width={200}
              height={200}
              key={index}
              src={src}
              alt={`header-img-${index + 1}`}
              className={`w-100 ${index === currentIndex ? 'active' : ''}`}
            />
          ))}
        </div>
      </div>
      <div className="container desktop">
        <div className="row">
          <div className="col-6">
            <Breadcrumb items={breadcrumbItems}/>
          </div>

          <div className="col-6 d-flex justify-content-end">
            <form
              className="d-flex card-search ms-auto gap-2 mt-5"
              role="search"
              onSubmit={handleSearch}
            >
              <div className="input-group">
                <input
                  className="form-control rounded-pill"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                />
                <button
                  className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
                  type="submit"
                >
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="mt-5 row mb-footer-gap">
          <div className="col-2">
            <Articlelist />
          </div>
          <div className="col-10 stophere">
            <ButtonGroup onCategorySelect={handleCategorySelect} />
            {/* 顯示目前頁面的文章 */}
            {currentArticles.map((article) => (
              <Card2 key={article.id} article={article} />
            ))}
            {/* 分頁元件 */}
            <ChangePage
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
        <FloatingActionButton />
      </div>
    </>
  )
}

export default ArticleHeaderPhoto
