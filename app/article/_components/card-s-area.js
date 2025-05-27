import React from 'react'
import SmallArticleCard from './card-s.js'

const CardArea = ({ articles }) => {
  return (
    <div className="row card-area d-flex">
      {articles && articles.length > 1
        ? articles
            .slice(1, 13)
            .map((article) => (
              <SmallArticleCard key={article.id} article={article} />
            ))
        : null}
    </div>
  )
}

export default CardArea

// import React, { useEffect, useState } from 'react'
// import SmallArticleCard from './card-s.js'
// import CardBig from './card-1.js'

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
//           const allArticles = data.result

//           // 依收藏數由高到低排序
//           const sortedByFavorite = allArticles.sort(
//             (a, b) => (b.favorite_count || 0) - (a.favorite_count || 0)
//           )

//           setArticles(sortedByFavorite)
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
//       {/* 剩下的 11 篇用小卡片 */}
//       {articles.slice(1, 13).map((article) => (
//         <SmallArticleCard key={article.id} article={article} />
//       ))}
//     </div>
//   )
// }

// export default CardArea
