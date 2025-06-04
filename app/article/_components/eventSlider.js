'use client'

import { useState, useEffect } from 'react'
import { AiOutlineLeftCircle, AiOutlineRightCircle } from 'react-icons/ai'
import CardS from '../_components/card-s.js' // 確保這個路徑正確指向您的 SmallArticleCard 組件

const EventSlider = () => {
  const [articles, setArticles] = useState([])
  const [cardMove, setCardMove] = useState(0)
  const [cardsPerPage, setCardsPerPage] = useState(4) // 預設桌面版顯示4張卡片

  // 動態監聽視窗大小，更新 cardsPerPage 以適應不同螢幕
  useEffect(() => {
    function updateCardsPerPage() {
      const width = window.innerWidth
      if (width < 480) {
        setCardsPerPage(1) // 手機版
      } else if (width < 768) {
        setCardsPerPage(2) // 平板較小
      } else if (width < 1200) {
        setCardsPerPage(3) // 平板較大/小型桌面
      } else {
        setCardsPerPage(4) // 桌面版
      }
    }

    // 初始化時執行一次
    updateCardsPerPage()

    // 監聽視窗大小變化
    window.addEventListener('resize', updateCardsPerPage)

    // 清除監聽器
    return () => window.removeEventListener('resize', updateCardsPerPage)
  }, []) // 空依賴陣列表示只在組件掛載和卸載時執行

  // 抓取熱門文章
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          'http://localhost:3005/api/article/favorites/top-favorites'
        )

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()

        if (data.success) {
          // *** 關鍵修改：在設置文章前，將 favoriteCount 複製到 favorite_count ***
          const processedArticles = data.result.map(article => ({
            ...article, // 複製所有現有屬性
            favorite_count: article.favoriteCount || 0 // 將 favoriteCount 的值賦給 favorite_count
          }));
          setArticles(processedArticles); // 使用處理過的文章數據
        } else {
          console.error('API 返回失敗訊息:', data.message)
        }
      } catch (err) {
        console.error('載入熱門文章失敗:', err)
      }
    }

    fetchArticles()
  }, []) // 空依賴陣列表示只在組件掛載時執行一次

  // 自動輪播功能
  useEffect(() => {
    // 只有當文章數量大於每頁顯示數量時才啟動自動輪播
    if (articles.length > cardsPerPage) {
      const interval = setInterval(() => {
        setCardMove((prevMove) =>
          // 如果當前位置加上要移動的卡片數會超過總文章數，則回到第一張
          prevMove + cardsPerPage >= articles.length ? 0 : prevMove + cardsPerPage
        )
      }, 5000) // 每5秒輪播一次

      // 清除定時器
      return () => clearInterval(interval)
    }
  }, [articles, cardsPerPage]) // 當 articles 或 cardsPerPage 變化時重新設定定時器

  // 處理左箭頭點擊
  const handleLeftArrowClick = () => {
    setCardMove((prevMove) =>
      // 如果往左移動會小於0，則跳到最後一組卡片，確保不會出現空白
      prevMove - cardsPerPage < 0
        ? Math.max(articles.length - cardsPerPage, 0) // 確保至少是0，避免負數
        : prevMove - cardsPerPage
    )
  }

  // 處理右箭頭點擊
  const handleRightArrowClick = () => {
    setCardMove((prevMove) =>
      // 如果往右移動會超過總文章數，則回到第一張
      prevMove + cardsPerPage >= articles.length ? 0 : prevMove + cardsPerPage
    )
  }

  // 根據當前 cardMove 和 cardsPerPage 顯示卡片
  const showCards = () =>
    articles
      .slice(cardMove, cardMove + cardsPerPage) // 截取要顯示的文章
      .map((article) => <CardS key={article.id} article={article} />) // 渲染 CardS 組件

  return (
    <div className="row">
      {/* 標題區塊 */}
      <div className="category d-flex justify-content-between align-items-center mb-3">
        <div className="event-title d-flex align-items-center">熱門文章</div>
        {/* 右側的「更多」連結或其他功能，目前空的 */}
        <div className="d-flex align-items-center me-4 mb-5">
          {/* 您可以在這裡放置一個 Link 到文章列表頁 */}
          {/* <Link href="/article/list" className="d-flex align-items-center">
            更多 <AiOutlineRightCircle className="icon ms-1" />
          </Link> */}
        </div>
      </div>

      {/* 卡片輪播區塊 */}
      <div className="d-flex justify-content-center align-items-center gap-4 mt-4 mb-4">
        {/* 左箭頭 */}
        <AiOutlineLeftCircle
          className="arrow-left"
          size={32}
          onClick={handleLeftArrowClick}
          style={{ cursor: 'pointer', color: '#333' }}
        />

        {/* 卡片容器 */}
        <div className="d-flex cards-container gap-4">
          {articles.length > 0 ? (
            showCards() // 渲染文章卡片
          ) : (
            <p>載入中或沒有熱門文章...</p> // 載入或無文章時顯示訊息
          )}
        </div>

        {/* 右箭頭 */}
        <AiOutlineRightCircle
          className="arrow-right"
          size={32}
          onClick={handleRightArrowClick}
          style={{ cursor: 'pointer', color: '#333' }}
        />
      </div>
    </div>
  )
}

export default EventSlider
