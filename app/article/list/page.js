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

// 'use client'

// import React, { useEffect, useState, useCallback, useRef } from 'react' // 引入 useCallback 和 useRef
// import useHeaderPhoto from '../_components/headerPhoto.js'
// import Breadcrumb from '../_components/breadCrumb.js'
// import Articlelist from '../_components/aricleList.js'
// import Card2 from './_components/card-2.js'
// import ButtonGroup from './_components/buttonGroup.js'
// import FloatingActionButton from './_components/floatingActionButton.js'
// import ChangePage from './_components/changePage.js'
// import Image from 'next/image.js'
// import CardArea from '../_components/card-s-area.js'
// import '../_style/article.scss'
// import './_style/list.scss'
// import { useAuth } from '../../../hooks/use-auth.js'

// const PAGE_SIZE = 6
// const images = [
//   '/article_img/IMG_8676-scaled-1.jpg',
//   '/article_img/main_img_202011.jpg',
// ]

// function ArticleHeaderPhoto() {
//   const currentIndex = useHeaderPhoto(images.length)
//   const { member, isAuth, loading: authLoading } = useAuth()

//   const [articles, setArticles] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)

//   const [currentPage, setCurrentPage] = useState(1)
//   const [keyword, setKeyword] = useState('')
//   const [category, setCategory] = useState('')

//   // 使用 useRef 來保存計時器，避免在每次渲染時重新建立
//   const debounceTimeoutRef = useRef(null)

//   const breadcrumbItems = [
//     { name: '首頁', href: '/' },
//     { name: '文章', href: '/article' },
//     { name: '文章列表', href: '/article/list' },
//   ]

//   // 將 fetchArticles 包裝在 useCallback 中，確保其在 re-render 時不會重新建立，
//   // 這樣它可以在 useEffect 的依賴列表中被安全使用。
//   const fetchArticles = useCallback(
//     (searchKeyword, selectedCategory, currentMemberId) => {
//       setLoading(true)
//       setError(null)

//       const params = new URLSearchParams()
//       if (searchKeyword) params.append('keyword', searchKeyword)

//       if (selectedCategory === '我的文章') {
//         if (currentMemberId) {
//           params.append('member_id', currentMemberId)
//         } else {
//           setArticles([])
//           setLoading(false)
//           return
//         }
//       } else if (selectedCategory) {
//         params.append('category_name', selectedCategory)
//       }

//       fetch(
//         `http://localhost:3005/api/article/article-detail?${params.toString()}`
//       )
//         .then((res) => {
//           if (!res.ok) throw new Error('抓取文章列表失敗')
//           return res.json()
//         })
//         .then((data) => {
//           if (data.success && data.result) {
//             setArticles(data.result)
//             setCurrentPage(1) // 搜尋或切換分類後回到第一頁
//           } else {
//             setArticles([])
//             throw new Error(data.message || '未知錯誤')
//           }
//           setLoading(false)
//         })
//         .catch((err) => {
//           setError(err.message)
//           setLoading(false)
//         })
//     },
//     [] // fetchArticles 自身不依賴任何外部狀態，所以依賴陣列為空
//   )

//   // 監聽 category, keyword, 以及會員 ID 的變化，自動抓取資料
//   // 使用 Debounce 來限制 fetchArticles 的觸發頻率
//   useEffect(() => {
//     // 清除前一個計時器，避免重複執行
//     if (debounceTimeoutRef.current) {
//       clearTimeout(debounceTimeoutRef.current)
//     }

//     if (!authLoading) {
//       // 設定新的計時器，延遲 300 毫秒後執行 fetchArticles
//       debounceTimeoutRef.current = setTimeout(() => {
//         fetchArticles(keyword, category, member.id)
//       }, 300) // 你可以調整這個延遲時間 (例如 300ms 或 500ms)
//     }

//     // 當組件卸載或依賴項改變時，清除計時器
//     return () => {
//       if (debounceTimeoutRef.current) {
//         clearTimeout(debounceTimeoutRef.current)
//       }
//     }
//   }, [keyword, category, member.id, authLoading, fetchArticles]) // fetchArticles 也要加入依賴，因為它是 useCallback 建立的

//   // 選擇分類，只改狀態，讓 useEffect 抓資料
//   const handleCategorySelect = (selectedCategory) => {
//     setCategory(selectedCategory)
//     setKeyword('') // 選分類清除搜尋字

//     // 捲動到 .stophere
//     const el = document.getElementsByClassName('stophere')[0]
//     if (el) el.scrollIntoView({ behavior: 'smooth' })
//   }

//   // 搜尋送出時改變 keyword 狀態，觸發 useEffect
//   const handleSearch = (e) => {
//     e.preventDefault() // 阻止表單的預設提交行為，避免頁面重新整理
//     // 這裡只是設定 keyword 狀態，實際的 fetch 會由 useEffect 搭配 debounce 處理
//     // current keyword is already updated by onChange, no need to set here
//     setCurrentPage(1) // 執行搜尋時，確保回到第一頁
//   }

//   // 分頁計算
//   const totalPages = Math.ceil(articles.length / PAGE_SIZE)
//   const startIndex = (currentPage - 1) * PAGE_SIZE
//   const currentArticles = articles.slice(startIndex, startIndex + PAGE_SIZE)

//   const handlePageChange = (page) => {
//     if (page < 1) page = 1
//     else if (page > totalPages) page = totalPages
//     setCurrentPage(page)

//     const el = document.getElementsByClassName('stophere')[0]
//     if (el) el.scrollIntoView({ behavior: 'smooth' })
//   }

//   // 在顯示讀取狀態前，也考慮 AuthContext 的載入狀態
//   if (loading || authLoading)
//     return <p className="text-center mt-5">讀取文章列表中...</p>
//   if (error)
//     return <p className="text-center mt-5 text-danger">錯誤：{error}</p>

//   return (
//     <>
//       {/* 電腦版大圖 */}
//       <div className="container-fluid desktop">
//         <div className="headerphoto d-none d-sm-block">
//           {images.map((src, index) => (
//             <Image
//               width={200}
//               height={200}
//               key={index}
//               src={src}
//               alt={`header-img-${index + 1}`}
//               className={`w-100 ${index === currentIndex ? 'active' : ''}`}
//             />
//           ))}
//         </div>
//       </div>

//       {/* 電腦版內容 */}
//       <div className="container desktop">
//         <div className="row">
//           <div className="col-6">
//             <Breadcrumb items={breadcrumbItems} />
//           </div>
//           <div className="col-6 d-flex justify-content-end">
//             {/*  <form
//               className="d-flex card-search ms-auto gap-2 mt-5"
//               onSubmit={handleSearch}
//               autoComplete="off" // <-- 加上這行，避免瀏覽器自動提交導致重整
//             >
//               <div className="input-group">
//                 <input
//                   className="form-control rounded-pill"
//                   type="search"
//                   placeholder="Search"
//                   value={keyword}
//                   onChange={(e) => setKeyword(e.target.value)}
//                 />
//                 <button
//                   className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
//                   type="submit"
//                 >
//                   <i className="bi bi-search"></i>
//                 </button>
//               </div>
//             </form>*/}
//             <form
//               className="d-flex card-search ms-auto gap-2 mt-5"
//               onSubmit={(e) => {
//                 e.preventDefault()
//                 setCurrentPage(1)
//               }}
//               autoComplete="off"
//             >
//               <div className="input-group position-relative">
//                 <input
//                   className="form-control rounded-pill"
//                   type="search"
//                   placeholder="Search"
//                   value={keyword}
//                   onChange={(e) => setKeyword(e.target.value)}
//                   onKeyDown={(e) => {
//                     if (e.key === 'Enter') {
//                       e.preventDefault()
//                       setCurrentPage(1)
//                     }
//                   }}
//                 />
//                 <button
//                   className="btn position-absolute top-50 end-0 translate-middle-y me-3 p-0 border-0 bg-transparent"
//                   type="submit"
//                 >
//                   <i className="bi bi-search"></i>
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>

//         <div className="mt-5 row mb-footer-gap">
//           <div className="col-2">
//             <Articlelist
//               onSelectCategory={handleCategorySelect}
//               isAuth={isAuth}
//             />
//           </div>
//           <div className="col-10 stophere">
//             <ButtonGroup
//               onCategorySelect={handleCategorySelect}
//               isAuth={isAuth}
//             />
//             {currentArticles.length > 0 ? (
//               currentArticles.map((article) => (
//                 <Card2 key={article.id} article={article} />
//               ))
//             ) : (
//               <p className="text-center mt-5">沒有找到相關的文章。</p>
//             )}
//             <ChangePage
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </div>

//         <FloatingActionButton />
//       </div>

//       {/* 手機版 */}
//       <div className="container d-block d-xl-none main-mob mobile">
//         <div className="col-12">
//           <ButtonGroup
//             onCategorySelect={handleCategorySelect}
//             isAuth={isAuth}
//           />
//         </div>
//         <div className="row d-flex justify-content-center">
//           <div className="col-12 d-flex justify-content-center">
//             {currentArticles.length > 0 ? (
//               <CardArea articles={currentArticles} />
//             ) : (
//               <p className="text-center mt-5">沒有找到相關的文章。</p>
//             )}
//           </div>
//         </div>
//         <div className="col-12">
//           <ChangePage
//             currentPage={currentPage}
//             totalPages={totalPages}
//             onPageChange={handlePageChange}
//           />
//         </div>
//         <FloatingActionButton />
//       </div>
//     </>
//   )
// }

// export default ArticleHeaderPhoto
