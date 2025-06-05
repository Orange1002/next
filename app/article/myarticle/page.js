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
import CardArea from '../_components/card-s-area.js'
import '../_style/article.scss'
import './_style/list.scss'
import { useAuth } from '../../../hooks/use-auth.js' // 請務必確認此路徑與您的 AuthContext 實際路徑相符

const PAGE_SIZE = 6
const images = [
  '/article_img/IMG_8676-scaled-1.jpg',
  '/article_img/main_img_202011.jpg',
]

function ArticleHeaderPhoto() {
  const currentIndex = useHeaderPhoto(images.length)
  // 1. 引入 useAuth 鉤子，獲取會員資訊和載入狀態
  const { member, isAuth, loading: authLoading } = useAuth()

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true) // 控制文章列表的載入狀態
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')

  const breadcrumbItems = [
    { name: '首頁', href: '/' },
    { name: '文章', href: '/article' },
    { name: '文章列表', href: '/article/list' },
  ]

  // 抓文章函式
  // 2. fetchArticles 函式現在直接接收 memberId 作為參數
  const fetchArticles = (searchKeyword, selectedCategory, currentMemberId) => {
    setLoading(true) // 開始抓取前設為載入中
    setError(null) // 清除之前的錯誤

    const params = new URLSearchParams()
    if (searchKeyword) params.append('keyword', searchKeyword)

    if (selectedCategory === '我的文章') {
      // 如果選擇的是「我的文章」，且有登入會員 ID，則傳遞 member_id
      if (currentMemberId && isAuth) { // 確保有 ID 且已登入
        params.append('member_id', currentMemberId)
      } else {
        // 如果選擇「我的文章」但未登入，則不顯示任何文章
        setArticles([])
        setLoading(false)
        return // 提前結束，不發送請求
      }
    } else if (selectedCategory) {
      // 否則，如果選擇了其他類別，則傳遞 category_name
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
          setCurrentPage(1) // 重新查詢後回到第一頁
        } else {
          // 如果後端返回 success: true 但 result 為空陣列，也是正常情況
          setArticles([]) 
          // 只有當 success 為 false 或有明確錯誤訊息時才拋出錯誤
          if (!data.success && data.message) {
            throw new Error(data.message);
          }
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setArticles([]) // 出錯時清空文章列表
        setLoading(false)
      })
  }

  // 3. 使用 useEffect 監聽 category, keyword 和 member.id 的變化
  // 確保 authLoading 狀態完成後才執行 fetchArticles
  useEffect(() => {
    if (!authLoading) { // 只有 AuthContext 的載入狀態完成後才觸發
      fetchArticles(keyword, category, member.id)
    }
  }, [keyword, category, member.id, authLoading]) // 依賴項包含 member.id 和 authLoading

  // 4. handleCategorySelect 函式只負責更新 category 狀態
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory)
    setKeyword('') // 選分類時清除搜尋關鍵字
    // 由於 useEffect 會監聽 category 變化，這裡不需要手動呼叫 fetchArticles
    const el = document.getElementsByClassName('stophere')[0]
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1) // 搜尋時回到第一頁
    // 由於 useEffect 會監聽 keyword 和 category 變化，這裡不需要手動呼叫 fetchArticles
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

  // 5. 顯示載入狀態時，也要考慮 AuthContext 的載入狀態
  if (loading || authLoading) return <p className="text-center mt-5">讀取文章列表中...</p>
  if (error)
    return <p className="text-center mt-5 text-danger">錯誤：{error}</p>

  return (
    <>
      {/* 電腦版大圖 */}
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

      {/* 電腦版內容 */}
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
            {/* 將 isAuth 傳遞給 Articlelist，以便它根據登入狀態顯示「我的文章」選項 */}
            <Articlelist onSelectCategory={handleCategorySelect} isAuth={isAuth} />
          </div>
          <div className="col-10 stophere">
            {/* 將 isAuth 傳遞給 ButtonGroup */}
            <ButtonGroup onCategorySelect={handleCategorySelect} isAuth={isAuth} />
            {currentArticles.length > 0 ? (
              currentArticles.map((article) => (
                <Card2 key={article.id} article={article} />
              ))
            ) : (
              // 如果沒有文章，顯示提示訊息
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

      {/* 手機版 */}
      <div className="container d-block d-xl-none main-mob mobile">
        <div className="col-12">
          <ButtonGroup onCategorySelect={handleCategorySelect} isAuth={isAuth} />
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

// import React, { useEffect, useState } from 'react'
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

// const PAGE_SIZE = 6
// const images = [
//   '/article_img/IMG_8676-scaled-1.jpg',
//   '/article_img/main_img_202011.jpg',
// ]

// function ArticleHeaderPhoto() {
//   const currentIndex = useHeaderPhoto(images.length)
//   const [articles, setArticles] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)
//   const [keyword, setKeyword] = useState('')
//   const [category, setCategory] = useState('')
//   // *** 新增: 假設的會員 ID ***
//   // 在實際應用中，這會是從登入狀態或 context 獲取
//   const [memberId, setMemberId] = useState(1) // 假設會員 ID 為 1

//   const breadcrumbItems = [
//     { name: '首頁', href: '/' },
//     { name: '文章', href: '/article' },
//     { name: '文章列表', href: '/article/list' },
//   ]

//   useEffect(() => {
//     fetchArticles()
//   }, [])

//   // *** 修改: fetchArticles 函式，新增 memberId 參數 ***
//   const fetchArticles = (
//     searchKeyword = '',
//     selectedCategory = '',
//     memberId = null
//   ) => {
//     setLoading(true)
//     const params = new URLSearchParams()
//     if (searchKeyword) params.append('keyword', searchKeyword)
//     // 如果 category 是 '我的文章'，則不傳遞 category_name，而是傳遞 member_id
//     if (selectedCategory && selectedCategory !== '我的文章') {
//       params.append('category_name', selectedCategory)
//     }
//     // 如果有 memberId 並且是查詢我的文章，則傳遞 member_id
//     if (memberId) {
//       params.append('member_id', memberId)
//     }

//     fetch(
//       `http://localhost:3005/api/article/article-detail?${params.toString()}`
//     )
//       .then((res) => {
//         if (!res.ok) throw new Error('抓取文章列表失敗')
//         return res.json()
//       })
//       .then((data) => {
//         if (data.success && data.result) {
//           setArticles(data.result)
//           setCurrentPage(1)
//         } else {
//           throw new Error(data.message || '未知錯誤')
//         }
//         setLoading(false)
//       })
//       .catch((err) => {
//         setError(err.message)
//         setLoading(false)
//       })
//   }

//   // *** 修改: handleCategorySelect 函式 ***
//   const handleCategorySelect = (selectedCategory) => {
//     setCategory(selectedCategory)
//     setKeyword('')
//     // 如果選擇的是「我的文章」，則傳遞 memberId
//     if (selectedCategory === '我的文章') {
//       fetchArticles('', '', memberId) // 傳遞 memberId
//     } else {
//       fetchArticles('', selectedCategory) // 正常傳遞類別
//     }

//     const el = document.getElementsByClassName('stophere')[0]
//     if (el) el.scrollIntoView({ behavior: 'smooth' })
//   }

//   const handleSearch = (e) => {
//     e.preventDefault()
//     // 在這裡處理搜尋時，也要考慮是否正在篩選「我的文章」
//     // 如果 category 是「我的文章」，則搜索也應該在該會員的文章中進行
//     if (category === '我的文章') {
//       fetchArticles(keyword, '', memberId)
//     } else {
//       fetchArticles(keyword, category)
//     }
//   }

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

//   if (loading) return <p className="text-center mt-5">讀取文章列表中...</p>
//   if (error)
//     return <p className="text-center mt-5 text-danger">錯誤：{error}</p>

//   return (
//     <>
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

//       <div className="container desktop">
//         <div className="row">
//           <div className="col-6">
//             <Breadcrumb items={breadcrumbItems} />
//           </div>
//           <div className="col-6 d-flex justify-content-end">
//             <form
//               className="d-flex card-search ms-auto gap-2 mt-5"
//               onSubmit={handleSearch}
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
//             </form>
//           </div>
//         </div>

//         <div className="mt-5 row mb-footer-gap">
//           <div className="col-2">
//             {/* 將 onSelectCategory 傳遞下去 */}
//             <Articlelist onSelectCategory={handleCategorySelect} />
//           </div>
//           <div className="col-10 stophere">
//             {/* 您可能也需要修改 ButtonGroup 讓它可以傳遞 memberId */}
//             <ButtonGroup onCategorySelect={handleCategorySelect} />
//             {currentArticles.map((article) => (
//               <Card2 key={article.id} article={article} />
//             ))}
//             <ChangePage
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </div>

//         <FloatingActionButton />
//       </div>
//       {/* 手機板 */}
//       <div className="container d-block d-xl-none main-mob mobile">
//         <div className="col-12">
//           <ButtonGroup onCategorySelect={handleCategorySelect} />
//         </div>
//         <div className="row d-flex justify-content-center">
//           <div className="col-12 d-flex justify-content-center">
//             <CardArea articles={currentArticles} />
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

