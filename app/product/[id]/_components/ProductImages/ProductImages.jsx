'use client'

import { useEffect, useState } from 'react'
import styles from './ProductImages.module.scss'

export default function ProductImages({ images = [] }) {
  // ✅ 直接使用資料庫中已含完整路徑（如 /uploads/product121-1.jpg）
  const imageUrls =
    images.length > 0
      ? images.map((img) =>
          typeof img === 'string' ? img : img.image
        )
      : ['/uploads/default.jpg'] // ✅ 預設圖也換到 uploads 下（你可改成實際預設路徑）

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
          src={`http://localhost:3005${imageUrls[currentIndex]}`} // ✅ 加上完整網址
          alt={`商品圖片 ${currentIndex + 1}`}
        />
      </div>
      <div className={styles.thumbnailList}>
        {imageUrls.map((imgUrl, index) => (
          <img
            key={index}
            className={`${styles.thumbnail} ${index === currentIndex ? styles.active : ''}`}
            src={`http://localhost:3005${imgUrl}`} // ✅ 每張圖片前面都加 host
            alt={`商品縮圖 ${index + 1}`}
            onClick={() => handleThumbnailClick(index)}
          />
        ))}
      </div>
    </div>
  )
}
