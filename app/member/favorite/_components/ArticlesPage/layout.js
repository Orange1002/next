'use client'

import SmallArticleCard from '../../../../article/_components/card-s'
import React from 'react'

export default function ArticlesPage({ data = [] }) {
  return (
    <>
      {data.map((article, index) => {
        return (
          <SmallArticleCard
            key={article.id ?? `article-${index}`}
            article={article}
          />
        )
      })}
    </>
  )
}
