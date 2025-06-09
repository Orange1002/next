'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'
import useHeaderPhoto from '../_components/headerPhoto.js'
import Breadcrumb from '../_components/breadCrumb.js'
import Articlelist from '../_components/aricleList.js'
import Card2 from './_components/card-2.js'
import ButtonGroup from './_components/buttonGroup.js'
import FloatingActionButton from './_components/floatingActionButton.js'
import ChangePage from './_components/changePage.js'
import Image from 'next/image.js'
import CardArea from '../_components/card-s-area.js'
import '../_style/article.scss'
import './_style/list.scss'
import { useAuth } from '../../../hooks/use-auth.js'

const PAGE_SIZE = 6
const images = [
  '/article_img/IMG_8676-scaled-1.jpg',
  '/article_img/main_img_202011.jpg',
]

function ArticleHeaderPhoto() {
  const currentIndex = useHeaderPhoto(images.length)
  const { member, isAuth, loading: authLoading } = useAuth()

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')

  const debounceTimeoutRef = useRef(null)

  const breadcrumbItems = [
    { name: '首頁', href: '/' },
    { name: '文章', href: '/article' },
    { name: '文章列表', href: '/article/list' },
  ]

  const fetchArticles = useCallback(
    (searchKeyword, selectedCategory, currentMemberId) => {
      setLoading(true)
      setError(null)

      const params = new URLSearchParams()
      if (searchKeyword) params.append('keyword', searchKeyword)

      if (selectedCategory === '我的文章') {
        if (currentMemberId) {
          params.append('member_id', currentMemberId)
        } else {
          setArticles([])
          setLoading(false)
          return
        }
      } else if (selectedCategory) {
        params.append('category_name', selectedCategory)
      }

      fetch(
        `http://localhost:3005/api/article/article-detail?${params.toString()}`
      )
        .then((res) => {
          if (!res.ok) throw new Error('抓取文章列表失敗')
          return res.json()
        })
        .then((data) => {
          if (data.success && data.result) {
            setArticles(data.result)
            setCurrentPage(1)
          } else {
            setArticles([])
            throw new Error(data.message || '未知錯誤')
          }
          setLoading(false)
        })
        .catch((err) => {
          setError(err.message)
          setLoading(false)
        })
    },
    []
  )

  // 當 category 或 member.id 變化時自動抓資料，keyword 不自動抓資料，避免自動搜尋
  useEffect(() => {
    if (!authLoading) {
      fetchArticles('', category, member.id)
    }
  }, [category, member.id, authLoading, fetchArticles])

  // 分頁計算
  const totalPages = Math.ceil(articles.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const currentArticles = articles.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = (page) => {
    if (page < 1) page = 1
    else if (page > totalPages) page = totalPages
    setCurrentPage(page)

    const el = document.getElementsByClassName('stophere')[0]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // 選擇分類，只改狀態，讓 useEffect 抓資料
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory)
    setKeyword('')
    const el = document.getElementsByClassName('stophere')[0]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  // 按下搜尋才觸發真正搜尋
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchArticles(keyword, category, member.id)
  }

  if (loading || authLoading)
    return <p className="text-center mt-5">讀取文章列表中...</p>
  if (error)
    return <p className="text-center mt-5 text-danger">錯誤：{error}</p>

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
            <Breadcrumb items={breadcrumbItems} />
          </div>
          <div className="col-6 d-flex justify-content-end">
            <form
              className="d-flex card-search ms-auto gap-2 mt-5"
              onSubmit={handleSearch}
              autoComplete="off"
            >
              <div className="input-group position-relative">
                <input
                  className="form-control rounded-pill"
                  type="search"
                  placeholder="Search"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={(e) => {
                    // 按 Enter 不搜尋也不重整
                    if (e.key === 'Enter') e.preventDefault()
                  }}
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
            <Articlelist
              onSelectCategory={handleCategorySelect}
              isAuth={isAuth}
            />
          </div>
          <div className="col-10 stophere">
            <ButtonGroup
              onCategorySelect={handleCategorySelect}
              isAuth={isAuth}
            />
            {currentArticles.length > 0 ? (
              currentArticles.map((article) => (
                <Card2 key={article.id} article={article} />
              ))
            ) : (
              <p className="text-center mt-5">沒有找到相關的文章。</p>
            )}
            <ChangePage
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <FloatingActionButton />
      </div>

      <div className="container d-block d-xl-none main-mob mobile">
        <div className="col-12">
          <ButtonGroup
            onCategorySelect={handleCategorySelect}
            isAuth={isAuth}
          />
        </div>
        <div className="row d-flex justify-content-center">
          <div className="col-12 d-flex justify-content-center">
            {currentArticles.length > 0 ? (
              <CardArea articles={currentArticles} />
            ) : (
              <p className="text-center mt-5">沒有找到相關的文章。</p>
            )}
          </div>
        </div>
        <div className="col-12">
          <ChangePage
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <FloatingActionButton />
      </div>
    </>
  )
}

export default ArticleHeaderPhoto
