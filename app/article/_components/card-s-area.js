'use client'
import React, { useEffect, useState } from 'react'
import SmallArticleCard from './card-s.js'

const CardArea = () => {
  const [articles, setArticles] = useState([])

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch(
          'http://localhost:3005/api/article/article-detail'
        )
        const data = await res.json()
        if (data.success) {
          // 依 created_date 由新到舊排序
          const sortedArticles = data.result.sort(
            (a, b) => new Date(b.created_date) - new Date(a.created_date)
          )
          setArticles(sortedArticles)
        } else {
          console.error('文章載入失敗:', data.message)
        }
      } catch (err) {
        console.error('載入文章錯誤:', err)
      }
    }

    fetchArticles()
  }, [])

  return (
    <div className="row card-area d-flex">
      {articles.slice(0, 12).map((article) => (
        <SmallArticleCard key={article.id} article={article} />
      ))}
    </div>
  )
}

export default CardArea

// 'use client'
// import React, { useEffect, useState } from 'react'
// import SmallArticleCard from './card-s.js'

// const CardArea = () => {
//   const [articles, setArticles] = useState([])

//   useEffect(() => {
//     const fetchArticles = async () => {
//       try {
//         const res = await fetch(
//           'http://localhost:3005/api/article/article-detail'
//         )
//         const data = await res.json()
//         if (data.success) {
//           setArticles(data.result)
//         } else {
//           console.error('文章載入失敗:', data.message)
//         }
//       } catch (err) {
//         console.error('載入文章錯誤:', err)
//       }
//     }

//     fetchArticles()
//   }, [])

//   return (
//     <div className="row card-area d-flex">
//       {articles.slice(0, 12).map((article) => (
//         <SmallArticleCard key={article.id} article={article} />
//       ))}
//     </div>
//   )
// }

// export default CardArea
