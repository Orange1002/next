'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
// import styles from './favorite.module.scss'
import SectionTitle from '../_components/SectionTitle/layout'
import Pagination from '../_components/Pagination/layout'
// import ProductFavoriteCard from './_components/ProductFavoriteCard'
// import SitterFavoriteCard from './_components/SitterFavoriteCard'
// import ArticleFavoriteCard from './_components/ArticleFavoriteCard'
import EventFavoriteCard from './_components/EventFavoriteCard/layout'

export default function FavoriteSection() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const type = searchParams.get('type') || 'products'
  const [activeTab, setActiveTab] = useState(type)

  useEffect(() => {
    setActiveTab(type)
  }, [type])

  const handleTabClick = (tabType) => {
    router.push(`/member/favorite?type=${tabType}`)
  }

  const testData = {
    products: [], // 商品收藏假資料
    sitters: [], // 保母收藏假資料
    articles: [], // 文章收藏假資料
    events: [], // 活動收藏假資料
  }

  const data = testData[activeTab] || []

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  const totalPages = Math.ceil(data.length / itemsPerPage)
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <>
      <SectionTitle>我的收藏</SectionTitle>
      <div className="d-flex flex-column justify-content-between h-100">
        {/* Tabs */}
        <div className="d-flex justify-content-center gap-2">
          <button
            className={`${styles.tabBtn} ${activeTab === 'products' ? styles.active : ''} btn`}
            onClick={() => handleTabClick('products')}
          >
            狗狗用品收藏
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'sitters' ? styles.active : ''} btn`}
            onClick={() => handleTabClick('sitters')}
          >
            狗狗保母收藏
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'articles' ? styles.active : ''} btn`}
            onClick={() => handleTabClick('articles')}
          >
            文章收藏
          </button>
          <button
            className={`${styles.tabBtn} ${activeTab === 'events' ? styles.active : ''} btn`}
            onClick={() => handleTabClick('events')}
          >
            活動收藏
          </button>
        </div>

        {/* List */}
        <div className="mt-3">
          {activeTab === 'products' &&
            paginatedData.map((item, index) => (
              <ProductFavoriteCard
                key={product.id}
                {...item}
                isFirst={index === 0}
              />
            ))}
          {activeTab === 'sitters' &&
            paginatedData.map((item, index) => (
              <SitterFavoriteCard
                key={sitter.id}
                {...item}
                isFirst={index === 0}
              />
            ))}
          {activeTab === 'articles' &&
            paginatedData.map((item, index) => (
              <ArticleFavoriteCard
                key={article.id}
                {...item}
                isFirst={index === 0}
              />
            ))}
          {activeTab === 'events' &&
            paginatedData.map((item, index) => (
              <EventFavoriteCard
                key={event.id}
                {...item}
                isFirst={index === 0}
              />
            ))}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </>
  )
}
