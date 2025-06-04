
import React from 'react'
import SmallArticleCard from './card-s.js'

const CardArea = ({ articles }) => {
  return (
    <div className="row card-area d-flex justify-content-center">
      {articles && articles.length > 1
        ? articles
            .slice(0, 12)
            .map((article) => (
              <SmallArticleCard key={article.id} article={article} />
            ))
        : null}
    </div>
  )
}

export default CardArea
