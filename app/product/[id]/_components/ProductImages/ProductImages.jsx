'use client'

import { useEffect, useState } from 'react'
import styles from './ProductImages.module.scss'

export default function ProductImages({ images = [] }) {
  // 自動處理圖片資料：從物件陣列中取出 image 屬性
  const imageUrls = images.length > 0
    ? images.map(img => typeof img === 'string' ? img : img.image)
    : ['/product-img/default.jpg']

  const [currentIndex, setCurrentIndex] = useState(0)
  const [fade, setFade] = useState(false)

  const handleThumbnailClick = (index) => {
    if (index !== currentIndex) {
      setFade(true)
      setTimeout(() => {
        setCurrentIndex(index)
        setFade(false)
      }, 200)
    }
  }

  useEffect(() => {
    const swiper = document.querySelector(`.${styles.thumbnailList}`)
    let isDown = false
    let startX
    let scrollLeft

    const startScroll = (e) => {
      isDown = true
      startX = e.pageX - swiper.offsetLeft
      scrollLeft = swiper.scrollLeft
    }

    const stopScroll = () => {
      isDown = false
    }

    const moveScroll = (e) => {
      if (!isDown) return
      e.preventDefault()
      const x = e.pageX - swiper.offsetLeft
      const walk = (x - startX) * 2
      swiper.scrollLeft = scrollLeft - walk
    }

    swiper.addEventListener('mousedown', startScroll)
    swiper.addEventListener('mouseleave', stopScroll)
    swiper.addEventListener('mouseup', stopScroll)
    swiper.addEventListener('mousemove', moveScroll)

    return () => {
      swiper.removeEventListener('mousedown', startScroll)
      swiper.removeEventListener('mouseleave', stopScroll)
      swiper.removeEventListener('mouseup', stopScroll)
      swiper.removeEventListener('mousemove', moveScroll)
    }
  }, [])

  return (
    <div className={styles.productImages}>
      <div className={styles.mainImgWrapper}>
        <img
          className={`${styles.mainImg} ${fade ? styles.fadeOut : styles.fadeIn}`}
          src={imageUrls[currentIndex]}
          alt={`商品圖片 ${currentIndex + 1}`}
        />
      </div>
      <div className={styles.thumbnailList}>
        {imageUrls.map((imgUrl, index) => (
          <img
            key={index}
            className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
            src={imgUrl}
            alt={`商品縮圖 ${index + 1}`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  )
}
