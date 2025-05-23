'use client'

import React, { useEffect, useState } from 'react'
import useHeaderPhoto from '../_components/headerPhoto.js'
import Breadcrumb from '../_components/breadCrumb.js'
import Articlelist from '../_components/aricleList.js'
import MyArticleCard from './_components/myArticleCard.js'
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

function MyArticlesPage() {
  const currentIndex = useHeaderPhoto(images.length)

  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetch('http://localhost:3005/api/article/article-detail/my-articles', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error('抓取我的文章失敗')
        }
        return res.json()
      })
      .then((data) => {
        if (data.success && data.result) {
          setArticles(data.result)
        } else {
          throw new Error(data.message || '未知錯誤')
        }
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const totalPages = Math.ceil(articles.length / PAGE_SIZE)
  const startIndex = (currentPage - 1) * PAGE_SIZE
  const currentArticles = articles.slice(startIndex, startIndex + PAGE_SIZE)

  const handlePageChange = (page) => {
    if (page < 1) page = 1
    else if (page > totalPages) page = totalPages
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <p className="text-center mt-5">讀取我的文章中...</p>
  if (error)
    return <p className="text-center mt-5 text-danger">錯誤：{error}</p>
  if (articles.length === 0)
    return <p className="text-center mt-5">你還沒有發佈任何文章。</p>

  return (
    <>
      {/* 輪播大圖區 */}
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

      {/* 內容區容器 */}
      <div className="container desktop mt-4">
        <div className="row">
          <div className="col-6">
            <Breadcrumb />
          </div>
          <div className="col-6 d-flex justify-content-end">
            <form
              className="d-flex card-search ms-auto gap-2 mt-5"
              role="search"
            >
              <div className="input-group">
                <input
                  className="form-control rounded-pill"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
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

        <div className="mt-5 row">
          <div className="col-2">
            <Articlelist />
          </div>
          <div className="col-10">
            <ButtonGroup />

            {/* 文章列表 */}
            {currentArticles.map((article) => (
              <MyArticleCard key={article.id} article={article} />
            ))}

            {/* 分頁 */}
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

export default MyArticlesPage

// 'use client'

// import React, { useEffect, useState } from 'react'
// import useHeaderPhoto from '../_components/headerPhoto.js'
// import Breadcrumb from '../_components/breadCrumb.js'
// import Articlelist from '../_components/aricleList.js'
// import Card2 from './_components/myArticleCard.js'
// import ButtonGroup from './_components/buttonGroup.js'
// import FloatingActionButton from './_components/floatingActionButton.js'
// import ChangePage from './_components/changePage.js'
// import Image from 'next/image.js'
// import '../_style/article.scss'
// import './_style/list.scss'

// const PAGE_SIZE = 6

// const images = [
//   '/article_img/d1e21f1a-4730-472b-8531-51b3c7b7890a.jpg',
//   '/article_img/istockphoto-1300658241-612x612.jpg',
// ]

// function ArticleHeaderPhoto() {
//   const currentIndex = useHeaderPhoto(images.length)
//   const [articles, setArticles] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [currentPage, setCurrentPage] = useState(1)

//   useEffect(() => {
//     fetch('http://localhost:3005/api/article/article-detail')
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error('抓取文章列表失敗')
//         }
//         return res.json()
//       })
//       .then((data) => {
//         if (data.success && data.result) {
//           setArticles(data.result)
//         } else {
//           throw new Error(data.message || '未知錯誤')
//         }
//         setLoading(false)
//       })
//       .catch((err) => {
//         setError(err.message)
//         setLoading(false)
//       })
//   }, [])

//   // 總頁數
//   const totalPages = Math.ceil(articles.length / PAGE_SIZE)

//   // 當前頁面文章切片
//   const startIndex = (currentPage - 1) * PAGE_SIZE
//   const currentArticles = articles.slice(startIndex, startIndex + PAGE_SIZE)

//   // 換頁事件
//   const handlePageChange = (page) => {
//     if (page < 1) page = 1
//     else if (page > totalPages) page = totalPages
//     setCurrentPage(page)
//     window.scrollTo({ top: 900, behavior: 'smooth' })
//   }

//   if (loading) {
//     return <p className="text-center mt-5">讀取文章列表中...</p>
//   }

//   if (error) {
//     return <p className="text-center mt-5 text-danger">錯誤：{error}</p>
//   }

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
//             <Breadcrumb />
//           </div>

//           <div className="col-6 d-flex justify-content-end">
//             <form
//               className="d-flex card-search ms-auto gap-2 mt-5"
//               role="search"
//             >
//               <div className="input-group">
//                 <input
//                   className="form-control rounded-pill"
//                   type="search"
//                   placeholder="Search"
//                   aria-label="Search"
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
//         <div className="mt-5 row">
//           <div className="col-2">
//             <Articlelist />
//           </div>
//           <div className="col-10">
//             <ButtonGroup />
//             {/* 只顯示當前頁文章 */}
//             {currentArticles.map((article) => (
//               <Card2 key={article.id} article={article} />
//             ))}
//             {/* 分頁元件，傳入控制參數與事件 */}
//             <ChangePage
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </div>
//         <FloatingActionButton />
//       </div>
//     </>
//   )
// }

// export default ArticleHeaderPhoto
