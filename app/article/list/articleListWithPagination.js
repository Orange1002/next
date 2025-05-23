import React, { useState } from 'react'
import Card2 from './_components/card-2.js'
import ChangePage from './_components/changePage.js'

const PAGE_SIZE = 6

const ArticleListWithPagination = ({ articles }) => {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(articles.length / PAGE_SIZE)

  const startIndex = (currentPage - 1) * PAGE_SIZE
  const currentArticles = articles.slice(startIndex, startIndex + PAGE_SIZE)

  const goToPage = (page) => {
    if (page < 1) page = 1
    if (page > totalPages) page = totalPages
    setCurrentPage(page)
    // **不要呼叫 window.scrollTo 或更改 location.hash**
  }

  return (
    <div>
      <div className="article-list">
        {currentArticles.map((article) => (
          <Card2 key={article.id} article={article} />
        ))}
      </div>

      <ChangePage
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={goToPage}
      />
    </div>
  )
}

export default ArticleListWithPagination
