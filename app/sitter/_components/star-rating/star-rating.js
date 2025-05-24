'use client'

import React, { useState, useEffect } from 'react'
import styles from './star-rating.module.css'

export default function StarRating({
  value = 0,
  max = 5,
  onChange = () => {},
  fillColor = 'gold',
  emptyColor = 'gray',
  icon = <>&#9733;</>, // 預設為星星 ★
  readOnly = false,
}) {
  const [rating, setRating] = useState(value)
  const [hoverRating, setHoverRating] = useState(0)

  useEffect(() => {
    setRating(value)
  }, [value])

  return (
    <div className={styles.starContainer}>
      {Array(max)
        .fill(1)
        .map((_, i) => {
          const score = i + 1

          return (
            <button
              key={i}
              className={styles.starBtn}
              onClick={() => {
                if (!readOnly) {
                  setRating(score)
                  onChange(score)
                }
              }}
              onMouseEnter={() => !readOnly && setHoverRating(score)}
              onMouseLeave={() => !readOnly && setHoverRating(0)}
              style={{
                cursor: readOnly ? 'default' : 'pointer',
                pointerEvents: readOnly ? 'none' : 'auto', // 完全停用互動
              }}
            >
              <span
                className={
                  score <= (hoverRating || rating) ? styles.on : styles.off
                }
                style={{
                  '--fill-color': fillColor,
                  '--empty-color': emptyColor,
                }}
              >
                {icon}
              </span>
            </button>
          )
        })}
    </div>
  )
}
