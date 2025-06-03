'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import styles from './favorite.module.scss'
import SectionTitle from '../_components/SectionTitle/layout'
import Pagination from '../_components/Pagination/layout'
import ProductsPage from './_components/ProductsPage/layout'
import ArticlesPage from './_components/ArticlesPage/layout'
import { useAuth } from '../../../hooks/use-auth'

import MobileMemberMenu from '../_components/mobileLinks/layout'

export default function FavoriteSection() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { member } = useAuth()
  const memberId = member?.id

  const type = searchParams.get('type') || 'products'
  const [activeTab, setActiveTab] = useState(type)

  const [allData, setAllData] = useState([]) // 所有收藏資料
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  useEffect(() => {
    setActiveTab(type)
    setCurrentPage(1) // tab 切換時回到第一頁
  }, [type])

  useEffect(() => {
    if (!memberId) return // 沒登入不撈

    async function fetchFavorites() {
      try {
        let url = ''
        if (activeTab === 'products') {
          url = `http://localhost:3005/api/product/favorite`
        } else if (activeTab === 'articles') {
          url = `http://localhost:3005/api/article/favorites/favartical`
        }

        const res = await fetch(url, {
          credentials: 'include',
        })
        const json = await res.json()
        if (res.ok) {
          setAllData(json.data || [])
        } else {
          setAllData([])
          console.error('抓取收藏失敗', json.message)
        }
      } catch (error) {
        setAllData([])
        console.error(error)
      }
    }

    fetchFavorites()
  }, [activeTab, memberId])

  const totalPages = Math.max(1, Math.ceil(allData.length / itemsPerPage))
  const paginatedData = allData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handleTabClick = (tabType) => {
    router.push(`/member/favorite?type=${tabType}`)
  }

  return (
    <>
      <SectionTitle className="d-none">我的收藏</SectionTitle>
      <div className="d-flex flex-column justify-content-between h-100">
        <div className="d-flex flex-column">
          {/* Tabs */}
          <div className="d-flex justify-content-center gap-2">
            <button
              className={`${styles.tabBtn} ${activeTab === 'products' ? styles.active : ''} btn`}
              onClick={() => handleTabClick('products')}
            >
              狗狗用品收藏
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'articles' ? styles.active : ''} btn`}
              onClick={() => handleTabClick('articles')}
            >
              文章收藏
            </button>
          </div>

          {/* List */}
          {/* List */}

          {paginatedData.length === 0 ? (
            <div className="text-center w-100 py-5 text-muted">
              尚未收藏任何{activeTab === 'products' ? '狗狗用品' : '文章'}
            </div>
          ) : (
            <>
              {activeTab === 'products' && (
                <div className="row g-0 gap-4 mt-4">
                  <ProductsPage data={paginatedData} />
                </div>
              )}
              {activeTab === 'articles' && (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-2">
                  <ArticlesPage data={paginatedData} />
                </div>
              )}
            </>
          )}
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
      <MobileMemberMenu />
    </>
  )
}
