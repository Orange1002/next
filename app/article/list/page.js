
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
  '/article_img/IMG_8676-scaled-1.jpg',
  '/article_img/main_img_202011.jpg',
]

function ArticleHeaderPhoto() {
  const currentIndex = useHeaderPhoto(images.length)
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  // *** 新增: 假設的會員 ID ***
  // 在實際應用中，這會是從登入狀態或 context 獲取
  const [memberId, setMemberId] = useState(1) // 假設會員 ID 為 1

  const breadcrumbItems = [
    { name: '首頁', href: '/' },
    { name: '文章', href: '/article' },
    { name: '文章列表', href: '/article/list' },
  ]

  useEffect(() => {
    fetchArticles()
  }, [])

  // *** 修改: fetchArticles 函式，新增 memberId 參數 ***
  const fetchArticles = (
    searchKeyword = '',
    selectedCategory = '',
    memberId = null
  ) => {
    setLoading(true)
    const params = new URLSearchParams()
    if (searchKeyword) params.append('keyword', searchKeyword)
    // 如果 category 是 '我的文章'，則不傳遞 category_name，而是傳遞 member_id
    if (selectedCategory && selectedCategory !== '我的文章') {
      params.append('category_name', selectedCategory)
    }
    // 如果有 memberId 並且是查詢我的文章，則傳遞 member_id
    if (memberId) {
      params.append('member_id', memberId)
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
          throw new Error(data.message || '未知錯誤')
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  // *** 修改: handleCategorySelect 函式 ***
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory)
    setKeyword('')
    // 如果選擇的是「我的文章」，則傳遞 memberId
    if (selectedCategory === '我的文章') {
      fetchArticles('', '', memberId) // 傳遞 memberId
    } else {
      fetchArticles('', selectedCategory) // 正常傳遞類別
    }

    const el = document.getElementsByClassName('stophere')[0]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // 在這裡處理搜尋時，也要考慮是否正在篩選「我的文章」
    // 如果 category 是「我的文章」，則搜索也應該在該會員的文章中進行
    if (category === '我的文章') {
      fetchArticles(keyword, '', memberId)
    } else {
      fetchArticles(keyword, category)
    }
  }

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

  if (loading) return <p className="text-center mt-5">讀取文章列表中...</p>
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
            >
              <div className="input-group">
                <input
                  className="form-control rounded-pill"
                  type="search"
                  placeholder="Search"
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
            {/* 將 onSelectCategory 傳遞下去 */}
            <Articlelist onSelectCategory={handleCategorySelect} />
          </div>
          <div className="col-10 stophere">
            {/* 您可能也需要修改 ButtonGroup 讓它可以傳遞 memberId */}
            <ButtonGroup onCategorySelect={handleCategorySelect} />
            {currentArticles.map((article) => (
              <Card2 key={article.id} article={article} />
            ))}
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
