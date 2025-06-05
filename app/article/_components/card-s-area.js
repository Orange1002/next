import React from 'react'
import SmallArticleCard from './card-s.js'

const CardArea = ({ articles }) => {
  return (
    <div className="row row-cols-1 row-cols-sm-2 row-col-md-3 row-col-lg-4 g-4">
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
